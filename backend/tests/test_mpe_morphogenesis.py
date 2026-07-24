import json
import sys
import tempfile
import unittest
from pathlib import Path


BACKEND_DIR = Path(__file__).resolve().parents[1]
if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))

import client_manager
from services.mpe.mpe_morphogenesis import build_morphogenesis_command_summary, generate_mpe_morphogenesis
from services.mpe.mpe_morphogenesis_renderer import render_morphogenesis_svg


class MpeMorphogenesisTests(unittest.TestCase):
    def setUp(self):
        self._original_client_manager_root = client_manager.CLIENTS_ROOT
        self._temp_dir = tempfile.TemporaryDirectory()
        self.root = Path(self._temp_dir.name)
        self.clients_root = self.root / "CLIENTES_ACTIVOS"
        self.clients_root.mkdir(parents=True)
        client_manager.CLIENTS_ROOT = self.clients_root

    def tearDown(self):
        client_manager.CLIENTS_ROOT = self._original_client_manager_root
        self._temp_dir.cleanup()

    def _write(self, relative_path, content="x"):
        path = self.clients_root / relative_path
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_text(content, encoding="utf-8")
        return path

    def _seed_scan(self):
        scan = {
            "client": "Client A",
            "engine": "MPE Entity Scan",
            "version": "0.1",
            "possibility_score": 0.72,
            "evolution_stage": "expansion_viable",
            "main_contradiction": "La expansion puede diluirse si se generan nuevos entregables.",
            "latent_possibility": "Transformar autoridad interna en experiencia observable.",
            "fertile_constraint": "Elegir una promesa observable.",
            "recommended_path": {
                "label": "Generar Evolution Blueprint",
                "reason": "Ordena crecimiento sin aumentar ruido.",
                "action_key": "generate_evolution_blueprint",
            },
            "geometry": {
                "shape": "Espiral",
                "stage": "expansion_viable",
                "question": "Que ciclo puede expandirse sin aumentar ruido?",
                "next_geometry": "Toroide",
            },
            "morphogenesis_seed": {
                "D": 0.7,
                "R": 0.8,
                "V": 0.75,
                "F": 0.86,
                "M": 0.78,
                "N": 0.32,
                "E": 0.83,
            },
        }
        self._write("Client A/11_MPE_ENTITY_SCAN/mpe_entity_scan.json", json.dumps(scan))
        self._write("Client A/11_MPE_ENTITY_SCAN/morphogenesis_seed.json", json.dumps(scan["morphogenesis_seed"]))
        self._write("Client A/12_EVOLUTION_BLUEPRINT/evolution_blueprint.json", json.dumps({"cycle": "30 days"}))

    def test_generates_and_persists_mpe_morphogenesis(self):
        self._seed_scan()

        result = generate_mpe_morphogenesis("Client A", persist=True)

        self.assertIsInstance(result, dict)
        self.assertEqual(result["client"], "Client A")
        self.assertTrue(result["source"]["entity_scan"])
        self.assertTrue(result["source"]["evolution_blueprint"])
        self.assertIn("geometry_state", result)
        self.assertIn("visual_parameters", result)

        for axis in ["D", "R", "V", "F", "M", "N", "E"]:
            self.assertIn(axis, result["morphogenesis_seed"])

        svg = render_morphogenesis_svg(result)
        self.assertTrue(svg.startswith("<svg"))
        self.assertIn("</svg>", svg)

        self.assertTrue((self.clients_root / "Client A/13_MPE_MORPHOGENESIS/mpe_morphogenesis.json").is_file())
        self.assertTrue((self.clients_root / "Client A/13_MPE_MORPHOGENESIS/mpe_morphogenesis.svg").is_file())
        self.assertTrue((self.clients_root / "Client A/13_MPE_MORPHOGENESIS/MPE_MORPHOGENESIS.md").is_file())

    def test_command_center_summary_reads_persisted_morphogenesis(self):
        self._seed_scan()
        generate_mpe_morphogenesis("Client A", persist=True)

        summary = build_morphogenesis_command_summary("Client A")

        self.assertTrue(summary["available"])
        self.assertEqual(summary["shape"], "Espiral")
        self.assertEqual(summary["stage"], "expansion_viable")
        self.assertTrue(summary["svg_available"])
        self.assertIn("visual_meaning", summary)


if __name__ == "__main__":
    unittest.main()

