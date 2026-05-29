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
        "content": "## Mocked Section\n- Score: 80\n- Status: completed\n- Signal: test signal\n- Action: test action\n",
        "provider": "mock",
        "fallback_used": False,
        "error": None
    }

class TestOnboardingPhase2(unittest.TestCase):

    def setUp(self):
        # We will use distinct temporary test client names
        self.rich_client = "TestOnboardingRichClient"
        self.partial_client = "TestOnboardingPartialClient"
        self.zero_client = "TestOnboardingZeroClient"
        
        self.clients_to_cleanup = [self.rich_client, self.partial_client, self.zero_client]

    def tearDown(self):
        # Clean up temporary test folders
        for client in self.clients_to_cleanup:
            client_path = CLIENTS_ROOT / client
            if client_path.exists():
                shutil.rmtree(client_path)

    def test_onboard_zero_data_client(self):
        intake_data = {
            "notes": "Atelier de costura de vestidos minimalistas"
        }
        res = onboard_new_client(self.zero_client, "Luxury Fashion", intake_data)
        
        self.assertEqual(res["classification"], "ZERO/SEED DATA")
        self.assertEqual(res["prompt_pack"]["preset_applied"], "High-End Editorial / Minimalist Luxury")
        self.assertEqual(len(res["prompt_pack"]["created_files"]), 9)
        
        # Verify files are stored
        client_path = CLIENTS_ROOT / self.zero_client
        prompt_pack_dir = client_path / "05_ENTREGAS" / "prompt_pack"
        self.assertTrue((prompt_pack_dir / "identity_cliente.md").is_file())
        self.assertTrue((prompt_pack_dir / "color_palette_prompt.md").is_file())

    @patch("cognitive_orchestrator.chat_completion", side_effect=mock_chat_completion)
    def test_onboard_partial_client(self, mock_chat):
        intake_data = {
            "instagram": "https://instagram.com/terramoca",
            "links": "https://terramoca.com.br",
            "notes": "Cabañas de diseño orgánico en la selva de Minas Gerais."
        }
        res = onboard_new_client(self.partial_client, "Boutique Hospitality", intake_data)
        
        self.assertEqual(res["classification"], "PARTIAL DATA")
        self.assertEqual(res["prompt_pack"]["preset_applied"], "Multi-Agent Framework Analysis")
        self.assertEqual(len(res["prompt_pack"]["created_files"]), 9)
        
        # Verify analysis files exist
        client_path = CLIENTS_ROOT / self.partial_client
        analysis_json = client_path / "01_DIAGNOSTICO_ACTUAL" / "Analisis_Brand_Experience" / "LATEST_ANALYSIS.json"
        self.assertTrue(analysis_json.is_file())
        
        # Verify prompt pack files exist
        prompt_pack_dir = client_path / "05_ENTREGAS" / "prompt_pack"
        self.assertTrue((prompt_pack_dir / "identity_cliente.md").is_file())

    @patch("cognitive_orchestrator.chat_completion", side_effect=mock_chat_completion)
    def test_onboard_rich_client(self, mock_chat):
        intake_data = {
            "instagram": "https://instagram.com/retreat",
            "links": ["https://retreat.com", "https://blog.retreat.com"],
            "transcription": "Zoom transcripts detailing warm minimalism, earth colors, slow fashion style, luxury elements. " * 30,
            "notes": "Detailed strategic context. " * 15
        }
        res = onboard_new_client(self.rich_client, "Wellness Sanctuary", intake_data)
        
        self.assertEqual(res["classification"], "RICH DATA")
        self.assertEqual(res["prompt_pack"]["preset_applied"], "Multi-Agent Framework Analysis")
        self.assertEqual(len(res["prompt_pack"]["created_files"]), 9)
        
        client_path = CLIENTS_ROOT / self.rich_client
        prompt_pack_dir = client_path / "05_ENTREGAS" / "prompt_pack"
        self.assertTrue((prompt_pack_dir / "identity_cliente.md").is_file())
        self.assertTrue((prompt_pack_dir / "full_brand_experience_prompt_pack.md").is_file())

if __name__ == "__main__":
    unittest.main()
