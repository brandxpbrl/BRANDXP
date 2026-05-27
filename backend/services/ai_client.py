# Brand Experience OS AI provider client.
#
# Gemini is the primary provider. Ollama remains available as the local fallback.

import json
import os
import urllib.error
import urllib.request
from pathlib import Path
from time import time

BASE_DIR = Path(__file__).resolve().parents[1]
PROJECT_ROOT = BASE_DIR.parent

DEFAULT_AI_PROVIDER = "gemini"
DEFAULT_GEMINI_MODEL = "gemini-3.5-flash"
DEFAULT_OLLAMA_MODEL = "mistral"
DEFAULT_OLLAMA_HOST = "http://127.0.0.1:11434"

GEMINI_TIMEOUT_SECONDS = 60
OLLAMA_TIMEOUT_SECONDS = 420
PROVIDER_RETRY_AFTER_SECONDS = 120

PROVIDER_STATE = {
    "gemini_disabled_reason": None,
    "gemini_disabled_until": 0,
}


def _load_env_file(path):
    if not path.exists():
        return

    for raw_line in path.read_text(encoding="utf-8").splitlines():
        line = raw_line.strip()

        if not line or line.startswith("#") or "=" not in line:
            continue

        key, value = line.split("=", 1)
        key = key.strip()
        value = value.strip().strip('"').strip("'")

        if key and key not in os.environ:
            os.environ[key] = value


def load_environment():
    _load_env_file(PROJECT_ROOT / ".env")
    _load_env_file(BASE_DIR / ".env")


def _configured_provider():
    load_environment()
    return os.getenv("AI_PROVIDER", DEFAULT_AI_PROVIDER).strip().lower() or DEFAULT_AI_PROVIDER


def _temperature():
    load_environment()
    return float(os.getenv("AI_TEMPERATURE", "0.55"))


def _retry_seconds(provider):
    disabled_until = PROVIDER_STATE.get(f"{provider}_disabled_until", 0)
    return max(0, round(disabled_until - time()))


def get_provider_status():
    load_environment()
    primary_provider = _configured_provider()
    fallback_chain = _fallback_chain(primary_provider)

    return {
        "primary_provider": primary_provider,
        "fallback_chain": fallback_chain,
        "gemini_configured": bool(os.getenv("GEMINI_API_KEY")),
        "gemini_model": os.getenv("GEMINI_MODEL", DEFAULT_GEMINI_MODEL),
        "ollama_model": os.getenv("OLLAMA_MODEL", DEFAULT_OLLAMA_MODEL),
        "ollama_host": os.getenv("OLLAMA_HOST", DEFAULT_OLLAMA_HOST),
        "gemini_disabled_reason": PROVIDER_STATE.get("gemini_disabled_reason"),
        "gemini_retry_after_seconds": _retry_seconds("gemini"),
    }


def reset_provider_state():
    for key in PROVIDER_STATE:
        PROVIDER_STATE[key] = 0 if key.endswith("_until") else None

    return get_provider_status()


def _messages_to_gemini_parts(messages):
    system_parts = []
    content_parts = []

    for message in messages:
        role = message.get("role", "user")
        content = message.get("content", "")

        if not content:
            continue

        if role == "system":
            system_parts.append(str(content))
        else:
            content_parts.append(f"{role.upper()}:\n{content}")

    system_instruction = "\n\n".join(system_parts).strip() or None
    contents = "\n\n".join(content_parts).strip()

    if not contents:
        contents = "\n\n".join(system_parts).strip()
        system_instruction = None

    return system_instruction, contents


def _gemini_response(messages):
    load_environment()

    api_key = os.getenv("GEMINI_API_KEY")

    if not api_key:
        raise RuntimeError(
            "GEMINI_API_KEY is not configured. Add it to backend/.env or the process environment."
        )

    try:
        from google import genai
    except ImportError as error:
        raise RuntimeError(
            "google-genai is not installed. Run: pip install -U google-genai"
        ) from error

    system_instruction, contents = _messages_to_gemini_parts(messages)
    model = os.getenv("GEMINI_MODEL", DEFAULT_GEMINI_MODEL)
    client = genai.Client(api_key=api_key)
    config = {
        "temperature": _temperature(),
    }

    if system_instruction:
        config["system_instruction"] = system_instruction

    response = client.models.generate_content(
        model=model,
        contents=contents,
        config=config,
    )

    text = getattr(response, "text", None)

    if isinstance(text, str) and text.strip():
        return text

    raise RuntimeError("Gemini response did not include text output.")


def _ollama_chat(messages):
    load_environment()

    host = os.getenv("OLLAMA_HOST", DEFAULT_OLLAMA_HOST).rstrip("/")
    model = os.getenv("OLLAMA_MODEL", DEFAULT_OLLAMA_MODEL)
    payload = {
        "model": model,
        "messages": messages,
        "stream": False,
    }

    request = urllib.request.Request(
        f"{host}/api/chat",
        data=json.dumps(payload).encode("utf-8"),
        headers={"Content-Type": "application/json"},
        method="POST",
    )

    with urllib.request.urlopen(request, timeout=OLLAMA_TIMEOUT_SECONDS) as response:
        data = json.loads(response.read().decode("utf-8"))

    return data["message"]["content"]


def _fallback_chain(primary_provider):
    providers = ["gemini", "ollama"]

    if primary_provider not in providers:
        return providers

    return [primary_provider] + [provider for provider in providers if provider != primary_provider]


def _call_provider(provider, messages):
    if provider == "gemini":
        return _gemini_response(messages)

    if provider == "ollama":
        return _ollama_chat(messages)

    raise RuntimeError(f"Unsupported AI_PROVIDER '{provider}'.")


def _provider_disabled(provider):
    reason = PROVIDER_STATE.get(f"{provider}_disabled_reason")
    disabled_until = PROVIDER_STATE.get(f"{provider}_disabled_until", 0)

    if reason and time() < disabled_until:
        return reason

    return None


def _mark_provider_error(provider, error):
    if provider != "gemini":
        return

    PROVIDER_STATE[f"{provider}_disabled_reason"] = str(error)
    PROVIDER_STATE[f"{provider}_disabled_until"] = time() + PROVIDER_RETRY_AFTER_SECONDS


def _clear_provider_error(provider):
    if provider != "gemini":
        return

    PROVIDER_STATE[f"{provider}_disabled_reason"] = None
    PROVIDER_STATE[f"{provider}_disabled_until"] = 0


def chat_completion(messages):
    errors = []
    primary_provider = _configured_provider()

    for provider in _fallback_chain(primary_provider):
        disabled_reason = _provider_disabled(provider)

        if disabled_reason:
            errors.append(f"{provider}: {disabled_reason}")
            continue

        try:
            content = _call_provider(provider, messages)
            _clear_provider_error(provider)

            return {
                "content": content,
                "provider": provider,
                "fallback_used": provider != primary_provider,
                "error": "; ".join(errors) or None,
            }
        except Exception as error:
            _mark_provider_error(provider, error)
            errors.append(f"{provider}: {error}")

    raise RuntimeError("All AI providers failed: " + " | ".join(errors))
