import unittest
import shutil
import sys
from pathlib import Path
from unittest.mock import patch

# Ensure backend path is in sys.path
backend_dir = Path(__file__).resolve().parent.parent
if str(backend_dir) not in sys.path:
    sys.path.insert(0, str(backend_dir))

from services.automated_onboarding_orchestrator import onboard_new_client
from client_manager import CLIENTS_ROOT

def mock_chat_completion(messages):
    return {
        "content": "## Mocked Section\n- Score: 85\n- Status: active\n- Signal: test signal\n- Action: test action\n",
        "provider": "mock",
        "fallback_used": False,
        "error": None
    }

class TestOnboardingPhase3(unittest.TestCase):

    def setUp(self):
        self.zero_client = "TestOSZeroClient"
        self.rich_client = "TestOSRichClient"
        self.fail_client = "TestOSFailClient"
        
        self.clients_to_cleanup = [self.zero_client, self.rich_client, self.fail_client]

    def tearDown(self):
        for client in self.clients_to_cleanup:
            client_path = CLIENTS_ROOT / client
            if client_path.exists():
                try:
                    shutil.rmtree(client_path)
                except Exception:
                    pass

    def test_onboard_zero_data_pipeline_success(self):
        # Onboards a zero-data client and verifies all engines are generated
        intake_data = {
            "notes": "Premium retreat in the Andes"
        }
        
        res = onboard_new_client(self.zero_client, "Boutique Hospitality", intake_data)
        
        self.assertEqual(res["status"], "COMPLETED")
        self.assertEqual(res["classification"], "ZERO/SEED DATA")
        self.assertEqual(res["engines"]["status"]["brand_memory_core"], "COMPLETED")
        self.assertEqual(res["engines"]["status"]["visual_dna_engine"], "COMPLETED")
        self.assertEqual(res["engines"]["status"]["content_intelligence_engine"], "COMPLETED")
        self.assertEqual(res["engines"]["status"]["ai_agent_os"], "COMPLETED")
        
        # Verify engine master file outputs
        client_path = CLIENTS_ROOT / self.zero_client
        self.assertTrue((client_path / "02_MEMORY" / "BRAND_MEMORY_CORE_MASTER.md").is_file())
        self.assertTrue((client_path / "07_VISUAL_DNA_ENGINE" / "VISUAL_DNA_ENGINE_MASTER.md").is_file())
        self.assertTrue((client_path / "08_CONTENT_INTELLIGENCE_ENGINE" / "CONTENT_INTELLIGENCE_ENGINE_MASTER.md").is_file())
        self.assertTrue((client_path / "09_AI_AGENT_OS" / "AI_AGENT_OS_MASTER.md").is_file())

    @patch("cognitive_orchestrator.chat_completion", side_effect=mock_chat_completion)
    def test_onboard_rich_data_pipeline_success(self, mock_chat):
        # Onboards a rich-data client using mocked LLM completions
        intake_data = {
            "instagram": "https://instagram.com/mybrand",
            "links": ["https://mybrand.com"],
            "transcription": "Zoom call recording transcript: We want a high-end fashion atelier style. " * 30,
            "notes": "Full details on the project. " * 15
        }
        
        res = onboard_new_client(self.rich_client, "Luxury Fashion", intake_data)
        
        self.assertEqual(res["status"], "COMPLETED")
        self.assertEqual(res["classification"], "RICH DATA")
        
        # Verify engine master file outputs
        client_path = CLIENTS_ROOT / self.rich_client
        self.assertTrue((client_path / "02_MEMORY" / "BRAND_MEMORY_CORE_MASTER.md").is_file())
        self.assertTrue((client_path / "07_VISUAL_DNA_ENGINE" / "VISUAL_DNA_ENGINE_MASTER.md").is_file())
        self.assertTrue((client_path / "08_CONTENT_INTELLIGENCE_ENGINE" / "CONTENT_INTELLIGENCE_ENGINE_MASTER.md").is_file())
        self.assertTrue((client_path / "09_AI_AGENT_OS" / "AI_AGENT_OS_MASTER.md").is_file())

    @patch("services.automated_onboarding_orchestrator.build_visual_dna_engine", side_effect=ValueError("Simulated Visual DNA builder failure"))
    def test_onboard_pipeline_failure_and_rollback(self, mock_visual):
        # Onboards a client but fails at step 2 (Visual DNA).
        # Verifies that rollback removes Step 1 (02_MEMORY) and leaves a clean workspace.
        intake_data = {
            "notes": "Atelier minimalist style notes"
        }
        
        res = onboard_new_client(self.fail_client, "Luxury Fashion", intake_data)
        
        self.assertEqual(res["status"], "FAILED")
        self.assertTrue(res["rollback_executed"])
        self.assertIn("Simulated Visual DNA builder failure", res["error"])
        
        # Verification that partial engine directories are removed
        client_path = CLIENTS_ROOT / self.fail_client
        self.assertFalse((client_path / "02_MEMORY").exists())
        self.assertFalse((client_path / "07_VISUAL_DNA_ENGINE").exists())
        
        # The prompt pack itself remains since it was created in step 2 of orchestrator
        # before the engine builder transaction started.
        self.assertTrue((client_path / "05_ENTREGAS" / "prompt_pack").exists())

if __name__ == "__main__":
    unittest.main()
