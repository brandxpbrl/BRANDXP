def build_advisor_message(entity_state):
    status = entity_state.get("status")
    scores = entity_state.get("scores", {})
    next_action = entity_state.get("next_best_action", {})
    active_signals = [
        signal["label"]
        for signal in entity_state.get("signals", [])
        if signal.get("status") == "active"
    ]

    if status == "pending":
        return (
            "La Entidad todavia no tiene una lectura base suficiente. "
            "El primer movimiento inteligente es ejecutar el framework y fijar un diagnostico real."
        )

    if status == "building":
        return (
            "El cliente ya empezo a tomar forma, pero la arquitectura aun no esta completa. "
            f"El proximo salto es {next_action.get('label', 'ordenar la base operativa').lower()}."
        )

    if status == "expansion_ready":
        return (
            "La base operativa esta consolidada. "
            "La Entidad detecta que el sistema ya puede pasar de estructura interna a movimiento estrategico visible."
        )

    weakest_score = min(scores.items(), key=lambda item: item[1]) if scores else ("conversion_readiness", 0)
    score_labels = {
        "clarity": "claridad estrategica",
        "differentiation": "diferenciacion",
        "premium_perception": "percepcion premium",
        "visual_coherence": "coherencia visual",
        "narrative_power": "potencia narrativa",
        "conversion_readiness": "preparacion comercial",
    }
    weak_label = score_labels.get(weakest_score[0], weakest_score[0].replace("_", " "))

    if len(active_signals) >= 4:
        return (
            "El cliente ya tiene una base operativa viva. "
            "Memoria, direccion visual, contenido y agentes empiezan a funcionar como un sistema. "
            f"La Entidad detecta que el punto mas sensible es {weak_label}, y recomienda {next_action.get('label', 'revisar entregables').lower()}."
        )

    return (
        "La Entidad detecta señales utiles, pero todavia dispersas. "
        f"Para elevar percepcion y consistencia, el proximo paso es {next_action.get('label', 'ordenar el sistema').lower()}."
    )
