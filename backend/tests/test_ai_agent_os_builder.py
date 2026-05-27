import json
import sys
import tempfile
import unittest
from pathlib import Path


BACKEND_DIR = Path(__file__).resolve().parents[1]
if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))

from services import ai_agent_os_builder


class AiAgentOsBuilderTests(unittest.TestCase):
    def setUp(self):
        self._original_clients_root = ai_agent_os_builder.CLIENTS_ROOT
        self._temp_dir = tempfile.TemporaryDirectory()
        self.root = Path(self._temp_dir.name)
        ai_agent_os_builder.CLIENTS_ROOT = self.root / "CLIENTES_ACTIVOS"

    def tearDown(self):
        ai_agent_os_builder.CLIENTS_ROOT = self._original_clients_root
        self._temp_dir.cleanup()

    def _write(self, relative_path, content="x"):
        path = self.root / relative_path
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_text(content, encoding="utf-8")
        return path

    def test_generates_ai_agent_os_files(self):
        self._write("CLIENTES_ACTIVOS/Client A/02_MEMORY/BRAND_MEMORY_CORE_MASTER.md")
        self._write(
            "CLIENTES_ACTIVOS/Client A/02_MEMORY/brand_memory_core.json",
            json.dumps({"brand_name": "Client A"}),
        )
        self._write("CLIENTES_ACTIVOS/Client A/07_VISUAL_DNA_ENGINE/VISUAL_DNA_ENGINE_MASTER.md")
        self._write(
            "CLIENTES_ACTIVOS/Client A/08_CONTENT_INTELLIGENCE_ENGINE/CONTENT_INTELLIGENCE_ENGINE_MASTER.md"
        )

        result = ai_agent_os_builder.generate_ai_agent_os("Client A")
        client_path = self.root / "CLIENTES_ACTIVOS" / "Client A"

        self.assertEqual(result["base"], "09_AI_AGENT_OS")
        self.assertTrue((client_path / "09_AI_AGENT_OS" / "AI_AGENT_OS_MASTER.md").is_file())
        self.assertTrue((client_path / "09_AI_AGENT_OS" / "ai_agent_os.json").is_file())
        self.assertTrue((client_path / "09_AI_AGENT_OS" / "modules" / "02_AGENT_ROLES.md").is_file())
        self.assertIn("09_AI_AGENT_OS/AI_AGENT_OS_MASTER.md", result["created"])

    def test_requires_previous_priorities(self):
        self._write("CLIENTES_ACTIVOS/Client A/02_MEMORY/BRAND_MEMORY_CORE_MASTER.md")

        with self.assertRaises(ValueError):
            ai_agent_os_builder.generate_ai_agent_os("Client A")


if __name__ == "__main__":
    unittest.main()
