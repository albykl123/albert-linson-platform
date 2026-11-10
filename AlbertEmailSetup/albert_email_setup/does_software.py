"""
Official Provider Client for does.software (API v1).
Authentic, zero-fabrication integration module based on does.software API specs.
"""

import json
import ssl
import urllib.request
import urllib.error
from typing import Dict, Any, List, Optional
from .logger import get_logger
from .config import Config

logger = get_logger("DoesSoftwareClient")

class DoesSoftwareClient:
    """Client for does.software v1 REST API."""

    API_BASE = Config.PROVIDER_FREE_TIER["api_base"]
    USER_AGENT = "AlbertEmailSetup/1.0 (DevOps Email Automation; +https://does.software)"

    def __init__(self, api_base: Optional[str] = None):
        self.api_base = api_base or self.API_BASE
        # Resilient SSL context for modern TLS
        self.ssl_ctx = ssl.create_default_context()

    def _request(
        self,
        endpoint: str,
        method: str = "GET",
        data: Optional[Dict[str, Any]] = None,
        timeout: int = 12
    ) -> Dict[str, Any]:
        """Performs HTTP request against does.software API."""
        url = f"{self.api_base}{endpoint}"
        headers = {
            "User-Agent": self.USER_AGENT,
            "Accept": "application/json",
        }
        encoded_data = None
        if data is not None:
            headers["Content-Type"] = "application/json"
            encoded_data = json.dumps(data).encode("utf-8")

        req = urllib.request.Request(url, data=encoded_data, headers=headers, method=method)
        try:
            with urllib.request.urlopen(req, context=self.ssl_ctx, timeout=timeout) as resp:
                resp_bytes = resp.read()
                return json.loads(resp_bytes.decode("utf-8"))
        except urllib.error.HTTPError as e:
            raw_err = e.read().decode("utf-8", errors="ignore")
            logger.warning(f"HTTPError {e.code} on {endpoint}: {raw_err}")
            try:
                err_json = json.loads(raw_err)
                return {"error": True, "status": e.code, "data": err_json, "message": err_json.get("msg", str(e))}
            except Exception:
                return {"error": True, "status": e.code, "message": raw_err or str(e)}
        except Exception as e:
            logger.error(f"Network error accessing {url}: {e}")
            return {"error": True, "status": 0, "message": str(e)}

    def check_availability(self, name: str) -> Dict[str, Any]:
        """
        Queries official API: GET /v1/subdomains/availability?name={name}
        Returns availability status: free, review, taken, or reserved.
        """
        clean_name = name.strip().lower()
        res = self._request(f"/subdomains/availability?name={clean_name}")
        if res.get("error"):
            return {
                "name": clean_name,
                "available": False,
                "status": "error",
                "message": res.get("message")
            }
        
        payload = res.get("data", {})
        is_available = payload.get("available", False)
        reason = payload.get("reason")
        status_label = "free" if is_available else (reason or "taken")
        
        return {
            "name": clean_name,
            "subdomain": f"{clean_name}.{Config.PROVIDER_DOMAIN}",
            "available": is_available,
            "reason": reason,
            "status": status_label,
            "raw_response": res
        }

    def check_all_candidates(self, candidates: Optional[List[str]] = None) -> List[Dict[str, Any]]:
        """Checks target subdomain and all approved alternatives."""
        targets = candidates or Config.SUBDOMAIN_CANDIDATES
        results = []
        for name in targets:
            results.append(self.check_availability(name))
        return results

    def claim_subdomain(
        self,
        requested_subdomain: str,
        forward_email: str,
        guest_email: Optional[str] = None,
        target_redirect: Optional[str] = None,
        turnstile_token: Optional[str] = None,
        accept_terms: bool = True
    ) -> Dict[str, Any]:
        """
        Official claim endpoint: POST /v1/requests/
        Payload:
        {
            "requestedSubdomain": "albert",
            "forwardEmail": "...",
            "guestEmail": "...",
            "target": "...",
            "acceptTerms": true,
            "turnstileToken": "..."
        }
        Requires Cloudflare Turnstile human verification token.
        """
        payload: Dict[str, Any] = {
            "requestedSubdomain": requested_subdomain.strip().lower(),
            "acceptTerms": accept_terms,
            "forwardEmail": forward_email.strip()
        }
        guest = guest_email or forward_email
        payload["guestEmail"] = guest.strip()

        if target_redirect:
            payload["target"] = target_redirect.strip()

        if turnstile_token:
            payload["turnstileToken"] = turnstile_token.strip()

        logger.info(f"Submitting subdomain request for '{requested_subdomain}.{Config.PROVIDER_DOMAIN}'...")
        res = self._request("/requests/", method="POST", data=payload)
        return res

    def confirm_forward(self, token: str) -> Dict[str, Any]:
        """
        Confirms forwarding address via official endpoint:
        POST /v1/subdomains/forward/confirm
        Payload: { "token": token }
        """
        clean_token = token.strip()
        logger.info("Attempting forward confirmation via provider token...")
        return self._request("/subdomains/forward/confirm", method="POST", data={"token": clean_token})

    def renew_by_token(self, token: str) -> Dict[str, Any]:
        """
        Performs 45-day renewal via official endpoint:
        POST /v1/subdomains/renew-by-token
        Payload: { "token": token }
        """
        clean_token = token.strip()
        logger.info("Attempting subdomain renewal via token...")
        return self._request("/subdomains/renew-by-token", method="POST", data={"token": clean_token})

    def join_waitlist(self, name: str, email: str) -> Dict[str, Any]:
        """
        Joins waitlist if a name is taken:
        POST /v1/subdomains/waitlist
        Payload: { "name": name, "email": email }
        """
        logger.info(f"Joining waitlist for '{name}'...")
        return self._request("/subdomains/waitlist", method="POST", data={"name": name.strip(), "email": email.strip()})
