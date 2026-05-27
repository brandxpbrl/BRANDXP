import json
from pathlib import Path

from services.entity_advisor_engine import build_advisor_message
from services.next_best_action import determine_next_best_action
from services.perception_signals import build_perception_signals


LATEST_ANALYSIS = Path("01_DIAGNOSTICO_ACTUAL/Analisis_Brand_Experience/LATEST_ANALYSIS.json")


def _read_latest_analysis(client_path):
    path = client_path / LATEST_ANALYSIS

    if not path.exists():
        return {}

    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except (json.JSONDecodeError, OSError):
        return {}


def _score_from_analysis(analysis, key, default):
    scorecard = (analysis.get("analysis") or {}).get("scorecard") or []

    for item in scorecard:
        if item.get("key") == key and isinstance(item.get("score"), (int, float)):
            return int(item["score"])

    return default


def _has_any(client_path, relative_folder, patterns):
    folder = client_path / relative_folder

    if not folder.is_dir():
        return False

    return any(any(folder.glob(pattern)) for pattern in patterns)


def enrich_client_state(client_path, base_state):
    state = dict(base_state)
    state["master_deliverable"] = (client_path / "05_ENTREGAS/MASTER_BRAND_EXPERIENCE.md").exists()
    state["deliverables_reviewed"] = (client_path / "05_ENTREGAS/deliverables_review.json").exists()
    state["campaign_active"] = _has_any(
        client_path,
        "06_CAMPAIGNS",
        ["*.md", "*.json"],
    ) or _has_any(
        client_path,
        "05_ENTREGAS/campaigns",
        ["*.md", "*.json"],
    )
    state["evolution_timeline"] = (client_path / "05_ENTREGAS/evolution_timeline.md").exists() or _has_any(
        client_path,
        "10_EVOLUTION_TIMELINE",
        ["*.md", "*.json"],
    )

    return state


def _maturity_from_state(state):
    core_keys = [
        "latest_analysis",
        "brand_memory_core",
        "visual_dna_engine",
        "content_intelligence_engine",
        "ai_agent_os",
    ]
    active = sum(1 for key in core_keys if state.get(key))

    if active == 0:
        return "pendiente"

    if active < 3:
        return "base_en_construccion"

    if active < len(core_keys):
        return "sistema_en_evolucion"

    if state.get("campaign_active"):
        return "expansion_activa"

    return "base_operativa"


def _status_from_state(state):
    if not state.get("latest_analysis"):
        return "pending"

    required = ["brand_memory_core", "visual_dna_engine", "content_intelligence_engine", "ai_agent_os"]

    if not all(state.get(key) for key in required):
        return "building"

    if state.get("campaign_active"):
        return "expansion_ready"

    return "operational"


def _risks(state, scores):
    risks = []

    if not state.get("latest_analysis"):
        risks.append("Tomar decisiones visuales sin diagnostico base.")

    if not state.get("brand_memory_core"):
        risks.append("Perder coherencia entre sesiones por falta de memoria consolidada.")

    if not state.get("visual_dna_engine"):
        risks.append("Producir piezas atractivas pero visualmente inconsistentes.")

    if scores.get("conversion_readiness", 0) < 78:
        risks.append("Tener buena percepcion sin suficiente camino hacia accion comercial.")

    if state.get("deliverables") and not state.get("deliverables_reviewed"):
        risks.append("Acumular entregables sin curadoria ni version final clara.")

    return risks[:4]


def _opportunity(state, scores):
    if not state.get("latest_analysis"):
        return "crear el primer diagnostico para ordenar identidad, percepcion y accion."

    if not state.get("ai_agent_os"):
        return "convertir la estrategia en un sistema de agentes con roles por cliente."

    if state.get("deliverables") and not state.get("deliverables_reviewed"):
        return "limpiar entregables, sintetizar avances y preparar exportables con mayor autoridad."

    if scores.get("conversion_readiness", 0) < 80:
        return "transformar percepcion en una ruta comercial mas clara."

    return "pasar de sistema interno a campana estrategica visible."


def build_live_entity_state(client_path, base_state):
    state = enrich_client_state(client_path, base_state)
    latest_analysis = _read_latest_analysis(client_path)
    scores = {
        "clarity": _score_from_analysis(latest_analysis, "strategic_clarity", 62 if state.get("latest_analysis") else 35),
        "differentiation": _score_from_analysis(latest_analysis, "differentiation", 58),
        "premium_perception": _score_from_analysis(latest_analysis, "premium_perception", 62),
        "visual_coherence": _score_from_analysis(latest_analysis, "visual_coherence", 64 if state.get("visual_dna_engine") else 48),
        "narrative_power": _score_from_analysis(latest_analysis, "narrative_power", 60),
        "conversion_readiness": _score_from_analysis(latest_analysis, "conversion_readiness", 56),
    }
    next_best_action = determine_next_best_action(state)
    signals = build_perception_signals(state)
    risks = _risks(state, scores)
    opportunity = _opportunity(state, scores)
    live_state = {
        "status": _status_from_state(state),
        "maturity": _maturity_from_state(state),
        "estado_general": _status_from_state(state),
        "madurez_operativa": _maturity_from_state(state),
        "claridad": scores["clarity"],
        "diferenciacion": scores["differentiation"],
        "percepcion_premium": scores["premium_perception"],
        "coherencia_visual": scores["visual_coherence"],
        "potencia_narrativa": scores["narrative_power"],
        "conversion_readiness": scores["conversion_readiness"],
        "scores": scores,
        "signals": signals,
        "risks": risks,
        "riesgos_detectados": risks,
        "opportunities": [opportunity],
        "oportunidad_principal": opportunity,
        "next_best_action": next_best_action,
        "proximo_paso_recomendado": next_best_action["label"],
        "razon_del_proximo_paso": next_best_action["reason"],
    }
    live_state["advisor_message"] = build_advisor_message(live_state)

    return live_state
