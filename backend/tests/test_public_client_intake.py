import asyncio
import os
import sys
import unittest
from pathlib import Path
from unittest.mock import patch

from fastapi import HTTPException

BACKEND_DIR = Path(__file__).resolve().parents[1]
if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))

import main
from services.access_control import access_control_enabled, access_keys_configured


class PublicClientIntakeTests(unittest.TestCase):
    def setUp(self):
        self._original_save_client_intake = main.save_client_intake
        self._original_save_uploaded_file = main.save_uploaded_file

    def tearDown(self):
        main.save_client_intake = self._original_save_client_intake
        main.save_uploaded_file = self._original_save_uploaded_file

    def test_access_control_requires_enabled_flag_and_keys(self):
        with patch.dict(os.environ, {"BEOS_ACCESS_CONTROL": "true"}, clear=True):
            self.assertFalse(access_keys_configured())
            self.assertFalse(access_control_enabled())

        with patch.dict(
            os.environ,
            {
                "BEOS_ACCESS_CONTROL": "true",
                "BEOS_DEVELOPER_KEY": "dev-key",
            },
            clear=True,
        ):
            self.assertTrue(access_keys_configured())
            self.assertTrue(access_control_enabled())

    def test_public_client_intake_saves_instagram_context(self):
        calls = []

        def fake_save_client_intake(client_name, intake):
            calls.append((client_name, intake))
            return {
                "client": {"name": client_name, "created": True},
                "intake_file": "client_intake.json",
            }

        main.save_client_intake = fake_save_client_intake

        result = asyncio.run(
            main.public_client_intake(
                brand_name="Nova Marca",
                instagram="@novamarca",
                contact_name="Ana",
                contact_email="ana@example.com",
                origin="Nacio para resolver una brecha clara.",
                vision="Construir una marca referente.",
                purpose="Transformar la forma en que el cliente compra.",
                beneficiaries="Emprendedores premium.",
                main_objective="Quiero diagnosticar mi marca.",
                target_audience="Clientes de alto valor.",
                market="Brasil",
                identity_words="premium, humana, estrategica",
                personality="Cercana y elegante.",
                differentiation="Acompana con metodo propio.",
                impact_phrase="Experiencias que transforman.",
                person_description="Seria una asesora calma y visionaria.",
                links="https://example.com\nhttps://instagram.com/novamarca",
                notes="Referencia visual enviada despues.",
                files=[],
            )
        )

        self.assertEqual(result["status"], "received")
        self.assertTrue(result["framework_ready"])
        self.assertEqual(result["client"]["name"], "Nova Marca")
        self.assertEqual(calls[0][0], "Nova Marca")
        self.assertEqual(calls[0][1]["instagram"], "@novamarca")
        self.assertEqual(calls[0][1]["source"], "public_client_intake")
        self.assertTrue(calls[0][1]["framework_ready"])
        self.assertIn("Quiero diagnosticar mi marca.", calls[0][1]["notes"])
        self.assertEqual(
            calls[0][1]["strategic_questionnaire"]["identity_words"],
            "premium, humana, estrategica",
        )
        self.assertEqual(
            calls[0][1]["links"],
            ["https://example.com", "https://instagram.com/novamarca"],
        )

    def test_public_client_intake_requires_instagram(self):
        with self.assertRaises(HTTPException) as raised:
            asyncio.run(
                main.public_client_intake(
                    brand_name="Nova Marca",
                    instagram="",
                    files=[],
                )
            )

        self.assertEqual(raised.exception.status_code, 400)


if __name__ == "__main__":
    unittest.main()
