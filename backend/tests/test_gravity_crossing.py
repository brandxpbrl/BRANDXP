import sys
import tempfile
import unittest
from pathlib import Path


BACKEND_DIR = Path(__file__).resolve().parents[1]
if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))

from services import gravity_runtime
from services.gravity_output_validator import validate_gravity_output


class GravityCrossingTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.original_root = gravity_runtime.RUNS_ROOT
        gravity_runtime.RUNS_ROOT = Path(self.temp.name) / "runs"

    def tearDown(self):
        gravity_runtime.RUNS_ROOT = self.original_root
        self.temp.cleanup()

    def test_synaptic_bundle_is_a_valid_namespaced_output(self):
        ledger = validate_gravity_output({
            "component_id": "GRAVITY:SYNAPSES",
            "sources": [{"id": "s", "locator": "lineage", "sha256": "a" * 64}],
            "claims": [{
                "id": "claim-cross", "text": "The approved outputs share a theme.",
                "truth_kind": "inference", "confidence": 0.8, "source_ids": ["s"],
                "reasoning": "Cross-output comparison.",
            }],
        })
        self.assertEqual(ledger["component_id"], "GRAVITY:SYNAPSES")

    def test_crossing_rejects_missing_source_runs(self):
        with self.assertRaises(ValueError):
            gravity_runtime.derive_crossing_run(["gravity-run-missing"] * 5)

    def test_cleanup_rejects_missing_or_unapproved_crossing(self):
        self.assertIsNone(gravity_runtime.derive_cleanup_run("gravity-run-missing"))
        run = gravity_runtime.create_dry_run({
            "title": "Crossing", "evidence": "Synthetic.", "mode": "crossings_only"
        })
        with self.assertRaises(ValueError):
            gravity_runtime.derive_cleanup_run(run["id"])

    def test_synthesis_rejects_missing_or_unapproved_cleanup(self):
        self.assertIsNone(gravity_runtime.derive_synthesis_run("gravity-run-missing"))
        run = gravity_runtime.create_dry_run({
            "title": "Cleanup", "evidence": "Synthetic.", "mode": "cleanup_only"
        })
        with self.assertRaises(ValueError):
            gravity_runtime.derive_synthesis_run(run["id"])

    def test_macro_cycle_rejects_missing_or_unapproved_synthesis(self):
        self.assertIsNone(gravity_runtime.derive_macro_cycle_run("gravity-run-missing"))
        run = gravity_runtime.create_dry_run({
            "title": "Synthesis", "evidence": "Synthetic.", "mode": "synthesis_only"
        })
        with self.assertRaises(ValueError):
            gravity_runtime.derive_macro_cycle_run(run["id"])


if __name__ == "__main__":
    unittest.main()
