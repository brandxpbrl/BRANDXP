import sys
import tempfile
import unittest
from pathlib import Path


BACKEND_DIR = Path(__file__).resolve().parents[1]
if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))

from services import gravity_runtime


class GravitySpecialistBatchTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.original_root = gravity_runtime.RUNS_ROOT
        gravity_runtime.RUNS_ROOT = Path(self.temp.name) / "runs"

    def tearDown(self):
        gravity_runtime.RUNS_ROOT = self.original_root
        self.temp.cleanup()

    def _approved_a23(self):
        run = gravity_runtime.create_dry_run({"title": "Source", "evidence": "Fictional evidence."})
        run = gravity_runtime.request_task(run["id"], "A23")
        source_hash = run["input"]["sha256"]
        run = gravity_runtime.record_synthetic_output(run["id"], "A23", {
            "sources": [{"id": "source-input", "locator": "run.input", "sha256": source_hash}],
            "claims": [{"id": "claim-source", "text": "The evidence is fictional.", "truth_kind": "fact", "confidence": 1, "source_ids": ["source-input"]}],
        })
        return gravity_runtime.review_task_output(run["id"], "A23", "approved", "Human")

    def test_four_batches_cover_every_remaining_specialist_exactly_once(self):
        members = [member for batch in gravity_runtime.SPECIALIST_BATCHES.values() for member in batch]
        self.assertEqual(len(members), 19)
        self.assertEqual(len(set(members)), 19)
        self.assertEqual(set(members), {f"A{i:02d}" for i in range(1, 23)} - {"A01", "A03", "A06"})

    def test_batch_manifest_is_hashed_and_approved_atomically(self):
        source = self._approved_a23()
        run = gravity_runtime.derive_specialist_batch_run(source["id"], "marketing_communication")
        for component_id in gravity_runtime.SPECIALIST_BATCHES["marketing_communication"]:
            run = gravity_runtime.request_task(run["id"], component_id)
            run = gravity_runtime.record_synthetic_output(run["id"], component_id, {
                "sources": [{"id": "source-input", "locator": "run.input", "sha256": run["input"]["sha256"]}],
                "claims": [{
                    "id": f"claim-{component_id.casefold()}", "text": f"Proposal from {component_id}.",
                    "truth_kind": "recommendation", "confidence": 0.5, "source_ids": ["source-input"],
                    "reasoning": "Synthetic batch validation only.",
                }],
            })
        run = gravity_runtime.build_specialist_batch_manifest(run["id"])
        self.assertEqual(len(run["batch"]["manifest"]["sha256"]), 64)
        self.assertEqual(run["batch"]["manifest"]["total_claims"], 3)
        run = gravity_runtime.review_specialist_batch(run["id"], "approved", "Human reviewer")
        self.assertEqual(run["state"], "approved")
        manifest_hash = run["batch"]["manifest"]["sha256"]
        for task in run["tasks"]:
            if task["component_id"] != "GRAVITY:A23":
                self.assertEqual(task["review"]["batch_manifest_hash"], manifest_hash)

    def test_incomplete_batch_cannot_create_manifest(self):
        source = self._approved_a23()
        run = gravity_runtime.derive_specialist_batch_run(source["id"], "identity_perception")
        with self.assertRaises(ValueError):
            gravity_runtime.build_specialist_batch_manifest(run["id"])


if __name__ == "__main__":
    unittest.main()
