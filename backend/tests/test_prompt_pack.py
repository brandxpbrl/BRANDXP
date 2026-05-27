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


class PromptPackTests(unittest.TestCase):
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

    def _client_path(self):
        client_path = client_manager.CLIENTS_ROOT / "Client A"
        (client_path / "01_DIAGNOSTICO_ACTUAL" / "Analisis_Brand_Experience").mkdir(parents=True)
        return client_path

    def _write_entity_bible(self):
        root = entity_bible_loader.ENTITY_BIBLE_ROOT
        (root / "core").mkdir(parents=True)
        (root / "knowledge" / "luxury").mkdir(parents=True)
        (root / "core" / "brand_philosophy.md").write_text(
            "Marca como entidad, percepcion antes de explicacion, identidad antes de diseno y storytelling.",
            encoding="utf-8",
        )
        (root / "knowledge" / "luxury" / "luxury_perception.md").write_text(
            "Lujo emocional y autoridad visual.",
            encoding="utf-8",
        )

    def _write_latest_json(self):
        client_path = self._client_path()
        analysis_dir = client_path / "01_DIAGNOSTICO_ACTUAL" / "Analisis_Brand_Experience"
        payload = {
            "client": "Client A",
            "analysis": {
                "headline": "A sharper identity system is needed.",
                "overall_score": 72,
                "confidence": 81,
                "diagnosis": {
                    "current_state": "The brand has useful but scattered signals.",
                    "main_gap": "Visual coherence",
                    "strategic_decision": "Build a recognizable premium identity system.",
                },
                "priorities": [
                    {
                        "title": "Visual coherence",
                        "action": "Define repeatable visual codes.",
                    }
                ],
                "content_pillars": [
                    {
                        "name": "Authority",
                        "role": "Show expertise and method.",
                    }
                ],
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

    def _write_board_specs(self, client_path):
        specs_dir = client_path / "05_ENTREGAS" / "board_specs"
        specs_dir.mkdir(parents=True)
        (specs_dir / "brand_identity_board.json").write_text(
            json.dumps(
                {
                    "brand_descriptor": "Premium travel category",
                    "brand_promise": "Premium promise from spec.",
                    "perception_angle": "Spec perception angle.",
                    "palette": [{"name": "Accent", "hex": "#D9428F", "meaning": "Distinction"}],
                }
            ),
            encoding="utf-8",
        )
        (specs_dir / "storytelling_strategy_board.json").write_text(
            json.dumps({"narrative_axis": "From tension to transformation.", "storyworld": "Spec storyworld."}),
            encoding="utf-8",
        )
        (specs_dir / "visual_universe_board.json").write_text(
            json.dumps({"visual_mood": "Premium cinematic clarity", "instagram_direction": ["One idea per post"]}),
            encoding="utf-8",
        )

    def test_generates_identity_cliente(self):
        client_path = self._write_latest_json()

        result = client_manager.generate_client_prompt_pack("Client A")

        self.assertIn("05_ENTREGAS/prompt_pack/identity_cliente.md", result["created"])
        self.assertTrue((client_path / "05_ENTREGAS" / "prompt_pack" / "identity_cliente.md").is_file())

    def test_generates_specific_prompts(self):
        client_path = self._write_latest_json()

        result = client_manager.generate_client_prompt_pack("Client A")

        for filename in client_manager.PROMPT_PACK_FILES[1:-1]:
            self.assertIn(f"05_ENTREGAS/prompt_pack/{filename}", result["created"])
            self.assertTrue((client_path / "05_ENTREGAS" / "prompt_pack" / filename).is_file())

    def test_generates_visual_generation_mode(self):
        client_path = self._write_latest_json()

        result = client_manager.generate_client_prompt_pack("Client A")
        mode_path = client_path / "05_ENTREGAS" / "prompt_pack" / "visual_generation_mode.md"

        self.assertIn("05_ENTREGAS/prompt_pack/visual_generation_mode.md", result["created"])
        self.assertTrue(mode_path.is_file())
        self.assertIn("# VISUAL GENERATION MODE", mode_path.read_text(encoding="utf-8"))

    def test_generates_full_pack_with_identity_first(self):
        client_path = self._write_latest_json()

        client_manager.generate_client_prompt_pack("Client A")
        full_pack = (client_path / "05_ENTREGAS" / "prompt_pack" / "full_brand_experience_prompt_pack.md").read_text(encoding="utf-8")

        self.assertTrue(full_pack.startswith("# IDENTITY CLIENTE"))
        self.assertLess(full_pack.index("# IDENTITY CLIENTE"), full_pack.index("# Logo System Prompt"))
        self.assertLess(full_pack.index("# IDENTITY CLIENTE"), full_pack.index("# VISUAL GENERATION MODE"))
        self.assertLess(full_pack.index("# VISUAL GENERATION MODE"), full_pack.index("# Logo System Prompt"))

    def test_uses_latest_analysis_json_when_available(self):
        client_path = self._write_latest_json()

        client_manager.generate_client_prompt_pack("Client A")
        identity = (client_path / "05_ENTREGAS" / "prompt_pack" / "identity_cliente.md").read_text(encoding="utf-8")

        self.assertIn("A sharper identity system is needed.", identity)
        self.assertIn("Overall score: 72", identity)

    def test_identity_cliente_includes_visual_generation_mode_section(self):
        client_path = self._write_latest_json()

        client_manager.generate_client_prompt_pack("Client A")
        identity = (client_path / "05_ENTREGAS" / "prompt_pack" / "identity_cliente.md").read_text(encoding="utf-8")

        self.assertIn("## 13. MODO DE GENERACION VISUAL", identity)
        self.assertIn("No empieces disenando. Primero interpreta la entidad de marca.", identity)
        self.assertIn("Antes de generar imagenes finales, propone 2 o 3 rutas creativas.", identity)

    def test_visual_prompts_include_generation_modes(self):
        client_path = self._write_latest_json()

        client_manager.generate_client_prompt_pack("Client A")
        prompt_pack_dir = client_path / "05_ENTREGAS" / "prompt_pack"

        logo = (prompt_pack_dir / "logo_system_prompt.md").read_text(encoding="utf-8")
        brand_board = (prompt_pack_dir / "brand_identity_board_prompt.md").read_text(encoding="utf-8")
        storytelling = (prompt_pack_dir / "storytelling_board_prompt.md").read_text(encoding="utf-8")
        visual_universe = (prompt_pack_dir / "visual_universe_board_prompt.md").read_text(encoding="utf-8")

        self.assertIn("## Modo para generar logo", logo)
        self.assertIn("propone 3 rutas conceptuales de logo", logo)
        self.assertIn("no usar iconos turisticos obvios", logo)
        self.assertIn("## Modo para generar board premium", brand_board)
        self.assertIn("board horizontal 16:9", brand_board)
        self.assertIn("no usar cards simples", brand_board)
        self.assertIn("## Modo para generar storytelling board", storytelling)
        self.assertIn("footer con claims memorables", storytelling)
        self.assertIn("## Modo para generar universo visual", visual_universe)
        self.assertIn("conceptos visuales prohibidos", visual_universe)

    def test_fallback_latest_markdown(self):
        client_path = self._write_markdown_fallback()

        result = client_manager.generate_client_prompt_pack("Client A")
        identity = (client_path / result["created"][0]).read_text(encoding="utf-8")

        self.assertIn("Only markdown fallback.", identity)

    def test_uses_entity_bible_if_available(self):
        client_path = self._write_latest_json()

        client_manager.generate_client_prompt_pack("Client A")
        identity = (client_path / "05_ENTREGAS" / "prompt_pack" / "identity_cliente.md").read_text(encoding="utf-8")

        self.assertIn("Marca como entidad", identity)
        self.assertIn("Lujo emocional", identity)

    def test_works_without_entity_bible(self):
        entity_bible_loader.ENTITY_BIBLE_ROOT = Path(self._temp_dir.name) / "missing_entity_bible"
        client_path = self._write_latest_json()

        result = client_manager.generate_client_prompt_pack("Client A")
        identity = (client_path / result["created"][0]).read_text(encoding="utf-8")

        self.assertIn("Entity Bible: No disponible", identity)

    def test_uses_board_specs_when_available(self):
        client_path = self._write_latest_json()
        self._write_board_specs(client_path)

        client_manager.generate_client_prompt_pack("Client A")
        identity = (client_path / "05_ENTREGAS" / "prompt_pack" / "identity_cliente.md").read_text(encoding="utf-8")

        self.assertIn("Premium travel category", identity)
        self.assertIn("Spec perception angle.", identity)
        self.assertIn("Premium cinematic clarity", identity)

    def test_does_not_create_images_or_call_ai(self):
        client_path = self._write_latest_json()

        result = client_manager.generate_client_prompt_pack("Client A")

        self.assertFalse(result["used_ai"])
        self.assertFalse(any(path.suffix == ".png" for path in client_path.rglob("*")))

    def test_writes_only_inside_prompt_pack(self):
        client_path = self._write_latest_json()

        client_manager.generate_client_prompt_pack("Client A")

        generated_files = [
            path.relative_to(client_path).as_posix()
            for path in client_path.rglob("*")
            if path.is_file()
            and not path.as_posix().endswith("LATEST_ANALYSIS.json")
            and not path.as_posix().endswith("LATEST_ANALYSIS.md")
        ]

        self.assertTrue(generated_files)
        self.assertTrue(all(path.startswith("05_ENTREGAS/prompt_pack/") for path in generated_files))

    def test_response_does_not_include_absolute_paths(self):
        self._write_latest_json()

        _status, data = asyncio.run(_asgi_post("/clients/Client A/prompt-pack/generate"))
        serialized = json.dumps(data)

        self.assertNotIn(str(client_manager.CLIENTS_ROOT), serialized)
        self.assertNotIn("\\", serialized)

    def test_regenerating_deletes_known_previous_prompts(self):
        client_path = self._write_latest_json()
        prompt_pack_dir = client_path / "05_ENTREGAS" / "prompt_pack"
        prompt_pack_dir.mkdir(parents=True)
        (prompt_pack_dir / "identity_cliente.md").write_text("original identity", encoding="utf-8")
        (prompt_pack_dir / "instagram_feed_prompt.md").write_text("old instagram prompt", encoding="utf-8")

        result = client_manager.generate_client_prompt_pack("Client A")

        self.assertIn("05_ENTREGAS/prompt_pack/identity_cliente.md", result["deleted_previous"])
        self.assertIn("05_ENTREGAS/prompt_pack/instagram_feed_prompt.md", result["deleted_previous"])
        self.assertIn("A sharper identity system is needed.", (prompt_pack_dir / "identity_cliente.md").read_text(encoding="utf-8"))
        self.assertFalse((prompt_pack_dir / "instagram_feed_prompt.md").exists())

    def test_regenerating_deletes_timestamp_versions(self):
        client_path = self._write_latest_json()
        prompt_pack_dir = client_path / "05_ENTREGAS" / "prompt_pack"
        prompt_pack_dir.mkdir(parents=True)
        old_version = prompt_pack_dir / "logo_system_prompt_20260518_120000.md"
        old_version.write_text("old version", encoding="utf-8")

        result = client_manager.generate_client_prompt_pack("Client A")

        self.assertIn("05_ENTREGAS/prompt_pack/logo_system_prompt_20260518_120000.md", result["deleted_previous"])
        self.assertFalse(old_version.exists())

    def test_cleanup_keeps_unknown_files_directories_images_and_external_files(self):
        client_path = self._write_latest_json()
        prompt_pack_dir = client_path / "05_ENTREGAS" / "prompt_pack"
        prompt_pack_dir.mkdir(parents=True)
        unknown = prompt_pack_dir / "private_notes.md"
        folder = prompt_pack_dir / "nested"
        image = prompt_pack_dir / "preview.png"
        binary = prompt_pack_dir / "archive.bin"
        outside = client_path / "05_ENTREGAS" / "MASTER_BRAND_EXPERIENCE.md"
        visuals = client_path / "05_ENTREGAS" / "visuals" / "brand_identity_board.png"
        specs = client_path / "05_ENTREGAS" / "board_specs" / "brand_identity_board.json"
        unknown.write_text("do not delete", encoding="utf-8")
        folder.mkdir()
        (folder / "identity_cliente.md").write_text("nested file", encoding="utf-8")
        image.write_bytes(b"png")
        binary.write_bytes(b"bin")
        outside.write_text("master", encoding="utf-8")
        visuals.parent.mkdir(parents=True)
        visuals.write_bytes(b"png")
        specs.parent.mkdir(parents=True)
        specs.write_text("{}", encoding="utf-8")

        client_manager.generate_client_prompt_pack("Client A")

        self.assertTrue(unknown.exists())
        self.assertTrue(folder.is_dir())
        self.assertTrue((folder / "identity_cliente.md").exists())
        self.assertTrue(image.exists())
        self.assertTrue(binary.exists())
        self.assertTrue(outside.exists())
        self.assertTrue(visuals.exists())
        self.assertTrue(specs.exists())

    def test_after_generate_only_current_known_prompt_versions_remain(self):
        client_path = self._write_latest_json()
        prompt_pack_dir = client_path / "05_ENTREGAS" / "prompt_pack"
        prompt_pack_dir.mkdir(parents=True)
        (prompt_pack_dir / "identity_cliente_20260518_120000.md").write_text("old", encoding="utf-8")
        (prompt_pack_dir / "full_brand_experience_prompt_pack_20260518_120000.md").write_text("old", encoding="utf-8")

        client_manager.generate_client_prompt_pack("Client A")

        for filename in client_manager.PROMPT_PACK_FILES:
            self.assertTrue((prompt_pack_dir / filename).is_file())

        self.assertFalse(list(prompt_pack_dir.glob("identity_cliente_*.md")))
        self.assertFalse(list(prompt_pack_dir.glob("full_brand_experience_prompt_pack_*.md")))

    def test_endpoint_response_shape(self):
        self._write_latest_json()

        status, data = asyncio.run(_asgi_post("/clients/Client A/prompt-pack/generate"))

        self.assertEqual(status, 200)
        self.assertEqual(data["base"], "05_ENTREGAS/prompt_pack")
        self.assertIn("created", data)
        self.assertIn("deleted_previous", data)
        self.assertFalse(data["used_ai"])


if __name__ == "__main__":
    unittest.main()
