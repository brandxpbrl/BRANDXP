from __future__ import annotations

from dataclasses import dataclass
from pathlib import Path


@dataclass(frozen=True)
class ChapterInput:
    source: str
    text: str


def resolve_chapter_path(path: str | Path) -> Path:
    candidate = Path(path)
    if candidate.exists():
        return candidate
    name = candidate.name
    if "CHAPTER_0" in name:
        normalized_name = name.replace("CHAPTER_0", "CHAPTER_")
        normalized = candidate.with_name(normalized_name)
        if normalized.exists():
            return normalized
    raise FileNotFoundError(f"Chapter input not found: {path}")


def load_markdown(path: str | Path) -> ChapterInput:
    resolved = resolve_chapter_path(path)
    return ChapterInput(source=str(resolved), text=resolved.read_text(encoding="utf-8"))


def load_text(text: str, source: str = "pasted_text") -> ChapterInput:
    return ChapterInput(source=source, text=text)
