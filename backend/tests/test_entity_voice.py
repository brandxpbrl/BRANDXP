import asyncio
import json
import os
import sys
import unittest
from pathlib import Path


BACKEND_DIR = Path(__file__).resolve().parents[1]
if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))

import main
from services.entity_voice_profile import get_entity_voice_profile
from services.entity_voice_script_engine import build_entity_voice_script
from services.tts_service import generate_entity_voice


async def _asgi_post_json(path, payload):
    messages = []
    request_sent = False
    body = json.dumps(payload).encode("utf-8")

    async def receive():
        nonlocal request_sent

        if request_sent:
            return {"type": "http.disconnect"}

        request_sent = True
        return {"type": "http.request", "body": body, "more_body": False}

    async def send(message):
        messages.append(message)

    scope = {
        "type": "http",
        "asgi": {"version": "3.0", "spec_version": "2.3"},
        "http_version": "1.1",
        "method": "POST",
        "scheme": "http",
        "path": path,
        "raw_path": path.encode("ascii"),
        "query_string": b"",
        "headers": [(b"content-type", b"application/json")],
        "client": ("testclient", 50000),
        "server": ("testserver", 80),
    }

    await main.app(scope, receive, send)

    status = None
    response_body = b""

    for message in messages:
        if message["type"] == "http.response.start":
            status = message["status"]
        elif message["type"] == "http.response.body":
            response_body += message.get("body", b"")

    return status, json.loads(response_body.decode("utf-8") or "{}")


class EntityVoiceTests(unittest.TestCase):
    def test_voice_profile_has_expected_brand_voice(self):
        profile = get_entity_voice_profile()

        self.assertEqual(profile["voice_name"], "Brand Experience Entity")
        self.assertIn("cinematic", profile["personality"])
        self.assertIn("robotic", profile["forbidden_style"])
        self.assertEqual(profile["default_language"], "Spanish")

    def test_script_interprets_dashboard_state_instead_of_reading_lists(self):
        result = build_entity_voice_script(
            {
                "client": "ryaanlouis",
                "advisor_message": "Memoria activo, Visual DNA activo, Contenido activo, Agent OS activo.",
                "recommendation": {
                    "state": "operational",
                    "next_action": "Revisar entregables",
                },
                "state": {
                    "brand_memory_core": True,
                    "visual_dna_engine": True,
                    "content_intelligence_engine": True,
                    "ai_agent_os": True,
                },
            }
        )

        script = result["script"]

        self.assertIn("La base operativa esta consolidada.", script)
        self.assertIn("Recomendacion clara: Revisar entregables.", script)
        self.assertIn("...", script)
        self.assertLessEqual(len(script), 760)
        self.assertNotIn("Memoria activo", script)
        self.assertNotIn("Agent OS activo", script)

    def test_tts_returns_mock_without_provider(self):
        old_provider = os.environ.get("ENTITY_VOICE_PROVIDER")
        os.environ["ENTITY_VOICE_PROVIDER"] = "mock"

        try:
            result = generate_entity_voice("Lectura completada.", get_entity_voice_profile())
        finally:
            if old_provider is None:
                os.environ.pop("ENTITY_VOICE_PROVIDER", None)
            else:
                os.environ["ENTITY_VOICE_PROVIDER"] = old_provider

        self.assertEqual(result["status"], "mock")
        self.assertEqual(result["provider"], "mock")
        self.assertEqual(result["script"], "Lectura completada.")

    def test_voice_script_endpoint(self):
        status, data = asyncio.run(
            _asgi_post_json(
                "/api/entity/voice-script",
                {
                    "client": "Client A",
                    "advisor_message": "El cliente ya tiene una base operativa.",
                    "recommendation": {
                        "state": "operational",
                        "next_action": "Revisar entregables",
                    },
                },
            )
        )

        self.assertEqual(status, 200)
        self.assertIn("script", data)
        self.assertIn("voice_profile", data)
        self.assertIn("Recomendacion clara: Revisar entregables.", data["script"])

    def test_voice_endpoint(self):
        status, data = asyncio.run(
            _asgi_post_json(
                "/api/entity/voice",
                {
                    "client": "Client A",
                    "script": "Lectura completada.",
                },
            )
        )

        self.assertEqual(status, 200)
        self.assertIn(data["status"], ["mock", "ready"])
        self.assertEqual(data["script"], "Lectura completada.")


if __name__ == "__main__":
    unittest.main()
