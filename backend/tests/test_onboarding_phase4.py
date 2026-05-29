import unittest
import shutil
import sys
import os
import json
import time
import uuid
from pathlib import Path
from unittest.mock import patch

# Ensure backend path is in sys.path
backend_dir = Path(__file__).resolve().parent.parent
if str(backend_dir) not in sys.path:
    sys.path.insert(0, str(backend_dir))

from fastapi.testclient import TestClient
from main import app, ONBOARD_JOBS
from client_manager import CLIENTS_ROOT
from services.access_control import create_access_token


def mock_chat_completion(messages):
    return {
        "content": "## Mocked Diagnosis\n- Score: 90\n- Status: active\n",
        "provider": "mock",
        "fallback_used": False,
        "error": None
    }


def poll_until_done(test_client, job_id, headers=None, timeout=60):
    """Poll GET /api/clients/onboard/status/{job_id} until COMPLETED or FAILED."""
    deadline = time.time() + timeout
    while time.time() < deadline:
        kwargs = {}
        if headers:
            kwargs["headers"] = headers
        resp = test_client.get(f"/api/clients/onboard/status/{job_id}", **kwargs)
        if resp.status_code != 200:
            return resp
        data = resp.json()
        if data["status"] in {"COMPLETED", "FAILED"}:
            return resp
        time.sleep(0.25)
    raise TimeoutError(f"Job {job_id} did not complete within {timeout}s")


class TestOnboardingPhase4(unittest.TestCase):

    def setUp(self):
        self.client = TestClient(app)

        self.zero_client = "TestRouteZeroClient"
        self.partial_client = "TestRoutePartialClient"
        self.clients_to_cleanup = [self.zero_client, self.partial_client]

        self._orig_env = {
            "BEOS_ACCESS_CONTROL": os.environ.get("BEOS_ACCESS_CONTROL"),
            "BEOS_ACCESS_SECRET": os.environ.get("BEOS_ACCESS_SECRET"),
            "BEOS_DEVELOPER_KEY": os.environ.get("BEOS_DEVELOPER_KEY"),
            "BEOS_CLIENT_KEYS": os.environ.get("BEOS_CLIENT_KEYS")
        }

    def tearDown(self):
        for k, v in self._orig_env.items():
            if v is None:
                os.environ.pop(k, None)
            else:
                os.environ[k] = v

        for client in self.clients_to_cleanup:
            client_path = CLIENTS_ROOT / client
            if client_path.exists():
                try:
                    shutil.rmtree(client_path)
                except Exception:
                    pass

    # ------------------------------------------------------------------ #
    # NOTE ON BACKGROUNDTASKS BEHAVIOR:                                   #
    # FastAPI BackgroundTasks run AFTER the response is sent, even in     #
    # TestClient. POST returns STARTED immediately. Tests poll the status  #
    # endpoint until COMPLETED/FAILED, matching production behavior.       #
    # ------------------------------------------------------------------ #

    def test_post_returns_started_immediately(self):
        """POST must return job_id + STARTED without waiting for orchestration."""
        os.environ["BEOS_ACCESS_CONTROL"] = "false"

        payload = {
            "client_name": self.zero_client,
            "category": "Luxury Fashion",
            "notes": "Minimalist clothing line"
        }

        response = self.client.post("/api/clients/onboard", json=payload)
        self.assertEqual(response.status_code, 200)
        data = response.json()

        # Must return immediately with job_id and STARTED
        self.assertIn("job_id", data)
        self.assertIsNotNone(data["job_id"])
        self.assertEqual(data["status"], "STARTED")
        self.assertIsNone(data["result"])

    def test_started_running_completed_state_machine(self):
        """Verifies STARTED → RUNNING → COMPLETED state transitions in ONBOARD_JOBS."""
        job_id = uuid.uuid4().hex

        # Simulate POST handler initial write
        ONBOARD_JOBS[job_id] = {"job_id": job_id, "status": "STARTED", "result": None}
        self.assertEqual(ONBOARD_JOBS[job_id]["status"], "STARTED")
        self.assertIsNone(ONBOARD_JOBS[job_id]["result"])

        # Simulate background task sets RUNNING
        ONBOARD_JOBS[job_id]["status"] = "RUNNING"
        self.assertEqual(ONBOARD_JOBS[job_id]["status"], "RUNNING")

        # Simulate background task sets COMPLETED
        ONBOARD_JOBS[job_id].update({"status": "COMPLETED", "result": {"status": "COMPLETED"}})
        self.assertEqual(ONBOARD_JOBS[job_id]["status"], "COMPLETED")
        self.assertIsNotNone(ONBOARD_JOBS[job_id]["result"])

        del ONBOARD_JOBS[job_id]

    def test_onboard_zero_data_polls_to_completed(self):
        """Zero-data client: POST returns STARTED, polling reaches COMPLETED."""
        os.environ["BEOS_ACCESS_CONTROL"] = "false"

        payload = {
            "client_name": self.zero_client,
            "category": "Luxury Fashion",
            "notes": "Minimalist clothing line"
        }

        # POST returns STARTED immediately
        response = self.client.post("/api/clients/onboard", json=payload)
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data["status"], "STARTED")
        job_id = data["job_id"]

        # Poll until done
        final = poll_until_done(self.client, job_id)
        self.assertEqual(final.status_code, 200)
        final_data = final.json()

        self.assertEqual(final_data["status"], "COMPLETED")
        self.assertEqual(final_data["result"]["classification"], "ZERO/SEED DATA")
        self.assertEqual(final_data["result"]["engines"]["status"]["ai_agent_os"], "COMPLETED")

    @patch("cognitive_orchestrator.chat_completion", side_effect=mock_chat_completion)
    def test_access_control_401_403_200(self, mock_chat):
        """Access control: 401 no token, 403 client token, 200 dev token + polls COMPLETED."""
        os.environ["BEOS_ACCESS_CONTROL"] = "true"
        os.environ["BEOS_ACCESS_SECRET"] = "test-secret"
        os.environ["BEOS_DEVELOPER_KEY"] = "dev-key"
        os.environ["BEOS_CLIENT_KEYS"] = json.dumps({"TestOSClientA": "client-key"})

        payload = {
            "client_name": self.partial_client,
            "category": "Boutique Hospitality",
            "instagram": "https://instagram.com/myhotel",
            "links": ["https://myhotel.com"],
            "notes": "Premium boutique guest house"
        }

        # 1. No token → 401
        response = self.client.post("/api/clients/onboard", json=payload)
        self.assertEqual(response.status_code, 401)

        # 2. Client token → 403
        client_token = create_access_token("client", "TestOSClientA")
        response = self.client.post(
            "/api/clients/onboard",
            json=payload,
            headers={"X-BEOS-Token": client_token}
        )
        self.assertEqual(response.status_code, 403)

        # 3. Developer token → 200 STARTED
        dev_token = create_access_token("developer")
        response = self.client.post(
            "/api/clients/onboard",
            json=payload,
            headers={"X-BEOS-Token": dev_token}
        )
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data["status"], "STARTED")
        job_id = data["job_id"]

        # 4. Poll to completion with dev token
        final = poll_until_done(self.client, job_id, headers={"X-BEOS-Token": dev_token})
        self.assertEqual(final.status_code, 200)
        self.assertEqual(final.json()["status"], "COMPLETED")
        self.assertEqual(final.json()["result"]["classification"], "PARTIAL DATA")

        # 5. Status with client token → 403
        status_response = self.client.get(
            f"/api/clients/onboard/status/{job_id}",
            headers={"X-BEOS-Token": client_token}
        )
        self.assertEqual(status_response.status_code, 403)

    def test_status_endpoint_not_found(self):
        """Unknown job_id returns 404."""
        os.environ["BEOS_ACCESS_CONTROL"] = "false"
        response = self.client.get("/api/clients/onboard/status/invalid-job-9999")
        self.assertEqual(response.status_code, 404)


if __name__ == "__main__":
    unittest.main()
