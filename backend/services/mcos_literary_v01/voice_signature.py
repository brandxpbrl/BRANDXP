from __future__ import annotations

from collections import Counter

from . import lexicon
from .text_utils import keyword_count, normalized_words, paragraphs, sentences


def extract_voice_signature(text: str) -> dict:
    sentence_list = sentences(text)
    paragraph_list = [p for p in paragraphs(text) if not p.startswith("#")]
    word_count = len(normalized_words(text))
    sentence_count = max(len(sentence_list), 1)
    paragraph_count = max(len(paragraph_list), 1)
    repetition_patterns = []
    lowered = text.lower()
    for marker in lexicon.REPETITION_MARKERS:
        count = lowered.count(marker)
        if count:
            repetition_patterns.append({"pattern": marker, "count": count})
    scene_terms = keyword_count(text, lexicon.SENSORY_TERMS | lexicon.BODY_TERMS | lexicon.OBJECT_TERMS)
    abstract_terms = keyword_count(text, lexicon.ABSTRACT_TERMS)
    body_terms = keyword_count(text, lexicon.BODY_TERMS)
    return {
        "sentence_cadence": _cadence_label(word_count / sentence_count),
        "paragraph_rhythm": _paragraph_label(word_count / paragraph_count),
        "repetition_patterns": sorted(repetition_patterns, key=lambda item: item["count"], reverse=True),
        "silence_usage": _silence_usage(paragraph_count, word_count),
        "abstraction_level": _level_label(abstract_terms / max(word_count, 1)),
        "sensory_density": _level_label(keyword_count(text, lexicon.SENSORY_TERMS) / max(word_count, 1)),
        "descriptive_level": _level_label(scene_terms / max(word_count, 1)),
        "scene_reflection_relation": _relation_label(scene_terms, abstract_terms),
        "body_idea_relation": _relation_label(body_terms, abstract_terms),
        "top_terms": Counter(normalized_words(text)).most_common(12),
    }


def _cadence_label(words_per_sentence: float) -> str:
    if words_per_sentence < 10: return "short / fragmentary"
    if words_per_sentence < 22: return "measured"
    return "long / reflective"

def _paragraph_label(words_per_paragraph: float) -> str:
    if words_per_paragraph < 12: return "staccato short paragraphs"
    if words_per_paragraph < 35: return "short reflective paragraphs"
    return "dense paragraphs"

def _silence_usage(paragraph_count: int, word_count: int) -> str:
    if word_count / max(paragraph_count, 1) < 15: return "high: frequent line breaks create pauses"
    if word_count / max(paragraph_count, 1) < 35: return "medium: regular paragraph pauses"
    return "low: dense blocks carry the rhythm"

def _level_label(ratio: float) -> str:
    if ratio > 0.055: return "high"
    if ratio > 0.025: return "medium"
    return "low"

def _relation_label(scene_terms: int, abstract_terms: int) -> str:
    if abstract_terms == 0 and scene_terms: return "scene-led"
    if scene_terms >= abstract_terms * 2: return "scene-led"
    if scene_terms >= abstract_terms: return "balanced"
    return "reflection-led"
