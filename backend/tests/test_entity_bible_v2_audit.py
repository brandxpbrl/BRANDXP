import json
import sys
import tempfile
import unittest
from pathlib import Path


BACKEND_DIR = Path(__file__).resolve().parents[1]
if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))

from services.entity_bible_v2_audit import audit_document, run_entity_bible_v2_audit


class EntityBibleV2AuditTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.root = Path(self.temp.name) / "source"
        self.output = Path(self.temp.name) / "output"
        self.root.mkdir()

    def tearDown(self):
        self.temp.cleanup()

    def _write(self, relative, content):
        path = self.root / relative
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_text(content, encoding="utf-8")
        return path

    def test_detects_template_dominance_and_missing_v2_sections(self):
        path = self._write(
            "perception/example.md",
            """# Example
This concept exists as a foundational perceptual law.
Every entity transmits emotional meaning before logical understanding.
This concept does not exist independently.
The Entity Bible functions as a living cognitive network.
""",
        )
        result = audit_document(path, self.root)
        self.assertTrue(result["template_dominant"])
        self.assertEqual(result["semantic_readiness_score"], 0)
        self.assertEqual(result["migration_status"], "requires_semantic_rewrite")

    def test_recognizes_v2_semantic_sections(self):
        headings = "\n".join(f"## {name}\nSpecific content" for name in [
            "Definition", "When to use", "Diagnostic method", "Observable indicators",
            "Analysis questions", "Decision rules", "Good examples", "Bad examples",
            "Limits and counterexamples", "Expected result",
        ])
        path = self._write("systems/method.md", f"# Method\n{headings}")
        result = audit_document(path, self.root)
        self.assertEqual(result["semantic_readiness_score"], 100)
        self.assertFalse(result["template_dominant"])

    def test_detects_empty_strategic_importance_without_bullets(self):
        empty = self._write(
            "social_media/rules.md",
            "# Rules\n## Strategic Importance\nThis principle directly impacts:\n\n---\n## Final\nText",
        )
        filled = self._write(
            "luxury/rules.md",
            "# Rules\n## Strategic Importance\nThis principle directly impacts:\n- perceived value\n---",
        )
        self.assertTrue(audit_document(empty, self.root)["empty_strategic_importance"])
        self.assertFalse(audit_document(filled, self.root)["empty_strategic_importance"])

    def test_audit_is_read_only_and_writes_manifest(self):
        source = self._write("memory/rules.md", "# Rules\nOriginal content")
        before = source.read_bytes()
        result = run_entity_bible_v2_audit(self.root, self.output)
        self.assertEqual(result["summary"]["documents"], 1)
        self.assertEqual(result["summary"]["original_files_modified"], 0)
        self.assertEqual(source.read_bytes(), before)
        self.assertTrue(Path(result["files"]["json"]).is_file())
        self.assertTrue(Path(result["files"]["markdown"]).is_file())

    def test_v2_schema_requires_mcos_applied_validation(self):
        schema_path = BACKEND_DIR / "config" / "entity_bible_v2_schema.json"
        schema = json.loads(schema_path.read_text(encoding="utf-8"))
        self.assertIn("mcos_validation", schema["required"])
        modes = schema["properties"]["mcos_validation"]["properties"]["transformations"]["items"]["properties"]["mode"]["enum"]
        self.assertIn("narrative", modes)
        self.assertIn("cinematic", modes)
        self.assertIn("operational", modes)


if __name__ == "__main__":
    unittest.main()
