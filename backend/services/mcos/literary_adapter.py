from __future__ import annotations

import re
from dataclasses import dataclass
from typing import Any


LITERARY_ADAPTER_VERSION = "0.2"
LITERARY_BOUNDARIES = [
    "SOURCE_TEXT_IS_OBSERVATION_NOT_CANON",
    "GENERATED_BLUEPRINT_IS_PROPOSED_NOT_CANON",
    "DIAGNOSTICS_ARE_HEURISTIC_NOT_TRUTH",
    "MCOS_ADAPTER_DOES_NOT_PROMOTE_EPISTEMIC_STATUS",
    "CHARACTER_RUNTIME_REQUIRES_DECLARED_CANON",
    "SCENE_RUNTIME_IS_COMPILED_REPRESENTATION_NOT_OBSERVED_REALITY",
]

try:
    from services.mcos_literary_v01 import (
        analyze_chapter as _mcos_analyze_chapter,
        build_character_runtime as _mcos_build_character_runtime,
        build_scene_dna as _mcos_build_scene_dna,
        build_scene_runtime as _mcos_build_scene_runtime,
        compose_chapter_blueprint as _mcos_compose_blueprint,
        render_director_notes as _mcos_render_director_notes,
    )
    VENDORED_MCOS_AVAILABLE = True
    VENDORED_MCOS_ERROR = ""
except Exception as exc:  # Safe capability boundary: backend must still boot.
    VENDORED_MCOS_AVAILABLE = False
    VENDORED_MCOS_ERROR = type(exc).__name__


BODY_TERMS = {"mano", "manos", "mirada", "ojos", "pecho", "espalda", "cuello", "cuerpo", "respira", "respirar", "tension"}
OBJECT_TERMS = {"archivo", "cuaderno", "documento", "espejo", "hoja", "papel", "mesa", "puerta", "ventana", "taza", "lapiz", "lampara", "espiral"}
THEME_TERMS = {"memoria", "identidad", "posibilidad", "persistencia", "relacion", "patron", "lenguaje", "traduccion", "conciencia", "evolucion"}
SENSORY_TERMS = {"luz", "sombra", "silencio", "sonido", "ruido", "calor", "frio", "lluvia", "vidrio", "noche", "aire"}
ABSTRACT_TERMS = {"sistema", "teoria", "metodo", "estructura", "identidad", "posibilidad", "persistencia", "canon", "regla", "patron", "relacion", "lenguaje"}


@dataclass(frozen=True)
class LiteraryAdapterRequest:
    text: str
    source: str = "MPE_LITERATURE_UI"
    chapter: str = ""
    knowledge_context: list[dict[str, Any]] | None = None
    character_canon: dict[str, Any] | None = None


def build_literary_analysis(request: LiteraryAdapterRequest) -> dict[str, Any]:
    text = request.text.strip()
    if not text:
        raise ValueError("text is required")
    if VENDORED_MCOS_AVAILABLE:
        return _build_vendored_pipeline(request)
    return _build_contract_fallback(request)


def _build_vendored_pipeline(request: LiteraryAdapterRequest) -> dict[str, Any]:
    analysis = _mcos_analyze_chapter(text=request.text)
    if request.chapter and not analysis.get("chapter", {}).get("number"):
        analysis.setdefault("chapter", {})["number"] = request.chapter

    blueprint = _mcos_compose_blueprint(analysis)
    scene_dna = _mcos_build_scene_dna(blueprint)
    director_notes = _mcos_render_director_notes(scene_dna)

    character_canon = dict(request.character_canon or {})
    canon_declared = bool(character_canon.get("character_id"))
    if character_canon:
        character_canon.setdefault("_source", "REQUEST_CHARACTER_CANON")
    character_runtime = _mcos_build_character_runtime(blueprint, character_canon)
    scene_runtime = _mcos_build_scene_runtime(character_runtime, scene_dna, director_notes)

    knowledge = request.knowledge_context or []
    provenance = [
        {"source": request.source, "status": "SOURCE"},
        {"source": "USER_SUPPLIED_MCOS_ZIP::v0.1", "status": "SOURCE"},
        *[
            {"source": item.get("source", "ENTITY_BIBLE"), "status": item.get("status", "SOURCE")}
            for item in knowledge
        ],
    ]
    if canon_declared:
        provenance.append({"source": character_canon.get("_source", "REQUEST_CHARACTER_CANON"), "status": "CANON"})

    analysis["knowledge_context"] = knowledge
    character_missing = character_runtime.get("character_runtime", {}).get("readiness", {}).get("missing", [])
    scene_missing = scene_runtime.get("scene_runtime", {}).get("readiness", {}).get("missing", [])

    return {
        "status": "ok",
        "adapter": {
            "name": "MPE_MCOS_LITERARY_ADAPTER",
            "version": LITERARY_ADAPTER_VERSION,
            "mode": "VENDORED_MCOS_V0_1",
            "full_mcos_pipeline_active": True,
            "source_runtime": "user_supplied_mcos.zip",
        },
        "analysis": analysis,
        "blueprint": blueprint,
        "scene_dna": scene_dna,
        "director_notes": director_notes,
        "character_runtime": character_runtime,
        "scene_runtime": scene_runtime,
        "provenance": provenance,
        "readiness": {
            "ready_for_scene_dna": True,
            "ready_for_director": True,
            "character_canon_declared": canon_declared,
            "ready_for_character_runtime": canon_declared and not character_missing,
            "ready_for_scene_runtime": canon_declared and not scene_missing,
            "ready_for_full_mcos": canon_declared and not scene_missing,
            "missing": (["declared_character_canon"] if not canon_declared else []) + character_missing + scene_missing,
        },
        "boundaries": LITERARY_BOUNDARIES,
    }


def _tokens(text: str) -> list[str]:
    normalized = text.lower()
    for old, new in {"á": "a", "é": "e", "í": "i", "ó": "o", "ú": "u", "ñ": "n"}.items():
        normalized = normalized.replace(old, new)
    return re.findall(r"[a-z0-9]+", normalized)


def _extract(text: str, terms: set[str]) -> list[str]:
    tokens = set(_tokens(text))
    return sorted(term for term in terms if term in tokens)


def _sentences(text: str) -> list[str]:
    return [part.strip() for part in re.split(r"(?<=[.!?])\s+|\n{2,}", text) if part.strip()]


def _question(text: str) -> str:
    questions = [sentence for sentence in _sentences(text) if "?" in sentence]
    return questions[-1] if questions else "¿Qué cambia después de esta escena?"


def _score(count: int, total: int, multiplier: int) -> int:
    if total <= 0:
        return 0
    return max(0, min(100, round((count / total) * multiplier)))


def _build_contract_fallback(request: LiteraryAdapterRequest) -> dict[str, Any]:
    text = request.text.strip(); tokens = _tokens(text); objects = _extract(text, OBJECT_TERMS); body = _extract(text, BODY_TERMS); themes = _extract(text, THEME_TERMS); sensory = _extract(text, SENSORY_TERMS); abstract = _extract(text, ABSTRACT_TERMS); hidden_question = _question(text); main_object = objects[0] if objects else ""
    diagnostics = {
        "body_rule_score": _score(len(body), len(tokens), 2200),
        "show_vs_tell_score": max(0, min(100, _score(len(body) + len(objects) + len(sensory), len(tokens), 1800) - _score(len(abstract), len(tokens), 700))),
        "hidden_question_presence": 100 if hidden_question else 0,
        "method": "deterministic_contract_adapter",
    }
    blueprint = {"chapter": request.chapter, "opening_scene": _sentences(text)[0] if _sentences(text) else "", "main_object": main_object, "physical_reaction": next((s for s in _sentences(text) if _extract(s, BODY_TERMS)), ""), "dominant_symbol": main_object, "hidden_question": hidden_question, "character_focus": [], "objects": objects, "themes": themes, "scene_priority": _sentences(text)[:3]}
    knowledge = request.knowledge_context or []
    return {
        "status": "degraded",
        "adapter": {"name": "MPE_MCOS_LITERARY_ADAPTER", "version": LITERARY_ADAPTER_VERSION, "mode": "DETERMINISTIC_CONTRACT_FALLBACK", "full_mcos_pipeline_active": False, "vendor_error": VENDORED_MCOS_ERROR},
        "analysis": {"chapter": {"number": request.chapter, "title": ""}, "objects": {"main_object": main_object, "secondary_objects": objects[1:]}, "embodiment": {"body_signals": body, "physical_reaction": blueprint["physical_reaction"]}, "narrative": {"hidden_question": hidden_question, "dominant_symbol": main_object, "themes": themes}, "diagnostics": diagnostics, "knowledge_context": knowledge},
        "blueprint": blueprint,
        "provenance": [{"source": request.source, "status": "SOURCE"}],
        "readiness": {"ready_for_scene_dna": bool(main_object or blueprint["opening_scene"]), "ready_for_full_mcos": False, "missing": ["vendored_literary_mcos_runtime"]},
        "boundaries": LITERARY_BOUNDARIES,
    }


def get_literary_adapter_status() -> dict[str, Any]:
    return {
        "status": "available" if VENDORED_MCOS_AVAILABLE else "degraded",
        "adapter": "MPE_MCOS_LITERARY_ADAPTER",
        "version": LITERARY_ADAPTER_VERSION,
        "mode": "VENDORED_MCOS_V0_1" if VENDORED_MCOS_AVAILABLE else "DETERMINISTIC_CONTRACT_FALLBACK",
        "full_mcos_pipeline_active": VENDORED_MCOS_AVAILABLE,
        "identity_gate": "DECLARED_CHARACTER_CANON_REQUIRED",
        "vendor_error": VENDORED_MCOS_ERROR,
        "boundaries": LITERARY_BOUNDARIES,
    }
