import json


def build_mpe_advisor_lens(mpe_scan: dict | None) -> dict:
    if not mpe_scan:
        return {
            "enabled": False,
            "summary": "Lectura evolutiva MPE no disponible.",
        }

    contradiction = _text(mpe_scan.get("main_contradiction"), "La contradiccion evolutiva todavia no esta definida.")
    possibility = _text(mpe_scan.get("latent_possibility"), "La posibilidad latente todavia no esta formulada.")
    constraint = _text(mpe_scan.get("fertile_constraint"), "Definir una restriccion fertil antes de expandir.")
    recommended = mpe_scan.get("recommended_path") or {}
    geometry = mpe_scan.get("geometry") or {}
    stage = _human_stage(mpe_scan.get("evolution_stage"))
    score = _score_label(mpe_scan.get("possibility_score", 0))
    move = _text(recommended.get("label"), "Definir proximo movimiento evolutivo.")
    reason = _text(recommended.get("reason"), constraint)
    shape = _text(geometry.get("shape"), "forma pendiente")

    return {
        "enabled": True,
        "summary": (
            f"La entidad se encuentra en una fase de {stage} con posibilidad {score}. "
            f"Su geometria actual es {shape}; el foco es abrir futuro sin aumentar ruido."
        ),
        "evolution_focus": possibility,
        "strategic_warning": contradiction,
        "fertile_constraint": constraint,
        "next_evolutionary_move": move,
        "next_evolutionary_reason": reason,
        "entity_phrase": f"Desde MPE, la posibilidad latente de esta entidad es {possibility}",
        "source": {
            "engine": mpe_scan.get("engine", "MPE Entity Scan"),
            "version": mpe_scan.get("version", "0.1"),
            "possibility_score": mpe_scan.get("possibility_score", 0),
            "evolution_stage": mpe_scan.get("evolution_stage"),
            "geometry_shape": geometry.get("shape"),
        },
    }


def load_mpe_scan_for_advisor(client_path) -> dict | None:
    path = client_path / "11_MPE_ENTITY_SCAN" / "mpe_entity_scan.json"
    resolved_client = client_path.resolve()
    resolved_path = path.resolve(strict=False)

    if resolved_path != resolved_client and resolved_client not in resolved_path.parents:
        raise ValueError("Invalid MPE advisor lens path.")

    if not path.is_file():
        return None

    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except json.JSONDecodeError:
        return None


def _text(value, fallback):
    text = str(value or "").strip()
    return text or fallback


def _human_stage(stage):
    labels = {
        "apertura": "apertura",
        "direccion": "direccion",
        "restriccion_fertil": "restriccion fertil",
        "coherencia_creciente": "coherencia creciente",
        "expansion_viable": "expansion viable",
        "sistema_maduro": "sistema maduro",
        "complejidad_coherente": "complejidad coherente",
    }
    return labels.get(stage, "lectura evolutiva inicial")


def _score_label(score):
    try:
        value = float(score)
    except (TypeError, ValueError):
        return "inicial"

    if value >= 0.78:
        return "alta"
    if value >= 0.62:
        return "media-alta"
    if value >= 0.45:
        return "media"
    return "en construccion"

