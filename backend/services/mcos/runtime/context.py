from abc import ABC
from typing import Dict, Any, Optional
from datetime import datetime
from ..core.world_manager import World

class RuntimeContext(ABC):
    """
    Base class for all Runtime Contexts in MCOS.
    A runtime context carries the state of the world into the execution engines.
    """
    def __init__(self, world: World, active_node_id: Optional[str] = None):
        self.world = world
        self.active_node_id = active_node_id # The node in the WorldGraph currently being processed
        self.runtime_id = f"runtime_{datetime.utcnow().timestamp()}"
        self.state: Dict[str, Any] = {}

    def update_state(self, key: str, value: Any) -> None:
        self.state[key] = value

    def get_state(self, key: str) -> Any:
        return self.state.get(key)

class WorldRuntime(RuntimeContext):
    """
    Provides context for World-level operations (e.g., generating world bibles, maps, overarching rules).
    """
    def __init__(self, world: World):
        super().__init__(world)
        self.update_state("mode", "world_building")

class CharacterRuntime(RuntimeContext):
    """
    Provides context specifically focused on Character psychology, voice, and relationships.
    """
    def __init__(self, world: World, character_id: str):
        super().__init__(world, active_node_id=character_id)
        self.character_id = character_id
        
        # In a full implementation, this would load the character's specific canon
        # from the WorldMemory.
        self.update_state("focus", "character_development")

class NarrativeRuntime(RuntimeContext):
    """
    Provides context for narrative flow, chapter composition, and scene DNA.
    """
    def __init__(self, world: World, chapter_id: Optional[str] = None):
        super().__init__(world, active_node_id=chapter_id)
        self.chapter_id = chapter_id
        self.update_state("focus", "narrative_progression")

class BrandRuntime(RuntimeContext):
    """
    Provides context for translating world truths into brand campaigns and visual universes.
    """
    def __init__(self, world: World, campaign_id: Optional[str] = None):
        super().__init__(world, active_node_id=campaign_id)
        self.campaign_id = campaign_id
        self.update_state("focus", "brand_experience")
