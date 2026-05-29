import unittest
import shutil
import sys
from pathlib import Path

# Ensure backend path is in sys.path
backend_dir = Path(__file__).resolve().parent.parent
if str(backend_dir) not in sys.path:
    sys.path.insert(0, str(backend_dir))

from services.onboarding_classifier_service import classify_intake
from services.seed_identity_generator import generate_seed_identity
from client_manager import CLIENTS_ROOT

class TestOnboardingPhase1(unittest.TestCase):

    def setUp(self):
        # Create a temp test client name to avoid cluttering actual clients
        self.test_client = "TestOnboardingClientSeed"
        self.test_client_path = CLIENTS_ROOT / self.test_client

    def tearDown(self):
        # Clean up the test client folder after tests
        if self.test_client_path.exists():
            shutil.rmtree(self.test_client_path)

    def test_rich_client_classification(self):
        intake_data = {
            "instagram": "https://instagram.com/myhotel",
            "links": ["https://myhotel.com", "https://blog.myhotel.com"],
            "transcription": "This is a zoom call notes about my boutique hotel, which has a very long description and many notes " * 30, # ~600 chars
            "notes": "We want to target luxury seekers looking for organic architecture and high quality food. " * 15 # ~350 chars
        }
        res = classify_intake(intake_data)
        self.assertEqual(res["classification"], "RICH DATA")
        self.assertTrue(res["intake_quality_score"] >= 70)
        self.assertTrue(res["metrics"]["instagram_present"])
        self.assertTrue(res["metrics"]["links_present"])

    def test_partial_client_classification(self):
        intake_data = {
            "instagram": "https://instagram.com/fashionbrand",
            "links": [],
            "transcription": "",
            "notes": "A simple notes block that is brief." # ~30 chars (notes_score = 5)
        }
        res = classify_intake(intake_data)
        # score = 20 (insta) + 0 (links) + 0 (trans) + 5 (notes) = 25
        # Wait, 25 is < 35, so it's ZERO/SEED DATA. Let's make it partial:
        intake_data_partial = {
            "instagram": "https://instagram.com/fashionbrand",
            "links": ["https://fashionbrand.com"],
            "transcription": "",
            "notes": "A simple notes block that is brief." # score = 20 + 20 + 0 + 5 = 45 -> PARTIAL
        }
        res = classify_intake(intake_data_partial)
        self.assertEqual(res["classification"], "PARTIAL DATA")
        self.assertTrue(35 <= res["intake_quality_score"] < 70)

    def test_zero_data_client_classification(self):
        intake_data = {
            "instagram": "",
            "links": [],
            "transcription": "",
            "notes": "Very short notes" # score = 0 + 0 + 0 + 5 = 5 -> ZERO/SEED
        }
        res = classify_intake(intake_data)
        self.assertEqual(res["classification"], "ZERO/SEED DATA")
        self.assertTrue(res["intake_quality_score"] < 35)

    def test_seed_identity_generation_hospitality(self):
        # Generate seed identity for Hospitality category
        res = generate_seed_identity(self.test_client, "Boutique Hospitality", "Notes for the Peruvian retreat.")
        
        self.assertEqual(res["client"], self.test_client)
        self.assertEqual(res["preset_applied"], "Tropical Premium / Warm Luxury")
        self.assertEqual(len(res["created"]), 9)
        
        # Verify files are actually written
        prompt_pack_dir = self.test_client_path / "05_ENTREGAS" / "prompt_pack"
        for filename in res["created"]:
            file_path = self.test_client_path / filename
            self.assertTrue(file_path.is_file(), f"{filename} does not exist.")
            content = file_path.read_text(encoding="utf-8")
            self.assertTrue(len(content) > 100, f"{filename} is empty.")
            
        # Verify specific preset contents in identity_cliente.md
        identity_path = prompt_pack_dir / "identity_cliente.md"
        identity_content = identity_path.read_text(encoding="utf-8")
        self.assertIn("Verde Tropical (#2F4F3E)", identity_content)
        self.assertIn("Cormorant Garamond", identity_content)

    def test_seed_identity_generation_fashion(self):
        res = generate_seed_identity(self.test_client, "Luxury Fashion", "Minimalist cuts.")
        self.assertEqual(res["preset_applied"], "High-End Editorial / Minimalist Luxury")
        
        identity_path = self.test_client_path / "05_ENTREGAS" / "prompt_pack" / "identity_cliente.md"
        identity_content = identity_path.read_text(encoding="utf-8")
        self.assertIn("Deep Obsidian (#1A1A1A)", identity_content)
        self.assertIn("Didot / Bodoni", identity_content)

if __name__ == "__main__":
    unittest.main()
