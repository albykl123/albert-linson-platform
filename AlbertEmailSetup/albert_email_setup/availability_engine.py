"""
Autonomous Availability Engine for AlbertEmailSetup.
Monitors preferred subdomain and alternatives with automated retry and health telemetry.
"""

import threading
import time
from typing import Dict, Any, List, Optional
from .config import Config
from .logger import get_logger
from .does_software import DoesSoftwareClient
from .state import StateManager, WorkflowStage

logger = get_logger("AvailabilityEngine")

class AvailabilityEngine:
    """Continuously monitors availability of preferred and alternative subdomains."""

    def __init__(
        self,
        client: Optional[DoesSoftwareClient] = None,
        state_mgr: Optional[StateManager] = None,
        check_interval: Optional[int] = None
    ):
        self.client = client or DoesSoftwareClient()
        self.state_mgr = state_mgr or StateManager()
        self.check_interval = check_interval or Config.AUTO_MONITOR_INTERVAL_SECONDS
        
        self._stop_event = threading.Event()
        self._thread: Optional[threading.Thread] = None
        self._last_health: Dict[str, Any] = {
            "healthy": True,
            "latency_ms": 0,
            "last_check": None,
            "error": None
        }

    def check_preferred(self) -> Dict[str, Any]:
        """Checks availability of the preferred subdomain (albert)."""
        t0 = time.time()
        res = self.client.check_availability(Config.TARGET_SUBDOMAIN)
        latency_ms = int((time.time() - t0) * 1000)

        is_healthy = not res.get("error", False) and res.get("status") != "error"
        self._last_health = {
            "healthy": is_healthy,
            "latency_ms": latency_ms,
            "last_check": time.time(),
            "error": res.get("message")
        }

        # Update persistent state
        state = self.state_mgr.get_state()
        is_claimed = state.get("current_stage") in [
            WorkflowStage.STAGE_3_REGISTRATION_CONFIRMED,
            WorkflowStage.STAGE_4_GMAIL_VERIFIED,
            WorkflowStage.STAGE_5_MX_VERIFIED,
            WorkflowStage.STAGE_6_DELIVERY_VERIFIED
        ]

        if is_claimed:
            res_claimed = dict(res)
            res_claimed["status"] = "claimed_active"
            self.state_mgr.update_availability(res_claimed)
        else:
            self.state_mgr.update_availability(res)
            if not res.get("available") and state.get("current_stage") == WorkflowStage.STAGE_1_AVAILABLE:
                logger.warning(f"Preferred subdomain '{Config.TARGET_SUBDOMAIN}' is currently unavailable: {res.get('status')}")
                self.state_mgr.log_event("PREFERRED_NAME_UNAVAILABLE", {
                    "name": Config.TARGET_SUBDOMAIN,
                    "reason": res.get("reason"),
                    "status": res.get("status")
                })

        return res

    def check_all_candidates(self) -> List[Dict[str, Any]]:
        """Checks preferred name and all approved alternatives."""
        results = []
        for name in Config.SUBDOMAIN_CANDIDATES:
            results.append(self.client.check_availability(name))
        return results

    def get_health(self) -> Dict[str, Any]:
        return dict(self._last_health)

    def select_alternative_with_approval(self, alternative_name: str) -> Dict[str, Any]:
        """
        Enforces Rule: Never automatically claim an alternative without
        displaying the selected address and obtaining owner approval.
        """
        clean_name = alternative_name.strip().lower()
        if clean_name not in Config.SUBDOMAIN_CANDIDATES:
            return {
                "success": False,
                "message": f"'{clean_name}' is not an approved alternative candidate."
            }

        avail = self.client.check_availability(clean_name)
        if not avail.get("available"):
            return {
                "success": False,
                "message": f"Alternative '{clean_name}.{Config.PROVIDER_DOMAIN}' is currently unavailable."
            }

        # Update target in state
        new_email = Config.professional_email(clean_name)
        self.state_mgr.log_event("OWNER_APPROVED_ALTERNATIVE", {
            "old_subdomain": Config.TARGET_SUBDOMAIN,
            "new_subdomain": clean_name,
            "new_email": new_email
        })
        self.state_mgr.set_stage(
            WorkflowStage.STAGE_1_AVAILABLE,
            f"Alternative '{clean_name}.{Config.PROVIDER_DOMAIN}' selected and approved by owner."
        )

        return {
            "success": True,
            "subdomain": clean_name,
            "professional_email": new_email,
            "message": f"Selected address {new_email} approved."
        }

    def start_monitoring_daemon(self):
        """Starts background monitoring loop."""
        if self._thread and self._thread.is_alive():
            logger.info("Availability monitoring loop already active.")
            return

        self._stop_event.clear()
        self._thread = threading.Thread(target=self._monitor_loop, daemon=True, name="AvailabilityEngineThread")
        self._thread.start()
        logger.info(f"Availability monitoring daemon started (interval: {self.check_interval}s).")

    def stop_monitoring_daemon(self):
        """Stops background monitoring loop."""
        self._stop_event.set()
        if self._thread:
            self._thread.join(timeout=2)
            logger.info("Availability monitoring daemon stopped.")

    def _monitor_loop(self):
        while not self._stop_event.is_set():
            state = self.state_mgr.get_state()
            if not state.get("workflow_paused"):
                try:
                    self.check_preferred()
                except Exception as e:
                    logger.warning(f"Error in availability check loop: {e}")
            
            # Sleep in small increments for responsive shutdown
            for _ in range(self.check_interval * 2):
                if self._stop_event.is_set():
                    break
                time.sleep(0.5)
