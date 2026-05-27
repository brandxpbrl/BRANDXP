import asyncio
import json
import os
import sys
import tempfile
import unittest
from pathlib import Path
from unittest.mock import patch


BACKEND_DIR = Path(__file__).resolve().parents[1]
if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))

import client_manager
import main
from services import entity_advisor, entity_conversation_engine


async def _asgi_post_json(path, payload, headers=None):
    messages = []
    request_sent = False
    body = json.dumps(payload).encode("utf-8")
    raw_headers = [(b"content-type", b"application/json")]

    for key, value in (headers or {}).items():
        raw_headers.append((key.lower().encode("ascii"), value.encode("utf-8")))

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
        "headers": raw_headers,
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


class EntityChatTests(unittest.TestCase):
    def setUp(self):
        self._original_client_manager_root = client_manager.CLIENTS_ROOT
        self._original_advisor_clients_root = entity_advisor.CLIENTS_ROOT
        self._original_conversation_clients_root = entity_conversation_engine.CLIENTS_ROOT if hasattr(entity_conversation_engine, "CLIENTS_ROOT") else None
        self._env = {
            key: os.environ.get(key)
            for key in ["BEOS_ACCESS_CONTROL", "BEOS_ACCESS_SECRET", "BEOS_DEVELOPER_KEY", "BEOS_CLIENT_KEYS"]
        }
        self._temp_dir = tempfile.TemporaryDirectory()
        self.root = Path(self._temp_dir.name)
        self.clients_root = self.root / "CLIENTES_ACTIVOS"
        client_manager.CLIENTS_ROOT = self.clients_root
        entity_advisor.CLIENTS_ROOT = self.clients_root

    def tearDown(self):
        client_manager.CLIENTS_ROOT = self._original_client_manager_root
        entity_advisor.CLIENTS_ROOT = self._original_advisor_clients_root
        for key, value in self._env.items():
            if value is None:
                os.environ.pop(key, None)
            else:
                os.environ[key] = value
        self._temp_dir.cleanup()

    def _write(self, relative_path, content="x"):
        path = self.root / relative_path
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_text(content, encoding="utf-8")
        return path

    def _seed_client(self):
        analysis = {
            "analysis": {
                "headline": "Marca en evolucion",
                "diagnosis": {
                    "current_state": "Tiene señales dispersas.",
                    "main_gap": "Falta sintetizar.",
                    "strategic_decision": "Ordenar la narrativa.",
                },
            }
        }
        self._write(
            "CLIENTES_ACTIVOS/Client A/01_DIAGNOSTICO_ACTUAL/Analisis_Brand_Experience/LATEST_ANALYSIS.json",
            json.dumps(analysis),
        )
        self._write(
            "CLIENTES_ACTIVOS/Client A/01_DIAGNOSTICO_ACTUAL/Analisis_Brand_Experience/LATEST_ANALYSIS.md",
            "# Marca en evolucion",
        )

    def test_chat_with_entity_uses_context_and_saves_history(self):
        self._seed_client()

        with patch("services.entity_conversation_engine.chat_completion") as chat_completion:
            chat_completion.return_value = {
                "content": "La Entidad recomienda sintetizar antes de producir.",
                "provider": "test",
                "fallback_used": False,
                "error": None,
            }

            result = entity_advisor.chat_with_entity("Client A", "Que recomendas?", "internal")

        self.assertEqual(result["client"], "Client A")
        self.assertEqual(result["answer"], "La Entidad recomienda sintetizar antes de producir.")
        self.assertEqual(len(result["history"]), 2)
        self.assertTrue((self.clients_root / "Client A/05_ENTREGAS/entity_conversation/entity_conversation_history.json").is_file())
        self.assertTrue((self.clients_root / "Client A/05_ENTREGAS/entity_conversation/ENTITY_CONVERSATION_TRANSCRIPT.md").is_file())

    def test_entity_chat_endpoint_returns_entity_answer(self):
        os.environ["BEOS_ACCESS_CONTROL"] = "false"

        with patch("main.chat_with_entity") as chat:
            chat.return_value = {
                "client": "Client A",
                "mode": "internal",
                "answer": "Respuesta viva",
                "history": [],
            }

            status, data = asyncio.run(
                _asgi_post_json(
                    "/api/entity/chat",
                    {
                        "client": "Client A",
                        "message": "Hola entidad",
                        "mode": "internal",
                    },
                )
            )

        self.assertEqual(status, 200)
        self.assertEqual(data["answer"], "Respuesta viva")
        chat.assert_called_once_with("Client A", "Hola entidad", "internal")

    def test_client_key_cannot_chat_with_another_client(self):
        os.environ["BEOS_ACCESS_CONTROL"] = "true"
        os.environ["BEOS_ACCESS_SECRET"] = "test-secret"
        os.environ["BEOS_DEVELOPER_KEY"] = "dev-key"
        os.environ["BEOS_CLIENT_KEYS"] = json.dumps({"Client A": "client-key"})

        login_status, login_data = asyncio.run(
            _asgi_post_json(
                "/api/access/login",
                {
                    "access_key": "client-key",
                },
            )
        )
        self.assertEqual(login_status, 200)

        with patch("main.chat_with_entity") as chat:
            status, data = asyncio.run(
                _asgi_post_json(
                    "/api/entity/chat",
                    {
                        "client": "Other Client",
                        "message": "Hola entidad",
                        "mode": "client",
                    },
                    headers={"X-BEOS-Token": login_data["token"]},
                )
            )

        self.assertEqual(status, 403)
        self.assertIn("assigned client", data["detail"])
        chat.assert_not_called()


if __name__ == "__main__":
    unittest.main()
