from client_manager import _load_latest_analysis, _resolve_existing_client_path, list_client_deliverables
from services.client_activation_engine import build_client_activation
from services.client_readiness import build_client_readiness
from services.deliverables_review_engine import review_client_deliverables
from services.entity_advisor import build_entity_advisor


def build_mpe_client_snapshot(client_name: str) -> dict:
    resolved_client_name, client_path = _resolve_existing_client_path(client_name)

    if not client_path:
        return {}

    latest_analysis = {}
    latest_sources = {}
    try:
        latest_payload, _markdown, latest_sources = _load_latest_analysis(client_path)
        latest_analysis = (latest_payload or {}).get("analysis") or latest_payload or {}
    except ValueError:
        latest_analysis = {}

    advisor = build_entity_advisor(resolved_client_name) or {}
    entity_state = advisor.get("entity_state") or {}
    readiness = build_client_readiness(resolved_client_name) or {}
    activation = build_client_activation(resolved_client_name) or {}
    deliverables_data = list_client_deliverables(resolved_client_name) or {"items": []}
    deliverables_review = review_client_deliverables(deliverables_data)
    scores = entity_state.get("scores") or {}
    available_systems = {
        "latest_analysis": bool((advisor.get("state") or {}).get("latest_analysis")),
        "brand_memory_core": bool((advisor.get("state") or {}).get("brand_memory_core")),
        "visual_dna_engine": bool((advisor.get("state") or {}).get("visual_dna_engine")),
        "content_intelligence_engine": bool((advisor.get("state") or {}).get("content_intelligence_engine")),
        "ai_agent_os": bool((advisor.get("state") or {}).get("ai_agent_os")),
        "master_deliverable": bool((advisor.get("state") or {}).get("master_deliverable")),
        "campaign_active": bool((advisor.get("state") or {}).get("campaign_active")),
        "evolution_timeline": bool((advisor.get("state") or {}).get("evolution_timeline")),
    }

    return {
        "client": resolved_client_name,
        "source": {
            "latest_analysis": latest_analysis,
            "latest_analysis_sources": latest_sources,
            "entity_state": entity_state,
            "readiness": readiness,
            "activation": activation,
            "deliverables_review": deliverables_review,
        },
        "scores": {
            "clarity": scores.get("clarity", 0),
            "differentiation": scores.get("differentiation", 0),
            "premium_perception": scores.get("premium_perception", 0),
            "visual_coherence": scores.get("visual_coherence", 0),
            "narrative_power": scores.get("narrative_power", 0),
            "conversion_readiness": scores.get("conversion_readiness", 0),
        },
        "signals": entity_state.get("signals", []),
        "risks": entity_state.get("risks", []),
        "opportunities": entity_state.get("opportunities", []),
        "current_recommendation": advisor.get("recommendation") or {},
        "available_systems": available_systems,
    }

