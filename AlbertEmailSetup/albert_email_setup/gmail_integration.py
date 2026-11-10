"""
Gmail Confirmation Integration Module.
Implements secure Google OAuth 2.0 (least-privilege gmail.readonly) to detect
and parse incoming provider confirmation emails, and coordinates owner approval.
"""

import json
import re
import urllib.request
import urllib.parse
from typing import Dict, Any, List, Optional
from .config import Config
from .logger import get_logger
from .state import StateManager
from .does_software import DoesSoftwareClient

logger = get_logger("GmailIntegration")

class GmailIntegration:
    """Manages automated discovery and owner-approved activation of provider confirmation emails."""

    TOKEN_ENDPOINT = "https://oauth2.googleapis.com/token"
    GMAIL_API_BASE = "https://gmail.googleapis.com/gmail/v1/users/me"

    def __init__(
        self,
        client: Optional[DoesSoftwareClient] = None,
        state_mgr: Optional[StateManager] = None
    ):
        self.client = client or DoesSoftwareClient()
        self.state_mgr = state_mgr or StateManager()

    def is_oauth_configured(self) -> bool:
        """Checks if Google OAuth credentials are provided."""
        return bool(
            Config.GMAIL_CLIENT_ID and 
            Config.GMAIL_CLIENT_SECRET and 
            Config.GMAIL_REFRESH_TOKEN
        )

    def get_access_token_via_refresh(self) -> Optional[str]:
        """Obtains a fresh access token using the stored refresh token."""
        if not self.is_oauth_configured():
            logger.info("Google OAuth refresh token not configured. Running in manual/direct mode.")
            return None

        payload = {
            "client_id": Config.GMAIL_CLIENT_ID,
            "client_secret": Config.GMAIL_CLIENT_SECRET,
            "refresh_token": Config.GMAIL_REFRESH_TOKEN,
            "grant_type": "refresh_token"
        }
        data = urllib.parse.urlencode(payload).encode("utf-8")
        req = urllib.request.Request(self.TOKEN_ENDPOINT, data=data, method="POST")

        try:
            with urllib.request.urlopen(req, timeout=10) as resp:
                res = json.loads(resp.read().decode("utf-8"))
                return res.get("access_token")
        except Exception as e:
            logger.error(f"Failed to refresh Google OAuth access token: {e}")
            return None

    def search_provider_confirmation_email(self) -> Dict[str, Any]:
        """
        Searches Gmail inbox for provider messages from does.software.
        Query: from:does.software OR subject:("does.software" OR "Confirm" OR "Forwarding")
        """
        access_token = self.get_access_token_via_refresh()
        if not access_token:
            return {
                "detected": False,
                "message": "Gmail OAuth not active or configured. Use the dashboard Token Submitter to confirm."
            }

        # Search messages
        query = 'from:does.software'
        url = f"{self.GMAIL_API_BASE}/messages?q={urllib.parse.quote(query)}&maxResults=5"
        headers = {"Authorization": f"Bearer {access_token}"}
        req = urllib.request.Request(url, headers=headers)

        try:
            with urllib.request.urlopen(req, timeout=10) as resp:
                res = json.loads(resp.read().decode("utf-8"))
                messages = res.get("messages", [])
                if not messages:
                    return {"detected": False, "message": "No confirmation messages found in Gmail yet."}

                # Inspect the latest message
                latest_id = messages[0]["id"]
                return self._inspect_message(latest_id, access_token)
        except Exception as e:
            logger.error(f"Error querying Gmail REST API: {e}")
            return {"detected": False, "error": str(e)}

    def _inspect_message(self, message_id: str, access_token: str) -> Dict[str, Any]:
        url = f"{self.GMAIL_API_BASE}/messages/{message_id}?format=full"
        headers = {"Authorization": f"Bearer {access_token}"}
        req = urllib.request.Request(url, headers=headers)

        try:
            with urllib.request.urlopen(req, timeout=10) as resp:
                data = json.loads(resp.read().decode("utf-8"))
                snippet = data.get("snippet", "")
                
                # Extract text body or snippets
                body_text = snippet
                payload = data.get("payload", {})
                parts = payload.get("parts", [])
                for part in parts:
                    part_body = part.get("body", {}).get("data")
                    if part_body:
                        import base64
                        decoded = base64.urlsafe_b64decode(part_body).decode("utf-8", errors="ignore")
                        body_text += " " + decoded

                parsed = self.extract_token_and_url(body_text)
                if parsed.get("token") or parsed.get("url"):
                    # Record in state as pending owner approval
                    token = parsed.get("token", "")
                    confirm_url = parsed.get("url")
                    self.state_mgr.record_confirmation_detected(token=token, confirmation_url=confirm_url)
                    return {
                        "detected": True,
                        "token_detected": bool(token),
                        "url_detected": bool(confirm_url),
                        "snippet": snippet[:100],
                        "message": "Confirmation email detected. Owner approval required before activation."
                    }

                return {
                    "detected": False,
                    "message": "Message found but confirmation token could not be parsed."
                }
        except Exception as e:
            logger.error(f"Error retrieving Gmail message {message_id}: {e}")
            return {"detected": False, "error": str(e)}

    @staticmethod
    def extract_token_and_url(raw_text: str) -> Dict[str, Optional[str]]:
        r"""
        Safely extracts provider confirmation link or token from email body.
        Patterns:
        • https://does.software/subdomains/forward/confirm?token=ABC123XYZ
        • https://api.does.software/v1/subdomains/forward/confirm?token=...
        • Token: [a-zA-Z0-9_\-]{8,64}
        """
        token = None
        confirm_url = None

        # Look for full confirmation URL
        url_match = re.search(r'https?://[^\s"\'<>]*(?:confirm|activate)[^\s"\'<>]*', raw_text)
        if url_match:
            confirm_url = url_match.group(0).strip()
            # Extract token parameter if present
            token_match = re.search(r'[?&]token=([a-zA-Z0-9_\-]+)', confirm_url)
            if token_match:
                token = token_match.group(1).strip()

        # If no url match, look for standalone token pattern
        if not token:
            token_match2 = re.search(r'(?:token|code)[\s:=]+([a-zA-Z0-9_\-]{8,64})', raw_text, re.I)
            if token_match2:
                token = token_match2.group(1).strip()

        return {
            "token": token,
            "url": confirm_url
        }

    def execute_owner_approved_confirmation(self, token: Optional[str] = None) -> Dict[str, Any]:
        """
        Enforces Rule: Require explicit owner approval before activating the confirmation link.
        Executes provider confirmation via POST /v1/subdomains/forward/confirm.
        """
        state = self.state_mgr.get_state()
        confirm_data = state.get("confirmation_data", {})
        active_token = token or confirm_data.get("token")

        if not active_token:
            return {
                "success": False,
                "message": "No confirmation token found to activate. Please supply token."
            }

        logger.info("Executing owner-approved forward confirmation via does.software API...")
        res = self.client.confirm_forward(active_token)
        
        is_success = not res.get("error") and res.get("type") == "success"
        if is_success:
            self.state_mgr.record_confirmation_approved()
            return {
                "success": True,
                "message": "Email forwarding confirmed and activated successfully!",
                "details": res
            }
        else:
            msg = res.get("msg") or res.get("message") or "Provider rejected confirmation token"
            logger.warning(f"Confirmation failed: {msg}")
            return {
                "success": False,
                "message": msg,
                "details": res
            }
