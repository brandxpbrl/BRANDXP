import json
from datetime import datetime

from client_manager import _client_relative_path, _load_latest_analysis, _resolve_existing_client_path, list_client_deliverables
from services.ai_client import chat_completion
from services.client_activation_engine import build_client_activation
from services.deliverables_review_engine import review_client_deliverables
from services.entity_advisor import build_entity_advisor


MAX_ENTITY_HISTORY = 18
MAX_ENTITY_CONTEXT_CHARS = 15000


ENTITY_CONVERSATION_PROFILE = {
    "name": "Brand Experience Entity",
    "role": "asesora cognitiva de marca, percepción, narrativa y movimiento estratégico",
    "temperament": [
        "calma",
        "profunda",
        "fluida",
        "precisa",
        "humana",
        "premium",
        "cinematográfica sin exagerar",
    ],
    "conversation_principles": [
        "escuchar antes de diagnosticar",
        "hacer una pregunta si la intención todavía está incompleta",
        "interpretar señales, no repetir datos crudos",
        "recomendar un movimiento por vez",
        "distinguir lo interno de lo que puede ver el cliente",
        "convertir ideas dispersas en decisiones observables",
    ],
}


def _conversation_dir(client_path):
    target = client_path / "05_ENTREGAS" / "entity_conversation"
    target.mkdir(parents=True, exist_ok=True)
    resolved_client = client_path.resolve()
    resolved_target = target.resolve()

    if resolved_target != resolved_client and resolved_client not in resolved_target.parents:
        raise ValueError("Invalid entity conversation path.")

    return target


def _history_path(client_path):
    return _conversation_dir(client_path) / "entity_conversation_history.json"


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
        "messages": messages[-MAX_ENTITY_HISTORY:],
    }
    path.write_text(json.dumps(payload, indent=2, ensure_ascii=False), encoding="utf-8")

    transcript = _conversation_dir(client_path) / "ENTITY_CONVERSATION_TRANSCRIPT.md"
    lines = [
        f"# Entity Conversation - {client_name}",
        "",
        f"- Updated at: {payload['updated_at']}",
        "",
    ]

    for item in payload["messages"]:
        role = "Usuario" if item.get("role") == "user" else "Entidad"
        lines.extend([f"## {role}", "", item.get("content", ""), ""])

    transcript.write_text("\n".join(lines).rstrip() + "\n", encoding="utf-8")

    return {
        "json": _client_relative_path(client_path, path),
        "transcript": _client_relative_path(client_path, transcript),
    }


def _latest_analysis_excerpt(client_path):
    try:
        payload, markdown, source_paths = _load_latest_analysis(client_path)
    except ValueError:
        return {
            "analysis": {},
            "markdown_excerpt": "",
            "source_paths": {},
        }

    return {
        "analysis": (payload or {}).get("analysis") or {},
        "markdown_excerpt": (markdown or "")[:3500],
        "source_paths": source_paths,
    }


def build_entity_conversation_context(client_name):
    resolved_client_name, client_path = _resolve_existing_client_path(client_name)

    if not client_path:
        return None

    advisor = build_entity_advisor(resolved_client_name) or {}
    activation = build_client_activation(resolved_client_name)
    deliverables_data = list_client_deliverables(resolved_client_name) or {"items": []}
    deliverables_review = review_client_deliverables(deliverables_data)
    latest_analysis = _latest_analysis_excerpt(client_path)
    history = _load_history(client_path)

    return {
        "client": resolved_client_name,
        "entity_profile": ENTITY_CONVERSATION_PROFILE,
        "advisor": {
            "state": advisor.get("state", {}),
            "entity_state": advisor.get("entity_state", {}),
            "recommendation": advisor.get("recommendation", {}),
            "reasoning": advisor.get("reasoning", {}),
            "fluid_messages": advisor.get("fluid_messages", {}),
        },
        "activation": activation,
        "latest_analysis": latest_analysis,
        "deliverables_review": deliverables_review,
        "history": history[-MAX_ENTITY_HISTORY:],
    }


def _system_prompt(context, mode):
    compact_context = {
        "client": context["client"],
        "entity_profile": context["entity_profile"],
        "advisor": context["advisor"],
        "activation": {
            "headline": (context.get("activation") or {}).get("headline"),
            "decision_board": (context.get("activation") or {}).get("decision_board"),
            "priority_actions": (context.get("activation") or {}).get("priority_actions"),
            "content_moves": (context.get("activation") or {}).get("content_moves"),
            "blockers": (context.get("activation") or {}).get("blockers"),
        },
        "latest_analysis": context.get("latest_analysis"),
        "deliverables_review": context.get("deliverables_review"),
    }
    context_text = json.dumps(compact_context, ensure_ascii=False, indent=2)[:MAX_ENTITY_CONTEXT_CHARS]
    visibility_rules = (
        "Modo cliente: habla simple, elegante y confiable. No menciones arquitectura interna, rutas, scripts ni detalles tecnicos."
        if mode == "client"
        else "Modo interno: podes hablar con criterio operativo, estrategia, entregables, riesgos y proximos pasos del sistema."
    )

    return f"""Sos la Entidad de Brand Experience OS.

No sos un asistente generico. Sos una presencia asesora que escucha, interpreta y guia.

Tu voz:
- Español natural, fluido y humano.
- Premium, calma, estrategica y emocionalmente inteligente.
- Frases claras. Ritmo conversacional.
- Si el usuario trae confusion, ordena.
- Si el usuario trae una idea, converti esa idea en decision.
- Si el usuario pide crear algo, devolve una pieza usable o una ruta de ejecucion.
- Si falta informacion, pedi una sola aclaracion concreta.

Reglas de respuesta:
- No repitas listas largas del dashboard.
- No digas todo lo que sabes. Interpreta.
- Recomenda un siguiente movimiento claro.
- Cuando corresponda, separa: Lectura, Movimiento recomendado, Output.
- Evita sonar corporativa, robotica, infantil, exagerada o vendedora.
- Nunca inventes archivos existentes.
- No muestres rutas locales complejas.
- {visibility_rules}

Contexto real del cliente:
{context_text}
"""


def _conversation_starter(context, mode):
    advisor = context.get("advisor") or {}
    fluid = advisor.get("fluid_messages") or {}

    if mode == "client":
        starter = fluid.get("client")
    else:
        starter = fluid.get("internal") or fluid.get("status_reading")

    return starter or "Estoy leyendo el estado del cliente. Puedo ayudarte a ordenar la proxima decision."


def run_entity_conversation(client_name, message, mode="internal"):
    resolved_client_name, client_path = _resolve_existing_client_path(client_name)

    if not client_path:
        return None

    clean_message = (message or "").strip()
    clean_mode = mode if mode in {"internal", "client"} else "internal"

    if not clean_message:
        raise ValueError("Message is required.")

    context = build_entity_conversation_context(resolved_client_name)
    history = _load_history(client_path)
    messages = [{"role": "system", "content": _system_prompt(context, clean_mode)}]

    for item in history[-8:]:
        if item.get("role") in {"user", "assistant"} and item.get("content"):
            messages.append({"role": item["role"], "content": item["content"]})

    messages.append({"role": "user", "content": clean_message})
    result = chat_completion(messages)
    now = datetime.now().isoformat(timespec="seconds")
    user_entry = {
        "role": "user",
        "content": clean_message,
        "mode": clean_mode,
        "created_at": now,
    }
    assistant_entry = {
        "role": "assistant",
        "content": result["content"],
        "provider": result.get("provider"),
        "mode": clean_mode,
        "created_at": now,
    }
    files = _save_history(client_path, resolved_client_name, history + [user_entry, assistant_entry])

    return {
        "client": resolved_client_name,
        "mode": clean_mode,
        "answer": result["content"],
        "provider": result.get("provider"),
        "fallback_used": result.get("fallback_used"),
        "error": result.get("error"),
        "starter": _conversation_starter(context, clean_mode),
        "history": _load_history(client_path),
        "files": files,
    }
