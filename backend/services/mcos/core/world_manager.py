from typing import Dict, Any, Optional, List
from .world_memory import WorldMemory
from .creative_kernel import ConceptSeed, Creation

class World(Creation):
    """
    A World Registry Entry in MCOS.
    Encapsulates its own full registry of metadata, memory, characters, and assets.
    """
    def __init__(self, creation_id: str, name: str, seed: ConceptSeed):
        super().__init__(creation_id, name, seed)
        # World Registry structure
        self.world_bible: Dict[str, Any] = {}
        self.canon_version: str = "v1.0"
        self.timeline: Dict[str, Any] = {"current_state": "Idle", "events": []}
        self.character_registry: Dict[str, Any] = {}
        self.asset_registry: Dict[str, Any] = {}
        self.approved_chapters: int = 0
        self.latest_chapter_title: str = ""
        self.latest_analysis_source: str = ""
        
        # Memory Registry
        self.memory = WorldMemory(self.creation_id)
        self.memory_registry: Dict[str, str] = {
            "truth": "Offline",
            "craft": "Offline",
            "knowledge": "Offline",
            "experience": "Offline",
            "lineage": "Offline"
        }
        
        self.experience_registry: Dict[str, Any] = {}
        self.runtime_state: str = "Registered"
        
    def get_status(self) -> Dict[str, Any]:
        return {
            "world_id": self.creation_id,
            "name": self.name,
            "status": self.status,
            "core_intent": self.seed.core_intent,
            "canon_version": self.canon_version,
            "runtime_state": self.runtime_state,
            "memory_registry": self.memory_registry,
            "character_count": len(self.character_registry),
            "asset_count": len(self.asset_registry),
            "approved_chapters": self.approved_chapters,
            "latest_chapter_title": self.latest_chapter_title,
            "timeline_state": self.timeline.get("current_state", "Idle"),
        }

class WorldManager:
    """
    Manages the lifecycle of Worlds within the ecosystem.
    Acts as the World Registry Manager.
    """
    def __init__(self):
        # In a production environment, this would interface with the Database/Filesystem
        self._active_worlds: Dict[str, World] = {}
        
    def register_world(self, world: World) -> None:
        """Registers a new world in the manager."""
        self._active_worlds[world.creation_id] = world
        
    def get_world(self, world_id: str) -> Optional[World]:
        """Retrieves a world by its ID."""
        return self._active_worlds.get(world_id)
        
    def list_active_worlds(self) -> List[Dict[str, Any]]:
        """Lists all currently active worlds."""
        return [w.get_status() for w in self._active_worlds.values()]
    
    def get_all_worlds(self) -> List[World]:
        return list(self._active_worlds.values())
