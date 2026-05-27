CRITERIA = [
    {
        "key": "strategic_clarity",
        "label": "Claridad estrategica",
        "keywords": ["propuesta", "posicionamiento", "diferencial", "vision", "objetivo", "mercado"],
        "low_action": "Definir una promesa central, un publico prioritario y una razon clara para elegir la marca.",
    },
    {
        "key": "differentiation",
        "label": "Diferenciacion",
        "keywords": ["diferencial", "unico", "propio", "signature", "contraste", "categoria"],
        "low_action": "Convertir atributos genericos en codigos propietarios: rituales, lenguaje, visuales y experiencia.",
    },
    {
        "key": "premium_perception",
        "label": "Percepcion premium",
        "keywords": ["premium", "lujo", "curado", "exclusivo", "sofisticado", "valor"],
        "low_action": "Elevar prueba visual, lenguaje, ritmo de venta y empaque de oferta para justificar mayor valor percibido.",
    },
    {
        "key": "visual_coherence",
        "label": "Coherencia visual",
        "keywords": ["visual", "paleta", "tipografia", "fotografia", "estetica", "direccion"],
        "low_action": "Crear un sistema visual con reglas de color, composicion, fotografia, textura y jerarquia.",
    },
    {
        "key": "narrative_power",
        "label": "Potencia narrativa",
        "keywords": ["historia", "narrativa", "storytelling", "emocion", "voz", "mensaje"],
        "low_action": "Construir una narrativa con conflicto, transformacion, prueba y frase madre de marca.",
    },
    {
        "key": "conversion_readiness",
        "label": "Preparacion comercial",
        "keywords": ["venta", "conversion", "oferta", "precio", "paquete", "servicio", "lead"],
        "low_action": "Traducir la estrategia en ofertas, CTA, objeciones resueltas y secuencia de contenido comercial.",
    },
    {
        "key": "execution_readiness",
        "label": "Preparacion para ejecutar",
        "keywords": ["accion", "siguiente", "plan", "prioridad", "entregable", "sprint"],
        "low_action": "Cerrar el analisis con una lista de produccion: que crear, en que orden y con que criterio de exito.",
    },
]

DELIVERABLES = [
    {
        "name": "Identity Patch",
        "outcome": "Promesa, esencia, personalidad y ajuste inmediato de percepcion.",
        "actions": [
            "Redactar frase madre de marca.",
            "Definir 3 atributos no negociables.",
            "Eliminar mensajes genericos o confusos.",
        ],
    },
    {
        "name": "Brand Analysis",
        "outcome": "Diagnostico de problemas, oportunidades y decisiones prioritarias.",
        "actions": [
            "Mapear brechas entre percepcion actual e ideal.",
            "Separar sintomas esteticos de problemas estrategicos.",
            "Asignar prioridades por impacto comercial.",
        ],
    },
    {
        "name": "Entity Bible",
        "outcome": "Sistema estable de personalidad, voz, rituales y codigos de marca.",
        "actions": [
            "Crear reglas de comportamiento de marca.",
            "Documentar palabras permitidas y prohibidas.",
            "Definir arquetipo operativo.",
        ],
    },
    {
        "name": "Universo Visual",
        "outcome": "Direccion visual aplicable a feed, web, piezas, videos y presentaciones.",
        "actions": [
            "Fijar paleta, luz, encuadres y ritmo visual.",
            "Crear referencias de fotografia y composicion.",
            "Diseñar reglas para piezas repetibles.",
        ],
    },
    {
        "name": "Estrategia de Contenido",
        "outcome": "Pilares, formatos y secuencia para atraer, educar y convertir.",
        "actions": [
            "Definir 4 pilares editoriales.",
            "Crear hooks por etapa de conciencia.",
            "Diseñar una semana piloto de contenidos.",
        ],
    },
    {
        "name": "Prompts IA",
        "outcome": "Prompts listos para producir textos, visuales, reels y anuncios consistentes.",
        "actions": [
            "Crear prompt maestro de identidad.",
            "Crear prompts de piezas visuales.",
            "Crear prompts para guiones y captions.",
        ],
    },
    {
        "name": "Exportables",
        "outcome": "Documentos y archivos que el cliente puede usar sin depender del analisis.",
        "actions": [
            "Exportar reporte ejecutivo.",
            "Exportar guia visual resumida.",
            "Exportar backlog de implementacion.",
        ],
    },
]


def _normalize_text(*parts):
    return " ".join(str(part or "") for part in parts).lower()


def _extract_prompt_block(prompt, start_marker, end_marker=None):
    if not prompt or start_marker not in prompt:
        return ""

    start_index = prompt.find(start_marker) + len(start_marker)
    end_index = len(prompt)

    if end_marker and end_marker in prompt[start_index:]:
        end_index = prompt.find(end_marker, start_index)

    return prompt[start_index:end_index].strip()


def _client_analysis_source(prompt):
    if not prompt or "=== ENTITY BIBLE CONTEXT ===" not in prompt:
        return prompt or ""

    intro = prompt.split("=== ENTITY BIBLE CONTEXT ===", 1)[0].strip()
    client_context = _extract_prompt_block(
        prompt,
        "=== CLIENT CONTEXT ===",
        "=== ANALYSIS INSTRUCTIONS ===",
    )
    instructions = _extract_prompt_block(prompt, "=== ANALYSIS INSTRUCTIONS ===")

    return "\n\n".join(
        section
        for section in [
            intro,
            client_context,
            instructions,
        ]
        if section
    )


def _keyword_score(text, keywords):
    hits = sum(1 for keyword in keywords if keyword in text)
    return min(100, 42 + hits * 14)


def _score_status(score):
    if score >= 78:
        return "Fuerte"

    if score >= 60:
        return "En progreso"

    return "Critico"


def _signal_for(score, label):
    if score >= 78:
        return f"{label} ya tiene senales utiles; conviene convertirlas en reglas repetibles."

    if score >= 60:
        return f"{label} existe, pero necesita mas precision para sostener decisiones."

    return f"{label} esta debil o poco visible en las fuentes actuales."


def _build_scorecard(source_text):
    scorecard = []

    for criterion in CRITERIA:
        score = _keyword_score(source_text, criterion["keywords"])
        scorecard.append(
            {
                "key": criterion["key"],
                "label": criterion["label"],
                "score": score,
                "status": _score_status(score),
                "signal": _signal_for(score, criterion["label"]),
                "action": criterion["low_action"],
            }
        )

    return scorecard


def _build_priorities(scorecard):
    weakest = sorted(scorecard, key=lambda item: item["score"])[:3]

    return [
        {
            "title": item["label"],
            "urgency": "Alta" if item["score"] < 60 else "Media",
            "reason": item["signal"],
            "action": item["action"],
        }
        for item in weakest
    ]


def _build_content_pillars(source_text):
    pillars = [
        {
            "name": "Autoridad",
            "role": "Demostrar criterio, metodo y dominio de la categoria.",
            "formats": ["carrusel educativo", "analisis antes/despues", "post de criterio"],
        },
        {
            "name": "Deseo",
            "role": "Hacer tangible la transformacion emocional que promete la marca.",
            "formats": ["reel sensorial", "story de experiencia", "visual manifesto"],
        },
        {
            "name": "Prueba",
            "role": "Reducir incertidumbre con evidencia, casos, testimonios y proceso.",
            "formats": ["caso corto", "captura comentada", "behind the scenes"],
        },
        {
            "name": "Conversion",
            "role": "Guiar al publico hacia consulta, reserva, compra o diagnostico.",
            "formats": ["oferta explicada", "FAQ comercial", "CTA directo"],
        },
    ]

    if "instagram" in source_text or "feed" in source_text:
        pillars[1]["formats"].append("secuencia de stories")

    if "tour" in source_text or "travel" in source_text or "viaje" in source_text:
        pillars[1]["role"] = "Convertir el destino o servicio en una experiencia deseable, no solo en itinerario."

    return pillars


def _build_prompts(client_name):
    subject = client_name or "esta marca"

    return [
        {
            "name": "Prompt maestro de diagnostico",
            "prompt": f"Analiza {subject} y entrega brechas de posicionamiento, percepcion visual, narrativa, conversion y proximas acciones.",
        },
        {
            "name": "Prompt de universo visual",
            "prompt": f"Crea una direccion visual para {subject}: paleta, luz, fotografia, composicion, tipografia, ritmo y reglas de uso.",
        },
        {
            "name": "Prompt de contenido semanal",
            "prompt": f"Genera 7 piezas de contenido para {subject} usando pilares de autoridad, deseo, prueba y conversion.",
        },
    ]


def _confidence(scorecard, agent_count, has_client_context):
    average_score = sum(item["score"] for item in scorecard) / max(1, len(scorecard))
    source_bonus = min(18, agent_count * 3)
    context_bonus = 8 if has_client_context else 0

    return min(95, round(average_score * 0.72 + source_bonus + context_bonus))


def build_brand_analysis(prompt, agent_results=None, synthesis="", client=None, client_context=""):
    agent_results = agent_results or []
    agent_text = " ".join(result.get("response", "") for result in agent_results)
    source_text = _normalize_text(_client_analysis_source(prompt), agent_text, synthesis, client_context)
    scorecard = _build_scorecard(source_text)
    priorities = _build_priorities(scorecard)
    average_score = round(sum(item["score"] for item in scorecard) / max(1, len(scorecard)))
    client_name = client.get("name") if client else None

    if average_score >= 76:
        headline = "La marca tiene una base aprovechable; el mayor valor esta en convertir senales en sistema."
    elif average_score >= 60:
        headline = "La marca tiene potencial, pero necesita decisiones mas nitidas para producir resultados consistentes."
    else:
        headline = "La marca necesita ordenar estrategia, percepcion y ejecucion antes de escalar contenido o ventas."

    return {
        "headline": headline,
        "overall_score": average_score,
        "confidence": _confidence(scorecard, len(agent_results), bool(client_context.strip())),
        "diagnosis": {
            "current_state": "Las fuentes muestran senales utiles, pero el sistema debe separar identidad, percepcion visual, narrativa y conversion para operar con precision.",
            "main_gap": priorities[0]["title"] if priorities else "Claridad estrategica",
            "strategic_decision": "Priorizar una promesa central, un codigo visual reconocible y una secuencia de contenido que convierta atencion en accion.",
        },
        "scorecard": scorecard,
        "priorities": priorities,
        "deliverables": DELIVERABLES,
        "content_pillars": _build_content_pillars(source_text),
        "ai_prompts": _build_prompts(client_name),
        "next_sprint": [
            "Consolidar briefing y fuentes del cliente en una sola memoria.",
            "Cerrar Identity Patch y posicionamiento emocional.",
            "Crear guia de universo visual con reglas aplicables.",
            "Producir calendario piloto de 7 piezas.",
            "Exportar reporte ejecutivo y backlog de implementacion.",
        ],
        "risks": [
            "Confundir estetica premium con estrategia premium.",
            "Crear contenido sin una promesa de marca repetible.",
            "Entregar ideas sueltas sin convertirlas en reglas y archivos reutilizables.",
        ],
    }
