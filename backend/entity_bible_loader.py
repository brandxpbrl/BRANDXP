from pathlib import Path


ENTITY_BIBLE_ROOT = Path(__file__).resolve().parent / "entity_bible"

ALLOWED_EXTENSIONS = {".md", ".txt", ".json"}
MAX_FILE_BYTES = 256 * 1024
DEFAULT_MAX_TOTAL_CHARS = 80_000

BLOCKED_NAMES = {
    ".env",
    "node_modules",
    "dist",
    "__pycache__",
    ".venv",
    "venv",
    "logs",
    "05_entregas",
    "board_specs",
    "visuals",
}

BLOCKED_SUFFIXES = {
    ".zip",
    ".py",
    ".png",
    ".jpg",
    ".jpeg",
    ".webp",
    ".gif",
    ".pdf",
    ".mp4",
    ".mov",
    ".avi",
    ".exe",
    ".dll",
    ".bin",
}

AGENT_BIBLE_TARGETS = {
    "branding_agent": [
        "core",
        "knowledge/philosophy",
        "knowledge/perception",
        "knowledge/entity_detection",
    ],
    "psychology_agent": [
        "knowledge/perception",
        "knowledge/visual_psychology",
        "knowledge/luxury",
    ],
    "cinematic_director_agent": [
        "core/visual_language.md",
        "knowledge/visual_psychology",
        "knowledge/luxury",
        "knowledge/visual_psychology/cinematic_composition.md",
    ],
    "content_agent": [
        "core/storytelling_framework.md",
        "core/tone_of_voice.md",
        "knowledge/entity_detection/narrative_essence.md",
    ],
    "strategy_agent": [
        "core/positioning.md",
        "knowledge/luxury/premium_positioning.md",
        "knowledge/perception/perceived_value.md",
    ],
    "instagram_audit_agent": [
        "knowledge/perception",
        "knowledge/perception/visual_authority.md",
        "knowledge/luxury/presence_over_noise.md",
    ],
    "sales_agent": [
        "knowledge/perception/perceived_value.md",
        "knowledge/luxury/luxury_perception.md",
        "knowledge/luxury/premium_positioning.md",
    ],
}

MASTER_BIBLE_TARGETS = [
    "core",
    "core/brand_philosophy.md",
    "core/entity_framework.md",
    "core/storytelling_framework.md",
    "core/positioning.md",
    "core/tone_of_voice.md",
    "knowledge/luxury",
    "knowledge/perception",
]

VISUAL_BOARD_BIBLE_TARGETS = [
    "core/visual_language.md",
    "knowledge/visual_psychology",
    "knowledge/visual_psychology/color_emotion.md",
    "knowledge/visual_psychology/negative_space.md",
    "knowledge/visual_psychology/contrast_psychology.md",
    "knowledge/visual_psychology/cinematic_composition.md",
    "knowledge/luxury/luxury_perception.md",
    "knowledge/entity_detection/visual_archetypes.md",
]


def load_entity_bible_context(max_total_chars=DEFAULT_MAX_TOTAL_CHARS):
    return _render_bible_context(_collect_bible_files(["."], max_total_chars), max_total_chars)


def load_entity_bible_core(max_total_chars=DEFAULT_MAX_TOTAL_CHARS):
    return _render_bible_context(_collect_bible_files(["core"], max_total_chars), max_total_chars)


def load_entity_bible_for_agent(agent_name, max_total_chars=DEFAULT_MAX_TOTAL_CHARS):
    targets = AGENT_BIBLE_TARGETS.get(str(agent_name or "").strip(), ["core"])
    return _render_bible_context(_collect_bible_files(targets, max_total_chars), max_total_chars)


def load_entity_bible_for_master(max_total_chars=DEFAULT_MAX_TOTAL_CHARS):
    return _render_bible_context(_collect_bible_files(MASTER_BIBLE_TARGETS, max_total_chars), max_total_chars)


def load_entity_bible_for_visual_boards(max_total_chars=DEFAULT_MAX_TOTAL_CHARS):
    return _render_bible_context(_collect_bible_files(VISUAL_BOARD_BIBLE_TARGETS, max_total_chars), max_total_chars)


def _is_within_entity_bible_root(path):
    try:
        Path(path).resolve().relative_to(ENTITY_BIBLE_ROOT.resolve())
        return True
    except (OSError, ValueError):
        return False


def _is_allowed_bible_file(path):
    candidate = Path(path)

    try:
        resolved = candidate.resolve()
    except OSError:
        return False

    if not _is_within_entity_bible_root(resolved):
        return False

    if not resolved.is_file():
        return False

    parts = set(resolved.relative_to(ENTITY_BIBLE_ROOT.resolve()).parts)
    if any(part.startswith(".") for part in parts):
        return False

    lowered_parts = {part.lower() for part in parts}
    if lowered_parts & BLOCKED_NAMES:
        return False

    if resolved.name.lower() in BLOCKED_NAMES:
        return False

    suffix = resolved.suffix.lower()
    if suffix not in ALLOWED_EXTENSIONS:
        return False

    if suffix in BLOCKED_SUFFIXES:
        return False

    try:
        if resolved.stat().st_size > MAX_FILE_BYTES:
            return False
    except OSError:
        return False

    return True


def _safe_read_text_file(path):
    candidate = Path(path)
    if not _is_allowed_bible_file(candidate):
        return ""
    return candidate.read_text(encoding="utf-8", errors="replace")


def _collect_bible_files(targets=None, max_total_chars=DEFAULT_MAX_TOTAL_CHARS):
    root = ENTITY_BIBLE_ROOT.resolve()
    if not root.exists() or not root.is_dir():
        return []

    targets = targets or ["."]
    files = []
    seen = set()
    total_chars = 0

    for target in targets:
        candidate = (root / target).resolve()
        if not _is_within_entity_bible_root(candidate):
            continue

        if candidate.is_file():
            candidates = [candidate]
        elif candidate.is_dir():
            candidates = sorted(candidate.rglob("*"))
        else:
            continue

        for file_path in candidates:
            if not _is_allowed_bible_file(file_path):
                continue

            resolved = file_path.resolve()
            if resolved in seen:
                continue

            try:
                estimated_chars = resolved.stat().st_size
            except OSError:
                continue

            if total_chars >= max_total_chars:
                break

            seen.add(resolved)
            files.append(resolved)
            total_chars += estimated_chars

    return sorted(files, key=lambda path: path.relative_to(root).as_posix())


def _render_bible_context(files, max_total_chars=DEFAULT_MAX_TOTAL_CHARS):
    root = ENTITY_BIBLE_ROOT.resolve()
    chunks = []
    total_chars = 0

    for file_path in files:
        content = _safe_read_text_file(file_path)
        if not content:
            continue

        relative_path = file_path.resolve().relative_to(root).as_posix()
        header = f"--- ENTITY_BIBLE_FILE: {relative_path} ---\n\n"
        available_chars = max_total_chars - total_chars - len(header)
        if available_chars <= 0:
            break

        if len(content) > available_chars:
            content = content[:available_chars]

        chunks.append(f"{header}{content.strip()}\n")
        total_chars += len(header) + len(content)

        if total_chars >= max_total_chars:
            break

    return "\n".join(chunks).strip()
