import json
import sys
import tempfile
import unittest
from pathlib import Path


BACKEND_DIR = Path(__file__).resolve().parents[1]
if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))

import client_loader
import client_manager
import cognitive_orchestrator


class FrameworkSaveContractTests(unittest.TestCase):
    def setUp(self):
        self._temp_dir = tempfile.TemporaryDirectory()
        self.clients_root = Path(self._temp_dir.name) / "clients"
        self._original_clients_root = client_manager.CLIENTS_ROOT
        self._original_client_roots = client_loader.CLIENT_ROOTS
        self._original_load_client_context_bundle = cognitive_orchestrator.load_client_context_bundle
        self._original_load_all_agents = cognitive_orchestrator.load_all_agents
        self._original_run_agent = cognitive_orchestrator.run_agent
        self._original_synthesize_responses = cognitive_orchestrator.synthesize_responses
        self._original_get_provider_status = cognitive_orchestrator.get_provider_status

        client_manager.CLIENTS_ROOT = self.clients_root
        client_loader.CLIENT_ROOTS = [self.clients_root]
        cognitive_orchestrator.load_client_context_bundle = lambda _client_name: {
            "context": "client context signal",
            "sources": [],
            "engines": {},
        }
        cognitive_orchestrator.load_all_agents = lambda: [
            {"name": "branding_agent", "system_prompt": "Branding agent"},
            {"name": "strategy_agent", "system_prompt": "Strategy agent"},
        ]
        cognitive_orchestrator.run_agent = lambda agent, _prompt, _context="": {
            "agent": agent["name"],
            "label": agent["name"].replace("_agent", "").title(),
            "response": f"{agent['name']} response with identidad visual and propuesta.",
            "provider": "test",
            "fallback_used": False,
            "error": None,
        }
        cognitive_orchestrator.synthesize_responses = lambda _results, _prompt: {
            "content": "Sintesis final del cliente con estrategia, narrativa y proxima accion.",
            "provider": "test",
            "fallback_used": False,
            "error": None,
        }
        cognitive_orchestrator.get_provider_status = lambda: {
            "primary_provider": "test",
            "fallback_chain": ["test"],
        }

    def tearDown(self):
        client_manager.CLIENTS_ROOT = self._original_clients_root
        client_loader.CLIENT_ROOTS = self._original_client_roots
        cognitive_orchestrator.load_client_context_bundle = self._original_load_client_context_bundle
        cognitive_orchestrator.load_all_agents = self._original_load_all_agents
        cognitive_orchestrator.run_agent = self._original_run_agent
        cognitive_orchestrator.synthesize_responses = self._original_synthesize_responses
        cognitive_orchestrator.get_provider_status = self._original_get_provider_status
        self._temp_dir.cleanup()

    def test_framework_process_confirms_latest_analysis_saved(self):
        result = cognitive_orchestrator.process_request(
            'Analiza el cliente "Client A" con el framework completo.',
            client_name="Client A",
        )

        saved = result["saved_analysis"]
        latest_path = Path(saved["latest"])
        structured_path = Path(saved["structured"])
        latest_json_path = latest_path.with_suffix(".json")

        self.assertTrue(latest_path.exists())
        self.assertTrue(structured_path.exists())
        self.assertTrue(latest_json_path.exists())
        self.assertIn("Sintesis final del cliente", latest_path.read_text(encoding="utf-8"))
        self.assertEqual(json.loads(latest_json_path.read_text(encoding="utf-8"))["client"], "Client A")


if __name__ == "__main__":
    unittest.main()
