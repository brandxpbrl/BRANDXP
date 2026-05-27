import base64
import hashlib
import hmac
import json
import os
import secrets
import time


TOKEN_TTL_SECONDS = 60 * 60 * 12


def access_control_enabled():
    return os.getenv("BEOS_ACCESS_CONTROL", "false").strip().lower() in {"1", "true", "yes", "on"}


def _secret():
    return os.getenv("BEOS_ACCESS_SECRET") or os.getenv("BEOS_DEVELOPER_KEY") or "local-dev-secret"


def _developer_key():
    return os.getenv("BEOS_DEVELOPER_KEY", "").strip()


def _client_keys():
    raw_keys = os.getenv("BEOS_CLIENT_KEYS", "").strip()

    if not raw_keys:
        return {}

    try:
        parsed = json.loads(raw_keys)
        if isinstance(parsed, dict):
            return {str(client): str(key) for client, key in parsed.items() if key}
    except json.JSONDecodeError:
        pass

    keys = {}
    for pair in raw_keys.split(","):
        if ":" not in pair:
            continue
        client, key = pair.split(":", 1)
        client = client.strip()
        key = key.strip()
        if client and key:
            keys[client] = key

    return keys


def _b64_encode(data):
    return base64.urlsafe_b64encode(data).decode("ascii").rstrip("=")


def _b64_decode(data):
    padding = "=" * (-len(data) % 4)
    return base64.urlsafe_b64decode((data + padding).encode("ascii"))


def _sign(payload):
    return _b64_encode(
        hmac.new(
            _secret().encode("utf-8"),
            payload.encode("utf-8"),
            hashlib.sha256,
        ).digest()
    )


def create_access_token(mode, client=None):
    payload = {
        "mode": mode,
        "client": client,
        "exp": int(time.time()) + TOKEN_TTL_SECONDS,
        "nonce": secrets.token_urlsafe(8),
    }
    encoded_payload = _b64_encode(json.dumps(payload, separators=(",", ":")).encode("utf-8"))
    signature = _sign(encoded_payload)

    return f"{encoded_payload}.{signature}"


def verify_access_token(token):
    if not token or "." not in token:
        return None

    encoded_payload, signature = token.rsplit(".", 1)
    expected_signature = _sign(encoded_payload)

    if not hmac.compare_digest(signature, expected_signature):
        return None

    try:
        payload = json.loads(_b64_decode(encoded_payload).decode("utf-8"))
    except (json.JSONDecodeError, UnicodeDecodeError):
        return None

    if int(payload.get("exp", 0)) < int(time.time()):
        return None

    mode = payload.get("mode")
    if mode not in {"developer", "client"}:
        return None

    return {
        "mode": mode,
        "client": payload.get("client"),
        "expires_at": payload.get("exp"),
    }


def authenticate_access_key(access_key):
    clean_key = (access_key or "").strip()

    if not access_control_enabled():
        return {
            "mode": "developer",
            "client": None,
            "token": create_access_token("developer"),
            "access_control": False,
        }

    developer_key = _developer_key()
    if developer_key and hmac.compare_digest(clean_key, developer_key):
        return {
            "mode": "developer",
            "client": None,
            "token": create_access_token("developer"),
            "access_control": True,
        }

    for client, client_key in _client_keys().items():
        if hmac.compare_digest(clean_key, client_key):
            return {
                "mode": "client",
                "client": client,
                "token": create_access_token("client", client),
                "access_control": True,
            }

    return None


def is_public_path(path):
    public_prefixes = (
        "/api/access",
        "/health",
        "/docs",
        "/openapi.json",
        "/creative-library/asset",
        "/favicon",
    )

    return any(path == prefix or path.startswith(f"{prefix}/") for prefix in public_prefixes)


def client_name_from_path(path):
    parts = [part for part in path.split("/") if part]

    if len(parts) >= 2 and parts[0] == "clients":
        return parts[1]

    if len(parts) >= 3 and parts[0] == "api" and parts[1] == "clients":
        return parts[2]

    if len(parts) >= 2 and parts[0] == "entity-advisor":
        return parts[1]

    if len(parts) >= 4 and parts[0] == "api" and parts[1] == "entity" and parts[2] == "conversation":
        return parts[3]

    return None


def is_client_allowed_path(path, method, client):
    if path == "/clients" and method == "GET":
        return True

    if path in {"/api/entity/voice-script", "/api/entity/voice"} and method == "POST":
        return True

    path_client = client_name_from_path(path)
    if not path_client or path_client.casefold() != (client or "").casefold():
        return False

    if path.startswith("/entity-advisor/") and method == "GET":
        return True

    if path.startswith("/api/entity/conversation/") and method in {"GET", "POST"}:
        return True

    if path.startswith("/api/clients/") and "/portal" in path and method == "GET":
        return True

    if path.startswith("/api/clients/") and "/chat" in path and method in {"GET", "POST"}:
        return True

    if path.startswith("/clients/") and "/deliverables" in path and method == "GET":
        return True

    return False
