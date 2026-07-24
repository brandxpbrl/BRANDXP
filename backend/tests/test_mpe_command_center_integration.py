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
from services import client_command_center, client_readiness, entity_advisor


class MpeCommandCenterIntegrationTests(unittest.TestCase):
    def setUp(self):
        self._original_client_manager_root = client_manager.CLIENTS_ROOT
        self._original_advisor_root = entity_advisor.CLIENTS_ROOT
        self._original_readiness_root = client_readiness.CLIENTS_ROOT
        self._temp_dir = tempfile.TemporaryDirectory()
        self.root = Path(self._temp_dir.name)
        self.clients_root = self.root / "CLIENTES_ACTIVOS"
        self.clients_root.mkdir(parents=True)
        client_manager.CLIENTS_ROOT = self.clients_root
        entity_advisor.CLIENTS_ROOT = self.clients_root
        client_readiness.CLIENTS_ROOT = self.clients_root

    def tearDown(self):
        client_manager.CLIENTS_ROOT = self._original_client_manager_root
        entity_advisor.CLIENTS_ROOT = self._original_advisor_root
        client_readiness.CLIENTS_ROOT = self._original_readiness_root
        self._temp_dir.cleanup()

    def _write(self, relative_path, content="x"):
        path = self.clients_root / relative_path
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_text(content, encoding="utf-8")
        return path

    def _seed_client(self):
        analysis = {
            "analysis": {
                "headline": "Cliente listo para lectura MPE",
                "overall_score": 84,
                "confidence": 80,
                "scorecard": [
                    {"key": "strategic_clarity", "score": 76},
                    {"key": "differentiation", "score": 71},
                    {"key": "premium_perception", "score": 82},
                    {"key": "visual_coherence", "score": 68},
                    {"key": "narrative_power", "score": 79},
                    {"key": "conversion_readiness", "score": 61},
                ],
                "diagnosis": {
                    "current_state": "Base estrategica activa",
                    "main_gap": "Convertir estrategia en accion visible",
                    "strategic_decision": "Crear primer movimiento comercial",
                },
                "priorities": [
                    {
                        "title": "Activar oferta",
                        "urgency": "alta",
                        "reason": "La marca necesita una salida comercial clara.",
                        "action": "Definir oferta y CTA principal.",
                    }
                ],
            }
        }
        self._write(
            "Client A/01_DIAGNOSTICO_ACTUAL/Analisis_Brand_Experience/LATEST_ANALYSIS.json",
            json.dumps(analysis),
        )
        self._write("Client A/01_DIAGNOSTICO_ACTUAL/Analisis_Brand_Experience/LATEST_ANALYSIS.md", "# Analysis")
        self._write("Client A/05_ENTREGAS/MASTER_BRAND_EXPERIENCE.md", "# Master")
        self._write("Client A/02_MEMORY/BRAND_MEMORY_CORE_MASTER.md", "# Memory")
        self._write("Client A/07_VISUAL_DNA_ENGINE/VISUAL_DNA_ENGINE_MASTER.md", "# Visual")
        self._write("Client A/08_CONTENT_INTELLIGENCE_ENGINE/CONTENT_INTELLIGENCE_ENGINE_MASTER.md", "# Content")
        self._write("Client A/09_AI_AGENT_OS/AI_AGENT_OS_MASTER.md", "# Agent OS")

    def test_command_center_includes_mpe_reading(self):
        self._seed_client()

        result = client_command_center.build_client_command_center("Client A")

        self.assertIn("mpe", result)
        self.assertTrue(result["mpe"]["enabled"])
        self.assertIn("possibility_score", result["mpe"])
        self.assertIn("main_contradiction", result["mpe"])
        self.assertIn("latent_possibility", result["mpe"])
        self.assertIn("fertile_constraint", result["mpe"])
        self.assertIn("geometry", result["mpe"])
        self.assertTrue((self.clients_root / "Client A/11_MPE_ENTITY_SCAN/mpe_entity_scan.json").is_file())

    def test_command_center_survives_mpe_failure(self):
        self._seed_client()

        with patch("services.client_command_center.run_mpe_entity_scan", side_effect=RuntimeError("MPE failed")):
            result = client_command_center.build_client_command_center("Client A")

        self.assertEqual(result["client"], "Client A")
        self.assertIn("mpe", result)
        self.assertFalse(result["mpe"]["enabled"])
        self.assertIn("MPE failed", result["mpe"]["error"])
        self.assertEqual(result["mpe"]["fallback_message"], "MPE Entity Scan no disponible para este cliente.")


if __name__ == "__main__":
    unittest.main()

