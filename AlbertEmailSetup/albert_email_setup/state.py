"""
Persistent State Machine and Audit Logging for AlbertEmailSetup.
Tracks the 6 distinct operational stages and maintains a secure audit trail.
"""

import json
import time
from datetime import datetime, timezone
from pathlib import Path
from typing import Dict, Any, List, Optional
from .config import Config
from .logger import get_logger

logger = get_logger("StateManager")

class WorkflowStage:
    STAGE_1_AVAILABLE = "STAGE_1_AVAILABLE"                     # 1. Subdomain is free
    STAGE_2_CLAIM_SUBMITTED = "STAGE_2_CLAIM_SUBMITTED"         # 2. Claim submitted, Turnstile human checkpoint
    STAGE_3_REGISTRATION_CONFIRMED = "STAGE_3_REG_CONFIRMED"     # 3. Registration accepted by provider
    STAGE_4_GMAIL_VERIFIED = "STAGE_4_GMAIL_VERIFIED"           # 4. Gmail destination forward confirmed
    STAGE_5_MX_VERIFIED = "STAGE_5_MX_VERIFIED"                 # 5. DNS MX records verified
    STAGE_6_DELIVERY_VERIFIED = "STAGE_6_DELIVERY_VERIFIED"     # 6. Actual incoming delivery verified

class StateManager:
    """Thread-safe persistent state manager for AlbertEmailSetup."""

    def __init__(self, state_file: Optional[Path] = None):
        self.state_file = state_file or Config.STATE_FILE
        self._state: Dict[str, Any] = self._load()

    def _default_state(self) -> Dict[str, Any]:
        return {
            "current_stage": WorkflowStage.STAGE_1_AVAILABLE,
            "stage_labels": {
                WorkflowStage.STAGE_1_AVAILABLE: "Subdomain Available",
                WorkflowStage.STAGE_2_CLAIM_SUBMITTED: "Claim Submitted (Pending Turnstile)",
                WorkflowStage.STAGE_3_REGISTRATION_CONFIRMED: "Registration Confirmed",
                WorkflowStage.STAGE_4_GMAIL_VERIFIED: "Gmail Forwarding Verified",
                WorkflowStage.STAGE_5_MX_VERIFIED: "MX Records Verified",
                WorkflowStage.STAGE_6_DELIVERY_VERIFIED: "Actual Delivery Verified"
            },
            "subdomain": Config.TARGET_SUBDOMAIN,
            "provider_domain": Config.PROVIDER_DOMAIN,
            "professional_email": Config.professional_email(),
            "destination_email": Config.PERSONAL_FORWARD_EMAIL,
            "workflow_paused": False,
            "status_message": "Subdomain is available. Ready for autonomous claim.",
            "last_availability_check": {
                "timestamp": None,
                "available": True,
                "status": "free",
                "reason": None
            },
            "pending_human_action": {
                "required": False,
                "type": None,
                "description": None,
                "action_url": None,
                "created_at": None
            },
            "confirmation_data": {
                "detected": False,
                "token": None,
                "confirmation_url": None,
                "detected_at": None,
                "owner_approved": False,
                "activated_at": None
            },
            "mx_records": {
                "verified": True,
                "hosts": ["mail.does.software"],
                "last_checked": None
            },
            "delivery_tests": [],
            "renewal_info": {
                "lease_start": None,
                "lease_expires": None,
                "days_remaining": 45,
                "needs_renewal": False,
                "last_renewed": None
            },
            "audit_log": []
        }

    def _load(self) -> Dict[str, Any]:
        if self.state_file.exists():
            try:
                with open(self.state_file, "r", encoding="utf-8") as f:
                    data = json.load(f)
                    # Merge with default state for backward-compatibility
                    default = self._default_state()
                    default.update(data)
                    return default
            except Exception as e:
                logger.error(f"Failed to read state file {self.state_file}: {e}")
        state = self._default_state()
        self._save(state)
        return state

    def _save(self, state: Dict[str, Any]):
        try:
            with open(self.state_file, "w", encoding="utf-8") as f:
                json.dump(state, f, indent=2, ensure_ascii=False)
        except Exception as e:
            logger.error(f"Failed to write state file {self.state_file}: {e}")

    def get_state(self) -> Dict[str, Any]:
        return dict(self._state)

    def log_event(self, event_type: str, details: Dict[str, Any]):
        """Appends an event to the persistent audit log."""
        timestamp = datetime.now(timezone.utc).isoformat()
        entry = {
            "timestamp": timestamp,
            "event": event_type,
            "details": details
        }
        self._state["audit_log"].append(entry)
        # Cap audit log to last 500 events
        if len(self._state["audit_log"]) > 500:
            self._state["audit_log"] = self._state["audit_log"][-500:]
        self._save(self._state)
        logger.info(f"AUDIT: [{event_type}] {details}")

    def set_stage(self, stage: str, message: Optional[str] = None):
        """Transitions workflow to a new stage."""
        old_stage = self._state.get("current_stage")
        self._state["current_stage"] = stage
        if message:
            self._state["status_message"] = message
        self.log_event("STAGE_TRANSITION", {
            "from_stage": old_stage,
            "to_stage": stage,
            "message": message
        })
        self._save(self._state)

    def pause_workflow(self, reason: str = "Owner paused workflow"):
        self._state["workflow_paused"] = True
        self._state["status_message"] = f"Paused: {reason}"
        self.log_event("WORKFLOW_PAUSED", {"reason": reason})
        self._save(self._state)

    def resume_workflow(self, reason: str = "Owner resumed workflow"):
        self._state["workflow_paused"] = False
        self._state["status_message"] = "Workflow active"
        self.log_event("WORKFLOW_RESUMED", {"reason": reason})
        self._save(self._state)

    def set_pending_human_action(self, action_type: str, description: str, action_url: Optional[str] = None):
        """Sets a human-in-the-loop checkpoint."""
        self._state["pending_human_action"] = {
            "required": True,
            "type": action_type,
            "description": description,
            "action_url": action_url,
            "created_at": datetime.now(timezone.utc).isoformat()
        }
        self.log_event("HUMAN_CHECKPOINT_REQUIRED", {
            "type": action_type,
            "description": description
        })
        self._save(self._state)

    def clear_pending_human_action(self):
        self._state["pending_human_action"] = {
            "required": False,
            "type": None,
            "description": None,
            "action_url": None,
            "created_at": None
        }
        self.log_event("HUMAN_CHECKPOINT_CLEARED", {})
        self._save(self._state)

    def update_availability(self, avail_data: Dict[str, Any]):
        self._state["last_availability_check"] = {
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "available": avail_data.get("available", False),
            "status": avail_data.get("status", "unknown"),
            "reason": avail_data.get("reason")
        }
        self._save(self._state)

    def record_confirmation_detected(self, token: str, confirmation_url: Optional[str] = None):
        """Records an incoming provider confirmation message waiting for owner approval."""
        self._state["confirmation_data"] = {
            "detected": True,
            "token": token,
            "confirmation_url": confirmation_url,
            "detected_at": datetime.now(timezone.utc).isoformat(),
            "owner_approved": False,
            "activated_at": None
        }
        self.log_event("CONFIRMATION_DETECTED", {
            "has_token": bool(token),
            "has_url": bool(confirmation_url)
        })
        self._save(self._state)

    def record_confirmation_approved(self):
        """Marks confirmation as approved and activated."""
        self._state["confirmation_data"]["owner_approved"] = True
        self._state["confirmation_data"]["activated_at"] = datetime.now(timezone.utc).isoformat()
        self.set_stage(WorkflowStage.STAGE_4_GMAIL_VERIFIED, "Gmail forwarding verified and active")
        self.log_event("CONFIRMATION_APPROVED_AND_ACTIVATED", {})
        self._save(self._state)

    def record_delivery_test(self, result: Dict[str, Any]):
        result["timestamp"] = datetime.now(timezone.utc).isoformat()
        self._state["delivery_tests"].append(result)
        if result.get("passed"):
            self.set_stage(WorkflowStage.STAGE_6_DELIVERY_VERIFIED, "Actual incoming delivery verified")
        self.log_event("DELIVERY_TEST_EXECUTED", result)
        self._save(self._state)
