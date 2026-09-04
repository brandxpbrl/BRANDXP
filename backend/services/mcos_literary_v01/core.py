from __future__ import annotations

import json
import re
from pathlib import Path

from .canon_loader import load_optional_canon
from .diagnostics import build_diagnostics
from .input_loader import ChapterInput, load_markdown, load_text
from .knowledge_extractor import extract_knowledge
from .narrative_analyzer import analyze_narrative
from .voice_signature import extract_voice_signature


def analyze_chapter(path: str | Path | None = None, text: str | None = None, *, project_root: str | Path = ".") -> dict:
    chapter_input = _load_input(path, text)
    analysis = analyze_narrative(chapter_input.text)
    diagnostics = build_diagnostics(analysis)
    knowledge = extract_knowledge(analysis, diagnostics)
    voice_signature = extract_voice_signature(chapter_input.text)
    canon_context = load_optional_canon(project_root)
    character_context = _character_context(project_root)
    return {
        "mcos_core_version": "0.1",
        "source": chapter_input.source,
        "chapter": analysis["chapter"],
        "scene": analysis["scene"],
        "objects": analysis["objects"],
        "embodiment": analysis["embodiment"],
        "narrative": analysis["narrative"],
        "diagnostics": diagnostics,
        "voice_signature": voice_signature,
        "knowledge": knowledge,
        "canon_context": {key: [{"path": item["path"]} for item in items] for key, items in canon_context.items() if items},
        "character_context": character_context,
    }


def analyze_batch(glob_pattern: str = "docs/MPE_WORLD_CHAPTER_*.md", *, project_root: str | Path = ".", output_dir: str | Path | None = None) -> list[dict]:
    root = Path(project_root); results = []
    for path in sorted(root.glob(glob_pattern), key=_chapter_sort_key):
        if not path.is_file(): continue
        result = analyze_chapter(path, project_root=root); results.append(result)
        if output_dir is not None:
            output_path = Path(output_dir) / f"{path.stem}.analysis.json"
            output_path.parent.mkdir(parents=True, exist_ok=True)
            output_path.write_text(json.dumps(result, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    return results


def _load_input(path: str | Path | None, text: str | None) -> ChapterInput:
    if path and text: raise ValueError("Provide either path or text, not both.")
    if path: return load_markdown(path)
    if text is not None: return load_text(text)
    raise ValueError("Provide a Markdown path or pasted text.")


def _character_context(project_root: str | Path) -> dict:
    root = Path(project_root)
    canon_path = root / "docs" / "MPE_WORLD_CHARACTER_CANON_FELIPE_V1.md"
    return {
        "primary_character": "felipe_founder_v1",
        "character_canon_used": canon_path.exists(),
        "visual_continuity_required": True,
        "character_canon_path": str(canon_path) if canon_path.exists() else "",
    }


def _chapter_sort_key(path: Path) -> tuple[int, str]:
    match = re.search(r"CHAPTER_(\d+)|Cap[ií]tulo\s+(\d+)", path.stem, re.IGNORECASE)
    if match:
        number = next(group for group in match.groups() if group)
        return (int(number), path.name)
    return (9999, path.name)
