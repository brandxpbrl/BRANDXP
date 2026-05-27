import sys
import tempfile
import unittest
from pathlib import Path


BACKEND_DIR = Path(__file__).resolve().parents[1]
if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))

from services.entity_reasoning_core import build_entity_reasoning


class EntityReasoningCoreTests(unittest.TestCase):
    def setUp(self):
        self._temp_dir = tempfile.TemporaryDirectory()
        self.root = Path(self._temp_dir.name)
        self.client_path = self.root / "Client A"
        self.client_path.mkdir(parents=True)

    def tearDown(self):
        self._temp_dir.cleanup()

    def test_builds_pending_reasoning_when_analysis_is_missing(self):
        result = build_entity_reasoning(
            "Client A",
            self.client_path,
            {
                "latest_analysis": False,
                "brand_memory_core": False,
                "visual_dna_engine": False,
                "content_intelligence_engine": False,
                "ai_agent_os": False,
                "deliverables": False,
            },
        )

        self.assertEqual(result["recommendation"]["state"], "needs_analysis")
        self.assertEqual(result["entity_state"]["status"], "pending")
        self.assertEqual(result["reasoning"]["next_best_action"]["action_id"], "run_framework")
        self.assertEqual(result["reasoning"]["entity_presence"], "diagnosticando")
        self.assertIn("executive_reading", result["reasoning"])
        self.assertIn("decision_principles", result["entity_profile"])
        self.assertIn("welcome", result["fluid_messages"])

    def test_builds_operational_reasoning_with_active_system(self):
        (self.client_path / "05_ENTREGAS").mkdir()
        (self.client_path / "05_ENTREGAS/MASTER_BRAND_EXPERIENCE.md").write_text("# Master", encoding="utf-8")

        result = build_entity_reasoning(
            "Client A",
            self.client_path,
            {
                "latest_analysis": True,
                "brand_memory_core": True,
                "visual_dna_engine": True,
                "content_intelligence_engine": True,
                "ai_agent_os": True,
                "deliverables": True,
                "visual_assets": True,
            },
        )

        self.assertEqual(result["recommendation"]["state"], "operational")
        self.assertEqual(result["entity_state"]["status"], "operational")
        self.assertEqual(result["reasoning"]["next_best_action"]["action_id"], "review_deliverables")
        self.assertEqual(result["reasoning"]["entity_presence"], "sintetizando")
        self.assertTrue(result["reasoning"]["strategic_questions"])
        self.assertTrue(result["reasoning"]["action_routes"])


if __name__ == "__main__":
    unittest.main()
