import json
import sys
import tempfile
import unittest
from pathlib import Path


BACKEND_DIR = Path(__file__).resolve().parents[1]
if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))

import client_manager
from services import client_readiness, entity_advisor
from services.mpe.mpe_adapter import build_mpe_client_snapshot
from services.mpe.mpe_entity_scan import run_mpe_entity_scan
from services.mpe.mpe_report_renderer import render_mpe_entity_scan_markdown


class MpeEntityScanTests(unittest.TestCase):
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
                "headline": "Cliente listo para evolucionar",
                "overall_score": 82,
                "confidence": 78,
                "scorecard": [
                    {"key": "strategic_clarity", "score": 74},
                    {"key": "differentiation", "score": 69},
                    {"key": "premium_perception", "score": 81},
                    {"key": "visual_coherence", "score": 63},
                    {"key": "narrative_power", "score": 77},
                    {"key": "conversion_readiness", "score": 58},
                ],
                "diagnosis": {
                    "current_state": "Base estrategica activa",
                    "main_gap": "Convertir estrategia en movimiento visible",
                    "strategic_decision": "Elegir una promesa comercial observable",
                },
                "priorities": [
                    {
                        "title": "Ordenar promesa",
                        "urgency": "alta",
                        "reason": "La marca tiene autoridad, pero necesita una ruta de accion mas visible.",
                        "action": "Definir promesa y CTA principal.",
                    }
                ],
            }
        }
        self._write(
            "Client A/01_DIAGNOSTICO_ACTUAL/Analisis_Brand_Experience/LATEST_ANALYSIS.json",
            json.dumps(analysis),
        )
        self._write("Client A/01_DIAGNOSTICO_ACTUAL/Analisis_Brand_Experience/LATEST_ANALYSIS.md", "# Analysis")
        self._write("Client A/02_MEMORY/BRAND_MEMORY_CORE_MASTER.md", "# Memory")
        self._write("Client A/07_VISUAL_DNA_ENGINE/VISUAL_DNA_ENGINE_MASTER.md", "# Visual")
        self._write("Client A/08_CONTENT_INTELLIGENCE_ENGINE/CONTENT_INTELLIGENCE_ENGINE_MASTER.md", "# Content")
        self._write("Client A/09_AI_AGENT_OS/AI_AGENT_OS_MASTER.md", "# Agent OS")
        self._write("Client A/05_ENTREGAS/MASTER_BRAND_EXPERIENCE.md", "# Master")

    def test_builds_mpe_client_snapshot(self):
        self._seed_client()

        snapshot = build_mpe_client_snapshot("Client A")

        self.assertIsInstance(snapshot, dict)
        self.assertEqual(snapshot["client"], "Client A")
        self.assertIn("latest_analysis", snapshot["source"])
        self.assertIn("entity_state", snapshot["source"])
        self.assertIn("readiness", snapshot["source"])
        self.assertIn("activation", snapshot["source"])
        self.assertIn("deliverables_review", snapshot["source"])

    def test_runs_mpe_entity_scan_with_required_fields(self):
        self._seed_client()

        scan = run_mpe_entity_scan("Client A")

        for key in [
            "client",
            "engine",
            "version",
            "possibility_score",
            "evolution_stage",
            "main_contradiction",
            "latent_possibility",
            "fertile_constraint",
            "noise_sources",
            "recommended_path",
            "geometry",
            "morphogenesis_seed",
        ]:
            self.assertIn(key, scan)

        self.assertGreaterEqual(scan["possibility_score"], 0)
        self.assertLessEqual(scan["possibility_score"], 1)

        for axis in ["D", "R", "V", "F", "M", "N", "E"]:
            self.assertIn(axis, scan["morphogenesis_seed"])
            self.assertGreaterEqual(scan["morphogenesis_seed"][axis], 0)
            self.assertLessEqual(scan["morphogenesis_seed"][axis], 1)

        markdown = render_mpe_entity_scan_markdown(scan)
        self.assertTrue(markdown.startswith("# MPE ENTITY SCAN"))
        self.assertIn("Contradiccion principal", markdown)
        self.assertTrue((self.clients_root / "Client A/11_MPE_ENTITY_SCAN/mpe_entity_scan.json").is_file())
        self.assertTrue((self.clients_root / "Client A/11_MPE_ENTITY_SCAN/MPE_ENTITY_SCAN.md").is_file())
        self.assertTrue((self.clients_root / "Client A/11_MPE_ENTITY_SCAN/possibility_reading.json").is_file())
        self.assertTrue((self.clients_root / "Client A/11_MPE_ENTITY_SCAN/morphogenesis_seed.json").is_file())


if __name__ == "__main__":
    unittest.main()

