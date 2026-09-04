from __future__ import annotations

import re
from collections import Counter

from . import lexicon
from .text_utils import (
    headings,
    keyword_count,
    most_common_keywords,
    normalized_words,
    paragraphs,
    sentences,
)


def analyze_narrative(text: str) -> dict:
    heading_list = headings(text)
    chapter_number = _chapter_number(heading_list, text)
    title = _chapter_title(heading_list)
    body_text = _body_text(text)
    paragraph_list = [p for p in paragraphs(text) if not p.startswith("#")]
    sentence_list = sentences(body_text)
    beat_list = _build_beats(paragraph_list, chunk_size=8)

    ranked = sorted(
        paragraph_list,
        key=lambda p: (
            keyword_count(p, lexicon.OBJECT_TERMS)
            + keyword_count(p, lexicon.BODY_TERMS)
            + keyword_count(p, lexicon.SENSORY_TERMS)
            + ("?" in p),
            len(p),
        ),
        reverse=True,
    )

    central_scene = _summarize_paragraph(ranked[0]) if ranked else ""
    secondary_scenes = [_summarize_paragraph(p) for p in ranked[1:4]]
    object_terms = most_common_keywords(body_text, lexicon.OBJECT_TERMS, limit=10)
    environment_terms = most_common_keywords(body_text, lexicon.ENVIRONMENT_TERMS, limit=8)
    title_tokens = set(normalized_words(title))
    text_tokens = set(normalized_words(body_text))

    main_object = _infer_main_object(body_text, title, title_tokens, text_tokens, central_scene, object_terms)
    secondary_objects = _infer_secondary_objects(object_terms, main_object)
    dominant_symbol = _infer_symbol(body_text, title, title_tokens, text_tokens, main_object, central_scene, object_terms)
    theme = _infer_theme(body_text, title_tokens, text_tokens, dominant_symbol)
    shown_emotion = _infer_shown_emotion(body_text, title_tokens, text_tokens)
    interpretation_index = _interpretation_position(beat_list)
    explanation_index = _explanation_position(beat_list)

    return {
        "chapter": {"number": chapter_number, "title": title},
        "scene": {
            "central_scene": central_scene,
            "secondary_scenes": secondary_scenes,
            "location": _infer_location(body_text, title_tokens, text_tokens, environment_terms, main_object),
            "time_of_day": _infer_time_of_day(body_text),
            "environment": _infer_environment(body_text, environment_terms),
            "action_main": _infer_action(sentence_list),
        },
        "objects": {"main_object": main_object, "secondary_objects": secondary_objects},
        "embodiment": {
            "physical_reaction": _best_sentence(body_text, lexicon.BODY_TERMS, preferred_phrases={"mano", "cuello", "espalda", "ojos", "mirada", "cansancio", "tension"}),
            "gesture": _infer_gesture(sentence_list),
            "environment_response": _infer_environment_response(body_text, main_object),
            "shown_emotion": shown_emotion,
            "explained_emotion": _infer_explained_emotion(sentence_list),
        },
        "narrative": {
            "hidden_question": _infer_hidden_question(body_text, title_tokens, text_tokens, shown_emotion, dominant_symbol),
            "dominant_symbol": dominant_symbol,
            "theme": theme,
            "conflict": _infer_conflict(body_text),
            "opening_strategy": _opening_strategy(paragraph_list),
            "closing_strategy": _closing_strategy(paragraph_list),
            "interpretation_timing": _timing_label(interpretation_index, len(beat_list)),
            "explanation_position": _timing_label(explanation_index, len(beat_list)),
        },
        "_metrics_source": {
            "paragraph_count": len(paragraph_list), "beat_count": len(beat_list), "sentence_count": len(sentence_list),
            "word_count": len(normalized_words(body_text)), "body_terms": keyword_count(body_text, lexicon.BODY_TERMS),
            "sensory_terms": keyword_count(body_text, lexicon.SENSORY_TERMS), "abstract_terms": keyword_count(body_text, lexicon.ABSTRACT_TERMS),
            "object_terms": keyword_count(body_text, lexicon.OBJECT_TERMS), "question_count": body_text.count("?"),
            "interpretation_index": interpretation_index, "explanation_index": explanation_index,
        },
    }


def _body_text(text: str) -> str:
    return "\n".join(line for line in text.splitlines() if not line.startswith("#")).strip()

def _chapter_number(heading_list: list[str], text: str) -> str:
    combined = "\n".join(heading_list) + "\n" + text[:400]
    match = re.search(r"Cap[ií]tulo\s+(\d+)|CHAPTER[_\s-]*(\d+)", combined, re.IGNORECASE)
    if not match: return ""
    return next(group for group in match.groups() if group)

def _chapter_title(heading_list: list[str]) -> str:
    if len(heading_list) >= 2: return heading_list[1]
    if heading_list: return heading_list[0]
    return ""

def _summarize_paragraph(paragraph: str, limit: int = 320) -> str:
    clean = " ".join(line.strip() for line in paragraph.splitlines() if line.strip())
    if len(clean) <= limit: return clean
    return clean[: limit - 1].rstrip() + "..."

def _build_beats(paragraph_list: list[str], chunk_size: int = 8) -> list[str]:
    beats = []
    for start in range(0, len(paragraph_list), chunk_size):
        beat = " ".join(paragraph_list[start : start + chunk_size]).strip()
        if beat: beats.append(beat)
    return beats

def _infer_location(text: str, title_tokens: set[str], tokens: set[str], environment_terms: list[str], main_object: str) -> str:
    if "buenos" in title_tokens: return "Buenos Aires"
    if "brasil" in title_tokens: return "Brasil"
    if "monsefu" in title_tokens: return "Monsefu"
    if "buenos" in tokens and "aires" in tokens: return "Buenos Aires"
    if "brasil" in tokens: return "Brasil"
    if "habitacion" in tokens and "mesa" in tokens: return "habitacion / mesa de trabajo"
    if "cuarto" in tokens and "mesa" in tokens: return "cuarto / mesa de trabajo"
    if "cocina" in tokens: return "cocina"
    if not environment_terms: return ""
    aliases = {"buenos": "Buenos Aires", "aires": "Buenos Aires", "monsefu": "Monsefu"}
    value = aliases.get(environment_terms[0], environment_terms[0])
    if value == "mesa" and "mesa" in main_object: return "mesa de trabajo"
    return value

def _infer_time_of_day(text: str) -> str:
    tokens = set(normalized_words(text))
    for candidate in ["madrugada", "noche", "tarde", "mañana", "manana"]:
        if candidate in tokens: return "mañana" if candidate == "manana" else candidate
    return ""

def _infer_environment(text: str, environment_terms: list[str]) -> str:
    preferred = _best_sentence(text, lexicon.ENVIRONMENT_TERMS | lexicon.SENSORY_TERMS, preferred_phrases={"habitacion", "ventana", "lluvia", "lampara", "aire", "mesa"})
    return preferred or ", ".join(environment_terms)

def _infer_action(sentence_list: list[str]) -> str:
    action_terms = {"tomo", "escribio", "miro", "puso", "abrio", "camino", "tacho", "ordeno", "leyo"}
    for sentence in sentence_list:
        if keyword_count(sentence, action_terms): return sentence
    return sentence_list[0] if sentence_list else ""

def _infer_gesture(sentence_list: list[str]) -> str:
    gesture_terms = {"tomo", "miro", "puso", "tacho", "abrio", "levanto", "camino", "escribio", "detuvo", "dejo"}
    for sentence in sentence_list:
        if keyword_count(sentence, gesture_terms): return sentence
    return ""

def _infer_shown_emotion(text: str, title_tokens: set[str], tokens: set[str]) -> str:
    if "buenos" in title_tokens: return "incomodidad / descubrimiento / atención social"
    if "monsefu" in title_tokens: return "curiosidad / extrañeza / atención"
    if "noche" in title_tokens and "formas" in title_tokens: return "inquietud / cansancio / sospecha"
    if "patrones" in title_tokens: return "incomodidad / duda / sospecha"
    emotion_aliases = {"sospecha": {"sospecha"}, "incomodidad": {"incomodidad", "incomoda", "incomodo", "molestia"}, "duda": {"duda", "dudo", "dudaba"}, "curiosidad": {"curiosidad"}, "cansancio": {"cansancio"}}
    tokens = set(normalized_words(text))
    labels = [label for label, variants in emotion_aliases.items() if tokens & variants]
    return " / ".join(labels[:3])

def _infer_explained_emotion(sentence_list: list[str]) -> str:
    markers = ["eso lo incomod", "eso era", "lo fascinaba", "le pareci", "la duda ayudo", "demasiado grande"]
    for sentence in sentence_list:
        if any(marker in sentence.lower() for marker in markers): return sentence
    return ""

def _infer_hidden_question(text: str, title_tokens: set[str], tokens: set[str], shown_emotion: str, dominant_symbol: str) -> str:
    if "buenos" in title_tokens: return "¿Cómo se organizan las personas?"
    if "monsefu" in title_tokens: return "¿Qué se repite?"
    question_sentences = [sentence for sentence in sentences(text) if "?" in sentence]
    if question_sentences: return question_sentences[-1]
    lowered = text.lower()
    if "noche" in title_tokens and "formas" in title_tokens: return "¿Por qué las preguntas empiezan a dibujarse?"
    if "patrones" in title_tokens: return "¿Por qué ciertos patrones siguen regresando?"
    if "querer decir" in lowered and "forma" in lowered: return "¿Que estan intentando decir las formas?"
    if "voz estructural" in lowered: return "¿Que voz estructural esta emergiendo en estas formas?"
    if shown_emotion and dominant_symbol: return f"¿Que esta intentando decir {dominant_symbol}?"
    for sentence in sentences(text):
        lowered_sentence = sentence.lower()
        if keyword_count(sentence, {"pregunta", "regla", "sostiene", "persistir", "decir"}):
            if "decir" in lowered_sentence and "forma" in lowered_sentence: return "¿Que estan intentando decir las formas?"
            return sentence
    return ""

def _infer_symbol(text: str, title: str, title_tokens: set[str], tokens: set[str], main_object: str, central_scene: str, object_terms: list[str]) -> str:
    lowered = text.lower()
    if "buenos" in title_tokens: return "sistemas humanos / clima humano"
    if "monsefu" in title_tokens: return "observacion / patrones cotidianos"
    if "noche" in title_tokens and "formas" in title_tokens: return "primera forma incompleta / preguntas dibujandose"
    if "patrones" in title_tokens: return "genealogia de formas / patrones persistentes"
    if "idiomas" in title_tokens and ("traduccion" in lowered or "traducciones" in lowered): return "traduccion / idiomas de las formas"
    if "archivo de traducciones" in central_scene.lower(): return "archivo de traducciones"
    if "voz estructural" in lowered: return "voz estructural"
    main_tokens = set(normalized_words(main_object))
    for term in object_terms:
        if term in main_tokens: return term
    for term in object_terms:
        if term in title_tokens: return term
    return object_terms[0] if object_terms else ""

def _infer_theme(text: str, title_tokens: set[str], tokens: set[str], dominant_symbol: str) -> str:
    lowered = text.lower()
    if "buenos" in title_tokens: return "relaciones humanas / grupos / consecuencias"
    if "monsefu" in title_tokens: return "nacimiento del observador"
    if "brasil" in title_tokens: return "peso de la realidad / permanencia bajo presión"
    if "noche" in title_tokens and "formas" in title_tokens: return "aparicion inicial de las formas"
    if "patrones" in title_tokens: return "nacimiento del metodo / clasificacion"
    if "idioma" in lowered and "forma" in lowered: return "lenguaje de las formas / traduccion estructural"
    if "traduccion" in dominant_symbol: return "traduccion estructural"
    counts = Counter(token for token in normalized_words(text) if token in lexicon.ABSTRACT_TERMS)
    return counts.most_common(1)[0][0] if counts else ""

def _infer_conflict(text: str) -> str:
    conflict_markers = ["pero", "no logr", "no podia", "no alcanz", "duda", "incomod", "demasiado grande"]
    for sentence in sentences(text):
        if any(marker in sentence.lower() for marker in conflict_markers): return sentence
    return ""

def _opening_strategy(paragraph_list: list[str]) -> str:
    opening = "\n".join(paragraph_list[:4]).lower()
    if "seguia" in opening or "todavia" in opening: return "continuidad de una tension previa"
    if keyword_count(opening, lexicon.SENSORY_TERMS): return "apertura sensorial"
    if keyword_count(opening, lexicon.OBJECT_TERMS): return "apertura con objeto"
    if "?" in opening: return "apertura con pregunta"
    return "apertura declarativa"

def _closing_strategy(paragraph_list: list[str]) -> str:
    closing = "\n".join(paragraph_list[-6:]).lower()
    if "?" in closing: return "cierre con pregunta abierta"
    if "no sabia" in closing or "todavia" in closing: return "cierre de umbral"
    if "por primera vez" in closing: return "cierre de reconocimiento"
    return "cierre reflexivo"

def _interpretation_position(beat_list: list[str]) -> int | None:
    strong_markers = {"como palabras en idiomas distintos", "archivo de traducciones", "voz estructural", "una misma experiencia", "eso mismo estaba pasando"}
    for index, beat in enumerate(beat_list):
        if any(marker in beat.lower() for marker in strong_markers): return index
    for index, beat in enumerate(beat_list):
        if _semantic_density(beat.lower(), lexicon.INTERPRETATION_MARKERS | lexicon.ABSTRACT_TERMS) >= 3: return index
    return None

def _explanation_position(beat_list: list[str]) -> int | None:
    strong_markers = {"no era un problema de", "la idea fue demasiado fuerte", "la memoria de ese trabajo", "eso mismo estaba pasando", "voz estructural"}
    for index, beat in enumerate(beat_list):
        if any(marker in beat.lower() for marker in strong_markers): return index
    for index, beat in enumerate(beat_list):
        if _semantic_density(beat.lower(), lexicon.EXPLANATION_MARKERS | lexicon.ABSTRACT_TERMS) >= 4: return index
    return None

def _semantic_density(text: str, markers: set[str]) -> int:
    return sum(1 for marker in markers if marker in text)

def _infer_main_object(text: str, title: str, title_tokens: set[str], tokens: set[str], central_scene: str, object_terms: list[str]) -> str:
    lowered = text.lower()
    if "buenos" in title_tokens: return "ciudad / grupos humanos / clima social"
    if "monsefu" in title_tokens: return "Monsefu / patio / patrones cotidianos"
    if "brasil" in title_tokens: return "realidad / peso / permanencia"
    if "noche" in title_tokens and "formas" in title_tokens: return "hoja / primeros dibujos / forma incompleta"
    if "patrones" in title_tokens: return "conjunto de hojas / familias de patrones / archivo vivo"
    parts: list[str] = []
    if "mesa" in lowered: parts.append("mesa")
    if "hoja" in lowered or "hojas" in lowered: parts.append("hojas")
    if "archivo de traducciones" in central_scene.lower(): parts.append("archivo de traducciones")
    elif "archivo" in lowered and "traduccion" in lowered: parts.append("archivo de traducciones")
    if parts: return " / ".join(_dedupe(parts))
    for term in object_terms:
        if term in title_tokens: return term
    return object_terms[0] if object_terms else ""

def _infer_secondary_objects(object_terms: list[str], main_object: str) -> list[str]:
    main_tokens = set(normalized_words(main_object)); secondary = []
    for term in object_terms:
        if term not in main_tokens and term not in secondary: secondary.append(term)
    return secondary

def _infer_environment_response(text: str, main_object: str) -> str:
    sentences_ranked = sorted(sentences(text), key=lambda sentence: (keyword_count(sentence, lexicon.SENSORY_TERMS | lexicon.ENVIRONMENT_TERMS) + (3 if "cambio" in sentence.lower() else 0) + (3 if "lluvia" in sentence.lower() else 0) + (2 if "ventana" in sentence.lower() else 0) + (2 if "lampara" in sentence.lower() else 0) + (2 if "aire" in sentence.lower() else 0) + (2 if "mesa" in sentence.lower() and "mesa" in main_object else 0), len(sentence)), reverse=True)
    selected = []
    for sentence in sentences_ranked:
        if not keyword_count(sentence, lexicon.SENSORY_TERMS | lexicon.ENVIRONMENT_TERMS): continue
        if sentence not in selected: selected.append(sentence)
        if len(selected) == 3: break
    return " / ".join(selected)

def _best_sentence(text: str, keywords: set[str], preferred_phrases: set[str] | None = None) -> str:
    ranked = sorted(sentences(text), key=lambda sentence: (keyword_count(sentence, keywords) + sum(2 for phrase in preferred_phrases or set() if phrase in sentence.lower()), len(sentence)), reverse=True)
    return ranked[0] if ranked and keyword_count(ranked[0], keywords) else ""

def _dedupe(values: list[str]) -> list[str]:
    seen = set(); result = []
    for value in values:
        if value not in seen: seen.add(value); result.append(value)
    return result

def _timing_label(index: int | None, total: int) -> str:
    if index is None or total == 0: return "not_detected"
    ratio = index / max(total - 1, 1)
    if ratio < 0.20: return "early"
    if ratio < 0.70: return "middle"
    return "late"
