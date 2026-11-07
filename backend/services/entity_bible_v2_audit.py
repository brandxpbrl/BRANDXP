import hashlib
import json
import re
from collections import Counter
from datetime import datetime
from pathlib import Path


PROJECT_ROOT = Path(__file__).resolve().parents[2]
SOURCE_ROOT = PROJECT_ROOT / "BRAND_EXPERIENCE_OS" / "KNOWLEDGE" / "ENTITY_BIBLE"
AUDIT_ROOT = PROJECT_ROOT / "runtime" / "entity_bible_v2"

TEMPLATE_PHRASES = (
    "This concept exists as a foundational perceptual law",
    "Every entity transmits emotional meaning before logical understanding",
    "This concept does not exist independently",
    "The Entity Bible functions as a living cognitive network",
)

V2_REQUIREMENTS = {
    "definition": ("definition",),
    "when_to_use": ("when to use", "use cases"),
    "diagnostic_method": ("diagnostic method", "method of diagnosis"),
    "observable_indicators": ("observable indicators", "signals"),
    "analysis_questions": ("analysis questions", "diagnostic questions"),
    "decision_rules": ("decision rules",),
    "good_examples": ("good examples", "positive examples"),
    "bad_examples": ("bad examples", "negative examples"),
    "limits_and_counterexamples": ("limits", "counterexamples"),
    "expected_result": ("expected result",),
}


def _heading(content):
    match = re.search(r"^#\s+(.+)$", content, re.MULTILINE)
    return match.group(1).strip() if match else "Untitled"


def _kind(path):
    stem = path.stem.casefold()
    mapping = {
        "rules": "rule",
        "principles": "principle",
        "patterns": "pattern",
        "examples": "example",
        "framework": "framework",
    }
    if path.parent.name == "forbidden_patterns":
        return "prohibition"
    return mapping.get(stem, "principle")


def _has_heading(content, alternatives):
    headings = {
        match.strip().casefold()
        for match in re.findall(r"^#{1,6}\s+(.+)$", content, re.MULTILINE)
    }
    return any(any(term in heading for term in alternatives) for heading in headings)


def _strategic_importance_empty(content):
    match = re.search(
        r"## Strategic Importance\s*(.*?)(?=\n## |\Z)",
        content,
        re.IGNORECASE | re.DOTALL,
    )
    if not match:
        return False
    bullets = re.findall(r"^\s*-\s+\S.+$", match.group(1), re.MULTILINE)
    return not bool(bullets)


def audit_document(path, root=None):
    root = (root or SOURCE_ROOT).resolve()
    resolved = path.resolve()
    resolved.relative_to(root)
    content = resolved.read_text(encoding="utf-8", errors="replace")
    relative = resolved.relative_to(root).as_posix()
    phrase_hits = [phrase for phrase in TEMPLATE_PHRASES if phrase.casefold() in content.casefold()]
    requirements = {
        key: _has_heading(content, alternatives)
        for key, alternatives in V2_REQUIREMENTS.items()
    }
    readiness = round(100 * sum(requirements.values()) / len(requirements))
    return {
        "source_path": relative,
        "title": _heading(content),
        "domain": relative.split("/", 1)[0],
        "knowledge_type": _kind(resolved),
        "sha256": hashlib.sha256(content.encode("utf-8")).hexdigest(),
        "bytes": len(content.encode("utf-8")),
        "template_phrase_hits": len(phrase_hits),
        "template_phrases": phrase_hits,
        "template_dominant": len(phrase_hits) >= 3,
        "empty_strategic_importance": _strategic_importance_empty(content),
        "v2_requirements": requirements,
        "semantic_readiness_score": readiness,
        "migration_status": "requires_semantic_rewrite" if readiness < 70 or len(phrase_hits) >= 3 else "review_manually",
    }


def run_entity_bible_v2_audit(source_root=None, output_root=None):
    source_root = Path(source_root or SOURCE_ROOT).resolve()
    output_root = Path(output_root or AUDIT_ROOT)
    documents = [audit_document(path, source_root) for path in sorted(source_root.rglob("*.md"))]
    timestamp = datetime.now().astimezone().isoformat(timespec="seconds")
    domains = Counter(item["domain"] for item in documents)
    kinds = Counter(item["knowledge_type"] for item in documents)
    template_dominant = sum(item["template_dominant"] for item in documents)
    empty_sections = sum(item["empty_strategic_importance"] for item in documents)
    report = {
        "schema_version": "2.0.0-audit",
        "generated_at": timestamp,
        "source_root": str(source_root),
        "source_mode": "read_only",
        "summary": {
            "documents": len(documents),
            "domains": dict(sorted(domains.items())),
            "knowledge_types": dict(sorted(kinds.items())),
            "template_dominant_documents": template_dominant,
            "template_dominant_ratio": round(template_dominant / len(documents), 4) if documents else 0,
            "empty_strategic_importance_sections": empty_sections,
            "average_semantic_readiness": round(
                sum(item["semantic_readiness_score"] for item in documents) / len(documents), 2
            ) if documents else 0,
            "original_files_modified": 0,
        },
        "documents": documents,
    }
    output_root.mkdir(parents=True, exist_ok=True)
    json_path = output_root / "entity_bible_v2_audit.json"
    markdown_path = output_root / "entity_bible_v2_audit.md"
    json_path.write_text(json.dumps(report, ensure_ascii=False, indent=2), encoding="utf-8")
    markdown_path.write_text(_render_markdown(report), encoding="utf-8")
    return {**report, "files": {"json": str(json_path), "markdown": str(markdown_path)}}


def _render_markdown(report):
    summary = report["summary"]
    domains = "\n".join(f"- {name}: {count}" for name, count in summary["domains"].items())
    priority = sorted(
        report["documents"],
        key=lambda item: (item["semantic_readiness_score"], -item["template_phrase_hits"], item["source_path"]),
    )[:20]
    priority_lines = "\n".join(
        f"- `{item['source_path']}` — readiness {item['semantic_readiness_score']}%, template hits {item['template_phrase_hits']}"
        for item in priority
    )
    return f"""# Entity Bible v2 — Auditoría semántica

Generado: {report['generated_at']}

## Resumen

- Documentos: {summary['documents']}
- Dominados por plantilla: {summary['template_dominant_documents']} ({summary['template_dominant_ratio']:.1%})
- Strategic Importance vacíos: {summary['empty_strategic_importance_sections']}
- Preparación semántica promedio: {summary['average_semantic_readiness']}%
- Archivos originales modificados: {summary['original_files_modified']}

## Áreas

{domains}

## Prioridad inicial de reescritura semántica

{priority_lines}

## Criterio de salida v2

Cada unidad deberá contener definición concreta, uso, método diagnóstico, indicadores, preguntas, reglas de decisión, ejemplos buenos y malos, límites, resultado esperado, relaciones justificadas, procedencia y gobierno.
"""
