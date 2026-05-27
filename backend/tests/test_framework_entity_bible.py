import asyncio
import json
import sys
import tempfile
import unittest
from pathlib import Path


BACKEND_DIR = Path(__file__).resolve().parents[1]
if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))

import client_manager
import cognitive_orchestrator
import entity_bible_loader
import main


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


class FrameworkEntityBibleTests(unittest.TestCase):
    def setUp(self):
        self._original_root = entity_bible_loader.ENTITY_BIBLE_ROOT
        self._original_clients_root = client_manager.CLIENTS_ROOT
        self._original_save_client_intake = main.save_client_intake
        self._original_process_request = main.process_request
        self._temp_dir = tempfile.TemporaryDirectory()
        self.root = Path(self._temp_dir.name) / "entity_bible"
        self.clients_root = Path(self._temp_dir.name) / "clients"
        entity_bible_loader.ENTITY_BIBLE_ROOT = self.root
        client_manager.CLIENTS_ROOT = self.clients_root
        self._build_entity_bible()

    def tearDown(self):
        entity_bible_loader.ENTITY_BIBLE_ROOT = self._original_root
        client_manager.CLIENTS_ROOT = self._original_clients_root
        main.save_client_intake = self._original_save_client_intake
        main.process_request = self._original_process_request
        self._temp_dir.cleanup()

    def _write(self, relative_path, content):
        path = self.root / relative_path
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_text(content, encoding="utf-8")
        return path

    def _build_entity_bible(self):
        self._write(
            "core/entity_framework.md",
            "La marca funciona como entidad con identidad viva y sistema de percepcion.",
        )
        self._write(
            "core/storytelling_framework.md",
            "El storytelling ordena atmosfera, conflicto, transformacion y accion.",
        )
        self._write(
            "core/visual_language.md",
            "El universo visual traduce presencia, jerarquia, ritmo y assets.",
        )
        self._write("knowledge/luxury/luxury_perception.md", "El lujo emocional requiere silencio y precision.")
        self._write(".env", "SECRET=should-not-leak")
        self._write("05_ENTREGAS/brand_analysis.md", "old output should not leak")
        self._write("05_ENTREGAS/board_specs/brand_identity_board.json", '{"old": true}')
        self._write("05_ENTREGAS/visuals/brand_identity_board.txt", "visuals should not leak")

    def test_build_framework_prompt_includes_entity_bible_context_when_available(self):
        prompt = client_manager.build_framework_prompt("Client A", {"notes": "Notas del cliente"})

        self.assertIn("=== ENTITY BIBLE CONTEXT ===", prompt)
        self.assertIn("ENTITY_BIBLE_FILE: core/entity_framework.md", prompt)
        self.assertIn("marca funciona como entidad", prompt)

    def test_build_framework_prompt_works_when_entity_bible_is_absent(self):
        entity_bible_loader.ENTITY_BIBLE_ROOT = self.root / "missing"

        prompt = client_manager.build_framework_prompt("Client A", {})

        self.assertIn("=== ENTITY BIBLE CONTEXT ===", prompt)
        self.assertIn("No Entity Bible context loaded.", prompt)
        self.assertIn("=== CLIENT CONTEXT ===", prompt)

    def test_prompt_does_not_include_env(self):
        prompt = client_manager.build_framework_prompt("Client A", {})

        self.assertNotIn("SECRET=should-not-leak", prompt)
        self.assertNotIn(".env", prompt)

    def test_prompt_does_not_include_deliverables_outputs(self):
        prompt = client_manager.build_framework_prompt("Client A", {})

        self.assertNotIn("05_ENTREGAS", prompt)
        self.assertNotIn("old output should not leak", prompt)

    def test_prompt_does_not_include_visuals_or_board_specs(self):
        prompt = client_manager.build_framework_prompt("Client A", {})

        self.assertNotIn("visuals", prompt)
        self.assertNotIn("board_specs", prompt)
        self.assertNotIn("visuals should not leak", prompt)

    def test_prompt_includes_core_concepts(self):
        prompt = client_manager.build_framework_prompt("Client A", {})

        self.assertIn("entidad", prompt)
        self.assertIn("percepcion", prompt)
        self.assertIn("storytelling", prompt)
        self.assertIn("universo visual", prompt)

    def test_clients_analyze_keeps_compatibility_without_calling_ai(self):
        captured = {}

        def fake_save_client_intake(client_name, intake):
            return {"client": {"name": client_name}}

        def fake_process_request(prompt, client_name=None):
            captured["prompt"] = prompt
            captured["client_name"] = client_name
            return {"response": "ok", "client_name": client_name}

        main.save_client_intake = fake_save_client_intake
        main.process_request = fake_process_request

        status, data = asyncio.run(
            _asgi_post_json(
                "/clients/analyze",
                {
                    "client_name": "Client A",
                    "instagram": "@client",
                    "links": ["https://example.com"],
                    "transcription": "transcript",
                    "notes": "notes",
                },
            )
        )

        self.assertEqual(status, 200)
        self.assertEqual(data["response"], "ok")
        self.assertEqual(captured["client_name"], "Client A")
        self.assertIn("=== ENTITY BIBLE CONTEXT ===", captured["prompt"])
        self.assertIn("=== CLIENT CONTEXT ===", captured["prompt"])

    def test_latest_analysis_omits_global_entity_bible_context(self):
        prompt = client_manager.build_framework_prompt(
            "Client A",
            {
                "instagram": "@client",
                "notes": "Cliente vende tours privados en Rio con chofer bilingue.",
            },
        )
        client_path = self.clients_root / "Client A"

        result = client_manager.save_client_analysis(
            {"name": "Client A", "path": str(client_path)},
            prompt,
            "Sintesis del cliente.",
            structured_analysis={"headline": "Cliente especifico", "overall_score": 70},
        )

        latest_md = Path(result["latest"]).read_text(encoding="utf-8")
        latest_json = json.loads(
            (client_path / "01_DIAGNOSTICO_ACTUAL" / "Analisis_Brand_Experience" / "LATEST_ANALYSIS.json").read_text(
                encoding="utf-8"
            )
        )

        self.assertIn("Cliente vende tours privados", latest_md)
        self.assertIn("Cliente vende tours privados", latest_json["prompt"])
        self.assertNotIn("ENTITY_BIBLE_FILE", latest_md)
        self.assertNotIn("marca funciona como entidad", latest_md)
        self.assertNotIn("ENTITY_BIBLE_FILE", latest_json["prompt"])
        self.assertTrue(latest_json["system_context_omitted"])

    def test_client_profile_last_prompt_omits_global_entity_bible_context(self):
        prompt = client_manager.build_framework_prompt("Client A", {"notes": "Notas reales del cliente"})

        client_manager.ensure_client_from_prompt(prompt, "Client A")

        profile_path = self.clients_root / "Client A" / "00_ADMIN" / "Datos_Cliente" / "client_profile.json"
        profile = json.loads(profile_path.read_text(encoding="utf-8"))
        last_prompt = profile["analysis"]["last_prompt"]

        self.assertIn("Notas reales del cliente", last_prompt)
        self.assertNotIn("ENTITY_BIBLE_FILE", last_prompt)
        self.assertNotIn("marca funciona como entidad", last_prompt)

    def test_fallback_response_omits_global_entity_bible_context(self):
        prompt = client_manager.build_framework_prompt("Client A", {"notes": "Notas reales del cliente"})

        response = cognitive_orchestrator._fallback_response(prompt, [], "provider unavailable")

        self.assertIn("Notas reales del cliente", response["response"])
        self.assertNotIn("ENTITY_BIBLE_FILE", response["response"])
        self.assertNotIn("marca funciona como entidad", response["response"])


if __name__ == "__main__":
    unittest.main()
