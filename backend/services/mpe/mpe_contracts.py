def clamp01(value):
    try:
        number = float(value)
    except (TypeError, ValueError):
        return 0.0
    return max(0.0, min(1.0, number))


def normalize_score(value):
    try:
        number = float(value)
    except (TypeError, ValueError):
        return 0.0
    return clamp01(number / 100 if number > 1 else number)


def normalize_mpe_axes(snapshot: dict) -> dict:
    scores = snapshot.get("scores") or {}
    readiness = snapshot.get("source", {}).get("readiness") or {}
    activation = snapshot.get("source", {}).get("activation") or {}
    deliverables_review = snapshot.get("source", {}).get("deliverables_review") or {}
    risks = snapshot.get("risks") or []
    blockers = activation.get("blockers") or []
    opportunities = snapshot.get("opportunities") or []
    systems = snapshot.get("available_systems") or {}
    review_summary = deliverables_review.get("summary") or {}

    active_systems = sum(1 for value in systems.values() if value)
    systems_ratio = active_systems / max(len(systems), 1)
    readiness_score = normalize_score(readiness.get("overall"))
    duplicate_pressure = min(0.25, float(review_summary.get("duplicate_groups", 0) or 0) * 0.05)
    risk_pressure = min(0.35, (len(risks) + len(blockers)) * 0.07)

    d = normalize_score(scores.get("differentiation"))
    r = clamp01(readiness_score * 0.65 + systems_ratio * 0.35)
    v = normalize_score(scores.get("visual_coherence"))
    f = clamp01(
        normalize_score(scores.get("conversion_readiness")) * 0.45
        + normalize_score(scores.get("clarity")) * 0.25
        + min(1.0, len(opportunities) / 3) * 0.20
        + (0.10 if activation.get("activation_state") == "ready" else 0.0)
    )
    m = normalize_score(scores.get("narrative_power"))
    n = clamp01(0.18 + risk_pressure + duplicate_pressure + (0.12 if not snapshot.get("source", {}).get("latest_analysis") else 0.0))
    e = clamp01(normalize_score(scores.get("premium_perception")) * 0.70 + normalize_score(scores.get("clarity")) * 0.30)

    return {
        "D": round(d, 4),
        "R": round(r, 4),
        "V": round(v, 4),
        "F": round(f, 4),
        "M": round(m, 4),
        "N": round(n, 4),
        "E": round(e, 4),
    }


def validate_mpe_scan(scan: dict) -> dict:
    required = [
        "client",
        "engine",
        "version",
        "possibility_score",
        "evolution_stage",
        "main_contradiction",
        "latent_possibility",
        "fertile_constraint",
        "noise_sources",
        "recommended_path",
        "geometry",
        "morphogenesis_seed",
    ]
    missing = [key for key in required if key not in scan]
    seed = scan.get("morphogenesis_seed") or {}
    missing_axes = [axis for axis in ["D", "R", "V", "F", "M", "N", "E"] if axis not in seed]

    return {
        "valid": not missing and not missing_axes and 0 <= float(scan.get("possibility_score", -1)) <= 1,
        "missing": missing,
        "missing_axes": missing_axes,
    }

