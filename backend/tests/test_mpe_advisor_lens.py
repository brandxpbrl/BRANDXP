import json
import sys
import tempfile
import unittest
from pathlib import Path


BACKEND_DIR = Path(__file__).resolve().parents[1]
if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))

from services import entity_advisor
from services.mpe.mpe_advisor_lens import build_mpe_advisor_lens


class MpeAdvisorLensTests(unittest.TestCase):
    def setUp(self):
        self._original_clients_root = entity_advisor.CLIENTS_ROOT
        self._original_library_root = entity_advisor.CREATIVE_LIBRARY_ROOT
        self._original_entity_assets_dir = entity_advisor.ENTITY_ASSETS_DIR
        self._temp_dir = tempfile.TemporaryDirectory()
        self.root = Path(self._temp_dir.name)
        entity_advisor.CLIENTS_ROOT = self.root / "CLIENTES_ACTIVOS"
        entity_advisor.CREATIVE_LIBRARY_ROOT = self.root / "04_CREATIVE_LIBRARY"
        entity_advisor.ENTITY_ASSETS_DIR = (
            entity_advisor.CREATIVE_LIBRARY_ROOT / "02_Assets_Visuales" / "Entidad"
        )

    def tearDown(self):
        entity_advisor.CLIENTS_ROOT = self._original_clients_root
        entity_advisor.CREATIVE_LIBRARY_ROOT = self._original_library_root
        entity_advisor.ENTITY_ASSETS_DIR = self._original_entity_assets_dir
        self._temp_dir.cleanup()

    def _write(self, relative_path, content="x"):
        path = self.root / relative_path
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_text(content, encoding="utf-8")
        return path

    def _scan(self):
        return {
            "client": "Client A",
            "engine": "MPE Entity Scan",
            "version": "0.1",
            "possibility_score": 0.72,
            "evolution_stage": "expansion_viable",
            "main_contradiction": "La expansion puede diluirse si se generan nuevos entregables.",
            "latent_possibility": "transformar autoridad interna en una experiencia comercial clara.",
            "fertile_constraint": "Elegir una sola promesa observable.",
            "recommended_path": {
                "label": "Disenar Evolution Blueprint de 30 dias",
                "reason": "Ordena crecimiento sin aumentar ruido.",
                "action_key": "generate_evolution_blueprint",
            },
            "geometry": {
                "shape": "Espiral",
                "stage": "expansion_viable",
                "question": "Que ciclo puede expandirse sin aumentar ruido?",
                "next_geometry": "Toroide",
            },
        }

    def test_builds_enabled_lens_from_valid_scan(self):
        lens = build_mpe_advisor_lens(self._scan())

        self.assertTrue(lens["enabled"])
        self.assertIn("summary", lens)
        self.assertIn("evolution_focus", lens)
        self.assertIn("strategic_warning", lens)
        self.assertIn("next_evolutionary_move", lens)
        self.assertIn("entity_phrase", lens)
        self.assertIn("Desde MPE", lens["entity_phrase"])

    def test_builds_disabled_lens_without_scan(self):
        lens = build_mpe_advisor_lens(None)

        self.assertFalse(lens["enabled"])
        self.assertEqual(lens["summary"], "Lectura evolutiva MPE no disponible.")

    def test_entity_advisor_includes_mpe_lens_when_scan_exists(self):
        self._write("CLIENTES_ACTIVOS/Client A/01_DIAGNOSTICO_ACTUAL/Analisis_Brand_Experience/LATEST_ANALYSIS.md")
        self._write(
            "CLIENTES_ACTIVOS/Client A/11_MPE_ENTITY_SCAN/mpe_entity_scan.json",
            json.dumps(self._scan()),
        )

        result = entity_advisor.build_entity_advisor("Client A")

        self.assertIn("mpe_lens", result)
        self.assertTrue(result["mpe_lens"]["enabled"])
        self.assertEqual(
            result["mpe_lens"]["evolution_focus"],
            "transformar autoridad interna en una experiencia comercial clara.",
        )


if __name__ == "__main__":
    unittest.main()

