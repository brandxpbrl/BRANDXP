import sys
import tempfile
import unittest
from pathlib import Path


BACKEND_DIR = Path(__file__).resolve().parents[1]
if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))

import entity_bible_loader


class EntityBibleLoaderTests(unittest.TestCase):
    def setUp(self):
        self._original_root = entity_bible_loader.ENTITY_BIBLE_ROOT
        self._temp_dir = tempfile.TemporaryDirectory()
        self.root = Path(self._temp_dir.name) / "entity_bible"
        entity_bible_loader.ENTITY_BIBLE_ROOT = self.root
        self._build_bible()

    def tearDown(self):
        entity_bible_loader.ENTITY_BIBLE_ROOT = self._original_root
        self._temp_dir.cleanup()

    def _write(self, relative_path, content):
        path = self.root / relative_path
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_text(content, encoding="utf-8")
        return path

    def _build_bible(self):
        self._write("core/brand_philosophy.md", "brand philosophy core")
        self._write("core/entity_framework.md", "entity framework core")
        self._write("core/storytelling_framework.md", "storytelling framework core")
        self._write("core/tone_of_voice.md", "tone of voice core")
        self._write("core/visual_language.md", "visual language core")
        self._write("core/positioning.md", "positioning core")
        self._write("knowledge/philosophy/identity_before_design.md", "identity before design")
        self._write("knowledge/perception/perception_before_logic.md", "perception before logic")
        self._write("knowledge/perception/visual_authority.md", "visual authority")
        self._write("knowledge/perception/perceived_value.md", "perceived value")
        self._write("knowledge/perception/subconscious_branding.md", "subconscious branding")
        self._write("knowledge/visual_psychology/color_emotion.md", "color emotion")
        self._write("knowledge/visual_psychology/negative_space.md", "negative space")
        self._write("knowledge/visual_psychology/contrast_psychology.md", "contrast psychology")
        self._write("knowledge/visual_psychology/cinematic_composition.md", "cinematic composition")
        self._write("knowledge/luxury/luxury_perception.md", "luxury perception")
        self._write("knowledge/luxury/premium_positioning.md", "premium positioning")
        self._write("knowledge/luxury/presence_over_noise.md", "presence over noise")
        self._write("knowledge/entity_detection/identity_patterns.md", "identity patterns")
        self._write("knowledge/entity_detection/entity_voice.md", "entity voice")
        self._write("knowledge/entity_detection/visual_archetypes.md", "visual archetypes")
        self._write("knowledge/entity_detection/narrative_essence.md", "narrative essence")

    def test_load_entity_bible_core_reads_core_files(self):
        context = entity_bible_loader.load_entity_bible_core()

        self.assertIn("brand philosophy core", context)
        self.assertIn("entity framework core", context)
        self.assertNotIn("perception before logic", context)

    def test_load_entity_bible_context_reads_core_and_knowledge(self):
        context = entity_bible_loader.load_entity_bible_context()

        self.assertIn("brand philosophy core", context)
        self.assertIn("perception before logic", context)
        self.assertIn("visual archetypes", context)

    def test_load_entity_bible_for_agent_returns_specific_context(self):
        branding_context = entity_bible_loader.load_entity_bible_for_agent("branding_agent")
        content_context = entity_bible_loader.load_entity_bible_for_agent("content_agent")

        self.assertIn("brand philosophy core", branding_context)
        self.assertIn("identity patterns", branding_context)
        self.assertIn("storytelling framework core", content_context)
        self.assertIn("narrative essence", content_context)
        self.assertNotIn("luxury perception", content_context)

    def test_load_entity_bible_for_master_returns_context(self):
        context = entity_bible_loader.load_entity_bible_for_master()

        self.assertIn("brand philosophy core", context)
        self.assertIn("premium positioning", context)
        self.assertIn("perceived value", context)

    def test_load_entity_bible_for_visual_boards_returns_context(self):
        context = entity_bible_loader.load_entity_bible_for_visual_boards()

        self.assertIn("visual language core", context)
        self.assertIn("color emotion", context)
        self.assertIn("cinematic composition", context)
        self.assertIn("visual archetypes", context)

    def test_does_not_read_env(self):
        self._write(".env", "SECRET=1")

        context = entity_bible_loader.load_entity_bible_context()

        self.assertNotIn("SECRET=1", context)

    def test_does_not_read_py(self):
        self._write("core/legacy.py", "print('unsafe')")

        context = entity_bible_loader.load_entity_bible_context()

        self.assertNotIn("unsafe", context)

    def test_does_not_read_files_outside_entity_bible(self):
        outside = self.root.parent / "outside.md"
        outside.write_text("outside content", encoding="utf-8")

        self.assertEqual(entity_bible_loader._safe_read_text_file(outside), "")

    def test_path_traversal_is_not_allowed(self):
        outside = self.root.parent / "outside.md"
        outside.write_text("outside content", encoding="utf-8")
        traversal = self.root / ".." / "outside.md"

        self.assertFalse(entity_bible_loader._is_within_entity_bible_root(traversal))
        self.assertEqual(entity_bible_loader._safe_read_text_file(traversal), "")

    def test_respects_file_size_limit(self):
        large = self._write("core/large.md", "x" * (entity_bible_loader.MAX_FILE_BYTES + 1))

        self.assertFalse(entity_bible_loader._is_allowed_bible_file(large))
        self.assertNotIn("x" * 100, entity_bible_loader.load_entity_bible_core())

    def test_respects_total_character_limit(self):
        context = entity_bible_loader.load_entity_bible_context(max_total_chars=120)

        self.assertLessEqual(len(context), 120)

    def test_returns_headers_with_relative_paths(self):
        context = entity_bible_loader.load_entity_bible_core()

        self.assertIn("--- ENTITY_BIBLE_FILE: core/brand_philosophy.md ---", context)

    def test_optional_folder_missing_does_not_fail(self):
        context = entity_bible_loader._render_bible_context(
            entity_bible_loader._collect_bible_files(["missing_folder"])
        )

        self.assertEqual(context, "")

    def test_context_does_not_return_absolute_paths(self):
        context = entity_bible_loader.load_entity_bible_context()

        self.assertNotIn(str(self.root), context)
        self.assertNotIn("\\", context)


if __name__ == "__main__":
    unittest.main()
