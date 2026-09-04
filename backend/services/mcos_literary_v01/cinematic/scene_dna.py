from __future__ import annotations

import json
import re
from pathlib import Path
from typing import Any

CAMERA_LANGUAGES = {"locked","macro_detail","micro_breathing","slow_pan","slow_push","static_observer","subjective","top_view"}
LIGHTING_SOURCES = {"archive_room","cold_window","neutral","rain_light","sunrise","warm_lamp"}
LOST_ARCHIVES_COLORS = {"amber","archive_black","dust_gold","memory_violet","old_paper","rain_blue","signal_cyan"}
FILM_GRAIN = {"none","light","medium","heavy"}
SCANLINES = {"none","soft","medium"}
DUST = {"none","light","medium","heavy"}
INTERFERENCE = {"none","soft","medium","heavy"}
SYMBOLIC_OBJECT_MAP = {
    "archivo":"memoria organizada","cuaderno":"registro fundacional","espiral":"pregunta que no se cierra","hoja":"archivo fundacional","hojas":"archivo fundacional",
    "lampara":"observacion nocturna","lámpara":"observacion nocturna","lapiz":"herramienta de observacion","lápiz":"herramienta de observacion",
    "lluvia":"presion silenciosa del mundo","mesa":"primer laboratorio cognitivo","papel":"archivo fundacional","papeles":"archivo fundacional",
    "patio":"mundo observado","taza":"retorno cotidiano","ventana":"umbral entre duda y mundo",
}

def build_scene_dna_file(blueprint_path: str | Path, output_dir: str | Path = "outputs/mcos/scene_dna") -> Path:
    blueprint = json.loads(Path(blueprint_path).read_text(encoding="utf-8")); scene_dna = build_scene_dna(blueprint); return write_scene_dna(scene_dna, output_dir)

def build_scene_dna(blueprint: dict[str, Any]) -> dict[str, Any]:
    objects = _clean_list(blueprint.get("objects")); primary_object = _clean_text(blueprint.get("main_object")) or (objects[0] if objects else "")
    dominant_symbol = _clean_text(blueprint.get("dominant_symbol")); environment = _clean_text(blueprint.get("environment")); opening_frame = _clean_text(blueprint.get("opening_scene")); closing_frame = _clean_text(blueprint.get("ending_image")); emotion_parts = _emotions_from_curve(blueprint.get("emotional_curve"))
    camera_language = _camera_language(primary_object, dominant_symbol, blueprint); lighting_source = _lighting_source(blueprint)
    return {
        "scene_identity":{"scene_title":_scene_title(blueprint),"scene_type":_scene_type(blueprint),"dominant_symbol":dominant_symbol,"hidden_question":_clean_text(blueprint.get("hidden_question"))},
        "camera":{"language":camera_language,"movement":_camera_movement(camera_language),"lens":_lens(primary_object,dominant_symbol),"distance":_distance(primary_object,blueprint),"focus_strategy":_focus_strategy(primary_object,dominant_symbol)},
        "lighting":{"main_source":lighting_source,"temperature":_lighting_temperature(lighting_source),"contrast":_contrast(lighting_source),"shadow_profile":_shadow_profile(lighting_source)},
        "color":{"primary_palette":_primary_palette(lighting_source,blueprint),"secondary_palette":_secondary_palette(dominant_symbol,blueprint),"accent":_accent_color(dominant_symbol)},
        "environment":{"physical_location":environment,"symbolic_location":_symbolic_location(environment,primary_object),"weather":_weather(blueprint),"time_of_day":_time_of_day(blueprint)},
        "objects":{"primary":primary_object,"secondary":[obj for obj in objects if obj != primary_object],"symbolic":_symbolic_object(primary_object,dominant_symbol)},
        "movement":{"character_motion":_character_motion(blueprint),"environment_motion":_environment_motion(blueprint),"camera_motion":_camera_movement(camera_language)},
        "archive_texture":{"film_grain":_film_grain(blueprint),"scanlines":_scanlines(blueprint),"dust":_dust(blueprint),"interference":_interference(blueprint)},
        "soundscape":{"ambient":_ambient(blueprint),"silence_level":_silence_level(emotion_parts,blueprint),"key_sound":_key_sound(blueprint)},
        "emotion":{"dominant":emotion_parts[0] if emotion_parts else "observacion","intensity":_emotion_intensity(emotion_parts),"transition":" -> ".join(emotion_parts) if emotion_parts else "observacion -> silencio"},
        "transition":{"opening_frame":opening_frame,"closing_frame":closing_frame,"bridge_to_next_scene":_bridge_to_next_scene(closing_frame,dominant_symbol)},
    }

def write_scene_dna(scene_dna: dict[str, Any], output_dir: str | Path = "outputs/mcos/scene_dna") -> Path:
    chapter = _chapter_from_title(scene_dna["scene_identity"]["scene_title"]); chapter_slug = chapter.zfill(3) if chapter.isdigit() else chapter
    output_path = Path(output_dir) / f"chapter_{chapter_slug}_scene_dna.json"; output_path.parent.mkdir(parents=True, exist_ok=True); output_path.write_text(json.dumps(scene_dna, ensure_ascii=False, indent=2) + "\n", encoding="utf-8"); return output_path

def _scene_title(blueprint):
    chapter = _clean_text(blueprint.get("chapter")) or "unknown"; symbol = _clean_text(blueprint.get("dominant_symbol")) or "scene"; return f"chapter_{chapter}_{_slug(symbol)}"
def _scene_type(blueprint):
    text = _joined_blueprint_text(blueprint)
    if "archivo" in text or "hoja" in text or "papel" in text: return "archive_observation"
    if "ventana" in text or "lluvia" in text: return "threshold_observation"
    return "static_observation"
def _camera_language(primary_object, dominant_symbol, blueprint):
    text = _joined_blueprint_text(blueprint)
    if "espiral" in primary_object.lower() or "espiral" in dominant_symbol.lower(): return "macro_detail"
    if "mesa" in primary_object.lower() or "hoja" in primary_object.lower() or "papel" in primary_object.lower(): return "top_view"
    if "ventana" in text or "lluvia" in text: return "slow_push"
    if "mira" in text: return "static_observer"
    return "locked"
def _camera_movement(language):
    if language in {"locked","top_view","static_observer"}: return "locked"
    if language == "macro_detail": return "micro_breathing"
    return language
def _lens(primary_object, dominant_symbol):
    text = f"{primary_object} {dominant_symbol}".lower()
    if "hoja" in text or "papel" in text or "espiral" in text: return "macro"
    if "mesa" in text: return "normal"
    return "wide"
def _distance(primary_object, blueprint):
    text = f"{primary_object} {_joined_blueprint_text(blueprint)}".lower()
    if "hoja" in text or "papel" in text or "lapiz" in text or "lápiz" in text: return "close"
    if "mesa" in text: return "medium"
    return "wide"
def _focus_strategy(primary_object, dominant_symbol):
    if dominant_symbol: return "symbol_to_object"
    if primary_object: return "object_first"
    return "environment_first"
def _lighting_source(blueprint):
    text = _joined_blueprint_text(blueprint)
    if "lluvia" in text or "ventana" in text: return "rain_light"
    if "lámpara" in text or "lampara" in text: return "warm_lamp"
    if "noche" in text or "archivo" in text: return "archive_room"
    return "neutral"
def _lighting_temperature(source):
    if source == "warm_lamp": return "warm"
    if source in {"cold_window","rain_light"}: return "cold"
    if source == "archive_room": return "mixed"
    return "neutral"
def _contrast(source): return "medium" if source in {"archive_room","rain_light","warm_lamp"} else "soft"
def _shadow_profile(source):
    if source in {"archive_room","warm_lamp"}: return "deep"
    if source == "rain_light": return "soft"
    return "neutral"
def _primary_palette(source, blueprint):
    text = _joined_blueprint_text(blueprint); palette = ["archive_black","old_paper"]
    if source == "rain_light" or "lluvia" in text: palette.append("rain_blue")
    elif source == "warm_lamp": palette.append("amber")
    else: palette.append("dust_gold")
    return palette
def _secondary_palette(dominant_symbol, blueprint):
    text = f"{dominant_symbol} {_joined_blueprint_text(blueprint)}".lower(); palette = ["dust_gold"]
    if "pregunta" in text or "duda" in text: palette.append("memory_violet")
    if "traduccion" in text or "lenguaje" in text or "forma" in text: palette.append("signal_cyan")
    return _unique(palette)
def _accent_color(dominant_symbol):
    if "traduccion" in dominant_symbol.lower() or "lenguaje" in dominant_symbol.lower(): return "signal_cyan"
    if "duda" in dominant_symbol.lower() or "pregunta" in dominant_symbol.lower(): return "memory_violet"
    return "amber"
def _symbolic_location(environment, primary_object):
    text = f"{environment} {primary_object}".lower()
    if "habitacion" in text or "habitación" in text or "mesa" in text: return "primer laboratorio cognitivo"
    if "monsefu" in text or "monsefú" in text or "patio" in text: return "mundo observado"
    if "ciudad" in text or "buenos aires" in text: return "sistema humano visible"
    return "espacio de observacion"
def _weather(blueprint):
    text = _joined_blueprint_text(blueprint)
    if "lluvia" in text: return "rain"
    if "viento" in text: return "wind"
    return "interior_stillness"
def _time_of_day(blueprint):
    text = _joined_blueprint_text(blueprint)
    if "noche" in text or "lámpara" in text or "lampara" in text: return "night"
    if "tarde" in text: return "afternoon"
    if "mañana" in text: return "morning"
    return "unspecified"
def _symbolic_object(primary_object, dominant_symbol):
    object_key = primary_object.lower()
    for token, meaning in SYMBOLIC_OBJECT_MAP.items():
        if token in object_key: return meaning
    return dominant_symbol or "objeto de observacion"
def _character_motion(blueprint):
    text = _clean_text(blueprint.get("gesture")) or _clean_text(blueprint.get("physical_reaction")); lower = text.lower()
    if "tomó" in lower or "tomo" in lower: return "takes_object"
    if "mira" in lower or "mirada" in lower: return "looks"
    if "escribe" in lower: return "writes"
    if "toca" in lower: return "touches_object"
    return "still_observing"
def _environment_motion(blueprint):
    text = _joined_blueprint_text(blueprint)
    if "lluvia" in text: return "rain_on_window"
    if "viento" in text: return "wind"
    if "silencio" in text: return "stillness"
    return "minimal"
def _film_grain(blueprint):
    text = _joined_blueprint_text(blueprint); return "medium" if ("archivo" in text or "papel" in text or "hoja" in text) else "light"
def _scanlines(blueprint):
    text = _joined_blueprint_text(blueprint); return "soft" if ("traduccion" in text or "lenguaje" in text) else "none"
def _dust(blueprint):
    text = _joined_blueprint_text(blueprint); return "medium" if ("archivo" in text or "papel" in text or "hoja" in text) else "light"
def _interference(blueprint):
    text = _joined_blueprint_text(blueprint); return "soft" if ("duda" in text or "sospecha" in text or "pregunta" in text) else "none"
def _ambient(blueprint):
    text = _joined_blueprint_text(blueprint); ambient = []
    if "lluvia" in text: ambient.append("rain_on_window")
    if "papel" in text or "hoja" in text: ambient.append("paper_movement")
    if "lápiz" in text or "lapiz" in text: ambient.append("pencil_on_paper")
    return ambient or ["room_tone"]
def _silence_level(emotion_parts, blueprint):
    text = " ".join(emotion_parts).lower() + " " + _joined_blueprint_text(blueprint)
    if "silencio" in text or "duda" in text or "sospecha" in text: return "high"
    if "curiosidad" in text or "atencion" in text or "atención" in text: return "medium"
    return "low"
def _key_sound(blueprint): return _ambient(blueprint)[0]
def _emotion_intensity(emotions):
    lowered = " ".join(emotions).lower()
    if "sospecha" in lowered or "incomodidad" in lowered: return "medium"
    if "silencio" in lowered and len(emotions) <= 2: return "low"
    return "soft"
def _bridge_to_next_scene(closing_frame, dominant_symbol):
    if dominant_symbol: return f"hold_on_{_slug(dominant_symbol)}"
    if closing_frame: return "hold_on_closing_image"
    return "hard_cut"
def _chapter_from_title(title):
    match = re.match(r"chapter_([^_]+)_", title); return match.group(1) if match else "unknown"
def _joined_blueprint_text(blueprint):
    values = []
    for value in blueprint.values(): values.extend(str(item) for item in value) if isinstance(value,list) else values.append(str(value))
    return " ".join(values).lower()
def _emotions_from_curve(value):
    text = _clean_text(value)
    if not text: return []
    parts = re.split(r"\s*(?:↓|->|→)\s*", text); return [_slug(part).replace("-","_") for part in parts if _clean_text(part)]
def _clean_list(value):
    if isinstance(value,list): return [_clean_text(item) for item in value if _clean_text(item)]
    if isinstance(value,str) and value.strip(): return [_clean_text(value)]
    return []
def _clean_text(value):
    if value is None: return ""
    return re.sub(r"\s+", " ", str(value).strip())
def _slug(value):
    text = _clean_text(value).lower(); replacements = {"á":"a","é":"e","í":"i","ó":"o","ú":"u","ñ":"n"}
    for old,new in replacements.items(): text = text.replace(old,new)
    text = re.sub(r"[^a-z0-9]+", "_", text).strip("_"); return text or "unknown"
def _unique(values):
    result=[]; seen=set()
    for value in values:
        key=value.lower()
        if key not in seen: seen.add(key); result.append(value)
    return result
