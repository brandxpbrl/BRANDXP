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


class VisualBoardsTests(unittest.TestCase):
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
        (root / "knowledge" / "visual_psychology").mkdir(parents=True)
        (root / "knowledge" / "luxury").mkdir(parents=True)
        (root / "knowledge" / "entity_detection").mkdir(parents=True)
        (root / "core" / "visual_language.md").write_text(
            "Visual authority comes from perception, atmosphere, identity, hierarchy and assets.",
            encoding="utf-8",
        )
        (root / "knowledge" / "visual_psychology" / "color_emotion.md").write_text(
            "Color emotion should work as a premium perception signal.",
            encoding="utf-8",
        )
        (root / "knowledge" / "visual_psychology" / "negative_space.md").write_text(
            "Negative space creates luxury, silence and perceived value.",
            encoding="utf-8",
        )
        (root / "knowledge" / "visual_psychology" / "contrast_psychology.md").write_text(
            "Contrast psychology guides attention and authority.",
            encoding="utf-8",
        )
        (root / "knowledge" / "visual_psychology" / "cinematic_composition.md").write_text(
            "Cinematic composition uses rhythm, atmosphere and visual focus.",
            encoding="utf-8",
        )
        (root / "knowledge" / "luxury" / "luxury_perception.md").write_text(
            "Luxury and premium positioning depend on emotional precision.",
            encoding="utf-8",
        )
        (root / "knowledge" / "entity_detection" / "visual_archetypes.md").write_text(
            "Visual archetypes make the entity recognizable.",
            encoding="utf-8",
        )

    def _client_path(self):
        client_path = client_manager.CLIENTS_ROOT / "Client A"
        (client_path / "01_DIAGNOSTICO_ACTUAL" / "Analisis_Brand_Experience").mkdir(parents=True)
        return client_path

    def _write_latest_json(self):
        client_path = self._client_path()
        analysis_dir = client_path / "01_DIAGNOSTICO_ACTUAL" / "Analisis_Brand_Experience"
        payload = {
            "client": "Client A",
            "created_at": "2026-05-18T09:00:00",
            "analysis": {
                "headline": "A sharper identity system is needed.",
                "diagnosis": {
                    "current_state": "The brand has useful but scattered signals.",
                    "main_gap": "Visual coherence",
                    "strategic_decision": "Build a recognizable premium identity system.",
                },
                "scorecard": [
                    {
                        "key": "visual_coherence",
                        "label": "Coherencia visual",
                        "score": 58,
                        "status": "Critico",
                        "signal": "Visual cues are inconsistent.",
                        "action": "Create visual rules.",
                    }
                ],
                "priorities": [
                    {
                        "title": "Visual coherence",
                        "urgency": "Alta",
                        "reason": "Perception depends on repeatable cues.",
                        "action": "Define a visual system.",
                    }
                ],
                "content_pillars": [
                    {
                        "name": "Authority",
                        "role": "Show expertise and method.",
                        "formats": ["carousel"],
                    }
                ],
            },
        }
        (analysis_dir / "LATEST_ANALYSIS.json").write_text(json.dumps(payload), encoding="utf-8")
        (analysis_dir / "LATEST_ANALYSIS.md").write_text("# Latest Analysis\n\nNarrative.", encoding="utf-8")
        return client_path

    def test_missing_client_returns_404(self):
        status, data = asyncio.run(_asgi_post("/clients/Missing Client/visual-boards/generate-specs"))

        self.assertEqual(status, 404)
        self.assertEqual(data["detail"], "Client not found.")

    def test_missing_latest_analysis_returns_clear_error(self):
        self._client_path()

        status, data = asyncio.run(_asgi_post("/clients/Client A/visual-boards/generate-specs"))

        self.assertEqual(status, 400)
        self.assertIn("No LATEST_ANALYSIS.json or LATEST_ANALYSIS.md", data["detail"])

    def test_latest_json_generates_three_specs_json(self):
        client_path = self._write_latest_json()

        result = client_manager.generate_client_visual_board_specs("Client A")

        spec_paths = [path for path in result["created"] if path.startswith("05_ENTREGAS/board_specs/") and path.endswith(".json")]
        self.assertEqual(len(spec_paths), 3)
        self.assertTrue((client_path / "05_ENTREGAS" / "board_specs" / "brand_identity_board.json").is_file())
        self.assertTrue((client_path / "05_ENTREGAS" / "board_specs" / "storytelling_strategy_board.json").is_file())
        self.assertTrue((client_path / "05_ENTREGAS" / "board_specs" / "visual_universe_board.json").is_file())
        self.assertFalse(result["used_ai"])

    def test_latest_json_generates_three_markdown_files(self):
        client_path = self._write_latest_json()

        result = client_manager.generate_client_visual_board_specs("Client A")

        markdown_paths = [path for path in result["created"] if path.endswith(".md")]
        self.assertEqual(len(markdown_paths), 3)
        self.assertTrue((client_path / "05_ENTREGAS" / "brand_identity_board.md").is_file())
        self.assertTrue((client_path / "05_ENTREGAS" / "storytelling_strategy_board.md").is_file())
        self.assertTrue((client_path / "05_ENTREGAS" / "visual_universe_board.md").is_file())

    def test_existing_files_are_versioned_without_overwrite(self):
        client_path = self._write_latest_json()
        deliverables_dir = client_path / "05_ENTREGAS"
        specs_dir = deliverables_dir / "board_specs"
        specs_dir.mkdir(parents=True)
        existing_md = deliverables_dir / "brand_identity_board.md"
        existing_json = specs_dir / "brand_identity_board.json"
        existing_md.write_text("original md", encoding="utf-8")
        existing_json.write_text('{"original": true}', encoding="utf-8")

        result = client_manager.generate_client_visual_board_specs("Client A")

        self.assertEqual(existing_md.read_text(encoding="utf-8"), "original md")
        self.assertEqual(existing_json.read_text(encoding="utf-8"), '{"original": true}')
        self.assertTrue(any(path.startswith("05_ENTREGAS/brand_identity_board_") for path in result["versioned"]))
        self.assertTrue(any(path.startswith("05_ENTREGAS/board_specs/brand_identity_board_") for path in result["versioned"]))

    def test_response_does_not_include_absolute_paths(self):
        self._write_latest_json()

        _status, data = asyncio.run(_asgi_post("/clients/Client A/visual-boards/generate-specs"))
        serialized = json.dumps(data)

        self.assertNotIn(str(client_manager.CLIENTS_ROOT), serialized)
        self.assertNotIn("\\", serialized)

    def test_does_not_write_outside_deliverables_folder(self):
        client_path = self._write_latest_json()

        client_manager.generate_client_visual_board_specs("Client A")

        written_files = [
            path.relative_to(client_path).as_posix()
            for path in client_path.rglob("*")
            if path.is_file()
        ]
        generated_files = [
            path
            for path in written_files
            if path not in {
                "01_DIAGNOSTICO_ACTUAL/Analisis_Brand_Experience/LATEST_ANALYSIS.json",
                "01_DIAGNOSTICO_ACTUAL/Analisis_Brand_Experience/LATEST_ANALYSIS.md",
            }
        ]

        self.assertTrue(generated_files)
        self.assertTrue(all(path.startswith("05_ENTREGAS/") for path in generated_files))

    def test_does_not_create_visuals_folder_or_images(self):
        client_path = self._write_latest_json()

        result = client_manager.generate_client_visual_board_specs("Client A")

        self.assertFalse((client_path / "05_ENTREGAS" / "visuals").exists())
        self.assertFalse(any(path.endswith(".png") for path in result["created"]))
        self.assertFalse(result["will_generate_images"])

    def test_does_not_call_ai(self):
        self._write_latest_json()

        result = client_manager.generate_client_visual_board_specs("Client A")

        self.assertFalse(result["will_generate_images"])
        self.assertFalse(result["used_ai"])
        self.assertEqual(result["base"], "05_ENTREGAS")

    def test_markdown_fallback_generates_basic_specs(self):
        client_path = self._client_path()
        analysis_dir = client_path / "01_DIAGNOSTICO_ACTUAL" / "Analisis_Brand_Experience"
        (analysis_dir / "LATEST_ANALYSIS.md").write_text("# Latest Analysis\n\nOnly markdown.", encoding="utf-8")

        result = client_manager.generate_client_visual_board_specs("Client A")
        spec_path = client_path / "05_ENTREGAS" / "board_specs" / "brand_identity_board.json"
        spec = json.loads(spec_path.read_text(encoding="utf-8"))

        self.assertEqual(len(result["created"]), 6)
        self.assertEqual(spec["client_name"], "Client A")
        self.assertIn("markdown", result["source"])

    def test_specs_include_entity_bible_enriched_fields(self):
        client_path = self._write_latest_json()

        client_manager.generate_client_visual_board_specs("Client A")
        specs_dir = client_path / "05_ENTREGAS" / "board_specs"
        brand_spec = json.loads((specs_dir / "brand_identity_board.json").read_text(encoding="utf-8"))
        storytelling_spec = json.loads((specs_dir / "storytelling_strategy_board.json").read_text(encoding="utf-8"))
        visual_spec = json.loads((specs_dir / "visual_universe_board.json").read_text(encoding="utf-8"))

        self.assertTrue(brand_spec["entity_bible_applied"])
        self.assertIn("hero_title", brand_spec)
        self.assertIn("perception_angle", brand_spec)
        self.assertIn("premium_positioning", brand_spec)
        self.assertIn("visual_authority", brand_spec)
        self.assertIn("tone_cards", brand_spec)
        self.assertIn("benefit_bar", brand_spec)
        self.assertIn("footer_claim", brand_spec)

        self.assertTrue(storytelling_spec["entity_bible_applied"])
        self.assertIn("narrative_axis", storytelling_spec)
        self.assertIn("storyworld", storytelling_spec)
        self.assertIn("emotional_tension", storytelling_spec)
        self.assertIn("storytelling_steps", storytelling_spec)
        self.assertIn("manifesto", storytelling_spec)
        self.assertIn("footer_claim", storytelling_spec)

        self.assertTrue(visual_spec["entity_bible_applied"])
        self.assertIn("visual_mood", visual_spec)
        self.assertIn("atmosphere", visual_spec)
        self.assertIn("cinematic_language", visual_spec)
        self.assertIn("composition_rules", visual_spec)
        self.assertIn("symbolic_elements", visual_spec)
        self.assertIn("footer_claim", visual_spec)

    def test_specs_work_when_entity_bible_is_missing(self):
        entity_bible_loader.ENTITY_BIBLE_ROOT = Path(self._temp_dir.name) / "missing_entity_bible"
        client_path = self._write_latest_json()

        client_manager.generate_client_visual_board_specs("Client A")
        brand_spec = json.loads(
            (client_path / "05_ENTREGAS" / "board_specs" / "brand_identity_board.json").read_text(encoding="utf-8")
        )

        self.assertFalse(brand_spec["entity_bible_applied"])
        self.assertEqual(brand_spec["layout_theme"], "premium_editorial_fallback")
        self.assertIn("hero_title", brand_spec)


if __name__ == "__main__":
    unittest.main()
