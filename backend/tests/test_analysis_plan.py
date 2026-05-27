import asyncio
import json
import sys
import tempfile
import unittest
from pathlib import Path

BACKEND_DIR = Path(__file__).resolve().parents[1]
if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))

import client_manager
from main import app


async def _asgi_post(path):
    messages = []
    request_sent = False

    async def receive():
        nonlocal request_sent

        if request_sent:
            return {"type": "http.disconnect"}

        request_sent = True
        return {"type": "http.request", "body": b"", "more_body": False}

    async def send(message):
        messages.append(message)

    scope = {
        "type": "http",
        "asgi": {"version": "3.0", "spec_version": "2.3"},
        "http_version": "1.1",
        "method": "POST",
        "scheme": "http",
        "path": path,
        "raw_path": path.encode("ascii"),
        "query_string": b"",
        "headers": [],
        "client": ("testclient", 50000),
        "server": ("testserver", 80),
    }

    await app(scope, receive, send)

    status = None
    body = b""

    for message in messages:
        if message["type"] == "http.response.start":
            status = message["status"]
        elif message["type"] == "http.response.body":
            body += message.get("body", b"")

    return status, json.loads(body.decode("utf-8") or "{}")


class AnalysisPlanTests(unittest.TestCase):
    def setUp(self):
        self._original_clients_root = client_manager.CLIENTS_ROOT
        self._temp_dir = tempfile.TemporaryDirectory()
        client_manager.CLIENTS_ROOT = Path(self._temp_dir.name)

    def tearDown(self):
        client_manager.CLIENTS_ROOT = self._original_clients_root
        self._temp_dir.cleanup()

    def _create_client_sources(self):
        client_path = client_manager.CLIENTS_ROOT / "Client A"
        (client_path / "01_DIAGNOSTICO_ACTUAL" / "Instagram_Actual").mkdir(parents=True)
        (client_path / "01_DIAGNOSTICO_ACTUAL" / "Material_Actual").mkdir(parents=True)
        (client_path / "01_DIAGNOSTICO_ACTUAL" / "Reuniones_Zoom").mkdir(parents=True)
        (client_path / "02_ESENCIA_DE_MARCA").mkdir(parents=True)
        (client_path / "00_ADMIN" / "Links_Accesos").mkdir(parents=True)

        (client_path / "01_DIAGNOSTICO_ACTUAL" / "Instagram_Actual" / "screenshot.png").write_bytes(b"img")
        (client_path / "01_DIAGNOSTICO_ACTUAL" / "Material_Actual" / "deck.pdf").write_bytes(b"pdf")
        (client_path / "01_DIAGNOSTICO_ACTUAL" / "Reuniones_Zoom" / "TRANSCRIPCIONES.md").write_text("transcript", encoding="utf-8")
        (client_path / "02_ESENCIA_DE_MARCA" / "CLIENT_CONTEXT.md").write_text("notes", encoding="utf-8")
        (client_path / "00_ADMIN" / "Links_Accesos" / "LINKS.md").write_text("links", encoding="utf-8")

        return client_path

    def test_existing_client_returns_analysis_plan(self):
        self._create_client_sources()

        status, data = asyncio.run(_asgi_post("/clients/Client A/analysis-plan"))

        self.assertEqual(status, 200)
        self.assertEqual(data["client"], "Client A")
        self.assertTrue(data["can_run"])
        self.assertIn(data["confidence"], {"high", "medium", "low"})
        self.assertIn("sources", data)
        self.assertIn("missing_sources", data)
        self.assertIn("pipeline", data)
        self.assertIn("agents", data)
        self.assertFalse(data["will_write_files"])

    def test_missing_client_returns_404(self):
        status, data = asyncio.run(_asgi_post("/clients/Missing Client/analysis-plan"))

        self.assertEqual(status, 404)
        self.assertEqual(data["detail"], "Client not found.")

    def test_response_does_not_include_absolute_paths(self):
        self._create_client_sources()

        _status, data = asyncio.run(_asgi_post("/clients/Client A/analysis-plan"))
        serialized = json.dumps(data)

        self.assertNotIn(str(client_manager.CLIENTS_ROOT), serialized)
        self.assertNotIn("\\", serialized)

    def test_does_not_write_files_in_client_folder(self):
        client_path = self._create_client_sources()
        before = sorted(path.relative_to(client_path).as_posix() for path in client_path.rglob("*"))

        status, data = asyncio.run(_asgi_post("/clients/Client A/analysis-plan"))

        after = sorted(path.relative_to(client_path).as_posix() for path in client_path.rglob("*"))
        self.assertEqual(status, 200)
        self.assertFalse(data["will_write_files"])
        self.assertEqual(before, after)


if __name__ == "__main__":
    unittest.main()
