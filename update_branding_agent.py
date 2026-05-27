from pathlib import Path
from datetime import datetime
import shutil
import subprocess
import sys
import json


PROJECT_ROOT = Path(__file__).resolve().parent
BRANDING_AGENT_DIR = PROJECT_ROOT / "backend" / "agents" / "AGENTS" / "branding_agent"
DOCS_DIR = PROJECT_ROOT / "docs"

OUTPUT_STRUCTURE_PATH = BRANDING_AGENT_DIR / "output_structure.md"
PROMPTS_PATH = BRANDING_AGENT_DIR / "prompts.md"

OUTPUT_STRUCTURE_CONTENT = """# BRANDING AGENT — OUTPUT STRUCTURE

Every response must feed the Brand Experience OS decision dashboard and the client deliverables system.

The Branding Agent must not answer as a generic marketing assistant.
It must reveal the deep identity of the brand as an entity and translate that identity into clear strategic decisions.

Use this structure in every response:

---

## 1. ENTITY READING

- Emerging entity
- Emotional frequency
- Current perception
- Desired perception
- Main identity tension
- What the brand is unconsciously transmitting
- What the brand should start transmitting

---

## 2. BRAND CORE

- Essence
- Purpose
- Promise
- Differentiation
- Personality
- Values
- Beliefs
- Symbolic territory

---

## 3. PERCEPTION STRATEGY

- What the brand must stop looking like
- What the brand must start looking like
- Premium perception shift
- Trust signals
- Authority signals
- Emotional signals
- Risks if perception is not corrected

---

## 4. VERBAL IDENTITY

- Tone of voice
- Words to use
- Words to avoid
- Example phrases
- Commercial voice
- Instagram voice
- WhatsApp voice
- Manifesto direction

---

## 5. VISUAL IDENTITY DIRECTION

- Logo direction
- Symbolic territory
- Color emotion
- Typography direction
- Composition direction
- Visual rhythm
- Visual risks
- What the identity system must communicate before decoration

---

## 6. STRATEGIC OPPORTUNITY

- Positioning decision
- Business impact
- Content implication
- Offer implication
- Experience implication
- Brand asset implication

---

## 7. NEXT ACTIONS

- Immediate action
- Deliverable to create
- Decision to make
- Risk if ignored
- What should be generated next

---

## Output Requirements

The response must be:

- strategic
- specific
- actionable
- emotionally intelligent
- visually aware
- useful for downstream deliverables

The response must directly support:

- LATEST_ANALYSIS.json
- MASTER_BRAND_EXPERIENCE.md
- identity_cliente.md
- logo_system_prompt.md
- color_palette_prompt.md
- tone_of_brand_prompt.md
- brand_identity_board_prompt.md

Never finish with vague advice.
Always finish with clear identity decisions.
"""


PROMPTS_CONTENT = """# BRANDING AGENT — PROMPTS

Operate as a specialized creative intelligence entity focused on deep brand identity.

You are not a generic branding assistant.
You are the Branding Agent of the Brand Experience OS.

Your mission is to reveal the true emotional identity of a client brand and transform it into a coherent strategic system.

---

## Core Operating Mode

Before proposing any visual or verbal direction, first interpret the brand as an entity.

Analyze:

- what the brand really is
- what it is currently perceived as
- what emotional frequency it transmits
- what perception gap exists
- what identity is latent but not yet expressed
- what should be clarified, elevated or removed

---

## Strategic Principles

Always prioritize:

1. Identity before design
2. Perception before decoration
3. Emotional coherence before trends
4. Brand essence before content
5. Authority before noise
6. Premium perception before aesthetic excess
7. Meaning before style

---

## Required Thinking

When analyzing a client, translate raw information into clear decisions about:

- essence
- promise
- differentiation
- personality
- tone of voice
- symbolic territory
- perception strategy
- visual direction
- brand risks
- next deliverables

---

## Downstream Deliverable Awareness

Your output must help generate:

- MASTER_BRAND_EXPERIENCE.md
- identity_cliente.md
- logo_system_prompt.md
- color_palette_prompt.md
- tone_of_brand_prompt.md
- brand_identity_board_prompt.md
- storytelling_board_prompt.md
- visual_universe_board_prompt.md

Write in a way that those deliverables can extract clear, structured, reusable identity decisions.

---

## What To Avoid

Do not produce:

- generic branding language
- agency clichés
- empty storytelling
- vague emotional phrases
- visual ideas without strategic meaning
- trend-based recommendations
- logo suggestions disconnected from perception
- color suggestions without emotional logic
- tone suggestions without examples

---

## Response Style

The response must feel:

- premium
- cinematic
- emotionally precise
- strategically useful
- human
- direct
- decision-oriented

Use clear sections.
Use concrete language.
Make strategic choices.
Do not stay neutral when the brand needs direction.
"""


def backup_file(path: Path) -> Path:
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    backup = path.with_suffix(path.suffix + f".bak_{timestamp}")
    shutil.copy2(path, backup)
    return backup


def write_file_with_backup(path: Path, content: str) -> dict:
    if not path.exists():
        raise FileNotFoundError(f"File not found: {path}")

    original = path.read_text(encoding="utf-8", errors="replace")
    backup = backup_file(path)

    path.write_text(content, encoding="utf-8")

    return {
        "file": str(path.relative_to(PROJECT_ROOT)),
        "backup": str(backup.relative_to(PROJECT_ROOT)),
        "original_length": len(original),
        "new_length": len(content),
    }


def run_command(command: list[str], cwd: Path) -> dict:
    result = subprocess.run(
        command,
        cwd=str(cwd),
        capture_output=True,
        text=True,
        shell=False,
    )

    return {
        "command": " ".join(command),
        "returncode": result.returncode,
        "stdout": result.stdout[-4000:],
        "stderr": result.stderr[-4000:],
        "ok": result.returncode == 0,
    }


def write_report(results: list[dict], checks: list[dict]) -> None:
    DOCS_DIR.mkdir(parents=True, exist_ok=True)

    timestamp = datetime.now().isoformat(timespec="seconds")
    report = {
        "generated_at": timestamp,
        "modified_files": results,
        "checks": checks,
        "scope": {
            "touched_python_backend": False,
            "touched_frontend": False,
            "called_ai": False,
            "generated_deliverables": False,
        },
    }

    json_path = DOCS_DIR / "BRANDING_AGENT_UPDATE_REPORT.json"
    md_path = DOCS_DIR / "BRANDING_AGENT_UPDATE_REPORT.md"

    json_path.write_text(json.dumps(report, indent=2, ensure_ascii=False), encoding="utf-8")

    lines = [
        "# BRANDING AGENT UPDATE REPORT",
        "",
        f"Generated at: {timestamp}",
        "",
        "## Files modified",
        "",
    ]

    for item in results:
        lines.append(f"- `{item['file']}`")
        lines.append(f"  - Backup: `{item['backup']}`")
        lines.append(f"  - Original length: `{item['original_length']}`")
        lines.append(f"  - New length: `{item['new_length']}`")
        lines.append("")

    lines.extend(
        [
            "## Scope confirmation",
            "",
            "- Backend Python touched: `False`",
            "- Frontend touched: `False`",
            "- AI called: `False`",
            "- Deliverables generated: `False`",
            "",
            "## Checks",
            "",
        ]
    )

    for check in checks:
        status = "OK" if check["ok"] else "FAILED"
        lines.append(f"### {check['command']}")
        lines.append("")
        lines.append(f"- Status: `{status}`")
        lines.append(f"- Return code: `{check['returncode']}`")
        if check["stdout"]:
            lines.append("")
            lines.append("```text")
            lines.append(check["stdout"])
            lines.append("```")
        if check["stderr"]:
            lines.append("")
            lines.append("```text")
            lines.append(check["stderr"])
            lines.append("```")
        lines.append("")

    md_path.write_text("\n".join(lines), encoding="utf-8")

    print("Report written:")
    print(f"- {json_path}")
    print(f"- {md_path}")


def main() -> None:
    if not BRANDING_AGENT_DIR.exists():
        raise FileNotFoundError(f"Branding agent folder not found: {BRANDING_AGENT_DIR}")

    results = []

    results.append(write_file_with_backup(OUTPUT_STRUCTURE_PATH, OUTPUT_STRUCTURE_CONTENT))
    results.append(write_file_with_backup(PROMPTS_PATH, PROMPTS_CONTENT))

    print("Updated branding_agent files:")
    for item in results:
        print(f"- {item['file']}")
        print(f"  Backup: {item['backup']}")

    checks = []

    backend_python = PROJECT_ROOT / "backend" / ".venv" / "Scripts" / "python.exe"

    if backend_python.exists():
        checks.append(
            run_command(
                [str(backend_python), "-m", "unittest", "discover", "-s", "backend\\tests"],
                PROJECT_ROOT,
            )
        )
    else:
        checks.append(
            {
                "command": "backend .venv unittest",
                "returncode": 1,
                "stdout": "",
                "stderr": "backend\\.venv\\Scripts\\python.exe not found. Run tests manually.",
                "ok": False,
            }
        )

    write_report(results, checks)

    print("")
    print("Done.")
    print("")
    print("Recommended next check:")
    print(r'.\scripts\maintenance\check-all.ps1 -HealthUrl http://127.0.0.1:8000/health')


if __name__ == "__main__":
    main()