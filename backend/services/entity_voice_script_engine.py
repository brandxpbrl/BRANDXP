from services.entity_voice_profile import get_entity_voice_profile


MAX_SCRIPT_CHARS = 760

STATE_SUMMARIES = {
    "needs_analysis": "Todavia falta una lectura base.",
    "needs_brand_memory": "El diagnostico existe, pero la memoria profunda aun no esta consolidada.",
    "needs_visual_dna": "La memoria existe, pero falta traducirla en direccion visual operativa.",
    "needs_content_engine": "La identidad y el ADN visual ya tienen base. Falta convertirlos en contenido y conversion.",
    "needs_ai_agent_os": "La arquitectura estrategica esta madura. Falta activar el sistema operativo de agentes.",
    "ready_for_visuals": "El sistema cognitivo del cliente esta completo. Ya puede pasar a visuales finales.",
    "operational": "La base operativa esta consolidada.",
}

ENGINE_LABELS = {
    "brand_memory_core": "memoria",
    "visual_dna_engine": "Visual DNA",
    "content_intelligence_engine": "contenido",
    "ai_agent_os": "Agent OS",
}


def _clean_text(value):
    return " ".join(str(value or "").replace("\n", " ").split()).strip()


def _first_text(values):
    if not isinstance(values, list):
        return ""

    for item in values:
        if isinstance(item, str) and item.strip():
            return _clean_text(item)

        if isinstance(item, dict):
            for key in ("message", "title", "label", "name", "description"):
                if item.get(key):
                    return _clean_text(item[key])

    return ""


def _next_action_label(next_best_action):
    if isinstance(next_best_action, dict):
        return _clean_text(
            next_best_action.get("label")
            or next_best_action.get("title")
            or next_best_action.get("next_action")
            or next_best_action.get("action")
        )

    return _clean_text(next_best_action)


def _state_from_payload(payload):
    recommendation = payload.get("recommendation") or {}

    if isinstance(recommendation, dict) and recommendation.get("state"):
        return recommendation["state"]

    return payload.get("state") or ""


def _summarize_engine_state(state):
    if not isinstance(state, dict):
        return ""

    active = [
        label
        for key, label in ENGINE_LABELS.items()
        if state.get(key)
    ]

    if len(active) >= 3:
        return "Los sistemas principales ya trabajan como una base operativa."

    if active:
        return "Ya existen senales utiles de estructura, pero todavia falta completar el sistema."

    return ""


def _trim_script(lines):
    script = "\n".join(line for line in lines if line).strip()

    if len(script) <= MAX_SCRIPT_CHARS:
        return script

    trimmed = script[:MAX_SCRIPT_CHARS].rsplit(".", 1)[0].strip()
    return f"{trimmed}.\n...\nRecomendacion clara: avanzar con el proximo paso prioritario."


def build_entity_voice_script(payload):
    advisor_message = _clean_text(payload.get("advisor_message"))
    signals = payload.get("signals") or []
    risks = payload.get("risks") or []
    opportunities = payload.get("opportunities") or []
    next_best_action = payload.get("next_best_action") or {}
    recommendation = payload.get("recommendation") or {}
    client = _clean_text(payload.get("client"))
    state = payload.get("state") or {}

    if isinstance(recommendation, dict):
        advisor_message = advisor_message or _clean_text(recommendation.get("message"))
        next_best_action = next_best_action or recommendation

    state_summary = STATE_SUMMARIES.get(_state_from_payload(payload), "")
    engine_summary = _summarize_engine_state(state)
    signal = _first_text(signals)
    risk = _first_text(risks)
    opportunity = _first_text(opportunities)
    action = _next_action_label(next_best_action) or _clean_text(recommendation.get("next_action"))

    lines = [
        "Lectura completada.",
        f"La Entidad observo a {client}." if client else "La Entidad observo el sistema del cliente.",
        "...",
        state_summary or _interpret_advisor_message(advisor_message),
    ]

    if engine_summary:
        lines.extend(["...", engine_summary])

    if signal:
        lines.extend(["...", f"La senal principal es clara: {signal}."])

    if risk:
        lines.extend(["...", f"El riesgo a cuidar es este: {risk}."])

    if opportunity:
        lines.extend(["...", f"La oportunidad esta en {opportunity}."])
    elif advisor_message and not state_summary:
        lines.extend(["...", _interpret_advisor_message(advisor_message)])

    lines.extend(
        [
            "...",
            f"Recomendacion clara: {action}." if action else "Recomendacion clara: ordenar la lectura y definir el proximo movimiento estrategico.",
        ]
    )

    return {
        "script": _trim_script(lines),
        "voice_profile": get_entity_voice_profile(),
    }


def _interpret_advisor_message(message):
    message = _clean_text(message)

    if not message:
        return "Hay suficiente contexto para una lectura estrategica breve."

    replacements = {
        "La memoria, el Visual DNA, el contenido y el Agent OS estan activos.": "La base operativa esta consolidada.",
        "La memoria, el Visual DNA, el contenido y el Agent OS están activos.": "La base operativa esta consolidada.",
        "El cliente ya tiene una base operativa.": "El cliente ya tiene una base operativa.",
        "El sistema cognitivo del cliente esta completo.": "El sistema cognitivo del cliente esta completo.",
    }

    for technical, spoken in replacements.items():
        if technical in message:
            return spoken

    first_sentence = message.split(".")[0].strip()
    return f"{first_sentence}." if first_sentence else message
