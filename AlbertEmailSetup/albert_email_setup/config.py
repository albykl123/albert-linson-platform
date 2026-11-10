"""
Configuration module for Albert Professional Email Automation.
Loads environment variables securely, defines system constants, and masks sensitive data.
"""

import os
import re
from pathlib import Path
from typing import Dict, Any, List, Optional

# Try loading .env if python-dotenv is installed
try:
    from dotenv import load_dotenv
    env_path = Path(__file__).resolve().parent.parent / ".env"
    if env_path.exists():
        load_dotenv(dotenv_path=env_path)
except ImportError:
    pass

class Config:
    BASE_DIR = Path(__file__).resolve().parent.parent
    STATE_FILE = BASE_DIR / "claim_state.json"

    # 1. Target Subdomain & Email Configuration
    TARGET_SUBDOMAIN: str = os.getenv("TARGET_SUBDOMAIN", "albert").strip().lower()
    PROVIDER_DOMAIN: str = os.getenv("PROVIDER_DOMAIN", "does.software").strip().lower()
    PREFERRED_ALIAS: str = os.getenv("PREFERRED_ALIAS", "hello").strip().lower()

    @classmethod
    def professional_email(cls, subdomain: Optional[str] = None) -> str:
        sub = (subdomain or cls.TARGET_SUBDOMAIN).lower()
        return f"{cls.PREFERRED_ALIAS}@{sub}.{cls.PROVIDER_DOMAIN}"

    @classmethod
    def full_domain(cls, subdomain: Optional[str] = None) -> str:
        sub = (subdomain or cls.TARGET_SUBDOMAIN).lower()
        return f"{sub}.{cls.PROVIDER_DOMAIN}"

    # 2. Forwarding Destination (Personal Gmail)
    PERSONAL_FORWARD_EMAIL: str = os.getenv(
        "PERSONAL_FORWARD_EMAIL", 
        "albertkalampadan@gmail.com"
    ).strip()

    # 3. Portfolio Web Redirect URL
    TARGET_REDIRECT_URL: str = os.getenv(
        "TARGET_REDIRECT_URL", 
        "https://albert-linson-platform.albertkalampadan.workers.dev"
    ).strip()

    # 4. Server settings (Security: Bound to 127.0.0.1 by default)
    PORT: int = int(os.getenv("PORT", "3050"))
    HOST: str = os.getenv("HOST", "127.0.0.1")

    # 5. Autonomous Availability Engine Settings
    AUTO_MONITOR_INTERVAL_SECONDS: int = int(os.getenv("AUTO_MONITOR_INTERVAL_SECONDS", "60"))
    ENABLE_BACKGROUND_MONITOR: bool = os.getenv("ENABLE_BACKGROUND_MONITOR", "true").lower() in ("true", "1", "yes")

    # 6. Optional Google OAuth Settings for Automated Gmail Confirmation
    GMAIL_CLIENT_ID: str = os.getenv("GMAIL_CLIENT_ID", "").strip()
    GMAIL_CLIENT_SECRET: str = os.getenv("GMAIL_CLIENT_SECRET", "").strip()
    GMAIL_REFRESH_TOKEN: str = os.getenv("GMAIL_REFRESH_TOKEN", "").strip()
    GMAIL_SCOPES: List[str] = ["https://www.googleapis.com/auth/gmail.readonly"]

    # 7. Security Tokens & Leases
    CONFIRMATION_TOKEN: str = os.getenv("CONFIRMATION_TOKEN", "").strip()
    RENEWAL_TOKEN: str = os.getenv("RENEWAL_TOKEN", "").strip()
    SUBDOMAIN_ID: str = os.getenv("SUBDOMAIN_ID", "").strip()
    LEASE_START_DATE: str = os.getenv("LEASE_START_DATE", "").strip()

    # 8. Provider Limits & Lifecycles (does.software Free Plan)
    PROVIDER_FREE_TIER = {
        "provider_name": "does.software",
        "provider_url": "https://does.software",
        "guides_url": "https://does.software/guides/",
        "api_base": "https://api.does.software/v1",
        "turnstile_site_key": "0x4AAAAAAFqY1Dkd_WNpBawx",
        "cost": "€0.00 (100% Free Forever, No Credit Card)",
        "subdomain_limit": 1,
        "email_forward_limit": 1,
        "path_redirect_limit": 2,
        "renewal_interval_days": 45,
        "renewal_reminders": ["7 days before", "1 day before"],
        "grace_period_days": 3,
        "forwarding_type": "Receive-only routing (incoming mail forwarded to destination inbox)",
        "dns_management": "Fully managed by provider (MX: mail.does.software, Priority: 10)",
        "send_mail_from_alias": "Free via Gmail 'Send mail as' using external SMTP relay (e.g. Brevo/Resend/Gmail SMTP)"
    }

    # 9. Preferred Subdomain & Alternatives
    SUBDOMAIN_CANDIDATES: List[str] = [
        "albert",
        "albert-linson",
        "albertkalampadan",
        "alby",
        "albert-dev"
    ]

    @classmethod
    def mask_email(cls, email: str) -> str:
        """
        Masks an email address for secure UI presentation.
        e.g., 'albertkalampadan@gmail.com' -> 'al***n@gmail.com'
        """
        if not email or "@" not in email:
            return "Not Configured"
        parts = email.split("@")
        name, domain = parts[0], parts[1]
        if len(name) <= 2:
            masked_name = name[0] + "*"
        elif len(name) <= 4:
            masked_name = name[0] + "**" + name[-1]
        else:
            masked_name = name[:2] + "***" + name[-1]
        return f"{masked_name}@{domain}"

    @classmethod
    def to_dict(cls) -> Dict[str, Any]:
        return {
            "target_subdomain": cls.TARGET_SUBDOMAIN,
            "provider_domain": cls.PROVIDER_DOMAIN,
            "preferred_alias": cls.PREFERRED_ALIAS,
            "professional_email": cls.professional_email(),
            "full_domain": cls.full_domain(),
            "forward_destination_masked": cls.mask_email(cls.PERSONAL_FORWARD_EMAIL),
            "target_redirect_url": cls.TARGET_REDIRECT_URL,
            "provider_free_tier": cls.PROVIDER_FREE_TIER,
            "subdomain_candidates": cls.SUBDOMAIN_CANDIDATES,
            "has_confirmation_token": bool(cls.CONFIRMATION_TOKEN),
            "has_renewal_token": bool(cls.RENEWAL_TOKEN),
            "has_gmail_oauth": bool(cls.GMAIL_CLIENT_ID and cls.GMAIL_CLIENT_SECRET),
            "auto_monitor_interval": cls.AUTO_MONITOR_INTERVAL_SECONDS
        }
