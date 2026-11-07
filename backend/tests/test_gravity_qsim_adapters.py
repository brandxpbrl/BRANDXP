import json
import sys
import tempfile
import unittest
from pathlib import Path


BACKEND_DIR = Path(__file__).resolve().parents[1]
if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))

from services import entity_bible_v2_gravity as gravity
from services.qsim_possibility_adapter import build_possibility_cone


class GravityQsimAdapterTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.original_canon = gravity.CANON_ROOT
        self.original_output = gravity.OUTPUT_ROOT
        gravity.CANON_ROOT = Path(self.temp.name) / "canon"
        gravity.OUTPUT_ROOT = Path(self.temp.name) / "gravity"
        gravity.CANON_ROOT.mkdir()
        (gravity.CANON_ROOT / "eb-test.json").write_text(json.dumps({
            "knowledge_id": "eb-test", "domain": "systems", "definition": "Specific system rule",
            "decision_rules": ["Require evidence"],
            "status": "approved",
            "provenance": {"source_path": "systems/rules.md", "source_sha256": "a" * 64},
            "governance": {"version": "2.0.0", "reviewer": "Felipe", "approved_at": "2026-11-07T00:00:00-03:00"},
            "mcos_validation": {
                "status": "accepted", "reviewed_by": "Felipe",
                "diagnostics": [{"criterion": "specificity", "result": "pass", "reasons": ["complete"]}],
            },
        }), encoding="utf-8")

    def tearDown(self):
        gravity.CANON_ROOT = self.original_canon
        gravity.OUTPUT_ROOT = self.original_output
        self.temp.cleanup()

    def test_gravity_packet_respects_canonical_order_and_evidence_layers(self):
        packet = gravity.build_gravity_review_packet("eb-test")
        stages = [item["stage"] for item in packet["execution_order"]]
        self.assertEqual(stages[0], "factual_base")
        self.assertEqual(stages[-1], "final_verdict")
        self.assertEqual(packet["execution_order"][0]["agents"], ["A23"])
        self.assertEqual(packet["evidence_layers_required"], ["fact", "inference", "hypothesis", "recommendation"])
        self.assertIn("cannot overwrite", packet["promotion_rule"])

    def test_qsim_cone_returns_top_k_entropy_and_simulation_label(self):
        cone = build_possibility_cone([
            {"id": "a", "weight": 5, "assumptions": ["declared"]},
            {"id": "b", "weight": 3},
            {"id": "c", "weight": 2},
        ], source="human workshop")
        self.assertEqual(len(cone["top_k"]), 2)
        self.assertAlmostEqual(sum(item["probability"] for item in cone["scenarios"]), 1.0)
        self.assertEqual(cone["truth_kind"], "simulation")
        self.assertTrue(cone["human_decision_required"])

    def test_qsim_rejects_missing_or_negative_weights(self):
        with self.assertRaises(ValueError):
            build_possibility_cone([{"id": "a", "weight": 0}, {"id": "b", "weight": 0}], "none")
        with self.assertRaises(ValueError):
            build_possibility_cone([{"id": "a", "weight": -1}, {"id": "b", "weight": 2}], "none")


if __name__ == "__main__":
    unittest.main()
