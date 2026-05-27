import asyncio
import json
import sys
import tempfile
import unittest
from pathlib import Path
from urllib.parse import urlencode

BACKEND_DIR = Path(__file__).resolve().parents[1]
if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))

import client_manager
from main import app


async def _asgi_get(path, query=None):
    messages = []
    request_sent = False
    query_string = urlencode(query or {}).encode("ascii")

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
        "method": "GET",
        "scheme": "http",
        "path": path,
        "raw_path": path.encode("ascii"),
        "query_string": query_string,
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


class DeliverableContentTests(unittest.TestCase):
    def setUp(self):
        self._original_clients_root = client_manager.CLIENTS_ROOT
        self._temp_dir = tempfile.TemporaryDirectory()
        client_manager.CLIENTS_ROOT = Path(self._temp_dir.name)

    def tearDown(self):
        client_manager.CLIENTS_ROOT = self._original_clients_root
        self._temp_dir.cleanup()

    def _create_client(self):
        client_path = client_manager.CLIENTS_ROOT / "Client A"
        deliverables_dir = client_path / "05_ENTREGAS"
        deliverables_dir.mkdir(parents=True)
        return client_path, deliverables_dir

    def test_missing_client_returns_404(self):
        status, data = asyncio.run(
            _asgi_get(
                "/clients/Missing Client/deliverables/content",
                {"path": "05_ENTREGAS/brand_analysis.md"},
            )
        )

        self.assertEqual(status, 404)
        self.assertEqual(data["detail"], "Client not found.")

    def test_missing_file_returns_404(self):
        self._create_client()

        status, data = asyncio.run(
            _asgi_get(
                "/clients/Client A/deliverables/content",
                {"path": "05_ENTREGAS/missing.md"},
            )
        )

        self.assertEqual(status, 404)
        self.assertEqual(data["detail"], "Deliverable file not found.")

    def test_path_traversal_fails(self):
        self._create_client()

        status, data = asyncio.run(
            _asgi_get(
                "/clients/Client A/deliverables/content",
                {"path": "05_ENTREGAS/../secret.md"},
            )
        )

        self.assertEqual(status, 400)
        self.assertIn("Invalid deliverable path", data["detail"])

    def test_absolute_path_fails(self):
        self._create_client()

        status, data = asyncio.run(
            _asgi_get(
                "/clients/Client A/deliverables/content",
                {"path": "C:\\temp\\brand_analysis.md"},
            )
        )

        self.assertEqual(status, 400)
        self.assertIn("Invalid deliverable path", data["detail"])

    def test_file_outside_deliverables_fails(self):
        client_path, _deliverables_dir = self._create_client()
        outside_file = client_path / "01_DIAGNOSTICO_ACTUAL" / "note.md"
        outside_file.parent.mkdir(parents=True)
        outside_file.write_text("outside", encoding="utf-8")

        status, data = asyncio.run(
            _asgi_get(
                "/clients/Client A/deliverables/content",
                {"path": "01_DIAGNOSTICO_ACTUAL/note.md"},
            )
        )

        self.assertEqual(status, 400)
        self.assertIn("05_ENTREGAS", data["detail"])

    def test_disallowed_extension_fails(self):
        _client_path, deliverables_dir = self._create_client()
        (deliverables_dir / "image.png").write_bytes(b"png")

        status, data = asyncio.run(
            _asgi_get(
                "/clients/Client A/deliverables/content",
                {"path": "05_ENTREGAS/image.png"},
            )
        )

        self.assertEqual(status, 400)
        self.assertIn("extension", data["detail"])

    def test_md_file_returns_content(self):
        _client_path, deliverables_dir = self._create_client()
        (deliverables_dir / "brand_analysis.md").write_text("# Analysis", encoding="utf-8")

        status, data = asyncio.run(
            _asgi_get(
                "/clients/Client A/deliverables/content",
                {"path": "05_ENTREGAS/brand_analysis.md"},
            )
        )

        self.assertEqual(status, 200)
        self.assertEqual(data["content"], "# Analysis")
        self.assertEqual(data["extension"], ".md")

    def test_txt_file_returns_content(self):
        _client_path, deliverables_dir = self._create_client()
        (deliverables_dir / "notes.txt").write_text("notes", encoding="utf-8")

        status, data = asyncio.run(
            _asgi_get(
                "/clients/Client A/deliverables/content",
                {"path": "05_ENTREGAS/notes.txt"},
            )
        )

        self.assertEqual(status, 200)
        self.assertEqual(data["content"], "notes")
        self.assertEqual(data["extension"], ".txt")

    def test_json_file_returns_content(self):
        _client_path, deliverables_dir = self._create_client()
        (deliverables_dir / "spec.json").write_text('{"ok": true}', encoding="utf-8")

        status, data = asyncio.run(
            _asgi_get(
                "/clients/Client A/deliverables/content",
                {"path": "05_ENTREGAS/spec.json"},
            )
        )

        self.assertEqual(status, 200)
        self.assertEqual(data["content"], '{"ok": true}')
        self.assertEqual(data["extension"], ".json")

    def test_response_does_not_include_absolute_paths(self):
        _client_path, deliverables_dir = self._create_client()
        (deliverables_dir / "brand_analysis.md").write_text("# Analysis", encoding="utf-8")

        _status, data = asyncio.run(
            _asgi_get(
                "/clients/Client A/deliverables/content",
                {"path": "05_ENTREGAS/brand_analysis.md"},
            )
        )
        serialized = json.dumps(data)

        self.assertNotIn(str(client_manager.CLIENTS_ROOT), serialized)
        self.assertNotIn("\\", serialized)

    def test_file_larger_than_limit_fails(self):
        _client_path, deliverables_dir = self._create_client()
        (deliverables_dir / "large.md").write_text("x" * (client_manager.MAX_DELIVERABLE_CONTENT_BYTES + 1), encoding="utf-8")

        status, data = asyncio.run(
            _asgi_get(
                "/clients/Client A/deliverables/content",
                {"path": "05_ENTREGAS/large.md"},
            )
        )

        self.assertEqual(status, 400)
        self.assertIn("too large", data["detail"])

    def test_directory_content_fails(self):
        _client_path, deliverables_dir = self._create_client()
        (deliverables_dir / "board_specs").mkdir()

        status, data = asyncio.run(
            _asgi_get(
                "/clients/Client A/deliverables/content",
                {"path": "05_ENTREGAS/board_specs"},
            )
        )

        self.assertEqual(status, 400)
        self.assertIn("not a file", data["detail"])


if __name__ == "__main__":
    unittest.main()
