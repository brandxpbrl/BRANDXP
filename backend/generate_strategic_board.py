#!/usr/bin/env python3
"""
Generador inteligente de laminas estrategicas para Brand Experience OS.

Lee la carpeta real de un cliente, prioriza specs JSON si existen, usa archivos
.md como contexto de respaldo y renderiza una lamina HTML/PDF sin hardcodear
una marca especifica.
"""

from __future__ import annotations

import argparse
import asyncio
import json
import re
from datetime import date
from pathlib import Path
from typing import Any

try:
    from playwright.async_api import async_playwright
except ModuleNotFoundError:
    async_playwright = None

try:
    from jinja2 import Template
except ModuleNotFoundError:
    class Template:  # type: ignore[no-redef]
        """Fallback minimo para este template si Jinja2 no esta instalado."""

        def __init__(self, template: str) -> None:
            self.template = template

        def render(self, data: dict[str, Any]) -> str:
            rendered = self._render_loops(self.template, data)
            return re.sub(r"{{\s*([^}]+?)\s*}}", lambda match: self._resolve(match.group(1), data), rendered)

        def _render_loops(self, template: str, data: dict[str, Any]) -> str:
            pattern = re.compile(r"{%\s*for\s+(\w+)\s+in\s+([^\s%]+)\s*%}(.*?){%\s*endfor\s*%}", re.DOTALL)

            def replace_loop(match: re.Match[str]) -> str:
                item_name = match.group(1)
                source_path = match.group(2)
                block = match.group(3)
                items = self._get_value(source_path, data)
                if not isinstance(items, list):
                    return ""
                blocks: list[str] = []
                for index, item in enumerate(items, start=1):
                    local = {**data, item_name: item, "loop": {"index": index}}
                    blocks.append(re.sub(r"{{\s*([^}]+?)\s*}}", lambda inner: self._resolve(inner.group(1), local), block))
                return "".join(blocks)

            return pattern.sub(replace_loop, template)

        def _resolve(self, expression: str, data: dict[str, Any]) -> str:
            return safe_text(self._get_value(expression.strip(), data))

        def _get_value(self, expression: str, data: dict[str, Any]) -> Any:
            value: Any = data
            for part in expression.split("."):
                if isinstance(value, dict):
                    value = value.get(part, "")
                else:
                    value = getattr(value, part, "")
            return value


PROJECT_ROOT = Path(__file__).resolve().parents[1]
CLIENTS_ROOT = PROJECT_ROOT / "BRAND_EXPERIENCE" / "03_CLIENT_SYSTEM" / "CLIENTES_ACTIVOS"
EXPORTS_ROOT = PROJECT_ROOT / "exports" / "strategic_boards"
BACKEND_EXPORTS_ROOT = PROJECT_ROOT / "backend" / "strategic_board_exports"

PREFERRED_MD_FILES = [
    "01_DIAGNOSTICO_ACTUAL/Analisis_Brand_Experience/LATEST_ANALYSIS.md",
    "05_ENTREGAS/brand_analysis.md",
    "05_ENTREGAS/entity_bible.md",
    "05_ENTREGAS/identity_patch.md",
    "05_ENTREGAS/visual_universe.md",
    "05_ENTREGAS/content_strategy.md",
    "05_ENTREGAS/brand_identity_board.md",
    "05_ENTREGAS/storytelling_strategy_board.md",
    "05_ENTREGAS/visual_universe_board.md",
]

PREFERRED_JSON_FILES = [
    "05_ENTREGAS/board_specs/brand_identity_board.json",
    "05_ENTREGAS/board_specs/storytelling_strategy_board.json",
    "05_ENTREGAS/board_specs/visual_universe_board.json",
    "01_DIAGNOSTICO_ACTUAL/Analisis_Brand_Experience/LATEST_ANALYSIS.json",
]


def slugify(value: str) -> str:
    slug = re.sub(r"[^a-zA-Z0-9]+", "_", value.strip().lower()).strip("_")
    return slug or "client"


def safe_text(value: Any, fallback: str = "") -> str:
    if value is None:
        return fallback
    if isinstance(value, str):
        cleaned = re.sub(r"\s+", " ", value).strip()
        return cleaned or fallback
    return str(value)


def truncate(value: str, limit: int = 260) -> str:
    text = safe_text(value)
    if len(text) <= limit:
        return text
    return text[: limit - 1].rstrip() + "..."


def read_text(path: Path, limit: int = 80_000) -> str:
    try:
        return path.read_text(encoding="utf-8", errors="ignore")[:limit]
    except OSError:
        return ""


def read_json(path: Path) -> dict[str, Any]:
    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError):
        return {}


def resolve_client_path(client: str) -> Path:
    possible_path = Path(client)
    if possible_path.exists():
        return possible_path.resolve()

    exact = CLIENTS_ROOT / client
    if exact.exists():
        return exact.resolve()

    normalized = slugify(client)
    for candidate in CLIENTS_ROOT.iterdir():
        if candidate.is_dir() and slugify(candidate.name) == normalized:
            return candidate.resolve()

    available = ", ".join(sorted(p.name for p in CLIENTS_ROOT.iterdir() if p.is_dir()))
    raise FileNotFoundError(f"No encontre el cliente '{client}'. Clientes disponibles: {available}")


def collect_client_sources(client_path: Path) -> tuple[dict[str, dict[str, Any]], dict[str, str]]:
    json_sources: dict[str, dict[str, Any]] = {}
    md_sources: dict[str, str] = {}

    for relative in PREFERRED_JSON_FILES:
        path = client_path / relative
        if path.exists():
            json_sources[relative] = read_json(path)

    for relative in PREFERRED_MD_FILES:
        path = client_path / relative
        if path.exists():
            text = read_text(path)
            if text:
                md_sources[relative] = text

    if not md_sources:
        for path in sorted(client_path.rglob("*.md"))[:40]:
            if "visuals" in path.parts:
                continue
            text = read_text(path, limit=25_000)
            if text:
                md_sources[str(path.relative_to(client_path))] = text

    return json_sources, md_sources


def merged_markdown(md_sources: dict[str, str], limit: int = 120_000) -> str:
    chunks = []
    used = 0
    for name, text in md_sources.items():
        block = f"\n\n--- SOURCE: {name} ---\n{text}"
        if used + len(block) > limit:
            break
        chunks.append(block)
        used += len(block)
    return "".join(chunks)


def section_after_heading(text: str, heading_keywords: list[str], limit: int = 600) -> str:
    lines = text.splitlines()
    keywords = [keyword.lower() for keyword in heading_keywords]
    for index, line in enumerate(lines):
        normalized = line.strip().lower()
        if normalized.startswith("#") and any(keyword in normalized for keyword in keywords):
            body: list[str] = []
            for next_line in lines[index + 1 :]:
                if next_line.strip().startswith("#") and body:
                    break
                if next_line.strip():
                    body.append(next_line.strip("- ").strip())
            return truncate(" ".join(body), limit)
    return ""


def extract_bullets(text: str, heading_keywords: list[str], limit: int = 6) -> list[str]:
    lines = text.splitlines()
    keywords = [keyword.lower() for keyword in heading_keywords]
    collecting = False
    bullets: list[str] = []

    for line in lines:
        stripped = line.strip()
        normalized = stripped.lower()
        if stripped.startswith("#") and any(keyword in normalized for keyword in keywords):
            collecting = True
            continue
        if collecting and stripped.startswith("#") and bullets:
            break
        if collecting and re.match(r"^[-*]\s+", stripped):
            bullets.append(truncate(re.sub(r"^[-*]\s+", "", stripped), 120))
            if len(bullets) >= limit:
                break
    return bullets


def first_existing(*values: Any, fallback: str = "") -> str:
    for value in values:
        text = safe_text(value)
        if text:
            return text
    return fallback


def normalize_list_items(items: Any, title_keys: tuple[str, ...], body_keys: tuple[str, ...], limit: int = 4) -> list[dict[str, str]]:
    normalized: list[dict[str, str]] = []
    if not isinstance(items, list):
        return normalized

    for item in items:
        if isinstance(item, dict):
            title = first_existing(*(item.get(key) for key in title_keys), fallback="Principio")
            body = first_existing(*(item.get(key) for key in body_keys), fallback="Direccion estrategica pendiente de profundizar.")
        else:
            title = safe_text(item, "Principio")
            body = "Convertir este atributo en una regla visible de marca."
        normalized.append({"title": truncate(title, 48), "body": truncate(body, 160)})
        if len(normalized) >= limit:
            break
    return normalized


def normalize_palette(items: Any) -> list[dict[str, str]]:
    palette: list[dict[str, str]] = []
    if isinstance(items, dict):
        items = list(items.values())
    if not isinstance(items, list):
        return palette

    for item in items[:5]:
        if isinstance(item, dict):
            role = first_existing(item.get("role"), item.get("name"), item.get("label"), fallback="Color clave")
            hex_value = first_existing(item.get("hex"), item.get("value"), fallback="#1B6CA8")
            usage = first_existing(item.get("usage"), item.get("meaning"), item.get("description"), fallback="Sistema visual")
        else:
            role, hex_value, usage = safe_text(item, "Color clave"), "#1B6CA8", "Sistema visual"
        if not re.match(r"^#[0-9a-fA-F]{6}$", hex_value):
            hex_value = "#1B6CA8"
        palette.append({"role": truncate(role, 36), "hex": hex_value.upper(), "usage": truncate(usage, 60)})
    return palette


def infer_location(text: str) -> str:
    lowered = text.lower()
    if "rio de janeiro" in lowered or "río de janeiro" in lowered:
        return "Rio de Janeiro, Brasil"
    if "brasil" in lowered or "brazil" in lowered:
        return "Brasil"
    if "argentina" in lowered:
        return "Argentina"
    return "No especificado"


def build_brand_data(client_path: Path) -> dict[str, Any]:
    json_sources, md_sources = collect_client_sources(client_path)
    context = merged_markdown(md_sources)

    identity_spec = json_sources.get("05_ENTREGAS/board_specs/brand_identity_board.json", {})
    storytelling_spec = json_sources.get("05_ENTREGAS/board_specs/storytelling_strategy_board.json", {})
    visual_spec = json_sources.get("05_ENTREGAS/board_specs/visual_universe_board.json", {})
    latest = json_sources.get("01_DIAGNOSTICO_ACTUAL/Analisis_Brand_Experience/LATEST_ANALYSIS.json", {})
    analysis = latest.get("analysis", {}) if isinstance(latest.get("analysis"), dict) else {}
    diagnosis = analysis.get("diagnosis", {}) if isinstance(analysis.get("diagnosis"), dict) else {}

    client_name = first_existing(
        identity_spec.get("client_name"),
        storytelling_spec.get("client_name"),
        visual_spec.get("client_name"),
        latest.get("client"),
        client_path.name,
        fallback=client_path.name,
    )

    purpose = first_existing(
        identity_spec.get("brand_promise"),
        storytelling_spec.get("story_objective"),
        diagnosis.get("strategic_decision"),
        section_after_heading(context, ["purpose", "proposito", "propósito", "mission", "mision", "misión"]),
        fallback="Construir una presencia de marca clara, coherente y memorable a partir de su verdad estratégica.",
    )

    vision = first_existing(
        section_after_heading(context, ["vision", "visión"], 360),
        identity_spec.get("premium_positioning"),
        analysis.get("headline"),
        fallback="Convertir la identidad actual en un sistema de percepción, narrativa y experiencia capaz de sostener crecimiento.",
    )

    values = normalize_list_items(
        identity_spec.get("benefits") or identity_spec.get("brand_tone") or storytelling_spec.get("emotional_pillars"),
        ("name", "title", "principle", "label"),
        ("description", "body", "meaning", "signal"),
        limit=4,
    )
    if not values:
        bullets = extract_bullets(context, ["valores", "pilares", "beneficios"], limit=4)
        values = [{"title": item.split(":")[0][:42], "body": item} for item in bullets[:4]]
    if not values:
        values = [
            {"title": "Claridad", "body": "Ordenar la promesa para que el valor se entienda rapido."},
            {"title": "Confianza", "body": "Reducir incertidumbre con coherencia, prueba y presencia profesional."},
            {"title": "Diferenciacion", "body": "Convertir atributos genericos en codigos propios de marca."},
            {"title": "Conversion", "body": "Guiar la atencion hacia una accion concreta y natural."},
        ]

    palette = normalize_palette(
        identity_spec.get("palette")
        or visual_spec.get("emotional_palette")
        or visual_spec.get("color_palette")
        or visual_spec.get("color_meanings")
    )
    if not palette:
        palette = [
            {"role": "Deep Base", "hex": "#0D0F18", "usage": "Profundidad y foco editorial"},
            {"role": "Signature Accent", "hex": "#D9428F", "usage": "Diferenciacion emocional"},
            {"role": "Clarity Light", "hex": "#FFFFFF", "usage": "Legibilidad y confianza"},
            {"role": "Strategic Blue", "hex": "#1B6CA8", "usage": "Autoridad y estructura"},
        ]

    typography = identity_spec.get("typography") if isinstance(identity_spec.get("typography"), dict) else {}
    primary_font = first_existing(typography.get("primary"), typography.get("primary_font"), fallback="Montserrat Bold")
    secondary_font = first_existing(typography.get("secondary"), typography.get("secondary_font"), fallback="Open Sans Regular")

    atmosphere = first_existing(
        visual_spec.get("atmosphere"),
        visual_spec.get("general_atmosphere"),
        visual_spec.get("visual_mood"),
        identity_spec.get("premium_positioning"),
        section_after_heading(context, ["atmosfera", "atmósfera", "universo visual"], 180),
        fallback="Premium, cinematica, clara y emocionalmente coherente",
    )

    pillars = normalize_list_items(
        storytelling_spec.get("content_pillars") or identity_spec.get("instagram_style") or analysis.get("content_pillars"),
        ("name", "title", "pillar", "label"),
        ("description", "body", "purpose", "action"),
        limit=4,
    )
    if not pillars:
        bullets = extract_bullets(context, ["pilares de contenido", "storytelling", "contenido"], limit=4)
        pillars = [{"title": item.split(":")[0][:42], "body": item} for item in bullets[:4]]
    if not pillars:
        pillars = [
            {"title": "Autoridad", "body": "Demostrar criterio, metodo y dominio de la categoria."},
            {"title": "Deseo", "body": "Hacer tangible la experiencia que la audiencia quiere vivir."},
            {"title": "Prueba", "body": "Usar evidencia, procesos y testimonios para sostener confianza."},
            {"title": "Accion", "body": "Cerrar cada pieza con un siguiente paso claro."},
        ]

    hook = first_existing(
        storytelling_spec.get("narrative_axis"),
        storytelling_spec.get("closing_manifesto"),
        storytelling_spec.get("storyworld"),
        identity_spec.get("tagline"),
        analysis.get("headline"),
        fallback="La marca debe sentirse antes de explicarse: primero percepcion, despues informacion.",
    )

    return {
        "metadata": {
            "client_name": client_name,
            "project_name": "Lamina Estrategica de Marca",
            "version": "2.0",
            "date": date.today().isoformat(),
            "location": infer_location(context),
            "source_count": len(json_sources) + len(md_sources),
        },
        "brand_core": {
            "purpose": truncate(purpose, 340),
            "vision": truncate(vision, 260),
            "cardinal_values": [{"name": item["title"], "description": item["body"]} for item in values],
        },
        "visual_identity": {
            "color_palette": palette,
            "typography": {
                "primary_font": truncate(primary_font, 40),
                "secondary_font": truncate(secondary_font, 40),
            },
            "atmosphere": truncate(atmosphere, 180),
        },
        "storytelling_structure": {
            "narrative_hook": truncate(hook, 260),
            "pillars_list": pillars,
        },
        "source_files": sorted([*json_sources.keys(), *md_sources.keys()]),
    }


html_template_string = """
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Strategic Brand Board - {{ metadata.client_name }}</title>
    <style>
        @page { size: A4 landscape; margin: 13mm; }
        body {
            font-family: 'Helvetica Neue', Arial, sans-serif;
            color: #FFFFFF;
            margin: 0;
            padding: 0;
            background:
                radial-gradient(circle at 18% 8%, rgba(217, 66, 143, 0.26), transparent 28%),
                radial-gradient(circle at 82% 18%, rgba(27, 108, 168, 0.22), transparent 26%),
                #040911;
        }
        .board-header {
            width: 100%;
            margin-bottom: 18px;
            border-bottom: 2px solid #1B6CA8;
            padding-bottom: 12px;
            display: flex;
            justify-content: space-between;
            align-items: flex-end;
        }
        .title-area h1 {
            font-size: 24pt;
            margin: 0;
            text-transform: uppercase;
            color: #FFFFFF;
        }
        .title-area p {
            font-size: 9.5pt;
            margin: 5px 0 0 0;
            color: #4DA8DA;
            text-transform: uppercase;
            letter-spacing: 1.5px;
        }
        .meta-area {
            text-align: right;
            font-size: 8.5pt;
            color: #a8b5c7;
            line-height: 1.45;
            max-width: 45%;
        }
        .row-container {
            display: flex;
            justify-content: space-between;
            gap: 16px;
            margin-bottom: 16px;
            width: 100%;
        }
        .column-60 { width: 58%; }
        .column-40 { width: 40%; }
        .column-100 { width: 100%; }
        .panel-card {
            background: linear-gradient(145deg, rgba(13,27,42,0.96), rgba(7,16,28,0.96));
            border: 1px solid rgba(77,168,218,0.72);
            border-radius: 8px;
            padding: 18px;
            box-sizing: border-box;
            box-shadow: 0 18px 45px rgba(0,0,0,0.22);
        }
        .panel-card h2 {
            font-size: 10.5pt;
            color: #E94584;
            margin-top: 0;
            margin-bottom: 12px;
            text-transform: uppercase;
            letter-spacing: 1px;
            border-bottom: 1px solid #1b2a47;
            padding-bottom: 6px;
        }
        .purpose-text {
            font-size: 11.5pt;
            line-height: 1.45;
            color: #FFFFFF;
            font-style: italic;
            margin: 0;
        }
        .values-list { display: flex; flex-direction: column; gap: 8px; }
        .value-item {
            display: flex;
            border-bottom: 1px solid #1b2a47;
            padding-bottom: 6px;
            font-size: 8.8pt;
        }
        .value-name {
            font-weight: bold;
            color: #4DA8DA;
            width: 33%;
            flex-shrink: 0;
        }
        .value-desc { color: #d1dfef; }
        .color-row-container { display: flex; gap: 14px; }
        .color-item { flex: 1; text-align: center; }
        .color-block {
            border-radius: 5px;
            height: 48px;
            margin-bottom: 7px;
            border: 1px solid rgba(255,255,255,0.22);
        }
        .color-meta { font-size: 8pt; line-height: 1.28; }
        .system-strip {
            display: flex;
            justify-content: space-between;
            gap: 16px;
            margin-top: 13px;
            color: #a8b5c7;
            font-size: 8.6pt;
        }
        .pillars-container { display: flex; gap: 12px; }
        .pillar-cell {
            flex: 1;
            background-color: #091320;
            border-left: 3px solid #E94584;
            padding: 12px;
            border-radius: 0 5px 5px 0;
        }
        .pillar-title {
            font-size: 9.4pt;
            font-weight: bold;
            color: #FFFFFF;
            margin-bottom: 6px;
        }
        .pillar-body {
            font-size: 8pt;
            color: #a4b8cf;
            line-height: 1.38;
        }
        .source-note {
            color: #7d8ca1;
            font-size: 7.5pt;
            margin-top: 10px;
            text-align: right;
        }
    </style>
</head>
<body>
    <div class="board-header">
        <div class="title-area">
            <h1>{{ metadata.client_name }}</h1>
            <p>{{ metadata.project_name }}</p>
        </div>
        <div class="meta-area">
            <strong>Fecha:</strong> {{ metadata.date }} &nbsp;|&nbsp;
            <strong>Region:</strong> {{ metadata.location }}<br>
            <strong>Atmosfera:</strong> {{ visual_identity.atmosphere }}
        </div>
    </div>

    <div class="row-container">
        <div class="column-60">
            <div class="panel-card" style="min-height: 166px;">
                <h2>01 / Proposito Central de Marca</h2>
                <p class="purpose-text">"{{ brand_core.purpose }}"</p>
                <p style="font-size: 8.7pt; color: #a4b8cf; margin-top: 12px; margin-bottom: 0;">
                    <strong>Vision estrategica:</strong> {{ brand_core.vision }}
                </p>
            </div>
        </div>
        <div class="column-40">
            <div class="panel-card" style="min-height: 166px;">
                <h2>02 / Atributos Cardinales</h2>
                <div class="values-list">
                    {% for value in brand_core.cardinal_values %}
                    <div class="value-item">
                        <div class="value-name">{{ value.name }}</div>
                        <div class="value-desc">{{ value.description }}</div>
                    </div>
                    {% endfor %}
                </div>
            </div>
        </div>
    </div>

    <div class="row-container">
        <div class="column-100">
            <div class="panel-card">
                <h2>03 / Sistema de Identidad Visual</h2>
                <div class="color-row-container">
                    {% for color in visual_identity.color_palette %}
                    <div class="color-item">
                        <div class="color-block" style="background-color: {{ color.hex }};"></div>
                        <div class="color-meta">
                            <span style="font-weight: bold; color: #FFFFFF;">{{ color.role }}</span><br>
                            <span style="color: #4DA8DA; font-family: monospace;">{{ color.hex }}</span><br>
                            <span style="color: #8fa0b5;">{{ color.usage }}</span>
                        </div>
                    </div>
                    {% endfor %}
                </div>
                <div class="system-strip">
                    <div><strong>Tipografia principal:</strong> {{ visual_identity.typography.primary_font }}</div>
                    <div><strong>Tipografia secundaria:</strong> {{ visual_identity.typography.secondary_font }}</div>
                    <div><strong>Fuentes cargadas:</strong> {{ metadata.source_count }}</div>
                </div>
            </div>
        </div>
    </div>

    <div class="row-container">
        <div class="column-100">
            <div class="panel-card">
                <h2>04 / Pilares de Storytelling Estrategico</h2>
                <div style="background-color: #1b2a47; padding: 11px 14px; border-radius: 5px; margin-bottom: 14px; font-size: 10pt; border-left: 3px solid #4DA8DA;">
                    <strong>Hook narrativo:</strong> "{{ storytelling_structure.narrative_hook }}"
                </div>
                <div class="pillars-container">
                    {% for pillar in storytelling_structure.pillars_list %}
                    <div class="pillar-cell">
                        <div class="pillar-title">{{ loop.index }}. {{ pillar.title }}</div>
                        <div class="pillar-body">{{ pillar.body }}</div>
                    </div>
                    {% endfor %}
                </div>
                <div class="source-note">Generado desde la carpeta real del cliente y sus archivos .md/.json.</div>
            </div>
        </div>
    </div>
</body>
</html>
"""


def resolve_output_dir(client_path: Path, requested_output_dir: str | None) -> Path:
    if requested_output_dir:
        output_dir = Path(requested_output_dir)
        if not output_dir.is_absolute():
            output_dir = PROJECT_ROOT / output_dir
        try:
            output_dir.mkdir(parents=True, exist_ok=True)
            probe = output_dir / ".write_probe"
            probe.write_text("ok", encoding="utf-8")
            probe.unlink(missing_ok=True)
            return output_dir
        except OSError:
            if BACKEND_EXPORTS_ROOT.exists():
                fallback = BACKEND_EXPORTS_ROOT / slugify(client_path.name)
                fallback.mkdir(parents=True, exist_ok=True)
                return fallback
            return PROJECT_ROOT

    preferred = client_path / "05_ENTREGAS" / "strategic_board"
    try:
        preferred.mkdir(parents=True, exist_ok=True)
        probe = preferred / ".write_probe"
        probe.write_text("ok", encoding="utf-8")
        probe.unlink(missing_ok=True)
        return preferred
    except OSError:
        for fallback_root in (EXPORTS_ROOT, BACKEND_EXPORTS_ROOT):
            fallback = fallback_root / slugify(client_path.name)
            try:
                fallback.mkdir(parents=True, exist_ok=True)
                return fallback
            except OSError:
                continue
        return PROJECT_ROOT


async def render_premium_board_playwright(client: str, output_dir: str | None = None, html_only: bool = False) -> dict[str, Path | None]:
    client_path = resolve_client_path(client)
    brand_data = build_brand_data(client_path)
    target_dir = resolve_output_dir(client_path, output_dir)
    slug = slugify(brand_data["metadata"]["client_name"])

    template = Template(html_template_string)
    rendered_html = template.render(brand_data)

    html_path = target_dir / f"{slug}_strategic_brand_board.html"
    pdf_path = target_dir / f"{slug}_strategic_brand_board.pdf"
    html_path.write_text(rendered_html, encoding="utf-8")

    print(f"[Brand Experience OS] Cliente: {brand_data['metadata']['client_name']}")
    print(f"[Brand Experience OS] Fuentes cargadas: {brand_data['metadata']['source_count']}")
    print(f"[Brand Experience OS] HTML generado: {html_path}")

    if html_only:
        return {"html": html_path, "pdf": None}

    if async_playwright is None:
        print("[Brand Experience OS] Playwright no esta instalado; se genero solo HTML.")
        return {"html": html_path, "pdf": None}

    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        page = await browser.new_page(viewport={"width": 1600, "height": 1000})
        await page.goto(html_path.as_uri(), wait_until="networkidle")
        await page.pdf(path=str(pdf_path), format="A4", landscape=True, print_background=True)
        await browser.close()

    print(f"[Brand Experience OS] PDF generado: {pdf_path}")
    return {"html": html_path, "pdf": pdf_path}


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Genera una lamina estrategica desde la carpeta de cualquier cliente.")
    parser.add_argument("client_positional", nargs="?", help="Nombre del cliente o ruta de carpeta.")
    parser.add_argument("--client", dest="client", help="Nombre del cliente dentro de CLIENTES_ACTIVOS.")
    parser.add_argument("--output-dir", dest="output_dir", help="Directorio de salida opcional.")
    parser.add_argument("--html-only", action="store_true", help="Genera solo HTML, sin compilar PDF con Playwright.")
    return parser.parse_args()


if __name__ == "__main__":
    args = parse_args()
    selected_client = args.client or args.client_positional
    if not selected_client:
        available_clients = ", ".join(sorted(p.name for p in CLIENTS_ROOT.iterdir() if p.is_dir()))
        raise SystemExit(f"Indica un cliente con --client. Disponibles: {available_clients}")

    asyncio.run(render_premium_board_playwright(selected_client, args.output_dir, args.html_only))
