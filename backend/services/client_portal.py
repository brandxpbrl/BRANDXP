from client_manager import list_client_deliverables
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


def _visibility_for(item):
    metadata_visibility = item.get("visibility")

    if metadata_visibility:
        return metadata_visibility, "metadata"

    default_visibility = CLIENT_VISIBLE_DEFAULTS.get(item.get("name"))

    if default_visibility:
        return default_visibility, "system_default"

    return "internal", "internal_default"


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
        result.append(
            {
                "name": item["name"],
                "type": extension,
                "status": "available",
                "visibility": visibility,
                "visibility_source": visibility_source,
                "path": item["relative_path"],
                "created_at": item.get("modified_at", ""),
            }
        )

    return result


def build_client_portal(client_name):
    advisor_data = build_entity_advisor(client_name)

    if not advisor_data:
        return None

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
