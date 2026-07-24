from __future__ import annotations

from pathlib import Path
from typing import Dict, Any, Optional
import json
import os
import re

from ..core.world_manager import WorldManager, World
from ..core.world_graph import WorldGraph
from .context import WorldRuntime, NarrativeRuntime
from ..engines.engines import LiteraryEngine

MPE_ROOT = Path(r"C:\Users\Bela Tours\OneDrive\Documentos\MPE")
EVOLUTION_REPORT_PATH = MPE_ROOT / "outputs" / "mcos" / "evolution_report.json"
DOCS_ROOT = MPE_ROOT / "docs"
DEFAULT_CHAPTER_FALLBACK = "Chapter 15: La Gramatica Invisible"


def _humanize_slug(slug: str) -> str:
    text = slug.replace("_", " ").strip()
    if not text:
        return ""
    return re.sub(r"\s+", " ", text).title()


def _chapter_number_from_name(name: str) -> Optional[int]:
    match = re.search(r"MPE_WORLD_CHAPTER_(\d+)", name)
    if match:
        return int(match.group(1))
    return None


def _load_chapter_catalog() -> Dict[str, Any]:
    catalog: Dict[str, Any] = {
        "approved_chapters": 0,
        "current_chapter": DEFAULT_CHAPTER_FALLBACK,
        "current_chapter_number": 15,
        "analysis_source": "",
        "chapter_path": "",
    }

    report = None
    if EVOLUTION_REPORT_PATH.exists():
        try:
            report = json.loads(EVOLUTION_REPORT_PATH.read_text(encoding="utf-8"))
        except Exception:
            report = None

    if report:
        chapters = report.get("chapters_analyzed") or []
        if chapters:
            chapter_numbers = sorted({int(ch) for ch in chapters})
            latest_number = chapter_numbers[-1]
            catalog["approved_chapters"] = len(chapter_numbers)
            catalog["current_chapter_number"] = latest_number
            catalog["current_chapter"] = f"Chapter {latest_number}"
            catalog["analysis_source"] = str(EVOLUTION_REPORT_PATH)

    chapter_files = []
    if DOCS_ROOT.exists():
        chapter_files = [
            path for path in DOCS_ROOT.glob("MPE_WORLD_CHAPTER_*.md")
            if _chapter_number_from_name(path.name) is not None
        ]
        if chapter_files:
            latest_file = max(
                chapter_files,
                key=lambda path: (
                    _chapter_number_from_name(path.name) or -1,
                    path.stat().st_mtime,
                ),
            )
            latest_number = _chapter_number_from_name(latest_file.name) or catalog["current_chapter_number"]
            title_slug = re.sub(
                rf"^MPE_WORLD_CHAPTER_{latest_number}_?",
                "",
                latest_file.stem,
                flags=re.IGNORECASE,
            )
            title = _humanize_slug(title_slug)
            catalog["current_chapter_number"] = latest_number
            catalog["current_chapter"] = f"Chapter {latest_number}: {title}" if title else f"Chapter {latest_number}"
            catalog["chapter_path"] = str(latest_file)

            if not catalog["approved_chapters"]:
                unique_numbers = {
                    _chapter_number_from_name(path.name)
                    for path in chapter_files
                    if _chapter_number_from_name(path.name) is not None
                }
                catalog["approved_chapters"] = len(unique_numbers)

    if not catalog["approved_chapters"]:
        catalog["approved_chapters"] = len(chapter_files) or 15

    if not catalog["analysis_source"]:
        catalog["analysis_source"] = catalog["chapter_path"] or str(EVOLUTION_REPORT_PATH if EVOLUTION_REPORT_PATH.exists() else DOCS_ROOT)

    return catalog


class McosRuntimeSession:
    """
    The central brain of MCOS.
    Maintains the state of the active World and orchestrates all AI and Engine calls.
    The UI acts only as a dumb client to this session.
    """
    _instance = None

    @classmethod
    def get_instance(cls):
        if cls._instance is None:
            cls._instance = McosRuntimeSession()
        return cls._instance

    def __init__(self):
        self.world_manager = WorldManager()
        self.active_world: Optional[World] = None
        self.active_graph: Optional[WorldGraph] = None
        self.active_runtime = None

        catalog = _load_chapter_catalog()

        # Extended CurrentSession State
        self.current_world_id: Optional[str] = None
        self.current_chapter: str = catalog["current_chapter"]
        self.current_chapter_number: int = catalog["current_chapter_number"]
        self.current_character: str = "None"
        self.approved_chapters: int = catalog["approved_chapters"]
        self.latest_analysis_source: str = catalog["analysis_source"]

        self.runtime_status: str = "OFFLINE"
        self.loaded_engines = ["LiteraryEngine", "CinematicEngine"]
        self.last_action_payload = {}

    def bootstrap(self):
        """
        The Boot Sequence.
        1. Searches all registered worlds.
        2. Loads the canonical MPE world automatically when available.
        """
        worlds = self.world_manager.get_all_worlds()
        if not worlds:
            return {"status": "needs_selection", "worlds": []}

        if len(worlds) == 1:
            return self.init_session(worlds[0].creation_id)

        preferred = next(
            (
                world for world in worlds
                if world.creation_id == "mpe_world" or world.name.strip().upper() == "MPE WORLD"
            ),
            worlds[0],
        )
        return self.init_session(preferred.creation_id)

    def init_session(self, world_id: str):
        self.runtime_status = "INITIALIZING"
        world = self.world_manager.get_world(world_id)
        if not world:
            self.runtime_status = "ERROR"
            raise ValueError(f"World {world_id} not found")

        catalog = _load_chapter_catalog()

        self.active_world = world
        self.current_world_id = world.creation_id
        self.active_graph = WorldGraph(world_id)
        self.active_runtime = WorldRuntime(world)

        # Load the canonical chapter/evolution context from existing artifacts.
        self.current_chapter = catalog["current_chapter"]
        self.current_chapter_number = catalog["current_chapter_number"]
        self.approved_chapters = catalog["approved_chapters"]
        self.latest_analysis_source = catalog["analysis_source"]

        # Load the runtime registries.
        world.runtime_state = "Active"
        world.approved_chapters = catalog["approved_chapters"]
        world.latest_chapter_title = catalog["current_chapter"]
        world.latest_analysis_source = catalog["analysis_source"]
        world.world_bible["runtime_catalog"] = catalog
        world.timeline["current_state"] = "Synchronized"
        world.timeline["approved_chapters"] = catalog["approved_chapters"]
        world.timeline["latest_chapter"] = catalog["current_chapter"]
        world.timeline["analysis_source"] = catalog["analysis_source"]
        world.memory_registry = {
            "truth": "Loaded",
            "craft": "Loaded",
            "knowledge": "Loaded",
            "experience": "Loaded",
            "lineage": "Tracking",
        }

        self.runtime_status = "READY"
        return self.get_state()

    def get_state(self) -> Dict[str, Any]:
        if not self.active_world or self.runtime_status != "READY":
            return {"active": False, "status": self.runtime_status, "approved_chapters": self.approved_chapters}

        return {
            "active": True,
            "runtime_status": self.runtime_status,
            "current_world": self.active_world.get_status(),
            "current_chapter": self.current_chapter,
            "current_chapter_number": self.current_chapter_number,
            "current_character": self.current_character,
            "current_canon": self.active_world.canon_version,
            "current_timeline": self.active_world.timeline["current_state"],
            "memory_status": self.active_world.memory_registry,
            "loaded_engines": self.loaded_engines,
            "last_payload": self.last_action_payload,
            "approved_chapters": self.approved_chapters,
            "analysis_source": self.latest_analysis_source,
        }

    def execute_command(self, action: str, payload: Dict[str, Any]) -> Dict[str, Any]:
        if not self.active_world or self.runtime_status != "READY":
            raise ValueError("Runtime not READY.")

        result = {}

        if action == "narrative.analyze":
            self.active_runtime = NarrativeRuntime(self.active_world, chapter_id=self.current_chapter)
            result = {
                "analysis": f"Analysis of {self.current_chapter}:\n1. Character Arc: Approaching threshold.\n2. Plot: Rising tension."
            }

        elif action == "narrative.blueprint":
            result = {
                "blueprint": f"Blueprint (post {self.current_chapter}):\n- Learn: Truth of geometry\n- Catalyze: Anomaly\n- Symbol: Crystal"
            }

        elif action == "narrative.generate":
            blueprint = payload.get("blueprint")

            base_dir = r"C:\\Users\\Bela Tours\\OneDrive\\Documentos\\MPE"
            master_dir = os.path.join(base_dir, "mcos", "MPE_WORLD_MASTER_DIRECTION.md")

            intent = {
                "title": "Chapter 16 (Generated via Session)",
                "transformation": "The protagonist experiences the first contact through geometry.",
                "prompt": f"Write next chapter using this blueprint:\n{blueprint}",
                "context_files": [master_dir] if os.path.exists(master_dir) else [],
                "output_dir": os.path.join(base_dir, "docs"),
                "filename": "MPE_WORLD_CHAPTER_16_GENERATED_BY_MCOS",
            }

            engine = LiteraryEngine()
            node = engine.generate_experience(self.active_runtime, self.active_graph, intent)

            # Update Current Chapter state to the newly generated one
            self.current_chapter = intent["title"]

            file_path = os.path.join(base_dir, "docs", "MPE_WORLD_CHAPTER_16_GENERATED_BY_MCOS.md")
            content = "Chapter generated, but could not be read."
            if os.path.exists(file_path):
                with open(file_path, "r", encoding="utf-8") as f:
                    content = f.read()

            result = {"generated_content": content, "node_id": node.node_id}
        else:
            raise ValueError(f"Unknown action: {action}")

        self.last_action_payload = result
        return result


# Global Session instance
session = McosRuntimeSession.get_instance()
