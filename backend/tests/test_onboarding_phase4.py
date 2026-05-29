import unittest
import shutil
import sys
import os
import json
from pathlib import Path
from unittest.mock import patch

# Ensure backend path is in sys.path
backend_dir = Path(__file__).resolve().parent.parent
if str(backend_dir) not in sys.path:
    sys.path.insert(0, str(backend_dir))

from fastapi.testclient import TestClient
from main import app
from client_manager import CLIENTS_ROOT
from services.access_control import create_access_token

def mock_chat_completion(messages):
    return {
        "content": "## Mocked Diagnosis\n- Score: 90\n- Status: active\n- Signal: verified\n- Action: construct memory core\n",
        "provider": "mock",
        "fallback_used": False,
        "error": None
    }

class TestOnboardingPhase4(unittest.TestCase):

    def setUp(self):
        self.client = TestClient(app)
        
        # Test client names
        self.zero_client = "TestRouteZeroClient"
        self.partial_client = "TestRoutePartialClient"
        self.rich_client = "TestRouteRichClient"
        
        self.clients_to_cleanup = [self.zero_client, self.partial_client, self.rich_client]
        
        # Ensure clean environment variables for access control config
        self._orig_env = {
            "BEOS_ACCESS_CONTROL": os.environ.get("BEOS_ACCESS_CONTROL"),
            "BEOS_ACCESS_SECRET": os.environ.get("BEOS_ACCESS_SECRET"),
            "BEOS_DEVELOPER_KEY": os.environ.get("BEOS_DEVELOPER_KEY"),
            "BEOS_CLIENT_KEYS": os.environ.get("BEOS_CLIENT_KEYS")
        }
        
    def tearDown(self):
        # Restore environment
        for k, v in self._orig_env.items():
            if v is None:
                os.environ.pop(k, None)
            else:
                os.environ[k] = v
                
        # Clean up temporary test client folders
        for client in self.clients_to_cleanup:
            client_path = CLIENTS_ROOT / client
            if client_path.exists():
                try:
                    shutil.rmtree(client_path)
                except Exception:
                    pass

    def test_onboard_endpoint_no_auth(self):
        # Test client creation with access control disabled
        os.environ["BEOS_ACCESS_CONTROL"] = "false"
        
        payload = {
            "client_name": self.zero_client,
            "category": "Luxury Fashion",
            "notes": "Minimalist clothing line"
        }
        
        response = self.client.post("/api/clients/onboard", json=payload)
        self.assertEqual(response.status_code, 200)
        data = response.json()
        
        self.assertIn("job_id", data)
        self.assertEqual(data["status"], "COMPLETED")
        self.assertEqual(data["result"]["classification"], "ZERO/SEED DATA")
        self.assertEqual(data["result"]["engines"]["status"]["ai_agent_os"], "COMPLETED")
        
        # Check GET status endpoint
        job_id = data["job_id"]
        status_response = self.client.get(f"/api/clients/onboard/status/{job_id}")
        self.assertEqual(status_response.status_code, 200)
        status_data = status_response.json()
        self.assertEqual(status_data["job_id"], job_id)
        self.assertEqual(status_data["status"], "COMPLETED")

    @patch("cognitive_orchestrator.chat_completion", side_effect=mock_chat_completion)
    def test_onboard_endpoint_with_access_control(self, mock_chat):
        # Set secret and enable access control
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
        
        # 1. Without authorization header/query params -> Should be 401
        response = self.client.post("/api/clients/onboard", json=payload)
        self.assertEqual(response.status_code, 401)
        
        # 2. With client token -> Should be 403 Forbidden (clients cannot onboard)
        client_token = create_access_token("client", "TestOSClientA")
        response = self.client.post(
            "/api/clients/onboard", 
            json=payload,
            headers={"X-BEOS-Token": client_token}
        )
        self.assertEqual(response.status_code, 403)
        
        # 3. With developer token -> Should succeed
        dev_token = create_access_token("developer")
        response = self.client.post(
            "/api/clients/onboard", 
            json=payload,
            headers={"X-BEOS-Token": dev_token}
        )
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data["status"], "COMPLETED")
        self.assertEqual(data["result"]["classification"], "PARTIAL DATA")
        
        # 4. Check status retrieval with dev token -> Should succeed
        job_id = data["job_id"]
        status_response = self.client.get(
            f"/api/clients/onboard/status/{job_id}",
            headers={"X-BEOS-Token": dev_token}
        )
        self.assertEqual(status_response.status_code, 200)
        self.assertEqual(status_response.json()["status"], "COMPLETED")
        
        # 5. Check status retrieval with client token -> Should be 403 Forbidden
        status_response = self.client.get(
            f"/api/clients/onboard/status/{job_id}",
            headers={"X-BEOS-Token": client_token}
        )
        self.assertEqual(status_response.status_code, 403)

    def test_status_endpoint_not_found(self):
        os.environ["BEOS_ACCESS_CONTROL"] = "false"
        response = self.client.get("/api/clients/onboard/status/invalid-job-id")
        self.assertEqual(response.status_code, 404)

if __name__ == "__main__":
    unittest.main()
