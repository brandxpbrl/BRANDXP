import json
import sys
import tempfile
import unittest
from pathlib import Path
from unittest.mock import patch


BACKEND_DIR = Path(__file__).resolve().parents[1]
if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))

import client_manager
from services import client_chat_engine, entity_advisor


class ClientChatEngineTests(unittest.TestCase):
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

    def _seed_client(self):
        analysis = {
            "analysis": {
                "headline": "Headline",
                "diagnosis": {
                    "current_state": "Actual",
                    "main_gap": "Gap",
                    "strategic_decision": "Decision",
                },
                "priorities": [
                    {"title": "Priority", "urgency": "alta", "reason": "Reason", "action": "Action"}
                ],
            }
        }
        self._write(
            "CLIENTES_ACTIVOS/Client A/01_DIAGNOSTICO_ACTUAL/Analisis_Brand_Experience/LATEST_ANALYSIS.json",
            json.dumps(analysis),
        )
        self._write("CLIENTES_ACTIVOS/Client A/01_DIAGNOSTICO_ACTUAL/Analisis_Brand_Experience/LATEST_ANALYSIS.md", "# Analysis")

    def test_builds_chat_context(self):
        self._seed_client()

        context = client_chat_engine.build_client_chat_context("Client A")

        self.assertEqual(context["client"], "Client A")
        self.assertGreaterEqual(len(context["suggested_prompts"]), 4)
        self.assertEqual(context["history"], [])

    def test_chat_saves_history_without_calling_real_provider(self):
        self._seed_client()

        with patch("services.client_chat_engine.chat_completion") as chat_completion:
            chat_completion.return_value = {
                "content": "Respuesta operativa",
                "provider": "test",
                "fallback_used": False,
                "error": None,
            }

            result = client_chat_engine.run_client_chat("Client A", "Ejecuta el proximo paso")

        self.assertEqual(result["answer"], "Respuesta operativa")
        self.assertEqual(len(result["history"]), 2)
        self.assertTrue((self.clients_root / "Client A/05_ENTREGAS/operator_chat/chat_history.json").is_file())
        self.assertTrue((self.clients_root / "Client A/05_ENTREGAS/operator_chat/CHAT_TRANSCRIPT.md").is_file())


if __name__ == "__main__":
    unittest.main()
