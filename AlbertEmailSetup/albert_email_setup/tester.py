"""
Email Forwarding Testing & Validation Suite.
Implements the 5-step end-to-end verification procedure specified in Section 3D.
"""

from typing import Dict, Any, List
from .config import Config

class EmailForwardingTester:
    """Manages the verification checklist and testing protocols for external email routing."""

    @classmethod
    def get_test_protocol(cls, subdomain: str = None, destination: str = None) -> Dict[str, Any]:
        target_sub = subdomain or Config.TARGET_SUBDOMAIN
        dest_email = destination or Config.PERSONAL_FORWARD_EMAIL
        prof_email = Config.professional_email(target_sub)
        masked_dest = Config.mask_email(dest_email)

        steps = [
            {
                "step_number": 1,
                "title": "Send External Test Email",
                "instructions": (
                    f"Open an external email account (e.g., secondary Gmail or Outlook) and compose a new email.\n"
                    f"To: {prof_email}\n"
                    f"Subject: [Test] Portfolio Identity Verification #001\n"
                    f"Body: Hello Albert, this is a delivery confirmation test for the professional email identity."
                ),
                "expected_outcome": "Email is dispatched successfully without immediate bounce."
            },
            {
                "step_number": 2,
                "title": "Confirm Delivery at Forwarding Destination",
                "instructions": (
                    f"Open the primary inbox for {masked_dest}.\n"
                    f"Look for the incoming message sent to {prof_email}."
                ),
                "expected_outcome": "Message appears in inbox within 5–30 seconds."
            },
            {
                "step_number": 3,
                "title": "Verify Sender & Subject Integrity",
                "instructions": (
                    "Inspect the received email headers and details:\n"
                    "• Ensure the original sender's address is preserved (via SRS - Sender Rewriting Scheme).\n"
                    "• Ensure the subject line '[Test] Portfolio Identity Verification #001' remains intact.\n"
                    "• Check that clicking 'Reply' addresses the original sender, not the forwarding daemon."
                ),
                "expected_outcome": "Original sender and subject line are 100% preserved."
            },
            {
                "step_number": 4,
                "title": "Spam & Deliverability Assessment",
                "instructions": (
                    "If the email does not appear in the Primary Inbox, check the 'Spam / Junk' folder.\n"
                    "• If delivered to Spam: Click 'Report not spam'.\n"
                    "• Best practice: Add 'hello@albert.does.software' to your Google Contacts to guarantee future delivery to Primary."
                ),
                "expected_outcome": "Email delivered to Primary tab or marked as safe."
            },
            {
                "step_number": 5,
                "title": "Record Final Result",
                "instructions": "Mark the verification test checklist as complete in the dashboard.",
                "expected_outcome": "Final Success Condition fulfilled: zero-cost professional email routing active."
            }
        ]

        return {
            "professional_email": prof_email,
            "forwarding_destination": dest_email,
            "forwarding_destination_masked": masked_dest,
            "steps": steps,
            "criteria": {
                "free_tier_maintained": True,
                "zero_domain_purchase": True,
                "zero_hosting_cost": True,
                "gmail_password_required": False
            }
        }

    @classmethod
    def evaluate_checklist(cls, items: Dict[str, bool]) -> Dict[str, Any]:
        """Evaluates completion status and outputs clear pass/fail status."""
        required_keys = [
            "provider_verified",
            "subdomain_available",
            "subdomain_claimed",
            "destination_verified",
            "external_test_sent",
            "delivery_confirmed"
        ]

        completed = [k for k in required_keys if items.get(k, False)]
        is_all_passed = len(completed) == len(required_keys)

        return {
            "passed": is_all_passed,
            "score": f"{len(completed)}/{len(required_keys)}",
            "percentage": int((len(completed) / len(required_keys)) * 100),
            "status_label": "PASSED - PRODUCTION READY" if is_all_passed else "IN PROGRESS",
            "completed_items": completed,
            "pending_items": [k for k in required_keys if not items.get(k, False)]
        }
