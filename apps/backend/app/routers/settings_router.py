"""API Router for application settings, AI provider configuration, and privacy controls."""

import os
from fastapi import APIRouter
from pydantic import BaseModel
from app.config import settings

router = APIRouter(prefix="/api/settings", tags=["Settings"])


class SettingsUpdate(BaseModel):
    ai_provider: str | None = None
    gemini_api_key: str | None = None
    openai_api_key: str | None = None
    ollama_model: str | None = None


@router.get("")
def get_settings():
    """Retrieve active system settings and privacy parameters."""
    return {
        "app_name": settings.APP_NAME,
        "version": settings.APP_VERSION,
        "ai_provider": settings.AI_PROVIDER,
        "has_gemini_key": bool(settings.GEMINI_API_KEY),
        "has_openai_key": bool(settings.OPENAI_API_KEY),
        "ollama_base_url": settings.OLLAMA_BASE_URL,
        "ollama_model": settings.OLLAMA_MODEL,
        "storage": "Local SQLite (Privacy-Preserved)",
        "offline_ready": True,
    }


@router.post("")
def update_settings(payload: SettingsUpdate):
    """Update runtime provider settings."""
    if payload.ai_provider:
        settings.AI_PROVIDER = payload.ai_provider
    if payload.gemini_api_key is not None:
        settings.GEMINI_API_KEY = payload.gemini_api_key
    if payload.openai_api_key is not None:
        settings.OPENAI_API_KEY = payload.openai_api_key
    if payload.ollama_model:
        settings.OLLAMA_MODEL = payload.ollama_model

    return {
        "success": True,
        "message": "Settings updated for active session.",
        "active_provider": settings.AI_PROVIDER,
    }
