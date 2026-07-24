import json
from datetime import datetime
from pathlib import Path

from client_manager import _client_relative_path, _resolve_existing_client_path
from services.mpe.mpe_brand_geometry_renderer import render_brand_geometry_markdown, render_brand_geometry_svg
from services.mpe.mpe_contracts import clamp01
from services.mpe.mpe_entity_scan import load_persisted_mpe_entity_scan, run_mpe_entity_scan


ENGINE_NAME = "MPE Brand Geometry"
ENGINE_VERSION = "0.1"
OUTPUT_FOLDER = "14_MPE_BRAND_GEOMETRY"
MASTER_BRAND_PATH = Path("05_ENTREGAS") / "MASTER_BRAND_EXPERIENCE.md"
AXES = ["D", "R", "V", "F", "M", "N", "E"]


def generate_mpe_brand_geometry(client_name: str, persist: bool = True) -> dict:
    resolved_client_name, client_path = _resolve_existing_client_path(client_name)

    if not client_path:
        return {}

    master_text = _load_master_brand(client_path)
    if not master_text:
        raise ValueError("MASTER_BRAND_EXPERIENCE.md is missing or empty.")

    entity_scan = load_persisted_mpe_entity_scan(resolved_client_name)
    if not entity_scan:
        entity_scan = run_mpe_entity_scan(resolved_client_name, persist=True)

    signals = _extract_master_signals(master_text)
    base_seed = _base_seed(entity_scan, signals)
    variants = _geometry_variants(signals)
    geometries = [
        _build_geometry(resolved_client_name, variant, base_seed, signals)
        for variant in variants
    ]
    brand_geometry = {
        "client": resolved_client_name,
        "engine": ENGINE_NAME,
        "version": ENGINE_VERSION,
        "generated_at": datetime.now().isoformat(timespec="seconds"),
        "source": {
            "master_brand": True,
            "entity_scan": bool(entity_scan),
            "master_path": MASTER_BRAND_PATH.as_posix(),
        },
        "masterbrand_signals": signals,
        "reading": _reading(signals, geometries),
        "primary_geometry": geometries[0] if geometries else {},
        "geometries": geometries,
        "files": {},
    }

    if persist:
        brand_geometry["files"] = _persist_brand_geometry(client_path, brand_geometry)

    return brand_geometry


def load_persisted_mpe_brand_geometry(client_name: str) -> dict | None:
    _resolved_client_name, client_path = _resolve_existing_client_path(client_name)

    if not client_path:
        return None

    path = client_path / OUTPUT_FOLDER / "mpe_brand_geometry.json"
    _assert_inside_client(client_path, path)

    if not path.is_file():
        return None

    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except json.JSONDecodeError as error:
        raise ValueError("Persisted MPE Brand Geometry is invalid.") from error


def get_mpe_brand_geometry_svg_path(client_name: str, geometry_id: str):
    _resolved_client_name, client_path = _resolve_existing_client_path(client_name)

    if not client_path:
        return None

    safe_id = _safe_geometry_id(geometry_id)
    if not safe_id:
        raise ValueError("Invalid brand geometry id.")

    path = client_path / OUTPUT_FOLDER / "svg" / f"{safe_id}.svg"
    _assert_inside_client(client_path, path)
    return path if path.is_file() else None


def build_brand_geometry_command_summary(client_name: str) -> dict:
    brand_geometry = load_persisted_mpe_brand_geometry(client_name)

    if not brand_geometry:
        return {
            "available": False,
            "svg_available": False,
            "count": 0,
        }

    primary = brand_geometry.get("primary_geometry") or {}
    return {
        "available": True,
        "count": len(brand_geometry.get("geometries") or []),
        "primary_shape": primary.get("shape"),
        "primary_id": primary.get("id"),
        "svg_available": bool(primary.get("svg_path")),
        "reading": brand_geometry.get("reading"),
    }


def _load_master_brand(client_path: Path) -> str:
    path = client_path / MASTER_BRAND_PATH
    _assert_inside_client(client_path, path)

    if not path.is_file():
        return ""

    return path.read_text(encoding="utf-8").strip()


def _extract_master_signals(master_text: str) -> dict:
    text = master_text.casefold()
    keyword_groups = {
        "identity": ["identidad", "esencia", "alma", "soberania", "proposito", "entidad"],
        "method": ["metodo", "framework", "sistema", "proceso", "herramienta", "arquitectura"],
        "commercial": ["oferta", "programa", "venta", "comercial", "conversion", "premium"],
        "story": ["historia", "storytelling", "narrativa", "mensaje", "voz", "relato"],
        "visual": ["visual", "estetica", "universo", "imagen", "color", "simbolo"],
        "expansion": ["expansion", "futuro", "crecimiento", "evolucion", "internacional", "abundancia"],
        "noise": ["ruido", "dispersion", "confusion", "saturacion", "diluir", "duplicado"],
    }
    counts = {
        key: sum(text.count(keyword) for keyword in keywords)
        for key, keywords in keyword_groups.items()
    }
    total = max(sum(counts.values()), 1)

    return {
        "keyword_counts": counts,
        "dominant_signal": max(counts, key=counts.get),
        "identity_density": round(counts["identity"] / total, 4),
        "method_density": round(counts["method"] / total, 4),
        "commercial_density": round(counts["commercial"] / total, 4),
        "story_density": round(counts["story"] / total, 4),
        "visual_density": round(counts["visual"] / total, 4),
        "expansion_density": round(counts["expansion"] / total, 4),
        "noise_density": round(counts["noise"] / total, 4),
        "word_count": len(master_text.split()),
        "has_masterbrand": True,
    }


def _base_seed(entity_scan: dict | None, signals: dict) -> dict:
    scan_seed = (entity_scan or {}).get("morphogenesis_seed") or {}

    if scan_seed:
        return {axis: round(clamp01(scan_seed.get(axis, 0.5 if axis != "N" else 0.25)), 4) for axis in AXES}

    return {
        "D": round(clamp01(0.45 + signals["identity_density"] + signals["commercial_density"] * 0.6), 4),
        "R": round(clamp01(0.48 + signals["method_density"] * 1.2), 4),
        "V": round(clamp01(0.44 + signals["visual_density"] * 1.4), 4),
        "F": round(clamp01(0.48 + signals["expansion_density"] * 1.3), 4),
        "M": round(clamp01(0.50 + signals["story_density"] * 1.2 + signals["identity_density"] * 0.8), 4),
        "N": round(clamp01(0.18 + signals["noise_density"] * 1.5), 4),
        "E": round(clamp01(0.50 + signals["identity_density"] + signals["visual_density"] * 0.5), 4),
    }


def _geometry_variants(signals: dict) -> list[dict]:
    variants = [
        {
            "id": "entity_core",
            "label": "Nucleo de entidad",
            "shape": "Toroide",
            "role": "Organiza la identidad central y su campo de atraccion.",
            "question": "Que campo central sostiene toda la experiencia de marca?",
            "next_geometry": "Red",
            "adjust": {"R": 0.08, "M": 0.06, "E": 0.08, "N": -0.03},
        },
        {
            "id": "method_architecture",
            "label": "Arquitectura del metodo",
            "shape": "Triangulo" if signals["method_density"] < 0.18 else "Red",
            "role": "Convierte la sabiduria del masterbrand en estructura accionable.",
            "question": "Que tres o mas pilares vuelven vendible esta transformacion?",
            "next_geometry": "Red",
            "adjust": {"R": 0.10, "V": 0.04, "N": -0.04},
        },
        {
            "id": "offer_paths",
            "label": "Rutas de oferta",
            "shape": "Red",
            "role": "Muestra caminos comerciales posibles sin perder coherencia.",
            "question": "Que rutas comerciales puede abrir la entidad sin crear ruido?",
            "next_geometry": "Espiral",
            "adjust": {"D": 0.05, "F": 0.10, "R": 0.04},
        },
        {
            "id": "narrative_expansion",
            "label": "Expansion narrativa",
            "shape": "Espiral",
            "role": "Traduce el relato central en movimiento evolutivo.",
            "question": "Que historia debe expandirse primero para hacer visible la posibilidad?",
            "next_geometry": "Toroide",
            "adjust": {"F": 0.10, "M": 0.10, "E": 0.04},
        },
    ]

    if signals["visual_density"] >= 0.10 or signals["identity_density"] >= 0.18:
        variants.append(
            {
                "id": "premium_symbol",
                "label": "Simbolo premium",
                "shape": "Fractal" if signals["word_count"] > 1200 else "Punto",
                "role": "Condensa la percepcion premium en una forma memorable.",
                "question": "Que simbolo simple puede sostener complejidad sin explicar de mas?",
                "next_geometry": "Toroide",
                "adjust": {"D": 0.08, "V": 0.10, "E": 0.10, "N": -0.05},
            }
        )

    return variants


def _build_geometry(client_name: str, variant: dict, base_seed: dict, signals: dict) -> dict:
    seed = _adjust_seed(base_seed, variant.get("adjust") or {})
    parameters = _visual_parameters(seed, variant["shape"])
    return {
        "client": client_name,
        "id": variant["id"],
        "label": variant["label"],
        "shape": variant["shape"],
        "stage": "masterbrand_geometry",
        "role": variant["role"],
        "question": variant["question"],
        "next_geometry": variant["next_geometry"],
        "source": {
            "master_signal": signals["dominant_signal"],
            "derived_from": "MASTER_BRAND_EXPERIENCE.md",
        },
        "morphogenesis_seed": seed,
        "visual_parameters": parameters,
        "svg_path": "",
        "interpretation": {
            "visual_meaning": f"{variant['label']} toma forma {variant['shape']} para expresar {variant['role'].lower()}",
            "evolution_reading": "Esta geometria no es un asset final; es una matriz interna para decidir direccion visual.",
            "next_visual_direction": "Usarla como referencia para boards, simbolos y composicion antes de producir imagenes comerciales.",
        },
    }


def _adjust_seed(base_seed: dict, adjustments: dict) -> dict:
    seed = dict(base_seed)
    for axis, delta in adjustments.items():
        seed[axis] = round(clamp01(seed.get(axis, 0.5) + delta), 4)
    return {axis: round(clamp01(seed.get(axis, 0.5 if axis != "N" else 0.25)), 4) for axis in AXES}


def _visual_parameters(seed: dict, shape: str) -> dict:
    shape_boost = {
        "Punto": -0.12,
        "Linea": -0.04,
        "Triangulo": 0.02,
        "Red": 0.08,
        "Espiral": 0.12,
        "Toroide": 0.10,
        "Fractal": 0.16,
    }.get(shape, 0)
    cell_count = max(14, round(22 + seed["F"] * 48 + seed["D"] * 26 + shape_boost * 50))
    return {
        "cell_count": cell_count,
        "radius": round(120 + seed["F"] * 150 + seed["E"] * 55 + shape_boost * 80, 2),
        "spiral_factor": round(0.9 + seed["F"] * 2.0 + seed["M"] * 0.6, 4),
        "noise_level": round(seed["N"], 4),
        "coherence": round((seed["R"] + seed["V"]) / 2, 4),
        "symmetry": round(seed["R"] * 0.65 + seed["M"] * 0.35, 4),
        "expansion": round(seed["F"], 4),
        "density": round(min(1.0, cell_count / 100), 4),
        "layers": max(3, round(3 + seed["M"] * 6)),
        "geometry_weight": shape,
    }


def _reading(signals: dict, geometries: list[dict]) -> str:
    dominant = signals.get("dominant_signal", "identity")
    primary_shape = (geometries[0] or {}).get("shape", "Punto") if geometries else "Punto"
    return (
        f"El masterbrand muestra una senal dominante de {dominant}. "
        f"La forma primaria recomendada es {primary_shape}, acompanada por una familia de "
        "geometrias para identidad, metodo, oferta, narrativa y simbolo."
    )


def _persist_brand_geometry(client_path: Path, brand_geometry: dict) -> dict:
    output_dir = client_path / OUTPUT_FOLDER
    svg_dir = output_dir / "svg"
    svg_dir.mkdir(parents=True, exist_ok=True)
    _assert_inside_client(client_path, output_dir)
    _assert_inside_client(client_path, svg_dir)

    geometries = []
    svg_files = {}
    for geometry in brand_geometry.get("geometries", []):
        saved_geometry = dict(geometry)
        svg_path = svg_dir / f"{_safe_geometry_id(saved_geometry['id'])}.svg"
        _assert_inside_client(client_path, svg_path)
        svg_path.write_text(render_brand_geometry_svg(saved_geometry), encoding="utf-8")
        saved_geometry["svg_path"] = _client_relative_path(client_path, svg_path)
        geometries.append(saved_geometry)
        svg_files[saved_geometry["id"]] = saved_geometry["svg_path"]

    saved = dict(brand_geometry)
    saved["geometries"] = geometries
    saved["primary_geometry"] = geometries[0] if geometries else {}

    files = {
        "json": output_dir / "mpe_brand_geometry.json",
        "report": output_dir / "MPE_BRAND_GEOMETRY.md",
        "svg": svg_files,
    }
    files["json"].write_text(json.dumps(saved, ensure_ascii=False, indent=2), encoding="utf-8")
    files["report"].write_text(render_brand_geometry_markdown(saved), encoding="utf-8")

    saved_files = {
        "json": _client_relative_path(client_path, files["json"]),
        "report": _client_relative_path(client_path, files["report"]),
        "svg": svg_files,
    }
    saved["files"] = saved_files
    files["json"].write_text(json.dumps(saved, ensure_ascii=False, indent=2), encoding="utf-8")

    brand_geometry["geometries"] = geometries
    brand_geometry["primary_geometry"] = geometries[0] if geometries else {}
    brand_geometry["files"] = saved_files

    return saved_files


def _safe_geometry_id(value: str) -> str:
    return "".join(char for char in str(value or "").strip().lower() if char.isalnum() or char in {"_", "-"})


def _assert_inside_client(client_path: Path, path: Path):
    resolved_client = client_path.resolve()
    resolved_path = path.resolve(strict=False)
    if resolved_path != resolved_client and resolved_client not in resolved_path.parents:
        raise ValueError("Invalid MPE Brand Geometry path.")
