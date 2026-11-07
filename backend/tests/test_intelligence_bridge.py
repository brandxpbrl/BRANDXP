import json
import os
import sys
import tempfile
import unittest
from pathlib import Path
from unittest.mock import patch


sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from services import gravity_bridge, knowledge_catalog


class IntelligenceBridgeTests(unittest.TestCase):
    def test_knowledge_search_keeps_original_source_and_hash(self):
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            document = root / "IDENTITY" / "voice.md"
            document.parent.mkdir()
            document.write_text("La voz de marca expresa confianza y claridad.", encoding="utf-8")
            with patch.object(knowledge_catalog, "SOURCE_ROOT", root):
                results = knowledge_catalog.search_knowledge("voz confianza")
            self.assertEqual(len(results), 1)
            self.assertEqual(results[0]["source"], "BRAND_EXPERIENCE_OS/KNOWLEDGE/ENTITY_BIBLE/IDENTITY/voice.md")
            self.assertEqual(len(results[0]["sha256"]), 12)

    def test_gravity_draft_requires_explicit_approval_for_memory(self):
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            agents = root / "agents"
            agents.mkdir()
            (agents / "01_agente_identidad.md").write_text("Analiza identidad.", encoding="utf-8")
            (agents / "00_protocolo_evidencia_comun.md").write_text("Cita fuentes.", encoding="utf-8")
            (agents / "00_protocolo_seguridad_etica.md").write_text("Respeta limites.", encoding="utf-8")
            client = root / "client"
            client.mkdir()
            readiness = {"A01": {"id": "A01", "status": "Listo", "score": 90}}
            bundle = {"client_path": str(client), "context": "Historia de marca.", "sources": ["00_ADMIN/profile.md"]}
            with patch.object(gravity_bridge, "AGENTS_ROOT", agents), \
                    patch.object(gravity_bridge, "_client", return_value=("Client A", client)), \
                    patch.object(gravity_bridge, "_readiness", return_value=readiness), \
                    patch.object(gravity_bridge, "load_client_context_bundle", return_value=bundle), \
                    patch.object(gravity_bridge, "search_knowledge", return_value=[]), \
                    patch.object(gravity_bridge, "chat_completion", return_value={"content": "Hallazgo con evidencia.", "provider": "mock"}):
                draft = gravity_bridge.run_gravity_agent("Client A", "A01", "¿Qué sabemos?")
                memory = client / gravity_bridge.APPROVED_FOLDER / f"{draft['id']}.md"
                self.assertEqual(draft["status"], "draft")
                self.assertFalse(memory.exists())
                self.assertEqual(gravity_bridge.get_gravity_run("Client A", draft["id"])["status"], "draft")
                result = gravity_bridge.approve_gravity_run("Client A", draft["id"])
                self.assertEqual(result["status"], "approved")
                self.assertIn("Hallazgo con evidencia.", memory.read_text(encoding="utf-8"))
                saved = next((client / gravity_bridge.RUN_FOLDER).glob("*.json"))
                self.assertEqual(json.loads(saved.read_text(encoding="utf-8"))["status"], "approved")

    def test_intelligence_route_requires_developer_session(self):
        from fastapi.testclient import TestClient
        from main import app
        from services.access_control import create_access_token

        with patch.dict(os.environ, {"BEOS_ACCESS_CONTROL": "true", "BEOS_DEVELOPER_KEY": "test-developer-key"}):
            client = TestClient(app)
            url = "/api/clients/Client%20A/intelligence"
            self.assertEqual(client.get(url).status_code, 401)
            client_token = create_access_token("client", "Client A")
            self.assertEqual(client.get(url, headers={"X-BEOS-Token": client_token}).status_code, 403)
            with patch("services.intelligence_api.gravity_status", return_value={"client": "Client A"}):
                developer_token = create_access_token("developer")
                self.assertEqual(client.get(url, headers={"X-BEOS-Token": developer_token}).status_code, 200)


if __name__ == "__main__":
    unittest.main()
