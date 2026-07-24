from typing import List, Dict, Any
from ..runtime.context import RuntimeContext
from ..core.world_graph import WorldGraph, GraphNode
from ..engines.base import OutputEngine

class ExperienceOrchestrator:
    """
    Coordinates multi-engine pipelines based on a single user intent.
    Instead of calling engines manually, a user specifies the transformation they want,
    and the Orchestrator chains the engines together.
    """
    
    def __init__(self, engines: Dict[str, OutputEngine]):
        """
        Initializes the orchestrator with available engines.
        """
        self.engines = engines
        
    def execute_pipeline(self, pipeline: List[str], runtime: RuntimeContext, graph: WorldGraph, intent: Dict[str, Any]) -> List[GraphNode]:
        """
        Executes a sequence of engines. 
        Each engine's output becomes the context for the next engine in the pipeline.
        
        Example pipeline: ["narrative", "character", "cinematic", "brand"]
        """
        generated_nodes = []
        current_runtime = runtime
        
        for engine_name in pipeline:
            if engine_name not in self.engines:
                raise ValueError(f"Engine '{engine_name}' is not registered with the Orchestrator.")
                
            engine = self.engines[engine_name]
            
            # Execute the engine
            output_node = engine.generate_experience(current_runtime, graph, intent)
            generated_nodes.append(output_node)
            
            # Update the runtime's active node to point to this newly generated node
            # so the next engine in the pipeline knows what it is deriving from.
            current_runtime.active_node_id = output_node.node_id
            
        return generated_nodes
