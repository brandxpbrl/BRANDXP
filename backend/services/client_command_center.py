from datetime import datetime

from client_manager import _resolve_existing_client_path
from services.client_activation_engine import build_client_activation
from services.client_chat_engine import build_client_chat_context
from services.client_readiness import build_client_readiness
from services.entity_advisor import build_entity_advisor
from services.mpe.mpe_brand_geometry import build_brand_geometry_command_summary
from services.mpe.mpe_entity_scan import run_mpe_entity_scan
from services.mpe.mpe_morphogenesis import build_morphogenesis_command_summary


ACTION_MODULES = {
    "run_framework": "Framework",
    "generate_brand_memory_core": "Brand Memory Core",
    "generate_visual_dna_engine": "Visual DNA Engine",
    "generate_content_intelligence_engine": "Content Intelligence Engine",
    "generate_ai_agent_os": "AI Agent OS",
    "review_deliverables": "Activation Board",
    "render_visual_assets": "Visual Boards",
    "generate_campaign": "Campaign",
    "generate_evolution_timeline": "Evolution Timeline",
    "prepare_commercial_expansion": "Chat operativo",
}


def _compact_action(action):
    action = action or {}
    action_id = action.get("action_id") or action.get("action_key") or action.get("id")
    return {
        "id": action_id,
        "label": action.get("label") or action.get("next_action") or "Definir siguiente accion",
        "reason": action.get("reason") or action.get("message") or "Es el movimiento recomendado por el sistema.",
        "module": ACTION_MODULES.get(action_id, "Command Center"),
    }


def _first(value, fallback=None):
    if isinstance(value, list) and value:
        return value[0]
    return fallback


def _build_decision(advisor, activation, readiness):
    entity_state = advisor.get("entity_state", {}) if advisor else {}
    recommendation = advisor.get("recommendation", {}) if advisor else {}
    reasoning = advisor.get("reasoning", {}) if advisor else {}
    activation = activation or {}
    readiness = readiness or {}
    decision_board = activation.get("decision_board") or {}
    next_best_action = entity_state.get("next_best_action") or reasoning.get("next_best_action") or {}
    primary_action = _compact_action(next_best_action or recommendation)

    if not primary_action.get("id") and recommendation.get("action_key"):
        primary_action["id"] = recommendation["action_key"]
        primary_action["module"] = ACTION_MODULES.get(recommendation["action_key"], "Entidad Asesora")

    readiness_action = readiness.get("next_action") or {}
    active_question = _first(reasoning.get("strategic_questions"), "Que accion unica crea mas claridad ahora mismo?")

    return {
        "current_state": decision_board.get("current_state")
        or entity_state.get("advisor_message")
        or "Cliente listo para lectura operativa.",
        "main_gap": decision_board.get("main_gap")
        or _first(entity_state.get("risks"), "Falta definir la siguiente decision observable."),
        "strategic_decision": decision_board.get("strategic_decision")
        or primary_action["reason"],
        "active_question": active_question,
        "definition_of_done": decision_board.get("definition_of_done")
        or "Decision aprobada, output generado y proximo movimiento claro.",
        "primary_action": primary_action,
        "readiness_action": _compact_action(readiness_action) if readiness_action else None,
    }


def _build_truth_sources(advisor, activation, readiness, chat_context, mpe_reading=None, source_health=None):
    state = advisor.get("state", {}) if advisor else {}
    source_map = activation.get("source_map", {}) if activation else {}
    chat_context = chat_context or {}
    source_health = source_health or {}
    chat_health = source_health.get("operator_chat") or {}
    mpe_health = source_health.get("mpe") or {}
    mpe_reading = mpe_reading or {}

    return [
        {
            "id": "entity_state",
            "label": "Entidad Asesora",
            "status": (advisor or {}).get("entity_state", {}).get("status", "unknown"),
            "role": "Criterio, riesgos, oportunidad y proxima accion.",
        },
        {
            "id": "readiness",
            "label": "Readiness",
            "status": (readiness or {}).get("status", "unknown"),
            "role": "Fuentes, agentes preparados y faltantes.",
        },
        {
            "id": "activation",
            "label": "Activation Board",
            "status": (activation or {}).get("activation_state", "unknown"),
            "role": "Decision, prioridades, pipeline y bloqueos.",
        },
        {
            "id": "latest_analysis",
            "label": "Latest Analysis",
            "status": "active" if state.get("latest_analysis") or source_map.get("latest_analysis_json") else "missing",
            "role": "Diagnostico estructurado y scorecard.",
        },
        {
            "id": "operator_chat",
            "label": "Chat operativo",
            "status": chat_health.get("status") or ("active" if chat_context.get("suggested_prompts") else "pending"),
            "role": chat_health.get("message") or "Ejecucion conversacional de acciones y prompts.",
        },
        {
            "id": "mpe_entity_scan",
            "label": "MPE Entity Scan",
            "status": mpe_health.get("status") or ("active" if mpe_reading.get("enabled") else "pending"),
            "role": mpe_health.get("message") or "Lente evolutivo: contradiccion, posibilidad latente y restriccion fertil.",
        },
    ]


def _build_operating_state(advisor, activation, readiness):
    entity_state = advisor.get("entity_state", {}) if advisor else {}
    state = advisor.get("state", {}) if advisor else {}
    summary = (readiness or {}).get("summary") or {}
    activation = activation or {}

    return {
        "status": entity_state.get("status") or "unknown",
        "maturity": entity_state.get("maturity") or entity_state.get("madurez_operativa") or "unknown",
        "confidence": (advisor.get("reasoning", {}) if advisor else {}).get("confidence", "inicial"),
        "scores": entity_state.get("scores", {}),
        "signals": entity_state.get("signals", []),
        "systems": {
            "latest_analysis": bool(state.get("latest_analysis")),
            "brand_memory_core": bool(state.get("brand_memory_core")),
            "visual_dna_engine": bool(state.get("visual_dna_engine")),
            "content_intelligence_engine": bool(state.get("content_intelligence_engine")),
            "ai_agent_os": bool(state.get("ai_agent_os")),
            "master_deliverable": bool(state.get("master_deliverable")),
            "campaign_active": bool(state.get("campaign_active")),
            "evolution_timeline": bool(state.get("evolution_timeline")),
        },
        "readiness": {
            "overall": (readiness or {}).get("overall", 0),
            "ready_agents": summary.get("ready", 0),
            "partial_agents": summary.get("partial", 0),
            "blocked_agents": summary.get("blocked", 0),
        },
        "activation": {
            "state": activation.get("activation_state", "pending"),
            "blockers": activation.get("blockers", []),
            "metrics": activation.get("observable_metrics", []),
        },
    }


def _build_actions(advisor, activation, chat_context):
    reasoning = (advisor or {}).get("reasoning", {})
    activation = activation or {}
    chat_context = chat_context or {}
    routes = reasoning.get("action_routes") or []
    priority_actions = activation.get("priority_actions") or []
    suggested_prompts = chat_context.get("suggested_prompts") or []

    return {
        "routes": routes,
        "priority_actions": priority_actions[:5],
        "production_pipeline": (activation.get("production_pipeline") or [])[:6],
        "content_moves": (activation.get("content_moves") or [])[:5],
        "suggested_prompts": suggested_prompts[:6],
    }


def _build_visibility(advisor, activation):
    activation = activation or {}
    blockers = activation.get("blockers", [])
    entity_state = (advisor or {}).get("entity_state", {})

    return {
        "client_visible": [
            "Portal del Cliente",
            "Resumen ejecutivo",
            "Entregables curados",
            "Proximo paso aprobado",
        ],
        "internal_only": [
            "Readiness completo por agente",
            "Rutas internas principal/control/proteccion",
            "Prompts y protocolos de Agent OS",
            "Bloqueos tecnicos o duplicados",
        ],
        "presentation_risk": blockers[:3] or entity_state.get("risks", [])[:3],
    }


def _compact_mpe_scan(scan):
    return {
        "enabled": True,
        "engine": scan.get("engine", "MPE Entity Scan"),
        "version": scan.get("version", "0.1"),
        "possibility_score": scan.get("possibility_score", 0),
        "evolution_stage": scan.get("evolution_stage"),
        "main_contradiction": scan.get("main_contradiction"),
        "latent_possibility": scan.get("latent_possibility"),
        "fertile_constraint": scan.get("fertile_constraint"),
        "recommended_path": scan.get("recommended_path", {}),
        "geometry": scan.get("geometry", {}),
        "morphogenesis_seed": scan.get("morphogenesis_seed", {}),
    }


def _mpe_unavailable(error):
    return {
        "enabled": False,
        "error": str(error),
        "fallback_message": "MPE Entity Scan no disponible para este cliente.",
    }


def build_client_command_center(client_name):
    resolved_client_name, client_path = _resolve_existing_client_path(client_name)

    if not client_path:
        return None

    advisor = build_entity_advisor(resolved_client_name) or {}
    activation = build_client_activation(resolved_client_name) or {}
    readiness = build_client_readiness(resolved_client_name) or {}
    source_health = {}

    try:
        chat_context = build_client_chat_context(resolved_client_name, read_only=True) or {}
    except Exception as exc:
        chat_context = {}
        source_health["operator_chat"] = {
            "status": "unavailable",
            "message": f"Chat operativo no disponible en lectura: {exc}",
        }

    try:
        # TODO: Reuse recent persisted scans once freshness rules are defined.
        mpe_reading = _compact_mpe_scan(run_mpe_entity_scan(resolved_client_name, persist=True) or {})
    except Exception as exc:
        mpe_reading = _mpe_unavailable(exc)
        source_health["mpe"] = {
            "status": "unavailable",
            "message": "MPE Entity Scan no disponible para este cliente.",
        }

    try:
        morphogenesis = build_morphogenesis_command_summary(resolved_client_name)
    except Exception as exc:
        morphogenesis = {
            "available": False,
            "svg_available": False,
            "error": str(exc),
        }

    try:
        brand_geometry = build_brand_geometry_command_summary(resolved_client_name)
    except Exception as exc:
        brand_geometry = {
            "available": False,
            "svg_available": False,
            "count": 0,
            "error": str(exc),
        }

    decision = _build_decision(advisor, activation, readiness)

    return {
        "client": resolved_client_name,
        "generated_at": datetime.now().isoformat(timespec="seconds"),
        "headline": activation.get("headline")
        or (advisor.get("fluid_messages") or {}).get("status_reading")
        or "Lectura unificada lista.",
        "command_state": "action_required" if decision["primary_action"].get("id") else "observe",
        "decision": decision,
        "operating_state": _build_operating_state(advisor, activation, readiness),
        "truth_sources": _build_truth_sources(advisor, activation, readiness, chat_context, mpe_reading, source_health),
        "mpe": mpe_reading,
        "morphogenesis": morphogenesis,
        "brand_geometry": brand_geometry,
        "actions": _build_actions(advisor, activation, chat_context),
        "visibility": _build_visibility(advisor, activation),
        "raw_refs": {
            "advisor_loaded": bool(advisor),
            "activation_loaded": bool(activation),
            "readiness_loaded": bool(readiness),
            "chat_context_loaded": bool(chat_context),
            "source_health": source_health,
        },
    }
