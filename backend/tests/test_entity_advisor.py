import sys
import tempfile
import unittest
from pathlib import Path


BACKEND_DIR = Path(__file__).resolve().parents[1]
if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))

from services import entity_advisor


class EntityAdvisorTests(unittest.TestCase):
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
        if isinstance(content, bytes):
            path.write_bytes(content)
        else:
            path.write_text(content, encoding="utf-8")
        return path

    def test_recommends_brand_memory_when_analysis_exists(self):
        self._write("CLIENTES_ACTIVOS/Client A/01_DIAGNOSTICO_ACTUAL/Analisis_Brand_Experience/LATEST_ANALYSIS.md")
        self._write("04_CREATIVE_LIBRARY/02_Assets_Visuales/Entidad/entity.png", b"png")

        result = entity_advisor.build_entity_advisor("Client A")

        self.assertEqual(result["client"], "Client A")
        self.assertTrue(result["state"]["latest_analysis"])
        self.assertFalse(result["state"]["brand_memory_core"])
        self.assertEqual(result["recommendation"]["state"], "needs_brand_memory")
        self.assertIn("welcome", result["fluid_messages"])
        self.assertIn("internal", result["fluid_messages"])
        self.assertEqual(result["assets"][0]["relative_path"], "02_Assets_Visuales/Entidad/entity.png")

    def test_reports_ai_agent_os_when_previous_engines_exist(self):
        self._write("CLIENTES_ACTIVOS/Client A/01_DIAGNOSTICO_ACTUAL/Analisis_Brand_Experience/LATEST_ANALYSIS.md")
        self._write("CLIENTES_ACTIVOS/Client A/02_MEMORY/BRAND_MEMORY_CORE_MASTER.md")
        self._write("CLIENTES_ACTIVOS/Client A/07_VISUAL_DNA_ENGINE/VISUAL_DNA_ENGINE_MASTER.md")
        self._write("CLIENTES_ACTIVOS/Client A/08_CONTENT_INTELLIGENCE_ENGINE/CONTENT_INTELLIGENCE_ENGINE_MASTER.md")

        result = entity_advisor.build_entity_advisor("Client A")

        self.assertTrue(result["state"]["brand_memory_core"])
        self.assertTrue(result["state"]["visual_dna_engine"])
        self.assertTrue(result["state"]["content_intelligence_engine"])
        self.assertFalse(result["state"]["ai_agent_os"])
        self.assertEqual(result["recommendation"]["state"], "needs_ai_agent_os")

    def test_creative_asset_path_stays_inside_library(self):
        asset = self._write("04_CREATIVE_LIBRARY/02_Assets_Visuales/Entidad/entity.png", b"png")

        resolved = entity_advisor.get_creative_library_asset_path("02_Assets_Visuales/Entidad/entity.png")

        self.assertEqual(resolved, asset.resolve())

        with self.assertRaises(ValueError):
            entity_advisor.get_creative_library_asset_path("../secret.png")

    def test_welcome_audio_can_be_served_without_entering_visual_rotation(self):
        audio = self._write("04_CREATIVE_LIBRARY/02_Assets_Visuales/Entidad/bienvenida.mp3", b"mp3")
        self._write("04_CREATIVE_LIBRARY/02_Assets_Visuales/Entidad/entity.png", b"png")

        resolved = entity_advisor.get_creative_library_asset_path("02_Assets_Visuales/Entidad/bienvenida.mp3")
        assets = entity_advisor._entity_assets()

        self.assertEqual(resolved, audio.resolve())
        self.assertNotIn("bienvenida.mp3", [asset["name"] for asset in assets])


if __name__ == "__main__":
    unittest.main()
