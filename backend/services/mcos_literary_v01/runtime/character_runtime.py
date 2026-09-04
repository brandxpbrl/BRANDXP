from __future__ import annotations

import re
from typing import Any


def build_character_runtime(blueprint: dict[str, Any], character_canon: dict[str, Any]) -> dict[str, Any]:
    character_id = _resolve_character_id(blueprint, character_canon)
    emotions = _emotions_from_curve(blueprint.get("emotional_curve"))
    environment_objects = _merge_objects(blueprint.get("objects"), character_canon.get("environment", {}).get("objects"))
    return {"character_runtime": {
        "chapter": _clean_text(blueprint.get("chapter")),
        "character_id": character_id,
        "canon_version": "v1",
        "canon_source": character_canon.get("_source", "request.character_canon"),
        "role": _clean_text(character_canon.get("role")),
        "identity_lock": {"function": _clean_text(character_canon.get("narrative_identity", {}).get("function")), "core_trait": _clean_text(character_canon.get("narrative_identity", {}).get("core_trait")), "continuity_lock": True},
        "active_state": {
            "age_range": _clean_text(character_canon.get("visual_continuity", {}).get("age_range")),
            "hair": _clean_text(character_canon.get("visual_continuity", {}).get("hair")),
            "clothing": _clean_text(character_canon.get("visual_continuity", {}).get("clothing")),
            "expression": _clean_text(character_canon.get("visual_continuity", {}).get("expression")),
            "posture": _clean_text(character_canon.get("visual_continuity", {}).get("posture")),
            "emotion": emotions,
            "gesture": _clean_text(blueprint.get("gesture")),
            "physical_reaction": _clean_text(blueprint.get("physical_reaction")),
        },
        "behavior_flags": character_canon.get("behavior", {}),
        "environment_context": {
            "primary_location": _clean_text(blueprint.get("environment")),
            "objects": environment_objects,
            "main_object": _clean_text(blueprint.get("main_object")),
            "dominant_symbol": _clean_text(blueprint.get("dominant_symbol")),
            "hidden_question": _clean_text(blueprint.get("hidden_question")),
            "lighting": _clean_text(character_canon.get("environment", {}).get("lighting")),
        },
        "visual_restrictions": _clean_list(character_canon.get("do_not")),
        "scene_continuity": {"opening_scene": _clean_text(blueprint.get("opening_scene")), "ending_image": _clean_text(blueprint.get("ending_image")), "cinematic_seed": _clean_text(blueprint.get("cinematic_seed"))},
        "readiness": {"ready_for_scene_runtime": not _missing_fields(blueprint, character_canon), "ready_for_flow_package": False, "missing": _missing_fields(blueprint, character_canon)},
    }}


def _resolve_character_id(blueprint, character_canon):
    focus = _clean_list(blueprint.get("character_focus")); canon_id = _clean_text(character_canon.get("character_id"))
    if canon_id and canon_id in focus: return canon_id
    return focus[0] if focus else canon_id

def _emotions_from_curve(value):
    text = _clean_text(value)
    if not text: return []
    return [_normalize_token(part) for part in re.split(r"\s*(?:↓|->|→)\s*", text) if _clean_text(part)]
def _merge_objects(scene_objects, canon_objects): return _unique(_clean_list(scene_objects) + _clean_list(canon_objects))
def _missing_fields(blueprint, character_canon):
    missing=[]
    for field in ["chapter","character_focus","gesture","physical_reaction","environment","objects"]:
        if not blueprint.get(field): missing.append(f"blueprint.{field}")
    for field in ["character_id","visual_continuity","do_not"]:
        if not character_canon.get(field): missing.append(f"character_canon.{field}")
    return missing
def _clean_list(value):
    if isinstance(value,list): return [_clean_text(item) for item in value if _clean_text(item)]
    if isinstance(value,str) and value.strip(): return [_clean_text(value)]
    return []
def _clean_text(value):
    if value is None: return ""
    return re.sub(r"\s+"," ",str(value).strip())
def _normalize_token(value):
    text=_clean_text(value).lower()
    for old,new in {"á":"a","é":"e","í":"i","ó":"o","ú":"u","ñ":"n"}.items(): text=text.replace(old,new)
    return text
def _unique(values):
    result=[]; seen=set()
    for value in values:
        key=value.lower()
        if key not in seen: seen.add(key); result.append(value)
    return result
