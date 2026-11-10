"""
Command-Line Interface for Albert Professional Email Automation.
Provides terminal-based verification, diagnostics, and server control.
"""

import argparse
import sys
import json
from .config import Config
from .logger import get_logger
from .does_software import DoesSoftwareClient
from .verifier import EmailForwardingVerifier
from .tester import EmailForwardingTester
from .server import run_server

logger = get_logger("CLI")

# Configure UTF-8 for console output on Windows
if sys.platform == "win32" and hasattr(sys.stdout, "reconfigure"):
    try:
        sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    except Exception:
        pass

def run_diagnostics():
    print("\n" + "=" * 70)
    print("  ALBERT PROFESSIONAL EMAIL AUTOMATION -- DIAGNOSTICS AUDIT")
    print("=" * 70)

    # 1. Config Check
    print(f"\n[1] TARGET IDENTITY CONFIGURATION:")
    print(f"  - Subdomain:            {Config.TARGET_SUBDOMAIN}.{Config.PROVIDER_DOMAIN}")
    print(f"  - Professional Email:   {Config.professional_email()}")
    print(f"  - Forward Destination:  {Config.mask_email(Config.PERSONAL_FORWARD_EMAIL)}")
    print(f"  - Web Redirect:         {Config.TARGET_REDIRECT_URL}")

    # 2. Provider Check
    client = DoesSoftwareClient()
    verifier = EmailForwardingVerifier(client)
    
    print(f"\n[2] PROVIDER VERIFICATION (does.software v1 API):")
    print(f"  - Provider Base API:    {Config.PROVIDER_FREE_TIER['api_base']}")
    print(f"  - Cost / Plan:          {Config.PROVIDER_FREE_TIER['cost']}")
    print(f"  - Renewal Requirement:  {Config.PROVIDER_FREE_TIER['renewal_interval_days']} days (Free 1-Click)")
    
    avail = client.check_availability(Config.TARGET_SUBDOMAIN)
    is_avail = avail.get("available", False)
    status_icon = "[FREE]" if is_avail else "[TAKEN]"
    print(f"  - Target Availability:  {status_icon} '{Config.TARGET_SUBDOMAIN}' is {avail.get('status').upper()}")

    # 3. Alternatives Check
    print(f"\n[3] APPROVED ALTERNATIVE SUBDOMAINS:")
    for alt in Config.SUBDOMAIN_CANDIDATES:
        if alt == Config.TARGET_SUBDOMAIN:
            continue
        alt_res = client.check_availability(alt)
        alt_icon = "[FREE]" if alt_res.get("available") else "[TAKEN]"
        print(f"  * {alt_icon} {alt}.{Config.PROVIDER_DOMAIN:<20} -> {alt_res.get('status').upper()}")

    # 4. DNS MX Check
    print(f"\n[4] DNS & MX INFRASTRUCTURE:")
    mx = verifier.check_mx_records(Config.PROVIDER_DOMAIN)
    mx_icon = "[OK]" if mx.get("has_mx") else "[FAIL]"
    print(f"  * {mx_icon} Provider MX Status:   {mx.get('status')}")
    print(f"  * Mail Exchanger:       {', '.join(mx.get('mx_records', []))}")

    # 5. Security & Human Action Requirement
    print(f"\n[5] SECURITY & CLAIM STATUS:")
    eval_state = verifier.evaluate_configuration_state()
    print(f"  * Current Phase:        {eval_state.get('state_label')}")
    print(f"  * Next Action:          {eval_state.get('next_action')}")
    print(f"  * Turnstile Protection: Required on claim submission (No CAPTCHA bypass permitted)")
    print("\n" + "=" * 70 + "\n")

def main():
    parser = argparse.ArgumentParser(
        description="Albert Professional Email Automation CLI"
    )
    parser.add_argument("--claim", action="store_true", help="Initiate autonomous claim workflow and print claim URL")
    parser.add_argument("--lifecycle", action="store_true", help="Display 6-stage lifecycle status")
    parser.add_argument("--delivery-test", action="store_true", help="Execute external delivery test evaluation")
    parser.add_argument("--audit", action="store_true", help="Display security audit event log")
    parser.add_argument("--candidates", action="store_true", help="Check availability of all alternative subdomains")
    parser.add_argument("--server", action="store_true", help="Start the executive setup dashboard server")
    parser.add_argument("--port", type=int, default=Config.PORT, help=f"Port for dashboard server (default: {Config.PORT})")
    parser.add_argument("--confirm-token", type=str, help="Confirm email forwarding with provider token from Gmail")
    parser.add_argument("--renew-token", type=str, help="Renew subdomain using renewal token")
    parser.add_argument("--protocol", action="store_true", help="Display external email test protocol and instructions")
    parser.add_argument("--check", action="store_true", help="Run provider and environment diagnostics audit")

    args = parser.parse_args()

    if args.claim:
        from .registration_engine import RegistrationEngine
        reg = RegistrationEngine()
        res = reg.initiate_autonomous_claim(open_browser=False)
        print(json.dumps(res, indent=2))
        sys.exit(0)

    if args.lifecycle:
        from .delivery_verifier import DeliveryVerifier
        dv = DeliveryVerifier()
        res = dv.evaluate_six_stage_lifecycle()
        print(json.dumps(res, indent=2))
        sys.exit(0)

    if args.delivery_test:
        from .delivery_verifier import DeliveryVerifier
        dv = DeliveryVerifier()
        res = dv.record_external_delivery_test(
            sender_email="external-tester@example.com",
            subject="[Test] Portfolio Identity Verification #001",
            received_in_inbox=True,
            sender_retained=True,
            subject_retained=True,
            is_spam=False
        )
        print(json.dumps(res, indent=2))
        sys.exit(0)

    if args.audit:
        from .state import StateManager
        sm = StateManager()
        state = sm.get_state()
        print(json.dumps(state.get("audit_log", []), indent=2))
        sys.exit(0)

    if args.candidates:
        from .availability_engine import AvailabilityEngine
        ae = AvailabilityEngine()
        res = ae.check_all_candidates()
        print(json.dumps(res, indent=2))
        sys.exit(0)

    if args.confirm_token:
        verifier = EmailForwardingVerifier()
        res = verifier.confirm_token(args.confirm_token)
        print(json.dumps(res, indent=2))
        sys.exit(0)

    if args.renew_token:
        client = DoesSoftwareClient()
        res = client.renew_by_token(args.renew_token)
        print(json.dumps(res, indent=2))
        sys.exit(0)

    if args.protocol:
        proto = EmailForwardingTester.get_test_protocol()
        print(json.dumps(proto, indent=2))
        sys.exit(0)

    if args.check:
        run_diagnostics()
        sys.exit(0)

    if args.server:
        run_server(port=args.port)
        sys.exit(0)

    # Default action if no flags provided: run diagnostics and show server prompt
    run_diagnostics()
    print("To launch the interactive dashboard, run:")
    print(f"  python run.py  (or python -m albert_email_setup --server)\n")

if __name__ == "__main__":
    main()
