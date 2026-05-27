from collections import defaultdict
from datetime import datetime
from pathlib import Path


CORE_DELIVERABLES = {
    "brand_analysis.md",
    "identity_patch.md",
    "entity_bible.md",
    "visual_universe.md",
    "content_strategy.md",
    "ai_prompts.md",
    "action_plan.md",
    "MASTER_BRAND_EXPERIENCE.md",
}


def _parse_dt(value):
    try:
        return datetime.fromisoformat(value)
    except (TypeError, ValueError):
        return datetime.min


def _file_stem_key(name):
    stem = Path(name).stem

    for marker in ["_202", "-202"]:
        if marker in stem:
            return stem.split(marker, 1)[0]

    return stem


def review_client_deliverables(deliverables_data):
    items = deliverables_data.get("items", []) if deliverables_data else []
    files = [item for item in items if item.get("type") == "file"]
    markdown = [item for item in files if item.get("extension") == ".md"]
    visuals = [
        item
        for item in files
        if item.get("extension") in {".png", ".jpg", ".jpeg", ".webp"}
        or "/visuals/" in item.get("relative_path", "")
    ]
    prompt_pack = [item for item in files if "/prompt_pack/" in item.get("relative_path", "")]
    core = [item for item in files if item.get("name") in CORE_DELIVERABLES]
    grouped = defaultdict(list)

    for item in files:
        grouped[_file_stem_key(item.get("name", ""))].append(item)

    duplicate_groups = [
        {
            "base": base,
            "count": len(group),
            "items": [
                {
                    "name": item["name"],
                    "relative_path": item["relative_path"],
                    "modified_at": item.get("modified_at"),
                }
                for item in sorted(group, key=lambda entry: _parse_dt(entry.get("modified_at")), reverse=True)
            ],
        }
        for base, group in grouped.items()
        if len(group) > 1
    ]
    latest_files = sorted(files, key=lambda item: _parse_dt(item.get("modified_at")), reverse=True)[:6]
    recommended_review = core[:6] or latest_files[:6]
    has_master = any(item.get("name") == "MASTER_BRAND_EXPERIENCE.md" for item in files)

    if not files:
        recommendation = "Todavia no hay entregables para revisar. Primero conviene generar la primera capa de outputs."
    elif duplicate_groups:
        recommendation = "Revisar versiones duplicadas, conservar las mas recientes y limpiar piezas antiguas antes de exportar."
    elif not has_master:
        recommendation = "Generar un Master Brand Experience para unir estrategia, identidad, visuales y proximas acciones."
    else:
        recommendation = "Revisar el master, validar visual boards y preparar una version exportable para compartir."

    return {
        "client": deliverables_data.get("client") if deliverables_data else None,
        "summary": {
            "total_files": len(files),
            "markdown_files": len(markdown),
            "visual_assets": len(visuals),
            "prompt_pack_files": len(prompt_pack),
            "core_deliverables": len(core),
            "duplicate_groups": len(duplicate_groups),
            "has_master": has_master,
        },
        "signals": [
            f"{len(core)} entregables principales detectados.",
            f"{len(visuals)} activos visuales disponibles.",
            f"{len(prompt_pack)} archivos de prompt pack disponibles.",
        ],
        "duplicates": duplicate_groups[:8],
        "primary_deliverables": [
            {
                "name": item["name"],
                "relative_path": item["relative_path"],
                "modified_at": item.get("modified_at"),
            }
            for item in core[:10]
        ],
        "recommended_review": [
            {
                "name": item["name"],
                "relative_path": item["relative_path"],
                "modified_at": item.get("modified_at"),
            }
            for item in recommended_review
        ],
        "recommendation": recommendation,
        "next_action": "Exportar master" if has_master and not duplicate_groups else "Ordenar entregables",
    }
