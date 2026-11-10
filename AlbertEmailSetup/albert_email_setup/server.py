"""
Production-Grade HTTP & JSON API Server for AlbertEmailSetup.
Serves the executive control dashboard and exposes autonomous workflow control endpoints.
Zero external framework dependencies. Binds to 127.0.0.1 by default for strict local security.
"""

import json
import os
import mimetypes
import time
from http.server import HTTPServer, BaseHTTPRequestHandler
from pathlib import Path
from typing import Dict, Any, List

from .config import Config
from .logger import get_logger
from .does_software import DoesSoftwareClient
from .verifier import EmailForwardingVerifier
from .tester import EmailForwardingTester
from .forwardemail_ref import ForwardEmailReference
from .state import StateManager, WorkflowStage
from .availability_engine import AvailabilityEngine
from .registration_engine import RegistrationEngine
from .gmail_integration import GmailIntegration
from .delivery_verifier import DeliveryVerifier
from .renewal_manager import RenewalManager

logger = get_logger("DashboardServer")

BASE_DIR = Path(__file__).resolve().parent.parent
TEMPLATES_DIR = BASE_DIR / "templates"
STATIC_DIR = BASE_DIR / "static"

# Shared singleton engines
STATE_MGR = StateManager()
CLIENT = DoesSoftwareClient()
AVAIL_ENGINE = AvailabilityEngine(CLIENT, STATE_MGR)
REG_ENGINE = RegistrationEngine(CLIENT, STATE_MGR)
GMAIL_INTEG = GmailIntegration(CLIENT, STATE_MGR)
DELIVERY_VERIF = DeliveryVerifier(CLIENT, STATE_MGR)
RENEW_MGR = RenewalManager(CLIENT, STATE_MGR)

# Start background monitor daemon if enabled
if Config.ENABLE_BACKGROUND_MONITOR:
    AVAIL_ENGINE.start_monitoring_daemon()

class DashboardRequestHandler(BaseHTTPRequestHandler):

    def log_message(self, format: str, *args):
        logger.debug(f"{self.client_address[0]} - {format % args}")

    def _send_json(self, data: Dict[str, Any], status: int = 200):
        body = json.dumps(data, indent=2, ensure_ascii=False).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        # Restrict CORS to localhost only for defense-in-depth
        self.send_header("Access-Control-Allow-Origin", "http://127.0.0.1:3050")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.end_headers()
        self.wfile.write(body)

    def _send_html(self, html_content: str, status: int = 200):
        body = html_content.encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "text/html; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def _serve_file(self, file_path: Path):
        if not file_path.exists() or not file_path.is_file():
            self.send_error(404, "File Not Found")
            return
        mime_type, _ = mimetypes.guess_type(str(file_path))
        mime_type = mime_type or "application/octet-stream"
        with open(file_path, "rb") as f:
            content = f.read()
        self.send_response(200)
        self.send_header("Content-Type", mime_type)
        self.send_header("Content-Length", str(len(content)))
        self.end_headers()
        self.wfile.write(content)

    def do_OPTIONS(self):
        self.send_response(204)
        self.send_header("Access-Control-Allow-Origin", "http://127.0.0.1:3050")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.end_headers()

    def do_GET(self):
        url_path = self.path.split("?")[0]

        if url_path == "/" or url_path == "/dashboard":
            dashboard_file = TEMPLATES_DIR / "dashboard.html"
            if dashboard_file.exists():
                with open(dashboard_file, "r", encoding="utf-8") as f:
                    self._send_html(f.read())
            else:
                self.send_error(500, "Dashboard template not found")
            return

        if url_path.startswith("/static/"):
            rel_path = url_path.replace("/static/", "").lstrip("/")
            self._serve_file(STATIC_DIR / rel_path)
            return

        if url_path == "/api/status":
            self._handle_get_status()
            return

        if url_path == "/api/test-protocol":
            protocol = EmailForwardingTester.get_test_protocol()
            self._send_json(protocol)
            return

        if url_path == "/api/comparison":
            self._send_json({"providers": ForwardEmailReference.get_comparison()})
            return

        if url_path == "/api/audit-log":
            state = STATE_MGR.get_state()
            self._send_json({"audit_log": state.get("audit_log", [])})
            return

        self.send_error(404, "Not Found")

    def do_POST(self):
        url_path = self.path.split("?")[0]
        content_length = int(self.headers.get("Content-Length", 0))
        body = self.rfile.read(content_length).decode("utf-8") if content_length > 0 else "{}"
        try:
            payload = json.loads(body)
        except Exception:
            payload = {}

        # 1. Start Autonomous Claim Workflow
        if url_path == "/api/workflow/start":
            open_browser = payload.get("open_browser", True)
            res = REG_ENGINE.initiate_autonomous_claim(open_browser=open_browser)
            self._send_json(res)
            return

        # 2. Pause Workflow
        if url_path == "/api/workflow/pause":
            reason = payload.get("reason", "Paused via dashboard control")
            STATE_MGR.pause_workflow(reason=reason)
            self._send_json({"success": True, "message": f"Workflow paused: {reason}"})
            return

        # 3. Resume Workflow
        if url_path == "/api/workflow/resume":
            STATE_MGR.resume_workflow()
            self._send_json({"success": True, "message": "Workflow resumed"})
            return

        # 4. Turnstile Completed Checkpoint
        if url_path == "/api/workflow/turnstile-completed":
            res = REG_ENGINE.record_manual_checkpoint_completed()
            self._send_json(res)
            return

        # 5. Approve & Execute Gmail Confirmation
        if url_path == "/api/workflow/approve-confirmation":
            token = payload.get("token")
            res = GMAIL_INTEG.execute_owner_approved_confirmation(token=token)
            self._send_json(res)
            return

        # 6. Verify DNS MX
        if url_path == "/api/workflow/verify-mx":
            res = DELIVERY_VERIF.verify_dns_mx()
            self._send_json(res)
            return

        # 7. Record Delivery Test Result
        if url_path == "/api/workflow/run-delivery-test":
            sender = payload.get("sender_email", "external-tester@example.com")
            subject = payload.get("subject", "[Test] Portfolio Identity Verification #001")
            received = bool(payload.get("received_in_inbox", False))
            sender_retained = bool(payload.get("sender_retained", False))
            subject_retained = bool(payload.get("subject_retained", False))
            is_spam = bool(payload.get("is_spam", False))
            
            res = DELIVERY_VERIF.record_external_delivery_test(
                sender_email=sender,
                subject=subject,
                received_in_inbox=received,
                sender_retained=sender_retained,
                subject_retained=subject_retained,
                is_spam=is_spam
            )
            self._send_json(res)
            return

        # 8. Select Alternative with Owner Approval
        if url_path == "/api/workflow/select-alternative":
            alt_name = payload.get("name", "")
            res = AVAIL_ENGINE.select_alternative_with_approval(alt_name)
            self._send_json(res)
            return

        # 9. Renew Subdomain via Token
        if url_path == "/api/workflow/renew":
            token = payload.get("token")
            res = RENEW_MGR.execute_token_renewal(token)
            self._send_json(res)
            return

        # 10. Check arbitrary subdomain
        if url_path == "/api/check-subdomain":
            name = payload.get("name", Config.TARGET_SUBDOMAIN)
            res = CLIENT.check_availability(name)
            self._send_json(res)
            return

        self.send_error(404, "Endpoint Not Found")

    def _handle_get_status(self):
        # Refresh telemetry
        avail_target = AVAIL_ENGINE.check_preferred()
        candidates = AVAIL_ENGINE.check_all_candidates()
        health = AVAIL_ENGINE.get_health()
        lifecycle = DELIVERY_VERIF.evaluate_six_stage_lifecycle()
        mx_status = DELIVERY_VERIF.verify_dns_mx()
        renewal = RENEW_MGR.calculate_renewal_status()
        state = STATE_MGR.get_state()

        # Check for Gmail confirmation if OAuth is available
        gmail_status = {"oauth_configured": GMAIL_INTEG.is_oauth_configured()}
        if GMAIL_INTEG.is_oauth_configured() and state.get("current_stage") == WorkflowStage.STAGE_3_REGISTRATION_CONFIRMED:
            gmail_res = GMAIL_INTEG.search_provider_confirmation_email()
            gmail_status["search_result"] = gmail_res

        payload = {
            "config": Config.to_dict(),
            "target_availability": avail_target,
            "candidates_availability": candidates,
            "provider_health": health,
            "six_stage_lifecycle": lifecycle,
            "mx_status": mx_status,
            "renewal": renewal,
            "gmail_status": gmail_status,
            "state": state
        }
        self._send_json(payload)

def run_server(port: int = None, host: str = None):
    p = port or Config.PORT
    h = host or Config.HOST
    server_address = (h, p)
    httpd = HTTPServer(server_address, DashboardRequestHandler)
    logger.info(f"AlbertEmailSetup Autonomous Dashboard running at http://{h}:{p}/")
    print(f"\n==================================================================")
    print(f"  Albert Professional Email Automation — Autonomous Dashboard Live")
    print(f"  Local Control URL: http://{h}:{p}/")
    print(f"  Target Identity:   {Config.professional_email()}")
    print(f"  Destination Inbox: {Config.mask_email(Config.PERSONAL_FORWARD_EMAIL)}")
    print(f"==================================================================\n")
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        logger.info("Server shutting down gracefully.")
        httpd.server_close()
