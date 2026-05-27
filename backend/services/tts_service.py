import os
from pathlib import Path

from services.ai_client import load_environment


BASE_DIR = Path(__file__).resolve().parents[1]
PROJECT_ROOT = BASE_DIR.parent

SUPPORTED_FUTURE_PROVIDERS = {"elevenlabs", "openai", "google"}


def _provider_config():
    load_environment()

    return {
        "provider": os.getenv("ENTITY_VOICE_PROVIDER", "mock").strip().lower() or "mock",
        "voice_id": os.getenv("ENTITY_VOICE_ID", "").strip(),
        "elevenlabs_configured": bool(os.getenv("ELEVENLABS_API_KEY")),
        "openai_configured": bool(os.getenv("OPENAI_API_KEY")),
        "google_configured": bool(os.getenv("GOOGLE_TTS_API_KEY")),
    }


def generate_entity_voice(script, voice_profile):
    config = _provider_config()
    provider = config["provider"]

    if not script or not script.strip():
        return {
            "audio_url": "",
            "script": "",
            "provider": provider,
            "status": "error",
            "detail": "Voice script is required.",
        }

    if provider == "mock":
        return {
            "audio_url": "",
            "script": script,
            "provider": "mock",
            "status": "mock",
            "voice_profile": voice_profile,
        }

    if provider in SUPPORTED_FUTURE_PROVIDERS:
        api_key_configured = config.get(f"{provider}_configured", False)

        if not api_key_configured:
            return {
                "audio_url": "",
                "script": script,
                "provider": "mock",
                "configured_provider": provider,
                "status": "mock",
                "voice_profile": voice_profile,
                "detail": f"{provider} is selected, but its API key is not configured.",
            }

        return {
            "audio_url": "",
            "script": script,
            "provider": provider,
            "status": "mock",
            "voice_profile": voice_profile,
            "detail": f"{provider} TTS connector is reserved for the next integration step.",
        }

    return {
        "audio_url": "",
        "script": script,
        "provider": provider,
        "status": "error",
        "voice_profile": voice_profile,
        "detail": f"Unsupported ENTITY_VOICE_PROVIDER '{provider}'.",
    }
