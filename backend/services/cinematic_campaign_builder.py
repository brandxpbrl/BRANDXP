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
DEFAULT_SCENE_COUNT = 8
DEFAULT_DURATION = SCENE_SECONDS * DEFAULT_SCENE_COUNT
MAX_BRIEF_SOURCE_CHARS = 20_000
MAX_CONTEXT_SOURCE_CHARS = 12_000
MAX_CONTEXT_CHARS = 36_000
FINAL_PROMPT_PREFIX = "Cinematic 9:16 vertical shot, ultra-realistic."
NO_RECOMMENDED_BRIEF_MESSAGE = "No se encontró campaña recomendada. Completa los campos manualmente."


REQUIRED_VEO_RULES = [
    "Cinematic 9:16 vertical shot",
    "Ultra-realistic",
    "Premium cinematic lighting",
    "No readable text",
    "No words",
    "No logos",
    "No brand names",
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
    "duration": DEFAULT_DURATION,
    "platform": "Instagram Reels 9:16",
    "final_cta": "",
}


CAMPAIGN_INTELLIGENCE_FIELDS = {
    "brand_objective": "",
    "brand_type": "",
    "aesthetic_identity": "",
    "core_concept": "",
    "audience": "",
    "main_emotion": "",
    "differentiator": "",
    "recommended_visual_direction": "",
    "campaign_message": "",
}


RECOMMENDED_BRIEF_FALLBACKS = [
    "05_ENTREGAS/campaigns/STRATEGIC_CAMPAIGN.md",
    "05_ENTREGAS/campaigns/campaign_brief.md",
    "identity_cliente.md",
    "brand_analysis.md",
]


CONTEXT_SOURCE_FILES = [
    "identity_cliente.md",
    "brand_analysis.md",
    "entity_bible.md",
    "visual_universe.md",
    "05_ENTREGAS/campaigns/STRATEGIC_CAMPAIGN.md",
    "05_ENTREGAS/campaigns/campaign_brief.md",
]


NARRATIVE_MAP = [
    {
        "scene_number": 1,
        "scene_title": "HOOK / TENSION",
        "purpose": "Present the main problem, desire or tension.",
    },
    {
        "scene_number": 2,
        "scene_title": "PROBLEM",
        "purpose": "Explain what is broken, missing or limiting growth.",
    },
    {
        "scene_number": 3,
        "scene_title": "DIAGNOSIS",
        "purpose": "Reveal intelligence, understanding and strategic insight.",
    },
    {
        "scene_number": 4,
        "scene_title": "INVISIBLE TRUTH",
        "purpose": "Reveal the hidden insight behind the campaign.",
    },
    {
        "scene_number": 5,
        "scene_title": "SYSTEM / SOLUTION",
        "purpose": "Present the method, framework, experience or solution.",
    },
    {
        "scene_number": 6,
        "scene_title": "TRANSFORMATION",
        "purpose": "Show perceptual change and evolution.",
    },
    {
        "scene_number": 7,
        "scene_title": "PRESENCE / RESULT",
        "purpose": "Show authority, trust, aspiration or recognition.",
    },
    {
        "scene_number": 8,
        "scene_title": "SIGNATURE / CTA",
        "purpose": "Create a memorable ending and CTA.",
    },
]


def _clean(value):
    return str(value or "").strip()


def _duration_seconds(value):
    text = _clean(value)

    if not text:
        return DEFAULT_DURATION

    match = re.search(r"\d+", text)

    if not match:
        return DEFAULT_DURATION

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
        if exact_path.is_file() and _is_inside_client(client_path, exact_path):
            return [exact_path]
        return _candidate_name_matches(client_path, candidate.name)

    return _candidate_name_matches(client_path, candidate.name)


def _candidate_name_matches(client_path, filename):
    matches = []
    name_path = Path(filename)
    stem = name_path.stem
    suffix = name_path.suffix
    patterns = [filename]

    if suffix:
        patterns.append(f"{stem}_*{suffix}")

    seen = set()

    for pattern in patterns:
        for path in sorted(client_path.rglob(pattern), key=lambda item: item.stat().st_mtime, reverse=True):
            if path in seen:
                continue
            if path.is_file() and _is_inside_client(client_path, path):
                matches.append(path)
                seen.add(path)

    return matches


def _read_brief_source(path, limit=MAX_BRIEF_SOURCE_CHARS):
    try:
        text = path.read_text(encoding="utf-8").strip()
    except (OSError, UnicodeDecodeError):
        return ""

    return text[:limit]


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
            r"^\s*[-*]?\s*(?:Brand Objective|Campaign Objective|Objetivo(?: del video| de campa(?:ñ|n)a)?|Objetivo principal)\s*:\s*(.+)$",
        ],
        "central_message": [
            r"^\s*[-*]?\s*(?:Core Message|Mensaje central|Mensaje principal|Campaign Message|Headline|Campaign Role)\s*:\s*(.+)$",
        ],
        "main_emotion": [
            r"^\s*[-*]?\s*(?:Emoci(?:ó|o)n principal|Emocion|Tono emocional|Main emotion)\s*:\s*(.+)$",
        ],
        "audience": [
            r"^\s*[-*]?\s*(?:P[uú]blico|Audiencia|Audience|Target|Publico objetivo)\s*:\s*(.+)$",
        ],
        "visual_aesthetic": [
            r"^\s*[-*]?\s*(?:Aesthetic Identity|Est[eé]tica visual|Visual aesthetic|Universo visual|Direcci(?:ó|o)n visual|Recommended Visual Direction)\s*:\s*(.+)$",
        ],
        "final_cta": [
            r"^\s*[-*]?\s*(?:CTA final|CTA|Call to action|Next Decision|Pr[oó]xima acci(?:ó|o)n)\s*:\s*(.+)$",
        ],
        "brand_type": [
            r"^\s*[-*]?\s*(?:Brand Type|Tipo de marca|Categoria|Categor[ií]a)\s*:\s*(.+)$",
        ],
        "differentiator": [
            r"^\s*[-*]?\s*(?:Differentiator|Diferenciador|Diferenciaci(?:ó|o)n|Unique Value|Valor diferencial)\s*:\s*(.+)$",
        ],
    }
    section_headings = {
        "video_objective": ["Brand Objective", "Campaign Objective", "Objetivo", "Objetivo del video", "Objetivo de campana"],
        "central_message": ["Core Message", "Mensaje central", "Campaign Message", "Campaign Role", "Headline"],
        "main_emotion": ["Emocion principal", "Tono emocional", "Pilares emocionales"],
        "audience": ["Publico", "Audiencia", "Público objetivo", "Target"],
        "visual_aesthetic": ["Aesthetic Identity", "Estetica visual", "Universo visual", "Direccion visual", "Visual Universe"],
        "final_cta": ["CTA final", "Next Decision", "Proxima accion"],
        "brand_type": ["Brand Type", "Tipo de marca", "Categoria"],
        "differentiator": ["Differentiator", "Diferenciador", "Diferenciacion", "Valor diferencial"],
    }

    return _first_matching_line(text, patterns_by_field.get(field, [])) or _extract_markdown_section(
        text,
        section_headings.get(field, []),
    )


def _first_useful_paragraph(text):
    return next(
        (
            re.sub(r"^#+\s*", "", paragraph.strip()).strip()
            for paragraph in re.split(r"\n\s*\n", text)
            if len(paragraph.strip()) > 40
        ),
        "",
    )


def _campaign_intelligence_from_text(client_name, text):
    objective = _field_from_source(text, "video_objective")
    message = _field_from_source(text, "central_message")
    emotion = _field_from_source(text, "main_emotion")
    audience = _field_from_source(text, "audience")
    aesthetic = _field_from_source(text, "visual_aesthetic")
    brand_type = _field_from_source(text, "brand_type")
    differentiator = _field_from_source(text, "differentiator")
    first_paragraph = _first_useful_paragraph(text)

    return {
        "brand_objective": objective or "Convertir la estrategia de marca en una campaña vertical clara y accionable.",
        "brand_type": brand_type or "marca con sistema de experiencia y comunicación visual",
        "aesthetic_identity": aesthetic or "premium cinematic realism, elegant visual restraint, coherent brand atmosphere",
        "core_concept": message or first_paragraph[:280] or f"{client_name} necesita transformar su dirección estratégica en una presencia audiovisual memorable.",
        "audience": audience or "publico ideal de la marca",
        "main_emotion": emotion or "deseo, confianza y claridad",
        "differentiator": differentiator or "una lectura estratégica que convierte percepción, narrativa y estética en una experiencia reconocible",
        "recommended_visual_direction": aesthetic or "vertical cinematic realism with controlled movement, premium light and emotionally precise framing",
        "campaign_message": message or first_paragraph[:280] or "Una marca con dirección, presencia y valor perceptual.",
    }


def _merge_intelligence(primary, secondary):
    merged = dict(CAMPAIGN_INTELLIGENCE_FIELDS)
    merged.update(primary or {})

    for key, value in (secondary or {}).items():
        if not _clean(merged.get(key)) and _clean(value):
            merged[key] = _clean(value)

    return merged


def _derive_brief_from_text(client_name, text, context_text=""):
    combined_text = "\n\n".join(item for item in [text, context_text] if item)
    brief = dict(RECOMMENDED_BRIEF_FIELDS)
    brief["brand"] = client_name
    brief["video_objective"] = _field_from_source(text, "video_objective") or _field_from_source(combined_text, "video_objective")
    brief["central_message"] = _field_from_source(text, "central_message") or _field_from_source(combined_text, "central_message")
    brief["main_emotion"] = _field_from_source(text, "main_emotion") or _field_from_source(combined_text, "main_emotion")
    brief["audience"] = _field_from_source(text, "audience") or _field_from_source(combined_text, "audience")
    brief["visual_aesthetic"] = _field_from_source(text, "visual_aesthetic") or _field_from_source(combined_text, "visual_aesthetic")
    brief["final_cta"] = _field_from_source(text, "final_cta") or _field_from_source(combined_text, "final_cta")

    if not brief["video_objective"]:
        brief["video_objective"] = "Convertir la recomendacion estrategica en una pieza cinematografica vertical."

    if not brief["central_message"]:
        brief["central_message"] = _first_useful_paragraph(text)[:360]

    if not brief["main_emotion"]:
        brief["main_emotion"] = "deseo, confianza y claridad"

    if not brief["audience"]:
        brief["audience"] = "publico ideal de la marca"

    if not brief["visual_aesthetic"]:
        brief["visual_aesthetic"] = "premium cinematic realism, elegant visual restraint, coherent brand atmosphere"

    if not brief["final_cta"]:
        brief["final_cta"] = "Dar el proximo paso"

    primary_intelligence = _campaign_intelligence_from_text(client_name, text)
    context_intelligence = _campaign_intelligence_from_text(client_name, context_text) if context_text else {}
    brief["campaign_intelligence_summary"] = _merge_intelligence(primary_intelligence, context_intelligence)

    return brief


def _load_cinematic_context(client_path):
    sources = []
    seen = set()

    for source_name in CONTEXT_SOURCE_FILES:
        for path in _candidate_brief_paths(client_path, source_name):
            if path in seen:
                continue

            text = _read_brief_source(path, MAX_CONTEXT_SOURCE_CHARS)

            if len(text) < 40:
                continue

            sources.append(
                {
                    "source": _client_relative_path(client_path, path),
                    "text": text,
                }
            )
            seen.add(path)
            break

    combined = "\n\n".join(f"## Source: {item['source']}\n{item['text']}" for item in sources)

    return {
        "sources": sources,
        "combined_text": combined[:MAX_CONTEXT_CHARS],
    }


def get_recommended_cinematic_brief(client_name):
    resolved_client_name, client_path = _resolve_existing_client_path(client_name)

    if not client_path:
        return None

    context = _load_cinematic_context(client_path)

    for fallback in RECOMMENDED_BRIEF_FALLBACKS:
        for path in _candidate_brief_paths(client_path, fallback):
            text = _read_brief_source(path)

            if len(text) < 40:
                continue

            return {
                **_derive_brief_from_text(resolved_client_name, text, context["combined_text"]),
                "message": "Brief recomendado cargado desde el analisis. Puedes editarlo antes de generar prompts.",
                "source": _client_relative_path(client_path, path),
                "context_sources": [item["source"] for item in context["sources"]],
                "found": True,
            }

    return {
        **dict(RECOMMENDED_BRIEF_FIELDS),
        "campaign_intelligence_summary": dict(CAMPAIGN_INTELLIGENCE_FIELDS),
        "message": NO_RECOMMENDED_BRIEF_MESSAGE,
        "source": None,
        "context_sources": [item["source"] for item in context["sources"]],
        "found": False,
    }


def _campaign_summary_from_markdown(text):
    concept = _extract_markdown_section(text, ["Campaign Concept", "Concepto de campana"])
    objective = _extract_markdown_section(text, ["Campaign Intelligence Summary", "Input"])
    generated_at = _first_matching_line(text, [r"^\s*-\s*Generated at\s*:\s*(.+)$"])
    scenes_count = len(re.findall(r"^###\s+(?:Scene|Escena)\s+\d+", text, re.IGNORECASE | re.MULTILINE))

    if not concept:
        concept = _first_useful_paragraph(text)

    return {
        "concept": concept[:420],
        "objective": objective[:420],
        "generated_at": generated_at,
        "scenes_count": scenes_count,
    }


def list_generated_cinematic_campaigns(client_name):
    resolved_client_name, client_path = _resolve_existing_client_path(client_name)

    if not client_path:
        return None

    campaign_dir = client_path / CAMPAIGN_FOLDER
    result = {
        "client": resolved_client_name,
        "base": CAMPAIGN_FOLDER,
        "items": [],
        "latest": None,
    }

    if not campaign_dir.is_dir() or not _is_inside_client(client_path, campaign_dir):
        return result

    latest_path = campaign_dir / "campaign_latest.md"
    latest_text = latest_path.read_text(encoding="utf-8") if latest_path.is_file() else ""

    if latest_path.is_file():
        result["latest"] = _client_relative_path(client_path, latest_path)

    history_files = [
        path
        for path in sorted(campaign_dir.glob("campaign_*.md"), key=lambda item: item.name)
        if path.name != "campaign_latest.md" and path.is_file() and _is_inside_client(client_path, path)
    ]

    for index, path in enumerate(history_files, start=1):
        text = _read_brief_source(path)
        summary = _campaign_summary_from_markdown(text)
        relative_path = _client_relative_path(client_path, path)

        result["items"].append(
            {
                "id": path.stem,
                "label": f"Campaña {index:02d} generada",
                "name": path.name,
                "relative_path": relative_path,
                "is_latest": bool(latest_text and path.read_text(encoding="utf-8") == latest_text),
                "size": path.stat().st_size,
                "modified_at": datetime.fromtimestamp(path.stat().st_mtime).isoformat(timespec="seconds"),
                **summary,
            }
        )

    return result


def _input_payload(data, client_path=None):
    duration = _duration_seconds(data.get("duration"))
    context = _load_cinematic_context(client_path) if client_path else {"sources": [], "combined_text": ""}
    context_text = context["combined_text"]
    form_intelligence = {
        "brand_objective": _clean(data.get("video_objective")),
        "brand_type": _clean(data.get("brand_type")),
        "aesthetic_identity": _clean(data.get("visual_aesthetic")),
        "core_concept": _clean(data.get("central_message")),
        "audience": _clean(data.get("audience")),
        "main_emotion": _clean(data.get("main_emotion")),
        "differentiator": _clean(data.get("differentiator")),
        "recommended_visual_direction": _clean(data.get("visual_aesthetic")),
        "campaign_message": _clean(data.get("central_message")),
    }
    context_intelligence = _campaign_intelligence_from_text(_clean(data.get("brand")) or "la marca", context_text) if context_text else {}
    campaign_intelligence = _merge_intelligence(form_intelligence, context_intelligence)

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
        "campaign_intelligence_summary": campaign_intelligence,
        "context_sources": [item["source"] for item in context["sources"]],
        "context_text": context_text,
    }


def _narrative_template(index):
    if index <= len(NARRATIVE_MAP):
        return NARRATIVE_MAP[index - 1]

    return {
        "scene_number": index,
        "scene_title": f"EXTENSION {index:02d}",
        "purpose": "Extend the same campaign world with a controlled cinematic proof point.",
    }


def _narrative_structure_for_payload(payload):
    total = payload["scene_count"]
    structure = []

    for index in range(1, total + 1):
        item = _narrative_template(index)
        structure.append(
            {
                "scene_number": index,
                "scene_title": item["scene_title"],
                "purpose": item["purpose"],
                "meaning": _scene_meaning(index, payload),
            }
        )

    return structure


def _scene_meaning(index, payload):
    intelligence = payload.get("campaign_intelligence_summary") or {}
    message = intelligence.get("campaign_message") or payload.get("central_message") or "a clear brand transformation"
    objective = intelligence.get("brand_objective") or payload.get("video_objective") or "build perceptual desire"
    differentiator = intelligence.get("differentiator") or "a more precise brand experience"

    meanings = [
        f"Open with the core tension behind the objective: {objective}.",
        f"Show what the audience is missing before the brand becomes clear: {message}.",
        f"Reveal the strategic reading that makes the opportunity visible: {differentiator}.",
        f"Expose the invisible truth that changes how the audience perceives the brand: {message}.",
        f"Present the system, method or experience that resolves the tension: {differentiator}.",
        "Show the audience moving from uncertainty to clarity, desire and trust.",
        "Show authority through presence, atmosphere and proof without explaining it literally.",
        f"Close with a memorable signature feeling and a clear next action: {payload.get('final_cta') or 'take the next step'}.",
    ]

    return meanings[index - 1] if index <= len(meanings) else "Add a controlled proof point that supports the same campaign idea."


def _prompt_safe_text(value, fallback):
    text = _clean(value) or fallback
    return re.sub(r"\s+", " ", text)


def _fallback_audit(scene_title, narrative_purpose, payload):
    aesthetic = _prompt_safe_text(payload.get("visual_aesthetic"), "premium cinematic realism")
    emotion = _prompt_safe_text(payload.get("main_emotion"), "calm desire and trust")

    return {
        "model_interpretation": (
            f"Veo should interpret this as a restrained vertical cinematic moment focused on {scene_title.lower()}, "
            f"with {aesthetic}, human atmosphere, controlled motion and a clear emotional center."
        ),
        "clarity_analysis": (
            "The scene keeps one focal subject, one emotional purpose and one camera behavior. "
            f"The narrative purpose is direct: {narrative_purpose}"
        ),
        "critical_risks": (
            "Avoid generated words, fake logos, interface screens, overproduced corporate imagery, distorted hands, "
            "unstable faces and visual details that conflict with the established identity."
        ),
        "technical_optimization": (
            "Use premium cinematic lighting, a natural 35mm or 50mm lens feel, slow push-in or lateral movement, "
            f"shallow depth of field, atmospheric texture and a color palette aligned with {aesthetic}."
        ),
        "format_validation": (
            "Validated for 9:16 vertical composition, mobile-first framing, centered focal elements, no generated text, "
            "Instagram Reels ready, TikTok ready and YouTube Shorts ready."
        ),
    }


def _enforce_prompt_rules(prompt, payload):
    clean = re.sub(r"\s+", " ", _clean(prompt))

    if not clean:
        clean = (
            "Premium cinematic lighting, slow controlled camera movement, atmospheric depth, natural lens language, "
            "centered mobile-first composition and elegant visual restraint."
        )

    if not clean.casefold().startswith(FINAL_PROMPT_PREFIX.casefold()):
        clean = f"{FINAL_PROMPT_PREFIX} {clean}"

    brand = _clean(payload.get("brand"))
    if brand:
        clean = re.sub(re.escape(brand), "the brand", clean, flags=re.IGNORECASE)

    mandatory = [
        "premium cinematic lighting",
        "slow controlled camera movement",
        "mobile-first 9:16 composition",
        "elegant visual restraint",
        "No readable text",
        "No words",
        "No logos",
        "No brand names",
        "No UI labels",
        "No generic corporate stock footage",
    ]

    for rule in mandatory:
        if rule.casefold() not in clean.casefold():
            clean = f"{clean.rstrip()}. {rule}."

    return clean


def _fallback_scene(index, total, payload):
    template = _narrative_template(index)
    aesthetic = "identity-consistent premium cinematic realism with elegant visual restraint"
    emotion = "calm desire, clarity and trust"
    narrative_purpose = _scene_meaning(index, payload)
    prompt = (
        f"{FINAL_PROMPT_PREFIX} Create scene {index} of {total}: {template['scene_title'].lower()}. "
        f"Visualize the campaign idea through {aesthetic}, premium cinematic lighting, natural human presence, "
        f"subtle environmental texture and {emotion}. Maintain visual consistency with the client identity. "
        "Communicate the strategic idea through atmosphere, behavior, environment and transformation, without literal explanation. "
        "Use a natural 35mm lens feel, slow controlled camera movement, shallow depth of field, "
        "centered mobile-first composition, atmospheric realism and elegant visual restraint."
    )
    edit_text = payload["final_cta"] if index == total and payload.get("final_cta") else _editing_text_for_scene(index, payload)

    return {
        "number": index,
        "scene_number": index,
        "duration_seconds": SCENE_SECONDS,
        "title": f"Scene {index:02d} - {template['scene_title']}",
        "scene_title": template["scene_title"],
        "summary": narrative_purpose,
        "narrative_purpose": narrative_purpose,
        "narrative_role": narrative_purpose,
        "visual_direction": f"{aesthetic}. Slow rhythm, premium atmosphere and emotionally precise framing.",
        "ai_engineer_audit": _fallback_audit(template["scene_title"], narrative_purpose, payload),
        "veo_prompt": _enforce_prompt_rules(prompt, payload),
        "editing_text": edit_text,
        "edit_text": edit_text,
    }


def _editing_text_for_scene(index, payload):
    message = payload.get("central_message") or "Una marca con direccion."
    cta = payload.get("final_cta") or "Dar el proximo paso"
    suggestions = [
        "Algo esta pidiendo una nueva forma de ser visto.",
        "El problema no siempre esta en lo que haces. A veces esta en como se percibe.",
        "La claridad aparece cuando la marca entiende su propio valor.",
        "Detras de toda decision hay una verdad invisible.",
        "Un sistema transforma intuicion en direccion.",
        "Cuando la percepcion cambia, la marca empieza a avanzar.",
        message,
        cta,
    ]
    return suggestions[index - 1] if index <= len(suggestions) else cta


def _fallback_campaign(payload):
    total = payload["scene_count"]
    scenes = [_fallback_scene(index, total, payload) for index in range(1, total + 1)]
    intelligence = payload.get("campaign_intelligence_summary") or {}
    concept = intelligence.get("core_concept") or payload["central_message"] or "una marca con direccion, presencia y valor"
    objective = intelligence.get("brand_objective") or payload["video_objective"] or "crear una pieza cinematografica que convierta percepcion en deseo"

    return {
        "campaign_intelligence_summary": _merge_intelligence(intelligence, CAMPAIGN_INTELLIGENCE_FIELDS),
        "concept": f"La campaña convierte la estrategia en una secuencia cinematografica: {concept}.",
        "campaign_objective": objective,
        "narrative_structure": _narrative_structure_for_payload(payload),
        "scenes": scenes,
        "final_editing_guide": (
            "Agregar los textos sugeridos en CapCut, Premiere o Final Cut. Mantener tipografia limpia, entradas suaves, "
            "pocas palabras por escena y respiracion visual entre cada frase."
        ),
        "director_notes": (
            "La direccion debe sentirse premium, humana y contenida. La pieza no debe explicar la estrategia; debe hacerla visible."
        ),
        "creative_direction_note": (
            "Mantener una direccion cinematografica vertical, realista y elegante. "
            "Los textos, CTA y claims se agregan luego en edicion, nunca dentro de Veo."
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


def _normalize_audit(audit, fallback):
    audit = audit if isinstance(audit, dict) else {}

    return {
        "model_interpretation": _clean(audit.get("model_interpretation")) or fallback["model_interpretation"],
        "clarity_analysis": _clean(audit.get("clarity_analysis")) or fallback["clarity_analysis"],
        "critical_risks": _clean(audit.get("critical_risks")) or fallback["critical_risks"],
        "technical_optimization": _clean(audit.get("technical_optimization")) or fallback["technical_optimization"],
        "format_validation": _clean(audit.get("format_validation")) or fallback["format_validation"],
    }


def _normalize_scene(scene, index, total, payload):
    fallback = _fallback_scene(index, total, payload)
    scene = scene if isinstance(scene, dict) else {}
    prompt = _clean(scene.get("veo_prompt") or scene.get("final_veo_prompt") or scene.get("prompt")) or fallback["veo_prompt"]
    audit = scene.get("ai_engineer_audit") or scene.get("audit") or {}
    edit_text = _clean(scene.get("editing_text") or scene.get("edit_text")) or fallback["editing_text"]
    narrative_purpose = _clean(scene.get("narrative_purpose") or scene.get("narrative_role")) or fallback["narrative_purpose"]
    scene_title = _clean(scene.get("scene_title") or scene.get("title")) or fallback["scene_title"]

    return {
        "number": index,
        "scene_number": index,
        "duration_seconds": SCENE_SECONDS,
        "title": scene_title if scene_title.startswith("Scene") else f"Scene {index:02d} - {scene_title}",
        "scene_title": scene_title.replace(f"Scene {index:02d} - ", ""),
        "summary": _clean(scene.get("summary")) or narrative_purpose,
        "narrative_purpose": narrative_purpose,
        "narrative_role": narrative_purpose,
        "visual_direction": _clean(scene.get("visual_direction")) or fallback["visual_direction"],
        "ai_engineer_audit": _normalize_audit(audit, fallback["ai_engineer_audit"]),
        "veo_prompt": _enforce_prompt_rules(prompt, payload),
        "editing_text": edit_text,
        "edit_text": edit_text,
    }


def _normalize_intelligence(raw, payload):
    raw = raw if isinstance(raw, dict) else {}
    fallback = payload.get("campaign_intelligence_summary") or {}
    merged = dict(CAMPAIGN_INTELLIGENCE_FIELDS)

    for key in CAMPAIGN_INTELLIGENCE_FIELDS:
        merged[key] = _clean(raw.get(key)) or _clean(fallback.get(key)) or CAMPAIGN_INTELLIGENCE_FIELDS[key]

    return merged


def _normalize_structure(structure, payload):
    fallback = _narrative_structure_for_payload(payload)

    if isinstance(structure, str):
        items = [line.strip("- ").strip() for line in structure.splitlines() if line.strip()]
        return [
            {
                "scene_number": index,
                "scene_title": _narrative_template(index)["scene_title"],
                "purpose": _narrative_template(index)["purpose"],
                "meaning": item,
            }
            for index, item in enumerate(items[: payload["scene_count"]], start=1)
        ] or fallback

    if not isinstance(structure, list) or not structure:
        return fallback

    normalized = []

    for index in range(1, payload["scene_count"] + 1):
        template = _narrative_template(index)
        item = structure[index - 1] if index <= len(structure) else {}

        if isinstance(item, str):
            normalized.append(
                {
                    "scene_number": index,
                    "scene_title": template["scene_title"],
                    "purpose": template["purpose"],
                    "meaning": item,
                }
            )
            continue

        item = item if isinstance(item, dict) else {}
        normalized.append(
            {
                "scene_number": index,
                "scene_title": _clean(item.get("scene_title") or item.get("title")) or template["scene_title"],
                "purpose": _clean(item.get("purpose")) or template["purpose"],
                "meaning": _clean(item.get("meaning") or item.get("narrative_meaning")) or _scene_meaning(index, payload),
            }
        )

    return normalized


def _normalize_campaign(raw, payload):
    fallback = _fallback_campaign(payload)
    raw = raw if isinstance(raw, dict) else {}
    total = payload["scene_count"]
    raw_scenes = raw.get("scenes") if isinstance(raw.get("scenes"), list) else []
    scenes = []

    for index in range(1, total + 1):
        scenes.append(_normalize_scene(raw_scenes[index - 1] if index <= len(raw_scenes) else {}, index, total, payload))

    intelligence = _normalize_intelligence(raw.get("campaign_intelligence_summary"), payload)

    return {
        "campaign_intelligence_summary": intelligence,
        "concept": _clean(raw.get("concept") or raw.get("campaign_concept")) or fallback["concept"],
        "campaign_objective": _clean(raw.get("campaign_objective")) or fallback["campaign_objective"],
        "narrative_structure": _normalize_structure(raw.get("narrative_structure"), payload),
        "scenes": scenes,
        "final_editing_guide": _clean(raw.get("final_editing_guide")) or fallback["final_editing_guide"],
        "director_notes": _clean(raw.get("director_notes")) or fallback["director_notes"],
        "creative_direction_note": _clean(raw.get("creative_direction_note")) or fallback["creative_direction_note"],
        "veo_rules": REQUIRED_VEO_RULES,
    }


def _system_prompt():
    return """You are the Cinematic Campaign Builder V2 inside Brand Experience OS.

Your role is not to generate videos. Your role is to interpret brand strategy, design cinematic scene architecture, audit every scene as an AI Video Engineer, and produce final Veo prompts.

Framework outputs are context only. The strategic framework diagnoses. You interpret, audit and optimize for Veo.

Rules:
- Do not call or describe video APIs.
- Generate exactly the requested number of scenes.
- Each scene lasts 8 seconds.
- Use the fixed narrative map supplied by the user.
- Final Veo prompts must be English only.
- Every final Veo prompt must begin exactly with: Cinematic 9:16 vertical shot, ultra-realistic.
- Never ask Veo to generate readable text, words, logos, brand names, UI labels or corporate stock footage.
- Editing text is for CapCut, Premiere or Final Cut only.

Respond only with valid JSON. No markdown.
"""


def _user_prompt(payload):
    ai_payload = {
        key: value
        for key, value in payload.items()
        if key != "context_text"
    }

    return f"""Generate a V2 cinematic campaign for Veo using this input:

{json.dumps(ai_payload, ensure_ascii=False, indent=2)}

Strategic context from Brand Experience framework:
{payload.get("context_text") or "No additional framework context available."}

Fixed narrative map:
{json.dumps(NARRATIVE_MAP, ensure_ascii=False, indent=2)}

Required JSON shape:
{{
  "campaign_intelligence_summary": {{
    "brand_objective": "",
    "brand_type": "",
    "aesthetic_identity": "",
    "core_concept": "",
    "audience": "",
    "main_emotion": "",
    "differentiator": "",
    "recommended_visual_direction": "",
    "campaign_message": ""
  }},
  "concept": "campaign concept",
  "campaign_objective": "interpreted objective",
  "narrative_structure": [
    {{
      "scene_number": 1,
      "scene_title": "HOOK / TENSION",
      "purpose": "Present the main problem, desire or tension.",
      "meaning": "how this beat applies to this client"
    }}
  ],
  "scenes": [
    {{
      "scene_number": 1,
      "title": "Scene 01 - HOOK / TENSION",
      "duration_seconds": 8,
      "summary": "short scene summary",
      "narrative_purpose": "narrative purpose",
      "visual_direction": "visual direction",
      "ai_engineer_audit": {{
        "model_interpretation": "what Veo will likely generate, including visual style, atmosphere, movement, composition and subject",
        "clarity_analysis": "syntax, semantic clarity, subject clarity, camera direction and aesthetic consistency",
        "critical_risks": "hallucinations, text, logos, hands, faces, inconsistent style, generic corporate visuals, screens or UI risks",
        "technical_optimization": "lighting, lens, camera movement, composition, atmosphere, cinematic language and negative constraints",
        "format_validation": "9:16 vertical, mobile-first, centered focal elements, no generated text, Instagram Reels ready, TikTok ready, YouTube Shorts ready"
      }},
      "veo_prompt": "Cinematic 9:16 vertical shot, ultra-realistic. English prompt only.",
      "editing_text": "text to add later in CapCut, Premiere or Final Cut"
    }}
  ],
  "final_editing_guide": "editing guide",
  "director_notes": "director notes"
}}

Generate exactly {payload['scene_count']} scenes.
Do not generate videos.
Do not include client logos or brand names inside the Veo prompt.
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


def _render_intelligence(lines, intelligence):
    for key in CAMPAIGN_INTELLIGENCE_FIELDS:
        label = key.replace("_", " ").title()
        lines.append(f"- {label}: {intelligence.get(key) or 'No informado'}")


def _render_structure(lines, structure):
    for item in structure:
        lines.extend(
            [
                f"- Scene {item['scene_number']:02d} - {item['scene_title']}: {item['purpose']}",
                f"  Meaning: {item['meaning']}",
            ]
        )


def _render_markdown(client_name, payload, campaign, metadata):
    lines = [
        "# Cinematic Campaign Builder",
        "",
        f"- Client: {client_name}",
        f"- Generated at: {metadata['generated_at']}",
        "- Status: draft",
        "- Visibility: internal",
        "- Output type: Veo prompts only",
        f"- Provider: {metadata.get('provider') or 'fallback'}",
        f"- AI fallback used: {metadata.get('fallback_used')}",
        "",
        "## Campaign Intelligence Summary",
        "",
    ]

    _render_intelligence(lines, campaign["campaign_intelligence_summary"])

    lines.extend(
        [
            "",
            "## Campaign Concept",
            "",
            campaign["concept"],
            "",
            "## Narrative Structure",
            "",
        ]
    )

    _render_structure(lines, campaign["narrative_structure"])

    lines.extend(["", "## Scenes", ""])

    for scene in campaign["scenes"]:
        audit = scene["ai_engineer_audit"]
        lines.extend(
            [
                f"### Scene {scene['number']:02d}",
                "",
                f"- Duration: {scene['duration_seconds']} seconds",
                f"- Narrative Purpose: {scene['narrative_purpose']}",
                "",
                "#### AI Engineer Audit",
                "",
                "##### Model Interpretation",
                "",
                audit["model_interpretation"],
                "",
                "##### Clarity Analysis",
                "",
                audit["clarity_analysis"],
                "",
                "##### Critical Risks",
                "",
                audit["critical_risks"],
                "",
                "##### Technical Optimization",
                "",
                audit["technical_optimization"],
                "",
                "##### Format Validation",
                "",
                audit["format_validation"],
                "",
                "#### Final Veo Prompt",
                "",
                scene["veo_prompt"],
                "",
                "#### Editing Text",
                "",
                scene["editing_text"] or "No editing text for this scene. Keep visual breathing room.",
                "",
            ]
        )

    lines.extend(
        [
            "## Final Editing Guide",
            "",
            campaign["final_editing_guide"],
            "",
            "## Director Notes",
            "",
            campaign["director_notes"],
            "",
            "## Source Context",
            "",
        ]
    )

    if payload.get("context_sources"):
        for source in payload["context_sources"]:
            lines.append(f"- {source}")
    else:
        lines.append("- No framework context files available.")

    lines.extend(["", "## Veo Rules Applied", ""])

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
        },
        client_path,
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
        "input": {key: value for key, value in payload.items() if key != "context_text"},
        "provider": provider_info,
    }
