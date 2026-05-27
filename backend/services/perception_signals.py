SIGNAL_DEFINITIONS = [
    {
        "id": "brand_memory_core",
        "label": "Memoria consolidada",
        "state_key": "brand_memory_core",
        "active": "La Entidad ya puede recuperar una memoria estrategica del cliente.",
        "missing": "Falta consolidar la memoria profunda del cliente.",
        "recommended_action": "Generar Brand Memory Core.",
    },
    {
        "id": "visual_dna_engine",
        "label": "Visual DNA activo",
        "state_key": "visual_dna_engine",
        "active": "La direccion visual ya tiene reglas operativas.",
        "missing": "La identidad aun no esta traducida en codigos visuales consistentes.",
        "recommended_action": "Generar Visual DNA Engine.",
    },
    {
        "id": "content_intelligence_engine",
        "label": "Contenido estructurado",
        "state_key": "content_intelligence_engine",
        "active": "El contenido puede organizarse por pilares, deseo y conversion.",
        "missing": "Falta convertir la estrategia en un sistema editorial accionable.",
        "recommended_action": "Generar Content Intelligence Engine.",
    },
    {
        "id": "ai_agent_os",
        "label": "Agent OS activo",
        "state_key": "ai_agent_os",
        "active": "Los agentes ya tienen una base operativa por cliente.",
        "missing": "Los agentes todavia no tienen rutas ni protocolos especificos del cliente.",
        "recommended_action": "Generar AI Agent OS.",
    },
    {
        "id": "deliverables",
        "label": "Entregables generados",
        "state_key": "deliverables",
        "active": "Ya existe material tangible para revisar, exportar o regenerar.",
        "missing": "Todavia no hay entregables finales para operar.",
        "recommended_action": "Generar entregables del cliente.",
    },
    {
        "id": "prompt_pack",
        "label": "Prompt pack disponible",
        "state_key": "prompt_pack",
        "active": "El cliente ya tiene prompts reutilizables para produccion.",
        "missing": "Falta un prompt pack para crear con consistencia.",
        "recommended_action": "Generar Prompt Pack.",
    },
    {
        "id": "visual_boards",
        "label": "Visual boards disponibles",
        "state_key": "visual_assets",
        "active": "Los boards visuales ya pueden guiar produccion y percepcion.",
        "missing": "Falta material visual renderizado para validar direccion estetica.",
        "recommended_action": "Renderizar visual boards.",
    },
    {
        "id": "master_deliverable",
        "label": "Master Brand Experience generado",
        "state_key": "master_deliverable",
        "active": "Existe una sintesis central para compartir o revisar.",
        "missing": "Falta un documento master que una los entregables principales.",
        "recommended_action": "Generar Master Brand Experience.",
    },
    {
        "id": "exportables_review",
        "label": "Falta revisar exportables",
        "state_key": "deliverables_reviewed",
        "warning_when_missing": True,
        "active": "Los entregables ya fueron revisados por la Entidad.",
        "missing": "Hay material acumulado que necesita curadoria antes de exportarse.",
        "recommended_action": "Revisar entregables.",
    },
    {
        "id": "campaign_active",
        "label": "Falta campaña activa",
        "state_key": "campaign_active",
        "warning_when_missing": True,
        "active": "Ya existe una campana activa conectada al sistema.",
        "missing": "La estrategia todavia no fue convertida en una campana activa.",
        "recommended_action": "Generar campaña estrategica.",
    },
    {
        "id": "evolution_timeline",
        "label": "Falta timeline de evolucion",
        "state_key": "evolution_timeline",
        "warning_when_missing": True,
        "active": "La evolucion del cliente ya tiene una secuencia temporal.",
        "missing": "Falta ordenar la evolucion en etapas, hitos y proximas decisiones.",
        "recommended_action": "Generar timeline de evolucion.",
    },
]


def build_perception_signals(state):
    signals = []

    for definition in SIGNAL_DEFINITIONS:
        active = bool(state.get(definition["state_key"]))
        status = "active" if active else ("warning" if definition.get("warning_when_missing") else "missing")

        signals.append(
            {
                "id": definition["id"],
                "label": definition["label"],
                "status": status,
                "interpretation": definition["active"] if active else definition["missing"],
                "recommended_action": definition["recommended_action"],
            }
        )

    return signals
