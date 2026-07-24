from typing import Dict, Any, List
from ..runtime.context import RuntimeContext
from ..core.world_memory import MemoryBlock
from ..core.world_graph import WorldGraph

class KnowledgeExtractor:
    """
    Extracts knowledge from approved Canon (e.g. analyzed chapters) and 
    integrates it into the WorldMemory.
    """
    
    @staticmethod
    def extract_from_analysis(runtime: RuntimeContext, graph: WorldGraph, source_node_id: str, analysis: Dict[str, Any], diagnostics: Dict[str, Any]) -> None:
        """
        Extracts patterns and decisions from a canonical analysis and injects them 
        into the Craft and Knowledge memory layers.
        Records lineage via the WorldGraph.
        """
        successful_patterns = []
        patterns_to_avoid = []
        narrative_decisions = []
        reusable_resources = []

        # Safe extraction (in case structure varies)
        narrative = analysis.get("narrative", {})
        objects = analysis.get("objects", {})
        embodiment = analysis.get("embodiment", {})
        scene = analysis.get("scene", {})

        opening = narrative.get("opening_strategy")
        closing = narrative.get("closing_strategy")
        main_object = objects.get("main_object")
        hidden_question = narrative.get("hidden_question")
        physical_reaction = embodiment.get("physical_reaction")

        if opening:
            successful_patterns.append(f"Opening strategy: {opening}")
            narrative_decisions.append("Begin from a concrete narrative posture before abstract synthesis.")
        if closing:
            successful_patterns.append(f"Closing strategy: {closing}")
        if main_object:
            successful_patterns.append(f"Object-led meaning anchored by '{main_object}'.")
            reusable_resources.append(main_object)
        if physical_reaction:
            successful_patterns.append("Important ideas are connected to visible body or gesture evidence.")
            narrative_decisions.append("Let the body register the thought before the chapter explains it.")
        if hidden_question:
            successful_patterns.append("A hidden question preserves forward pressure.")

        abs_ratio = diagnostics.get("abstraction_ratio", 0)
        show_tell = diagnostics.get("show_vs_tell_score", 100)
        expl_timing = diagnostics.get("explanation_timing")
        body_score = diagnostics.get("body_rule_score", 100)

        if abs_ratio > 70 and show_tell < 60:
            patterns_to_avoid.append("Do not let abstract terms outrun scene, body, and object evidence.")
        if expl_timing == "early":
            patterns_to_avoid.append("Avoid explaining the thesis before the scene has created pressure.")
        if body_score < 55:
            patterns_to_avoid.append("Avoid purely mental interpretation without a physical reaction.")

        secondary = objects.get("secondary_objects", [])
        reusable_resources.extend(secondary[:5])
        
        for item in [narrative.get("dominant_symbol"), scene.get("location"), scene.get("time_of_day")]:
            if item:
                reusable_resources.append(item)

        # Inject into World Memory (Craft & Knowledge)
        memory = runtime.world.memory
        
        # Knowledge Memory (Theories/Rules)
        for pattern in set(successful_patterns):
            memory.knowledge.rules.append(MemoryBlock({"type": "successful_pattern", "content": pattern}, origin_id=source_node_id))
            
        for pattern in set(patterns_to_avoid):
            memory.knowledge.rules.append(MemoryBlock({"type": "pattern_to_avoid", "content": pattern}, origin_id=source_node_id))
            
        # Craft Memory (Narrative/Literary)
        for decision in set(narrative_decisions):
            memory.craft.narrative.append(MemoryBlock({"type": "narrative_decision", "content": decision}, origin_id=source_node_id))
            
        # Track Lineage in WorldGraph (Knowledge node derived from Chapter node)
        knowledge_node_id = f"knowledge_{source_node_id}_{hash(str(successful_patterns))}"
        # In a full implementation, we would register this knowledge node in the Graph,
        # then add an edge: graph.add_edge(source_id=source_node_id, target_id=knowledge_node_id, relationship_type="EXTRACTED_INTO")
        
        # Also track lineage in traditional memory
        memory.lineage.add_trace(item_id=knowledge_node_id, origin_id=source_node_id, action="Extracted narrative knowledge")
