"""
Alternative Reference Implementation Module.
Provides comparison and technical architecture for Forward Email (forwardemail.net)
and Cloudflare Email Routing as alternative free email forwarding engines.
"""

from typing import Dict, Any, List

class ForwardEmailReference:
    """
    Reference implementation documentation and DNS blueprint for Forward Email
    (https://github.com/forwardemail/forwardemail.net).
    """

    PROVIDER_NAME = "Forward Email (forwardemail.net)"
    GITHUB_REPO = "https://github.com/forwardemail/forwardemail.net"

    @classmethod
    def get_dns_blueprint(cls, domain_or_subdomain: str, destination_email: str) -> Dict[str, Any]:
        """
        Generates standard Forward Email DNS configuration records.
        Useful if migrating or configuring a custom domain in the future.
        """
        return {
            "provider": cls.PROVIDER_NAME,
            "target": domain_or_subdomain,
            "records": [
                {
                    "type": "MX",
                    "host": domain_or_subdomain,
                    "priority": 10,
                    "value": "mx1.forwardemail.net"
                },
                {
                    "type": "MX",
                    "host": domain_or_subdomain,
                    "priority": 20,
                    "value": "mx2.forwardemail.net"
                },
                {
                    "type": "TXT",
                    "host": domain_or_subdomain,
                    "value": f"forward-email={destination_email}"
                },
                {
                    "type": "TXT",
                    "host": domain_or_subdomain,
                    "value": "v=spf1 include:spf.forwardemail.net -all"
                }
            ],
            "notes": [
                "100% open-source and free tier for custom domains.",
                "Requires ownership of the apex domain or delegable subdomain DNS zone.",
                "does.software is preferred for free subdomains as it provides the domain, DNS, and forwarding out of the box."
            ]
        }

    @classmethod
    def get_comparison(cls) -> List[Dict[str, Any]]:
        """Comparison between does.software, Forward Email, and Cloudflare Email Routing."""
        return [
            {
                "provider": "does.software",
                "role": "Preferred Free Subdomain Provider (Default)",
                "domain_included": True,
                "cost": "€0.00 / Free",
                "custom_domain_required": False,
                "free_subdomain": "albert.does.software",
                "email_forwarding": "1 address (hello@albert.does.software)",
                "renewal": "Every 45 days (1-click / token)",
                "dns_setup_required": False
            },
            {
                "provider": "Forward Email",
                "role": "Alternative Reference (Open-Source Engine)",
                "domain_included": False,
                "cost": "Free tier for custom domains",
                "custom_domain_required": True,
                "free_subdomain": "None (requires user domain)",
                "email_forwarding": "Unlimited aliases",
                "renewal": "Annual (domain registrar dependent)",
                "dns_setup_required": True
            },
            {
                "provider": "Cloudflare Email Routing",
                "role": "Alternative Enterprise Edge Router",
                "domain_included": False,
                "cost": "Free (with Cloudflare account)",
                "custom_domain_required": True,
                "free_subdomain": "None (requires user domain on Cloudflare)",
                "email_forwarding": "Unlimited custom addresses",
                "renewal": "Annual (domain registrar dependent)",
                "dns_setup_required": True
            }
        ]
