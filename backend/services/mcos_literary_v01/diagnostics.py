from __future__ import annotations

from .text_utils import clamp_score


def build_diagnostics(analysis: dict) -> dict:
    source = analysis["_metrics_source"]
    word_count = max(source["word_count"], 1)
    paragraph_count = max(source["paragraph_count"], 1)
    sensory_density = source["sensory_terms"] / word_count
    abstraction_ratio = source["abstract_terms"] / word_count
    body_density = source["body_terms"] / word_count
    object_density = source["object_terms"] / word_count
    interpretation_timing = analysis["narrative"]["interpretation_timing"]
    explanation_timing = analysis["narrative"]["explanation_position"]
    show_vs_tell = clamp_score((sensory_density + body_density + object_density) * 1800 - abstraction_ratio * 700)
    body_rule = clamp_score(body_density * 2200 + min(source["body_terms"], 12) * 3)
    novel_rule = clamp_score(show_vs_tell * 0.45 + (70 if interpretation_timing in {"middle", "late", "not_detected"} else 35) * 0.25 + (80 if explanation_timing in {"late", "not_detected"} else 40) * 0.20 + (70 if source["question_count"] else 45) * 0.10)
    continuity = clamp_score(55 + min(source["object_terms"], 10) * 3 + min(source["abstract_terms"], 10) * 2)
    embodiment_strength = clamp_score(body_rule * 0.65 + min(source["object_terms"], 12) * 4)
    hidden_question = 100 if analysis["narrative"]["hidden_question"] else 0
    voice_consistency = _voice_consistency(source, paragraph_count)
    rhythm = _rhythm_score(source)
    recommendations = []
    if body_rule < 55: recommendations.append("Add a clearer physical reaction connected to the chapter's main idea.")
    if show_vs_tell < 55: recommendations.append("Ground abstract interpretation in more scene, object, or sensory evidence.")
    if hidden_question < 50: recommendations.append("Surface a hidden question so the chapter leaves narrative pressure.")
    if explanation_timing == "early": recommendations.append("Delay explanation until after the central scene has carried the meaning.")
    score_justifications = {
        "novel_rule_score": _justify(novel_rule, f"show_vs_tell={show_vs_tell}, interpretation_timing={interpretation_timing}, explanation_position={explanation_timing}, questions={source['question_count']}"),
        "body_rule_score": _justify(body_rule, f"body_terms={source['body_terms']} across {word_count} words"),
        "show_vs_tell_score": _justify(show_vs_tell, f"sensory_terms={source['sensory_terms']}, body_terms={source['body_terms']}, object_terms={source['object_terms']}, abstract_terms={source['abstract_terms']}"),
        "sensory_density": _justify(clamp_score(sensory_density * 2500), f"{source['sensory_terms']} sensory markers across {word_count} words"),
        "abstraction_ratio": _justify(clamp_score(abstraction_ratio * 2500), f"{source['abstract_terms']} abstraction markers across {word_count} words"),
        "continuity_score": _justify(continuity, f"object_terms={source['object_terms']}, abstract_terms={source['abstract_terms']}"),
        "voice_consistency": _justify(voice_consistency, f"paragraph_count={source['paragraph_count']}, sentence_count={source['sentence_count']}"),
        "narrative_rhythm": _justify(rhythm, f"paragraph_count={source['paragraph_count']}, sentence_count={source['sentence_count']}, word_count={word_count}"),
    }
    return {
        "novel_rule_score": novel_rule, "body_rule_score": body_rule, "show_vs_tell_score": show_vs_tell,
        "sensory_density": clamp_score(sensory_density * 2500), "abstraction_ratio": clamp_score(abstraction_ratio * 2500),
        "continuity_score": continuity, "object_presence": clamp_score(object_density * 2200 + min(source["object_terms"], 12) * 3),
        "embodiment_strength": embodiment_strength, "hidden_question_presence": hidden_question,
        "interpretation_timing": interpretation_timing, "explanation_timing": explanation_timing,
        "voice_consistency": voice_consistency, "narrative_rhythm": rhythm, "recommendations": recommendations,
        "score_justifications": score_justifications,
    }


def _voice_consistency(source: dict, paragraph_count: int) -> int:
    if paragraph_count < 5: return 35
    short_paragraph_bonus = 25 if source["sentence_count"] >= paragraph_count * 0.65 else 10
    signal_balance = 45 if source["sensory_terms"] and source["abstract_terms"] else 25
    repetition_room = 20 if source["word_count"] / paragraph_count < 45 else 12
    return clamp_score(short_paragraph_bonus + signal_balance + repetition_room)

def _rhythm_score(source: dict) -> int:
    if not source["paragraph_count"]: return 0
    words_per_paragraph = source["word_count"] / source["paragraph_count"]
    if 5 <= words_per_paragraph <= 35: return 85
    if words_per_paragraph <= 55: return 70
    return 50

def _justify(score: int, evidence: str) -> dict:
    return {"score": score, "evidence": evidence}
