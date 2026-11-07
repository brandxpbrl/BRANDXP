import json
import re
import unicodedata
from datetime import datetime
from pathlib import Path
from uuid import uuid4

from services.orbis_agent_registry import get_orbis_agent


PROJECT_ROOT = Path(__file__).resolve().parents[2]
REPORTS_ROOT = PROJECT_ROOT / "output" / "orbis-agent-reports"


def _clean(value):
    return " ".join(str(value or "").replace("\n", " ").split()).strip()


def _slug(value):
    normalized = unicodedata.normalize("NFKD", _clean(value))
    ascii_value = normalized.encode("ascii", "ignore").decode("ascii")
    return re.sub(r"[^a-z0-9]+", "-", ascii_value.casefold()).strip("-") or "orbis"


def _metric(metric):
    return {
        "label": _clean(metric.get("label")),
        "value": _clean(metric.get("value")),
        "change": _clean(metric.get("change")),
        "period": _clean(metric.get("period")),
        "source": _clean(metric.get("source")),
        "method": _clean(metric.get("method")),
    }


def _evidence(item):
    return {
        "claim": _clean(item.get("claim")),
        "source": _clean(item.get("source")),
        "url": _clean(item.get("url")),
        "published_at": _clean(item.get("published_at")),
        "confidence": _clean(item.get("confidence")) or "medium",
    }


def _quality_check(metrics, evidence):
    warnings = []
    for index, metric in enumerate(metrics, start=1):
        missing = [key for key in ("label", "value", "period", "source") if not metric[key]]
        if missing:
            warnings.append(f"Metrica {index}: faltan {', '.join(missing)}.")

    for index, item in enumerate(evidence, start=1):
        missing = [key for key in ("claim", "source") if not item[key]]
        if missing:
            warnings.append(f"Evidencia {index}: faltan {', '.join(missing)}.")

    periods = {metric["period"] for metric in metrics if metric["period"]}
    if len(periods) > 1:
        warnings.append(
            "Hay metricas de periodos diferentes. Deben compararse por separado y no sumarse."
        )

    return {
        "status": "review_required" if warnings else "verified_input",
        "warnings": warnings,
        "metrics_with_source": sum(bool(metric["source"]) for metric in metrics),
        "metrics_total": len(metrics),
        "evidence_total": len(evidence),
    }


def _first_metric(metrics, *terms):
    for metric in metrics:
        label = metric["label"].casefold()
        if any(term in label for term in terms):
            return metric
    return None


def _metric_sentence(metric):
    if not metric:
        return ""
    change = f", con una variacion de {metric['change']}" if metric["change"] else ""
    return f"{metric['label']}: {metric['value']}{change}, durante {metric['period']}"


def _build_axiom_script(company, metrics, evidence, objective, duration_seconds):
    views = _first_metric(metrics, "visualiza", "view")
    revenue = _first_metric(metrics, "ingreso", "revenue")
    reach = _first_metric(metrics, "no seguidor", "non-follower", "alcance")
    strongest = evidence[0] if evidence else None

    lines = [
        "Actualizacion financiera de ORBIS Corporation.",
        f"{company} ya registra resultados medibles en una nueva fuente de monetizacion digital.",
    ]
    if views:
        lines.append(f"El panel informa {_metric_sentence(views)}.")
    if revenue:
        lines.append(
            f"Tambien registra {_metric_sentence(revenue)}. Es una cifra inicial, pero valida que el circuito de ingresos funciona."
        )
    if strongest:
        lines.append(f"Como contexto verificado: {strongest['claim']}")
    if reach:
        lines.append(f"Otra senal de expansion: {_metric_sentence(reach)}.")
    lines.append(
        "La conclusion es simple: el modelo fue validado. Ahora debemos medir, optimizar y escalar sin proyectar ingresos sin evidencia."
    )

    script = "\n\n".join(lines)
    words = script.split()
    max_words = max(55, int(duration_seconds * 2.15))
    if len(words) > max_words:
        script = " ".join(words[:max_words]).rsplit(".", 1)[0].strip() + "."
    return script


def _build_generic_script(agent, company, metrics, evidence, objective, duration_seconds):
    facts = "; ".join(_metric_sentence(metric) for metric in metrics[:3])
    context = evidence[0]["claim"] if evidence else ""
    script = (
        f"Soy {agent['name']}, {agent['role']} en ORBIS. "
        f"Presento una lectura breve sobre {company}. "
        f"El objetivo es {objective}. "
        f"Los datos confirmados indican: {facts}. "
        f"{context} "
        "Esta es una lectura preliminar basada en las fuentes declaradas. El siguiente paso es validar la decision humana y ejecutar la accion correspondiente."
    )
    max_words = max(55, int(duration_seconds * 2.15))
    words = script.split()
    return " ".join(words[:max_words]).strip()


def _build_video_plan(agent, metrics, evidence, duration_seconds):
    scenes = [
        {
            "start": 0,
            "end": min(5, duration_seconds),
            "visual": f"Avatar de {agent['name']} con placa de cargo",
            "overlay": "Actualizacion ORBIS",
        }
    ]
    cursor = scenes[0]["end"]
    usable = max(duration_seconds - cursor - 6, 1)
    metric_duration = max(int(usable / max(len(metrics[:3]), 1)), 3)
    for metric in metrics[:3]:
        end = min(cursor + metric_duration, duration_seconds - 6)
        scenes.append(
            {
                "start": cursor,
                "end": end,
                "visual": metric["source"] or "Fuente de datos declarada",
                "overlay": f"{metric['label']}: {metric['value']}",
                "period": metric["period"],
            }
        )
        cursor = end
    if evidence and cursor < duration_seconds - 3:
        end = min(cursor + 6, duration_seconds - 3)
        scenes.append(
            {
                "start": cursor,
                "end": end,
                "visual": "Placa de contexto con fuente visible",
                "overlay": evidence[0]["claim"],
                "source": evidence[0]["source"],
            }
        )
        cursor = end
    scenes.append(
        {
            "start": cursor,
            "end": duration_seconds,
            "visual": f"Cierre con {agent['name']}",
            "overlay": "Medir. Optimizar. Escalar.",
        }
    )
    return {
        "duration_seconds": duration_seconds,
        "format": "vertical_9_16",
        "captions": True,
        "scenes": scenes,
        "editor_notes": [
            "No mostrar dos capturas completas al mismo tiempo.",
            "Usar acercamientos sobre una metrica por escena.",
            "Mantener visible la fuente y el periodo de cada cifra.",
        ],
    }


def _markdown(result):
    metrics = "\n".join(
        f"- **{item['label']}:** {item['value']} | Periodo: {item['period']} | Fuente: {item['source']}"
        for item in result["report"]["metrics"]
    ) or "- Sin metricas declaradas."
    evidence = "\n".join(
        f"- {item['claim']} — {item['source']} {item['url']}"
        for item in result["report"]["evidence"]
    ) or "- Sin evidencia externa declarada."
    warnings = "\n".join(f"- {item}" for item in result["quality"]["warnings"]) or "- Sin alertas."
    return f"""# Reporte operativo — {result['agent']['name']}

Generado: {result['generated_at']}

## Resumen ejecutivo
- Unidad: {result['report']['company']}
- Objetivo: {result['report']['objective']}
- Estado: {result['quality']['status']}

## Indicadores
{metrics}

## Evidencia contextual
{evidence}

## Alertas de calidad
{warnings}

## Guion para vocero
{result['voice_script']}
"""


def _persist(result):
    generated = datetime.fromisoformat(result["generated_at"].replace("Z", "+00:00"))
    directory = REPORTS_ROOT / _slug(result["report"]["company"]) / result["agent"]["id"] / generated.strftime("%Y-%m-%d")
    directory.mkdir(parents=True, exist_ok=True)
    base = directory / result["report_id"]
    json_path = base.with_suffix(".json")
    markdown_path = base.with_suffix(".md")
    json_path.write_text(json.dumps(result, ensure_ascii=False, indent=2), encoding="utf-8")
    markdown_path.write_text(_markdown(result), encoding="utf-8")
    return {"json": str(json_path), "markdown": str(markdown_path)}


def generate_agent_report(payload, persist=True):
    agent = get_orbis_agent(payload.get("agent_id"), include_internal=True)
    if not agent:
        raise ValueError("Agente ORBIS no encontrado.")

    company = _clean(payload.get("company"))
    objective = _clean(payload.get("objective"))
    if not company or not objective:
        raise ValueError("Company y objective son obligatorios.")

    metrics = [_metric(item) for item in payload.get("metrics") or []]
    evidence = [_evidence(item) for item in payload.get("evidence") or []]
    duration_seconds = min(max(int(payload.get("duration_seconds") or 45), 20), 120)
    quality = _quality_check(metrics, evidence)
    public_agent = {
        "id": agent["id"],
        "name": agent["name"],
        "role": agent["role"],
        "mission": agent["mission"],
    }

    if agent["id"] == "axiom":
        voice_script = _build_axiom_script(company, metrics, evidence, objective, duration_seconds)
    else:
        voice_script = _build_generic_script(agent, company, metrics, evidence, objective, duration_seconds)

    result = {
        "report_id": f"report-{uuid4().hex[:12]}",
        "generated_at": datetime.now().astimezone().isoformat(timespec="seconds"),
        "agent": public_agent,
        "report": {
            "company": company,
            "period": _clean(payload.get("period")),
            "objective": objective,
            "audience": _clean(payload.get("audience")) or "Audiencia ORBIS",
            "channel": _clean(payload.get("channel")) or "video",
            "metrics": metrics,
            "evidence": evidence,
            "findings": [_clean(item) for item in payload.get("findings") or [] if _clean(item)],
            "risks": [_clean(item) for item in payload.get("risks") or [] if _clean(item)],
            "recommendations": [_clean(item) for item in payload.get("recommendations") or [] if _clean(item)],
            "approval_status": "draft_requires_human_approval",
        },
        "quality": quality,
        "voice_script": voice_script,
        "video_plan": _build_video_plan(agent, metrics, evidence, duration_seconds),
        "next_step": "Validacion humana antes de publicar, enviar o ejecutar una decision externa.",
    }

    result["files"] = _persist(result) if persist else {}
    return result
