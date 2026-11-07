import hashlib
import json
import re


CLAIM_KINDS = {"fact", "inference", "hypothesis", "recommendation"}
CLAIM_ID_PATTERN = re.compile(r"^claim-[a-z0-9-]+$")
SHA256_PATTERN = re.compile(r"^[a-f0-9]{64}$")


class GravityOutputValidationError(ValueError):
    pass


def _clean_text(value):
    return " ".join(str(value or "").split())


def _validate_source(source, index):
    source_id = _clean_text(source.get("id"))
    source_hash = _clean_text(source.get("sha256")).lower()
    locator = _clean_text(source.get("locator"))
    if not source_id or not locator or not SHA256_PATTERN.fullmatch(source_hash):
        raise GravityOutputValidationError(f"Source {index} requires id, locator and valid SHA-256.")
    return {
        "id": source_id,
        "locator": locator,
        "sha256": source_hash,
        "source_type": _clean_text(source.get("source_type") or "declared_input"),
    }


def validate_gravity_output(output, allowed_source_hashes=None):
    if not isinstance(output, dict):
        raise GravityOutputValidationError("Gravity output must be an object.")
    component_id = _clean_text(output.get("component_id")).upper()
    if not component_id.startswith("GRAVITY:A"):
        raise GravityOutputValidationError("Gravity output requires a namespaced component_id.")

    sources = [_validate_source(item, index) for index, item in enumerate(output.get("sources") or [], 1)]
    source_map = {item["id"]: item for item in sources}
    if len(source_map) != len(sources):
        raise GravityOutputValidationError("Gravity sources must have unique IDs.")
    allowed = set(allowed_source_hashes or [])
    if allowed:
        undeclared = [item["id"] for item in sources if item["sha256"] not in allowed]
        if undeclared:
            raise GravityOutputValidationError(f"Sources are outside the run evidence set: {', '.join(undeclared)}.")

    claims = []
    seen_claim_ids = set()
    for index, raw in enumerate(output.get("claims") or [], 1):
        claim_id = _clean_text(raw.get("id"))
        text = _clean_text(raw.get("text"))
        truth_kind = _clean_text(raw.get("truth_kind")).casefold()
        source_ids = list(dict.fromkeys(raw.get("source_ids") or []))
        try:
            confidence = float(raw.get("confidence"))
        except (TypeError, ValueError):
            raise GravityOutputValidationError(f"Claim {index} requires numeric confidence.") from None
        if not CLAIM_ID_PATTERN.fullmatch(claim_id) or claim_id in seen_claim_ids:
            raise GravityOutputValidationError(f"Claim {index} requires a unique claim-* ID.")
        if not text or truth_kind not in CLAIM_KINDS or not 0 <= confidence <= 1:
            raise GravityOutputValidationError(f"Claim {claim_id} has invalid text, truth kind or confidence.")
        missing_sources = [source_id for source_id in source_ids if source_id not in source_map]
        if missing_sources:
            raise GravityOutputValidationError(f"Claim {claim_id} references unknown sources.")
        if truth_kind == "fact" and not source_ids:
            raise GravityOutputValidationError(f"Fact {claim_id} requires at least one source.")
        if truth_kind != "fact" and not _clean_text(raw.get("reasoning")):
            raise GravityOutputValidationError(f"{truth_kind.title()} {claim_id} requires declared reasoning.")
        seen_claim_ids.add(claim_id)
        claims.append({
            "id": claim_id,
            "text": text,
            "truth_kind": truth_kind,
            "confidence": confidence,
            "source_ids": source_ids,
            "reasoning": _clean_text(raw.get("reasoning")) or None,
        })
    if not claims:
        raise GravityOutputValidationError("Gravity output requires at least one classified claim.")

    contradictions = []
    for raw in output.get("contradictions") or []:
        left = _clean_text(raw.get("left_claim_id"))
        right = _clean_text(raw.get("right_claim_id"))
        if left not in seen_claim_ids or right not in seen_claim_ids or left == right:
            raise GravityOutputValidationError("Contradictions must reference two different known claims.")
        contradictions.append({
            "left_claim_id": left,
            "right_claim_id": right,
            "status": _clean_text(raw.get("status") or "open"),
            "note": _clean_text(raw.get("note")),
        })

    ledger = {
        "schema_version": "gravity-claim-ledger-v1",
        "component_id": component_id,
        "sources": sources,
        "claims": claims,
        "contradictions": contradictions,
        "open_contradictions": sum(item["status"] == "open" for item in contradictions),
        "human_review_required": True,
        "memory_promotion_allowed": False,
    }
    ledger["sha256"] = hashlib.sha256(
        json.dumps(ledger, ensure_ascii=False, sort_keys=True).encode("utf-8")
    ).hexdigest()
    return ledger
