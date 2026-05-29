import asyncio
import json
import sys
import tempfile
import unittest
from pathlib import Path

BACKEND_DIR = Path(__file__).resolve().parents[1]
if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))

import client_loader
import client_manager
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


class FrameworkFlowTests(unittest.TestCase):
    def setUp(self):
        self._original_save_client_intake = main.save_client_intake
        self._original_process_request = main.process_request
        self._original_client_roots = client_loader.CLIENT_ROOTS
        self._original_clients_root = client_manager.CLIENTS_ROOT
        self._temp_dir = tempfile.TemporaryDirectory()
        client_manager.CLIENTS_ROOT = Path(self._temp_dir.name) / "clients"

    def tearDown(self):
        main.save_client_intake = self._original_save_client_intake
        main.process_request = self._original_process_request
        client_loader.CLIENT_ROOTS = self._original_client_roots
        client_manager.CLIENTS_ROOT = self._original_clients_root
        self._temp_dir.cleanup()

    def test_analyze_keeps_compatibility_without_intake_saved_flag(self):
        calls = []

        def fake_save_client_intake(client_name, intake):
            calls.append((client_name, intake))
            return {"client": {"name": client_name}}

        def fake_process_request(prompt, client_name=None):
            return {"response": "ok", "client_name": client_name, "prompt": prompt}

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
        self.assertEqual(len(calls), 1)
        self.assertEqual(calls[0][0], "Client A")

    def test_analyze_skips_duplicate_intake_when_already_saved(self):
        calls = []

        def fake_save_client_intake(client_name, intake):
            calls.append((client_name, intake))
            return {"client": {"name": client_name}}

        def fake_process_request(prompt, client_name=None):
            return {"response": "ok", "client_name": client_name, "prompt": prompt}

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
                    "intake_already_saved": True,
                },
            )
        )

        self.assertEqual(status, 200)
        self.assertEqual(data["response"], "ok")
        self.assertEqual(calls, [])

    def test_analyze_latest_intake_uses_saved_public_context(self):
        saved = client_manager.save_client_intake(
            "ClientA",
            {
                "instagram": "@client",
                "links": ["https://example.com"],
                "transcription": "",
                "notes": "Cuestionario publico con origen, vision y diferenciacion.",
                "strategic_questionnaire": {
                    "origin": "Nacio desde una oportunidad clara.",
                    "vision": "Ser una referencia premium.",
                },
                "source": "public_client_intake",
                "framework_ready": True,
            },
        )
        calls = []

        def fake_process_request(prompt, client_name=None):
            calls.append((prompt, client_name))
            return {
                "response": "ok",
                "client": {"name": client_name},
                "saved_analysis": {"latest": "LATEST_ANALYSIS.md"},
            }

        main.process_request = fake_process_request

        status, data = asyncio.run(
            _asgi_post_json(
                "/clients/ClientA/analyze-latest-intake",
                {},
            )
        )

        self.assertEqual(status, 200)
        self.assertEqual(data["response"], "ok")
        self.assertEqual(data["intake_source"]["intake_file"], saved["intake_file"])
        self.assertEqual(calls[0][1], "ClientA")
        self.assertIn("@client", calls[0][0])
        self.assertIn("Cuestionario publico", calls[0][0])

    def test_load_client_excludes_deliverables_outputs(self):
        with tempfile.TemporaryDirectory() as temp_dir:
            root = Path(temp_dir)
            client_path = root / "Client A"
            (client_path / "05_ENTREGAS" / "board_specs").mkdir(parents=True)
            (client_path / "05_ENTREGAS" / "visuals").mkdir(parents=True)
            (client_path / "05_ENTREGAS" / "brand_analysis.md").write_text("final deliverable", encoding="utf-8")
            (client_path / "05_ENTREGAS" / "deliverables_index.json").write_text('{"output": true}', encoding="utf-8")
            (client_path / "05_ENTREGAS" / "board_specs" / "brand_identity_board.json").write_text('{"board": true}', encoding="utf-8")
            (client_path / "05_ENTREGAS" / "visuals" / "brand_identity_board.png").write_bytes(b"png")
            client_loader.CLIENT_ROOTS = [root]

            context = client_loader.load_client("Client A")

        self.assertNotIn("final deliverable", context)
        self.assertNotIn("deliverables_index", context)
        self.assertNotIn("brand_identity_board", context)

    def test_load_client_prioritizes_new_context_engines(self):
        with tempfile.TemporaryDirectory() as temp_dir:
            root = Path(temp_dir)
            client_path = root / "Client A"
            (client_path / "02_MEMORY").mkdir(parents=True)
            (client_path / "07_VISUAL_DNA_ENGINE").mkdir(parents=True)
            (client_path / "08_CONTENT_INTELLIGENCE_ENGINE").mkdir(parents=True)
            (client_path / "09_AI_AGENT_OS").mkdir(parents=True)
            (client_path / "02_MEMORY" / "BRAND_MEMORY_CORE_MASTER.md").write_text(
                "brand memory signal",
                encoding="utf-8",
            )
            (client_path / "07_VISUAL_DNA_ENGINE" / "VISUAL_DNA_ENGINE_MASTER.md").write_text(
                "visual dna signal",
                encoding="utf-8",
            )
            (client_path / "08_CONTENT_INTELLIGENCE_ENGINE" / "CONTENT_INTELLIGENCE_ENGINE_MASTER.md").write_text(
                "content intelligence signal",
                encoding="utf-8",
            )
            (client_path / "09_AI_AGENT_OS" / "AI_AGENT_OS_MASTER.md").write_text(
                "ai agent os signal",
                encoding="utf-8",
            )
            client_loader.CLIENT_ROOTS = [root]

            bundle = client_loader.load_client_context_bundle("Client A")

        self.assertTrue(bundle["engines"]["brand_memory_core"])
        self.assertTrue(bundle["engines"]["visual_dna_engine"])
        self.assertTrue(bundle["engines"]["content_intelligence_engine"])
        self.assertTrue(bundle["engines"]["ai_agent_os"])
        self.assertIn("BRAND MEMORY CORE MASTER", bundle["context"])
        self.assertIn("VISUAL DNA ENGINE MASTER", bundle["context"])
        self.assertIn("CONTENT INTELLIGENCE MASTER", bundle["context"])
        self.assertIn("AI AGENT OS MASTER", bundle["context"])

    def test_load_client_keeps_core_memory_sources(self):
        with tempfile.TemporaryDirectory() as temp_dir:
            root = Path(temp_dir)
            client_path = root / "Client A"
            (client_path / "00_ADMIN" / "Links_Accesos").mkdir(parents=True)
            (client_path / "01_DIAGNOSTICO_ACTUAL" / "Reuniones_Zoom").mkdir(parents=True)
            (client_path / "02_ESENCIA_DE_MARCA").mkdir(parents=True)
            (client_path / "00_ADMIN" / "Datos_Cliente").mkdir(parents=True)
            (client_path / "00_ADMIN" / "Links_Accesos" / "LINKS.md").write_text("useful links", encoding="utf-8")
            (client_path / "01_DIAGNOSTICO_ACTUAL" / "Reuniones_Zoom" / "TRANSCRIPCIONES.md").write_text("useful transcript", encoding="utf-8")
            (client_path / "02_ESENCIA_DE_MARCA" / "CLIENT_CONTEXT.md").write_text("useful context", encoding="utf-8")
            (client_path / "00_ADMIN" / "Datos_Cliente" / "client_profile.json").write_text('{"useful": true}', encoding="utf-8")
            client_loader.CLIENT_ROOTS = [root]

            context = client_loader.load_client("Client A")

        self.assertIn("useful links", context)
        self.assertIn("useful transcript", context)
        self.assertIn("useful context", context)
        self.assertIn('"useful": true', context)


if __name__ == "__main__":
    unittest.main()
