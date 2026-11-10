"""
Renewal Automation and Lifecycle Module for AlbertEmailSetup.
Tracks the 45-day lease window, alerts for 7-day/1-day windows, and coordinates renewals.
"""

import time
from datetime import datetime, timedelta, timezone
from typing import Dict, Any, Optional
from .config import Config
from .logger import get_logger
from .state import StateManager
from .does_software import DoesSoftwareClient

logger = get_logger("RenewalManager")

class RenewalManager:
    """Manages 45-day lease tracking, notifications, and token-based renewals."""

    def __init__(
        self,
        client: Optional[DoesSoftwareClient] = None,
        state_mgr: Optional[StateManager] = None
    ):
        self.client = client or DoesSoftwareClient()
        self.state_mgr = state_mgr or StateManager()

    def calculate_renewal_status(self) -> Dict[str, Any]:
        """Calculates days remaining on the 45-day lease."""
        state = self.state_mgr.get_state()
        renewal_info = state.get("renewal_info", {})

        lease_start_str = renewal_info.get("lease_start") or Config.LEASE_START_DATE
        if lease_start_str:
            try:
                lease_start = datetime.fromisoformat(lease_start_str)
            except Exception:
                lease_start = datetime.now(timezone.utc)
        else:
            lease_start = datetime.now(timezone.utc)

        lease_expires = lease_start + timedelta(days=45)
        now = datetime.now(timezone.utc)
        remaining = lease_expires - now
        days_remaining = max(0, remaining.days)

        # Reminder thresholds
        needs_7d_reminder = days_remaining <= 7
        needs_1d_reminder = days_remaining <= 1
        is_in_grace_period = days_remaining == 0 and remaining.days >= -3
        is_expired = remaining.days < -3

        status = {
            "lease_start": lease_start.isoformat(),
            "lease_expires": lease_expires.isoformat(),
            "days_remaining": days_remaining,
            "hours_remaining": max(0, int(remaining.total_seconds() // 3600)),
            "renewal_cycle_days": 45,
            "reminders": {
                "seven_day_warning": needs_7d_reminder,
                "one_day_urgent": needs_1d_reminder,
                "in_grace_period": is_in_grace_period,
                "is_expired": is_expired
            },
            "renewal_cost": "€0.00 / Free",
            "supported_methods": [
                "1-Click renewal in does.software dashboard",
                "Automated API token call: POST /v1/subdomains/renew-by-token"
            ]
        }

        # Log warning if entering urgent window
        if needs_1d_reminder and not renewal_info.get("one_day_logged"):
            self.state_mgr.log_event("RENEWAL_URGENT_1D", status)
            renewal_info["one_day_logged"] = True
            state["renewal_info"] = renewal_info
            self.state_mgr._save(state)

        return status

    def execute_token_renewal(self, renewal_token: Optional[str] = None) -> Dict[str, Any]:
        """
        Executes token renewal via official provider endpoint:
        POST /v1/subdomains/renew-by-token
        """
        token = renewal_token or Config.RENEWAL_TOKEN
        if not token:
            return {
                "success": False,
                "message": "No renewal token available. Use the does.software dashboard 1-click renewal.",
                "human_action_required": True,
                "action_url": f"{Config.PROVIDER_FREE_TIER['provider_url']}/panel"
            }

        logger.info("Executing renewal via does.software API token...")
        res = self.client.renew_by_token(token)
        
        if res.get("error"):
            logger.warning(f"Renewal failed via token: {res.get('message')}")
            self.state_mgr.log_event("RENEWAL_FAILED", res)
            return {
                "success": False,
                "message": res.get("message", "Renewal token rejected by provider"),
                "details": res
            }

        # Update lease start to now
        state = self.state_mgr.get_state()
        state["renewal_info"]["lease_start"] = datetime.now(timezone.utc).isoformat()
        state["renewal_info"]["last_renewed"] = datetime.now(timezone.utc).isoformat()
        self.state_mgr.log_event("RENEWAL_SUCCESSFUL", res)
        self.state_mgr._save(state)

        return {
            "success": True,
            "message": "Subdomain lease renewed for another 45 days successfully!",
            "details": res
        }
