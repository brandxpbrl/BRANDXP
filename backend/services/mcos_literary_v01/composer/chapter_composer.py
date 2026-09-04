from __future__ import annotations

import json
import re
from pathlib import Path
from typing import Any


PHYSICAL_OBJECTS = {
    "archivo", "bosque", "cafe", "café", "carpeta", "carpetas", "ciudad", "cuaderno", "documento", "documentos", "espejo", "espiral",
    "habitación", "habitacion", "hoja", "hojas", "laboratorio", "lampara", "lámpara", "lapiz", "lápiz", "lluvia", "mesa", "monsefu", "monsefú",
    "papel", "papeles", "patio", "playa", "puerta", "taza", "ventana",
}
PHYSICAL_PLACES = {"aula", "bosque", "buenos aires", "calle", "ciudad", "escritorio", "habitación", "habitacion", "laboratorio", "mesa de trabajo", "monsefu", "monsefú", "patio", "playa"}
BODY_ACTIONS = ("apoya", "camina", "escribe", "inclina", "mira", "respira", "sostiene", "tacha", "toca", "toma", "vuelve")


def compose_file(analysis_path: str | Path, output_dir: str | Path = "outputs/mcos/blueprints") -> Path:
    analysis = json.loads(Path(analysis_path).read_text(encoding="utf-8")); blueprint = compose_chapter_blueprint(analysis); return write_blueprint(blueprint, output_dir)


def compose_chapter_blueprint(analysis: dict[str, Any]) -> dict[str, Any]:
    scene = analysis.get("scene", {}); objects = analysis.get("objects", {}); embodiment = analysis.get("embodiment", {}); narrative = analysis.get("narrative", {}); character_context = analysis.get("character_context", {})
    object_candidates = _split_values(objects.get("main_object")) + _as_list(objects.get("secondary_objects"))
    environment = _select_physical_place(scene.get("location")) or _select_physical_place(scene.get("environment"))
    main_object = _select_physical_object(object_candidates) or _first_value(objects.get("main_object"))
    opening_scene = _first_scene(scene); physical_reaction = _physical_reaction(embodiment, scene)
    gesture = _clean_text(embodiment.get("gesture")) or _gesture_from_action(scene.get("action_main")) or physical_reaction
    dominant_symbol = _first_value(narrative.get("dominant_symbol")); hidden_question = _hidden_question(narrative, dominant_symbol)
    all_objects = _unique([candidate for candidate in object_candidates if _is_physical(candidate)]); character_focus = _character_focus(character_context)
    return {
        "chapter": str(analysis.get("chapter", {}).get("number", "")), "opening_scene": opening_scene, "main_object": main_object,
        "environment": environment or _clean_text(scene.get("location")), "physical_reaction": physical_reaction, "gesture": gesture,
        "dominant_symbol": dominant_symbol, "hidden_question": hidden_question, "emotional_curve": _emotional_curve(embodiment.get("shown_emotion")),
        "ending_image": _ending_image(embodiment, scene), "canon_links": _canon_links(character_focus, environment, all_objects, dominant_symbol),
        "character_focus": character_focus, "objects": all_objects or _unique(object_candidates), "scene_priority": _scene_priority(opening_scene, scene),
        "cinematic_seed": _cinematic_seed(environment, main_object, physical_reaction, embodiment, scene),
    }


def write_blueprint(blueprint: dict[str, Any], output_dir: str | Path = "outputs/mcos/blueprints") -> Path:
    chapter = str(blueprint.get("chapter") or "unknown"); chapter_slug = chapter.zfill(3) if chapter.isdigit() else chapter
    output_path = Path(output_dir) / f"chapter_{chapter_slug}_blueprint.json"; output_path.parent.mkdir(parents=True, exist_ok=True)
    output_path.write_text(json.dumps(blueprint, ensure_ascii=False, indent=2) + "\n", encoding="utf-8"); return output_path

def _as_list(value: Any) -> list[str]:
    if isinstance(value, list): return [_clean_text(item) for item in value if _clean_text(item)]
    if isinstance(value, str): return [_clean_text(value)] if value.strip() else []
    return []
def _split_values(value: Any) -> list[str]:
    if not isinstance(value, str): return _as_list(value)
    return [_clean_text(part) for part in value.split("/") if _clean_text(part)]
def _first_value(value: Any) -> str:
    values = _split_values(value); return values[0] if values else _clean_text(value)
def _clean_text(value: Any) -> str:
    if value is None: return ""
    return re.sub(r"\s+", " ", str(value).strip())
def _normalize(value: str) -> str: return value.lower().strip()
def _is_physical(value: str) -> bool:
    normalized = _normalize(value); return any(term in normalized for term in PHYSICAL_OBJECTS)
def _select_physical_object(candidates: list[str]) -> str:
    for candidate in candidates:
        if _is_physical(candidate): return candidate
    return ""
def _select_physical_place(value: Any) -> str:
    for candidate in _split_values(value):
        normalized = _normalize(candidate)
        if any(place in normalized for place in PHYSICAL_PLACES): return candidate
    return ""
def _first_scene(scene: dict[str, Any]) -> str:
    secondary = _as_list(scene.get("secondary_scenes")); return secondary[0] if secondary else (_clean_text(scene.get("central_scene")) or _clean_text(scene.get("action_main")))
def _physical_reaction(embodiment: dict[str, Any], scene: dict[str, Any]) -> str:
    reaction = _clean_text(embodiment.get("physical_reaction"))
    if reaction: return reaction
    action = _clean_text(scene.get("action_main")); return action or _clean_text(embodiment.get("gesture"))
def _gesture_from_action(action: Any) -> str:
    text = _clean_text(action); return text if any(verb in text.lower() for verb in BODY_ACTIONS) else ""
def _hidden_question(narrative: dict[str, Any], dominant_symbol: str) -> str:
    question = _clean_text(narrative.get("hidden_question"))
    if question and question.endswith("?"): return question
    if question: return f"¿{question.strip('¿?')}?"
    if dominant_symbol: return f"¿Qué insiste detrás de {dominant_symbol}?"
    return "¿Qué permanece sin nombrar?"
def _emotional_curve(shown_emotion: Any) -> str:
    emotions = [_title_span(part) for part in _split_values(shown_emotion)] or ["Observación", "Duda"]
    if "Silencio" not in emotions: emotions.append("Silencio")
    return "\n↓\n".join(emotions)
def _title_span(value: str) -> str: return " ".join(word.capitalize() for word in value.split())
def _ending_image(embodiment: dict[str, Any], scene: dict[str, Any]) -> str:
    environment_response = _split_values(embodiment.get("environment_response")); return environment_response[-1] if environment_response else (_clean_text(scene.get("environment")) or _clean_text(scene.get("central_scene")))
def _character_focus(character_context: dict[str, Any]) -> list[str]:
    primary = _clean_text(character_context.get("primary_character")); return [primary] if primary else []
def _canon_links(characters: list[str], environment: str, objects: list[str], dominant_symbol: str) -> list[str]:
    return _unique(characters + ([environment] if environment else []) + objects + ([dominant_symbol] if dominant_symbol else []))
def _scene_priority(opening_scene: str, scene: dict[str, Any]) -> list[str]:
    return _unique([opening_scene, _clean_text(scene.get("central_scene")), *_as_list(scene.get("secondary_scenes"))])[:5]
def _cinematic_seed(environment: str, main_object: str, physical_reaction: str, embodiment: dict[str, Any], scene: dict[str, Any]) -> str:
    visual_environment = _clean_text(scene.get("environment")) or _clean_text(embodiment.get("environment_response")); parts = [part for part in [environment, main_object, physical_reaction, visual_environment] if part]
    return _truncate_words(" | ".join(parts), 30)
def _truncate_words(text: str, limit: int) -> str:
    words = text.split(); return text if len(words) <= limit else " ".join(words[:limit]).rstrip(" ,.;:") + "..."
def _unique(values: list[str]) -> list[str]:
    result: list[str] = []; seen: set[str] = set()
    for value in values:
        clean = _clean_text(value); key = clean.lower()
        if clean and key not in seen: seen.add(key); result.append(clean)
    return result
