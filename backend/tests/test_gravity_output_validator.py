import sys
import unittest
from pathlib import Path


BACKEND_DIR = Path(__file__).resolve().parents[1]
if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))

from services.gravity_output_validator import GravityOutputValidationError, validate_gravity_output


class GravityOutputValidatorTests(unittest.TestCase):
    def _output(self):
        return {
            "component_id": "GRAVITY:A23",
            "sources": [{"id": "source-input", "locator": "run.input", "sha256": "a" * 64}],
            "claims": [
                {"id": "claim-observed", "text": "The synthetic brief names calm authority.", "truth_kind": "fact", "confidence": 1, "source_ids": ["source-input"]},
                {"id": "claim-reading", "text": "Calm authority may support premium positioning.", "truth_kind": "inference", "confidence": 0.7, "source_ids": ["source-input"], "reasoning": "The stated posture is consistent with controlled premium expression."},
            ],
            "contradictions": [],
        }

    def test_builds_a_hashed_ledger_and_keeps_memory_locked(self):
        ledger = validate_gravity_output(self._output(), {"a" * 64})
        self.assertEqual(len(ledger["sha256"]), 64)
        self.assertTrue(ledger["human_review_required"])
        self.assertFalse(ledger["memory_promotion_allowed"])

    def test_fact_requires_source_and_non_fact_requires_reasoning(self):
        output = self._output()
        output["claims"][0]["source_ids"] = []
        with self.assertRaises(GravityOutputValidationError):
            validate_gravity_output(output)
        output = self._output()
        output["claims"][1].pop("reasoning")
        with self.assertRaises(GravityOutputValidationError):
            validate_gravity_output(output)

    def test_rejects_source_outside_run_and_unknown_contradiction_claim(self):
        with self.assertRaises(GravityOutputValidationError):
            validate_gravity_output(self._output(), {"b" * 64})
        output = self._output()
        output["contradictions"] = [{"left_claim_id": "claim-observed", "right_claim_id": "claim-missing"}]
        with self.assertRaises(GravityOutputValidationError):
            validate_gravity_output(output)


if __name__ == "__main__":
    unittest.main()
