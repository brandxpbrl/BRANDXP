import sys
import tempfile
import unittest
from pathlib import Path


BACKEND_DIR = Path(__file__).resolve().parents[1]
if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))

from services import entity_bible_v2_mcos as mcos


class EntityBibleV2McosTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.root = Path(self.temp.name)
        self.original_source = mcos.SOURCE_ROOT
        self.original_candidates = mcos.CANDIDATES_ROOT
        self.original_validations = mcos.VALIDATIONS_ROOT
        self.original_canon = mcos.CANON_ROOT
        mcos.SOURCE_ROOT = self.root / "source"
        mcos.CANDIDATES_ROOT = self.root / "candidates"
        mcos.VALIDATIONS_ROOT = self.root / "validations"
        mcos.CANON_ROOT = self.root / "canon"
        source = mcos.SOURCE_ROOT / "systems" / "rules.md"
        source.parent.mkdir(parents=True)
        source.write_text("# Legacy rules", encoding="utf-8")

    def tearDown(self):
        mcos.SOURCE_ROOT = self.original_source
        mcos.CANDIDATES_ROOT = self.original_candidates
        mcos.VALIDATIONS_ROOT = self.original_validations
        mcos.CANON_ROOT = self.original_canon
        self.temp.cleanup()

    def _candidate(self):
        return mcos.create_candidate({
            "knowledge_id": "eb-test-rule", "title": "Test Rule", "domain": "systems",
            "knowledge_type": "rule", "source_path": "systems/rules.md",
            "definition": "A sufficiently concrete definition that describes an operational relationship with observable consequences and explicit scope.",
            "when_to_use": ["During a test"],
            "diagnostic_method": ["Inspect", "Compare", "Decide"],
            "observable_indicators": ["Owner exists", "Evidence exists", "Gate exists"],
            "analysis_questions": ["Who owns it?", "What proves it?", "What blocks it?"],
            "decision_rules": ["Require ownership", "Require evidence"],
            "good_examples": [{"situation": "Clear task", "result": "Verified completion"}],
            "bad_examples": [{"situation": "Vague task", "result": "Unknown completion"}],
            "limits_and_counterexamples": ["Exploration", "Emergency"],
            "expected_result": "A verified operational result with accountable ownership.",
            "relationships": [{"target_id": "eb-memory", "relation": "depends_on", "justification": "Evidence must persist after execution."}],
            "recommended_agents": ["lyra"],
        })

    def test_candidate_keeps_legacy_provenance_and_is_not_canon(self):
        candidate = self._candidate()
        self.assertEqual(candidate["status"], "in_review")
        self.assertEqual(candidate["provenance"]["source_type"], "legacy_doctrine")
        self.assertIsNone(candidate["governance"]["approved_at"])

    def test_mcos_validation_has_reasons_lineage_and_no_canon_effect(self):
        validation = mcos.validate_candidate_with_mcos(self._candidate())
        self.assertEqual(validation["status"], "candidate")
        self.assertEqual(validation["score"], 100)
        self.assertEqual(len(validation["transformations"]), 3)
        self.assertTrue(all(item["reasons"] for item in validation["diagnostics"]))
        self.assertEqual(validation["canon_effect"], "none_until_human_approval")
        self.assertTrue(validation["lineage"])

    def test_evolution_compares_diagnostic_changes(self):
        previous = {"knowledge_id": "eb-test", "candidate_version": "1", "score": 60, "diagnostics": [{"criterion": "specificity", "result": "fail"}]}
        current = {"knowledge_id": "eb-test", "candidate_version": "2", "score": 100, "diagnostics": [{"criterion": "specificity", "result": "pass"}]}
        comparison = mcos.compare_validations(previous, current)
        self.assertEqual(comparison["score_change"], 40)
        self.assertTrue(comparison["requires_canon_review"])

    def test_only_human_review_promotes_candidate_to_canon(self):
        candidate = self._candidate()
        mcos.validate_candidate_with_mcos(candidate)
        self.assertFalse((mcos.CANON_ROOT / "eb-test-rule.json").exists())
        approved = mcos.review_candidate("eb-test-rule", "approved", "Felipe Vallejo", "Piloto validado")
        self.assertEqual(approved["status"], "approved")
        self.assertEqual(approved["governance"]["reviewer"], "Felipe Vallejo")
        self.assertTrue((mcos.CANON_ROOT / "eb-test-rule.json").is_file())

    def test_rejection_never_creates_canon(self):
        candidate = self._candidate()
        mcos.validate_candidate_with_mcos(candidate)
        rejected = mcos.review_candidate("eb-test-rule", "rejected", "Felipe Vallejo", "Requiere cambios")
        self.assertEqual(rejected["status"], "rejected")
        self.assertFalse((mcos.CANON_ROOT / "eb-test-rule.json").exists())


if __name__ == "__main__":
    unittest.main()
