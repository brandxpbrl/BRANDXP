from typing import Any, Dict
from datetime import datetime
import json
import os
from pathlib import Path

try:
    from ...ai_client import chat_completion
except ImportError:
    pass # Will be handled if not running from backend
from .base import OutputEngine
from ..runtime.context import RuntimeContext
from ..core.world_graph import WorldGraph, GraphNode

class LiteraryEngine(OutputEngine):
    """
    Translates the World into written, narrative formats: Books, Essays, Manifestos.
    """
    def generate_experience(self, runtime: RuntimeContext, graph: WorldGraph, intent: Dict[str, Any]) -> GraphNode:
        # Load necessary context from intent
        context_files = intent.get("context_files", [])
        prompt_instruction = intent.get("prompt", "Write a chapter.")
        
        context_text = ""
        for filepath in context_files:
            try:
                with open(filepath, "r", encoding="utf-8") as f:
                    context_text += f"\n--- File: {filepath} ---\n{f.read()}\n"
            except Exception as e:
                print(f"Error loading {filepath}: {e}")

        system_prompt = (
            "You are the MCOS Literary Engine. You compose worlds following the 'World-First Paradigm'. "
            "You do not generate content, you generate truth. "
            "Follow the Master Direction document exactly. "
            "Ensure the chapter resolves the required structural questions: What does the protagonist learn? "
            "What object symbolizes it? How does the universe change?"
        )
        
        user_prompt = f"Context:\n{context_text}\n\nTask:\n{prompt_instruction}"
        
        messages = [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt}
        ]
        
        try:
            # We assume chat_completion is available
            ai_response = chat_completion(messages)
            content = ai_response.get("content", "")
        except Exception as e:
            content = f"Error generating chapter via AI: {e}"
            print(content)
            
        output_dir = intent.get("output_dir", "")
        filename = intent.get("filename", f"chapter_{datetime.utcnow().timestamp()}")
        
        if output_dir:
            os.makedirs(output_dir, exist_ok=True)
            out_path = Path(output_dir) / f"{filename}.md"
            out_path.write_text(content, encoding="utf-8")
            
            json_path = Path(output_dir) / f"{filename}.json"
            json_path.write_text(json.dumps({"name": filename, "intent": intent.get("transformation"), "world_id": runtime.world.creation_id}, indent=2), encoding="utf-8")
        
        node_id = f"literary_output_{datetime.utcnow().timestamp()}"
        output_node = GraphNode(
            node_id=node_id,
            node_type="literary_chapter",
            world_id=runtime.world.creation_id,
            name=intent.get("title", "Untitled Literary Piece"),
            metadata={
                "intent": intent.get("transformation", "unknown"),
                "file": str(out_path) if output_dir else "memory"
            }
        )
        graph.add_node(output_node)
        
        if runtime.active_node_id and runtime.active_node_id in graph.nodes:
            graph.add_edge(source_id=runtime.active_node_id, target_id=node_id, relationship_type="GENERATED_INTO")
            
        return output_node

class CinematicEngine(OutputEngine):
    """
    Translates the World into visual and time-based formats: Scenes, Storyboards, Flow Packages.
    """
    def generate_experience(self, runtime: RuntimeContext, graph: WorldGraph, intent: Dict[str, Any]) -> GraphNode:
        node_id = f"cinematic_output_{datetime.utcnow().timestamp()}"
        output_node = GraphNode(
            node_id=node_id,
            node_type="cinematic_scene",
            world_id=runtime.world.creation_id,
            name=intent.get("title", "Untitled Scene"),
            metadata={"intent": intent.get("transformation", "unknown")}
        )
        graph.add_node(output_node)
        
        if runtime.active_node_id and runtime.active_node_id in graph.nodes:
            graph.add_edge(source_id=runtime.active_node_id, target_id=node_id, relationship_type="VISUALIZED_AS")
            
        return output_node

class BrandEngine(OutputEngine):
    """
    Translates the World into persuasive, identity-driven formats: Campaigns, Brand Universes.
    """
    def generate_experience(self, runtime: RuntimeContext, graph: WorldGraph, intent: Dict[str, Any]) -> GraphNode:
        node_id = f"brand_output_{datetime.utcnow().timestamp()}"
        output_node = GraphNode(
            node_id=node_id,
            node_type="brand_campaign",
            world_id=runtime.world.creation_id,
            name=intent.get("title", "Untitled Campaign"),
            metadata={"intent": intent.get("transformation", "unknown")}
        )
        graph.add_node(output_node)
        
        if runtime.active_node_id:
            graph.add_edge(source_id=runtime.active_node_id, target_id=node_id, relationship_type="TRANSLATED_TO_BRAND")
            
        return output_node
