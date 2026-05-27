from pathlib import Path
from datetime import datetime
import json
import re
import shutil
import subprocess
import sys


PROJECT_ROOT = Path(__file__).resolve().parent
BACKEND_DIR = PROJECT_ROOT / "backend"
DOCS_DIR = PROJECT_ROOT / "docs"

AI_PROVIDER_PATH = BACKEND_DIR / "ai_provider.py"

OLLAMA_TIMEOUT_SECONDS = 25
OPENAI_QUOTA_COOLDOWN_SECONDS = 60 * 60 * 6  # 6 hours


def read_text(path: Path) -> str:
    return path.read_text(encoding="utf-8", errors="replace")


def write_text(path: Path, content: str) -> None:
    path.write_text(content, encoding="utf-8")


def backup_file(path: Path) -> Path:
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    backup_path = path.with_suffix(path.suffix + f".bak_{timestamp}")
    shutil.copy2(path, backup_path)
    return backup_path


def ensure_import_time(content: str) -> tuple[str, bool]:
    if re.search(r"^from\s+time\s+import\s+time\b", content, flags=re.MULTILINE):
        return content, False

    if re.search(r"^import\s+time\b", content, flags=re.MULTILINE):
        return content, False

    lines = content.splitlines()
    insert_index = 0

    for index, line in enumerate(lines):
        if line.startswith("import ") or line.startswith("from "):
            insert_index = index + 1

    lines.insert(insert_index, "from time import time")
    return "\n".join(lines) + "\n", True


def patch_ollama_timeout(content: str) -> tuple[str, list[str]]:
    changes = []

    # Replace any timeout=number inside requests.post calls or general calls.
    new_content, count = re.subn(
        r"timeout\s*=\s*\d+",
        f"timeout={OLLAMA_TIMEOUT_SECONDS}",
        content,
    )

    if count:
        changes.append(f"Updated existing timeout=... occurrences to timeout={OLLAMA_TIMEOUT_SECONDS}.")
        return new_content, changes

    # If no timeout exists, try to add it to the Ollama requests.post call.
    # This targets: requests.post(... json=..., headers=...) or requests.post(...)
    pattern = re.compile(
        r"(requests\.post\(\s*f?[\"']\{?host\}?/api/chat[\"'].*?)(\n\s*\))",
        flags=re.DOTALL,
    )

    match = pattern.search(content)
    if match and "timeout=" not in match.group(1):
        replacement = match.group(1).rstrip() + f",\n        timeout={OLLAMA_TIMEOUT_SECONDS}," + match.group(2)
        content = content[: match.start()] + replacement + content[match.end() :]
        changes.append(f"Added timeout={OLLAMA_TIMEOUT_SECONDS} to Ollama /api/chat request.")
        return content, changes

    # More generic fallback: find first requests.post in _ollama_chat block and add timeout before closing.
    block_match = re.search(
        r"(def\s+_ollama_chat\s*\(.*?\):)(.*?)(\n\ndef\s+|\Z)",
        content,
        flags=re.DOTALL,
    )

    if block_match:
        block = block_match.group(2)
        if "requests.post" in block and "timeout=" not in block:
            patched_block, count = re.subn(
                r"(requests\.post\((?:.|\n)*?)(\n\s*\))",
                rf"\1,\n        timeout={OLLAMA_TIMEOUT_SECONDS}\2",
                block,
                count=1,
                flags=re.DOTALL,
            )
            if count:
                content = (
                    content[: block_match.start(2)]
                    + patched_block
                    + content[block_match.end(2) :]
                )
                changes.append(f"Added timeout={OLLAMA_TIMEOUT_SECONDS} inside _ollama_chat().")
                return content, changes

    changes.append("WARNING: Could not automatically patch Ollama timeout. Review ai_provider.py manually.")
    return content, changes


def patch_openai_quota_cooldown(content: str) -> tuple[str, list[str]]:
    changes = []

    # Try to replace existing cooldown values near OPENAI failures.
    # Common patterns:
    # PROVIDER_STATE["openai_disabled_until"] = time() + 300
    # PROVIDER_STATE["openai_disabled_until"] = time.time() + 300
    cooldown_patterns = [
        (
            r'PROVIDER_STATE\["openai_disabled_until"\]\s*=\s*time\(\)\s*\+\s*\d+',
            f'PROVIDER_STATE["openai_disabled_until"] = time() + {OPENAI_QUOTA_COOLDOWN_SECONDS}',
        ),
        (
            r'PROVIDER_STATE\["openai_disabled_until"\]\s*=\s*time\.time\(\)\s*\+\s*\d+',
            f'PROVIDER_STATE["openai_disabled_until"] = time.time() + {OPENAI_QUOTA_COOLDOWN_SECONDS}',
        ),
    ]

    patched_any = False

    for pattern, replacement in cooldown_patterns:
        content, count = re.subn(pattern, replacement, content)
        if count:
            patched_any = True
            changes.append(
                f"Updated OpenAI disabled cooldown to {OPENAI_QUOTA_COOLDOWN_SECONDS} seconds."
            )

    if patched_any:
        return content, changes

    # If the file mentions insufficient_quota but has no cooldown assignment, add a helper.
    if "insufficient_quota" in content and "_openai_quota_cooldown_seconds" not in content:
        helper = f'''

def _openai_quota_cooldown_seconds(error_text=""):
    error_text = str(error_text or "").lower()

    if "insufficient_quota" in error_text or "429" in error_text:
        return {OPENAI_QUOTA_COOLDOWN_SECONDS}

    return 300
'''
        content = content + helper
        changes.append(
            "Added _openai_quota_cooldown_seconds() helper, but did not wire it automatically."
        )

    else:
        changes.append(
            "No existing OpenAI cooldown assignment found. No cooldown patch applied automatically."
        )

    return content, changes


def add_ollama_runtime_notes(content: str) -> tuple[str, list[str]]:
    changes = []

    marker = "# Brand Experience local provider tuning"
    if marker in content:
        return content, changes

    note = f'''
# Brand Experience local provider tuning
# Ollama can take longer when running multiple Brand Experience agents with Entity Bible context.
# Recommended timeout: {OLLAMA_TIMEOUT_SECONDS}s.
# Recommended OpenAI quota cooldown: {OPENAI_QUOTA_COOLDOWN_SECONDS}s.
'''
    content = note + "\n" + content
    changes.append("Added provider tuning notes.")
    return content, changes


def run_py_compile(path: Path) -> dict:
    result = subprocess.run(
        [sys.executable, "-m", "py_compile", str(path)],
        cwd=str(PROJECT_ROOT),
        capture_output=True,
        text=True,
    )

    return {
        "command": f"{sys.executable} -m py_compile {path}",
        "returncode": result.returncode,
        "ok": result.returncode == 0,
        "stdout": result.stdout[-4000:],
        "stderr": result.stderr[-4000:],
    }


def write_report(report: dict) -> None:
    DOCS_DIR.mkdir(parents=True, exist_ok=True)

    json_path = DOCS_DIR / "AI_PROVIDER_OLLAMA_TIMEOUT_UPDATE.json"
    md_path = DOCS_DIR / "AI_PROVIDER_OLLAMA_TIMEOUT_UPDATE.md"

    json_path.write_text(json.dumps(report, indent=2, ensure_ascii=False), encoding="utf-8")

    lines = [
        "# AI PROVIDER OLLAMA TIMEOUT UPDATE",
        "",
        f"Generated at: {report['generated_at']}",
        "",
        "## Files",
        "",
        f"- Modified: `{report['modified_file']}`",
        f"- Backup: `{report['backup_file']}`",
        "",
        "## Changes",
        "",
    ]

    for change in report["changes"]:
        lines.append(f"- {change}")

    lines.extend(
        [
            "",
            "## Safety",
            "",
            "- Frontend touched: `False`",
            "- Framework prompt touched: `False`",
            "- Agents touched: `False`",
            "- Deliverables generated: `False`",
            "- IA called by this script: `False`",
            "",
            "## Syntax check",
            "",
            f"- OK: `{report['py_compile']['ok']}`",
            f"- Return code: `{report['py_compile']['returncode']}`",
        ]
    )

    if report["py_compile"]["stderr"]:
        lines.extend(
            [
                "",
                "```text",
                report["py_compile"]["stderr"],
                "```",
            ]
        )

    lines.extend(
        [
            "",
            "## Next steps",
            "",
            "1. Run backend tests:",
            "",
            "```powershell",
            r'backend\.venv\Scripts\python.exe -m unittest discover -s backend\tests',
            "```",
            "",
            "2. Run full check:",
            "",
            "```powershell",
            r'.\scripts\maintenance\check-all.ps1 -HealthUrl http://127.0.0.1:8000/health',
            "```",
            "",
            "3. Restart backend.",
            "",
            "4. Execute framework again.",
        ]
    )

    md_path.write_text("\n".join(lines), encoding="utf-8")

    print("Report written:")
    print(f"- {json_path}")
    print(f"- {md_path}")


def main() -> None:
    if not AI_PROVIDER_PATH.exists():
        raise FileNotFoundError(f"Missing file: {AI_PROVIDER_PATH}")

    original = read_text(AI_PROVIDER_PATH)
    backup = backup_file(AI_PROVIDER_PATH)

    content = original
    changes = []

    content, note_changes = add_ollama_runtime_notes(content)
    changes.extend(note_changes)

    content, import_changed = ensure_import_time(content)
    if import_changed:
        changes.append("Added `from time import time` import.")

    content, timeout_changes = patch_ollama_timeout(content)
    changes.extend(timeout_changes)

    content, cooldown_changes = patch_openai_quota_cooldown(content)
    changes.extend(cooldown_changes)

    write_text(AI_PROVIDER_PATH, content)

    compile_result = run_py_compile(AI_PROVIDER_PATH)

    report = {
        "generated_at": datetime.now().isoformat(timespec="seconds"),
        "modified_file": str(AI_PROVIDER_PATH.relative_to(PROJECT_ROOT)),
        "backup_file": str(backup.relative_to(PROJECT_ROOT)),
        "ollama_timeout_seconds": OLLAMA_TIMEOUT_SECONDS,
        "openai_quota_cooldown_seconds": OPENAI_QUOTA_COOLDOWN_SECONDS,
        "changes": changes,
        "py_compile": compile_result,
        "scope": {
            "frontend_touched": False,
            "framework_prompt_touched": False,
            "agents_touched": False,
            "deliverables_generated": False,
            "ai_called": False,
        },
    }

    write_report(report)

    print("")
    print("Done.")
    print("")
    print("Changes:")
    for change in changes:
        print(f"- {change}")

    if not compile_result["ok"]:
        print("")
        print("WARNING: py_compile failed. Restore backup if needed:")
        print(f"Copy-Item '{backup}' '{AI_PROVIDER_PATH}' -Force")
    else:
        print("")
        print("Syntax OK.")

    print("")
    print("Next:")
    print(r'backend\.venv\Scripts\python.exe -m unittest discover -s backend\tests')
    print(r'.\scripts\maintenance\check-all.ps1 -HealthUrl http://127.0.0.1:8000/health')


if __name__ == "__main__":
    main()