NEXT_ACTIONS = {
    "generate_brand_memory_core": {
        "label": "Generar Brand Memory Core",
        "reason": "Sin memoria consolidada, cada salida vuelve a depender del contexto inmediato.",
    },
    "generate_visual_dna_engine": {
        "label": "Generar Visual DNA",
        "reason": "La identidad necesita convertirse en reglas visuales repetibles antes de escalar piezas.",
    },
    "generate_content_intelligence_engine": {
        "label": "Generar Content Intelligence",
        "reason": "La marca ya tiene base estrategica; falta transformarla en contenido, funnel y conversion.",
    },
    "generate_ai_agent_os": {
        "label": "Generar Agent OS",
        "reason": "Los agentes necesitan roles, rutas y protocolos por cliente para operar con precision.",
    },
    "review_deliverables": {
        "label": "Revisar entregables",
        "reason": "Ya existe suficiente material para sintetizar avances, limpiar versiones y preparar exportables.",
    },
    "generate_campaign": {
        "label": "Generar campaña estrategica",
        "reason": "La base operativa esta activa; el siguiente salto es convertir el sistema en movimiento de mercado.",
    },
    "generate_evolution_timeline": {
        "label": "Generar timeline de evolucion",
        "reason": "La campaña existe; ahora conviene ordenar la evolucion por etapas, hitos y decisiones.",
    },
    "prepare_commercial_expansion": {
        "label": "Preparar expansion comercial",
        "reason": "El sistema ya tiene continuidad; la prioridad pasa a oferta, ventas y escala.",
    },
    "run_framework": {
        "label": "Ejecutar framework",
        "reason": "Todavia falta un diagnostico base para que la Entidad pueda leer el estado real del cliente.",
    },
}


def determine_next_best_action(state):
    if not state.get("latest_analysis"):
        action_id = "run_framework"
    elif not state.get("brand_memory_core"):
        action_id = "generate_brand_memory_core"
    elif not state.get("visual_dna_engine"):
        action_id = "generate_visual_dna_engine"
    elif not state.get("content_intelligence_engine"):
        action_id = "generate_content_intelligence_engine"
    elif not state.get("ai_agent_os"):
        action_id = "generate_ai_agent_os"
    elif state.get("deliverables") and not state.get("deliverables_reviewed"):
        action_id = "review_deliverables"
    elif not state.get("campaign_active"):
        action_id = "generate_campaign"
    elif not state.get("evolution_timeline"):
        action_id = "generate_evolution_timeline"
    else:
        action_id = "prepare_commercial_expansion"

    action = NEXT_ACTIONS[action_id]

    return {
        "action_id": action_id,
        "label": action["label"],
        "reason": action["reason"],
    }
