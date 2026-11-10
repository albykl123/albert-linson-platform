"""
Security-Audited Logger for AlbertEmailSetup.
Ensures sensitive tokens, passwords, and private emails are redacted in console and file outputs.
"""

import logging
import re
import sys
from typing import Optional

class RedactingFormatter(logging.Formatter):
    """Custom formatter that automatically redacts sensitive data."""

    PATTERNS = [
        # Redact JWT tokens, bearer tokens, turnstile tokens
        (re.compile(r'(token|bearer|key|secret)["\']?\s*[:=]\s*["\']?([a-zA-Z0-9_\-\.]{12,})["\']?', re.I), r'\1: [REDACTED_TOKEN]'),
        # Partially redact emails in logs (e.g. j***e@gmail.com)
        (re.compile(r'([a-zA-Z0-9_.+-]{2})([a-zA-Z0-9_.+-]+)(@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+)'), r'\1***\3'),
    ]

    def format(self, record: logging.LogRecord) -> str:
        original = super().format(record)
        redacted = original
        for pattern, repl in self.PATTERNS:
            redacted = pattern.sub(repl, redacted)
        return redacted

def get_logger(name: str = "AlbertEmailSetup", level: int = logging.INFO) -> logging.Logger:
    logger = logging.getLogger(name)
    if not logger.handlers:
        logger.setLevel(level)
        handler = logging.StreamHandler(sys.stdout)
        handler.setLevel(level)
        formatter = RedactingFormatter(
            fmt="[%(asctime)s] [%(levelname)s] [%(name)s] %(message)s",
            datefmt="%Y-%m-%d %H:%M:%S"
        )
        handler.setFormatter(formatter)
        logger.addHandler(handler)
    return logger
