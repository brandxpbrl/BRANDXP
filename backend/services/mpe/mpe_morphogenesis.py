import json
from datetime import datetime
from pathlib import Path

from client_manager import _client_relative_path, _resolve_existing_client_path
from services.mpe.mpe_entity_scan import load_persisted_mpe_entity_scan, run_mpe_entity_scan
from services.mpe.mpe_morphogenesis_renderer import render_morphogenesis_markdown, render_morphogenesis_svg


ENGINE_NAME = "MPE Morphogenesis"
ENGINE_VERSION = "0.1"
OUTPUT_FOLDER = "13_MPE_MORPHOGENESIS"


def generate_mpe_morphogenesis(client_name: str, persist: bool = True) -> dict:
    resolved_client_name, client_path = _resolve_existing_client_path(client_name)

    if not client_path:
        return {}

    entity_scan = load_persisted_mpe_entity_scan(resolved_client_name)
    if not entity_scan:
        entity_scan = run_mpe_entity_scan(resolved_client_name, persist=True)

    if not entity_scan:
        return {}

    seed = _load_seed(client_path, entity_scan)
    geometry = entity_scan.get("geometry") or {}
    blueprint = _load_evolution_blueprint(client_path)
    morphogenesis = {
        "client": resolved_client_name,
        "engine": ENGINE_NAME,
        "version": ENGINE_VERSION,
        "generated_at": datetime.now().isoformat(timespec="seconds"),
        "source": {
            "entity_scan": True,
            "evolution_blueprint": bool(blueprint),
        },
        "geometry_state": {
            "shape": geometry.get("shape", "Punto"),
            "stage": geometry.get("stage") or entity_scan.get("evolution_stage", "apertura"),
            "question": geometry.get("question", "Que forma organiza mejor la evolucion actual?"),
            "next_geometry": geometry.get("next_geometry", "Linea"),
        },
        "morphogenesis_seed": seed,
        "visual_parameters": _visual_parameters(seed, geometry, blueprint),
        "svg_path": "",
        "json_path": "",
        "interpretation": _interpretation(entity_scan, geometry, blueprint),
    }

    if persist:
        morphogenesis["files"] = _persist_morphogenesis(client_path, morphogenesis)
        morphogenesis["svg_path"] = morphogenesis["files"]["svg"]
        morphogenesis["json_path"] = morphogenesis["files"]["json"]

    return morphogenesis


def load_persisted_mpe_morphogenesis(client_name: str) -> dict | None:
    _resolved_client_name, client_path = _resolve_existing_client_path(client_name)

    if not client_path:
        return None

    path = client_path / OUTPUT_FOLDER / "mpe_morphogenesis.json"
    _assert_inside_client(client_path, path)

    if not path.is_file():
        return None

    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except json.JSONDecodeError as error:
        raise ValueError("Persisted MPE Morphogenesis is invalid.") from error


def get_mpe_morphogenesis_svg_path(client_name: str):
    _resolved_client_name, client_path = _resolve_existing_client_path(client_name)

    if not client_path:
        return None

    path = client_path / OUTPUT_FOLDER / "mpe_morphogenesis.svg"
    _assert_inside_client(client_path, path)
    return path if path.is_file() else None


def build_morphogenesis_command_summary(client_name: str) -> dict:
    morphogenesis = load_persisted_mpe_morphogenesis(client_name)

    if not morphogenesis:
        return {
            "available": False,
            "svg_available": False,
        }

    geometry = morphogenesis.get("geometry_state") or {}
    interpretation = morphogenesis.get("interpretation") or {}
    return {
        "available": True,
        "shape": geometry.get("shape"),
        "stage": geometry.get("stage"),
        "svg_available": bool(get_mpe_morphogenesis_svg_path(client_name)),
        "visual_meaning": interpretation.get("visual_meaning"),
    }


def _load_seed(client_path, entity_scan):
    seed_path = client_path / "11_MPE_ENTITY_SCAN" / "morphogenesis_seed.json"
    if seed_path.is_file():
        try:
            seed = json.loads(seed_path.read_text(encoding="utf-8"))
        except json.JSONDecodeError:
            seed = {}
    else:
        seed = entity_scan.get("morphogenesis_seed") or {}

    return {axis: _clamp01(seed.get(axis, 0.5 if axis != "N" else 0.25)) for axis in ["D", "R", "V", "F", "M", "N", "E"]}


def _load_evolution_blueprint(client_path):
    candidates = [
        client_path / "12_EVOLUTION_BLUEPRINT" / "evolution_blueprint.json",
        client_path / "05_ENTREGAS" / "evolution_blueprint.json",
        client_path / "05_ENTREGAS" / "evolution" / "evolution_blueprint.json",
    ]
    for path in candidates:
        if not path.is_file():
            continue
        _assert_inside_client(client_path, path)
        try:
            return json.loads(path.read_text(encoding="utf-8"))
        except json.JSONDecodeError:
            return {}
    return {}


def _visual_parameters(seed, geometry, blueprint):
    blueprint_boost = 0.08 if blueprint else 0.0
    layers = max(2, round(2 + seed["M"] * 6))
    cell_count = max(12, round(18 + seed["F"] * 54 + seed["D"] * 24))
    return {
        "cell_count": cell_count,
        "radius": round(110 + seed["F"] * 170 + blueprint_boost * 120, 2),
        "spiral_factor": round(0.8 + seed["F"] * 2.2 + seed["D"] * 0.7, 4),
        "noise_level": round(seed["N"], 4),
        "coherence": round((seed["R"] + seed["V"]) / 2, 4),
        "symmetry": round(seed["R"] * 0.7 + seed["M"] * 0.3, 4),
        "expansion": round(seed["F"], 4),
        "density": round(min(1.0, cell_count / 100), 4),
        "layers": layers,
        "geometry_weight": geometry.get("shape", "Punto"),
    }


def _interpretation(entity_scan, geometry, blueprint):
    shape = geometry.get("shape", "Punto")
    stage = geometry.get("stage") or entity_scan.get("evolution_stage", "apertura")
    latent = entity_scan.get("latent_possibility", "abrir una posibilidad evolutiva con menor ruido")
    contradiction = entity_scan.get("main_contradiction", "la expansion necesita una forma mas clara")
    blueprint_phrase = "El Evolution Blueprint ya puede orientar ciclos visuales." if blueprint else "Aun no hay Evolution Blueprint persistido; la forma nace del scan MPE."

    return {
        "visual_meaning": f"La forma {shape} expresa una fase de {stage}: {latent}",
        "evolution_reading": f"La morfogenesis vuelve visible la tension principal: {contradiction}",
        "next_visual_direction": f"{blueprint_phrase} La proxima direccion es sostener {shape} como embrion visual antes de producir assets comerciales.",
    }


def _persist_morphogenesis(client_path, morphogenesis):
    output_dir = client_path / OUTPUT_FOLDER
    output_dir.mkdir(parents=True, exist_ok=True)
    _assert_inside_client(client_path, output_dir)

    files = {
        "json": output_dir / "mpe_morphogenesis.json",
        "svg": output_dir / "mpe_morphogenesis.svg",
        "report": output_dir / "MPE_MORPHOGENESIS.md",
    }
    files["svg"].write_text(render_morphogenesis_svg(morphogenesis), encoding="utf-8")

    saved = dict(morphogenesis)
    saved["svg_path"] = _client_relative_path(client_path, files["svg"])
    saved["json_path"] = _client_relative_path(client_path, files["json"])
    saved["files"] = {
        "json": _client_relative_path(client_path, files["json"]),
        "svg": _client_relative_path(client_path, files["svg"]),
        "report": _client_relative_path(client_path, files["report"]),
    }
    files["json"].write_text(json.dumps(saved, ensure_ascii=False, indent=2), encoding="utf-8")
    files["report"].write_text(render_morphogenesis_markdown(saved), encoding="utf-8")

    return saved["files"]


def _assert_inside_client(client_path, path: Path):
    resolved_client = client_path.resolve()
    resolved_path = path.resolve(strict=False)
    if resolved_path != resolved_client and resolved_client not in resolved_path.parents:
        raise ValueError("Invalid MPE Morphogenesis path.")


def _clamp01(value):
    try:
        number = float(value)
    except (TypeError, ValueError):
        return 0.0
    return round(max(0.0, min(1.0, number)), 4)
