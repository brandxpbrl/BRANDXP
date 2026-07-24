from abc import ABC, abstractmethod
from typing import Any, Dict
from ..runtime.context import RuntimeContext
from ..core.world_graph import WorldGraph, GraphNode

class OutputEngine(ABC):
    """
    Base class for all MCOS Output Engines.
    An Output Engine is responsible for translating a World's state (via RuntimeContext)
    into a specific medium or experience (Book, Movie, Campaign, etc.).
    """
    
    @abstractmethod
    def generate_experience(self, runtime: RuntimeContext, graph: WorldGraph, intent: Dict[str, Any]) -> GraphNode:
        """
        Takes the runtime context, the world graph, and a specific experience intent,
        and generates an output node representing the result.
        
        Must record lineage in the WorldGraph.
        """
        pass
