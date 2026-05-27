from pathlib import Path
from datetime import datetime
import json
import re


PROJECT_ROOT = Path(__file__).resolve().parent
BACKEND_DIR = PROJECT_ROOT / "backend"
REPORTS_DIR = PROJECT_ROOT / "docs"

TARGET_FILES = [
    BACKEND_DIR / "cognitive_orchestrator.py",
    BACKEND_DIR / "brand_analysis_engine.py",
    BACKEND_DIR / "client_manager.py",
    BACKEND_DIR / "client_loader.py",
    BACKEND_DIR / "main.py",
]

AGENTS_DIRS = [
    BACKEND_DIR / "agents",
    BACKEND_DIR / "entity_bible",
]

SEARCH_PATTERNS = {
    "MAX_ACTIVE_AGENTS": r"MAX_ACTIVE_AGENTS\s*=\s*(.+)",
    "load_all_agents": r"def\s+load_all_agents\s*\(",
    "run_agent": r"def\s+run_agent\s*\(",
    "process_request": r"def\s+process_request\s*\(",
    "synthesize_responses": r"def\s+synthesize_responses\s*\(",
    "build_brand_analysis": r"def\s+build_brand_analysis\s*\(",
    "build_framework_prompt": r"def\s+build_framework_prompt\s*\(",
    "save_client_analysis": r"def\s+save_client_analysis\s*\(",
    "Entity Bible references": r"Entity Bible|ENTITY BIBLE|entity_bible|load_entity_bible",
    "Instagram agent references": r"instagram_audit_agent|Instagram Audit|instagram",
    "Sales agent references": r"sales_agent|Sales|sales",
}


def read_text(path: Path) -> str:
    try:
        return path.read_text(encoding="utf-8", errors="replace")
    except Exception:
        return ""


def line_number_for_match(text: str, match_start: int) -> int:
    return text[:match_start].count("\n") + 1


def scan_file_for_patterns(path: Path) -> dict:
    text = read_text(path)
    findings = {}

    for name, pattern in SEARCH_PATTERNS.items():
        matches = []
        for match in re.finditer(pattern, text, flags=re.IGNORECASE):
            matches.append(
                {
                    "line": line_number_for_match(text, match.start()),
                    "match": match.group(0)[:240],
                }
            )

        if matches:
            findings[name] = matches

    return findings


def extract_function_block(path: Path, function_name: str, max_lines: int = 90) -> str:
    text = read_text(path)
    lines = text.splitlines()

    start_index = None
    pattern = re.compile(rf"^\s*def\s+{re.escape(function_name)}\s*\(")

    for index, line in enumerate(lines):
        if pattern.search(line):
            start_index = index
            break

    if start_index is None:
        return ""

    block = lines[start_index : start_index + max_lines]
    return "\n".join(f"{start_index + i + 1}: {line}" for i, line in enumerate(block))


def list_agent_files() -> list[dict]:
    results = []

    if not (BACKEND_DIR / "agents").exists():
        return results

    for path in sorted((BACKEND_DIR / "agents").rglob("*")):
        if path.is_file() and path.suffix == ".py":
            text = read_text(path)
            results.append(
                {
                    "file": str(path.relative_to(PROJECT_ROOT)),
                    "size": path.stat().st_size,
                    "mentions_entity_bible": bool(
                        re.search(r"Entity Bible|ENTITY BIBLE|entity_bible|load_entity_bible", text, re.I)
                    ),
                    "mentions_prompt": bool(re.search(r"prompt|system|instructions|role", text, re.I)),
                    "classes": re.findall(r"class\s+([A-Za-z_][A-Za-z0-9_]*)", text),
                    "functions": re.findall(r"def\s+([A-Za-z_][A-Za-z0-9_]*)\s*\(", text),
                }
            )

    return results


def find_agent_names_in_code() -> dict:
    names = [
        "branding_agent",
        "strategy_agent",
        "psychology_agent",
        "cinematic_director_agent",
        "cinematic_agent",
        "content_agent",
        "instagram_audit_agent",
        "sales_agent",
    ]

    results = {name: [] for name in names}

    for path in BACKEND_DIR.rglob("*.py"):
        if "__pycache__" in path.parts:
            continue

        text = read_text(path)

        for name in names:
            if name in text:
                lines = []
                for idx, line in enumerate(text.splitlines(), start=1):
                    if name in line:
                        lines.append({"line": idx, "text": line.strip()[:240]})

                if lines:
                    results[name].append(
                        {
                            "file": str(path.relative_to(PROJECT_ROOT)),
                            "lines": lines[:12],
                        }
                    )

    return results


def scan_backend_flow() -> dict:
    files = {}

    for path in TARGET_FILES:
        if path.exists():
            files[str(path.relative_to(PROJECT_ROOT))] = scan_file_for_patterns(path)

    return files


def extract_key_blocks() -> dict:
    targets = [
        ("client_manager.py", "build_framework_prompt"),
        ("cognitive_orchestrator.py", "process_request"),
        ("cognitive_orchestrator.py", "load_all_agents"),
        ("cognitive_orchestrator.py", "run_agent"),
        ("cognitive_orchestrator.py", "synthesize_responses"),
        ("brand_analysis_engine.py", "build_brand_analysis"),
        ("client_manager.py", "save_client_analysis"),
    ]

    blocks = {}

    for filename, function_name in targets:
        path = BACKEND_DIR / filename
        if path.exists():
            block = extract_function_block(path, function_name)
            if block:
                blocks[f"{filename}::{function_name}"] = block

    return blocks


def infer_agent_status(agent_references: dict, flow_findings: dict) -> dict:
    known_agents = [
        "branding_agent",
        "strategy_agent",
        "psychology_agent",
        "cinematic_director_agent",
        "cinematic_agent",
        "content_agent",
        "instagram_audit_agent",
        "sales_agent",
    ]

    status = {}

    for agent in known_agents:
        references = agent_references.get(agent, [])
        status[agent] = {
            "referenced": bool(references),
            "reference_count": sum(len(item.get("lines", [])) for item in references),
            "likely_available": bool(references),
        }

    max_active = None

    for file_findings in flow_findings.values():
        matches = file_findings.get("MAX_ACTIVE_AGENTS", [])
        if matches:
            max_active = matches[0]["match"]

    return {
        "known_agents": status,
        "max_active_agents_line": max_active,
        "warning": (
            "If MAX_ACTIVE_AGENTS is 5 and 7 agents exist, some agents may be excluded."
            if max_active
            else "MAX_ACTIVE_AGENTS not found in scanned files."
        ),
    }


def write_markdown_report(report: dict, path: Path) -> None:
    lines = []

    lines.append("# BRAND EXPERIENCE AGENTS FLOW REPORT")
    lines.append("")
    lines.append(f"Generated at: {datetime.now().isoformat(timespec='seconds')}")
    lines.append("")

    lines.append("## 1. Agent files found")
    lines.append("")

    for agent_file in report["agent_files"]:
        lines.append(f"### `{agent_file['file']}`")
        lines.append("")
        lines.append(f"- Size: {agent_file['size']} bytes")
        lines.append(f"- Mentions Entity Bible: `{agent_file['mentions_entity_bible']}`")
        lines.append(f"- Mentions prompt/system instructions: `{agent_file['mentions_prompt']}`")
        lines.append(f"- Classes: `{', '.join(agent_file['classes']) or 'none'}`")
        lines.append(f"- Functions: `{', '.join(agent_file['functions']) or 'none'}`")
        lines.append("")

    lines.append("## 2. Pattern findings in backend flow files")
    lines.append("")

    for file_name, findings in report["flow_findings"].items():
        lines.append(f"### `{file_name}`")
        lines.append("")

        if not findings:
            lines.append("- No relevant patterns found.")
            lines.append("")
            continue

        for pattern_name, matches in findings.items():
            lines.append(f"#### {pattern_name}")
            for item in matches:
                lines.append(f"- Line {item['line']}: `{item['match']}`")
            lines.append("")

    lines.append("## 3. Agent references in code")
    lines.append("")

    for agent_name, references in report["agent_references"].items():
        lines.append(f"### `{agent_name}`")
        lines.append("")

        if not references:
            lines.append("- No references found.")
            lines.append("")
            continue

        for reference in references:
            lines.append(f"- File: `{reference['file']}`")
            for line in reference["lines"]:
                lines.append(f"  - Line {line['line']}: `{line['text']}`")
        lines.append("")

    lines.append("## 4. Inferred status")
    lines.append("")

    inferred = report["inferred_status"]
    lines.append(f"- MAX active agents line: `{inferred['max_active_agents_line']}`")
    lines.append(f"- Warning: {inferred['warning']}")
    lines.append("")

    for agent, status in inferred["known_agents"].items():
        lines.append(
            f"- `{agent}` — referenced: `{status['referenced']}`, "
            f"reference_count: `{status['reference_count']}`"
        )

    lines.append("")
    lines.append("## 5. Extracted key function blocks")
    lines.append("")

    for name, block in report["key_blocks"].items():
        lines.append(f"### `{name}`")
        lines.append("")
        lines.append("```python")
        lines.append(block)
        lines.append("```")
        lines.append("")

    lines.append("## 6. Questions to answer after reviewing")
    lines.append("")
    lines.append("- Are all 7 agents loaded?")
    lines.append("- Are all 7 agents executed or limited by MAX_ACTIVE_AGENTS?")
    lines.append("- Does every agent receive the Entity Bible context?")
    lines.append("- Does every agent receive the full client context?")
    lines.append("- Is Instagram Audit participating?")
    lines.append("- Is Sales participating?")
    lines.append("- Which agent output influences LATEST_ANALYSIS.json?")
    lines.append("- Should the pipeline run in stages: Core → Expression → Conversion?")
    lines.append("")

    path.write_text("\n".join(lines), encoding="utf-8")


def main() -> None:
    REPORTS_DIR.mkdir(parents=True, exist_ok=True)

    report = {
        "generated_at": datetime.now().isoformat(timespec="seconds"),
        "agent_files": list_agent_files(),
        "flow_findings": scan_backend_flow(),
        "agent_references": find_agent_names_in_code(),
        "key_blocks": extract_key_blocks(),
    }

    report["inferred_status"] = infer_agent_status(
        report["agent_references"],
        report["flow_findings"],
    )

    json_path = REPORTS_DIR / "AGENTS_FLOW_REPORT.json"
    md_path = REPORTS_DIR / "AGENTS_FLOW_REPORT.md"

    json_path.write_text(json.dumps(report, indent=2, ensure_ascii=False), encoding="utf-8")
    write_markdown_report(report, md_path)

    print("Agent flow report generated:")
    print(f"- {json_path}")
    print(f"- {md_path}")


if __name__ == "__main__":
    main()