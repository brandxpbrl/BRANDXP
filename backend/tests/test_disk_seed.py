"""
Tests for services/disk_seed.py

Covers:
  1. Empty disk gets seeded when seed source exists and flag is absent.
  2. Existing files on disk are NOT overwritten during seeding.
  3. .disk_seeded sentinel prevents repeat seeding on subsequent startups.
  4. Missing seed source logs a warning and returns gracefully (local dev path).
  5. Seed failure (e.g. permission error) is caught and startup continues.
"""

import shutil
import tempfile
import unittest
from pathlib import Path

import sys
import os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))

from services.disk_seed import seed_disk_if_needed, _seeded_flag


class TestDiskSeed(unittest.TestCase):

    def setUp(self):
        # Create fresh temp directories for each test
        self._tmp = tempfile.mkdtemp()
        self.seed_source = Path(self._tmp) / "BRAND_EXPERIENCE_git_seed"
        self.disk_root   = Path(self._tmp) / "BRAND_EXPERIENCE"

        # Populate the seed source with a representative tree
        clients = self.seed_source / "03_CLIENT_SYSTEM" / "CLIENTES_ACTIVOS"
        (clients / "ryaanlouis" / "00_ADMIN").mkdir(parents=True)
        (clients / "ryaanlouis" / "00_ADMIN" / "client_profile.json").write_text(
            '{"name": "ryaanlouis"}', encoding="utf-8"
        )
        (clients / "ryaanlouis" / "01_DIAGNOSTICO_ACTUAL").mkdir(parents=True)
        (clients / "ryaanlouis" / "01_DIAGNOSTICO_ACTUAL" / "LATEST_ANALYSIS.md").write_text(
            "# Analysis", encoding="utf-8"
        )

    def tearDown(self):
        shutil.rmtree(self._tmp, ignore_errors=True)

    # ------------------------------------------------------------------
    # Test 1: Empty disk gets seeded
    # ------------------------------------------------------------------
    def test_empty_disk_is_seeded(self):
        """When disk is empty and seed source exists, files are copied."""
        result = seed_disk_if_needed(
            seed_source=self.seed_source,
            disk_root=self.disk_root,
        )

        self.assertTrue(result["seeded"], "Expected seeded=True")
        self.assertFalse(result["skipped"])
        self.assertFalse(result["no_source"])
        self.assertGreater(result["files_copied"], 0)

        # Verify files landed on disk
        profile = (
            self.disk_root
            / "03_CLIENT_SYSTEM" / "CLIENTES_ACTIVOS"
            / "ryaanlouis" / "00_ADMIN" / "client_profile.json"
        )
        self.assertTrue(profile.exists(), "client_profile.json should be on disk")

        # Sentinel flag must exist
        self.assertTrue(_seeded_flag(self.disk_root).exists(), ".disk_seeded must be written")

    # ------------------------------------------------------------------
    # Test 2: Existing disk files are NOT overwritten
    # ------------------------------------------------------------------
    def test_existing_disk_files_not_overwritten(self):
        """Files already present on disk before seeding must not be replaced."""
        # Pre-create a file on disk with different content
        existing_dir = (
            self.disk_root
            / "03_CLIENT_SYSTEM" / "CLIENTES_ACTIVOS"
            / "ryaanlouis" / "00_ADMIN"
        )
        existing_dir.mkdir(parents=True)
        existing_file = existing_dir / "client_profile.json"
        original_content = '{"name": "PRESERVED_VALUE"}'
        existing_file.write_text(original_content, encoding="utf-8")

        result = seed_disk_if_needed(
            seed_source=self.seed_source,
            disk_root=self.disk_root,
        )

        self.assertTrue(result["seeded"])
        # The existing file content must be unchanged
        self.assertEqual(
            existing_file.read_text(encoding="utf-8"),
            original_content,
            "Existing disk file must NOT be overwritten by seed",
        )

    # ------------------------------------------------------------------
    # Test 3: .disk_seeded sentinel prevents repeat seeding
    # ------------------------------------------------------------------
    def test_sentinel_prevents_repeat_seeding(self):
        """Second call to seed_disk_if_needed must be a no-op when flag exists."""
        # First call — seeds and writes flag
        first = seed_disk_if_needed(
            seed_source=self.seed_source,
            disk_root=self.disk_root,
        )
        self.assertTrue(first["seeded"])

        # Manually add a canary file to disk that seed source does NOT have
        canary = self.disk_root / "canary.txt"
        canary.write_text("do not delete", encoding="utf-8")

        # Second call — must skip
        second = seed_disk_if_needed(
            seed_source=self.seed_source,
            disk_root=self.disk_root,
        )
        self.assertFalse(second["seeded"])
        self.assertTrue(second["skipped"], "Expected skipped=True on second call")
        self.assertEqual(second["files_copied"], 0)

        # Canary must still be there (no wipe occurred)
        self.assertTrue(canary.exists(), "Canary file must survive second seed call")

    # ------------------------------------------------------------------
    # Test 4: Missing seed source returns gracefully (local dev)
    # ------------------------------------------------------------------
    def test_no_seed_source_returns_gracefully(self):
        """When seed source does not exist, no exception and no_source=True."""
        missing_source = Path(self._tmp) / "nonexistent_git_seed"
        result = seed_disk_if_needed(
            seed_source=missing_source,
            disk_root=self.disk_root,
        )

        self.assertFalse(result["seeded"])
        self.assertFalse(result["skipped"])
        self.assertTrue(result["no_source"])
        self.assertEqual(result["files_copied"], 0)
        # Disk root should NOT have been created
        self.assertFalse(self.disk_root.exists())

    # ------------------------------------------------------------------
    # Test 5: Seed failure is caught, startup continues
    # ------------------------------------------------------------------
    def test_seed_failure_does_not_raise(self):
        """If an unexpected error occurs during copy, function returns gracefully."""
        # Use a seed_source that exists but disk_root points to a file (not dir)
        # → shutil will fail
        blocking_file = Path(self._tmp) / "BRAND_EXPERIENCE_blocked"
        blocking_file.write_text("I am a file, not a directory", encoding="utf-8")

        try:
            result = seed_disk_if_needed(
                seed_source=self.seed_source,
                disk_root=blocking_file,  # invalid: file where dir expected
            )
        except Exception as exc:
            self.fail(f"seed_disk_if_needed raised an exception: {exc}")

        # Must not have raised; result must indicate failure without crash
        self.assertFalse(result["seeded"])
        self.assertFalse(result["skipped"])


if __name__ == "__main__":
    unittest.main()
