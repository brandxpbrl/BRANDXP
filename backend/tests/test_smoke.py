import asyncio
import json
import sys
import unittest
from pathlib import Path

BACKEND_DIR = Path(__file__).resolve().parents[1]
if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))

from main import app


async def _asgi_get(path):
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
        "method": "GET",
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


class BackendSmokeTests(unittest.TestCase):
    def test_app_imports_with_expected_title(self):
        self.assertEqual(app.title, "Brand Experience OS API")

    def test_health_returns_ok(self):
        status, data = asyncio.run(_asgi_get("/health"))

        self.assertEqual(status, 200)
        self.assertEqual(data.get("status"), "ok")
        self.assertGreaterEqual(data.get("agents_loaded", 0), 1)

    def test_clients_returns_clients_key(self):
        status, data = asyncio.run(_asgi_get("/clients"))

        self.assertEqual(status, 200)
        self.assertIn("clients", data)
        self.assertIsInstance(data["clients"], list)


if __name__ == "__main__":
    unittest.main()
