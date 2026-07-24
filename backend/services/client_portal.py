from client_manager import _list_visual_references, _resolve_existing_client_path, list_client_deliverables
from services.deliverables_review_engine import review_client_deliverables
from services.entity_advisor import build_entity_advisor
from services.client_activation_engine import build_client_activation
from services.fluid_entity_advisor import (
    generate_client_facing_message,
    generate_progress_summary,
    generate_welcome_message,
)


CLIENT_VISIBLE_DEFAULTS = {
    "MASTER_BRAND_EXPERIENCE.md": "client",
    "brand_analysis.md": "both",
    "identity_patch.md": "both",
    "entity_bible.md": "client",
    "visual_universe.md": "client",
    "content_strategy.md": "client",
    "brand_identity_board.png": "client",
    "storytelling_strategy_board.png": "client",
    "visual_universe_board.png": "client",
}

CLIENT_DELIVERABLE_LABELS = {
    "MASTER_BRAND_EXPERIENCE.md": {
        "title": "Resumen maestro de marca",
        "category": "Direccion estrategica",
        "description": "Sintesis principal para entender el estado, la direccion y los proximos pasos.",
    },
    "brand_analysis.md": {
        "title": "Lectura estrategica",
        "category": "Diagnostico",
        "description": "Analisis claro de situacion actual, brechas y oportunidades.",
    },
    "identity_patch.md": {
        "title": "Ajuste de identidad",
        "category": "Identidad",
        "description": "Correcciones y decisiones para ordenar la expresion de marca.",
    },
    "entity_bible.md": {
        "title": "Guia esencial de marca",
        "category": "Identidad",
        "description": "Base narrativa y conceptual para mantener coherencia.",
    },
    "visual_universe.md": {
        "title": "Universo visual",
        "category": "Direccion visual",
        "description": "Criterios de atmosfera, estilo visual y percepcion deseada.",
    },
    "content_strategy.md": {
        "title": "Estrategia de contenido",
        "category": "Contenido",
        "description": "Pilares, enfoque narrativo y movimientos de comunicacion.",
    },
    "brand_identity_board.png": {
        "title": "Brand Identity Board",
        "category": "Visual",
        "description": "Direccion visual resumida en una pieza de referencia.",
    },
    "storytelling_strategy_board.png": {
        "title": "Storytelling Board",
        "category": "Narrativa",
        "description": "Mapa visual de tono, historia y movimiento narrativo.",
    },
    "visual_universe_board.png": {
        "title": "Visual Universe Board",
        "category": "Visual",
        "description": "Moodboard de atmosfera, lenguaje estetico y composicion.",
    },
}


def _visibility_for(item):
    metadata_visibility = item.get("visibility")

    if metadata_visibility:
        return metadata_visibility, "metadata"

    default_visibility = CLIENT_VISIBLE_DEFAULTS.get(item.get("name"))

    if default_visibility:
        return default_visibility, "system_default"

    return "internal", "internal_default"


def _deliverable_label(item):
    name = item.get("name", "")
    info = CLIENT_DELIVERABLE_LABELS.get(name)

    if info:
        return info

    stem = name.rsplit(".", 1)[0].replace("_", " ").replace("-", " ").strip()
    title = stem.title() if stem else "Material de revision"
    return {
        "title": title,
        "category": "Material",
        "description": "Material disponible para revisar junto al avance del proyecto.",
    }


def _status_label(value):
    labels = {
        "active": "Completado",
        "warning": "En revision",
        "missing": "Pendiente",
        "completed": "Completado",
        "review": "En revision",
        "progress": "En progreso",
        "pending": "Pendiente",
    }
    return labels.get(value, value)


def _module_status(entity_state, state):
    return [
        {"name": "Identidad", "status": "completed" if state.get("latest_analysis") else "pending"},
        {"name": "Memoria", "status": "completed" if state.get("brand_memory_core") else "pending"},
        {"name": "Visual DNA", "status": "completed" if state.get("visual_dna_engine") else "pending"},
        {"name": "Contenido", "status": "completed" if state.get("content_intelligence_engine") else "pending"},
        {"name": "Agent OS", "status": "completed" if state.get("ai_agent_os") else "pending"},
        {"name": "Entregables", "status": "review" if state.get("deliverables") else "pending"},
        {"name": "Proximos pasos", "status": "progress" if entity_state.get("next_best_action") else "pending"},
    ]


def _executive_analysis(advisor_data):
    entity_state = advisor_data["entity_state"]
    risks = entity_state.get("risks") or []

    return {
        "diagnosis": generate_client_facing_message(advisor_data["client"], entity_state),
        "main_gap": risks[0] if risks else "Convertir avances en una direccion simple de aprobar.",
        "opportunity": entity_state.get("oportunidad_principal", "ordenar la siguiente etapa de marca."),
        "recommended_direction": entity_state.get("razon_del_proximo_paso", "Avanzar con una revision clara y accionable."),
    }


def _progress_timeline(state, deliverables_review):
    steps = [
        ("Diagnostico generado", state.get("latest_analysis")),
        ("Identity Patch creado", any(item["name"] == "identity_patch.md" for item in deliverables_review.get("primary_deliverables", []))),
        ("Entity Bible creada", any(item["name"] == "entity_bible.md" for item in deliverables_review.get("primary_deliverables", []))),
        ("Visual Universe creado", any(item["name"] == "visual_universe.md" for item in deliverables_review.get("primary_deliverables", []))),
        ("Content Strategy creada", any(item["name"] == "content_strategy.md" for item in deliverables_review.get("primary_deliverables", []))),
        ("Prompt Pack generado", state.get("prompt_pack")),
        ("Boards visuales generados", state.get("visual_assets")),
        ("Revision pendiente", not state.get("deliverables_reviewed")),
    ]

    return [
        {
            "label": label,
            "status": "completed" if done and label != "Revision pendiente" else ("review" if done else "pending"),
            "date": "",
        }
        for label, done in steps
    ]


def _portal_deliverables(deliverables_data):
    result = []

    for item in deliverables_data.get("items", []):
        if item.get("type") != "file":
            continue

        visibility, visibility_source = _visibility_for(item)

        if visibility not in {"client", "both"}:
            continue

        extension = item.get("extension", "").lstrip(".") or "file"
        label = _deliverable_label(item)
        result.append(
            {
                "name": item["name"],
                "title": label["title"],
                "category": label["category"],
                "description": label["description"],
                "type": extension,
                "status": "available",
                "visibility": visibility,
                "visibility_source": visibility_source,
                "path": item["relative_path"],
                "created_at": item.get("modified_at", ""),
            }
        )

    return result


def _find_visible_material(visible_deliverables, *names):
    wanted = set(names)
    return next((item for item in visible_deliverables if item.get("name") in wanted), None)


def _visual_reference_map(client_path):
    deliverables_dir = client_path / "05_ENTREGAS"
    references = _list_visual_references(client_path, deliverables_dir)
    mapping = {}

    for path in references:
        filename = path.rsplit("/", 1)[-1]
        if "brand_identity_board" in filename:
            mapping["identity"] = path
        elif "storytelling_strategy_board" in filename:
            mapping["storytelling"] = path
        elif "visual_universe_board" in filename:
            mapping["visual_universe"] = path

    return mapping


def _portal_layers(client_path, visible_deliverables, activation_plan, analysis):
    visual_map = _visual_reference_map(client_path)
    decision = (activation_plan or {}).get("decision_board") or {}
    first_priority = ((activation_plan or {}).get("priority_actions") or [{}])[0]
    first_content = ((activation_plan or {}).get("content_moves") or [{}])[0]

    identity_material = _find_visible_material(
        visible_deliverables,
        "identity_patch.md",
        "entity_bible.md",
        "MASTER_BRAND_EXPERIENCE.md",
    )
    storytelling_material = _find_visible_material(
        visible_deliverables,
        "storytelling_strategy_board.md",
        "content_strategy.md",
        "brand_analysis.md",
    )
    visual_material = _find_visible_material(
        visible_deliverables,
        "visual_universe.md",
        "visual_universe_board.md",
        "brand_identity_board.md",
    )
    activation_material = _find_visible_material(
        visible_deliverables,
        "MASTER_BRAND_EXPERIENCE.md",
        "content_strategy.md",
    )

    return [
        {
            "id": "analysis",
            "label": "Donde estamos ahora",
            "title": "Lectura actual",
            "summary": analysis.get("diagnosis") or "Estado actual de la marca y decision que necesita tomar.",
            "image_path": None,
            "material": _find_visible_material(visible_deliverables, "brand_analysis.md", "MASTER_BRAND_EXPERIENCE.md"),
            "next_step": decision.get("strategic_decision") or "Alinear la lectura actual antes de producir mas piezas.",
        },
        {
            "id": "identity",
            "label": "Capa 1",
            "title": "Identidad actual",
            "summary": "Como debe entenderse la marca: esencia, posicionamiento, tension y promesa.",
            "image_path": visual_map.get("identity"),
            "material": identity_material,
            "next_step": first_priority.get("action") or "Validar identidad y criterio de marca.",
        },
        {
            "id": "storytelling",
            "label": "Capa 2",
            "title": "Storytelling actual",
            "summary": "Como la marca debe contar su historia, sostener confianza y mover al cliente.",
            "image_path": visual_map.get("storytelling"),
            "material": storytelling_material,
            "next_step": first_content.get("observable_output") or "Convertir narrativa en una pieza visible.",
        },
        {
            "id": "visual_universe",
            "label": "Capa 3",
            "title": "Universo visual actual",
            "summary": "Como debe sentirse la marca visualmente: atmosfera, composicion, paleta y direccion.",
            "image_path": visual_map.get("visual_universe"),
            "material": visual_material,
            "next_step": "Usar esta referencia para aprobar direccion visual antes de producir mas piezas.",
        },
        {
            "id": "activation",
            "label": "Capa 4",
            "title": "Activacion y proximo movimiento",
            "summary": decision.get("main_gap") or "Lo importante ahora es transformar estrategia en accion observable.",
            "image_path": None,
            "material": activation_material,
            "next_step": decision.get("definition_of_done") or "Cerrar una decision y producir el siguiente output.",
        },
    ]


def build_client_portal(client_name):
    advisor_data = build_entity_advisor(client_name)

    if not advisor_data:
        return None

    _, client_path = _resolve_existing_client_path(advisor_data["client"])

    deliverables_data = list_client_deliverables(advisor_data["client"]) or {"items": []}
    deliverables_review = review_client_deliverables(deliverables_data)
    entity_state = advisor_data["entity_state"]
    state = advisor_data["state"]
    visible_deliverables = _portal_deliverables(deliverables_data)
    activation_plan = build_client_activation(advisor_data["client"])

    return {
        "client": advisor_data["client"],
        "welcome_message": generate_welcome_message(advisor_data["client"], entity_state),
        "brand_status": {
            "overall": _status_label("review" if state.get("deliverables") and not state.get("deliverables_reviewed") else "progress"),
            "summary": generate_progress_summary(advisor_data["client"], visible_deliverables, entity_state.get("signals", [])),
            "modules": _module_status(entity_state, state),
        },
        "executive_analysis": _executive_analysis(advisor_data),
        "progress_timeline": _progress_timeline(state, deliverables_review),
        "deliverables": visible_deliverables,
        "portal_layers": _portal_layers(client_path, visible_deliverables, activation_plan, _executive_analysis(advisor_data)),
        "entity_recommendation": {
            "message": generate_client_facing_message(advisor_data["client"], entity_state),
            "next_action": entity_state["next_best_action"]["label"],
            "reason": entity_state["next_best_action"]["reason"],
        },
        "review_status": {
            "summary": deliverables_review.get("summary", {}),
            "recommendation": deliverables_review.get("recommendation", ""),
            "next_action": deliverables_review.get("next_action", ""),
        },
        "activation_plan": activation_plan,
        "available_actions": [
            {"label": "Ver analisis", "status": "available"},
            {"label": "Ver entregables", "status": "available"},
            {"label": "Descargar resumen", "status": "Disponible proximamente"},
            {"label": "Aprobar direccion", "status": "Disponible proximamente"},
            {"label": "Solicitar ajustes", "status": "Disponible proximamente"},
            {"label": "Preparar proxima etapa", "status": "Disponible proximamente"},
        ],
    }
