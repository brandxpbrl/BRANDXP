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


if __name__ == "__main__":
    unittest.main()
