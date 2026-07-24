from typing import Dict, List, Optional, Set
from datetime import datetime
from pydantic import BaseModel, Field

class GraphNode(BaseModel):
    """
    A node in the World Graph.
    Can represent anything: a Character, a Symbol, a Chapter, a Prompt, an Image, a Campaign.
    """
    node_id: str
    node_type: str  # e.g., "symbol", "chapter", "prompt", "image", "campaign"
    world_id: str
    name: str
    metadata: Dict[str, str] = Field(default_factory=dict)
    created_at: str = Field(default_factory=lambda: datetime.utcnow().isoformat())

class GraphEdge(BaseModel):
    """
    A directed edge defining the relationship between two nodes.
    e.g., node A (Image) "GENERATED_FROM" node B (Prompt)
          node C (Campaign) "DERIVED_FROM" node D (Chapter)
    """
    edge_id: str
    source_id: str
    target_id: str
    relationship_type: str # e.g., "DERIVED_FROM", "GENERATED_FROM", "INSPIRED_BY", "PART_OF"
    timestamp: str = Field(default_factory=lambda: datetime.utcnow().isoformat())
    metadata: Dict[str, str] = Field(default_factory=dict)

class WorldGraph:
    """
    The Lineage and Connectivity network for a World.
    Tracks how every concept, asset, and experience is connected.
    """
    def __init__(self, world_id: str):
        self.world_id = world_id
        self.nodes: Dict[str, GraphNode] = {}
        # adjacency list mapping source_id -> list of edges originating from it
        self.outgoing_edges: Dict[str, List[GraphEdge]] = {}
        # adjacency list mapping target_id -> list of edges pointing to it
        self.incoming_edges: Dict[str, List[GraphEdge]] = {}

    def add_node(self, node: GraphNode) -> None:
        if node.world_id != self.world_id:
            raise ValueError(f"Node world_id {node.world_id} does not match graph world_id {self.world_id}")
        self.nodes[node.node_id] = node
        if node.node_id not in self.outgoing_edges:
            self.outgoing_edges[node.node_id] = []
        if node.node_id not in self.incoming_edges:
            self.incoming_edges[node.node_id] = []

    def add_edge(self, source_id: str, target_id: str, relationship_type: str, metadata: Optional[Dict[str, str]] = None) -> GraphEdge:
        if source_id not in self.nodes or target_id not in self.nodes:
            raise ValueError("Both source and target nodes must exist in the graph.")
        
        edge_id = f"edge_{source_id}_{relationship_type}_{target_id}_{datetime.utcnow().timestamp()}"
        edge = GraphEdge(
            edge_id=edge_id,
            source_id=source_id,
            target_id=target_id,
            relationship_type=relationship_type,
            metadata=metadata or {}
        )
        
        self.outgoing_edges[source_id].append(edge)
        self.incoming_edges[target_id].append(edge)
        return edge

    def get_ancestors(self, node_id: str, relationship_filter: Optional[str] = None) -> List[GraphNode]:
        """
        Finds all nodes that eventually lead to the given node_id.
        Traverses incoming edges recursively.
        """
        ancestors: Set[str] = set()
        
        def _traverse(current_id: str):
            edges = self.incoming_edges.get(current_id, [])
            for edge in edges:
                if relationship_filter and edge.relationship_type != relationship_filter:
                    continue
                if edge.source_id not in ancestors:
                    ancestors.add(edge.source_id)
                    _traverse(edge.source_id)
                    
        _traverse(node_id)
        return [self.nodes[n_id] for n_id in ancestors]

    def get_descendants(self, node_id: str, relationship_filter: Optional[str] = None) -> List[GraphNode]:
        """
        Finds all nodes that derived from the given node_id.
        Traverses outgoing edges recursively.
        Answers: 'What scenes derived from the double spiral symbol?'
        """
        descendants: Set[str] = set()
        
        def _traverse(current_id: str):
            edges = self.outgoing_edges.get(current_id, [])
            for edge in edges:
                if relationship_filter and edge.relationship_type != relationship_filter:
                    continue
                if edge.target_id not in descendants:
                    descendants.add(edge.target_id)
                    _traverse(edge.target_id)
                    
        _traverse(node_id)
        return [self.nodes[n_id] for n_id in descendants]
