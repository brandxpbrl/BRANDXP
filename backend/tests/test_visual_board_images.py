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
from main import app
from PIL import Image


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


class VisualBoardImagesTests(unittest.TestCase):
    def setUp(self):
        self._original_clients_root = client_manager.CLIENTS_ROOT
        self._temp_dir = tempfile.TemporaryDirectory()
        client_manager.CLIENTS_ROOT = Path(self._temp_dir.name)

    def tearDown(self):
        client_manager.CLIENTS_ROOT = self._original_clients_root
        self._temp_dir.cleanup()

    def _client_path(self):
        client_path = client_manager.CLIENTS_ROOT / "Client A"
        (client_path / "05_ENTREGAS" / "board_specs").mkdir(parents=True)
        return client_path

    def _write_specs(self):
        client_path = self._client_path()
        specs_dir = client_path / "05_ENTREGAS" / "board_specs"
        specs = {
            "brand_identity_board": {
                "client_name": "Client A",
                "entity_bible_applied": True,
                "layout_theme": "premium_editorial_entity_system",
                "hero_title": "Client A Hero",
                "hero_subtitle": "Identity Board Premium",
                "brand_promise": "Turn scattered signals into a premium brand system.",
                "perception_angle": "Make value felt before it is explained.",
                "premium_positioning": "Premium positioning through restraint and coherence.",
                "visual_authority": "Build authority with hierarchy, negative space, and contrast.",
                "brand_descriptor": "Premium identity system",
                "tagline": "Sharper brand perception",
                "logo_system": {"primary": "Primary logo", "variants": ["Horizontal"], "icon": "Symbol"},
                "palette": [{"name": "Accent", "hex": "#D9428F", "meaning": "Distinction"}],
                "typography": {"primary": "Display", "secondary": "Sans", "usage": "Hierarchy"},
                "brand_tone": [{"name": "Clear", "description": "Specific and useful"}],
                "tone_cards": [{"name": "Precise", "description": "Specific and useful"}],
                "instagram_style": [{"pillar": "Authority", "description": "Show expertise"}],
                "commercial_example": {"offer": "Brand package", "services": ["Diagnosis"], "cta": "Book now"},
                "commercial_offer": {
                    "title": "Signature Experience",
                    "promise": "A premium commercial promise",
                    "cta": "Start with diagnosis",
                },
                "benefits": [{"name": "Clarity", "description": "Easier to choose"}],
                "benefit_bar": ["Sharper perception", "Premium trust", "Reusable system", "Clear conversion", "Visual authority"],
                "footer_claim": "Designed to make the brand easier to feel and choose.",
            },
            "storytelling_strategy_board": {
                "client_name": "Client A",
                "story_objective": "Turn attention into action",
                "story_essence": [{"principle": "Transformation", "description": "Show the shift"}],
                "framework": [{"step": "1", "name": "Hook", "description": "Name tension"}],
                "emotional_pillars": [{"name": "Trust", "description": "Reduce uncertainty"}],
                "tone_voice": {"keywords": ["clear"], "description": "Useful and premium"},
                "formats": [{"name": "Reel", "purpose": "Make one idea memorable"}],
                "golden_rules": [{"name": "Be concrete", "description": "Use evidence"}],
                "closing_manifesto": "Make the brand easier to remember.",
            },
            "visual_universe_board": {
                "client_name": "Client A",
                "core_essence": "Recognizable before explained",
                "general_atmosphere": ["Editorial"],
                "emotional_palette": [{"name": "Cool Signal", "hex": "#5F6EE6", "emotion": "Precision"}],
                "lighting": ["Soft contrast"],
                "composition": ["Strong hierarchy"],
                "cinematic_style": ["Close details"],
                "motion_system": ["Slow reveal"],
                "instagram_direction": ["One idea per post"],
                "reels_style": ["Strong first frame"],
                "final_objective": "Guide all visual assets.",
            },
        }

        for name, spec in specs.items():
            (specs_dir / f"{name}.json").write_text(json.dumps(spec), encoding="utf-8")

        return client_path

    def test_missing_client_returns_404(self):
        status, data = asyncio.run(_asgi_post("/clients/Missing Client/visual-boards/render-images"))

        self.assertEqual(status, 404)
        self.assertEqual(data["detail"], "Client not found.")

    def test_missing_board_specs_returns_clear_error(self):
        self._client_path()

        status, data = asyncio.run(_asgi_post("/clients/Client A/visual-boards/render-images"))

        self.assertEqual(status, 400)
        self.assertIn("Missing required board spec", data["detail"])

    def test_specs_generate_three_png_files(self):
        client_path = self._write_specs()

        result = client_manager.render_client_visual_board_images("Client A")
        brand_image_path = client_path / "05_ENTREGAS" / "visuals" / "brand_identity_board.png"

        self.assertEqual(len(result["created"]), 3)
        self.assertTrue(all(path.endswith(".png") for path in result["created"]))
        self.assertTrue(brand_image_path.is_file())
        self.assertTrue((client_path / "05_ENTREGAS" / "visuals" / "storytelling_strategy_board.png").is_file())
        self.assertTrue((client_path / "05_ENTREGAS" / "visuals" / "visual_universe_board.png").is_file())

        with Image.open(brand_image_path) as image:
            self.assertEqual(image.size, (2400, 1350))

    def test_brand_identity_renderer_uses_enriched_fields(self):
        client_path = self._write_specs()
        spec_path = client_path / "05_ENTREGAS" / "board_specs" / "brand_identity_board.json"
        spec = json.loads(spec_path.read_text(encoding="utf-8"))
        captured_text = []
        original_draw_wrapped_text = client_manager._draw_wrapped_text

        def capture_text(draw, text, xy, font, fill, max_width, line_spacing=6, max_lines=None):
            captured_text.append(str(text))
            return original_draw_wrapped_text(draw, text, xy, font, fill, max_width, line_spacing, max_lines)

        client_manager._draw_wrapped_text = capture_text

        try:
            client_manager._render_brand_identity_board_image(
                spec,
                client_path / "05_ENTREGAS" / "visuals_test.png",
            )
        finally:
            client_manager._draw_wrapped_text = original_draw_wrapped_text

        serialized_text = "\n".join(captured_text)
        self.assertIn("CLIENT A HERO", serialized_text)
        self.assertIn("Turn scattered signals into a premium brand system.", serialized_text)
        self.assertIn("Make value felt before it is explained.", serialized_text)
        self.assertIn("Build authority with hierarchy, negative space, and contrast.", serialized_text)
        self.assertIn("Premium positioning through restraint and coherence.", serialized_text)
        self.assertIn("Designed to make the brand easier to feel and choose.", serialized_text)

    def test_brand_identity_renderer_falls_back_without_enriched_fields(self):
        client_path = self._write_specs()
        spec_path = client_path / "05_ENTREGAS" / "board_specs" / "brand_identity_board.json"
        spec = json.loads(spec_path.read_text(encoding="utf-8"))

        for key in [
            "hero_title",
            "hero_subtitle",
            "brand_promise",
            "perception_angle",
            "premium_positioning",
            "visual_authority",
            "commercial_offer",
            "benefit_bar",
            "footer_claim",
        ]:
            spec.pop(key, None)

        output_path = client_path / "05_ENTREGAS" / "fallback_brand.png"
        client_manager._render_brand_identity_board_image(spec, output_path)

        with Image.open(output_path) as image:
            self.assertEqual(image.size, (2400, 1350))

    def test_existing_png_is_versioned_without_overwrite(self):
        client_path = self._write_specs()
        visuals_dir = client_path / "05_ENTREGAS" / "visuals"
        visuals_dir.mkdir()
        original = visuals_dir / "brand_identity_board.png"
        original.write_bytes(b"original")

        result = client_manager.render_client_visual_board_images("Client A")

        self.assertEqual(original.read_bytes(), b"original")
        self.assertTrue(any(path.startswith("05_ENTREGAS/visuals/brand_identity_board_") for path in result["versioned"]))

    def test_response_does_not_include_absolute_paths(self):
        self._write_specs()

        _status, data = asyncio.run(_asgi_post("/clients/Client A/visual-boards/render-images"))
        serialized = json.dumps(data)

        self.assertNotIn(str(client_manager.CLIENTS_ROOT), serialized)
        self.assertNotIn("\\", serialized)

    def test_writes_only_inside_visuals_folder(self):
        client_path = self._write_specs()

        client_manager.render_client_visual_board_images("Client A")

        generated_files = [
            path.relative_to(client_path).as_posix()
            for path in client_path.rglob("*")
            if path.is_file() and path.suffix == ".png"
        ]

        self.assertEqual(len(generated_files), 3)
        self.assertTrue(all(path.startswith("05_ENTREGAS/visuals/") for path in generated_files))

    def test_used_ai_is_false(self):
        self._write_specs()

        result = client_manager.render_client_visual_board_images("Client A")

        self.assertFalse(result["used_ai"])
        self.assertEqual(result["renderer"], "pillow")

    def test_missing_required_spec_fails_without_partial_images(self):
        client_path = self._write_specs()
        (client_path / "05_ENTREGAS" / "board_specs" / "visual_universe_board.json").unlink()

        with self.assertRaises(FileNotFoundError):
            client_manager.render_client_visual_board_images("Client A")

        self.assertFalse((client_path / "05_ENTREGAS" / "visuals").exists())

    def test_endpoint_response_shape(self):
        self._write_specs()

        status, data = asyncio.run(_asgi_post("/clients/Client A/visual-boards/render-images"))

        self.assertEqual(status, 200)
        self.assertIn("created", data)
        self.assertIn("versioned", data)
        self.assertIn("source_specs", data)
        self.assertEqual(data["renderer"], "pillow")
        self.assertFalse(data["used_ai"])


if __name__ == "__main__":
    unittest.main()
