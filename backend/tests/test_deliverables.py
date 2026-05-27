import sys
import tempfile
import unittest
from pathlib import Path

BACKEND_DIR = Path(__file__).resolve().parents[1]
if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))

import client_manager


class DeliverablesTests(unittest.TestCase):
    def setUp(self):
        self._original_clients_root = client_manager.CLIENTS_ROOT
        self._temp_dir = tempfile.TemporaryDirectory()
        client_manager.CLIENTS_ROOT = Path(self._temp_dir.name)

    def tearDown(self):
        client_manager.CLIENTS_ROOT = self._original_clients_root
        self._temp_dir.cleanup()

    def test_missing_client_returns_none(self):
        self.assertIsNone(client_manager.list_client_deliverables("Missing Client"))

    def test_missing_deliverables_folder_returns_empty_items(self):
        (client_manager.CLIENTS_ROOT / "Client A").mkdir()

        result = client_manager.list_client_deliverables("Client A")

        self.assertEqual(result["client"], "Client A")
        self.assertEqual(result["base"], "05_ENTREGAS")
        self.assertEqual(result["items"], [])

    def test_lists_allowed_deliverable_metadata_without_absolute_paths(self):
        deliverables_dir = client_manager.CLIENTS_ROOT / "Client A" / "05_ENTREGAS"
        nested_dir = deliverables_dir / "identity"
        nested_dir.mkdir(parents=True)
        file_path = nested_dir / "brand_analysis.md"
        file_path.write_text("analysis", encoding="utf-8")

        result = client_manager.list_client_deliverables("Client A")
        file_items = [item for item in result["items"] if item["type"] == "file"]

        self.assertEqual(len(file_items), 1)
        self.assertEqual(file_items[0]["name"], "brand_analysis.md")
        self.assertEqual(file_items[0]["relative_path"], "05_ENTREGAS/identity/brand_analysis.md")
        self.assertEqual(file_items[0]["extension"], ".md")
        self.assertEqual(file_items[0]["size"], len("analysis"))
        self.assertNotIn(str(client_manager.CLIENTS_ROOT), file_items[0]["relative_path"])

    def test_directory_items_include_children_count(self):
        deliverables_dir = client_manager.CLIENTS_ROOT / "Client A" / "05_ENTREGAS"
        nested_dir = deliverables_dir / "identity"
        nested_dir.mkdir(parents=True)
        (nested_dir / "brand_analysis.md").write_text("analysis", encoding="utf-8")
        (nested_dir / "debug.log").write_text("log", encoding="utf-8")
        (nested_dir / ".env").write_text("secret", encoding="utf-8")

        result = client_manager.list_client_deliverables("Client A")
        directory_items = [item for item in result["items"] if item["type"] == "directory"]

        self.assertEqual(len(directory_items), 1)
        self.assertEqual(directory_items[0]["name"], "identity")
        self.assertEqual(directory_items[0]["relative_path"], "05_ENTREGAS/identity")
        self.assertEqual(directory_items[0]["children_count"], 1)
        self.assertNotIn("children_count", [item for item in result["items"] if item["type"] == "file"][0])

    def test_skips_excluded_items_and_depth_beyond_limit(self):
        deliverables_dir = client_manager.CLIENTS_ROOT / "Client A" / "05_ENTREGAS"
        deliverables_dir.mkdir(parents=True)
        (deliverables_dir / ".env").write_text("secret", encoding="utf-8")
        (deliverables_dir / "debug.log").write_text("log", encoding="utf-8")
        (deliverables_dir / "node_modules").mkdir()
        deep_dir = deliverables_dir / "a" / "b" / "c"
        deep_dir.mkdir(parents=True)
        (deep_dir / "too_deep.md").write_text("deep", encoding="utf-8")
        (deliverables_dir / "ok.md").write_text("ok", encoding="utf-8")

        result = client_manager.list_client_deliverables("Client A")
        paths = {item["relative_path"] for item in result["items"]}

        self.assertIn("05_ENTREGAS/ok.md", paths)
        self.assertNotIn("05_ENTREGAS/.env", paths)
        self.assertNotIn("05_ENTREGAS/debug.log", paths)
        self.assertNotIn("05_ENTREGAS/node_modules", paths)
        self.assertNotIn("05_ENTREGAS/a/b/c/too_deep.md", paths)


if __name__ == "__main__":
    unittest.main()
