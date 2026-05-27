import sys
import tempfile
import unittest
from pathlib import Path


BACKEND_DIR = Path(__file__).resolve().parents[1]
if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))

import client_manager
from services import client_portal, entity_advisor


class ClientPortalTests(unittest.TestCase):
    def setUp(self):
        self._original_client_manager_root = client_manager.CLIENTS_ROOT
        self._original_advisor_clients_root = entity_advisor.CLIENTS_ROOT
        self._original_library_root = entity_advisor.CREATIVE_LIBRARY_ROOT
        self._original_entity_assets_dir = entity_advisor.ENTITY_ASSETS_DIR
        self._temp_dir = tempfile.TemporaryDirectory()
        self.root = Path(self._temp_dir.name)
        self.clients_root = self.root / "CLIENTES_ACTIVOS"
        client_manager.CLIENTS_ROOT = self.clients_root
        entity_advisor.CLIENTS_ROOT = self.clients_root
        entity_advisor.CREATIVE_LIBRARY_ROOT = self.root / "04_CREATIVE_LIBRARY"
        entity_advisor.ENTITY_ASSETS_DIR = (
            entity_advisor.CREATIVE_LIBRARY_ROOT / "02_Assets_Visuales" / "Entidad"
        )

    def tearDown(self):
        client_manager.CLIENTS_ROOT = self._original_client_manager_root
        entity_advisor.CLIENTS_ROOT = self._original_advisor_clients_root
        entity_advisor.CREATIVE_LIBRARY_ROOT = self._original_library_root
        entity_advisor.ENTITY_ASSETS_DIR = self._original_entity_assets_dir
        self._temp_dir.cleanup()

    def _write(self, relative_path, content="x"):
        path = self.root / relative_path
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_text(content, encoding="utf-8")
        return path

    def test_builds_client_portal_from_real_client_state(self):
        self._write("CLIENTES_ACTIVOS/Client A/01_DIAGNOSTICO_ACTUAL/Analisis_Brand_Experience/LATEST_ANALYSIS.md")
        self._write("CLIENTES_ACTIVOS/Client A/02_MEMORY/BRAND_MEMORY_CORE_MASTER.md")
        self._write("CLIENTES_ACTIVOS/Client A/07_VISUAL_DNA_ENGINE/VISUAL_DNA_ENGINE_MASTER.md")
        self._write("CLIENTES_ACTIVOS/Client A/08_CONTENT_INTELLIGENCE_ENGINE/CONTENT_INTELLIGENCE_ENGINE_MASTER.md")
        self._write("CLIENTES_ACTIVOS/Client A/09_AI_AGENT_OS/AI_AGENT_OS_MASTER.md")
        self._write("CLIENTES_ACTIVOS/Client A/05_ENTREGAS/MASTER_BRAND_EXPERIENCE.md", "# Master")
        self._write("CLIENTES_ACTIVOS/Client A/05_ENTREGAS/internal_notes.md", "# Internal")

        result = client_portal.build_client_portal("Client A")

        self.assertEqual(result["client"], "Client A")
        self.assertIn("welcome_message", result)
        self.assertEqual(result["brand_status"]["modules"][1]["status"], "completed")
        self.assertEqual(result["entity_recommendation"]["next_action"], "Revisar entregables")
        self.assertEqual([item["name"] for item in result["deliverables"]], ["MASTER_BRAND_EXPERIENCE.md"])

    def test_missing_client_returns_none(self):
        self.assertIsNone(client_portal.build_client_portal("Missing"))


if __name__ == "__main__":
    unittest.main()
