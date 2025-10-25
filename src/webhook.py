from flask import Flask, request, jsonify
import hmac
import hashlib
import subprocess
import os

app = Flask(__name__)
SECRET = None

def verify_signature(secret, payload, signature):
    mac = hmac.new(secret.encode(), msg=payload, digestmod=hashlib.sha256)
    expected = "sha256=" + mac.hexdigest()
    return hmac.compare_digest(expected, signature)

@app.route("/health", methods=["GET"])
def health():
    return jsonify({"ok": True})

@app.route("/webhook", methods=["POST"])
def webhook():
    sig = request.headers.get("X-Hub-Signature-256") or ""
    raw = request.get_data()
    if not SECRET or not verify_signature(SECRET, raw, sig):
        return jsonify({"ok": False, "error": "invalid signature"}), 403
    # Trigger update
    subprocess.Popen(["python3","-m","src.main","update"], stdout=subprocess.DEVNULL, stderr=subprocess.STDOUT)
    return jsonify({"ok": True})

def run_webhook(secret: str, port: int = 9000):
    global SECRET
    SECRET = secret
    app.run(host="0.0.0.0", port=port)
