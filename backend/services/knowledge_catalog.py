"""Read-only access to the original Entity Bible with source provenance."""

import hashlib
import re
import unicodedata
from pathlib import Path


PROJECT_ROOT = Path(__file__).resolve().parents[2]
SOURCE_ROOT = PROJECT_ROOT / "BRAND_EXPERIENCE_OS" / "KNOWLEDGE" / "ENTITY_BIBLE"
ACTIVE_ROOT = PROJECT_ROOT / "backend" / "entity_bible" / "knowledge"
CORE_SOURCE = PROJECT_ROOT / "BRAND_EXPERIENCE_OS" / "CORE"
CORE_ACTIVE = PROJECT_ROOT / "backend" / "entity_bible" / "core"
MAX_SOURCE_BYTES = 64 * 1024
MAX_RESULTS = 6
STOP_WORDS = {"para", "como", "esta", "este", "sobre", "brand", "marca", "cliente", "with", "from", "the"}


def _normalize(value):
    folded = unicodedata.normalize("NFKD", str(value or ""))
    return "".join(char for char in folded if not unicodedata.combining(char)).lower()


def _terms(value):
    return {term for term in re.findall(r"[a-z0-9]{3,}", _normalize(value)) if term not in STOP_WORDS}


def _documents():
    if not SOURCE_ROOT.is_dir():
        return []
    root = SOURCE_ROOT.resolve()
    files = []
    for path in sorted(root.rglob("*.md")):
        try:
            resolved = path.resolve()
            resolved.relative_to(root)
            if resolved.is_file() and resolved.stat().st_size <= MAX_SOURCE_BYTES:
                files.append(resolved)
        except (OSError, ValueError):
            continue
    return files


def _matching_copies(source_root, active_root):
    if not source_root.is_dir() or not active_root.is_dir():
        return 0, 0
    copies = 0
    identical = 0
    for active in active_root.rglob("*.md"):
        relative = active.relative_to(active_root)
        source = source_root / relative
        copies += 1
        if source.is_file() and active.read_bytes() == source.read_bytes():
            identical += 1
    return copies, identical


def knowledge_status():
    knowledge_copies, knowledge_identical = _matching_copies(SOURCE_ROOT, ACTIVE_ROOT)
    core_copies, core_identical = _matching_copies(CORE_SOURCE, CORE_ACTIVE)
    return {
        "source_documents": len(_documents()),
        "active_core_files": core_copies,
        "identical_core_files": core_identical,
        "active_knowledge_files": knowledge_copies,
        "identical_knowledge_files": knowledge_identical,
        "retrieval": "keyword",
        "vector_index_used": False,
    }


def search_knowledge(query, limit=4):
    terms = _terms(query)
    if not terms:
        return []
    limit = max(1, min(int(limit), MAX_RESULTS))
    matches = []
    for path in _documents():
        relative = path.relative_to(SOURCE_ROOT.resolve()).as_posix()
        try:
            content = path.read_text(encoding="utf-8")
        except (OSError, UnicodeDecodeError):
            continue
        normalized = _normalize(content)
        path_terms = _terms(relative.replace("_", " ").replace("/", " "))
        hits = sum(min(normalized.count(term), 3) for term in terms)
        score = hits + 3 * len(terms & path_terms)
        if not score:
            continue
        first = min((normalized.find(term) for term in terms if term in normalized), default=0)
        start = max(0, first - 120)
        snippet = content[start:start + 540].strip()
        matches.append({
            "source": f"BRAND_EXPERIENCE_OS/KNOWLEDGE/ENTITY_BIBLE/{relative}",
            "category": relative.split("/", 1)[0],
            "sha256": hashlib.sha256(content.encode("utf-8")).hexdigest()[:12],
            "score": score,
            "excerpt": snippet,
        })
    return sorted(matches, key=lambda item: (-item["score"], item["source"]))[:limit]
