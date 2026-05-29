import json
import re
from datetime import datetime
from pathlib import Path

from client_manager import _client_relative_path, _resolve_existing_client_path
from services.ai_client import chat_completion


CAMPAIGN_FOLDER = "05_ENTREGAS/cinematic_campaigns"
SCENE_SECONDS = 8
MIN_SCENES = 1
MAX_SCENES = 12
MAX_BRIEF_SOURCE_CHARS = 20_000
NO_RECOMMENDED_BRIEF_MESSAGE = "No se encontró campaña recomendada. Completa los campos manualmente."


REQUIRED_VEO_RULES = [
    "Cinematic 9:16 vertical shot",
    "Ultra-realistic",
    "Premium cinematic lighting",
    "No readable text",
    "No words",
    "No logos",
    "No UI labels",
    "No generic corporate stock footage",
    "Elegant visual restraint",
    "Maintain visual coherence between scenes",
]


RECOMMENDED_BRIEF_FIELDS = {
    "brand": "",
    "video_objective": "",
    "central_message": "",
    "main_emotion": "",
    "audience": "",
    "visual_aesthetic": "",
    "duration": 60,
    "platform": "Instagram Reels 9:16",
    "final_cta": "",
}


RECOMMENDED_BRIEF_FALLBACKS = [
    "05_ENTREGAS/campaigns/STRATEGIC_CAMPAIGN.md",
    "05_ENTREGAS/campaigns/campaign_brief.md",
    "identity_cliente.md",
    "brand_analysis.md",
]


def _clean(value):
    return str(value or "").strip()


def _duration_seconds(value):
    text = _clean(value)

    if not text:
        return 32

    match = re.search(r"\d+", text)

    if not match:
        return 32

    seconds = int(match.group(0))
    return min(max(seconds, SCENE_SECONDS), SCENE_SECONDS * MAX_SCENES)


def _scene_count(duration):
    return min(max(round(duration / SCENE_SECONDS), MIN_SCENES), MAX_SCENES)


def _safe_campaign_dir(client_path):
    target = client_path / CAMPAIGN_FOLDER
    target.mkdir(parents=True, exist_ok=True)
    resolved_client = client_path.resolve()
    resolved_target = target.resolve()

    if resolved_target != resolved_client and resolved_client not in resolved_target.parents:
        raise ValueError("Invalid cinematic campaign path.")

    return target


def _is_inside_client(client_path, path):
    resolved_client = client_path.resolve()
    resolved_path = path.resolve()
    return resolved_path == resolved_client or resolved_client in resolved_path.parents


def _candidate_brief_paths(client_path, relative_or_name):
    candidate = Path(relative_or_name)

    if len(candidate.parts) > 1:
        exact_path = client_path / candidate
        return [exact_path] if exact_path.is_file() and _is_inside_client(client_path, exact_path) else []

    matches = []

    for path in sorted(client_path.rglob(candidate.name), key=lambda item: item.stat().st_mtime, reverse=True):
        if path.is_file() and _is_inside_client(client_path, path):
            matches.append(path)

    return matches


def _read_brief_source(path):
    try:
        text = path.read_text(encoding="utf-8").strip()
    except (OSError, UnicodeDecodeError):
        return ""

    return text[:MAX_BRIEF_SOURCE_CHARS]


def _first_matching_line(text, patterns):
    for pattern in patterns:
        match = re.search(pattern, text, re.IGNORECASE | re.MULTILINE)

        if match:
            return _clean(match.group(1).strip(" -*:"))

    return ""


def _extract_markdown_section(text, headings):
    escaped = "|".join(re.escape(heading) for heading in headings)
    pattern = rf"^#+\s*(?:{escaped})\s*$\n(?P<body>.*?)(?=\n#+\s+|\Z)"
    match = re.search(pattern, text, re.IGNORECASE | re.MULTILINE | re.DOTALL)

    if not match:
        return ""

    body = re.sub(r"\n{3,}", "\n\n", match.group("body")).strip()
    body = re.sub(r"^\s*[-*]\s*", "", body, flags=re.MULTILINE)
    return _clean(body.splitlines()[0] if len(body) > 600 else body)


def _field_from_source(text, field):
    patterns_by_field = {
        "video_objective": [
            r"^\s*[-*]?\s*(?:Campaign Objective|Objetivo(?: del video| de campa(?:ñ|n)a)?|Objetivo principal)\s*:\s*(.+)$",
        ],
        "central_message": [
            r"^\s*[-*]?\s*(?:Core Message|Mensaje central|Mensaje principal|Headline|Campaign Role)\s*:\s*(.+)$",
        ],
        "main_emotion": [
            r"^\s*[-*]?\s*(?:Emoci(?:ó|o)n principal|Emocion|Tono emocional|Main emotion)\s*:\s*(.+)$",
        ],
        "audience": [
            r"^\s*[-*]?\s*(?:P[uú]blico|Audiencia|Audience|Target)\s*:\s*(.+)$",
        ],
        "visual_aesthetic": [
            r"^\s*[-*]?\s*(?:Est[eé]tica visual|Visual aesthetic|Universo visual|Direcci(?:ó|o)n visual)\s*:\s*(.+)$",
        ],
        "final_cta": [
            r"^\s*[-*]?\s*(?:CTA final|CTA|Call to action|Next Decision|Pr[oó]xima acci(?:ó|o)n)\s*:\s*(.+)$",
        ],
    }
    section_headings = {
        "video_objective": ["Campaign Objective", "Objetivo", "Objetivo del video", "Objetivo de campana"],
        "central_message": ["Core Message", "Mensaje central", "Campaign Role", "Headline"],
        "main_emotion": ["Emocion principal", "Tono emocional", "Pilares emocionales"],
        "audience": ["Publico", "Audiencia", "Público objetivo", "Target"],
        "visual_aesthetic": ["Estetica visual", "Universo visual", "Direccion visual", "Visual Universe"],
        "final_cta": ["CTA final", "Next Decision", "Proxima accion"],
    }

    return _first_matching_line(text, patterns_by_field.get(field, [])) or _extract_markdown_section(
        text,
        section_headings.get(field, []),
    )


def _derive_brief_from_text(client_name, text):
    brief = dict(RECOMMENDED_BRIEF_FIELDS)
    brief["brand"] = client_name
    brief["video_objective"] = _field_from_source(text, "video_objective")
    brief["central_message"] = _field_from_source(text, "central_message")
    brief["main_emotion"] = _field_from_source(text, "main_emotion")
    brief["audience"] = _field_from_source(text, "audience")
    brief["visual_aesthetic"] = _field_from_source(text, "visual_aesthetic")
    brief["final_cta"] = _field_from_source(text, "final_cta")

    if not brief["video_objective"]:
        brief["video_objective"] = "Convertir la recomendacion estrategica en una pieza cinematografica vertical."

    if not brief["central_message"]:
        first_paragraph = next(
            (paragraph.strip() for paragraph in re.split(r"\n\s*\n", text) if len(paragraph.strip()) > 40),
            "",
        )
        brief["central_message"] = re.sub(r"^#+\s*", "", first_paragraph).strip()[:360]

    if not brief["main_emotion"]:
        brief["main_emotion"] = "deseo, confianza y claridad"

    if not brief["audience"]:
        brief["audience"] = "publico ideal de la marca"

    if not brief["visual_aesthetic"]:
        brief["visual_aesthetic"] = "premium cinematic realism, elegant visual restraint, coherent brand atmosphere"

    if not brief["final_cta"]:
        brief["final_cta"] = "Dar el proximo paso"

    return brief


def get_recommended_cinematic_brief(client_name):
    resolved_client_name, client_path = _resolve_existing_client_path(client_name)

    if not client_path:
        return None

    for fallback in RECOMMENDED_BRIEF_FALLBACKS:
        for path in _candidate_brief_paths(client_path, fallback):
            text = _read_brief_source(path)

            if len(text) < 40:
                continue

            return {
                **_derive_brief_from_text(resolved_client_name, text),
                "message": "Brief recomendado cargado desde el analisis. Puedes editarlo antes de generar prompts.",
                "source": _client_relative_path(client_path, path),
                "found": True,
            }

    return {
        **dict(RECOMMENDED_BRIEF_FIELDS),
        "message": NO_RECOMMENDED_BRIEF_MESSAGE,
        "source": None,
        "found": False,
    }


def _input_payload(data):
    duration = _duration_seconds(data.get("duration"))
    return {
        "brand": _clean(data.get("brand")),
        "video_objective": _clean(data.get("video_objective")),
        "central_message": _clean(data.get("central_message")),
        "main_emotion": _clean(data.get("main_emotion")),
        "audience": _clean(data.get("audience")),
        "visual_aesthetic": _clean(data.get("visual_aesthetic")),
        "duration": duration,
        "platform": _clean(data.get("platform")),
        "final_cta": _clean(data.get("final_cta")),
        "scene_count": _scene_count(duration),
    }


def _fallback_scene(index, total, payload):
    brand = payload["brand"] or "la marca"
    aesthetic = payload["visual_aesthetic"] or "premium cinematic realism"
    emotion = payload["main_emotion"] or "confianza aspiracional"
    audience = payload["audience"] or "audiencia ideal"
    message = payload["central_message"] or "una transformacion clara y memorable"

    arc = [
        ("Atraccion", "presentar el universo visual y despertar curiosidad"),
        ("Tension", "mostrar la necesidad emocional o aspiracional del publico"),
        ("Revelacion", "revelar la experiencia, solucion o nueva percepcion"),
        ("Deseo", "cerrar con una sensacion de avance y decision"),
    ]
    label, role = arc[min(index - 1, len(arc) - 1)] if total <= 4 else arc[min(round((index - 1) / max(total - 1, 1) * 3), 3)]
    prompt = (
        f"Cinematic 9:16 vertical shot, ultra-realistic {aesthetic}, premium cinematic lighting, "
        f"scene {index} of {total} for {brand}. Show {role} for {audience}, expressed through "
        f"human gestures, atmosphere, texture, movement and environment. The emotional tone is {emotion}. "
        f"Convey the central message visually: {message}. Smooth camera movement, natural depth of field, "
        "elegant visual restraint, coherent color palette with the previous and next scenes. "
        "No readable text, no words, no logos, no UI labels, no generic corporate stock footage."
    )

    return {
        "number": index,
        "duration_seconds": SCENE_SECONDS,
        "title": f"Escena {index} - {label}",
        "narrative_role": role,
        "visual_direction": f"{aesthetic}. Ritmo calmo, premium y emocionalmente claro.",
        "veo_prompt": prompt,
        "edit_text": f"{payload['final_cta'] or 'Descubri la experiencia'}" if index == total else "",
    }


def _fallback_campaign(payload):
    total = payload["scene_count"]
    scenes = [_fallback_scene(index, total, payload) for index in range(1, total + 1)]
    brand = payload["brand"] or "la marca"
    objective = payload["video_objective"] or "crear una pieza cinematografica que convierta percepcion en deseo"
    message = payload["central_message"] or "una marca con direccion, presencia y valor"

    return {
        "concept": f"{brand} se presenta como una experiencia visual premium: {message}.",
        "narrative_structure": [
            "Gancho visual: abrir con una imagen sensorial que ubique el universo de marca.",
            "Conexion emocional: mostrar el deseo, tension o aspiracion del publico.",
            "Revelacion: transformar la promesa en una experiencia visible.",
            "Cierre: dejar una sensacion clara y una accion posterior para edicion.",
        ],
        "campaign_objective": objective,
        "scenes": scenes,
        "creative_direction_note": (
            "Mantener una direccion cinematografica vertical, realista y elegante. "
            "La pieza debe sentirse premium sin depender de texto dentro del video. "
            "Los textos, CTA y claims se agregan luego en CapCut o Premiere."
        ),
        "veo_rules": REQUIRED_VEO_RULES,
    }


def _strip_code_fence(text):
    clean = _clean(text)

    if clean.startswith("```"):
        clean = re.sub(r"^```(?:json)?", "", clean, flags=re.IGNORECASE).strip()
        clean = re.sub(r"```$", "", clean).strip()

    return clean


def _extract_json(text):
    clean = _strip_code_fence(text)

    try:
        return json.loads(clean)
    except json.JSONDecodeError:
        pass

    start = clean.find("{")
    end = clean.rfind("}")

    if start >= 0 and end > start:
        return json.loads(clean[start : end + 1])

    raise ValueError("AI response did not include valid JSON.")


def _normalize_scene(scene, index, total, payload):
    fallback = _fallback_scene(index, total, payload)
    scene = scene if isinstance(scene, dict) else {}
    prompt = _clean(scene.get("veo_prompt") or scene.get("prompt"))

    if not prompt:
        prompt = fallback["veo_prompt"]

    mandatory = [
        "Cinematic 9:16 vertical shot",
        "ultra-realistic",
        "premium cinematic lighting",
        "No readable text",
        "no words",
        "no logos",
        "no UI labels",
        "No generic corporate stock footage",
        "elegant visual restraint",
    ]

    for rule in mandatory:
        if rule.casefold() not in prompt.casefold():
            prompt = f"{prompt.rstrip()}. {rule}."

    return {
        "number": index,
        "duration_seconds": SCENE_SECONDS,
        "title": _clean(scene.get("title")) or fallback["title"],
        "narrative_role": _clean(scene.get("narrative_role")) or fallback["narrative_role"],
        "visual_direction": _clean(scene.get("visual_direction")) or fallback["visual_direction"],
        "veo_prompt": prompt,
        "edit_text": _clean(scene.get("edit_text")) or fallback["edit_text"],
    }


def _normalize_campaign(raw, payload):
    fallback = _fallback_campaign(payload)
    raw = raw if isinstance(raw, dict) else {}
    total = payload["scene_count"]
    raw_scenes = raw.get("scenes") if isinstance(raw.get("scenes"), list) else []
    scenes = []

    for index in range(1, total + 1):
        scenes.append(_normalize_scene(raw_scenes[index - 1] if index <= len(raw_scenes) else {}, index, total, payload))

    structure = raw.get("narrative_structure")

    if isinstance(structure, str):
        structure = [line.strip("- ").strip() for line in structure.splitlines() if line.strip()]

    if not isinstance(structure, list) or not structure:
        structure = fallback["narrative_structure"]

    return {
        "concept": _clean(raw.get("concept")) or fallback["concept"],
        "campaign_objective": _clean(raw.get("campaign_objective")) or fallback["campaign_objective"],
        "narrative_structure": [_clean(item) for item in structure if _clean(item)],
        "scenes": scenes,
        "creative_direction_note": _clean(raw.get("creative_direction_note")) or fallback["creative_direction_note"],
        "veo_rules": REQUIRED_VEO_RULES,
    }


def _system_prompt():
    return """Sos el Cinematic Campaign Builder de Brand Experience OS.

Tu unica tarea es transformar una idea simple en una campana cinematografica optimizada para Veo.
No generes videos. No llames APIs de video. No propongas logos ni texto dentro del video.

Reglas obligatorias para todos los prompts:
- Cinematic 9:16 vertical shot
- Ultra-realistic
- Premium cinematic lighting
- No readable text
- No words
- No logos
- No UI labels
- No generic corporate stock footage
- Elegant visual restraint
- Mantener coherencia visual entre escenas

Responde solamente JSON valido, sin markdown.
"""


def _user_prompt(payload):
    return f"""Genera una campana cinematografica para Veo con este input:

{json.dumps(payload, ensure_ascii=False, indent=2)}

Salida JSON obligatoria:
{{
  "concept": "concepto de campana",
  "campaign_objective": "objetivo interpretado",
  "narrative_structure": ["paso narrativo 1", "paso narrativo 2", "paso narrativo 3"],
  "scenes": [
    {{
      "number": 1,
      "duration_seconds": 8,
      "title": "titulo breve",
      "narrative_role": "rol de la escena",
      "visual_direction": "direccion visual",
      "veo_prompt": "prompt profesional Veo",
      "edit_text": "texto sugerido para agregar luego en CapCut/Premiere"
    }}
  ],
  "creative_direction_note": "nota final de direccion creativa"
}}

Debe haber exactamente {payload['scene_count']} escenas de 8 segundos.
Los prompts deben ser visuales, cinematograficos y especificos.
No incluyas texto visible, palabras, logos, carteles, UI labels ni placas dentro del video.
"""


def _generate_with_ai(payload):
    result = chat_completion(
        [
            {"role": "system", "content": _system_prompt()},
            {"role": "user", "content": _user_prompt(payload)},
        ]
    )
    parsed = _extract_json(result["content"])
    campaign = _normalize_campaign(parsed, payload)
    return campaign, {
        "provider": result.get("provider"),
        "fallback_used": result.get("fallback_used", False),
        "error": result.get("error"),
    }


def _render_markdown(client_name, payload, campaign, metadata):
    lines = [
        f"# Cinematic Campaign Builder - {client_name}",
        "",
        f"- Generated at: {metadata['generated_at']}",
        "- Status: draft",
        "- Visibility: internal",
        "- Output type: Veo prompts only",
        f"- Provider: {metadata.get('provider') or 'fallback'}",
        f"- AI fallback used: {metadata.get('fallback_used')}",
        "",
        "## Input",
        "",
        f"- Marca: {payload['brand'] or client_name}",
        f"- Objetivo del video: {payload['video_objective'] or 'No informado'}",
        f"- Mensaje central: {payload['central_message'] or 'No informado'}",
        f"- Emocion principal: {payload['main_emotion'] or 'No informada'}",
        f"- Publico: {payload['audience'] or 'No informado'}",
        f"- Estetica visual: {payload['visual_aesthetic'] or 'No informada'}",
        f"- Duracion: {payload['duration']} segundos",
        f"- Plataforma: {payload['platform'] or 'No informada'}",
        f"- CTA final: {payload['final_cta'] or 'No informado'}",
        "",
        "## Concepto de campana",
        "",
        campaign["concept"],
        "",
        "## Estructura narrativa",
        "",
    ]

    for item in campaign["narrative_structure"]:
        lines.append(f"- {item}")

    lines.extend(["", "## Escenas optimizadas para Veo", ""])

    for scene in campaign["scenes"]:
        lines.extend(
            [
                f"### Escena {scene['number']} - {scene['title']}",
                "",
                f"- Duracion: {scene['duration_seconds']} segundos",
                f"- Rol narrativo: {scene['narrative_role']}",
                f"- Direccion visual: {scene['visual_direction']}",
                "",
                "#### Prompt Veo",
                "",
                scene["veo_prompt"],
                "",
                "#### Texto sugerido para edicion",
                "",
                scene["edit_text"] or "Sin texto en esta escena. Mantener respiracion visual.",
                "",
            ]
        )

    lines.extend(
        [
            "## Nota de direccion creativa",
            "",
            campaign["creative_direction_note"],
            "",
            "## Reglas Veo aplicadas",
            "",
        ]
    )

    for rule in REQUIRED_VEO_RULES:
        lines.append(f"- {rule}")

    return "\n".join(lines).rstrip() + "\n"


def generate_cinematic_campaign(client_name, request_data):
    resolved_client_name, client_path = _resolve_existing_client_path(client_name)

    if not client_path:
        return None

    payload = _input_payload(
        {
            **(request_data or {}),
            "brand": _clean((request_data or {}).get("brand")) or resolved_client_name,
        }
    )
    generated_at = datetime.now().isoformat(timespec="seconds")
    provider_info = {
        "provider": "fallback",
        "fallback_used": True,
        "error": None,
    }

    try:
        campaign, provider_info = _generate_with_ai(payload)
    except Exception as error:
        campaign = _fallback_campaign(payload)
        provider_info = {
            "provider": "fallback",
            "fallback_used": True,
            "error": str(error),
        }

    metadata = {
        "generated_at": generated_at,
        **provider_info,
    }
    target_dir = _safe_campaign_dir(client_path)
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    latest_path = target_dir / "campaign_latest.md"
    history_path = target_dir / f"campaign_{timestamp}.md"
    markdown = _render_markdown(resolved_client_name, payload, campaign, metadata)

    latest_path.write_text(markdown, encoding="utf-8")
    history_path.write_text(markdown, encoding="utf-8")

    return {
        "client": resolved_client_name,
        "status": "created",
        "files": [
            _client_relative_path(client_path, latest_path),
            _client_relative_path(client_path, history_path),
        ],
        "campaign": campaign,
        "input": payload,
        "provider": provider_info,
    }
