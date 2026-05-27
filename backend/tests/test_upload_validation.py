import sys
import tempfile
import unittest
from io import BytesIO
from pathlib import Path

BACKEND_DIR = Path(__file__).resolve().parents[1]
if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))

import client_manager


class ChunkedFile:
    def __init__(self, chunks):
        self._chunks = list(chunks)

    def read(self, _size=-1):
        if not self._chunks:
            return b""

        return self._chunks.pop(0)


class UploadValidationTests(unittest.TestCase):
    def test_disallowed_extension_fails_before_client_creation(self):
        original_ensure_client = client_manager.ensure_client

        def fail_if_called(_client_name):
            raise AssertionError("ensure_client should not be called for invalid extensions")

        client_manager.ensure_client = fail_if_called

        try:
            with self.assertRaisesRegex(ValueError, "File extension is not allowed"):
                client_manager.save_uploaded_file(
                    "Unit Test Client",
                    BytesIO(b"test"),
                    "../bad.exe",
                    "Material_Actual",
                )
        finally:
            client_manager.ensure_client = original_ensure_client

    def test_reserved_or_dangerous_filename_fails_before_client_creation(self):
        original_ensure_client = client_manager.ensure_client

        def fail_if_called(_client_name):
            raise AssertionError("ensure_client should not be called for invalid names")

        client_manager.ensure_client = fail_if_called

        try:
            with self.assertRaisesRegex(ValueError, "Invalid file name"):
                client_manager.save_uploaded_file(
                    "Unit Test Client",
                    BytesIO(b"test"),
                    "../CON.txt",
                    "Material_Actual",
                )
        finally:
            client_manager.ensure_client = original_ensure_client

    def test_too_large_file_fails_without_touching_real_client_memory(self):
        original_ensure_client = client_manager.ensure_client
        original_max_upload_bytes = client_manager.MAX_UPLOAD_BYTES
        original_upload_chunk_bytes = client_manager.UPLOAD_CHUNK_BYTES

        with tempfile.TemporaryDirectory() as temp_dir:
            temp_client_path = Path(temp_dir) / "Unit Test Client"

            def fake_ensure_client(_client_name):
                return {
                    "name": "Unit Test Client",
                    "path": str(temp_client_path),
                    "created": True,
                }

            client_manager.ensure_client = fake_ensure_client
            client_manager.MAX_UPLOAD_BYTES = 5
            client_manager.UPLOAD_CHUNK_BYTES = 4

            try:
                with self.assertRaisesRegex(ValueError, "File is too large"):
                    client_manager.save_uploaded_file(
                        "Unit Test Client",
                        ChunkedFile([b"1234", b"5678"]),
                        "too-large.txt",
                        "Material_Actual",
                    )

                upload_path = (
                    temp_client_path
                    / "01_DIAGNOSTICO_ACTUAL"
                    / "Material_Actual"
                    / "too-large.txt"
                )
                self.assertFalse(upload_path.exists())
            finally:
                client_manager.ensure_client = original_ensure_client
                client_manager.MAX_UPLOAD_BYTES = original_max_upload_bytes
                client_manager.UPLOAD_CHUNK_BYTES = original_upload_chunk_bytes


if __name__ == "__main__":
    unittest.main()
