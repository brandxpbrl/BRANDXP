import sys
import tempfile
import unittest
from pathlib import Path


BACKEND_DIR = Path(__file__).resolve().parents[1]
if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))

import client_manager


class ListClientsTests(unittest.TestCase):
    def setUp(self):
        self._original_clients_root = client_manager.CLIENTS_ROOT
        self._temp_dir = tempfile.TemporaryDirectory()
        client_manager.CLIENTS_ROOT = Path(self._temp_dir.name)

    def tearDown(self):
        client_manager.CLIENTS_ROOT = self._original_clients_root
        self._temp_dir.cleanup()

    def test_lists_all_real_clients_and_hides_sample_api_client(self):
        (client_manager.CLIENTS_ROOT / "Client A").mkdir()
        (client_manager.CLIENTS_ROOT / "Client B").mkdir()
        (client_manager.CLIENTS_ROOT / "SampleAPITempPartialClient").mkdir()

        clients = client_manager.list_clients()
        names = [client["name"] for client in clients]

        self.assertEqual(names, ["Client A", "Client B"])


if __name__ == "__main__":
    unittest.main()
