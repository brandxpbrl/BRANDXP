import json
from datetime import datetime

from client_manager import _client_relative_path, _load_latest_analysis, _resolve_existing_client_path, list_client_deliverables
from services.deliverables_review_engine import review_client_deliverables
from services.entity_advisor import build_entity_advisor


def _as_list(value):
    return value if isinstance(value, list) else []


def _analysis_from_payload(payload):
    return (payload or {}).get("analysis") or {}


def _text(value, fallback="Pendiente de definir."):
    if value is None:
        return fallback

    if isinstance(value, str):
        return value.strip() or fallback

    return str(value)


def _priority_actions(analysis, entity_state):
    priorities = _as_list(analysis.get("priorities"))
    actions = []

    for index, item in enumerate(priorities[:5], start=1):
        actions.append(
            {
                "id": f"priority_{index}",
                "label": _text(item.get("title"), f"Prioridad {index}"),
                "why": _text(item.get("reason"), "La lectura del framework la marca como movimiento relevante."),
                "action": _text(item.get("action"), "Convertir esta prioridad en una accion concreta."),
                "owner": "Brand Experience",
                "status": "ready",
                "urgency": _text(item.get("urgency"), "media"),
                "evidence": "LATEST_ANALYSIS",
            }
        )

    if not actions:
        next_action = entity_state.get("next_best_action", {})
        actions.append(
            {
                "id": "entity_next_best_action",
                "label": _text(next_action.get("label"), "Revisar direccion estrategica"),
                "why": _text(next_action.get("reason"), "Es el movimiento con mayor impacto inmediato."),
                "action": _text(next_action.get("label"), "Revisar direccion estrategica"),
                "owner": "Brand Experience",
                "status": "ready",
                "urgency": "alta",
                "evidence": "Entidad Asesora",
            }
        )

    return actions


def _production_pipeline(analysis, deliverables_review):
    deliverables = _as_list(analysis.get("deliverables"))
    pipeline = []

    for index, item in enumerate(deliverables[:6], start=1):
        pipeline.append(
            {
                "id": f"deliverable_{index}",
                "name": _text(item.get("name"), f"Entregable {index}"),
                "outcome": _text(item.get("outcome"), "Debe transformarse en una pieza visible."),
                "next_action": (_as_list(item.get("actions")) or ["Preparar version revisable."])[0],
                "status": "in_review",
            }
        )

    if not pipeline:
        for index, item in enumerate(deliverables_review.get("recommended_review", [])[:6], start=1):
            pipeline.append(
                {
                    "id": f"review_{index}",
                    "name": item["name"],
                    "outcome": "Material existente listo para curadoria.",
                    "next_action": "Revisar, validar y decidir si pasa a version cliente.",
                    "status": "in_review",
                }
            )

    return pipeline


def _content_moves(analysis):
    moves = []

    for index, pillar in enumerate(_as_list(analysis.get("content_pillars"))[:5], start=1):
        formats = _as_list(pillar.get("formats"))
        moves.append(
            {
                "id": f"content_{index}",
                "pillar": _text(pillar.get("name"), f"Pilar {index}"),
                "role": _text(pillar.get("role"), "Construir percepcion y confianza."),
                "format": formats[0] if formats else "Post / Reel",
                "observable_output": "Una pieza publicada o lista para aprobacion.",
            }
        )

    return moves


def _metrics(analysis, deliverables_review, entity_state):
    scores = entity_state.get("scores", {})
    review_summary = deliverables_review.get("summary", {})

    return [
        {"label": "Claridad", "value": scores.get("clarity", 0), "type": "score"},
        {"label": "Diferenciacion", "value": scores.get("differentiation", 0), "type": "score"},
        {"label": "Percepcion premium", "value": scores.get("premium_perception", 0), "type": "score"},
        {"label": "Entregables", "value": review_summary.get("total_files", 0), "type": "count"},
        {"label": "Entregables core", "value": review_summary.get("core_deliverables", 0), "type": "count"},
        {"label": "Duplicados", "value": review_summary.get("duplicate_groups", 0), "type": "warning"},
        {"label": "Score framework", "value": analysis.get("overall_score", 0), "type": "score"},
        {"label": "Confianza", "value": analysis.get("confidence", 0), "type": "score"},
    ]


def _decision_board(analysis, entity_state, deliverables_review):
    diagnosis = analysis.get("diagnosis") or {}

    return {
        "current_state": _text(diagnosis.get("current_state"), "El cliente tiene informacion suficiente para una lectura inicial."),
        "main_gap": _text(diagnosis.get("main_gap"), (entity_state.get("risks") or ["Falta convertir analisis en accion visible."])[0]),
        "strategic_decision": _text(diagnosis.get("strategic_decision"), entity_state.get("razon_del_proximo_paso")),
        "next_visible_output": deliverables_review.get("next_action") or entity_state.get("next_best_action", {}).get("label"),
        "definition_of_done": "Una decision aprobada, un entregable revisado y una proxima pieza lista para producir.",
    }


def build_client_activation(client_name):
    resolved_client_name, client_path = _resolve_existing_client_path(client_name)

    if not client_path:
        return None

    advisor_data = build_entity_advisor(resolved_client_name)
    entity_state = advisor_data.get("entity_state", {}) if advisor_data else {}
    deliverables_data = list_client_deliverables(resolved_client_name) or {"items": []}
    deliverables_review = review_client_deliverables(deliverables_data)

    try:
        analysis_payload, markdown_text, source_paths = _load_latest_analysis(client_path)
    except ValueError:
        analysis_payload, markdown_text, source_paths = None, "", {}

    analysis = _analysis_from_payload(analysis_payload)
    priorities = _priority_actions(analysis, entity_state)
    pipeline = _production_pipeline(analysis, deliverables_review)
    content_moves = _content_moves(analysis)
    metrics = _metrics(analysis, deliverables_review, entity_state)
    blockers = []

    if deliverables_review.get("summary", {}).get("duplicate_groups", 0):
        blockers.append("Hay versiones duplicadas que deben limpiarse antes de exportar.")

    if not deliverables_review.get("summary", {}).get("has_master"):
        blockers.append("Falta un Master Brand Experience como pieza central de entrega.")

    if not analysis:
        blockers.append("No hay analisis estructurado disponible; usar LATEST_ANALYSIS.md como fallback.")

    return {
        "client": resolved_client_name,
        "generated_at": datetime.now().isoformat(timespec="seconds"),
        "activation_state": "ready" if analysis or markdown_text else "pending",
        "headline": _text(analysis.get("headline"), entity_state.get("advisor_message", "Lectura lista para convertir en accion.")),
        "decision_board": _decision_board(analysis, entity_state, deliverables_review),
        "priority_actions": priorities,
        "production_pipeline": pipeline,
        "content_moves": content_moves,
        "observable_metrics": metrics,
        "blockers": blockers,
        "source_map": {
            "latest_analysis_json": source_paths.get("json"),
            "latest_analysis_markdown": source_paths.get("markdown"),
            "markdown_chars": len(markdown_text or ""),
            "deliverables_total": deliverables_review.get("summary", {}).get("total_files", 0),
            "entity_state": entity_state.get("status"),
        },
    }


def _activation_dir(client_path):
    target = client_path / "05_ENTREGAS" / "activation"
    target.mkdir(parents=True, exist_ok=True)
    resolved_client = client_path.resolve()
    resolved_target = target.resolve()

    if resolved_target != resolved_client and resolved_client not in resolved_target.parents:
        raise ValueError("Invalid activation path.")

    return target


def _render_activation_sprint(plan):
    lines = [
        f"# Activation Sprint - {plan['client']}",
        "",
        f"- Generated at: {plan['generated_at']}",
        f"- State: {plan['activation_state']}",
        "",
        "## Decision Board",
        "",
    ]
    decision = plan.get("decision_board", {})

    for label, key in [
        ("Estado actual", "current_state"),
        ("Brecha", "main_gap"),
        ("Decision estrategica", "strategic_decision"),
        ("Proximo output visible", "next_visible_output"),
        ("Hecho cuando", "definition_of_done"),
    ]:
        lines.append(f"- **{label}:** {decision.get(key, 'Pendiente')}")

    lines.extend(["", "## Prioridades accionables", ""])

    for item in plan.get("priority_actions", []):
        lines.extend(
            [
                f"### {item['label']}",
                f"- Urgencia: {item['urgency']}",
                f"- Accion: {item['action']}",
                f"- Por que importa: {item['why']}",
                f"- Responsable: {item['owner']}",
                "",
            ]
        )

    lines.extend(["## Pipeline productivo", ""])

    for item in plan.get("production_pipeline", []):
        lines.extend(
            [
                f"### {item['name']}",
                f"- Estado: {item['status']}",
                f"- Output esperado: {item['outcome']}",
                f"- Proxima accion: {item['next_action']}",
                "",
            ]
        )

    lines.extend(["## Bloqueos", ""])
    blockers = plan.get("blockers", [])
    lines.extend(f"- {blocker}" for blocker in blockers) if blockers else lines.append("- Sin bloqueos criticos.")

    return "\n".join(lines).rstrip() + "\n"


def _render_portal_summary(plan):
    decision = plan.get("decision_board", {})
    first_priority = (plan.get("priority_actions") or [{}])[0]

    return f"""# Client Portal Summary - {plan['client']}

## Lectura ejecutiva

{plan.get('headline', 'La marca tiene una lectura lista para activar.')}

## Decision principal

{decision.get('strategic_decision', 'Definir la siguiente decision estrategica.')}

## Brecha principal

{decision.get('main_gap', 'Convertir analisis en accion observable.')}

## Proximo paso recomendado

{first_priority.get('action', decision.get('next_visible_output', 'Revisar entregables.'))}

## Criterio de avance

{decision.get('definition_of_done', 'Una decision aprobada y un entregable listo para mostrar.')}
"""


def _render_campaign(plan):
    decision = plan.get("decision_board", {})
    priorities = plan.get("priority_actions", [])
    content_moves = plan.get("content_moves", [])
    first_priority = priorities[0] if priorities else {}

    lines = [
        f"# Strategic Campaign - {plan['client']}",
        "",
        f"- Generated at: {plan['generated_at']}",
        "- Status: draft",
        "- Visibility: internal",
        "",
        "## Campaign Role",
        "",
        (
            decision.get("strategic_decision")
            or first_priority.get("why")
            or "Convertir la base estrategica del cliente en movimiento visible."
        ),
        "",
        "## Core Message",
        "",
        plan.get("headline", "La marca ya tiene una direccion lista para activarse."),
        "",
        "## Campaign Objective",
        "",
        first_priority.get("action", decision.get("next_visible_output", "Crear una primera accion visible.")),
        "",
        "## Content Moves",
        "",
    ]

    if content_moves:
        for item in content_moves[:5]:
            lines.extend(
                [
                    f"### {item.get('pillar', 'Movimiento de contenido')}",
                    f"- Rol: {item.get('role', 'Construir percepcion.')}",
                    f"- Formato: {item.get('format', 'Post / Reel')}",
                    f"- Output observable: {item.get('observable_output', 'Pieza lista para revision.')}",
                    "",
                ]
            )
    else:
        lines.extend(
            [
                "### Movimiento 1 - Autoridad",
                "- Rol: mostrar la esencia y el punto de vista del cliente.",
                "- Formato: Reel narrativo / post manifesto.",
                "- Output observable: primera pieza lista para aprobacion.",
                "",
                "### Movimiento 2 - Confianza",
                "- Rol: convertir historia y evidencia en percepcion de valor.",
                "- Formato: carrusel educativo / testimonio guiado.",
                "- Output observable: pieza de validacion lista para revision.",
                "",
            ]
        )

    lines.extend(
        [
            "## Next Decision",
            "",
            decision.get("definition_of_done", "Aprobar direccion, ordenar entregables y producir la primera pieza visible."),
        ]
    )

    return "\n".join(lines).rstrip() + "\n"


def _render_evolution_timeline(plan):
    decision = plan.get("decision_board", {})
    priorities = plan.get("priority_actions", [])
    pipeline = plan.get("production_pipeline", [])
    phases = [
        {
            "title": "Fase 1 - Sintesis",
            "goal": "Ordenar lo generado y decidir que se muestra al cliente.",
            "action": decision.get("next_visible_output", "Revisar entregables."),
        },
        {
            "title": "Fase 2 - Activacion",
            "goal": "Convertir estrategia en una pieza o campana visible.",
            "action": (priorities[0] or {}).get("action", "Preparar la primera accion visible.") if priorities else "Preparar la primera accion visible.",
        },
        {
            "title": "Fase 3 - Expansion",
            "goal": "Medir respuesta, ajustar percepcion y preparar crecimiento comercial.",
            "action": (pipeline[0] or {}).get("next_action", "Definir siguiente output.") if pipeline else "Definir siguiente output.",
        },
    ]

    lines = [
        f"# Evolution Timeline - {plan['client']}",
        "",
        f"- Generated at: {plan['generated_at']}",
        "- Status: draft",
        "- Visibility: internal",
        "",
        "## Strategic Direction",
        "",
        decision.get("strategic_decision", plan.get("headline", "La marca necesita evolucionar con orden y visibilidad.")),
        "",
    ]

    for phase in phases:
        lines.extend(
            [
                f"## {phase['title']}",
                "",
                f"- Objetivo: {phase['goal']}",
                f"- Accion: {phase['action']}",
                "- Criterio de avance: decision tomada y output observable.",
                "",
            ]
        )

    return "\n".join(lines).rstrip() + "\n"


def create_activation_sprint(client_name):
    resolved_client_name, client_path = _resolve_existing_client_path(client_name)

    if not client_path:
        return None

    plan = build_client_activation(resolved_client_name)
    target_dir = _activation_dir(client_path)
    json_path = target_dir / "activation_sprint.json"
    md_path = target_dir / "ACTIVATION_SPRINT.md"

    json_path.write_text(json.dumps(plan, indent=2, ensure_ascii=False), encoding="utf-8")
    md_path.write_text(_render_activation_sprint(plan), encoding="utf-8")

    return {
        "client": resolved_client_name,
        "status": "created",
        "files": [
            _client_relative_path(client_path, json_path),
            _client_relative_path(client_path, md_path),
        ],
        "sprint": plan,
    }


def generate_strategic_campaign(client_name):
    resolved_client_name, client_path = _resolve_existing_client_path(client_name)

    if not client_path:
        return None

    plan = build_client_activation(resolved_client_name)
    target_dir = client_path / "05_ENTREGAS" / "campaigns"
    target_dir.mkdir(parents=True, exist_ok=True)
    md_path = target_dir / "STRATEGIC_CAMPAIGN.md"
    json_path = target_dir / "strategic_campaign.json"
    payload = {
        "client": resolved_client_name,
        "generated_at": datetime.now().isoformat(timespec="seconds"),
        "status": "draft",
        "visibility": "internal",
        "campaign": {
            "role": plan.get("decision_board", {}).get("strategic_decision"),
            "objective": (plan.get("priority_actions") or [{}])[0].get("action"),
            "next_decision": plan.get("decision_board", {}).get("definition_of_done"),
            "content_moves": plan.get("content_moves", []),
        },
    }

    md_path.write_text(_render_campaign(plan), encoding="utf-8")
    json_path.write_text(json.dumps(payload, indent=2, ensure_ascii=False), encoding="utf-8")

    return {
        "client": resolved_client_name,
        "status": "created",
        "files": [
            _client_relative_path(client_path, md_path),
            _client_relative_path(client_path, json_path),
        ],
        "campaign": payload,
    }


def generate_evolution_timeline(client_name):
    resolved_client_name, client_path = _resolve_existing_client_path(client_name)

    if not client_path:
        return None

    plan = build_client_activation(resolved_client_name)
    target_dir = client_path / "05_ENTREGAS"
    target_dir.mkdir(parents=True, exist_ok=True)
    md_path = target_dir / "evolution_timeline.md"
    json_path = target_dir / "evolution_timeline.json"
    payload = {
        "client": resolved_client_name,
        "generated_at": datetime.now().isoformat(timespec="seconds"),
        "status": "draft",
        "visibility": "internal",
        "phases": [
            "Sintesis",
            "Activacion",
            "Expansion",
        ],
    }

    md_path.write_text(_render_evolution_timeline(plan), encoding="utf-8")
    json_path.write_text(json.dumps(payload, indent=2, ensure_ascii=False), encoding="utf-8")

    return {
        "client": resolved_client_name,
        "status": "created",
        "files": [
            _client_relative_path(client_path, md_path),
            _client_relative_path(client_path, json_path),
        ],
        "timeline": payload,
    }


def generate_client_portal_summary(client_name):
    resolved_client_name, client_path = _resolve_existing_client_path(client_name)

    if not client_path:
        return None

    plan = build_client_activation(resolved_client_name)
    target_dir = _activation_dir(client_path)
    summary_path = target_dir / "CLIENT_PORTAL_SUMMARY.md"
    summary_path.write_text(_render_portal_summary(plan), encoding="utf-8")

    return {
        "client": resolved_client_name,
        "status": "created",
        "file": _client_relative_path(client_path, summary_path),
    }


def mark_deliverables_reviewed(client_name):
    resolved_client_name, client_path = _resolve_existing_client_path(client_name)

    if not client_path:
        return None

    deliverables_data = list_client_deliverables(resolved_client_name) or {"items": []}
    review = review_client_deliverables(deliverables_data)
    target_dir = client_path / "05_ENTREGAS"
    target_dir.mkdir(parents=True, exist_ok=True)
    review_path = target_dir / "deliverables_review.json"
    payload = {
        "client": resolved_client_name,
        "reviewed_at": datetime.now().isoformat(timespec="seconds"),
        "status": "reviewed",
        "review": review,
    }
    review_path.write_text(json.dumps(payload, indent=2, ensure_ascii=False), encoding="utf-8")

    return {
        "client": resolved_client_name,
        "status": "reviewed",
        "file": _client_relative_path(client_path, review_path),
        "review": review,
    }
