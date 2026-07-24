import json
import sys
import tempfile
import unittest
from pathlib import Path


BACKEND_DIR = Path(__file__).resolve().parents[1]
if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))

import client_manager
from services import client_command_center, client_readiness, entity_advisor


class ClientCommandCenterTests(unittest.TestCase):
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

    def test_unifies_client_operating_outputs(self):
        analysis = {
            "analysis": {
                "headline": "Cliente listo para activar",
                "overall_score": 86,
                "confidence": 82,
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
                "content_pillars": [
                    {
                        "name": "Autoridad",
                        "role": "Mostrar criterio y confianza.",
                        "formats": ["Carrusel"],
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

        result = client_command_center.build_client_command_center("Client A")

        self.assertEqual(result["client"], "Client A")
        self.assertEqual(result["headline"], "Cliente listo para activar")
        self.assertEqual(result["decision"]["current_state"], "Base estrategica activa")
        self.assertIn("primary_action", result["decision"])
        self.assertTrue(result["operating_state"]["systems"]["ai_agent_os"])
        self.assertTrue(result["truth_sources"])
        self.assertTrue(result["actions"]["priority_actions"])
        self.assertTrue(result["actions"]["suggested_prompts"])
        self.assertTrue(result["visibility"]["internal_only"])
        self.assertFalse((self.clients_root / "Client A/05_ENTREGAS/operator_chat").exists())


if __name__ == "__main__":
    unittest.main()
