import json
import sys
import tempfile
import unittest
from pathlib import Path


BACKEND_DIR = Path(__file__).resolve().parents[1]
if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))

from services import gravity_runtime


class GravityRuntimeTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.original_root = gravity_runtime.RUNS_ROOT
        gravity_runtime.RUNS_ROOT = Path(self.temp.name) / "runs"

    def tearDown(self):
        gravity_runtime.RUNS_ROOT = self.original_root
        self.temp.cleanup()

    def test_first_runner_only_accepts_synthetic_dry_runs(self):
        with self.assertRaises(ValueError):
            gravity_runtime.create_dry_run({"title": "x", "evidence": "real client", "evidence_kind": "production"})
        with self.assertRaises(ValueError):
            gravity_runtime.create_dry_run({"title": "x", "evidence": "synthetic", "execution_mode": "live"})

    def test_a23_only_run_is_frozen_and_model_gate_is_locked(self):
        run = gravity_runtime.create_dry_run({"title": "Synthetic identity", "evidence": "A fictional premium travel brand.", "mode": "a23_only"})
        self.assertEqual(len(run["tasks"]), 1)
        self.assertEqual(run["tasks"][0]["component_id"], "GRAVITY:A23")
        self.assertFalse(run["approval_gate"]["model_calls_allowed"])
        self.assertEqual(run["events"][0]["event_type"], "input_supplied")
        stored = json.loads((gravity_runtime.RUNS_ROOT / f"{run['id']}.json").read_text(encoding="utf-8"))
        self.assertEqual(stored["input"]["sha256"], run["input"]["sha256"])

    def test_minimal_specialists_require_a23_first(self):
        run = gravity_runtime.create_dry_run({"title": "Synthetic identity", "evidence": "Fictional evidence.", "mode": "minimal_specialists"})
        with self.assertRaises(ValueError):
            gravity_runtime.request_task(run["id"], "A01")
        requested = gravity_runtime.request_task(run["id"], "A23")
        task = next(item for item in requested["tasks"] if item["component_id"] == "GRAVITY:A23")
        self.assertEqual(task["state"], "requested")
        self.assertEqual(requested["events"][-1]["event_type"], "agent_requested")
        self.assertFalse(requested["events"][-1]["details"]["model_call_performed"])

    def test_full_plan_has_crossing_and_all_34_agents(self):
        run = gravity_runtime.create_dry_run({"title": "Full synthetic plan", "evidence": "Fictional evidence.", "mode": "full_plan"})
        self.assertEqual(len(run["tasks"]), 35)
        self.assertEqual(sum(task["component_id"] == "GRAVITY:SYNAPSES" for task in run["tasks"]), 1)

    def test_synthetic_a23_output_is_validated_and_awaits_human_review(self):
        run = gravity_runtime.create_dry_run({
            "title": "Synthetic identity", "evidence": "A fictional brand values calm authority.", "mode": "a23_only"
        })
        run = gravity_runtime.request_task(run["id"], "A23")
        source_hash = run["input"]["sha256"]
        saved = gravity_runtime.record_synthetic_output(run["id"], "A23", {
            "sources": [{"id": "source-input", "locator": "run.input", "sha256": source_hash}],
            "claims": [
                {
                    "id": "claim-calm-authority", "text": "The fictional brief names calm authority.",
                    "truth_kind": "fact", "confidence": 1, "source_ids": ["source-input"],
                },
                {
                    "id": "claim-premium-fit", "text": "Calm authority may support premium positioning.",
                    "truth_kind": "inference", "confidence": 0.7, "source_ids": ["source-input"],
                    "reasoning": "Controlled expression can be consistent with a premium posture.",
                },
            ],
            "contradictions": [],
        })
        task = saved["tasks"][0]
        self.assertEqual(task["state"], "completed")
        self.assertEqual(saved["state"], "awaiting_review")
        self.assertFalse(task["output"]["memory_promotion_allowed"])
        self.assertEqual(saved["events"][-1]["trajectory_kind"], "simulated")
        self.assertFalse(saved["events"][-1]["details"]["model_call_performed"])

        approved = gravity_runtime.review_task_output(
            run["id"], "A23", "approved", "Felipe Vallejo", "Salida sintética aprobada."
        )
        self.assertEqual(approved["state"], "approved")
        self.assertEqual(approved["tasks"][0]["review"]["reviewer"], "Felipe Vallejo")
        self.assertEqual(approved["events"][-1]["validity"], "human_approved")
        self.assertFalse(approved["events"][-1]["details"]["memory_promotion_allowed"])

    def test_output_cannot_be_recorded_before_request_or_with_foreign_source(self):
        run = gravity_runtime.create_dry_run({"title": "Synthetic", "evidence": "Fictional evidence."})
        output = {
            "sources": [{"id": "foreign", "locator": "other.run", "sha256": "f" * 64}],
            "claims": [{"id": "claim-x", "text": "Unsupported fact", "truth_kind": "fact", "confidence": 1, "source_ids": ["foreign"]}],
        }
        with self.assertRaises(ValueError):
            gravity_runtime.record_synthetic_output(run["id"], "A23", output)
        gravity_runtime.request_task(run["id"], "A23")
        with self.assertRaises(ValueError):
            gravity_runtime.record_synthetic_output(run["id"], "A23", output)

    def test_dependent_agent_requires_human_approval_of_a23(self):
        run = gravity_runtime.create_dry_run({
            "title": "Synthetic staged run", "evidence": "Fictional evidence.", "mode": "minimal_specialists"
        })
        run = gravity_runtime.request_task(run["id"], "A23")
        h = run["input"]["sha256"]
        run = gravity_runtime.record_synthetic_output(run["id"], "A23", {
            "sources": [{"id": "source-input", "locator": "run.input", "sha256": h}],
            "claims": [{"id": "claim-input", "text": "The input is fictional.", "truth_kind": "fact", "confidence": 1, "source_ids": ["source-input"]}],
        })
        with self.assertRaises(ValueError):
            gravity_runtime.request_task(run["id"], "A01")
        gravity_runtime.review_task_output(run["id"], "A23", "approved", "Human reviewer")
        requested = gravity_runtime.request_task(run["id"], "A01")
        self.assertEqual(next(item for item in requested["tasks"] if item["component_id"] == "GRAVITY:A01")["state"], "requested")


if __name__ == "__main__":
    unittest.main()
