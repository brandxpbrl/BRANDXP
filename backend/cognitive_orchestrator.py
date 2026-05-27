from concurrent.futures import ThreadPoolExecutor, as_completed
from pathlib import Path
from time import perf_counter

from ai_provider import chat_completion, get_provider_status
from brand_analysis_engine import build_brand_analysis
from client_manager import ensure_client_from_prompt, sanitize_prompt_for_client_storage, save_client_analysis
from client_loader import load_client_context_bundle
from dynamic_agent_loader import load_all_agents

MAX_ACTIVE_AGENTS = 7
MAX_PARALLEL_AGENT_WORKERS = 2


class AnalysisSaveError(RuntimeError):
    pass


def _compact_agent_name(agent_name):
    return agent_name.replace("_agent", "").replace("_", " ").title()


def _extract_concepts(prompt, results):
    concept_bank = {
        "Brand Identity": ["identidad", "identity", "marca", "brand"],
        "Visual Direction": ["visual", "estetica", "aesthetic", "direccion"],
        "Positioning": ["posicionamiento", "positioning", "mercado"],
        "Narrative System": ["narrativa", "story", "contenido", "content"],
        "Premium Perception": ["premium", "luxury", "lujo", "percepcion"],
        "Creative Opportunity": ["oportunidad", "opportunity", "creativo"],
        "Experience Design": ["experiencia", "experience", "presencia"],
    }
    source_text = " ".join([prompt] + [result.get("response", "") for result in results]).lower()
    concepts = [
        concept
        for concept, keywords in concept_bank.items()
        if any(keyword in source_text for keyword in keywords)
    ]

    return concepts[:5] or [
        "Brand Identity",
        "Strategic Clarity",
        "Visual Direction",
        "Narrative System",
        "Creative Opportunity",
    ]


def _build_combined_text(results):
    sections = []

    for result in results:
        sections.append(f"AGENT: {result['agent']}\n\n{result['response']}")

    return "\n\n---\n\n".join(sections)


def synthesize_responses(results, prompt):
    combined_text = _build_combined_text(results)

    completion = chat_completion(
        [
            {
                "role": "system",
                "content": """
You are the Master Synthesis Agent of Brand Experience OS.

Create a useful strategic answer for a founder or creative director building a brand.

Rules:
- Write in the same language as the user.
- Merge all agent outputs into one coherent response.
- Remove repetition and weak abstraction.
- Keep premium, cinematic perception only when it adds clarity.
- Be concrete: include executive diagnosis, current gaps, score interpretation, priorities, deliverables, and next actions.
- Make every recommendation operational: what to change, why it matters, and what to produce next.
- Do not pretend a visual asset was generated if it was not generated.
- End with a short continuation path that the system can execute next.
""",
            },
            {
                "role": "user",
                "content": f"""
ORIGINAL USER REQUEST:

{prompt}

MULTI AGENT OUTPUTS:

{combined_text}
""",
            },
        ],
    )

    return {
        "content": completion["content"],
        "provider": completion["provider"],
        "fallback_used": completion["fallback_used"],
        "error": completion["error"],
    }


def run_agent(agent, user_prompt, client_context=""):
    completion = chat_completion(
        [
            {
                "role": "system",
                "content": f"""
{agent["system_prompt"]}

# SPECIALIST OPERATING RULE

Use the agent's own output_structure.md as the primary response structure.

Do not flatten your answer into a generic consulting template.
Stay inside your specialist lens and make your contribution meaningfully different from the other Brand Experience OS agents.

Every response must still include:
- evidence or signal used
- risk if ignored
- a clear next action

Be specific, practical, and concise.

# CLIENT CONTEXT

{client_context or "No explicit client context was loaded."}
""",
            },
            {
                "role": "user",
                "content": user_prompt,
            },
        ],
    )

    return {
        "agent": agent["name"],
        "label": _compact_agent_name(agent["name"]),
        "response": completion["content"],
        "provider": completion["provider"],
        "fallback_used": completion["fallback_used"],
        "error": completion["error"],
    }


def _fallback_response(prompt, agents, error_message):
    agent_labels = ", ".join(_compact_agent_name(agent["name"]) for agent in agents) or "No agents loaded"
    safe_prompt = sanitize_prompt_for_client_storage(prompt)
    provider_status = {
        **get_provider_status(),
        "active_provider": "unavailable",
        "fallback_used": True,
    }

    response = f"""El motor encontro una friccion tecnica antes de completar el analisis.

Diagnostico rapido:
- Contexto del cliente recibido: {safe_prompt}
- Agentes disponibles: {agent_labels}
- Estado: {error_message}

Mejora recomendada:
- Verificar que GEMINI_API_KEY este configurada si quieres usar Gemini como proveedor principal.
- Verificar que Ollama este activo y que el modelo `{provider_status["ollama_model"]}` este disponible como fallback local.
- Mantener el flujo multiagente ya corregido: branding, estrategia, psicologia, direccion visual, contenido, auditoria y ventas.
- Convertir cada respuesta en un entregable accionable: identidad, posicionamiento, visual system, contenido, propuesta comercial y proximos pasos.
- Si usas Ollama local, mantener 7 agentes activos pero limitar el paralelismo para evitar timeouts.

Continuacion sugerida:
Cuando Gemini u Ollama esten activos, este mismo endpoint puede devolver un analisis completo con sintesis final, conceptos recuperados y agentes consultados."""
    structured_analysis = build_brand_analysis(prompt, [], response)

    return {
        "response": response,
        "structured_analysis": structured_analysis,
        "agents": [_compact_agent_name(agent["name"]) for agent in agents],
        "concepts": _extract_concepts(prompt, []),
        "flow": [
            "Prompt captured",
            "Agents loaded",
            "AI provider unavailable",
            "Fallback diagnosis generated",
        ],
        "error": error_message,
        "provider": provider_status,
    }


def _save_client_analysis_or_raise(*args, **kwargs):
    saved_analysis = save_client_analysis(*args, **kwargs)

    if not saved_analysis:
        raise AnalysisSaveError("No client profile was available, so the analysis was not saved.")

    latest_path = saved_analysis.get("latest")

    if not latest_path or not Path(latest_path).exists():
        raise AnalysisSaveError("LATEST_ANALYSIS.md was not created.")

    if kwargs.get("structured_analysis"):
        structured_path = saved_analysis.get("structured")

        if not structured_path or not Path(structured_path).exists():
            raise AnalysisSaveError("Structured analysis JSON was not created.")

    return saved_analysis


def process_request(prompt, client_name=None):
    started_at = perf_counter()
    client = ensure_client_from_prompt(prompt, client_name)
    resolved_client_name = client["name"] if client else client_name
    client_context_bundle = (
        load_client_context_bundle(resolved_client_name)
        if resolved_client_name
        else {"context": "", "sources": [], "engines": {}}
    )
    client_context = client_context_bundle["context"]
    agents = load_all_agents()[:MAX_ACTIVE_AGENTS]

    if not prompt.strip():
        return {
            "response": "Necesito una vision, pregunta o desafio de marca para analizar.",
            "agents": [],
            "concepts": [],
            "flow": ["Waiting for input"],
            "duration_ms": 0,
        }

    if not agents:
        fallback = _fallback_response(
            prompt,
            agents,
            "No se encontraron agentes con archivos de conocimiento cargables.",
        )
        fallback["client"] = client
        return fallback

    try:
        results = []

        with ThreadPoolExecutor(
            max_workers=min(len(agents), MAX_PARALLEL_AGENT_WORKERS)
        ) as executor:
            futures = {
                executor.submit(run_agent, agent, prompt, client_context): agent
                for agent in agents
            }

            for future in as_completed(futures):
                results.append(future.result())

        results.sort(
            key=lambda result: [agent["name"] for agent in agents].index(result["agent"])
        )

        final_response = synthesize_responses(results, prompt)
        structured_analysis = build_brand_analysis(
            prompt,
            results,
            final_response["content"],
            client=client,
            client_context=client_context,
        )
        duration_ms = round((perf_counter() - started_at) * 1000)
        provider_errors = [
            error_msg
            for result in results
            if result.get("fallback_used") and (error_msg := result.get("error"))
        ]

        if final_response.get("fallback_used") and final_response.get("error"):
            provider_errors.append(final_response["error"])

        concepts = _extract_concepts(prompt, results)
        agent_labels = [result["label"] for result in results]
        provider = {
            **get_provider_status(),
            "active_provider": final_response["provider"],
            "fallback_used": any(result.get("fallback_used") for result in results)
            or final_response.get("fallback_used", False),
        }
        saved_analysis = _save_client_analysis_or_raise(
            client,
            prompt,
            final_response["content"],
            provider=provider,
            concepts=concepts,
            agents=agent_labels,
            structured_analysis=structured_analysis,
        )

        return {
            "response": final_response["content"],
            "structured_analysis": structured_analysis,
            "agents": agent_labels,
            "concepts": concepts,
            "flow": [
                "Semantic context loaded",
                "Client profile synced" if client else "No client profile detected",
                "Brand agents activated",
                "Strategic signals compared",
                "Creative direction synthesized",
                "Next actions prepared",
            ],
            "duration_ms": duration_ms,
            "provider": provider,
            "provider_errors": provider_errors[:3],
            "client": client,
            "saved_analysis": saved_analysis,
            "client_context": {
                "engines": client_context_bundle.get("engines", {}),
                "sources": client_context_bundle.get("sources", [])[:20],
                "source_count": len(client_context_bundle.get("sources", [])),
            },
        }
    except Exception as error:
        if isinstance(error, AnalysisSaveError):
            raise

        fallback = _fallback_response(prompt, agents, str(error))
        fallback["duration_ms"] = round((perf_counter() - started_at) * 1000)
        fallback["client"] = client
        fallback["client_context"] = {
            "engines": client_context_bundle.get("engines", {}),
            "sources": client_context_bundle.get("sources", [])[:20],
            "source_count": len(client_context_bundle.get("sources", [])),
        }
        fallback["saved_analysis"] = _save_client_analysis_or_raise(
            client,
            prompt,
            fallback["response"],
            provider=fallback.get("provider"),
            concepts=fallback.get("concepts"),
            agents=fallback.get("agents"),
            structured_analysis=fallback.get("structured_analysis"),
        )
        return fallback
