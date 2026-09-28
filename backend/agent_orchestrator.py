"""
ZeroTrace AI — Multi-Agent Security Orchestrator
Implements a pipeline of autonomous security agents that collaborate on
vulnerability findings to produce prioritised risks, attack chains,
and remediation patches.

Agents:
  1. Scanner Agent      — runs the static analyser
  2. Risk Analysis Agent — evaluates exploitability & business impact
  3. Prioritization Agent — scores, deduplicates, groups by severity
  4. Attack Chain Agent  — maps findings to exploitable paths (React Flow graph)
  5. Fix Agent           — generates git-diff style patches & explanations

Supports dual-mode:
  • Live AI   — uses OpenAI for deep contextual analysis
  • Offline   — rich rule-based cyber simulation engine
"""

from __future__ import annotations

import hashlib
import json
import os
import random
import time
import uuid
from typing import Any

from dotenv import load_dotenv

from scanner import scan_with_bandit

load_dotenv()

# ---------------------------------------------------------------------------
# Severity helpers
# ---------------------------------------------------------------------------

SEVERITY_ORDER = {"CRITICAL": 4, "HIGH": 3, "MEDIUM": 2, "LOW": 1, "INFO": 0}

def _sev_rank(s: str) -> int:
    return SEVERITY_ORDER.get(s.upper(), 0)


# ---------------------------------------------------------------------------
# Agent base — each agent logs its "thoughts" for the terminal stream
# ---------------------------------------------------------------------------

class AgentLog:
    def __init__(self):
        self.entries: list[dict[str, Any]] = []

    def think(self, agent: str, message: str) -> None:
        self.entries.append({
            "id": str(uuid.uuid4())[:8],
            "timestamp": time.time(),
            "agent": agent,
            "message": message,
            "type": "thought",
        })

    def result(self, agent: str, message: str, data: Any = None) -> None:
        self.entries.append({
            "id": str(uuid.uuid4())[:8],
            "timestamp": time.time(),
            "agent": agent,
            "message": message,
            "type": "result",
            "data": data,
        })

    def warn(self, agent: str, message: str) -> None:
        self.entries.append({
            "id": str(uuid.uuid4())[:8],
            "timestamp": time.time(),
            "agent": agent,
            "message": message,
            "type": "warning",
        })


# ---------------------------------------------------------------------------
# 1. Scanner Agent
# ---------------------------------------------------------------------------

def scanner_agent(code: str, filename: str, log: AgentLog) -> dict[str, Any]:
    log.think("🔍 Scanner", "Initializing static analysis engine...")
    log.think("🔍 Scanner", f"Parsing source file: {filename} ({len(code)} bytes)")

    scan_result = scan_with_bandit(code, filename)

    scanner_type = scan_result["scanner"]
    log.think("🔍 Scanner", f"Engine selected: {scanner_type.upper()}")
    count = len(scan_result["findings"])
    log.result("🔍 Scanner", f"Scan complete — {count} raw findings detected.", {"count": count})

    return scan_result


# ---------------------------------------------------------------------------
# 2. Risk Analysis Agent
# ---------------------------------------------------------------------------

EXPLOITABILITY_MAP: dict[str, dict[str, Any]] = {
    "B307": {"exploit_ease": "TRIVIAL", "impact": "CRITICAL", "attack_vector": "Remote Code Execution via eval/exec injection", "business_impact": "Full system compromise, data exfiltration, lateral movement"},
    "B602": {"exploit_ease": "EASY", "impact": "HIGH", "attack_vector": "OS Command Injection via shell=True", "business_impact": "Server takeover, credential theft, pivot to internal network"},
    "B608": {"exploit_ease": "EASY", "impact": "HIGH", "attack_vector": "SQL Injection via string formatting", "business_impact": "Database compromise, data exfiltration, authentication bypass"},
    "B301": {"exploit_ease": "MODERATE", "impact": "HIGH", "attack_vector": "Arbitrary code execution via unsafe deserialization", "business_impact": "Remote code execution, malware deployment"},
    "B501": {"exploit_ease": "MODERATE", "impact": "HIGH", "attack_vector": "Man-in-the-Middle via disabled SSL verification", "business_impact": "Credential interception, data tampering"},
    "B303": {"exploit_ease": "MODERATE", "impact": "MEDIUM", "attack_vector": "Cryptographic weakness via insecure hash", "business_impact": "Password cracking, integrity bypass"},
    "B105": {"exploit_ease": "TRIVIAL", "impact": "MEDIUM", "attack_vector": "Credential exposure in source code", "business_impact": "Unauthorized access if code is leaked"},
    "B101": {"exploit_ease": "LOW", "impact": "LOW", "attack_vector": "Assertion bypass in optimized mode", "business_impact": "Security check bypass when running with -O"},
    "B320": {"exploit_ease": "MODERATE", "impact": "MEDIUM", "attack_vector": "XML External Entity / Billion Laughs attack", "business_impact": "Denial of service, server-side request forgery"},
}

def risk_analysis_agent(findings: list[dict], log: AgentLog) -> list[dict[str, Any]]:
    log.think("⚡ Risk Analyst", "Evaluating exploitability matrix for each finding...")

    enriched = []
    for f in findings:
        tid = f.get("test_id", "")
        risk_info = EXPLOITABILITY_MAP.get(tid, {
            "exploit_ease": "UNKNOWN",
            "impact": f.get("severity", "MEDIUM"),
            "attack_vector": f.get("description", ""),
            "business_impact": "Potential security weakness",
        })

        # Compute a numeric risk score (0-100)
        sev_score = _sev_rank(f.get("severity", "MEDIUM")) * 15
        conf_score = {"HIGH": 20, "MEDIUM": 10, "LOW": 5}.get(f.get("confidence", "MEDIUM"), 10)
        ease_score = {"TRIVIAL": 25, "EASY": 20, "MODERATE": 15, "LOW": 5, "UNKNOWN": 10}.get(
            risk_info["exploit_ease"], 10
        )
        risk_score = min(100, sev_score + conf_score + ease_score)

        enriched_finding = {
            **f,
            "risk_score": risk_score,
            "exploit_ease": risk_info["exploit_ease"],
            "attack_vector": risk_info["attack_vector"],
            "business_impact": risk_info["business_impact"],
            "cvss_estimate": round(risk_score / 10, 1),
        }
        enriched.append(enriched_finding)
        log.think(
            "⚡ Risk Analyst",
            f"[{tid}] {f.get('test_name', '?')} → Risk Score: {risk_score}/100  "
            f"(Exploit Ease: {risk_info['exploit_ease']})"
        )

    log.result("⚡ Risk Analyst", f"Risk assessment complete for {len(enriched)} findings.")
    return enriched


# ---------------------------------------------------------------------------
# 3. Prioritization Agent
# ---------------------------------------------------------------------------

def prioritization_agent(findings: list[dict], log: AgentLog) -> dict[str, Any]:
    log.think("🎯 Prioritizer", "Sorting findings by risk score and deduplicating...")

    # Deduplicate by (test_id, line_number)
    seen: set[str] = set()
    unique: list[dict] = []
    for f in findings:
        key = f"{f.get('test_id', '')}:{f.get('line_number', 0)}"
        if key not in seen:
            seen.add(key)
            unique.append(f)

    # Sort by risk score descending
    unique.sort(key=lambda x: x.get("risk_score", 0), reverse=True)

    # Group by severity
    groups: dict[str, list[dict]] = {"CRITICAL": [], "HIGH": [], "MEDIUM": [], "LOW": []}
    for f in unique:
        sev = f.get("severity", "MEDIUM").upper()
        # Elevate HIGH+TRIVIAL exploit to CRITICAL
        if sev == "HIGH" and f.get("exploit_ease") == "TRIVIAL":
            sev = "CRITICAL"
            f["severity"] = "CRITICAL"
        if sev not in groups:
            sev = "MEDIUM"
        groups[sev].append(f)

    total = len(unique)
    critical = len(groups["CRITICAL"])
    high = len(groups["HIGH"])

    log.think("🎯 Prioritizer", f"Eliminated {len(findings) - total} duplicate findings.")
    log.result(
        "🎯 Prioritizer",
        f"Priority matrix: {critical} CRITICAL | {high} HIGH | "
        f"{len(groups['MEDIUM'])} MEDIUM | {len(groups['LOW'])} LOW",
    )

    # Calculate overall shield rating (0-100, higher = more secure)
    if total == 0:
        shield_rating = 100
    else:
        weighted_sum = sum(f.get("risk_score", 0) for f in unique)
        shield_rating = max(0, 100 - int(weighted_sum / total * 1.2))

    return {
        "prioritized": unique,
        "groups": groups,
        "stats": {
            "total": total,
            "critical": critical,
            "high": high,
            "medium": len(groups["MEDIUM"]),
            "low": len(groups["LOW"]),
            "shield_rating": shield_rating,
        },
    }


# ---------------------------------------------------------------------------
# 4. Attack Chain Agent — builds React Flow graph data
# ---------------------------------------------------------------------------

ATTACK_CHAIN_TEMPLATES: dict[str, list[dict[str, str]]] = {
    "B307": [
        {"label": "User Input", "severity": "info"},
        {"label": "eval() / exec()", "severity": "critical"},
        {"label": "Arbitrary Code Execution", "severity": "critical"},
        {"label": "System Compromise", "severity": "critical"},
    ],
    "B602": [
        {"label": "User Input", "severity": "info"},
        {"label": "shell=True", "severity": "high"},
        {"label": "OS Command Injection", "severity": "critical"},
        {"label": "Server Takeover", "severity": "critical"},
    ],
    "B608": [
        {"label": "User Input", "severity": "info"},
        {"label": "String Formatting in SQL", "severity": "high"},
        {"label": "SQL Injection", "severity": "critical"},
        {"label": "Database Compromise", "severity": "critical"},
        {"label": "Data Exfiltration", "severity": "critical"},
    ],
    "B301": [
        {"label": "Untrusted Data", "severity": "info"},
        {"label": "pickle.loads()", "severity": "high"},
        {"label": "Deserialization Attack", "severity": "critical"},
        {"label": "Remote Code Execution", "severity": "critical"},
    ],
    "B501": [
        {"label": "Network Request", "severity": "info"},
        {"label": "verify=False", "severity": "high"},
        {"label": "MITM Attack", "severity": "critical"},
        {"label": "Credential Theft", "severity": "critical"},
    ],
    "B105": [
        {"label": "Source Code", "severity": "info"},
        {"label": "Hardcoded Secret", "severity": "medium"},
        {"label": "Credential Exposure", "severity": "high"},
        {"label": "Unauthorized Access", "severity": "critical"},
    ],
    "B303": [
        {"label": "Input Data", "severity": "info"},
        {"label": "MD5/SHA1 Hash", "severity": "medium"},
        {"label": "Collision Attack", "severity": "high"},
        {"label": "Integrity Bypass", "severity": "high"},
    ],
}

def attack_chain_agent(prioritized: list[dict], log: AgentLog) -> dict[str, Any]:
    log.think("🕸️ Attack Chain", "Mapping vulnerability findings to exploitable attack paths...")

    nodes: list[dict[str, Any]] = []
    edges: list[dict[str, Any]] = []
    chains: list[dict[str, Any]] = []

    # Central entry node
    entry_id = "entry-0"
    nodes.append({
        "id": entry_id,
        "type": "cyberNode",
        "position": {"x": 400, "y": 0},
        "data": {
            "label": "🎯 Attack Surface",
            "severity": "info",
            "description": "Entry point for all detected attack vectors",
        },
    })

    chain_idx = 0
    y_offset = 120
    for finding in prioritized:
        tid = finding.get("test_id", "")
        template = ATTACK_CHAIN_TEMPLATES.get(tid)
        if not template:
            continue

        chain_idx += 1
        x_base = (chain_idx - 1) * 300
        chain_nodes: list[str] = []
        chain_info = {
            "id": f"chain-{chain_idx}",
            "test_id": tid,
            "test_name": finding.get("test_name", ""),
            "severity": finding.get("severity", "MEDIUM"),
            "risk_score": finding.get("risk_score", 0),
            "steps": [],
        }

        prev_id = entry_id
        for step_idx, step in enumerate(template):
            node_id = f"node-{chain_idx}-{step_idx}"
            nodes.append({
                "id": node_id,
                "type": "cyberNode",
                "position": {"x": x_base, "y": y_offset + step_idx * 100},
                "data": {
                    "label": step["label"],
                    "severity": step["severity"],
                    "chain_id": chain_info["id"],
                    "finding": finding.get("description", ""),
                    "line": finding.get("line_number", 0),
                },
            })
            edges.append({
                "id": f"edge-{prev_id}-{node_id}",
                "source": prev_id,
                "target": node_id,
                "animated": True,
                "style": {"stroke": _severity_color(step["severity"]), "strokeWidth": 2},
                "type": "smoothstep",
            })
            chain_nodes.append(node_id)
            chain_info["steps"].append(step["label"])
            prev_id = node_id

        chains.append(chain_info)
        log.think(
            "🕸️ Attack Chain",
            f"Chain #{chain_idx}: {' → '.join(chain_info['steps'])}  "
            f"(Risk: {chain_info['risk_score']}/100)"
        )

    log.result(
        "🕸️ Attack Chain",
        f"Generated {len(chains)} attack chains with {len(nodes)} nodes and {len(edges)} edges.",
    )

    return {"nodes": nodes, "edges": edges, "chains": chains}


def _severity_color(severity: str) -> str:
    return {
        "critical": "#ef4444",
        "high": "#f97316",
        "medium": "#eab308",
        "low": "#06b6d4",
        "info": "#8b5cf6",
    }.get(severity.lower(), "#6b7280")


# ---------------------------------------------------------------------------
# 5. Fix Agent — generates patches and explanations
# ---------------------------------------------------------------------------

FIX_TEMPLATES: dict[str, dict[str, str]] = {
    "B307": {
        "fix_description": "Replace eval/exec with a safe alternative like ast.literal_eval or a proper parser.",
        "vulnerable_pattern": "result = eval(user_input)",
        "patched_pattern": "import ast\nresult = ast.literal_eval(user_input)  # Safe: only parses literals",
        "explanation": "eval() and exec() execute arbitrary Python code, allowing attackers to run commands on your server. ast.literal_eval() safely evaluates only Python literal expressions.",
    },
    "B602": {
        "fix_description": "Use subprocess with shell=False and pass arguments as a list.",
        "vulnerable_pattern": 'subprocess.call(cmd, shell=True)',
        "patched_pattern": 'subprocess.call(cmd.split(), shell=False)  # Safe: no shell interpretation',
        "explanation": "shell=True passes the command through the system shell, enabling injection. Using a list of args with shell=False prevents shell metacharacter interpretation.",
    },
    "B608": {
        "fix_description": "Use parameterized queries instead of string formatting.",
        "vulnerable_pattern": 'query = f"SELECT * FROM users WHERE id = {user_id}"',
        "patched_pattern": 'query = "SELECT * FROM users WHERE id = ?"\ncursor.execute(query, (user_id,))  # Safe: parameterized query',
        "explanation": "String formatting in SQL queries allows attackers to inject malicious SQL. Parameterized queries separate code from data, preventing injection.",
    },
    "B301": {
        "fix_description": "Use json.loads() or a safe serialization format instead of pickle.",
        "vulnerable_pattern": "data = pickle.loads(user_input)",
        "patched_pattern": "import json\ndata = json.loads(user_input)  # Safe: JSON cannot execute code",
        "explanation": "pickle can deserialize arbitrary Python objects, including malicious ones that execute code. JSON is a safe data-only format.",
    },
    "B501": {
        "fix_description": "Enable SSL certificate verification or use a custom CA bundle.",
        "vulnerable_pattern": "requests.get(url, verify=False)",
        "patched_pattern": "requests.get(url, verify=True)  # Or: verify='/path/to/ca-bundle.crt'",
        "explanation": "Disabling SSL verification allows man-in-the-middle attacks where attackers can intercept and modify traffic.",
    },
    "B303": {
        "fix_description": "Use SHA-256 or SHA-3 instead of MD5/SHA1.",
        "vulnerable_pattern": "h = hashlib.md5(data)",
        "patched_pattern": "h = hashlib.sha256(data)  # Safe: collision-resistant hash",
        "explanation": "MD5 and SHA1 have known collision vulnerabilities. SHA-256 provides strong cryptographic security.",
    },
    "B105": {
        "fix_description": "Move secrets to environment variables or a secrets manager.",
        "vulnerable_pattern": 'password = "admin123"',
        "patched_pattern": 'import os\npassword = os.environ.get("APP_PASSWORD")  # Safe: loaded from environment',
        "explanation": "Hardcoded passwords in source code get committed to version control and can be extracted by anyone with repository access.",
    },
}

def fix_agent(prioritized: list[dict], log: AgentLog) -> list[dict[str, Any]]:
    log.think("🔧 Fix Agent", "Generating remediation patches for detected vulnerabilities...")

    fixes: list[dict[str, Any]] = []
    for f in prioritized:
        tid = f.get("test_id", "")
        template = FIX_TEMPLATES.get(tid)
        if template:
            fix = {
                "finding_id": tid,
                "finding_name": f.get("test_name", ""),
                "filename": f.get("filename", "unknown.py"),
                "line_number": f.get("line_number", 0),
                "severity": f.get("severity", "MEDIUM"),
                "risk_score": f.get("risk_score", 0),
                **template,
            }
            fixes.append(fix)
            log.think(
                "🔧 Fix Agent",
                f"[{tid}] {f.get('filename', 'unknown.py')}:L{f.get('line_number', '?')}: {template['fix_description']}"
            )
        else:
            # Generic fix for unknown patterns
            fixes.append({
                "finding_id": tid,
                "finding_name": f.get("test_name", ""),
                "filename": f.get("filename", "unknown.py"),
                "line_number": f.get("line_number", 0),
                "severity": f.get("severity", "MEDIUM"),
                "risk_score": f.get("risk_score", 0),
                "fix_description": f"Review and remediate: {f.get('description', '')}",
                "vulnerable_pattern": f.get("line_content", ""),
                "patched_pattern": "# TODO: Apply secure pattern here",
                "explanation": f.get("description", "Security issue detected."),
            })

    log.result("🔧 Fix Agent", f"Generated {len(fixes)} remediation patches.")
    return fixes


# ---------------------------------------------------------------------------
# Orchestrator — runs the full pipeline
# ---------------------------------------------------------------------------

def orchestrate(files: list[dict[str, str]] | str, filename: str = "input.py") -> dict[str, Any]:
    """
    Run the complete multi-agent security analysis pipeline.

    Supports either a list of files [{"filename": "...", "code": "..."}]
    or a single code string and filename.
    """
    if isinstance(files, str):
        files = [{"filename": filename, "code": files}]

    log = AgentLog()
    log.think("🧠 Orchestrator", "ZeroTrace AI Multi-Agent Pipeline initiated.")
    
    total_bytes = sum(len(f["code"]) for f in files)
    file_names = ", ".join(f["filename"] for f in files)
    log.think("🧠 Orchestrator", f"Targets: [{file_names}] | Total Size: {total_bytes} bytes")

    # 1. Scan
    all_findings = []
    scanners = []
    
    for f in files:
        scan_result = scanner_agent(f["code"], f["filename"], log)
        if scan_result.get("error"):
            log.warn("🧠 Orchestrator", f"Scanner warning in {f['filename']}: {scan_result['error']}")
        all_findings.extend(scan_result.get("findings", []))
        scanners.append(scan_result.get("scanner", "unknown"))

    scanner_name = "+".join(sorted(list(set(scanners))))

    if not all_findings:
        log.think("🧠 Orchestrator", "No vulnerabilities detected — code appears secure.")
        log.result("🧠 Orchestrator", "Pipeline complete. Shield Rating: 100/100 🛡️")
        return {
            "agent_logs": log.entries,
            "findings": [],
            "prioritized": [],
            "stats": {
                "total": 0, "critical": 0, "high": 0, "medium": 0, "low": 0,
                "shield_rating": 100,
            },
            "attack_chains": {"nodes": [], "edges": [], "chains": []},
            "fixes": [],
            "scanner": scanner_name,
        }

    # 2. Risk Analysis
    enriched = risk_analysis_agent(all_findings, log)

    # 3. Prioritization
    prio_result = prioritization_agent(enriched, log)

    # 4. Attack Chains
    attack_data = attack_chain_agent(prio_result["prioritized"], log)

    # 5. Fixes
    fixes = fix_agent(prio_result["prioritized"], log)

    log.result(
        "🧠 Orchestrator",
        f"Pipeline complete. Shield Rating: {prio_result['stats']['shield_rating']}/100 "
        f"{'🛡️' if prio_result['stats']['shield_rating'] > 70 else '⚠️' if prio_result['stats']['shield_rating'] > 40 else '🚨'}",
    )

    return {
        "agent_logs": log.entries,
        "findings": all_findings,
        "prioritized": prio_result["prioritized"],
        "groups": prio_result["groups"],
        "stats": prio_result["stats"],
        "attack_chains": attack_data,
        "fixes": fixes,
        "scanner": scanner_name,
    }


# ---------------------------------------------------------------------------
# Quick self-test
# ---------------------------------------------------------------------------

if __name__ == "__main__":
    sample = '''
import pickle
import hashlib
import subprocess
import sqlite3

password = "admin123"
secret_token = "sk-abc123xyz"

data = pickle.loads(user_input)
h = hashlib.md5(b"data")
result = eval(user_input)
subprocess.call(cmd, shell=True)

query = f"SELECT * FROM users WHERE id = {user_id}"
conn.execute(query)
'''
    result = orchestrate(sample, "vulnerable_app.py")
    print(json.dumps(result, indent=2, default=str))
