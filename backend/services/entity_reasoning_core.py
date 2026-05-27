from services.fluid_entity_advisor import (
    generate_client_facing_message,
    generate_internal_advisor_message,
    generate_next_step_guidance,
    generate_status_reading,
    generate_welcome_message,
)
from services.live_entity_state import build_live_entity_state


ENTITY_REASONING_PROFILE = {
    "name": "Brand Experience Entity",
    "role": "asesora estrategica del sistema Brand Experience OS",
    "archetype": "directora cognitiva premium",
    "point_of_view": (
        "No mide actividad por volumen. Evalua si cada avance aumenta claridad, "
        "percepcion premium, narrativa, coherencia y capacidad de conversion."
    ),
    "decision_principles": [
        "Ordenar antes de producir mas.",
        "Convertir archivos en direccion observable.",
        "Separar lo interno de lo presentable al cliente.",
        "Recomendar una accion principal por lectura.",
        "Proteger la especialidad de cada motor del sistema.",
    ],
}


def _legacy_state_key(base_state):
    if not base_state.get("latest_analysis"):
        return "needs_analysis"

    if not base_state.get("brand_memory_core"):
        return "needs_brand_memory"

    if not base_state.get("visual_dna_engine"):
        return "needs_visual_dna"

    if not base_state.get("content_intelligence_engine"):
        return "needs_content_engine"

    if not base_state.get("ai_agent_os"):
        return "needs_ai_agent_os"

    if not base_state.get("visual_assets"):
        return "ready_for_visuals"

    return "operational"


def _priority_from_state(state_key):
    if state_key in {"needs_analysis", "needs_brand_memory", "needs_visual_dna"}:
        return "high"

    if state_key in {"needs_content_engine", "needs_ai_agent_os", "ready_for_visuals"}:
        return "medium"

    return "normal"


def _confidence_level(entity_state):
    scores = [
        value
        for value in entity_state.get("scores", {}).values()
        if isinstance(value, (int, float))
    ]

    if not scores:
        return "inicial"

    average = sum(scores) / len(scores)
    status = entity_state.get("status")

    if average >= 88 and status in {"operational", "expansion_ready"}:
        return "alta"

    if average >= 70:
        return "media"

    return "en construccion"


def _entity_presence(entity_state):
    status = entity_state.get("status")
    next_action = entity_state.get("next_best_action", {}).get("action_id")

    if status == "pending":
        return "diagnosticando"

    if next_action in {"review_deliverables", "prepare_client_summary"}:
        return "sintetizando"

    if next_action in {"generate_campaign", "generate_evolution_timeline", "prepare_commercial_expansion"}:
        return "expandiendo"

    return "observando"


def _executive_reading(client_name, entity_state):
    next_action = entity_state.get("next_best_action", {})
    active_count = len(
        [
            signal
            for signal in entity_state.get("signals", [])
            if signal.get("status") == "active"
        ]
    )
    warnings = [
        signal
        for signal in entity_state.get("signals", [])
        if signal.get("status") in {"warning", "missing"}
    ]
    opportunity = (
        entity_state.get("opportunity")
        or entity_state.get("oportunidad_principal")
        or (entity_state.get("opportunities") or ["ordenar el avance existente"])[0]
    ).strip(" .")

    if entity_state.get("status") == "pending":
        return (
            f"La Entidad todavia no tiene una lectura completa de {client_name}. "
            "El primer movimiento productivo es ejecutar el framework para convertir "
            "la informacion dispersa en diagnostico accionable."
        )

    if warnings:
        return (
            f"{client_name} muestra una base activa con {active_count} senales consolidadas, "
            f"pero todavia hay una capa que necesita decision. La oportunidad principal es {opportunity}. "
            f"El movimiento recomendado es {next_action.get('label', 'ordenar la siguiente accion')}."
        )

    return (
        f"{client_name} ya opera con una arquitectura solida. La Entidad detecta {active_count} "
        f"senales activas y una oportunidad clara: {opportunity}. El foco ahora es convertir "
        "esa madurez en avance visible, presentable y facil de decidir."
    )


def _decision_lens(entity_state):
    scores = entity_state.get("scores", {})
    return [
        {
            "label": "Percepcion",
            "reading": (
                "La marca puede sostener una lectura premium."
                if scores.get("premium_perception", 0) >= 80
                else "La percepcion premium necesita mas evidencia visual y narrativa."
            ),
        },
        {
            "label": "Claridad",
            "reading": (
                "La direccion esta suficientemente clara para sintetizar."
                if scores.get("clarity", 0) >= 80
                else "La prioridad es ordenar el diagnostico antes de expandir."
            ),
        },
        {
            "label": "Conversion",
            "reading": (
                "Existe base para transformar estrategia en accion comercial."
                if scores.get("conversion_readiness", 0) >= 75
                else "Falta traducir el sistema en una accion comercial concreta."
            ),
        },
    ]


def _strategic_questions(entity_state):
    warnings = {
        signal.get("id")
        for signal in entity_state.get("signals", [])
        if signal.get("status") in {"warning", "missing"}
    }
    questions = []

    if "deliverables_review" in warnings:
        questions.append("Que entregables son realmente presentables y cuales deben limpiarse?")

    if "campaign_active" in warnings:
        questions.append("Que campana convierte esta base estrategica en movimiento visible?")

    if "evolution_timeline" in warnings:
        questions.append("Que hitos ordenan la evolucion del cliente durante los proximos 30 dias?")

    if not questions:
        questions.append("Que decision debe tomar el cliente para avanzar sin perder foco?")

    questions.append("Que parte del sistema debe mostrarse al cliente y cual debe quedar interna?")
    questions.append("Que accion unica crea mas claridad ahora mismo?")

    return questions[:3]


def _action_routes(entity_state):
    next_action = entity_state.get("next_best_action", {})
    warnings = [
        signal
        for signal in entity_state.get("signals", [])
        if signal.get("status") in {"warning", "missing"}
    ]
    routes = [
        {
            "type": "principal",
            "label": next_action.get("label", "Definir proximo paso"),
            "reason": next_action.get("reason", "Es la accion con mayor impacto inmediato."),
        }
    ]

    if warnings:
        routes.append(
            {
                "type": "control",
                "label": f"Resolver {warnings[0].get('label', 'senal pendiente')}",
                "reason": warnings[0].get(
                    "recommended_action",
                    "Reduce friccion antes de avanzar a produccion o presentacion.",
                ),
            }
        )

    if entity_state.get("risks"):
        routes.append(
            {
                "type": "proteccion",
                "label": "Proteger la sintesis estrategica",
                "reason": entity_state["risks"][0],
            }
        )

    return routes[:3]


def _reasoning_summary(entity_state):
    active_signals = [
        signal
        for signal in entity_state.get("signals", [])
        if signal.get("status") == "active"
    ]
    warnings = [
        signal
        for signal in entity_state.get("signals", [])
        if signal.get("status") == "warning"
    ]

    return {
        "status": entity_state.get("status"),
        "maturity": entity_state.get("maturity"),
        "observed_signals": active_signals[:6],
        "warnings": warnings[:6],
        "risks": entity_state.get("risks", []),
        "opportunities": entity_state.get("opportunities", []),
        "scores": entity_state.get("scores", {}),
        "next_best_action": entity_state.get("next_best_action", {}),
        "entity_presence": _entity_presence(entity_state),
        "confidence": _confidence_level(entity_state),
        "decision_lens": _decision_lens(entity_state),
        "strategic_questions": _strategic_questions(entity_state),
        "action_routes": _action_routes(entity_state),
        "reasoning_basis": [
            "Estado real de archivos del cliente.",
            "LATEST_ANALYSIS scorecard si existe.",
            "Senales de percepcion activas, faltantes o en advertencia.",
            "Prioridad operativa calculada por next_best_action.",
        ],
    }


def build_entity_reasoning(client_name, client_path, base_state):
    entity_state = build_live_entity_state(client_path, base_state)
    next_action = entity_state["next_best_action"]
    state_key = _legacy_state_key(base_state)
    recommendation = {
        "state": state_key,
        "priority": _priority_from_state(state_key),
        "message": entity_state["advisor_message"],
        "next_action": next_action["label"],
        "action_key": next_action["action_id"],
        "reason": next_action["reason"],
        "live_status": entity_state["status"],
    }
    fluid_messages = {
        "welcome": generate_welcome_message(client_name, entity_state),
        "status_reading": generate_status_reading(client_name, entity_state),
        "next_step_guidance": generate_next_step_guidance(client_name, next_action),
        "client": generate_client_facing_message(client_name, entity_state),
        "internal": generate_internal_advisor_message(client_name, entity_state),
    }

    return {
        "entity_profile": ENTITY_REASONING_PROFILE,
        "entity_state": entity_state,
        "recommendation": recommendation,
        "fluid_messages": fluid_messages,
        "reasoning": {
            **_reasoning_summary(entity_state),
            "executive_reading": _executive_reading(client_name, entity_state),
        },
    }
