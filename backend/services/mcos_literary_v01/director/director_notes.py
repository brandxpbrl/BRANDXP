from __future__ import annotations

import re
from typing import Any


def render_director_notes(scene_dna: dict[str, Any]) -> str:
    identity=scene_dna.get("scene_identity",{}); camera=scene_dna.get("camera",{}); lighting=scene_dna.get("lighting",{}); color=scene_dna.get("color",{}); environment=scene_dna.get("environment",{}); objects=scene_dna.get("objects",{}); movement=scene_dna.get("movement",{}); texture=scene_dna.get("archive_texture",{}); soundscape=scene_dna.get("soundscape",{}); emotion=scene_dna.get("emotion",{}); transition=scene_dna.get("transition",{})
    lines=[
        f"# MCOS Director Notes — {_value(identity,'scene_title')}","","## Scene Identity",f"- Scene title: {_value(identity,'scene_title')}",f"- Scene type: {_value(identity,'scene_type')}",f"- Dominant symbol: {_value(identity,'dominant_symbol')}",f"- Hidden question: {_value(identity,'hidden_question')}","",
        "## Narrative Purpose",f"- Purpose: {_narrative_purpose(identity)}","- MCOS Novel Rule: show the visual consequence before interpretation.","- MCOS Body Rule: keep the idea attached to visible body or object behavior.","",
        "## Emotional Arc",f"- Dominant emotion: {_value(emotion,'dominant')}",f"- Intensity: {_value(emotion,'intensity')}",f"- Transition: {_value(emotion,'transition')}","",
        "## Camera Direction",f"- Language: {_value(camera,'language')}",f"- Focus strategy: {_value(camera,'focus_strategy')}","","## Lens Recommendation",f"- Lens: {_value(camera,'lens')}",f"- Distance: {_value(camera,'distance')}","",
        "## Camera Movement",f"- Movement: {_value(camera,'movement')}",f"- Camera motion: {_value(movement,'camera_motion')}","","## Framing",f"- Primary frame priority: {_value(objects,'primary')}",f"- Physical location: {_value(environment,'physical_location')}",f"- Symbolic location: {_value(environment,'symbolic_location')}","",
        "## Lighting",f"- Main source: {_value(lighting,'main_source')}",f"- Temperature: {_value(lighting,'temperature')}",f"- Contrast: {_value(lighting,'contrast')}",f"- Shadow profile: {_value(lighting,'shadow_profile')}","",
        "## Color Palette",f"- Primary palette: {_join(color.get('primary_palette'))}",f"- Secondary palette: {_join(color.get('secondary_palette'))}",f"- Accent: {_value(color,'accent')}","- Lost Archives Style: use only the listed palette values.","",
        "## Environment",f"- Physical layer: {_value(environment,'physical_location')}",f"- Symbolic layer: {_value(environment,'symbolic_location')}",f"- Weather: {_value(environment,'weather')}",f"- Time of day: {_value(environment,'time_of_day')}","",
        "## Object Priority",f"- Primary object: {_value(objects,'primary')}",f"- Secondary objects: {_join(objects.get('secondary'))}",f"- Symbolic object layer: {_value(objects,'symbolic')}","",
        "## Character Behavior",f"- Character motion: {_value(movement,'character_motion')}","- Character Canon: restrained, observant, non-heroic, physically grounded.","","## Environmental Movement",f"- Environment motion: {_value(movement,'environment_motion')}","",
        "## Sound Design",f"- Ambient: {_join(soundscape.get('ambient'))}",f"- Silence level: {_value(soundscape,'silence_level')}",f"- Key sound: {_value(soundscape,'key_sound')}","","## Texture",f"- Film grain: {_value(texture,'film_grain')}",f"- Dust: {_value(texture,'dust')}","",
        "## Archive Effects",f"- Scanlines: {_value(texture,'scanlines')}",f"- Interference: {_value(texture,'interference')}","- Lost Archives Style: analog memory, restrained signal, no decorative excess.","","## Editing Rhythm",f"- Rhythm: {_editing_rhythm(camera,soundscape,emotion)}","",
        "## Hold Frames",f"- Opening frame: {_value(transition,'opening_frame')}",f"- Closing frame: {_value(transition,'closing_frame')}","","## Forbidden Elements","- Do not add new canon.","- Do not add heroic posing.","- Do not add futuristic laboratory language unless present in Scene DNA.","- Do not change the listed palette.","- Do not replace physical objects with abstract explanations.","",
        "## Final Emotional State",f"- Final state: {_final_emotional_state(emotion)}","","## Bridge to Next Scene",f"- Bridge: {_value(transition,'bridge_to_next_scene')}","",
    ]
    return "\n".join(lines)


def _narrative_purpose(identity):
    parts=[_value(identity,"scene_type"),_value(identity,"dominant_symbol"),_value(identity,"hidden_question")]; return " / ".join(part for part in parts if part and part!="unspecified")
def _editing_rhythm(camera,soundscape,emotion):
    movement=_value(camera,"movement"); silence=_value(soundscape,"silence_level"); intensity=_value(emotion,"intensity")
    if movement=="locked" and silence=="high": return "slow_hold"
    if intensity=="medium": return "measured"
    return "quiet"
def _final_emotional_state(emotion):
    transition=_value(emotion,"transition"); return transition.split("->")[-1].strip() if "->" in transition else _value(emotion,"dominant")
def _value(mapping,key):
    value=mapping.get(key,"")
    if isinstance(value,list): return _join(value)
    text=str(value).strip(); return re.sub(r"\s+"," ",text) if text else "unspecified"
def _join(value):
    if isinstance(value,list):
        items=[str(item).strip() for item in value if str(item).strip()]; return ", ".join(items) if items else "unspecified"
    text=str(value).strip(); return text if text else "unspecified"
