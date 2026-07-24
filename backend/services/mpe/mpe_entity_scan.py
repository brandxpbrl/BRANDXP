import json
from datetime import datetime

from client_manager import _client_relative_path, _resolve_existing_client_path
from services.mpe.mpe_adapter import build_mpe_client_snapshot
from services.mpe.mpe_contracts import clamp01, normalize_mpe_axes, validate_mpe_scan
from services.mpe.mpe_geometry_mapper import map_entity_geometry
from services.mpe.mpe_report_renderer import render_mpe_entity_scan_markdown


ENGINE_NAME = "MPE Entity Scan"
ENGINE_VERSION = "0.1"


def run_mpe_entity_scan(client_name: str, persist: bool = True) -> dict:
    snapshot = build_mpe_client_snapshot(client_name)

    if not snapshot:
        return {}

    axes = normalize_mpe_axes(snapshot)
    possibility_score = _calculate_possibility_score(axes)
    main_contradiction = _main_contradiction(snapshot, axes)
    latent_possibility = _latent_possibility(snapshot, axes)
    fertile_constraint = _fertile_constraint(snapshot, axes)
    recommended_path = _recommended_path(snapshot, axes, fertile_constraint)
    noise_sources = _noise_sources(snapshot)
    scan = {
        "client": snapshot["client"],
        "engine": ENGINE_NAME,
        "version": ENGINE_VERSION,
        "generated_at": datetime.now().isoformat(timespec="seconds"),
        "possibility_score": possibility_score,
        "evolution_stage": _evolution_stage(axes, possibility_score),
        "main_contradiction": main_contradiction,
        "latent_possibility": latent_possibility,
        "fertile_constraint": fertile_constraint,
        "noise_sources": noise_sources,
        "recommended_path": recommended_path,
        "geometry": {},
        "morphogenesis_seed": axes,
        "snapshot_scores": snapshot.get("scores", {}),
        "source_summary": _source_summary(snapshot),
    }
    scan["geometry"] = map_entity_geometry(scan)
    scan["validation"] = validate_mpe_scan(scan)

    if persist:
        scan["files"] = _persist_scan(snapshot["client"], scan)

    return scan


def load_persisted_mpe_entity_scan(client_name: str) -> dict | None:
    _resolved_name, client_path = _resolve_existing_client_path(client_name)

    if not client_path:
        return None

    path = client_path / "11_MPE_ENTITY_SCAN" / "mpe_entity_scan.json"
    resolved_client = client_path.resolve()
    resolved_path = path.resolve(strict=False)

    if resolved_path != resolved_client and resolved_client not in resolved_path.parents:
        raise ValueError("Invalid MPE scan path.")

    if not path.is_file():
        return None

    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except json.JSONDecodeError as error:
        raise ValueError("Persisted MPE Entity Scan is invalid.") from error


def _calculate_possibility_score(axes):
    positive_average = (axes["D"] + axes["R"] + axes["V"] + axes["F"] + axes["M"] + axes["E"]) / 6
    score = positive_average * (1 - axes["N"] * 0.55)
    return round(clamp01(score), 4)


def _evolution_stage(axes, possibility_score):
    if axes["N"] >= 0.48 and axes["D"] < 0.55:
        return "apertura"
    if axes["N"] >= 0.38:
        return "restriccion_fertil"
    if axes["R"] >= 0.62 and axes["V"] >= 0.58 and possibility_score < 0.72:
        return "coherencia_creciente"
    if axes["F"] >= 0.70 and possibility_score >= 0.62:
        return "expansion_viable"
    if possibility_score >= 0.78:
        return "sistema_maduro"
    return "direccion"


def _main_contradiction(snapshot, axes):
    risks = snapshot.get("risks") or []
    blockers = (snapshot.get("source", {}).get("activation") or {}).get("blockers") or []
    scores = snapshot.get("scores") or {}

    if blockers:
        return blockers[0]
    if risks:
        return risks[0]
    if axes["N"] >= 0.42:
        return "La entidad tiene potencial, pero el ruido operativo todavia bloquea una decision clara."
    if scores.get("conversion_readiness", 0) < 70 and scores.get("premium_perception", 0) >= 70:
        return "La percepcion puede ser fuerte, pero la ruta hacia accion comercial no esta suficientemente visible."
    if scores.get("visual_coherence", 0) < 65 and snapshot.get("available_systems", {}).get("visual_dna_engine"):
        return "La direccion visual existe como sistema, pero aun necesita evidencia visible mas coherente."
    return "La entidad necesita convertir su base estrategica en un movimiento evolutivo unico y observable."


def _latent_possibility(snapshot, axes):
    opportunities = snapshot.get("opportunities") or []
    analysis = snapshot.get("source", {}).get("latest_analysis") or {}
    priorities = analysis.get("priorities") if isinstance(analysis.get("priorities"), list) else []

    if opportunities:
        return _clean_sentence(opportunities[0])
    if priorities:
        first = priorities[0]
        return _clean_sentence(first.get("reason") or first.get("action") or first.get("title"))
    if axes["F"] >= 0.65:
        return "Existe una posibilidad de expansion viable si se transforma la lectura estrategica en un ciclo de accion medible."
    if axes["D"] >= 0.65:
        return "La marca tiene diferencia latente; falta convertirla en una decision simple y repetible."
    return "La posibilidad latente esta en ordenar la identidad actual hasta que revele un proximo movimiento claro."


def _fertile_constraint(snapshot, axes):
    readiness = snapshot.get("source", {}).get("readiness") or {}
    priorities = readiness.get("priorities") or []

    if priorities:
        return f"Completar o decidir primero el area '{priorities[0].get('area')}' antes de expandir el sistema."
    if axes["N"] >= 0.42:
        return "Elegir una sola contradiccion principal y convertirla en una decision observable para los proximos 7 dias."
    if axes["F"] >= 0.70:
        return "Convertir la oportunidad principal en un ciclo de 30 dias con una promesa, una metrica y una pieza visible."
    if axes["V"] < 0.58:
        return "Reducir la direccion visual a una regla dominante antes de producir nuevas piezas."
    return "Definir un proximo movimiento unico que aumente claridad sin agregar nuevas capas al sistema."


def _recommended_path(snapshot, axes, fertile_constraint):
    recommendation = snapshot.get("current_recommendation") or {}
    action_key = recommendation.get("action_key") or "generate_mpe_entity_scan"

    if axes["N"] >= 0.42:
        label = "Resolver contradiccion evolutiva"
        reason = fertile_constraint
        action_key = "resolve_evolution_contradiction"
    elif axes["F"] >= 0.70:
        label = "Generar Evolution Blueprint"
        reason = "La entidad muestra posibilidad suficiente para ordenar un ciclo de crecimiento observable."
        action_key = "generate_evolution_blueprint"
    elif recommendation.get("next_action"):
        label = recommendation["next_action"]
        reason = recommendation.get("reason") or fertile_constraint
    else:
        label = "Definir Possibility Mapping"
        reason = fertile_constraint
        action_key = "generate_possibility_mapping"

    return {
        "label": label,
        "reason": reason,
        "action_key": action_key,
    }


def _noise_sources(snapshot):
    activation = snapshot.get("source", {}).get("activation") or {}
    deliverables_review = snapshot.get("source", {}).get("deliverables_review") or {}
    review_summary = deliverables_review.get("summary") or {}
    sources = []
    sources.extend(snapshot.get("risks") or [])
    sources.extend(activation.get("blockers") or [])

    duplicates = review_summary.get("duplicate_groups", 0) or 0
    if duplicates:
        sources.append(f"Hay {duplicates} grupos de entregables duplicados que pueden confundir la version final.")

    return sources[:5]


def _source_summary(snapshot):
    source = snapshot.get("source") or {}
    readiness = source.get("readiness") or {}
    deliverables_review = source.get("deliverables_review") or {}

    return {
        "has_latest_analysis": bool(source.get("latest_analysis")),
        "readiness_overall": readiness.get("overall", 0),
        "activation_state": (source.get("activation") or {}).get("activation_state"),
        "deliverables_total": (deliverables_review.get("summary") or {}).get("total_files", 0),
        "active_systems": [
            key
            for key, value in (snapshot.get("available_systems") or {}).items()
            if value
        ],
    }


def _persist_scan(client_name, scan):
    _resolved_name, client_path = _resolve_existing_client_path(client_name)

    if not client_path:
        return {}

    output_dir = client_path / "11_MPE_ENTITY_SCAN"
    output_dir.mkdir(parents=True, exist_ok=True)
    resolved_client = client_path.resolve()
    resolved_output = output_dir.resolve()

    if resolved_output != resolved_client and resolved_client not in resolved_output.parents:
        raise ValueError("Invalid MPE output path.")

    files = {
        "scan": output_dir / "mpe_entity_scan.json",
        "report": output_dir / "MPE_ENTITY_SCAN.md",
        "possibility_reading": output_dir / "possibility_reading.json",
        "morphogenesis_seed": output_dir / "morphogenesis_seed.json",
    }
    possibility_reading = {
        "client": scan["client"],
        "possibility_score": scan["possibility_score"],
        "evolution_stage": scan["evolution_stage"],
        "main_contradiction": scan["main_contradiction"],
        "latent_possibility": scan["latent_possibility"],
        "fertile_constraint": scan["fertile_constraint"],
        "recommended_path": scan["recommended_path"],
        "geometry": scan["geometry"],
    }

    files["scan"].write_text(json.dumps(scan, ensure_ascii=False, indent=2), encoding="utf-8")
    files["report"].write_text(render_mpe_entity_scan_markdown(scan), encoding="utf-8")
    files["possibility_reading"].write_text(json.dumps(possibility_reading, ensure_ascii=False, indent=2), encoding="utf-8")
    files["morphogenesis_seed"].write_text(json.dumps(scan["morphogenesis_seed"], ensure_ascii=False, indent=2), encoding="utf-8")

    return {key: _client_relative_path(client_path, path) for key, path in files.items()}


def _clean_sentence(value):
    text = str(value or "").strip()
    return text.rstrip(".") + "." if text else "La entidad tiene una posibilidad latente pendiente de formular."
