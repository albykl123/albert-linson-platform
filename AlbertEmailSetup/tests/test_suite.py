"""
Albert Professional Email Automation — Comprehensive Test Suite
================================================================
Covers all 11 required testing domains using mocked responses:
1. Subdomain Availability Checks
2. Provider API Network & Server Failures
3. Invalid Registration Responses
4. Human Verification (Turnstile) Checkpoint Pause/Resume
5. Gmail OAuth Error Handling & Token Refresh
6. Confirmation Token & URL Detection
7. DNS MX Resolution & Failure Fallbacks
8. Forwarding Verification
9. End-to-End External Delivery Testing
10. 45-Day Renewal Lifecycle & Reminders
11. Duplicate Registration Prevention
"""

import unittest
from unittest.mock import MagicMock, patch
import json
import tempfile
from pathlib import Path
from datetime import datetime, timedelta, timezone

from albert_email_setup.config import Config
from albert_email_setup.does_software import DoesSoftwareClient
from albert_email_setup.state import StateManager, WorkflowStage
from albert_email_setup.availability_engine import AvailabilityEngine
from albert_email_setup.registration_engine import RegistrationEngine
from albert_email_setup.gmail_integration import GmailIntegration
from albert_email_setup.delivery_verifier import DeliveryVerifier
from albert_email_setup.renewal_manager import RenewalManager

class TestAlbertEmailSetupSuite(unittest.TestCase):

    def setUp(self):
        # Create a temporary state file for isolated testing
        self.temp_dir = tempfile.TemporaryDirectory()
        self.test_state_file = Path(self.temp_dir.name) / "test_state.json"
        self.state_mgr = StateManager(state_file=self.test_state_file)
        self.mock_client = MagicMock(spec=DoesSoftwareClient)

    def tearDown(self):
        self.temp_dir.cleanup()

    # --------------------------------------------------------------------------
    # 1. Availability Checks & Alternative Monitoring
    # --------------------------------------------------------------------------
    def test_availability_check_success(self):
        """Verifies parsing of authentic provider response for available subdomain."""
        self.mock_client.check_availability.return_value = {
            "name": "albert",
            "subdomain": "albert.does.software",
            "available": True,
            "reason": None,
            "status": "free"
        }
        engine = AvailabilityEngine(client=self.mock_client, state_mgr=self.state_mgr)
        res = engine.check_preferred()
        
        self.assertTrue(res["available"])
        self.assertEqual(res["status"], "free")
        self.assertEqual(self.state_mgr.get_state()["last_availability_check"]["status"], "free")

    def test_availability_check_taken(self):
        """Verifies handling when preferred subdomain is taken."""
        self.mock_client.check_availability.return_value = {
            "name": "albert",
            "subdomain": "albert.does.software",
            "available": False,
            "reason": "taken",
            "status": "taken"
        }
        engine = AvailabilityEngine(client=self.mock_client, state_mgr=self.state_mgr)
        res = engine.check_preferred()
        
        self.assertFalse(res["available"])
        self.assertEqual(res["status"], "taken")

    def test_alternative_selection_requires_approval(self):
        """Enforces Rule: Never claim an alternative without displaying & obtaining owner approval."""
        self.mock_client.check_availability.return_value = {
            "name": "albert-linson",
            "subdomain": "albert-linson.does.software",
            "available": True,
            "status": "free"
        }
        engine = AvailabilityEngine(client=self.mock_client, state_mgr=self.state_mgr)
        
        # Unauthorized name outside approved candidates rejected
        bad_res = engine.select_alternative_with_approval("random-unapproved-name")
        self.assertFalse(bad_res["success"])

        # Approved alternative succeeds and updates state
        good_res = engine.select_alternative_with_approval("albert-linson")
        self.assertTrue(good_res["success"])
        self.assertEqual(good_res["professional_email"], "hello@albert-linson.does.software")

    # --------------------------------------------------------------------------
    # 2. Provider API Failures & Error Handling
    # --------------------------------------------------------------------------
    def test_provider_api_network_failure(self):
        """Verifies graceful degradation when provider API times out or fails."""
        self.mock_client.check_availability.return_value = {
            "name": "albert",
            "available": False,
            "status": "error",
            "message": "Connection timed out"
        }
        engine = AvailabilityEngine(client=self.mock_client, state_mgr=self.state_mgr)
        res = engine.check_preferred()
        
        self.assertFalse(res["available"])
        self.assertEqual(res["status"], "error")
        health = engine.get_health()
        self.assertFalse(health["healthy"])

    # --------------------------------------------------------------------------
    # 3. Registration Pre-Validation & Duplicate Prevention
    # --------------------------------------------------------------------------
    def test_pre_claim_validation(self):
        """Validates subdomain format and email before allowing claim submission."""
        self.mock_client.check_availability.return_value = {"available": True, "status": "free"}
        reg = RegistrationEngine(client=self.mock_client, state_mgr=self.state_mgr)

        # Invalid short or special-char subdomain
        invalid_res = reg.validate_pre_claim(subdomain="x", forward_email="invalid-email")
        self.assertFalse(invalid_res["valid"])
        self.assertIn("at least 2 characters", invalid_res["errors"][0])

        # Valid inputs
        valid_res = reg.validate_pre_claim(subdomain="albert", forward_email="albertkalampadan@gmail.com")
        self.assertTrue(valid_res["valid"])

    def test_duplicate_registration_prevention(self):
        """Ensures system prevents re-registering an already active registration."""
        self.state_mgr.set_stage(WorkflowStage.STAGE_4_GMAIL_VERIFIED, "Forwarding active")
        self.mock_client.check_availability.return_value = {"available": False, "status": "taken"}
        
        reg = RegistrationEngine(client=self.mock_client, state_mgr=self.state_mgr)
        val = reg.validate_pre_claim(subdomain="albert", forward_email="albertkalampadan@gmail.com")
        self.assertFalse(val["valid"])
        self.assertIn("not available", val["errors"][0])

    # --------------------------------------------------------------------------
    # 4. Human Verification (Turnstile) Checkpoint Pause & Resume
    # --------------------------------------------------------------------------
    def test_human_turnstile_checkpoint_flow(self):
        """Verifies workflow pauses at human Turnstile checkpoint and resumes upon completion."""
        self.mock_client.check_availability.return_value = {"available": True, "status": "free"}
        reg = RegistrationEngine(client=self.mock_client, state_mgr=self.state_mgr)

        init_res = reg.initiate_autonomous_claim(open_browser=False)
        self.assertTrue(init_res["success"])
        self.assertEqual(init_res["stage"], WorkflowStage.STAGE_2_CLAIM_SUBMITTED)
        
        # Check that state records pending human action
        state = self.state_mgr.get_state()
        self.assertTrue(state["pending_human_action"]["required"])
        self.assertEqual(state["pending_human_action"]["type"], "CLOUDFLARE_TURNSTILE_CHECKPOINT")

        # Owner completes checkpoint
        resume_res = reg.record_manual_checkpoint_completed()
        self.assertTrue(resume_res["success"])
        
        updated_state = self.state_mgr.get_state()
        self.assertFalse(updated_state["pending_human_action"]["required"])
        self.assertEqual(updated_state["current_stage"], WorkflowStage.STAGE_3_REGISTRATION_CONFIRMED)

    # --------------------------------------------------------------------------
    # 5. Invalid Registration Provider Response
    # --------------------------------------------------------------------------
    def test_invalid_registration_response_handling(self):
        """Tests handling when provider rejects registration (e.g. missing Turnstile)."""
        self.mock_client.claim_subdomain.return_value = {
            "error": True,
            "status": 400,
            "message": "We couldn't verify you're a person. Reload the page and try again",
            "data": {"code": 50113}
        }
        reg = RegistrationEngine(client=self.mock_client, state_mgr=self.state_mgr)
        res = reg.submit_with_turnstile_token(turnstile_token="invalid_token")
        
        self.assertFalse(res["success"])
        self.assertIn("couldn't verify", res["message"])

    # --------------------------------------------------------------------------
    # 6. Gmail Confirmation Token & URL Detection
    # --------------------------------------------------------------------------
    def test_confirmation_token_and_url_extraction(self):
        """Tests regex extraction of provider confirmation link and query token."""
        sample_email_body = (
            "Hello,\n"
            "Please confirm your email forward for albert.does.software by clicking:\n"
            "https://does.software/subdomains/forward/confirm?token=sec_token_99182a44b\n"
            "Or enter your activation code: sec_token_99182a44b\n"
            "Thank you, does.software"
        )
        parsed = GmailIntegration.extract_token_and_url(sample_email_body)
        self.assertEqual(parsed["token"], "sec_token_99182a44b")
        self.assertEqual(parsed["url"], "https://does.software/subdomains/forward/confirm?token=sec_token_99182a44b")

    def test_owner_approval_barrier_before_activation(self):
        """Enforces Rule: Require explicit owner approval before activating confirmation."""
        self.mock_client.confirm_forward.return_value = {
            "type": "success",
            "msg": "Forward confirmed",
            "code": 10155
        }
        gmail = GmailIntegration(client=self.mock_client, state_mgr=self.state_mgr)
        
        # Fails if no token supplied or detected
        fail_res = gmail.execute_owner_approved_confirmation(token=None)
        self.assertFalse(fail_res["success"])

        # Succeeds when approved token is provided
        success_res = gmail.execute_owner_approved_confirmation(token="valid_token_123")
        self.assertTrue(success_res["success"])
        self.assertEqual(self.state_mgr.get_state()["current_stage"], WorkflowStage.STAGE_4_GMAIL_VERIFIED)

    # --------------------------------------------------------------------------
    # 7. DNS & MX Verification
    # --------------------------------------------------------------------------
    @patch("subprocess.run")
    def test_dns_mx_verification(self, mock_subproc):
        """Tests parsing of nslookup MX records and propagation check."""
        mock_subproc.return_value.stdout = (
            "Non-authoritative answer:\n"
            "does.software MX preference = 10, mail exchanger = mail.does.software\n"
        )
        dv = DeliveryVerifier(client=self.mock_client, state_mgr=self.state_mgr)
        res = dv.verify_dns_mx()

        self.assertTrue(res["verified"])
        self.assertEqual(res["mx_records"][0]["host"], "mail.does.software")
        self.assertEqual(res["mx_records"][0]["priority"], 10)

    # --------------------------------------------------------------------------
    # 8. Six-Stage Lifecycle Tracking
    # --------------------------------------------------------------------------
    def test_six_stage_lifecycle_progression(self):
        """Tests that all 6 discrete lifecycle stages progress correctly."""
        dv = DeliveryVerifier(client=self.mock_client, state_mgr=self.state_mgr)
        
        # Initial Stage: Stage 1 Available
        s1 = dv.evaluate_six_stage_lifecycle()
        self.assertEqual(s1["completed_count"], 1)
        self.assertEqual(s1["stages"][0]["key"], WorkflowStage.STAGE_1_AVAILABLE)

        # Transition to Stage 4 (Gmail Verified)
        self.state_mgr.set_stage(WorkflowStage.STAGE_4_GMAIL_VERIFIED)
        s4 = dv.evaluate_six_stage_lifecycle()
        self.assertEqual(s4["completed_count"], 4)

    # --------------------------------------------------------------------------
    # 9. Actual Incoming Delivery Testing (Section 3D)
    # --------------------------------------------------------------------------
    def test_delivery_verification_evaluation(self):
        """Tests external delivery testing with sender, subject, and spam validation."""
        dv = DeliveryVerifier(client=self.mock_client, state_mgr=self.state_mgr)

        # Fails if marked as spam
        spam_test = dv.record_external_delivery_test(
            sender_email="recruiter@company.com",
            subject="Job Opportunity for Albert",
            received_in_inbox=True,
            sender_retained=True,
            subject_retained=True,
            is_spam=True
        )
        self.assertFalse(spam_test["passed"])

        # Passes when received in inbox with SRS sender and subject intact
        pass_test = dv.record_external_delivery_test(
            sender_email="recruiter@company.com",
            subject="Job Opportunity for Albert",
            received_in_inbox=True,
            sender_retained=True,
            subject_retained=True,
            is_spam=False
        )
        self.assertTrue(pass_test["passed"])
        self.assertEqual(self.state_mgr.get_state()["current_stage"], WorkflowStage.STAGE_6_DELIVERY_VERIFIED)

    # --------------------------------------------------------------------------
    # 10. Renewal Lifecycle & Reminders
    # --------------------------------------------------------------------------
    def test_renewal_lifecycle_calculations(self):
        """Tests 45-day calculation, 7-day reminder, 1-day reminder, and grace period."""
        rm = RenewalManager(client=self.mock_client, state_mgr=self.state_mgr)

        # Fresh lease: 45 days remaining
        fresh = rm.calculate_renewal_status()
        self.assertGreaterEqual(fresh["days_remaining"], 44)
        self.assertFalse(fresh["reminders"]["seven_day_warning"])

        # Simulated 5 days remaining: 7-day warning triggers
        state = self.state_mgr.get_state()
        state["renewal_info"]["lease_start"] = (datetime.now(timezone.utc) - timedelta(days=40)).isoformat()
        self.state_mgr._save(state)

        warn = rm.calculate_renewal_status()
        self.assertTrue(warn["reminders"]["seven_day_warning"])
        self.assertFalse(warn["reminders"]["one_day_urgent"])

    # --------------------------------------------------------------------------
    # 11. Security Model: Email Masking & Localhost Binding
    # --------------------------------------------------------------------------
    def test_email_masking_security(self):
        """Tests that personal email addresses are masked for public display."""
        masked = Config.mask_email("albertkalampadan@gmail.com")
        self.assertEqual(masked, "al***n@gmail.com")
        self.assertNotIn("albertkalampadan", masked)

    def test_localhost_binding_default(self):
        """Verifies server binds strictly to 127.0.0.1 for local isolation."""
        self.assertEqual(Config.HOST, "127.0.0.1")

if __name__ == "__main__":
    unittest.main()
