"""
ZeroTrace AI — Flask API Server
Exposes endpoints for security scanning, agent orchestration, and system status.
"""

import json
import os
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv

from agent_orchestrator import orchestrate

load_dotenv()

app = Flask(__name__)
CORS(app, origins=["http://localhost:5173", "http://localhost:3000", "http://127.0.0.1:5173"])

# ---------------------------------------------------------------------------
# Pre-loaded vulnerable samples for instant demo
# ---------------------------------------------------------------------------

VULNERABLE_SAMPLES = {
    "sql_injection": {
        "name": "vulnerable_login.py",
        "description": "Flask login endpoint with SQL injection vulnerability",
        "code": '''import sqlite3
from flask import Flask, request, jsonify

app = Flask(__name__)
password = "admin123"  # Hardcoded credential

def get_db():
    conn = sqlite3.connect("users.db")
    return conn

@app.route("/login", methods=["POST"])
def login():
    username = request.form.get("username")
    passwd = request.form.get("password")

    conn = get_db()
    # VULNERABLE: SQL Injection via string formatting
    query = f"SELECT * FROM users WHERE username = '{username}' AND password = '{passwd}'"
    result = conn.execute(query).fetchone()

    if result:
        return jsonify({"status": "success", "user": result[0]})
    return jsonify({"status": "failed"}), 401
''',
    },
    "rce_eval": {
        "name": "calculator_api.py",
        "description": "Calculator API using eval() — Remote Code Execution",
        "code": '''from flask import Flask, request, jsonify
import subprocess
import pickle
import hashlib

app = Flask(__name__)
api_key = "sk-prod-abc123def456"  # Hardcoded API key

@app.route("/calculate", methods=["POST"])
def calculate():
    expression = request.json.get("expr")
    # VULNERABLE: eval() allows arbitrary code execution
    result = eval(expression)
    return jsonify({"result": result})

@app.route("/run", methods=["POST"])
def run_command():
    cmd = request.json.get("cmd")
    # VULNERABLE: shell=True allows command injection
    output = subprocess.check_output(cmd, shell=True)
    return jsonify({"output": output.decode()})

@app.route("/load-session", methods=["POST"])
def load_session():
    data = request.data
    # VULNERABLE: Unsafe deserialization
    session = pickle.loads(data)
    return jsonify({"session": str(session)})

def hash_password(password):
    # VULNERABLE: MD5 is cryptographically broken
    return hashlib.md5(password.encode()).hexdigest()
''',
    },
    "mixed_vulns": {
        "name": "data_service.py",
        "description": "Data service with multiple vulnerability types",
        "code": '''import os
import pickle
import hashlib
import subprocess
import sqlite3
import xml.etree.ElementTree as ET
import requests

# Hardcoded credentials
DB_PASSWORD = "super_secret_123"
API_TOKEN = "ghp_xxxxxxxxxxxxxxxxxxxx"

class DataService:
    def __init__(self):
        self.db = sqlite3.connect("app.db")

    def get_user(self, user_id):
        # SQL Injection
        query = f"SELECT * FROM users WHERE id = {user_id}"
        return self.db.execute(query).fetchone()

    def process_data(self, raw_data):
        # Unsafe deserialization
        data = pickle.loads(raw_data)
        return data

    def hash_token(self, token):
        # Weak hash
        return hashlib.md5(token.encode()).hexdigest()

    def verify_hash(self, data):
        # Also weak
        return hashlib.sha1(data).hexdigest()

    def run_script(self, script_name):
        # Command injection
        subprocess.call(f"python {script_name}", shell=True)

    def dynamic_exec(self, code_str):
        # Code execution
        exec(code_str)

    def compute(self, expr):
        # eval injection
        return eval(expr)

    def parse_config(self, xml_string):
        # XXE vulnerability
        tree = ET.fromstring(xml_string)
        return tree

    def fetch_data(self, url):
        # SSL verification disabled
        response = requests.get(url, verify=False)
        return response.json()

    def validate_input(self, value):
        # Assert in production
        assert value is not None, "Value required"
        assert len(value) > 0, "Value cannot be empty"
        return True

    def update_user(self, user_id, name):
        # Another SQL injection
        query = f"UPDATE users SET name = '{name}' WHERE id = {user_id}"
        self.db.execute(query)
''',
    },
}


# ---------------------------------------------------------------------------
# API Routes
# ---------------------------------------------------------------------------

@app.route("/api/status", methods=["GET"])
def status():
    """System status and environment info."""
    has_api_key = bool(os.environ.get("HUGGINGFACE_API_KEY"))
    return jsonify({
        "status": "online",
        "platform": "ZeroTrace AI",
        "version": "1.0.0",
        "agents": [
            {"name": "Scanner Agent", "status": "active", "icon": "🔍"},
            {"name": "Risk Analyst", "status": "active", "icon": "⚡"},
            {"name": "Prioritizer", "status": "active", "icon": "🎯"},
            {"name": "Attack Chain Agent", "status": "active", "icon": "🕸️"},
            {"name": "Fix Agent", "status": "active", "icon": "🔧"},
        ],
        "mode": "live_ai" if has_api_key else "cyber_simulated",
        "huggingface_configured": has_api_key,
    })


@app.route("/api/scan", methods=["POST"])
def scan():
    """
    Run the multi-agent security scan pipeline.

    Accepts JSON body with:
      - code: str (Python source code to scan)
      - filename: str (optional, defaults to "input.py")

    OR multipart file upload with key "file".
    """
    files_to_scan = []

    if request.is_json:
        data = request.get_json()
        code = data.get("code", "")
        filename = data.get("filename", "input.py")
        if code:
            files_to_scan.append({"filename": filename, "code": code})
    elif request.files:
        uploaded_files = request.files.getlist("files")
        if not uploaded_files:
            uploaded_files = request.files.getlist("file")
        for f in uploaded_files:
            if f:
                code = f.read().decode("utf-8", errors="replace")
                filename = f.filename or "uploaded.py"
                files_to_scan.append({
                    "filename": filename,
                    "code": code
                })
    else:
        code = request.form.get("code", "")
        filename = request.form.get("filename", "input.py")
        if code:
            files_to_scan.append({"filename": filename, "code": code})

    if not files_to_scan:
        return jsonify({"error": "No code provided for scanning."}), 400

    try:
        results = {}
        total_alerts = 0
        critical_alerts = 0
        high_alerts = 0
        medium_alerts = 0
        low_alerts = 0
        shield_ratings = []

        for f in files_to_scan:
            file_result = orchestrate(f["code"], f["filename"])
            results[f["filename"]] = file_result
            
            stats = file_result.get("stats", {})
            total_alerts += stats.get("total", 0)
            critical_alerts += stats.get("critical", 0)
            high_alerts += stats.get("high", 0)
            medium_alerts += stats.get("medium", 0)
            low_alerts += stats.get("low", 0)
            shield_ratings.append(stats.get("shield_rating", 100))

        overall_shield = int(sum(shield_ratings) / len(shield_ratings)) if shield_ratings else 100

        # For single file upload, keep output flat for backward compatibility but include files mapping
        if len(files_to_scan) == 1:
            flat_result = list(results.values())[0]
            flat_result["files"] = results
            flat_result["summary"] = {
                "total": total_alerts,
                "critical": critical_alerts,
                "high": high_alerts,
                "medium": medium_alerts,
                "low": low_alerts,
                "shield_rating": overall_shield
            }
            return jsonify(flat_result)

        return jsonify({
            "files": results,
            "summary": {
                "total": total_alerts,
                "critical": critical_alerts,
                "high": high_alerts,
                "medium": medium_alerts,
                "low": low_alerts,
                "shield_rating": overall_shield
            }
        })
    except Exception as e:
        return jsonify({"error": f"Scan failed: {str(e)}"}), 500
@app.route("/api/samples", methods=["GET"])
def get_samples():
    """Return available vulnerable code samples for demo."""
    samples = []
    for key, sample in VULNERABLE_SAMPLES.items():
        samples.append({
            "id": key,
            "name": sample["name"],
            "description": sample["description"],
            "code": sample["code"],
        })
    return jsonify({"samples": samples})


@app.route("/api/scan/sample/<sample_id>", methods=["POST"])
def scan_sample(sample_id: str):
    """Scan a pre-loaded vulnerable sample."""
    sample = VULNERABLE_SAMPLES.get(sample_id)
    if not sample:
        return jsonify({"error": f"Sample '{sample_id}' not found."}), 404

    try:
        result = orchestrate(sample["code"], sample["name"])
        return jsonify(result)
    except Exception as e:
        return jsonify({"error": f"Scan failed: {str(e)}"}), 500


# ---------------------------------------------------------------------------
# Run
# ---------------------------------------------------------------------------

if __name__ == "__main__":
    port = int(os.environ.get("FLASK_PORT", 5000))
    debug = os.environ.get("FLASK_DEBUG", "true").lower() == "true"
    print(f"""
==================================================
        ZeroTrace AI - Backend API           
        Multi-Agent Cybersecurity Engine     
==================================================
  Server:  http://localhost:{port}                  
  Mode:    {'Live AI' if os.environ.get('HUGGINGFACE_API_KEY') else 'Cyber Simulated (Offline)'}
  Agents:  5 Active                               
==================================================
""")
    app.run(host="0.0.0.0", port=port, debug=debug)
