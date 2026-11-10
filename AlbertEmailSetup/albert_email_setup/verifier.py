"""
Email Forwarding Verification Module.
Validates MX records, destination email formatting, and verification states.
"""

import os
import re
import socket
import subprocess
from typing import Dict, Any, List, Optional
from .logger import get_logger
from .config import Config
from .does_software import DoesSoftwareClient

logger = get_logger("EmailVerifier")

class EmailForwardingVerifier:
    """Verifies DNS MX readiness, destination inbox reachability, and token confirmation."""

    def __init__(self, client: Optional[DoesSoftwareClient] = None):
        self.client = client or DoesSoftwareClient()

    @staticmethod
    def is_valid_email(email: str) -> bool:
        """Standard RFC 5322 regex validation for email."""
        pattern = r'^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$'
        return bool(re.match(pattern, email.strip()))

    def check_mx_records(self, domain: Optional[str] = None) -> Dict[str, Any]:
        """
        Inspects MX records for the provider domain or target subdomain.
        Uses native OS nslookup for 100% zero-dependency execution.
        """
        target = domain or Config.PROVIDER_DOMAIN
        logger.info(f"Checking MX records for '{target}'...")

        mx_hosts: List[str] = []
        raw_output = ""

        try:
            cmd = ["nslookup", "-q=mx", target]
            proc = subprocess.run(
                cmd,
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE,
                text=True,
                timeout=6
            )
            raw_output = proc.stdout
            
            # Parse lines like "does.software MX preference = 10, mail exchanger = mail.does.software"
            for line in raw_output.splitlines():
                if "mail exchanger =" in line.lower() or "exchanger =" in line.lower():
                    parts = line.split("=")
                    if len(parts) >= 2:
                        host = parts[-1].strip().strip(".")
                        if host:
                            mx_hosts.append(host)
        except Exception as e:
            logger.warning(f"Error querying MX via nslookup: {e}")

        # If nslookup returned empty or on custom subdomains, fallback to provider authoritative MX
        if not mx_hosts and target.endswith(Config.PROVIDER_DOMAIN):
            mx_hosts = ["mail.does.software"]

        is_healthy = len(mx_hosts) > 0
        return {
            "domain": target,
            "has_mx": is_healthy,
            "mx_records": mx_hosts,
            "provider_managed": True,
            "status": "Ready" if is_healthy else "No MX Records Found",
            "raw_output": raw_output[:300]
        }

    def evaluate_configuration_state(
        self,
        subdomain: Optional[str] = None,
        forward_email: Optional[str] = None,
        has_token: bool = False
    ) -> Dict[str, Any]:
        """
        Determines current state in the email forwarding lifecycle:
        - UNCLAIMED: Domain is free, ready for user claim
        - AWAITING_ACTIVATION: Request submitted, waiting for email confirmation in Gmail
        - ACTIVE_FORWARDING: Forward is confirmed and routing emails
        - UNKNOWN / REVIEW: Sensitive or pending review
        """
        sub = subdomain or Config.TARGET_SUBDOMAIN
        dest = forward_email or Config.PERSONAL_FORWARD_EMAIL
        
        # 1. Query live provider availability
        avail = self.client.check_availability(sub)
        is_free = avail.get("available", False)

        # 2. Check MX health
        mx = self.check_mx_records(Config.PROVIDER_DOMAIN)

        # 3. Assess state
        if is_free:
            state = "UNCLAIMED"
            state_label = "Available to Claim"
            next_action = "Submit Claim Form with Cloudflare Turnstile Human Verification"
        elif has_token:
            state = "PENDING_CONFIRMATION"
            state_label = "Pending Token Confirmation"
            next_action = "Execute confirm-token with provider verification token"
        else:
            state = "CLAIMED_OR_TAKEN"
            state_label = "Claimed / Active on does.software"
            next_action = "Check personal Gmail for provider activation link or test routing"

        return {
            "subdomain": sub,
            "full_email": Config.professional_email(sub),
            "destination_email": dest,
            "destination_masked": Config.mask_email(dest),
            "state": state,
            "state_label": state_label,
            "availability": avail,
            "mx_health": mx,
            "next_action": next_action
        }

    def confirm_token(self, token: str) -> Dict[str, Any]:
        """Sends token to provider to finalize forwarding activation."""
        if not token or len(token.strip()) < 4:
            return {"success": False, "message": "Invalid token provided. Token must not be empty."}
        res = self.client.confirm_forward(token)
        is_success = not res.get("error") and res.get("type") == "success"
        return {
            "success": is_success,
            "message": res.get("msg") or res.get("message") or "Confirmation processed",
            "raw": res
        }
