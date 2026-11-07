import math
from datetime import datetime


def _now():
    return datetime.now().astimezone().isoformat(timespec="seconds")


def build_possibility_cone(scenarios, source, horizon="next_decision"):
    if len(scenarios or []) < 2:
        raise ValueError("At least two scenarios are required.")
    weights = []
    for scenario in scenarios:
        weight = float(scenario.get("weight", 0))
        if weight < 0:
            raise ValueError("Scenario weights cannot be negative.")
        weights.append(weight)
    total = sum(weights)
    if total <= 0:
        raise ValueError("Scenario weights must sum to more than zero.")
    normalized = []
    for scenario, weight in zip(scenarios, weights):
        probability = weight / total
        normalized.append({
            "id": scenario["id"],
            "label": scenario.get("label") or scenario["id"],
            "probability": round(probability, 6),
            "assumptions": list(scenario.get("assumptions") or []),
            "evidence_ids": list(scenario.get("evidence_ids") or []),
            "impact": scenario.get("impact"),
            "risk": scenario.get("risk"),
        })
    normalized.sort(key=lambda item: item["probability"], reverse=True)
    entropy = -sum(item["probability"] * math.log2(item["probability"]) for item in normalized if item["probability"])
    maximum_entropy = math.log2(len(normalized))
    possibility_index = entropy / maximum_entropy if maximum_entropy else 0
    return {
        "adapter": "QSIM Possibility Cone",
        "version": "1.0.0",
        "generated_at": _now(),
        "horizon": horizon,
        "source": source,
        "source_type": "declared_scenario_weights",
        "scenarios": normalized,
        "top_k": normalized[:2],
        "entropy": round(entropy, 6),
        "possibility_index": round(possibility_index, 6),
        "interpretation": _interpret(possibility_index),
        "limitations": [
            "This is a scenario cone, not a prediction of a single future.",
            "Probabilities inherit the quality and bias of declared weights.",
            "QSIM V1 empirical telemetry probabilities are not transferred to brand decisions.",
            "Rare-event blindness from argmax is avoided by always returning Top-K scenarios.",
        ],
        "truth_kind": "simulation",
        "human_decision_required": True,
    }


def _interpret(index):
    if index >= 0.85:
        return "high_divergence"
    if index >= 0.6:
        return "multiple_plausible_paths"
    return "concentrated_scenario_space"
