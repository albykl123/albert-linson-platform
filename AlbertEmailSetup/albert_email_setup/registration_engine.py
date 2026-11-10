"""
Registration Automation Engine for AlbertEmailSetup.
Orchestrates subdomain claiming, prefilling, validation, and human Turnstile checkpoints.
"""

import urllib.parse
import webbrowser
from typing import Dict, Any, Optional
from .config import Config
from .logger import get_logger
from .does_software import DoesSoftwareClient
from .state import StateManager, WorkflowStage

logger = get_logger("RegistrationEngine")

class RegistrationEngine:
    """Manages the compliant registration lifecycle on does.software."""

    def __init__(
        self,
        client: Optional[DoesSoftwareClient] = None,
        state_mgr: Optional[StateManager] = None
    ):
        self.client = client or DoesSoftwareClient()
        self.state_mgr = state_mgr or StateManager()

    def generate_prefilled_claim_url(
        self,
        subdomain: Optional[str] = None,
        forward_email: Optional[str] = None,
        target_url: Optional[str] = None
    ) -> str:
        """
        Builds the authentic prefilled does.software registration URL.
        Parameters map directly to the provider's form fields.
        """
        sub = (subdomain or Config.TARGET_SUBDOMAIN).strip().lower()
        dest = (forward_email or Config.PERSONAL_FORWARD_EMAIL).strip()
        target = (target_url or Config.TARGET_REDIRECT_URL).strip()

        params = {
            "subdomain": sub,
            "forward": dest,
            "target": target
        }
        query = urllib.parse.urlencode(params)
        return f"{Config.PROVIDER_FREE_TIER['provider_url']}/?{query}"

    def validate_pre_claim(
        self,
        subdomain: Optional[str] = None,
        forward_email: Optional[str] = None
    ) -> Dict[str, Any]:
        """Validates all inputs before submission."""
        sub = (subdomain or Config.TARGET_SUBDOMAIN).strip().lower()
        dest = (forward_email or Config.PERSONAL_FORWARD_EMAIL).strip()

        errors = []
        if not sub or len(sub) < 2 or not sub.isalnum():
            errors.append("Subdomain must be alphanumeric and at least 2 characters.")
        
        if not dest or "@" not in dest or "." not in dest:
            errors.append("Forwarding destination email format is invalid.")

        # Check live availability
        avail = self.client.check_availability(sub)
        if not avail.get("available"):
            errors.append(f"Subdomain '{sub}' is not available (status: {avail.get('status')}).")

        is_valid = len(errors) == 0
        return {
            "valid": is_valid,
            "errors": errors,
            "subdomain": sub,
            "destination": dest,
            "availability": avail
        }

    def initiate_autonomous_claim(
        self,
        open_browser: bool = False
    ) -> Dict[str, Any]:
        """
        Step 1 of Registration:
        Validates data, builds claim payload, records STAGE_2_CLAIM_SUBMITTED,
        and sets human checkpoint for Cloudflare Turnstile completion.
        """
        val = self.validate_pre_claim()
        if not val["valid"]:
            return {
                "success": False,
                "message": f"Pre-claim validation failed: {'; '.join(val['errors'])}",
                "validation": val
            }

        claim_url = self.generate_prefilled_claim_url()
        sub = val["subdomain"]
        dest = val["destination"]

        # Update persistent state machine
        self.state_mgr.set_stage(
            WorkflowStage.STAGE_2_CLAIM_SUBMITTED,
            f"Registration initiated for '{sub}.{Config.PROVIDER_DOMAIN}'. Awaiting human Turnstile checkpoint."
        )

        self.state_mgr.set_pending_human_action(
            action_type="CLOUDFLARE_TURNSTILE_CHECKPOINT",
            description=(
                f"Cloudflare Turnstile verification required to claim '{sub}.{Config.PROVIDER_DOMAIN}'. "
                "Open the prefilled claim portal, complete the human verification check, and click Claim Subdomain."
            ),
            action_url=claim_url
        )

        self.state_mgr.log_event("CLAIM_INITIATED", {
            "subdomain": sub,
            "destination_masked": Config.mask_email(dest),
            "target_url": Config.TARGET_REDIRECT_URL,
            "claim_url": claim_url
        })

        if open_browser:
            try:
                webbrowser.open(claim_url)
                logger.info(f"Opened authentic provider claim portal in default browser: {claim_url}")
            except Exception as e:
                logger.warning(f"Could not automatically launch browser: {e}")

        return {
            "success": True,
            "stage": WorkflowStage.STAGE_2_CLAIM_SUBMITTED,
            "subdomain": sub,
            "claim_url": claim_url,
            "human_action_required": True,
            "message": "Claim initiated. Please complete the human Turnstile verification on does.software."
        }

    def submit_with_turnstile_token(
        self,
        turnstile_token: str,
        subdomain: Optional[str] = None,
        forward_email: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Direct API Submission (if Turnstile token is supplied via official widget).
        Calls POST /v1/requests/
        """
        sub = (subdomain or Config.TARGET_SUBDOMAIN).strip().lower()
        dest = (forward_email or Config.PERSONAL_FORWARD_EMAIL).strip()

        res = self.client.claim_subdomain(
            requested_subdomain=sub,
            forward_email=dest,
            target_redirect=Config.TARGET_REDIRECT_URL,
            turnstile_token=turnstile_token,
            accept_terms=True
        )

        if res.get("error"):
            logger.error(f"Provider rejected claim submission: {res.get('message')}")
            self.state_mgr.log_event("CLAIM_SUBMISSION_REJECTED", res)
            return {
                "success": False,
                "message": res.get("message", "Provider rejected claim submission"),
                "details": res
            }

        # Success: provider sends activation email
        self.state_mgr.clear_pending_human_action()
        self.state_mgr.set_stage(
            WorkflowStage.STAGE_3_REGISTRATION_CONFIRMED,
            "Registration request accepted by does.software! Awaiting Gmail confirmation."
        )
        self.state_mgr.log_event("REGISTRATION_ACCEPTED", res)

        return {
            "success": True,
            "stage": WorkflowStage.STAGE_3_REGISTRATION_CONFIRMED,
            "message": "Registration request accepted. Check personal Gmail for confirmation link or token.",
            "raw": res
        }

    def record_manual_checkpoint_completed(self):
        """Called when owner has completed Turnstile and submitted the claim on does.software."""
        self.state_mgr.clear_pending_human_action()
        self.state_mgr.set_stage(
            WorkflowStage.STAGE_3_REGISTRATION_CONFIRMED,
            "Claim form submitted by owner. Scanning Gmail for provider confirmation email..."
        )
        self.state_mgr.log_event("HUMAN_CHECKPOINT_COMPLETED", {
            "subdomain": Config.TARGET_SUBDOMAIN
        })
        return {
            "success": True,
            "stage": WorkflowStage.STAGE_3_REGISTRATION_CONFIRMED,
            "message": "Human verification completed. Now monitoring Gmail for activation message."
        }
