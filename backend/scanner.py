"""
ZeroTrace AI — Security Scanner Module
Integrates Bandit for static Python security scanning with an AST-based
fallback engine that ensures reliable scanning even without Bandit installed.
"""

import ast
import json
import os
import subprocess
import sys
import tempfile
import re
from typing import Any


# ---------------------------------------------------------------------------
# AST-based fallback vulnerability patterns
# ---------------------------------------------------------------------------

VULN_PATTERNS: list[dict[str, Any]] = [
    {
        "id": "B101",
        "name": "assert_used",
        "pattern": ast.Assert,
        "severity": "LOW",
        "confidence": "HIGH",
        "description": "Use of assert detected. Assertions are removed when Python is run with -O flag.",
        "cwe": "CWE-703",
    },
    {
        "id": "B105",
        "name": "hardcoded_password_string",
        "keywords": ["password", "passwd", "pwd", "secret", "token", "api_key", "apikey"],
        "severity": "LOW",
        "confidence": "MEDIUM",
        "description": "Possible hardcoded password or secret detected.",
        "cwe": "CWE-259",
    },
    {
        "id": "B301",
        "name": "pickle_usage",
        "modules": ["pickle", "cPickle"],
        "functions": ["loads", "load", "Unpickler"],
        "severity": "MEDIUM",
        "confidence": "HIGH",
        "description": "Pickle/cPickle usage detected — deserialization of untrusted data can lead to arbitrary code execution.",
        "cwe": "CWE-502",
    },
    {
        "id": "B303",
        "name": "md5_sha1_usage",
        "modules": ["hashlib"],
        "functions": ["md5", "sha1"],
        "severity": "MEDIUM",
        "confidence": "HIGH",
        "description": "Use of insecure hash function (MD5/SHA1) detected.",
        "cwe": "CWE-328",
    },
    {
        "id": "B307",
        "name": "eval_usage",
        "builtins": ["eval", "exec", "compile"],
        "severity": "HIGH",
        "confidence": "HIGH",
        "description": "Use of eval/exec detected — can execute arbitrary code.",
        "cwe": "CWE-78",
    },
    {
        "id": "B320",
        "name": "xml_parse",
        "modules": ["xml.etree.ElementTree", "xml.dom.minidom", "xml.sax"],
        "severity": "MEDIUM",
        "confidence": "MEDIUM",
        "description": "XML parsing without defused-xml can be vulnerable to XML bomb and external entity attacks.",
        "cwe": "CWE-611",
    },
    {
        "id": "B501",
        "name": "ssl_no_verify",
        "keywords_in_call": ["verify=False", "verify = False"],
        "severity": "HIGH",
        "confidence": "HIGH",
        "description": "SSL certificate verification disabled — vulnerable to MITM attacks.",
        "cwe": "CWE-295",
    },
    {
        "id": "B602",
        "name": "subprocess_shell",
        "keywords_in_call": ["shell=True", "shell = True"],
        "severity": "HIGH",
        "confidence": "HIGH",
        "description": "subprocess call with shell=True — vulnerable to shell injection.",
        "cwe": "CWE-78",
    },
    {
        "id": "B608",
        "name": "sql_injection",
        "string_patterns": [
            r"SELECT\s+.*\s+FROM\s+.*%s",
            r"SELECT\s+.*\s+FROM\s+.*\{",
            r"INSERT\s+INTO\s+.*%s",
            r"INSERT\s+INTO\s+.*\{",
            r"DELETE\s+FROM\s+.*%s",
            r"UPDATE\s+.*SET\s+.*%s",
            r"execute\s*\(.*%",
            r"execute\s*\(.*\+",
            r"execute\s*\(.*f\"",
        ],
        "severity": "HIGH",
        "confidence": "MEDIUM",
        "description": "Possible SQL injection via string formatting detected.",
        "cwe": "CWE-89",
    },
]


# ---------------------------------------------------------------------------
# AST Visitor — walks the syntax tree looking for vulnerability patterns
# ---------------------------------------------------------------------------

class VulnerabilityVisitor(ast.NodeVisitor):
    """Walk Python AST and flag known vulnerability patterns."""

    def __init__(self, source_lines: list[str], filename: str = "<input>"):
        self.findings: list[dict[str, Any]] = []
        self.source_lines = source_lines
        self.filename = filename
        self._imports: dict[str, str] = {}  # alias -> module

    # Track imports for module-level checks
    def visit_Import(self, node: ast.Import) -> None:
        for alias in node.names:
            self._imports[alias.asname or alias.name] = alias.name
        self.generic_visit(node)

    def visit_ImportFrom(self, node: ast.ImportFrom) -> None:
        module = node.module or ""
        for alias in node.names:
            self._imports[alias.asname or alias.name] = f"{module}.{alias.name}"
        self.generic_visit(node)

    # Check assert usage (B101)
    def visit_Assert(self, node: ast.Assert) -> None:
        p = VULN_PATTERNS[0]  # assert_used
        self._add_finding(p, node.lineno)
        self.generic_visit(node)

    # Check eval/exec/compile (B307)
    def visit_Call(self, node: ast.Call) -> None:
        func_name = self._get_call_name(node)
        line_text = self._line(node.lineno)

        # eval / exec / compile
        for p in VULN_PATTERNS:
            if "builtins" in p and func_name in p["builtins"]:
                self._add_finding(p, node.lineno)

        # Module-function combos (pickle.loads, hashlib.md5, etc.)
        for p in VULN_PATTERNS:
            if "modules" in p and "functions" in p:
                for mod in p["modules"]:
                    for fn in p["functions"]:
                        if func_name in (f"{mod}.{fn}", fn) and any(
                            mod in v for v in self._imports.values()
                        ):
                            self._add_finding(p, node.lineno)

        # Keyword-in-call checks (shell=True, verify=False)
        for p in VULN_PATTERNS:
            if "keywords_in_call" in p:
                for kw in p["keywords_in_call"]:
                    if kw in line_text:
                        self._add_finding(p, node.lineno)

        self.generic_visit(node)

    # Hardcoded password detection (B105)
    def visit_Assign(self, node: ast.Assign) -> None:
        p = next(x for x in VULN_PATTERNS if x["id"] == "B105")
        for target in node.targets:
            name = ""
            if isinstance(target, ast.Name):
                name = target.id.lower()
            elif isinstance(target, ast.Attribute):
                name = target.attr.lower()
            if any(kw in name for kw in p["keywords"]):
                if isinstance(node.value, ast.Constant) and isinstance(node.value.value, str):
                    if len(node.value.value) > 0:
                        self._add_finding(p, node.lineno)
        self.generic_visit(node)

    # SQL injection string pattern matching (B608)
    def visit_JoinedStr(self, node: ast.JoinedStr) -> None:
        self._check_sql_patterns(node.lineno)
        self.generic_visit(node)

    def visit_BinOp(self, node: ast.BinOp) -> None:
        if isinstance(node.op, (ast.Mod, ast.Add)):
            self._check_sql_patterns(node.lineno)
        self.generic_visit(node)

    # ---- helpers ----

    def _check_sql_patterns(self, lineno: int) -> None:
        p = next(x for x in VULN_PATTERNS if x["id"] == "B608")
        line = self._line(lineno)
        for pat in p["string_patterns"]:
            if re.search(pat, line, re.IGNORECASE):
                self._add_finding(p, lineno)
                break

    def _line(self, lineno: int) -> str:
        if 1 <= lineno <= len(self.source_lines):
            return self.source_lines[lineno - 1]
        return ""

    def _get_call_name(self, node: ast.Call) -> str:
        if isinstance(node.func, ast.Name):
            return node.func.id
        if isinstance(node.func, ast.Attribute):
            parts: list[str] = [node.func.attr]
            val = node.func.value
            while isinstance(val, ast.Attribute):
                parts.append(val.attr)
                val = val.value
            if isinstance(val, ast.Name):
                parts.append(val.id)
            return ".".join(reversed(parts))
        return ""

    def _add_finding(self, pattern: dict, lineno: int) -> None:
        # Deduplicate same pattern + same line
        for f in self.findings:
            if f["test_id"] == pattern["id"] and f["line_number"] == lineno:
                return
        self.findings.append({
            "test_id": pattern["id"],
            "test_name": pattern["name"],
            "severity": pattern["severity"],
            "confidence": pattern["confidence"],
            "description": pattern["description"],
            "cwe": pattern.get("cwe", ""),
            "line_number": lineno,
            "line_content": self._line(lineno).strip(),
            "filename": self.filename,
        })


# ---------------------------------------------------------------------------
# Public API
# ---------------------------------------------------------------------------

def scan_with_bandit(code: str, filename: str = "input.py") -> dict[str, Any]:
    """
    Attempt to scan code using the bandit CLI.
    Falls back to AST-based scanning if bandit is unavailable.
    Returns a standardised result dict.
    """
    try:
        return _run_bandit(code, filename)
    except Exception:
        return _run_ast_scanner(code, filename)


def _run_bandit(code: str, filename: str) -> dict[str, Any]:
    """Run bandit CLI on a temp file and parse JSON output."""
    with tempfile.NamedTemporaryFile(
        mode="w", suffix=".py", delete=False, encoding="utf-8"
    ) as tmp:
        tmp.write(code)
        tmp_path = tmp.name

    try:
        result = subprocess.run(
            [sys.executable, "-m", "bandit", "-f", "json", "-q", tmp_path],
            capture_output=True,
            text=True,
            timeout=30,
        )
        # bandit returns exit code 1 when issues found — that's normal
        output = result.stdout
        if not output.strip():
            raise RuntimeError("Bandit produced no output")

        data = json.loads(output)
        findings = []
        for r in data.get("results", []):
            findings.append({
                "test_id": r.get("test_id", ""),
                "test_name": r.get("test_name", ""),
                "severity": r.get("issue_severity", "MEDIUM"),
                "confidence": r.get("issue_confidence", "MEDIUM"),
                "description": r.get("issue_text", ""),
                "cwe": _extract_cwe(r),
                "line_number": r.get("line_number", 0),
                "line_content": (r.get("code", "").strip().split("\n")[0] if r.get("code") else ""),
                "filename": filename,
            })

        return {
            "scanner": "bandit",
            "findings": findings,
            "metrics": data.get("metrics", {}),
            "error": None,
        }
    finally:
        try:
            os.unlink(tmp_path)
        except OSError:
            pass


def _run_ast_scanner(code: str, filename: str) -> dict[str, Any]:
    """Fallback: scan using Python's built-in AST module."""
    try:
        tree = ast.parse(code, filename=filename)
    except SyntaxError as e:
        return {
            "scanner": "ast_fallback",
            "findings": [],
            "metrics": {},
            "error": f"Syntax error in code: {e}",
        }

    lines = code.splitlines()
    visitor = VulnerabilityVisitor(lines, filename)
    visitor.visit(tree)

    return {
        "scanner": "ast_fallback",
        "findings": visitor.findings,
        "metrics": {
            "loc": len(lines),
            "nosec": 0,
        },
        "error": None,
    }


def _extract_cwe(result: dict) -> str:
    cwe = result.get("issue_cwe", {})
    if isinstance(cwe, dict):
        return f"CWE-{cwe.get('id', '')}"
    return str(cwe) if cwe else ""


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
    result = scan_with_bandit(sample, "sample.py")
    print(json.dumps(result, indent=2))
