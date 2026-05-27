import json
import sys
import tempfile
import unittest
from pathlib import Path


BACKEND_DIR = Path(__file__).resolve().parents[1]
if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))

import client_manager
from services import client_activation_engine, entity_advisor


class ClientActivationEngineTests(unittest.TestCase):
    def setUp(self):
        self._original_client_manager_root = client_manager.CLIENTS_ROOT
        self._original_advisor_clients_root = entity_advisor.CLIENTS_ROOT
        self._temp_dir = tempfile.TemporaryDirectory()
        self.root = Path(self._temp_dir.name)
        self.clients_root = self.root / "CLIENTES_ACTIVOS"
        client_manager.CLIENTS_ROOT = self.clients_root
        entity_advisor.CLIENTS_ROOT = self.clients_root

    def tearDown(self):
        client_manager.CLIENTS_ROOT = self._original_client_manager_root
        entity_advisor.CLIENTS_ROOT = self._original_advisor_clients_root
        self._temp_dir.cleanup()

    def _write(self, relative_path, content="x"):
        path = self.root / relative_path
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_text(content, encoding="utf-8")
        return path

    def test_creates_sprint_summary_and_review_files(self):
        analysis = {
            "analysis": {
                "headline": "Headline",
                "overall_score": 88,
                "confidence": 91,
                "diagnosis": {
                    "current_state": "Actual",
                    "main_gap": "Gap",
                    "strategic_decision": "Decision",
                },
                "priorities": [
                    {
                        "title": "Priority",
                        "urgency": "alta",
                        "reason": "Reason",
                        "action": "Action",
                    }
                ],
                "deliverables": [
                    {
                        "name": "Deliverable",
                        "outcome": "Outcome",
                        "actions": ["Next"],
                    }
                ],
            }
        }
        self._write(
            "CLIENTES_ACTIVOS/Client A/01_DIAGNOSTICO_ACTUAL/Analisis_Brand_Experience/LATEST_ANALYSIS.json",
            json.dumps(analysis),
        )
        self._write("CLIENTES_ACTIVOS/Client A/01_DIAGNOSTICO_ACTUAL/Analisis_Brand_Experience/LATEST_ANALYSIS.md", "# Analysis")
        self._write("CLIENTES_ACTIVOS/Client A/05_ENTREGAS/MASTER_BRAND_EXPERIENCE.md", "# Master")

        sprint = client_activation_engine.create_activation_sprint("Client A")
        summary = client_activation_engine.generate_client_portal_summary("Client A")
        campaign = client_activation_engine.generate_strategic_campaign("Client A")
        timeline = client_activation_engine.generate_evolution_timeline("Client A")
        review = client_activation_engine.mark_deliverables_reviewed("Client A")

        self.assertEqual(sprint["status"], "created")
        self.assertEqual(summary["status"], "created")
        self.assertEqual(campaign["status"], "created")
        self.assertEqual(timeline["status"], "created")
        self.assertEqual(review["status"], "reviewed")
        self.assertTrue((self.clients_root / "Client A/05_ENTREGAS/activation/ACTIVATION_SPRINT.md").is_file())
        self.assertTrue((self.clients_root / "Client A/05_ENTREGAS/activation/CLIENT_PORTAL_SUMMARY.md").is_file())
        self.assertTrue((self.clients_root / "Client A/05_ENTREGAS/campaigns/STRATEGIC_CAMPAIGN.md").is_file())
        self.assertTrue((self.clients_root / "Client A/05_ENTREGAS/evolution_timeline.md").is_file())
        self.assertTrue((self.clients_root / "Client A/05_ENTREGAS/deliverables_review.json").is_file())


if __name__ == "__main__":
    unittest.main()
