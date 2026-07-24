import re
from pathlib import Path

from client_manager import CLIENTS_ROOT


INTAKE_PATH = Path("01_DIAGNOSTICO_ACTUAL") / "INTAKE_GRAVITY_COMPLETO.md"
TEXT_EXTENSIONS = {".md", ".txt", ".json", ".csv", ".html", ".htm", ".yml", ".yaml"}


SECTIONS = [
    {
        "id": 1,
        "title": "Datos base de marca",
        "min_fields": 5,
        "agents": ["A23", "A00B", "A00"],
        "keywords": ["client_profile", "datos_cliente", "identity", "briefing", "marca", "fundador", "instagram"],
    },
    {
        "id": 2,
        "title": "Historia y fundador",
        "min_fields": 4,
        "agents": ["A23", "A03", "A07", "A13", "A19", "A20"],
        "keywords": ["historia", "story", "storytelling", "origen", "fundador", "transcripcion", "vision"],
    },
    {
        "id": 3,
        "title": "Oferta, servicio y metodo",
        "min_fields": 6,
        "agents": ["A09", "A10", "A12", "A27-A34"],
        "keywords": ["oferta", "offer", "servicio", "producto", "metodo", "precio", "ticket", "transformation_goal"],
    },
    {
        "id": 4,
        "title": "Audiencia, mercado y objeciones",
        "min_fields": 5,
        "agents": ["A03", "A05", "A09", "A10", "A11"],
        "keywords": ["audiencia", "cliente_ideal", "buyer", "mercado", "objecion", "competidor", "dolor"],
    },
    {
        "id": 5,
        "title": "Comunicacion y voz",
        "min_fields": 5,
        "agents": ["A06", "A08", "A10", "A17"],
        "keywords": ["copy", "caption", "texto", "voz", "tone", "guion", "whatsapp", "email", "cta", "contenido"],
    },
    {
        "id": 6,
        "title": "Identidad visual",
        "min_fields": 4,
        "agents": ["A01", "A02", "A04"],
        "keywords": ["visual", "logo", "paleta", "palette", "color", "tipografia", "feed", "board", "foto"],
    },
    {
        "id": 7,
        "title": "Embudo, ventas y conversion",
        "min_fields": 5,
        "agents": ["A09", "A10", "A18"],
        "keywords": ["embudo", "funnel", "ventas", "conversion", "lead", "landing", "formulario", "whatsapp"],
    },
    {
        "id": 8,
        "title": "Operacion y experiencia",
        "min_fields": 4,
        "agents": ["A05", "A33", "A99"],
        "keywords": ["operacion", "onboarding", "entrega", "experiencia", "limites", "politicas", "proceso"],
    },
    {
        "id": 9,
        "title": "Comunidad, ritual y pertenencia",
        "min_fields": 3,
        "agents": ["A18", "A21"],
        "keywords": ["comunidad", "community", "ritual", "pertenencia", "tribu", "ceremonia", "estatus"],
    },
    {
        "id": 10,
        "title": "Datos simbolicos opcionales",
        "min_fields": 4,
        "agents": ["A14", "A15", "A16", "A19", "A20", "A21", "A22"],
        "keywords": ["carta natal", "diseno humano", "diseño humano", "human design", "claves geneticas", "nacimiento", "astro"],
        "optional": True,
    },
    {
        "id": 11,
        "title": "Memoria y decisiones previas",
        "min_fields": 4,
        "agents": ["A00B", "A99", "A00"],
        "keywords": ["memory", "memoria", "blueprint", "diagnosis", "diagnostico", "analysis", "decision", "feedback"],
    },
    {
        "id": 12,
        "title": "Datos faltantes detectados",
        "min_fields": 1,
        "agents": ["A00B", "A99"],
        "keywords": ["faltante", "missing", "pendiente", "gap", "hueco"],
    },
    {
        "id": 13,
        "title": "Archivos adjuntos",
        "min_fields": 3,
        "agents": ["A01", "A06", "A09"],
        "keywords": ["logo", "captura", "screenshot", "whatsapp", "landing", "pdf", "audio", "transcripcion", "briefing"],
    },
]


AGENT_REQUIREMENTS = {
    "A01": [1, 6, 13],
    "A02": [1, 6],
    "A03": [2, 4],
    "A04": [1, 6],
    "A05": [4, 8],
    "A06": [1, 5],
    "A07": [2, 11],
    "A08": [5, 4],
    "A09": [3, 4, 7],
    "A10": [3, 4, 5, 7],
    "A11": [4],
    "A12": [3],
    "A13": [2, 4],
    "A14": [10],
    "A15": [10],
    "A16": [10],
    "A17": [5],
    "A18": [4, 7, 9],
    "A19": [2, 10],
    "A20": [2, 10],
    "A21": [9, 10],
    "A22": [10],
    "A23": [1, 2],
    "A27-A34": [1, 3, 7, 8, 11],
    "A99": [11, 12],
    "A00B": [1, 11, 12],
    "A00": [1, 3, 4, 5, 6, 7, 8, 11],
}


EMPTY_VALUES = {
    "",
    '""',
    "''",
    "n/a",
    "na",
    "no aplica",
    "pendiente",
    "por completar",
    "sin definir",
    "alta / media / baja",
}


def _normalize(value):
    return (
        str(value).strip().lower()
        .replace("á", "a")
        .replace("é", "e")
        .replace("í", "i")
        .replace("ó", "o")
        .replace("ú", "u")
        .replace("ñ", "n")
    )


def _safe_read(path, limit=300_000):
    try:
        return path.read_text(encoding="utf-8", errors="ignore")[:limit]
    except OSError:
        return ""


def _find_client(client_name):
    wanted = _normalize(client_name)
    if not wanted or not CLIENTS_ROOT.exists():
        return None
    for path in CLIENTS_ROOT.iterdir():
        if path.is_dir() and _normalize(path.name) == wanted:
            return path
    return None


def _section_text(markdown, number):
    match = re.search(rf"^##\s+{number}\.\s+.*?$", markdown, re.MULTILINE)
    if not match:
        return ""
    next_match = re.search(r"^##\s+\d+\.\s+.*?$", markdown[match.end():], re.MULTILINE)
    end = match.end() + next_match.start() if next_match else len(markdown)
    return markdown[match.end():end]


def _is_filled(value):
    cleaned = _normalize(value).strip(" .:-")
    return bool(cleaned) and cleaned not in EMPTY_VALUES and cleaned not in {"1", "2", "3", "4", "5"}


def _count_filled_fields(section):
    total = 0
    filled = 0
    for raw_line in section.splitlines():
        line = raw_line.strip()
        if not line.startswith("|") or "---" in line:
            continue
        cells = [cell.strip() for cell in line.strip("|").split("|")]
        if len(cells) < 2:
            continue
        label, value = cells[0], cells[1]
        if _normalize(label) in {"campo", "pregunta", "material", "elemento", "dato faltante"}:
            continue
        total += 1
        if _is_filled(value):
            filled += 1
    for raw_line in section.splitlines():
        line = raw_line.strip()
        if re.match(r"^\d+\.\s+", line):
            total += 1
            if _is_filled(re.sub(r"^\d+\.\s+", "", line)):
                filled += 1
    return filled, total


def _collect_text_files(client_path):
    files = []
    for path in client_path.rglob("*"):
        if not path.is_file():
            continue
        if path.name == INTAKE_PATH.name:
            continue
        if path.suffix.lower() in TEXT_EXTENSIONS:
            files.append(path)
    return sorted(files)


def _evidence_for_section(client_path, files, rule):
    hits = []
    keywords = [_normalize(keyword) for keyword in rule["keywords"]]
    for path in files:
        relative = str(path.relative_to(client_path)).replace("\\", "/")
        relative_normalized = _normalize(relative)
        if any(keyword in relative_normalized for keyword in keywords):
            hits.append(relative)
            continue
        text = _normalize(_safe_read(path, limit=60_000))
        if any(keyword in text for keyword in keywords):
            hits.append(relative)
    return hits[:5]


def _score_section(filled, min_fields, evidence_count):
    field_ratio = min(1.0, filled / max(min_fields, 1))
    evidence_ratio = min(1.0, evidence_count / 3)
    if filled == 0:
        return round(evidence_ratio * 75, 1)
    return round(min(1.0, field_ratio * 0.75 + evidence_ratio * 0.35) * 100, 1)


def _status(score, optional=False):
    if optional and score == 0:
        return "Opcional sin datos"
    if score >= 70:
        return "Listo"
    if score >= 35:
        return "Parcial"
    if score > 0:
        return "Debil"
    return "Faltante"


def _next_action(overall, priorities, ready_count, has_latest_analysis, has_master):
    high_priorities = [item for item in priorities if item["priority"] == "Alta"]
    if high_priorities:
        first = high_priorities[0]
        return {
            "id": "complete_missing_data",
            "label": f"Completar {first['area']}",
            "reason": "Hay datos obligatorios faltantes antes de una auditoria profunda.",
        }
    if not has_latest_analysis:
        return {
            "id": "run_analysis",
            "label": "Ejecutar diagnostico",
            "reason": "El cliente tiene fuentes suficientes y no hay analisis reciente.",
        }
    if not has_master:
        return {
            "id": "generate_master",
            "label": "Generar Master Brand Experience",
            "reason": "Ya existe diagnostico; falta condensarlo en entregable maestro.",
        }
    if overall >= 70 and ready_count >= 20:
        return {
            "id": "next_sprint",
            "label": "Definir proximo sprint",
            "reason": "El cliente esta preparado y ya tiene base operativa.",
        }
    return {
        "id": "review_partial_agents",
        "label": "Revisar agentes parciales",
        "reason": "Hay suficiente base para avanzar, pero conviene revisar lecturas parciales.",
    }


def build_client_readiness(client_name):
    client_path = _find_client(client_name)
    if not client_path:
        return None

    intake_file = client_path / INTAKE_PATH
    intake_text = _safe_read(intake_file) if intake_file.exists() else ""
    files = _collect_text_files(client_path)
    sections = []
    section_map = {}

    for rule in SECTIONS:
        section = _section_text(intake_text, rule["id"]) if intake_text else ""
        filled, total = _count_filled_fields(section)
        evidence = _evidence_for_section(client_path, files, rule)
        score = _score_section(filled, rule["min_fields"], len(evidence))
        data = {
            "id": rule["id"],
            "title": rule["title"],
            "status": _status(score, rule.get("optional", False)),
            "score": score,
            "fields_filled": filled,
            "fields_total": total,
            "evidence": evidence,
            "agents": rule["agents"],
            "optional": bool(rule.get("optional", False)),
        }
        sections.append(data)
        section_map[rule["id"]] = data

    agents = []
    for agent, required_sections in AGENT_REQUIREMENTS.items():
        scores = [section_map[number]["score"] for number in required_sections]
        missing_required = [
            number
            for number in required_sections
            if section_map[number]["score"] < 35 and not section_map[number]["optional"]
        ]
        missing_optional = [
            number
            for number in required_sections
            if section_map[number]["score"] < 35 and section_map[number]["optional"]
        ]
        avg = round(sum(scores) / len(scores), 1)
        if missing_required:
            agent_status = "Bloqueado"
        elif missing_optional:
            agent_status = "Parcial sin lente simbolica" if avg < 60 else "Listo sin lente simbolica"
        elif avg >= 60:
            agent_status = "Listo"
        else:
            agent_status = "Parcial"
        agents.append({
            "id": agent,
            "status": agent_status,
            "score": avg,
            "missing_sections": missing_required,
            "optional_missing_sections": missing_optional,
        })

    required_scores = [section["score"] for section in sections if not section["optional"]]
    overall = round(sum(required_scores) / len(required_scores), 1)
    priorities = [
        {
            "section_id": section["id"],
            "area": section["title"],
            "priority": "Alta" if section["score"] < 35 else "Media",
            "agents": section["agents"],
        }
        for section in sections
        if not section["optional"] and section["score"] < 70
    ]
    ready_agents = [agent for agent in agents if agent["status"].startswith("Listo")]
    partial_agents = [agent for agent in agents if agent["status"].startswith("Parcial")]
    blocked_agents = [agent for agent in agents if agent["status"] == "Bloqueado"]

    latest_analysis = client_path / "01_DIAGNOSTICO_ACTUAL" / "Analisis_Brand_Experience" / "LATEST_ANALYSIS.json"
    master_deliverable = client_path / "05_ENTREGAS" / "MASTER_BRAND_EXPERIENCE.md"

    return {
        "client": client_path.name,
        "overall": overall,
        "status": _status(overall),
        "intake_exists": intake_file.exists(),
        "files_scanned": len(files),
        "sections": sections,
        "agents": agents,
        "summary": {
            "ready": len(ready_agents),
            "partial": len(partial_agents),
            "blocked": len(blocked_agents),
        },
        "ready_agents": [agent["id"] for agent in ready_agents],
        "partial_agents": [agent["id"] for agent in partial_agents],
        "blocked_agents": [agent["id"] for agent in blocked_agents],
        "priorities": priorities,
        "assets": {
            "has_latest_analysis": latest_analysis.exists(),
            "has_master_deliverable": master_deliverable.exists(),
        },
        "next_action": _next_action(
            overall,
            priorities,
            len(ready_agents),
            latest_analysis.exists(),
            master_deliverable.exists(),
        ),
    }
