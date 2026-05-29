import asyncio
import json
import sys
import tempfile
import unittest
from pathlib import Path


BACKEND_DIR = Path(__file__).resolve().parents[1]
if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))

import client_manager
import main
from services import cinematic_campaign_builder


class CinematicCampaignBuilderTests(unittest.TestCase):
    def setUp(self):
        self._temp_dir = tempfile.TemporaryDirectory()
        self._original_clients_root = client_manager.CLIENTS_ROOT
        self._original_chat_completion = cinematic_campaign_builder.chat_completion
        self._original_endpoint_generator = main.generate_cinematic_campaign
        self._original_endpoint_brief = main.get_recommended_cinematic_brief
        client_manager.CLIENTS_ROOT = Path(self._temp_dir.name) / "clients"
        client_manager.ensure_client("Client A", "test client")

    def tearDown(self):
        client_manager.CLIENTS_ROOT = self._original_clients_root
        cinematic_campaign_builder.chat_completion = self._original_chat_completion
        main.generate_cinematic_campaign = self._original_endpoint_generator
        main.get_recommended_cinematic_brief = self._original_endpoint_brief
        self._temp_dir.cleanup()

    def test_generates_and_saves_veo_prompt_campaign(self):
        def fake_chat_completion(_messages):
            return {
                "content": json.dumps(
                    {
                        "concept": "A premium vertical journey.",
                        "campaign_objective": "Build desire.",
                        "narrative_structure": ["Hook", "Emotion"],
                        "scenes": [
                            {
                                "title": "Arrival",
                                "narrative_role": "Open the world.",
                                "visual_direction": "Golden hour realism.",
                                "veo_prompt": "Cinematic 9:16 vertical shot, ultra-realistic, premium cinematic lighting, elegant visual restraint, no readable text, no words, no logos, no UI labels, no generic corporate stock footage.",
                                "edit_text": "Vivi la experiencia.",
                            }
                        ],
                        "creative_direction_note": "Keep it restrained.",
                    }
                ),
                "provider": "test",
                "fallback_used": False,
                "error": None,
            }

        cinematic_campaign_builder.chat_completion = fake_chat_completion

        result = cinematic_campaign_builder.generate_cinematic_campaign(
            "Client A",
            {
                "brand": "Client A",
                "video_objective": "Launch a premium reel",
                "central_message": "A clear promise",
                "main_emotion": "desire",
                "audience": "premium travelers",
                "visual_aesthetic": "dark tropical luxury",
                "duration": "16",
                "platform": "Instagram Reels",
                "final_cta": "Reserve now",
            },
        )

        self.assertEqual(result["status"], "created")
        self.assertEqual(len(result["campaign"]["scenes"]), 2)
        self.assertFalse(result["provider"]["fallback_used"])

        for relative_path in result["files"]:
            path = client_manager.CLIENTS_ROOT / "Client A" / relative_path
            self.assertTrue(path.exists())

        latest = client_manager.CLIENTS_ROOT / "Client A" / "05_ENTREGAS" / "cinematic_campaigns" / "campaign_latest.md"
        content = latest.read_text(encoding="utf-8")
        self.assertIn("Output type: Veo prompts only", content)
        self.assertIn("No logos", content)
        self.assertIn("Texto sugerido para edicion", content)

    def test_ai_failure_returns_professional_fallback(self):
        def failing_chat_completion(_messages):
            raise RuntimeError("provider unavailable")

        cinematic_campaign_builder.chat_completion = failing_chat_completion

        result = cinematic_campaign_builder.generate_cinematic_campaign(
            "Client A",
            {
                "brand": "Client A",
                "video_objective": "Create awareness",
                "central_message": "More presence",
                "duration": "24",
            },
        )

        self.assertEqual(result["provider"]["provider"], "fallback")
        self.assertTrue(result["provider"]["fallback_used"])
        self.assertEqual(len(result["campaign"]["scenes"]), 3)
        self.assertIn("Cinematic 9:16 vertical shot", result["campaign"]["scenes"][0]["veo_prompt"])

    def test_endpoint_uses_isolated_cinematic_generator(self):
        calls = []

        def fake_generator(client_name, request_data):
            calls.append((client_name, request_data))
            return {
                "client": client_name,
                "status": "created",
                "files": ["05_ENTREGAS/cinematic_campaigns/campaign_latest.md"],
                "campaign": {"scenes": []},
            }

        main.generate_cinematic_campaign = fake_generator

        result = asyncio.run(
            main.client_generate_cinematic_campaign(
                "Client A",
                main.CinematicCampaignRequest(
                    brand="Client A",
                    video_objective="Launch",
                    central_message="Message",
                    duration="32",
                ),
            )
        )

        self.assertEqual(result["status"], "created")
        self.assertEqual(calls[0][0], "Client A")
        self.assertEqual(calls[0][1]["video_objective"], "Launch")

    def test_recommended_brief_prefers_strategic_campaign(self):
        client_path = client_manager.CLIENTS_ROOT / "Client A"
        campaign_dir = client_path / "05_ENTREGAS" / "campaigns"
        campaign_dir.mkdir(parents=True, exist_ok=True)
        (campaign_dir / "campaign_brief.md").write_text(
            "# Campaign Brief\n\n## Core Message\n\nFallback message.\n",
            encoding="utf-8",
        )
        (campaign_dir / "STRATEGIC_CAMPAIGN.md").write_text(
            """# Strategic Campaign - Client A

## Core Message

Brasil vivido con intencion premium.

## Campaign Objective

Presentar una experiencia cinematografica vertical.

## Next Decision

Reservar experiencia.
""",
            encoding="utf-8",
        )

        result = cinematic_campaign_builder.get_recommended_cinematic_brief("Client A")

        self.assertTrue(result["found"])
        self.assertEqual(result["source"], "05_ENTREGAS/campaigns/STRATEGIC_CAMPAIGN.md")
        self.assertEqual(result["brand"], "Client A")
        self.assertIn("Brasil vivido", result["central_message"])
        self.assertEqual(result["duration"], 60)
        self.assertEqual(result["platform"], "Instagram Reels 9:16")

    def test_recommended_brief_returns_empty_when_no_source_exists(self):
        result = cinematic_campaign_builder.get_recommended_cinematic_brief("Client A")

        self.assertFalse(result["found"])
        self.assertIsNone(result["source"])
        self.assertEqual(result["brand"], "")
        self.assertIn("No se encontró campaña recomendada", result["message"])

    def test_recommended_brief_endpoint_uses_isolated_reader(self):
        calls = []

        def fake_brief(client_name):
            calls.append(client_name)
            return {
                "brand": "Client A",
                "video_objective": "Use analysis",
                "central_message": "Message",
                "main_emotion": "Trust",
                "audience": "Audience",
                "visual_aesthetic": "Premium",
                "duration": 60,
                "platform": "Instagram Reels 9:16",
                "final_cta": "Reserve",
                "message": "ok",
                "source": "05_ENTREGAS/campaigns/STRATEGIC_CAMPAIGN.md",
                "found": True,
            }

        main.get_recommended_cinematic_brief = fake_brief

        result = asyncio.run(
            main.client_cinematic_campaign_recommended_brief("Client A")
        )

        self.assertTrue(result["found"])
        self.assertEqual(calls, ["Client A"])


if __name__ == "__main__":
    unittest.main()
