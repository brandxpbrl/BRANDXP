import json
from datetime import datetime

from client_manager import _client_relative_path, _load_latest_analysis, _resolve_existing_client_path, list_client_deliverables
from services.ai_client import chat_completion
from services.client_activation_engine import build_client_activation
from services.deliverables_review_engine import review_client_deliverables
from services.entity_advisor import build_entity_advisor


MAX_HISTORY_MESSAGES = 20
MAX_CONTEXT_CHARS = 12000


def _chat_dir(client_path):
    target = client_path / "05_ENTREGAS" / "operator_chat"
    target.mkdir(parents=True, exist_ok=True)
    resolved_client = client_path.resolve()
    resolved_target = target.resolve()

    if resolved_target != resolved_client and resolved_client not in resolved_target.parents:
        raise ValueError("Invalid chat path.")

    return target


def _history_path(client_path):
    return _chat_dir(client_path) / "chat_history.json"


def _load_history(client_path):
    path = _history_path(client_path)

    if not path.is_file():
        return []

    try:
        payload = json.loads(path.read_text(encoding="utf-8"))
    except json.JSONDecodeError:
        return []

    messages = payload.get("messages", [])
    return messages if isinstance(messages, list) else []


def _save_history(client_path, client_name, messages):
    path = _history_path(client_path)
    payload = {
        "client": client_name,
        "updated_at": datetime.now().isoformat(timespec="seconds"),
        "messages": messages[-MAX_HISTORY_MESSAGES:],
    }
    path.write_text(json.dumps(payload, indent=2, ensure_ascii=False), encoding="utf-8")

    transcript = _chat_dir(client_path) / "CHAT_TRANSCRIPT.md"
    lines = [f"# Operator Chat - {client_name}", "", f"- Updated at: {payload['updated_at']}", ""]

    for item in payload["messages"]:
        role = item.get("role", "assistant").title()
        lines.extend([f"## {role}", "", item.get("content", ""), ""])

    transcript.write_text("\n".join(lines).rstrip() + "\n", encoding="utf-8")

    return {
        "json": _client_relative_path(client_path, path),
        "transcript": _client_relative_path(client_path, transcript),
    }


def _latest_analysis_summary(client_path):
    try:
        payload, markdown, source_paths = _load_latest_analysis(client_path)
    except ValueError:
        return {
            "analysis": {},
            "markdown_excerpt": "",
            "source_paths": {},
        }

    analysis = (payload or {}).get("analysis") or {}
    return {
        "analysis": analysis,
        "markdown_excerpt": (markdown or "")[:3000],
        "source_paths": source_paths,
    }


def _suggested_prompts(activation):
    prompts = [
        {
            "id": "next_step",
            "label": "Ejecutar proximo paso",
            "prompt": "Usa el Activation Board y converti el proximo paso recomendado en una secuencia operativa de 5 acciones concretas.",
        },
        {
            "id": "client_message",
            "label": "Mensaje para cliente",
            "prompt": "Escribi un mensaje claro, elegante y breve para explicarle al cliente que se hizo, que falta revisar y cual es el proximo movimiento.",
        },
        {
            "id": "content_piece",
            "label": "Crear pieza de contenido",
            "prompt": "Toma el primer movimiento de contenido sugerido y crea una pieza lista para publicar con copy, direccion visual y CTA.",
        },
        {
            "id": "deliverables_plan",
            "label": "Ordenar entregables",
            "prompt": "Revisa el pipeline productivo y arma una lista de entregables que deben aprobarse, regenerarse o archivarse.",
        },
    ]

    for item in (activation or {}).get("priority_actions", [])[:3]:
        prompts.append(
            {
                "id": f"priority_{item.get('id')}",
                "label": f"Activar: {item.get('label')}",
                "prompt": f"Ejecuta esta prioridad para el cliente: {item.get('action')}. Explica objetivo, pasos, output esperado y criterio de aprobacion.",
            }
        )

    return prompts


def build_client_chat_context(client_name):
    resolved_client_name, client_path = _resolve_existing_client_path(client_name)

    if not client_path:
        return None

    activation = build_client_activation(resolved_client_name)
    advisor = build_entity_advisor(resolved_client_name) or {}
    latest = _latest_analysis_summary(client_path)
    deliverables_data = list_client_deliverables(resolved_client_name) or {"items": []}
    deliverables_review = review_client_deliverables(deliverables_data)
    history = _load_history(client_path)

    return {
        "client": resolved_client_name,
        "activation": activation,
        "advisor": {
            "recommendation": advisor.get("recommendation", {}),
            "fluid_messages": advisor.get("fluid_messages", {}),
            "entity_state": advisor.get("entity_state", {}),
        },
        "latest_analysis": latest,
        "deliverables_review": deliverables_review,
        "suggested_prompts": _suggested_prompts(activation),
        "history": history[-MAX_HISTORY_MESSAGES:],
    }


def _system_prompt(context):
    activation = context.get("activation") or {}
    advisor = context.get("advisor") or {}
    latest = context.get("latest_analysis") or {}
    deliverables_review = context.get("deliverables_review") or {}
    compact_context = {
        "client": context["client"],
        "activation_headline": activation.get("headline"),
        "decision_board": activation.get("decision_board"),
        "priority_actions": activation.get("priority_actions"),
        "production_pipeline": activation.get("production_pipeline"),
        "content_moves": activation.get("content_moves"),
        "blockers": activation.get("blockers"),
        "advisor": advisor,
        "analysis": latest.get("analysis"),
        "analysis_markdown_excerpt": latest.get("markdown_excerpt"),
        "deliverables_review": deliverables_review,
    }
    context_text = json.dumps(compact_context, ensure_ascii=False, indent=2)[:MAX_CONTEXT_CHARS]

    return f"""Sos el Client Operator de Brand Experience OS.

Tu trabajo no es responder como chat generico. Tu trabajo es convertir el estado real del cliente en acciones, prompts y decisiones ejecutables.

Reglas:
- Responde en espanol.
- Usa el contexto real del cliente.
- Da un proximo paso claro.
- Si el usuario pide ejecutar un prompt, desarrollalo como output util.
- Si falta informacion, deci exactamente que falta y que accion tomar.
- No inventes archivos como existentes.
- No expongas rutas locales complejas al cliente final.
- Mantene tono estrategico, premium, claro y operativo.

Contexto del cliente:
{context_text}
"""


def run_client_chat(client_name, message, prompt_id=None):
    resolved_client_name, client_path = _resolve_existing_client_path(client_name)

    if not client_path:
        return None

    clean_message = (message or "").strip()

    if not clean_message:
        raise ValueError("Message is required.")

    context = build_client_chat_context(resolved_client_name)
    prompt = clean_message

    if prompt_id:
        selected = next(
            (item for item in context.get("suggested_prompts", []) if item.get("id") == prompt_id),
            None,
        )

        if selected:
            if clean_message == selected["prompt"]:
                prompt = selected["prompt"]
            else:
                prompt = f"{selected['prompt']}\n\nInstruccion adicional del usuario:\n{clean_message}"

    history = _load_history(client_path)
    messages = [{"role": "system", "content": _system_prompt(context)}]

    for item in history[-8:]:
        if item.get("role") in {"user", "assistant"} and item.get("content"):
            messages.append({"role": item["role"], "content": item["content"]})

    messages.append({"role": "user", "content": prompt})
    result = chat_completion(messages)
    now = datetime.now().isoformat(timespec="seconds")
    user_entry = {
        "role": "user",
        "content": clean_message,
        "prompt_id": prompt_id,
        "created_at": now,
    }
    assistant_entry = {
        "role": "assistant",
        "content": result["content"],
        "provider": result.get("provider"),
        "created_at": now,
    }
    files = _save_history(client_path, resolved_client_name, history + [user_entry, assistant_entry])

    return {
        "client": resolved_client_name,
        "answer": result["content"],
        "provider": result.get("provider"),
        "fallback_used": result.get("fallback_used"),
        "error": result.get("error"),
        "history": _load_history(client_path),
        "files": files,
    }
