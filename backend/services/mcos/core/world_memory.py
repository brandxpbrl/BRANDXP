from typing import Dict, Any, List, Optional
from datetime import datetime

class MemoryBlock:
    """Base class for a block of memory."""
    def __init__(self, data: Dict[str, Any], origin_id: Optional[str] = None):
        self.data = data
        self.origin_id = origin_id
        self.timestamp = datetime.utcnow().isoformat()

class TruthMemory:
    """Stores World Bible, Canon, Timeline, Characters, Places, Objects, Symbols."""
    def __init__(self):
        self.canon: List[MemoryBlock] = []
        self.timeline: List[MemoryBlock] = []
        self.characters: Dict[str, MemoryBlock] = {}
        self.places: Dict[str, MemoryBlock] = {}
        self.objects: Dict[str, MemoryBlock] = {}
        self.symbols: Dict[str, MemoryBlock] = {}

class CraftMemory:
    """Stores Literary Knowledge, Approved Narrative Memory, Visual/Brand/Cinematic Knowledge."""
    def __init__(self):
        self.literary: List[MemoryBlock] = []
        self.narrative: List[MemoryBlock] = []
        self.visual: List[MemoryBlock] = []
        self.brand: List[MemoryBlock] = []
        self.cinematic: List[MemoryBlock] = []

class KnowledgeMemory:
    """Stores generalized knowledge extracted from the world."""
    def __init__(self):
        self.theories: List[MemoryBlock] = []
        self.frameworks: List[MemoryBlock] = []
        self.rules: List[MemoryBlock] = []

class AssetMemory:
    """Stores references to Images, Videos, Prompts, Storyboards, Scenes."""
    def __init__(self):
        self.images: List[MemoryBlock] = []
        self.videos: List[MemoryBlock] = []
        self.prompts: List[MemoryBlock] = []
        self.storyboards: List[MemoryBlock] = []
        self.archive_records: List[MemoryBlock] = []

class ExperienceMemory:
    """Stores past experiences and the intent behind them."""
    def __init__(self):
        self.campaigns: List[MemoryBlock] = []
        self.books: List[MemoryBlock] = []
        self.movies: List[MemoryBlock] = []

class LineageMemory:
    """Stores the origin of every decision. Traceability layer."""
    def __init__(self):
        # Maps an item ID to its lineage trace
        self.traces: Dict[str, List[str]] = {}

    def add_trace(self, item_id: str, origin_id: str, action: str):
        if item_id not in self.traces:
            self.traces[item_id] = []
        trace_record = f"[{datetime.utcnow().isoformat()}] {action} from {origin_id}"
        self.traces[item_id].append(trace_record)

class WorldMemory:
    """
    The unified memory container for a World.
    Memory is organized by World, not files.
    """
    def __init__(self, world_id: str):
        self.world_id = world_id
        self.truth = TruthMemory()
        self.craft = CraftMemory()
        self.knowledge = KnowledgeMemory()
        self.asset = AssetMemory()
        self.experience = ExperienceMemory()
        self.lineage = LineageMemory()

    def get_summary(self) -> Dict[str, Any]:
        """Returns a high-level summary of the World's memory state."""
        return {
            "world_id": self.world_id,
            "canon_entries": len(self.truth.canon),
            "characters": len(self.truth.characters),
            "assets": len(self.asset.images) + len(self.asset.videos),
            "traces": len(self.lineage.traces)
        }
