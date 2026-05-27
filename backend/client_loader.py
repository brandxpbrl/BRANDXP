from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent
PROJECT_ROOT = BASE_DIR.parent
ALLOWED_CONTEXT_EXTENSIONS = {".json", ".md", ".txt"}
EXCLUDED_CONTEXT_DIRS = {
    ".git",
    ".venv",
    "05_ENTREGAS",
    "06_EXPORTS",
    "__pycache__",
    "board_specs",
    "dist",
    "node_modules",
    "runtime",
    "logs",
    "visuals",
}
EXCLUDED_CONTEXT_NAMES = {
    ".env",
    ".env.local",
    ".env.production",
    "brand_identity_board.json",
    "deliverables_index.json",
    "storytelling_strategy_board.json",
    "visual_universe_board.json",
}
EXCLUDED_CONTEXT_SUFFIXES = {
    ".bin",
    ".db",
    ".exe",
    ".jpeg",
    ".jpg",
    ".log",
    ".mp4",
    ".pdf",
    ".png",
    ".pyc",
    ".tmp",
    ".webp",
    ".zip",
}
MAX_CONTEXT_FILES = 40
MAX_CONTEXT_FILE_BYTES = 256 * 1024
MAX_CONTEXT_CHARS_PER_FILE = 12_000
MAX_CONTEXT_TOTAL_CHARS = 80_000
PRIORITY_CONTEXT_FILES = [
    ("BRAND MEMORY CORE JSON", "02_MEMORY/brand_memory_core.json"),
    ("BRAND MEMORY CORE MASTER", "02_MEMORY/BRAND_MEMORY_CORE_MASTER.md"),
    ("BRAND MEMORY ENTITY CORE", "02_MEMORY/modules/01_ENTITY_CORE.md"),
    ("BRAND MEMORY VISUAL DNA", "02_MEMORY/modules/02_VISUAL_DNA.md"),
    ("BRAND MEMORY STORY ENGINE", "02_MEMORY/modules/05_STORY_ENGINE.md"),
    ("BRAND MEMORY CONTENT ENGINE", "02_MEMORY/modules/06_CONTENT_ENGINE.md"),
    ("BRAND MEMORY AI RESTRICTIONS", "02_MEMORY/modules/08_AI_RESTRICTIONS.md"),
    ("VISUAL DNA ENGINE JSON", "07_VISUAL_DNA_ENGINE/visual_dna_engine.json"),
    ("VISUAL DNA ENGINE MASTER", "07_VISUAL_DNA_ENGINE/VISUAL_DNA_ENGINE_MASTER.md"),
    ("VISUAL DNA COMPOSITION", "07_VISUAL_DNA_ENGINE/modules/02_COMPOSITION_RULES.md"),
    ("VISUAL DNA SIGNATURE", "07_VISUAL_DNA_ENGINE/modules/03_VISUAL_SIGNATURE.md"),
    ("VISUAL DNA PROMPT ENGINE", "07_VISUAL_DNA_ENGINE/modules/06_VISUAL_PROMPT_ENGINE.md"),
    ("VISUAL DNA FORBIDDEN VISUALS", "07_VISUAL_DNA_ENGINE/modules/07_FORBIDDEN_VISUALS.md"),
    ("CONTENT INTELLIGENCE JSON", "08_CONTENT_INTELLIGENCE_ENGINE/content_intelligence_engine.json"),
    ("CONTENT INTELLIGENCE MASTER", "08_CONTENT_INTELLIGENCE_ENGINE/CONTENT_INTELLIGENCE_ENGINE_MASTER.md"),
    ("CONTENT STRATEGY", "08_CONTENT_INTELLIGENCE_ENGINE/modules/01_CONTENT_STRATEGY.md"),
    ("CONTENT FUNNEL SYSTEM", "08_CONTENT_INTELLIGENCE_ENGINE/modules/02_FUNNEL_SYSTEM.md"),
    ("CONTENT HOOK ENGINE", "08_CONTENT_INTELLIGENCE_ENGINE/modules/03_HOOK_ENGINE.md"),
    ("CONTENT CTA ENGINE", "08_CONTENT_INTELLIGENCE_ENGINE/modules/07_CTA_ENGINE.md"),
    ("CONTENT PROMPT ENGINE", "08_CONTENT_INTELLIGENCE_ENGINE/modules/10_CONTENT_PROMPT_ENGINE.md"),
    ("AI AGENT OS JSON", "09_AI_AGENT_OS/ai_agent_os.json"),
    ("AI AGENT OS MASTER", "09_AI_AGENT_OS/AI_AGENT_OS_MASTER.md"),
    ("AI AGENT OS README", "09_AI_AGENT_OS/README.md"),
    ("AI AGENT OS ORCHESTRATION", "09_AI_AGENT_OS/modules/01_ORCHESTRATION_SYSTEM.md"),
    ("AI AGENT OS AGENT ROLES", "09_AI_AGENT_OS/modules/02_AGENT_ROLES.md"),
    ("AI AGENT OS BEHAVIOR RULES", "09_AI_AGENT_OS/modules/03_AGENT_BEHAVIOR_RULES.md"),
    ("AI AGENT OS CONTEXT ROUTING", "09_AI_AGENT_OS/modules/04_CONTEXT_ROUTING.md"),
    ("AI AGENT OS OUTPUT PROTOCOL", "09_AI_AGENT_OS/modules/05_OUTPUT_PROTOCOL.md"),
]

CLIENT_ROOTS = [
    BASE_DIR / "clients",
    BASE_DIR / "entity_bible",
    PROJECT_ROOT / "client_memory",
    PROJECT_ROOT / "BRAND_EXPERIENCE" / "03_CLIENT_SYSTEM" / "CLIENTES_ACTIVOS",
]


def _find_client_path(client_name):
    normalized = client_name.strip().lower()

    for root in CLIENT_ROOTS:
        if not root.exists():
            continue

        direct_path = root / client_name

        if direct_path.exists():
            return direct_path

        for candidate in root.iterdir():
            if candidate.is_dir() and candidate.name.lower() == normalized:
                return candidate

    return None


def _is_context_file(file):
    if not file.is_file():
        return False

    path_parts = {part.casefold() for part in file.parts}
    excluded_dirs = {directory.casefold() for directory in EXCLUDED_CONTEXT_DIRS}

    if path_parts & excluded_dirs:
        return False

    name = file.name.casefold()
    suffix = file.suffix.casefold()

    if name in EXCLUDED_CONTEXT_NAMES:
        return False

    if suffix in EXCLUDED_CONTEXT_SUFFIXES:
        return False

    return suffix in ALLOWED_CONTEXT_EXTENSIONS


def _read_context_file(file):
    try:
        if file.stat().st_size > MAX_CONTEXT_FILE_BYTES:
            return None

        content = file.read_text(encoding="utf-8").strip()
    except (OSError, UnicodeDecodeError):
        return None

    if len(content) > MAX_CONTEXT_CHARS_PER_FILE:
        content = f"{content[:MAX_CONTEXT_CHARS_PER_FILE]}\n\n[Context truncated: file exceeded per-file limit.]"

    return content


def _append_context_section(sections, total_chars, files_loaded, label, file, content):
    if not content:
        return total_chars, files_loaded

    remaining_chars = MAX_CONTEXT_TOTAL_CHARS - total_chars

    if remaining_chars <= 0:
        return total_chars, files_loaded

    if len(content) > remaining_chars:
        content = f"{content[:remaining_chars]}\n\n[Context truncated: total context limit reached.]"

    sections.append(f"# {label}: {file.name}\nPATH: {file.as_posix()}\n\n{content}")
    total_chars += len(content)
    files_loaded += 1
    return total_chars, files_loaded


def load_client_context_bundle(client_name):
    if not client_name:
        return {"context": "", "sources": [], "client_path": None, "engines": {}}

    client_path = _find_client_path(client_name)

    if not client_path:
        return {"context": "", "sources": [], "client_path": None, "engines": {}}

    sections = []
    total_chars = 0
    files_loaded = 0
    loaded_paths = set()
    sources = []
    engines = {
        "brand_memory_core": False,
        "visual_dna_engine": False,
        "content_intelligence_engine": False,
        "ai_agent_os": False,
    }

    for label, relative_path in PRIORITY_CONTEXT_FILES:
        if files_loaded >= MAX_CONTEXT_FILES or total_chars >= MAX_CONTEXT_TOTAL_CHARS:
            break

        file = client_path / relative_path

        if not _is_context_file(file):
            continue

        content = _read_context_file(file)

        if not content:
            continue

        total_chars, files_loaded = _append_context_section(
            sections,
            total_chars,
            files_loaded,
            label,
            file.relative_to(client_path),
            content,
        )
        loaded_paths.add(file.resolve())
        sources.append(relative_path)

        normalized_path = relative_path.replace("\\", "/")
        if normalized_path.startswith("02_MEMORY/"):
            engines["brand_memory_core"] = True
        elif normalized_path.startswith("07_VISUAL_DNA_ENGINE/"):
            engines["visual_dna_engine"] = True
        elif normalized_path.startswith("08_CONTENT_INTELLIGENCE_ENGINE/"):
            engines["content_intelligence_engine"] = True
        elif normalized_path.startswith("09_AI_AGENT_OS/"):
            engines["ai_agent_os"] = True

    for file in sorted(client_path.rglob("*")):
        if files_loaded >= MAX_CONTEXT_FILES or total_chars >= MAX_CONTEXT_TOTAL_CHARS:
            break

        try:
            resolved_file = file.resolve()
        except OSError:
            continue

        if resolved_file in loaded_paths:
            continue

        if not _is_context_file(file):
            continue

        content = _read_context_file(file)

        if not content:
            continue

        label = "CLIENT DATA" if file.suffix.casefold() == ".json" else "CLIENT FILE"
        relative_path = file.relative_to(client_path)
        normalized_path = relative_path.as_posix()
        total_chars, files_loaded = _append_context_section(
            sections,
            total_chars,
            files_loaded,
            label,
            relative_path,
            content,
        )
        sources.append(normalized_path)

        if normalized_path.startswith("09_AI_AGENT_OS/"):
            engines["ai_agent_os"] = True

    return {
        "context": "\n\n".join(sections),
        "sources": sources,
        "client_path": str(client_path),
        "engines": engines,
    }


def load_client(client_name):
    return load_client_context_bundle(client_name)["context"]
