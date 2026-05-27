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
import entity_bible_loader
from main import app


async def _asgi_post(path):
    messages = []
    request_sent = False

    async def receive():
        nonlocal request_sent

        if request_sent:
            return {"type": "http.disconnect"}

        request_sent = True
        return {"type": "http.request", "body": b"", "more_body": False}

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
        "headers": [],
        "client": ("testclient", 50000),
        "server": ("testserver", 80),
    }

    await app(scope, receive, send)

    status = None
    body = b""

    for message in messages:
        if message["type"] == "http.response.start":
            status = message["status"]
        elif message["type"] == "http.response.body":
            body += message.get("body", b"")

    return status, json.loads(body.decode("utf-8") or "{}")


class MasterDeliverableTests(unittest.TestCase):
    def setUp(self):
        self._original_clients_root = client_manager.CLIENTS_ROOT
        self._original_entity_bible_root = entity_bible_loader.ENTITY_BIBLE_ROOT
        self._temp_dir = tempfile.TemporaryDirectory()
        client_manager.CLIENTS_ROOT = Path(self._temp_dir.name)
        entity_bible_loader.ENTITY_BIBLE_ROOT = Path(self._temp_dir.name) / "entity_bible"
        self._write_entity_bible()

    def tearDown(self):
        client_manager.CLIENTS_ROOT = self._original_clients_root
        entity_bible_loader.ENTITY_BIBLE_ROOT = self._original_entity_bible_root
        self._temp_dir.cleanup()

    def _write_entity_bible(self):
        root = entity_bible_loader.ENTITY_BIBLE_ROOT
        (root / "core").mkdir(parents=True)
        (root / "knowledge" / "luxury").mkdir(parents=True)
        (root / "knowledge" / "perception").mkdir(parents=True)
        (root / "core" / "brand_philosophy.md").write_text(
            "La marca debe operar como entidad de percepcion, identidad y storytelling.",
            encoding="utf-8",
        )
        (root / "core" / "entity_framework.md").write_text(
            "Entidad, atmosfera, experiencia y assets deben formar un sistema.",
            encoding="utf-8",
        )
        (root / "knowledge" / "luxury" / "luxury_perception.md").write_text(
            "El lujo emocional eleva el valor percibido.",
            encoding="utf-8",
        )
        (root / "knowledge" / "perception" / "perceived_value.md").write_text(
            "La percepcion sostiene autoridad y confianza.",
            encoding="utf-8",
        )

    def _client_path(self):
        client_path = client_manager.CLIENTS_ROOT / "Client A"
        (client_path / "01_DIAGNOSTICO_ACTUAL" / "Analisis_Brand_Experience").mkdir(parents=True)
        (client_path / "05_ENTREGAS").mkdir(parents=True)
        return client_path

    def _write_latest_json(self):
        client_path = self._client_path()
        analysis_dir = client_path / "01_DIAGNOSTICO_ACTUAL" / "Analisis_Brand_Experience"
        payload = {
            "client": "Client A",
            "created_at": "2026-05-18T09:00:00",
            "analysis": {
                "headline": "A sharper brand system is needed.",
                "overall_score": 72,
                "confidence": 80,
                "diagnosis": {
                    "current_state": "Useful but scattered signals.",
                    "main_gap": "Differentiation",
                    "strategic_decision": "Build a recognizable promise and content system.",
                },
                "scorecard": [
                    {
                        "key": "visual_coherence",
                        "label": "Visual coherence",
                        "score": 66,
                        "status": "In progress",
                        "action": "Create visual rules.",
                    }
                ],
                "priorities": [
                    {
                        "title": "Differentiation",
                        "urgency": "High",
                        "action": "Define proprietary codes.",
                    }
                ],
                "deliverables": [
                    {
                        "name": "Identity Patch",
                        "outcome": "Clearer perception.",
                        "actions": ["Define the mother phrase."],
                    }
                ],
                "content_pillars": [
                    {
                        "name": "Authority",
                        "role": "Show method and expertise.",
                    }
                ],
                "ai_prompts": [
                    {
                        "name": "Prompt maestro",
                        "prompt": "Analyze this brand.",
                    }
                ],
                "next_sprint": ["Create identity patch."],
                "risks": ["Creating disconnected assets."],
            },
        }
        (analysis_dir / "LATEST_ANALYSIS.json").write_text(json.dumps(payload), encoding="utf-8")
        (analysis_dir / "LATEST_ANALYSIS.md").write_text("# Latest Analysis\n\nNarrative fallback.", encoding="utf-8")
        return client_path

    def _write_markdown_fallback(self):
        client_path = self._client_path()
        analysis_dir = client_path / "01_DIAGNOSTICO_ACTUAL" / "Analisis_Brand_Experience"
        (analysis_dir / "LATEST_ANALYSIS.md").write_text("# Latest Analysis\n\nOnly markdown fallback.", encoding="utf-8")
        return client_path

    def _write_optional_outputs(self, client_path):
        deliverables_dir = client_path / "05_ENTREGAS"
        (deliverables_dir / "visuals").mkdir()
        (deliverables_dir / "visuals" / "brand_identity_board.png").write_bytes(b"\x89PNG binary")
        (deliverables_dir / "visuals" / "storytelling_strategy_board_20260518_100000.png").write_bytes(b"\x89PNG binary")
        (deliverables_dir / "board_specs").mkdir()
        (deliverables_dir / "board_specs" / "brand_identity_board.json").write_text(
            json.dumps({"client_name": "Client A", "tagline": "Spec tagline"}),
            encoding="utf-8",
        )
        (deliverables_dir / "deliverables_index.json").write_text('{"index": true}', encoding="utf-8")

    def test_missing_client_returns_404(self):
        status, data = asyncio.run(_asgi_post("/clients/Missing Client/deliverables/generate-master"))

        self.assertEqual(status, 404)
        self.assertEqual(data["detail"], "Client not found.")

    def test_missing_latest_analysis_returns_clear_error(self):
        self._client_path()

        status, data = asyncio.run(_asgi_post("/clients/Client A/deliverables/generate-master"))

        self.assertEqual(status, 400)
        self.assertIn("No LATEST_ANALYSIS.json or LATEST_ANALYSIS.md", data["detail"])

    def test_generates_master_from_latest_json(self):
        client_path = self._write_latest_json()

        result = client_manager.generate_master_deliverable("Client A")
        content = (client_path / result["created"]).read_text(encoding="utf-8")

        self.assertEqual(result["created"], "05_ENTREGAS/MASTER_BRAND_EXPERIENCE.md")
        self.assertIn("05_ENTREGAS/MASTER_BRAND_EXPERIENCE.md", result["created"])
        self.assertIn("Lectura de Entidad", result["included_sections"])
        self.assertIn("Diagnostico de Percepcion", result["included_sections"])
        self.assertIn("Nucleo Identitario", result["included_sections"])
        self.assertIn("ADN de Marca", result["included_sections"])
        self.assertIn("Storytelling y Narrativa", result["included_sections"])
        self.assertIn("Experiencia y Touchpoints", result["included_sections"])
        self.assertIn("A sharper brand system is needed.", content)
        self.assertIn("Entity Bible: Disponible", content)
        self.assertFalse(result["used_ai"])

    def test_fallback_latest_markdown_generates_master(self):
        client_path = self._write_markdown_fallback()

        result = client_manager.generate_master_deliverable("Client A")
        content = (client_path / result["created"]).read_text(encoding="utf-8")

        self.assertIn("Only markdown fallback.", content)
        self.assertEqual(result["source"], {"markdown": "01_DIAGNOSTICO_ACTUAL/Analisis_Brand_Experience/LATEST_ANALYSIS.md"})

    def test_does_not_create_separate_deliverables_or_index(self):
        client_path = self._write_latest_json()

        client_manager.generate_master_deliverable("Client A")
        deliverables_dir = client_path / "05_ENTREGAS"

        forbidden = [
            "brand_analysis.md",
            "identity_patch.md",
            "entity_bible.md",
            "visual_universe.md",
            "content_strategy.md",
            "ai_prompts.md",
            "action_plan.md",
            "deliverables_index.json",
        ]
        self.assertFalse(any((deliverables_dir / filename).exists() for filename in forbidden))

    def test_versions_existing_master_without_overwrite(self):
        client_path = self._write_latest_json()
        master_path = client_path / "05_ENTREGAS" / "MASTER_BRAND_EXPERIENCE.md"
        master_path.write_text("original master", encoding="utf-8")

        result = client_manager.generate_master_deliverable("Client A")

        self.assertEqual(master_path.read_text(encoding="utf-8"), "original master")
        self.assertTrue(result["created"].startswith("05_ENTREGAS/MASTER_BRAND_EXPERIENCE_"))
        self.assertEqual(result["versioned"], [result["created"]])

    def test_writes_only_inside_deliverables_folder(self):
        client_path = self._write_latest_json()

        result = client_manager.generate_master_deliverable("Client A")
        created_path = client_path / result["created"]

        self.assertTrue(created_path.is_file())
        self.assertTrue(created_path.parent.samefile(client_path / "05_ENTREGAS"))

    def test_response_does_not_include_absolute_paths(self):
        self._write_latest_json()

        _status, data = asyncio.run(_asgi_post("/clients/Client A/deliverables/generate-master"))
        serialized = json.dumps(data)

        self.assertNotIn(str(client_manager.CLIENTS_ROOT), serialized)
        self.assertNotIn("\\", serialized)

    def test_visuals_are_listed_as_relative_paths_without_binary_content(self):
        client_path = self._write_latest_json()
        self._write_optional_outputs(client_path)

        result = client_manager.generate_master_deliverable("Client A")
        content = (client_path / result["created"]).read_text(encoding="utf-8")

        self.assertIn("05_ENTREGAS/visuals/brand_identity_board.png", result["visuals_referenced"])
        self.assertIn("05_ENTREGAS/visuals/storytelling_strategy_board_20260518_100000.png", result["visuals_referenced"])
        self.assertIn("05_ENTREGAS/visuals/brand_identity_board.png", content)
        self.assertNotIn("PNG binary", content)

    def test_board_specs_can_summarize_without_creating_outputs(self):
        client_path = self._write_latest_json()
        self._write_optional_outputs(client_path)

        result = client_manager.generate_master_deliverable("Client A")
        content = (client_path / result["created"]).read_text(encoding="utf-8")

        self.assertIn("Spec tagline", content)
        self.assertNotIn('"index": true', content)

    def test_endpoint_response_shape(self):
        self._write_latest_json()

        status, data = asyncio.run(_asgi_post("/clients/Client A/deliverables/generate-master"))

        self.assertEqual(status, 200)
        self.assertIn("created", data)
        self.assertIn("source", data)
        self.assertIn("included_sections", data)
        self.assertIn("visuals_referenced", data)
        self.assertIn("versioned", data)
        self.assertFalse(data["used_ai"])

    def test_master_works_when_entity_bible_is_missing(self):
        entity_bible_loader.ENTITY_BIBLE_ROOT = Path(self._temp_dir.name) / "missing_entity_bible"
        client_path = self._write_latest_json()

        result = client_manager.generate_master_deliverable("Client A")
        content = (client_path / result["created"]).read_text(encoding="utf-8")

        self.assertIn("Entity Bible: No disponible", content)
        self.assertIn("Lectura de Entidad", content)


if __name__ == "__main__":
    unittest.main()
