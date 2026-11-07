import json
import sys
import tempfile
import unittest
from pathlib import Path


BACKEND_DIR = Path(__file__).resolve().parents[1]
if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))

from services.entity_bible_v2_loader import (
    CanonValidationError,
    get_approved_unit,
    list_approved_units,
    search_approved_units,
)


class EntityBibleV2LoaderTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.root = Path(self.temp.name) / "canon"
        self.root.mkdir()

    def tearDown(self):
        self.temp.cleanup()

    def _unit(self, knowledge_id="eb-approved", status="approved"):
        return {
            "knowledge_id": knowledge_id,
            "title": "Approved operational rule",
            "domain": "systems",
            "definition": "An approved rule that can only be consumed after human and MCOS review.",
            "decision_rules": ["Require evidence"],
            "status": status,
            "provenance": {"source_path": "systems/rules.md", "source_sha256": "a" * 64},
            "governance": {"version": "2.0.0", "reviewer": "Felipe", "approved_at": "2026-11-07T00:00:00-03:00"},
            "mcos_validation": {"status": "accepted", "reviewed_by": "Felipe"},
            "agent_access": {"recommended_agents": ["lyra"]},
        }

    def _write(self, unit, filename=None):
        path = self.root / (filename or f"{unit['knowledge_id']}.json")
        path.write_text(json.dumps(unit), encoding="utf-8")
        return path

    def test_reads_only_human_approved_mcos_accepted_canon(self):
        self._write(self._unit())
        loaded = get_approved_unit("eb-approved", self.root)
        self.assertEqual(loaded["knowledge_id"], "eb-approved")
        self.assertEqual(list_approved_units(self.root), [loaded])

    def test_rejects_draft_even_when_stored_inside_canon(self):
        self._write(self._unit(status="in_review"))
        with self.assertRaises(CanonValidationError):
            get_approved_unit("eb-approved", self.root)

    def test_rejects_path_traversal_and_filename_identity_mismatch(self):
        with self.assertRaises(CanonValidationError):
            get_approved_unit("../candidates/eb-draft", self.root)
        self._write(self._unit(), filename="eb-other.json")
        with self.assertRaises(CanonValidationError):
            get_approved_unit("eb-other", self.root)

    def test_search_filters_by_domain_and_recommended_agent(self):
        self._write(self._unit())
        self.assertEqual(len(search_approved_units("operational", ["systems"], "lyra", canon_root=self.root)), 1)
        self.assertEqual(search_approved_units("operational", ["philosophy"], "lyra", canon_root=self.root), [])
        self.assertEqual(search_approved_units("operational", ["systems"], "nova", canon_root=self.root), [])


if __name__ == "__main__":
    unittest.main()
