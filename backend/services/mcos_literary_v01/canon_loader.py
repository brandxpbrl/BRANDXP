from __future__ import annotations

from pathlib import Path


CANON_CANDIDATES = {
    "world_bible": ["docs/MPE_WORLD_CANON_BIBLE_BLUEPRINT.md", "docs/MPE_WORLD_CANON_INDEX_V1.md"],
    "novel_rules": [],
    "approved_narrative_memory": [],
}


def load_optional_canon(root: str | Path = ".") -> dict:
    base = Path(root)
    loaded: dict[str, list[dict[str, str]]] = {}
    for key, relative_paths in CANON_CANDIDATES.items():
        loaded[key] = []
        for relative_path in relative_paths:
            path = base / relative_path
            if path.exists():
                loaded[key].append({"path": str(path), "text": path.read_text(encoding="utf-8", errors="replace")})
    return loaded
