from __future__ import annotations

import re
from dataclasses import dataclass
from typing import Any


LITERARY_ADAPTER_VERSION = "0.1"
LITERARY_BOUNDARIES = [
    "SOURCE_TEXT_IS_OBSERVATION_NOT_CANON",
    "GENERATED_BLUEPRINT_IS_PROPOSED_NOT_CANON",
    "DIAGNOSTICS_ARE_HEURISTIC_NOT_TRUTH",
    "MCOS_ADAPTER_DOES_NOT_PROMOTE_EPISTEMIC_STATUS",
]

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


def _normalize(value: str) -> str:
    return value.lower().normalize("NFD") if False else value.lower()


def _tokens(text: str) -> list[str]:
    normalized = text.lower()
    replacements = {"á": "a", "é": "e", "í": "i", "ó": "o", "ú": "u", "ñ": "n"}
    for old, new in replacements.items():
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


def build_literary_analysis(request: LiteraryAdapterRequest) -> dict[str, Any]:
    text = request.text.strip()
    if not text:
        raise ValueError("text is required")

    tokens = _tokens(text)
    objects = _extract(text, OBJECT_TERMS)
    body = _extract(text, BODY_TERMS)
    themes = _extract(text, THEME_TERMS)
    sensory = _extract(text, SENSORY_TERMS)
    abstract = _extract(text, ABSTRACT_TERMS)
    hidden_question = _question(text)
    main_object = objects[0] if objects else ""

    diagnostics = {
        "body_rule_score": _score(len(body), len(tokens), 2200),
        "show_vs_tell_score": max(0, min(100, _score(len(body) + len(objects) + len(sensory), len(tokens), 1800) - _score(len(abstract), len(tokens), 700))),
        "hidden_question_presence": 100 if hidden_question else 0,
        "method": "deterministic_contract_adapter",
    }

    blueprint = {
        "chapter": request.chapter,
        "opening_scene": _sentences(text)[0] if _sentences(text) else "",
        "main_object": main_object,
        "physical_reaction": next((s for s in _sentences(text) if _extract(s, BODY_TERMS)), ""),
        "dominant_symbol": main_object,
        "hidden_question": hidden_question,
        "character_focus": [],
        "objects": objects,
        "themes": themes,
        "scene_priority": _sentences(text)[:3],
    }

    knowledge = request.knowledge_context or []
    provenance = [
        {"source": request.source, "status": "SOURCE"},
        *[
            {"source": item.get("source", "ENTITY_BIBLE"), "status": item.get("status", "SOURCE")}
            for item in knowledge
        ],
    ]

    return {
        "status": "ok",
        "adapter": {
            "name": "MPE_MCOS_LITERARY_ADAPTER",
            "version": LITERARY_ADAPTER_VERSION,
            "mode": "DETERMINISTIC_CONTRACT",
            "full_mcos_pipeline_active": False,
        },
        "analysis": {
            "chapter": {"number": request.chapter, "title": ""},
            "objects": {"main_object": main_object, "secondary_objects": objects[1:]},
            "embodiment": {"body_signals": body, "physical_reaction": blueprint["physical_reaction"]},
            "narrative": {"hidden_question": hidden_question, "dominant_symbol": main_object, "themes": themes},
            "diagnostics": diagnostics,
            "knowledge_context": knowledge,
        },
        "blueprint": blueprint,
        "provenance": provenance,
        "readiness": {
            "ready_for_scene_dna": bool(main_object or blueprint["opening_scene"]),
            "ready_for_full_mcos": False,
            "missing": ["vendored_literary_mcos_runtime"],
        },
        "boundaries": LITERARY_BOUNDARIES,
    }


def get_literary_adapter_status() -> dict[str, Any]:
    return {
        "status": "available",
        "adapter": "MPE_MCOS_LITERARY_ADAPTER",
        "version": LITERARY_ADAPTER_VERSION,
        "mode": "DETERMINISTIC_CONTRACT",
        "full_mcos_pipeline_active": False,
        "next_required_component": "vendored_literary_mcos_runtime",
        "boundaries": LITERARY_BOUNDARIES,
    }
