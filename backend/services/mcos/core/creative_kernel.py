from abc import ABC, abstractmethod
from typing import Dict, Any, Optional

class ConceptSeed(ABC):
    """
    The primordial seed that gives birth to a Creation.
    Could be an Identity, an Idea, a Problem, a Theory, etc.
    """
    def __init__(self, name: str, core_intent: str, metadata: Optional[Dict[str, Any]] = None):
        self.name = name
        self.core_intent = core_intent
        self.metadata = metadata or {}

class Creation(ABC):
    """
    The base class for anything spawned by the Creative Kernel.
    Could be a World, a Framework, a Methodology, a Protocol, etc.
    """
    def __init__(self, creation_id: str, name: str, seed: ConceptSeed):
        self.creation_id = creation_id
        self.name = name
        self.seed = seed
        self.status = "initialized"

class CreativeKernel:
    """
    The absolute core of MCOS. 
    Decides how a Creation (like a World) is born from a ConceptSeed.
    """
    
    @staticmethod
    def spawn_creation(seed: ConceptSeed, creation_type: str = "world") -> Creation:
        """
        Spawns a new Creation based on the provided seed and type.
        """
        from .world_manager import World
        
        # Currently we only support Worlds, but the architecture allows for
        # Frameworks, Methodologies, Companies, etc., in the future.
        if creation_type.lower() == "world":
            creation_id = f"WORLD_{seed.name.upper().replace(' ', '_')}_{hash(seed.core_intent) % 10000}"
            return World(creation_id, seed.name, seed)
        else:
            raise ValueError(f"Creation type '{creation_type}' is not yet supported by the Creative Kernel.")

