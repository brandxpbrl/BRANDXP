"""
disk_seed.py — One-time seeding of a freshly mounted Render Persistent Disk.

How it works
------------
During the Render buildCommand (BEFORE the disk is mounted), the buildCommand
copies the git-tracked BRAND_EXPERIENCE/ folder to a sibling directory called
BRAND_EXPERIENCE_git_seed/.  That sibling is never shadowed by the disk mount.

At process startup, seed_disk_if_needed() is called.  It:
  1. Checks whether a git seed source exists at SEED_SOURCE_PATH.
     If not → local dev or build issue; log and return.
  2. Checks whether the sentinel file .disk_seeded exists inside the mounted
     BRAND_EXPERIENCE/ folder.  If yes → already seeded; return.
  3. Copies every file from the seed source that does NOT already exist on the
     disk (safe merge — never overwrites).
  4. Writes the .disk_seeded sentinel so future restarts skip the step.

Environment variable
--------------------
BRAND_EXPERIENCE_SEED_SOURCE (optional)
    Override the seed source path.  Useful for testing.
    Defaults to <PROJECT_ROOT>/BRAND_EXPERIENCE_git_seed
"""

import logging
import os
import shutil
from pathlib import Path

logger = logging.getLogger(__name__)

# ---------------------------------------------------------------------------
# Path resolution
# ---------------------------------------------------------------------------

_BACKEND_DIR = Path(__file__).resolve().parent.parent   # backend/
_PROJECT_ROOT = _BACKEND_DIR.parent                     # repo root

def _seed_source() -> Path:
    """Return the path of the git-seed copy, overridable via env var."""
    override = os.getenv("BRAND_EXPERIENCE_SEED_SOURCE", "").strip()
    if override:
        return Path(override)
    return _PROJECT_ROOT / "BRAND_EXPERIENCE_git_seed"

def _disk_root() -> Path:
    """Return the live BRAND_EXPERIENCE path (disk-mounted in production)."""
    override = os.getenv("BRAND_EXPERIENCE_ROOT", "").strip()
    if override:
        return Path(override)
    return _PROJECT_ROOT / "BRAND_EXPERIENCE"

def _seeded_flag(disk_root: Path) -> Path:
    return disk_root / ".disk_seeded"

# ---------------------------------------------------------------------------
# Safe file-by-file copy (never overwrites)
# ---------------------------------------------------------------------------

def _safe_copy_tree(src: Path, dst: Path) -> int:
    """
    Recursively copy *src* into *dst*, skipping any file that already exists
    in *dst*.  Directories are created as needed.

    Returns the number of files actually copied.
    """
    copied = 0
    for src_file in src.rglob("*"):
        if not src_file.is_file():
            continue
        rel = src_file.relative_to(src)
        dst_file = dst / rel
        if dst_file.exists():
            continue
        dst_file.parent.mkdir(parents=True, exist_ok=True)
        shutil.copy2(src_file, dst_file)
        copied += 1
    return copied

# ---------------------------------------------------------------------------
# Public API
# ---------------------------------------------------------------------------

def seed_disk_if_needed(
    seed_source: Path | None = None,
    disk_root: Path | None = None,
) -> dict:
    """
    Seed the persistent disk once from the git-seed backup.

    Parameters
    ----------
    seed_source : Path | None
        Override the seed source (default: resolved from env / project root).
    disk_root : Path | None
        Override the disk root (default: resolved from env / project root).

    Returns
    -------
    dict with keys:
        seeded       : bool   — True if files were copied this call
        skipped      : bool   — True if disk was already seeded
        no_source    : bool   — True if no seed source was found
        files_copied : int    — number of files copied (0 when skipped)
        message      : str    — human-readable summary
    """
    src = seed_source if seed_source is not None else _seed_source()
    dst = disk_root if disk_root is not None else _disk_root()
    flag = _seeded_flag(dst)

    # Guard 1 — no seed source (local dev or build issue)
    if not src.exists():
        msg = (
            f"[disk_seed] Seed source not found at '{src}'. "
            "Skipping disk seed (local dev or first Render build without cp step)."
        )
        logger.warning(msg)
        return {"seeded": False, "skipped": False, "no_source": True,
                "files_copied": 0, "message": msg}

    # Guard 2 — already seeded
    if flag.exists():
        msg = f"[disk_seed] Disk already seeded (flag: '{flag}'). Skipping."
        logger.info(msg)
        return {"seeded": False, "skipped": True, "no_source": False,
                "files_copied": 0, "message": msg}

    # Seed
    try:
        dst.mkdir(parents=True, exist_ok=True)
        copied = _safe_copy_tree(src, dst)
        flag.touch()
        msg = (
            f"[disk_seed] Seeded {copied} file(s) from '{src}' → '{dst}'. "
            "Sentinel written."
        )
        logger.info(msg)
        return {"seeded": True, "skipped": False, "no_source": False,
                "files_copied": copied, "message": msg}
    except Exception as exc:
        msg = f"[disk_seed] WARNING — seed failed: {exc}. Continuing startup."
        logger.warning(msg)
        return {"seeded": False, "skipped": False, "no_source": False,
                "files_copied": 0, "message": msg}
