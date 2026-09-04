from __future__ import annotations


def extract_knowledge(analysis: dict, diagnostics: dict) -> dict:
    successful_patterns = []
    patterns_to_avoid = []
    narrative_decisions = []
    reusable_resources = []

    opening = analysis["narrative"]["opening_strategy"]
    closing = analysis["narrative"]["closing_strategy"]
    main_object = analysis["objects"]["main_object"]
    hidden_question = analysis["narrative"]["hidden_question"]
    physical_reaction = analysis["embodiment"]["physical_reaction"]

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

    if diagnostics["abstraction_ratio"] > 70 and diagnostics["show_vs_tell_score"] < 60:
        patterns_to_avoid.append("Do not let abstract terms outrun scene, body, and object evidence.")
    if diagnostics["explanation_timing"] == "early":
        patterns_to_avoid.append("Avoid explaining the thesis before the scene has created pressure.")
    if diagnostics["body_rule_score"] < 55:
        patterns_to_avoid.append("Avoid purely mental interpretation without a physical reaction.")

    reusable_resources.extend(analysis["objects"]["secondary_objects"][:5])
    reusable_resources.extend(
        item for item in [analysis["narrative"]["dominant_symbol"], analysis["scene"]["location"], analysis["scene"]["time_of_day"]] if item
    )

    return {
        "successful_patterns": _unique(successful_patterns),
        "patterns_to_avoid": _unique(patterns_to_avoid),
        "narrative_decisions": _unique(narrative_decisions),
        "reusable_resources": _unique(reusable_resources),
    }


def _unique(values: list[str]) -> list[str]:
    seen = set()
    result = []
    for value in values:
        if value and value not in seen:
            seen.add(value)
            result.append(value)
    return result
