import json
import sys
import tempfile
import unittest
from pathlib import Path


BACKEND_DIR = Path(__file__).resolve().parents[1]
if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))

import client_manager
from services.mpe.mpe_brand_geometry import (
    build_brand_geometry_command_summary,
    generate_mpe_brand_geometry,
    get_mpe_brand_geometry_svg_path,
    load_persisted_mpe_brand_geometry,
)
from services.mpe.mpe_brand_geometry_renderer import render_brand_geometry_svg


class MpeBrandGeometryTests(unittest.TestCase):
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

    def _seed_client(self):
        master = """
# MASTER BRAND EXPERIENCE

Identidad, esencia, soberania y proposito sostienen la entidad.
El metodo necesita arquitectura, sistema, proceso y herramientas.
La oferta premium debe organizar conversion comercial sin ruido.
El storytelling y la narrativa vuelven visible la expansion futura.
El universo visual necesita simbolo, imagen, color y coherencia.
"""
        scan = {
            "client": "Client A",
            "engine": "MPE Entity Scan",
            "version": "0.1",
            "evolution_stage": "expansion_viable",
            "geometry": {"shape": "Espiral"},
            "morphogenesis_seed": {
                "D": 0.72,
                "R": 0.76,
                "V": 0.69,
                "F": 0.82,
                "M": 0.78,
                "N": 0.22,
                "E": 0.80,
            },
        }
        self._write("Client A/05_ENTREGAS/MASTER_BRAND_EXPERIENCE.md", master)
        self._write("Client A/11_MPE_ENTITY_SCAN/mpe_entity_scan.json", json.dumps(scan))

    def test_generates_brand_geometry_family_from_masterbrand(self):
        self._seed_client()

        result = generate_mpe_brand_geometry("Client A", persist=True)

        self.assertIsInstance(result, dict)
        self.assertEqual(result["client"], "Client A")
        self.assertTrue(result["source"]["master_brand"])
        self.assertGreaterEqual(len(result["geometries"]), 4)
        self.assertIn("primary_geometry", result)
        self.assertIn("reading", result)

        for geometry in result["geometries"]:
            self.assertIn("id", geometry)
            self.assertIn("shape", geometry)
            self.assertIn("morphogenesis_seed", geometry)
            self.assertIn("svg_path", geometry)
            for axis in ["D", "R", "V", "F", "M", "N", "E"]:
                self.assertIn(axis, geometry["morphogenesis_seed"])

        svg = render_brand_geometry_svg(result["geometries"][0])
        self.assertTrue(svg.startswith("<svg"))
        self.assertIn("</svg>", svg)

        self.assertTrue((self.clients_root / "Client A/14_MPE_BRAND_GEOMETRY/mpe_brand_geometry.json").is_file())
        self.assertTrue((self.clients_root / "Client A/14_MPE_BRAND_GEOMETRY/MPE_BRAND_GEOMETRY.md").is_file())
        self.assertTrue((self.clients_root / "Client A/14_MPE_BRAND_GEOMETRY/svg/entity_core.svg").is_file())

    def test_loads_summary_and_svg_path(self):
        self._seed_client()
        generate_mpe_brand_geometry("Client A", persist=True)

        loaded = load_persisted_mpe_brand_geometry("Client A")
        summary = build_brand_geometry_command_summary("Client A")
        svg_path = get_mpe_brand_geometry_svg_path("Client A", "entity_core")

        self.assertIsInstance(loaded, dict)
        self.assertTrue(summary["available"])
        self.assertGreaterEqual(summary["count"], 4)
        self.assertEqual(summary["primary_id"], "entity_core")
        self.assertTrue(svg_path.is_file())


if __name__ == "__main__":
    unittest.main()
