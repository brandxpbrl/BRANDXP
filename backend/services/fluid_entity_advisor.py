def _active_labels(entity_state):
    return [
        signal["label"]
        for signal in entity_state.get("signals", [])
        if signal.get("status") == "active"
    ]


def _maturity_label(entity_state):
    labels = {
        "pendiente": "pendiente",
        "base_en_construccion": "en construccion",
        "sistema_en_evolucion": "en evolucion",
        "base_operativa": "con base operativa",
        "expansion_activa": "en expansion",
    }
    return labels.get(entity_state.get("maturity"), "en evolucion")


def generate_welcome_message(client_name, entity_state):
    active = _active_labels(entity_state)

    if active:
        readable = ", ".join(active[:3])
        return (
            f"Bienvenido al espacio de {client_name}. "
            f"La Entidad ya cargo {readable}. "
            "Hoy vamos a revisar que esta consolidado, que falta ordenar y cual es el proximo movimiento estrategico."
        )

    return (
        f"Bienvenido al espacio de {client_name}. "
        "La Entidad esta preparando la primera lectura para ordenar identidad, percepcion y proximos pasos."
    )


def generate_status_reading(client_name, entity_state):
    maturity = _maturity_label(entity_state)
    opportunity = entity_state.get("oportunidad_principal") or "ordenar el siguiente avance."

    if entity_state.get("status") == "pending":
        return (
            f"{client_name} todavia necesita un diagnostico base. "
            "La prioridad no es producir mas piezas, sino crear una lectura clara del estado actual."
        )

    return (
        f"{client_name} esta {maturity}. "
        f"La oportunidad ahora es {opportunity}"
    )


def generate_progress_summary(client_name, deliverables, signals):
    completed = [signal for signal in signals if signal.get("status") == "active"]
    deliverable_count = len(deliverables or [])

    if deliverable_count:
        return (
            f"{client_name} ya tiene {deliverable_count} entregables visibles para revisar. "
            f"Tambien presenta {len(completed)} señales activas de avance. "
            "La tarea inteligente es sintetizar, limpiar versiones y preparar lo que puede mostrarse al cliente."
        )

    return (
        f"{client_name} tiene señales de avance, pero aun falta convertirlas en entregables claros. "
        "La Entidad recomienda construir primero la base visible del sistema."
    )


def generate_next_step_guidance(client_name, next_best_action):
    label = next_best_action.get("label") or "Definir proximo paso"
    reason = next_best_action.get("reason") or "Es el movimiento con mayor impacto inmediato."

    return f"Para {client_name}, el proximo paso es {label.lower()}. {reason}"


def generate_client_facing_message(client_name, entity_state):
    next_action = entity_state.get("next_best_action", {})

    return (
        "Tu marca ya tiene una lectura estrategica en marcha. "
        "Estamos organizando identidad, percepcion visual, narrativa y proximos pasos para que puedas ver tu evolucion con claridad. "
        f"El siguiente movimiento recomendado es {next_action.get('label', 'revisar la direccion')}."
    )


def generate_internal_advisor_message(client_name, entity_state):
    next_action = entity_state.get("next_best_action", {})
    risks = entity_state.get("risks") or []
    risk_text = f" Riesgo principal: {risks[0]}" if risks else ""

    return (
        f"El sistema detecta que {client_name} esta {_maturity_label(entity_state)}. "
        f"La prioridad operativa es {next_action.get('label', 'ordenar el sistema').lower()}. "
        f"{next_action.get('reason', '')}{risk_text}"
    )


def generate_entity_message(client_name, entity_state, mode="internal"):
    if mode == "client":
        return generate_client_facing_message(client_name, entity_state)

    return generate_internal_advisor_message(client_name, entity_state)
