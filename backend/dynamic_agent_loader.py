from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent
AGENTS_ROOT = BASE_DIR / "agents" / "AGENTS"

AGENT_PRIORITY = [
    "branding_agent",
    "strategy_agent",
    "psychology_agent",
    "cinematic_director_agent",
    "content_agent",
    "instagram_audit_agent",
    "sales_agent",
]


def _read_markdown_files(agent_path):
    sections = []

    for file in sorted(agent_path.glob("*.md")):
        content = file.read_text(encoding="utf-8").strip()

        if not content:
            continue

        sections.append(f"# FILE: {file.name}\n\n{content}")

    return "\n\n".join(sections)


def load_agent(agent_name):
    agent_path = AGENTS_ROOT / agent_name

    if not agent_path.is_dir():
        return None

    system_prompt = _read_markdown_files(agent_path)

    if not system_prompt:
        return None

    return {
        "name": agent_name,
        "system_prompt": system_prompt,
        "source": str(agent_path),
    }


def load_all_agents():
    if not AGENTS_ROOT.exists():
        return []

    folders = [folder for folder in AGENTS_ROOT.iterdir() if folder.is_dir()]
    folders.sort(
        key=lambda folder: (
            AGENT_PRIORITY.index(folder.name)
            if folder.name in AGENT_PRIORITY
            else len(AGENT_PRIORITY),
            folder.name,
        )
    )

    agents = []

    for folder in folders:
        agent = load_agent(folder.name)

        if agent:
            agents.append(agent)

    return agents
