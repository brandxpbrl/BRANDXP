"""Vendored MCOS literary runtime v0.1.

Source: user-supplied mcos.zip. Kept isolated from services.mcos World-to-Experience runtime.
"""

from .core import analyze_chapter
from .composer.chapter_composer import compose_chapter_blueprint
from .cinematic.scene_dna import build_scene_dna
from .director.director_notes import render_director_notes
from .runtime.character_runtime import build_character_runtime
from .runtime.scene_runtime import build_scene_runtime

__all__ = [
    "analyze_chapter",
    "compose_chapter_blueprint",
    "build_scene_dna",
    "render_director_notes",
    "build_character_runtime",
    "build_scene_runtime",
]
