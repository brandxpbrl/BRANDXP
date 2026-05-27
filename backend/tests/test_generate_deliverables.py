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


class GenerateDeliverablesTests(unittest.TestCase):
    def setUp(self):
        self._original_clients_root = client_manager.CLIENTS_ROOT
        self._temp_dir = tempfile.TemporaryDirectory()
        client_manager.CLIENTS_ROOT = Path(self._temp_dir.name)

    def tearDown(self):
        client_manager.CLIENTS_ROOT = self._original_clients_root
        self._temp_dir.cleanup()

    def _client_path(self):
        client_path = client_manager.CLIENTS_ROOT / "Client A"
        (client_path / "01_DIAGNOSTICO_ACTUAL" / "Analisis_Brand_Experience").mkdir(parents=True)
        return client_path

    def _write_latest_json(self):
        client_path = self._client_path()
        analysis_dir = client_path / "01_DIAGNOSTICO_ACTUAL" / "Analisis_Brand_Experience"
        payload = {
            "client": "Client A",
            "created_at": "2026-05-18T09:00:00",
            "prompt": "Analyze Client A",
            "provider": {"active_provider": "test"},
            "concepts": ["Brand Identity"],
            "agents": ["Branding"],
            "analysis": {
                "headline": "Client A needs clearer strategic signals.",
                "overall_score": 70,
                "confidence": 82,
                "diagnosis": {
                    "current_state": "Useful signals exist.",
                    "main_gap": "Visual coherence",
                    "strategic_decision": "Create a tighter identity system.",
                },
                "scorecard": [
                    {
                        "key": "visual_coherence",
                        "label": "Coherencia visual",
                        "score": 58,
                        "status": "Critico",
                        "signal": "Visual system is inconsistent.",
                        "action": "Define visual rules.",
                    }
                ],
                "priorities": [
                    {
                        "title": "Coherencia visual",
                        "urgency": "Alta",
                        "reason": "It affects perception.",
                        "action": "Create a visual direction.",
                    }
                ],
                "deliverables": [
                    {
                        "name": "Identity Patch",
                        "outcome": "Clearer perception.",
                        "actions": ["Write the mother phrase."],
                    }
                ],
                "content_pillars": [
                    {
                        "name": "Autoridad",
                        "role": "Show expertise.",
                        "formats": ["carousel"],
                    }
                ],
                "ai_prompts": [
                    {
                        "name": "Prompt maestro",
                        "prompt": "Analyze this brand.",
                    }
                ],
                "next_sprint": ["Create identity patch."],
                "risks": ["Shipping loose ideas."],
            },
        }
        (analysis_dir / "LATEST_ANALYSIS.json").write_text(json.dumps(payload), encoding="utf-8")
        (analysis_dir / "LATEST_ANALYSIS.md").write_text("# Latest Analysis\n\nNarrative analysis.", encoding="utf-8")
        return client_path

    def test_missing_client_returns_404(self):
        status, data = asyncio.run(_asgi_post("/clients/Missing Client/deliverables/generate"))

        self.assertEqual(status, 404)
        self.assertEqual(data["detail"], "Client not found.")

    def test_missing_latest_analysis_returns_clear_error(self):
        self._client_path()

        status, data = asyncio.run(_asgi_post("/clients/Client A/deliverables/generate"))

        self.assertEqual(status, 400)
        self.assertIn("No LATEST_ANALYSIS.json or LATEST_ANALYSIS.md", data["detail"])

    def test_latest_json_generates_deliverables(self):
        client_path = self._write_latest_json()

        result = client_manager.generate_client_deliverables("Client A")

        self.assertEqual(result["client"], "Client A")
        self.assertEqual(result["base"], "05_ENTREGAS")
        self.assertEqual(len(result["created"]), 7)
        self.assertEqual(result["index"], "05_ENTREGAS/deliverables_index.json")

        for filename in client_manager.FINAL_DELIVERABLE_FILES:
            self.assertTrue((client_path / "05_ENTREGAS" / filename).is_file())

    def test_existing_markdown_files_are_versioned_without_overwrite(self):
        client_path = self._write_latest_json()
        deliverables_dir = client_path / "05_ENTREGAS"
        deliverables_dir.mkdir()
        original = deliverables_dir / "brand_analysis.md"
        original.write_text("original content", encoding="utf-8")
        existing_index = deliverables_dir / "deliverables_index.json"
        existing_index.write_text('{"old": true}', encoding="utf-8")

        result = client_manager.generate_client_deliverables("Client A")

        self.assertEqual(original.read_text(encoding="utf-8"), "original content")
        self.assertTrue(any(path.startswith("05_ENTREGAS/brand_analysis_") for path in result["versioned"]))
        self.assertIsNotNone(result["archived_index"])
        self.assertTrue((client_path / result["archived_index"]).is_file())
        self.assertTrue(existing_index.is_file())

    def test_index_contains_relative_metadata(self):
        client_path = self._write_latest_json()

        result = client_manager.generate_client_deliverables("Client A")
        index_payload = json.loads((client_path / result["index"]).read_text(encoding="utf-8"))
        serialized = json.dumps(index_payload)

        self.assertEqual(index_payload["client"], "Client A")
        self.assertIn("05_ENTREGAS/brand_analysis.md", index_payload["deliverables"])
        self.assertNotIn(str(client_manager.CLIENTS_ROOT), serialized)
        self.assertNotIn("\\", serialized)

    def test_does_not_write_outside_deliverables_folder(self):
        client_path = self._write_latest_json()

        client_manager.generate_client_deliverables("Client A")

        written_files = [
            path.relative_to(client_path).as_posix()
            for path in client_path.rglob("*")
            if path.is_file()
        ]
        generated_files = [
            path
            for path in written_files
            if path not in {
                "01_DIAGNOSTICO_ACTUAL/Analisis_Brand_Experience/LATEST_ANALYSIS.json",
                "01_DIAGNOSTICO_ACTUAL/Analisis_Brand_Experience/LATEST_ANALYSIS.md",
            }
        ]

        self.assertTrue(generated_files)
        self.assertTrue(all(path.startswith("05_ENTREGAS/") for path in generated_files))

    def test_markdown_fallback_generates_basic_deliverables(self):
        client_path = self._client_path()
        analysis_dir = client_path / "01_DIAGNOSTICO_ACTUAL" / "Analisis_Brand_Experience"
        (analysis_dir / "LATEST_ANALYSIS.md").write_text("# Latest Analysis\n\nOnly markdown.", encoding="utf-8")

        result = client_manager.generate_client_deliverables("Client A")

        self.assertEqual(len(result["created"]), 7)
        self.assertTrue((client_path / "05_ENTREGAS" / "brand_analysis.md").is_file())
        self.assertIn("markdown", result["source"])


if __name__ == "__main__":
    unittest.main()
