from __future__ import annotations

import re
from typing import Any


def build_scene_runtime(character_runtime_payload: dict[str, Any], scene_dna: dict[str, Any], director_notes: str, director_notes_path: str = "") -> dict[str, Any]:
    character_runtime = character_runtime_payload.get("character_runtime", character_runtime_payload)
    chapter = _clean_text(character_runtime.get("chapter")) or _chapter_from_scene_dna(scene_dna)
    missing = _missing_runtime_inputs(character_runtime, scene_dna, director_notes)
    return {"scene_runtime": {
        "chapter": chapter,
        "scene_id": f"chapter_{chapter.zfill(3) if chapter.isdigit() else chapter}_scene_runtime_v1",
        "runtime_version": "0.1",
        "inputs": {"character_runtime": True, "scene_dna": True, "director_notes": bool(director_notes.strip()), "director_notes_path": director_notes_path},
        "scene_identity": scene_dna.get("scene_identity", {}),
        "character_runtime": character_runtime,
        "physical_layer": {
            "location": scene_dna.get("environment", {}).get("physical_location", ""),
            "primary_object": scene_dna.get("objects", {}).get("primary", ""),
            "secondary_objects": scene_dna.get("objects", {}).get("secondary", []),
            "character_motion": scene_dna.get("movement", {}).get("character_motion", ""),
            "environment_motion": scene_dna.get("movement", {}).get("environment_motion", ""),
        },
        "symbolic_layer": {
            "location": scene_dna.get("environment", {}).get("symbolic_location", ""),
            "object": scene_dna.get("objects", {}).get("symbolic", ""),
            "dominant_symbol": scene_dna.get("scene_identity", {}).get("dominant_symbol", ""),
            "hidden_question": scene_dna.get("scene_identity", {}).get("hidden_question", ""),
        },
        "camera": scene_dna.get("camera", {}), "lighting": scene_dna.get("lighting", {}), "palette": scene_dna.get("color", {}),
        "sound": scene_dna.get("soundscape", {}), "texture": scene_dna.get("archive_texture", {}), "emotion": scene_dna.get("emotion", {}), "transition": scene_dna.get("transition", {}),
        "restrictions": {"visual": character_runtime.get("visual_restrictions", []), "director_forbidden_elements": _extract_forbidden_elements(director_notes)},
        "readiness": {"ready_for_flow_package": not missing, "missing": missing, "blocking_reason": "" if not missing else "scene_runtime_inputs_incomplete"},
    }}


def _missing_runtime_inputs(character_runtime, scene_dna, director_notes):
    missing=[]
    if not character_runtime.get("readiness", {}).get("ready_for_scene_runtime"): missing.append("character_runtime.ready_for_scene_runtime")
    for section in ["scene_identity","camera","lighting","color","environment","objects","movement","transition"]:
        if not scene_dna.get(section): missing.append(f"scene_dna.{section}")
    if not director_notes.strip(): missing.append("director_notes")
    return missing

def _extract_forbidden_elements(director_notes):
    lines=director_notes.splitlines(); forbidden=[]; capture=False
    for line in lines:
        if line.strip()=="## Forbidden Elements": capture=True; continue
        if capture and line.startswith("## "): break
        if capture and line.strip().startswith("- "): forbidden.append(line.strip()[2:])
    return forbidden
def _chapter_from_scene_dna(scene_dna):
    title=_clean_text(scene_dna.get("scene_identity",{}).get("scene_title")); match=re.match(r"chapter_([^_]+)_", title); return match.group(1) if match else "unknown"
def _clean_text(value):
    if value is None: return ""
    return re.sub(r"\s+"," ",str(value).strip())
