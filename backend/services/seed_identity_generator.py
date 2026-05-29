# Seed Identity Generator Service
# Synthesizes provisional brand positioning and Advanced OS Prompt Packs.

import os
import json
from pathlib import Path
import sys

# Ensure backend path is in sys.path for internal imports
backend_dir = Path(__file__).resolve().parent.parent
if str(backend_dir) not in sys.path:
    sys.path.insert(0, str(backend_dir))

from client_manager import ensure_client

# Define Presets for Inferred Seed Identities
PRESETS = {
    "hospitality": {
        "theme": "Tropical Premium / Warm Luxury",
        "colors": {
            "primary": "Verde Tropical (#2F4F3E)",
            "secondary": "Azul Océano (#1E4A5F)",
            "accent": "Dorado Arena (#C8A46A)",
            "light_neut": "Beige Natural (#F2E6D2)",
            "dark_neut": "Arena Oscura (#4A4335)",
            "bg": "Blanco Puro (#F7F5F0)"
        },
        "fonts": {
            "primary": "Cormorant Garamond",
            "secondary": "Montserrat"
        },
        "tone": "Warm, serene, evocative, editorial, and deeply welcoming.",
        "concept": "A sanctuary of slow luxury, connecting travelers with intentional spaces and natural elements.",
        "emotion": "Serenity, safety, and deep emotional resonance."
    },
    "fashion": {
        "theme": "High-End Editorial / Minimalist Luxury",
        "colors": {
            "primary": "Deep Obsidian (#1A1A1A)",
            "secondary": "Muted Taupe (#8C8275)",
            "accent": "Champagne Gold (#D4AF37)",
            "light_neut": "Soft Cream (#FAF6F0)",
            "dark_neut": "Charcoal Black (#2B2B2B)",
            "bg": "Pristine White (#FFFFFF)"
        },
        "fonts": {
            "primary": "Didot / Bodoni",
            "secondary": "Inter"
        },
        "tone": "Sophisticated, authoritative, restrained, and artistic.",
        "concept": "Restrained luxury defined by architectural cuts, silent luxury, and geometric precision.",
        "emotion": "Aspiration, confidence, and quiet authority."
    },
    "wellness": {
        "theme": "Organic Minimal / Healing Sanctuary",
        "colors": {
            "primary": "Muted Sage (#7D8471)",
            "secondary": "Earthy Clay (#C5A893)",
            "accent": "Warm Ochre (#D9B48F)",
            "light_neut": "Warm Sand (#F4EFEB)",
            "dark_neut": "Slate Gray (#5A615E)",
            "bg": "Soft Linen (#FAF9F6)"
        },
        "fonts": {
            "primary": "Playfair Display",
            "secondary": "Inter"
        },
        "tone": "Gentle, grounding, honest, therapeutic, and calm.",
        "concept": "A sensory landscape dedicated to restoring balance through organic textures and spacious intervals.",
        "emotion": "Inner peace, restoration, and raw confidence."
    },
    "default": {
        "theme": "Sleek Corporate / Modern Premium",
        "colors": {
            "primary": "Midnight Navy (#0F172A)",
            "secondary": "Slate Slate (#475569)",
            "accent": "Satin Brass (#C5A880)",
            "light_neut": "Alabaster Gray (#F1F5F9)",
            "dark_neut": "Ink Black (#020617)",
            "bg": "Bright White (#FFFFFF)"
        },
        "fonts": {
            "primary": "Lora",
            "secondary": "Outfit"
        },
        "tone": "Polished, strategic, visionary, clear, and reassuring.",
        "concept": "A balance of tactical clarity and premium execution, turning complexity into recognizable value.",
        "emotion": "Trust, clarity, and visionary foresight."
    }
}

def get_preset(category: str) -> dict:
    cat_lower = str(category).lower()
    if "hotel" in cat_lower or "hospitality" in cat_lower or "resort" in cat_lower or "tours" in cat_lower:
        return PRESETS["hospitality"]
    elif "fashion" in cat_lower or "design" in cat_lower or "luxury" in cat_lower:
        return PRESETS["fashion"]
    elif "well" in cat_lower or "spa" in cat_lower or "health" in cat_lower or "mind" in cat_lower:
        return PRESETS["wellness"]
    return PRESETS["default"]

def generate_seed_identity(client_name: str, category: str, notes: str = "") -> dict:
    """
    Generates a provisional/seed brand identity and writes the 9 prompt pack files.
    """
    client = ensure_client(client_name, "Seed Identity Onboarding Execution.")
    if not client:
        raise ValueError(f"Failed to initialize client folder for '{client_name}'")
        
    client_path = Path(client["path"])
    prompt_pack_dir = client_path / "05_ENTREGAS" / "prompt_pack"
    prompt_pack_dir.mkdir(parents=True, exist_ok=True)
    
    preset = get_preset(category)
    c = preset["colors"]
    f = preset["fonts"]
    
    # 1. identity_cliente.md
    identity_content = f"""# IDENTITY CLIENTE — {client_name}

## 1. Instruccion inicial

Este documento es el contexto maestro de identidad para trabajar esta marca en ChatGPT u otra herramienta creativa. Usalo antes de pedir logos, paletas, tono de marca, boards, piezas visuales o propuestas comerciales.

## 2. Perfil del cliente

- Nombre: {client_name}
- Industria/categoria: {category}
- Contexto general: {notes or f"Marca en etapa de lanzamiento dentro del sector de {category}."}

## 3. Diagnostico actual

- Headline: De la idea inicial al posicionamiento premium de autor.
- Overall score: 65
- Confidence: 40 (Provisional Seed Status)
- Problemas principales: Falta de activos de diseño iniciales y definición de directrices de comunicación.
- Tension de percepcion: Transicionar de una propuesta provisional a un sistema de valor percibido premium.

## 4. Lectura de entidad

- Entidad emergente: Una alternativa refinada que destaca por su curaduría y consistencia visual en la categoría {category}.
- Energia transmitida: Coherente, limpia, y controlada.
- Debe dejar de parecer: Genérica, barata, apresurada o inconsistente.
- Debe empezar a parecer: Un referente editorial premium con autoridad clara.

## 5. Nucleo de marca

- Proposito: {preset["concept"]}
- Promesa: Ofrecer excelencia, distinción y una experiencia memorable a través de detalles controlados.
- Personalidad: Premium, de autor, serena, coherente y cercana.
- Diferenciadores:
  - **Calidad de Autor**: Cada elemento es seleccionado con criterio único.
  - **Consistencia Estética**: Un sistema visual limpio y editorial.
  - **Enfoque Premium**: Orientado a la experiencia del usuario antes que al volumen masivo.
- Valores: Criterio, honestidad, estética y valor percibido.
- Territorio simbolico: El espacio en blanco, la luz controlada, la simetría y las texturas puras.

## 6. Publico ideal

- A quien le habla: Clientes exigentes que aprecian el diseño, la sutileza y el valor de los detalles.
- Que desea ese publico: Claridad, soluciones confiables y una estética que refleje su criterio personal.
- Objeciones probables: Miedo a la falta de originalidad o a la frialdad corporativa.
- Que necesita sentir para confiar: Coherencia visual absoluta y cuidado meticuloso del lenguaje.

## 7. Tono de voz

- Personalidad verbal: {preset["tone"]}
- Palabras que si usa: Criterio, detalle, intención, diseño, curaduría, atemporal, calma, espacio.
- Palabras que evita: Oferta, barato, masivo, genérico, rápido, corporativo tradicional, ruido.
- Frases ejemplo:
  - Diseñado con intención.
  - La verdadera sofisticación reside en lo que omitimos.
- Tono Instagram: Editorial, inspirador y controlado.

## 8. Direccion visual

- Estilo recomendado: {preset["theme"]}
- Atmosfera: Serena, profunda, limpia y refinada.
- Paleta sugerida: Principal ({c['primary']}), Secundario ({c['secondary']}), Acento ({c['accent']}), Neutros ({c['light_neut']} / {c['dark_neut']}).
- Composicion: Espacio negativo generoso y layouts asimétricos limpios.

## 9. Logo System Direction

- Tipo de logo recomendado: Logotipo minimalista con tipografía de autor ({f['primary']}) combinada con bajadas sin serifa de lectura limpia ({f['secondary']}).
- Simbolo/icono sugerido: Monograma estilizado que funcione como sello de calidad.

## 10. Storytelling
- Narrativa central: Del desorden al criterio; de la saturación visual al valor del silencio y el espacio.

## 11. Contenido
- Pilares: Curaduría (40%), Experiencia (30%), Caso/Prueba (20%), Conversión elegante (10%).

## 12. Objetivo creativo
Cualquier pieza generada para {client_name} debe evocar simplicidad, jerarquía editorial y espacio negativo amplio.

## 13. MODO DE GENERACION VISUAL
Actúa como director creativo senior y estratega visual. Usa Cormorant Garamond y Montserrat como bases.
"""

    # 2. visual_generation_mode.md
    visual_gen_content = """# VISUAL GENERATION MODE

## Como usar este modo
Primero pega `identity_cliente.md`.
Despues pega `visual_generation_mode.md`.
Despues pega el prompt especifico que quieras ejecutar.

## Reglas generales
- No disenar antes de interpretar.
- Pedir variaciones controladas.
- Priorizar la composición cinematográfica, espacio negativo generoso y tipografías editoriales refinadas.
"""

    # 3. logo_system_prompt.md
    logo_prompt_content = f"""# Logo System Prompt

Usa primero `identity_cliente.md` como contexto maestro. Luego ejecuta esta tarea especifica:

Crea una direccion de logo system para esta marca. Incluye:
- logo principal (utilizando tipografías {f['primary']} y {f['secondary']})
- versión horizontal y compacta
- símbolo / icono
- uso en fondo claro y oscuro

Instrucciones negativas:
- no usar isotipos baratos o palmeras/aviones genéricos
- no perder legibilidad en tamaño pequeño
"""

    # 4. color_palette_prompt.md
    color_palette_content = f"""# Color Palette Prompt

Usa primero `identity_cliente.md` como contexto maestro. Luego ejecuta esta tarea especifica:

Crea una paleta cromatica premium para esta marca. Incluye:
- color principal: {c['primary']}
- secundario: {c['secondary']}
- acento: {c['accent']}
- neutro oscuro: {c['dark_neut']}
- neutro claro: {c['light_neut']}
- fondo base: {c['bg']}
- combinaciones recomendadas
- evitar colores fluorescentes o neón artificiales
"""

    # 5. tone_of_brand_prompt.md
    tone_prompt_content = f"""# Tone Of Brand Prompt

Usa primero `identity_cliente.md` como contexto maestro. Luego ejecuta esta tarea especifica:

Define el tono de marca. Incluye:
- personalidad verbal: {preset['tone']}
- palabras que si usa y palabras que evita
- frases ejemplo de marca
"""

    # 6. storytelling_board_prompt.md
    storytelling_content = """# Storytelling Board Prompt

Usa primero `identity_cliente.md` como contexto maestro. Luego ejecuta esta tarea especifica:

Crea un Storytelling Strategy Board con composición editorial clara. Incluye:
- hero narrativo
- pilares emocionales
- manifiesto de marca
"""

    # 7. visual_universe_board_prompt.md
    visual_universe_content = f"""# Visual Universe Board Prompt

Usa primero `identity_cliente.md` as contexto maestro. Luego ejecuta esta tarea especifica:

Crea un Visual Universe Board que traduzca la entidad en atmósfera:
- estilo: {preset['theme']}
- iluminación natural
- texturas y motion system (paneos lentos)
"""

    # 8. brand_identity_board_prompt.md
    brand_identity_content = f"""# Brand Identity Board Prompt

Usa primero `identity_cliente.md` como contexto maestro. Luego ejecuta esta tarea especifica:

Crea un board horizontal 16:9 premium de identidad visual con composición editorial modular.
"""

    # 9. full_brand_experience_prompt_pack.md
    full_prompt_pack = f"""# IDENTITY CLIENTE — {client_name}

## 1. Instruccion inicial
Este documento es el contexto maestro de identidad para trabajar esta marca.

{identity_content[identity_content.find('## 2. Perfil del cliente'):]}

---
{visual_gen_content}

---
{logo_prompt_content}

---
{color_palette_content}

---
{tone_prompt_content}

---
{brand_identity_content}

---
{storytelling_content}

---
{visual_universe_content}
"""

    files_to_write = {
        "identity_cliente.md": identity_content,
        "visual_generation_mode.md": visual_gen_content,
        "logo_system_prompt.md": logo_prompt_content,
        "color_palette_prompt.md": color_palette_content,
        "tone_of_brand_prompt.md": tone_prompt_content,
        "storytelling_board_prompt.md": storytelling_content,
        "visual_universe_board_prompt.md": visual_universe_content,
        "brand_identity_board_prompt.md": brand_identity_content,
        "full_brand_experience_prompt_pack.md": full_prompt_pack
    }

    created = []
    for fname, fcontent in files_to_write.items():
        fpath = prompt_pack_dir / fname
        fpath.write_text(fcontent.strip() + "\n", encoding="utf-8")
        relative_path = fpath.relative_to(client_path).as_posix()
        created.append(relative_path)

    return {
        "client": client["name"],
        "category": category,
        "preset_applied": preset["theme"],
        "base": "05_ENTREGAS/prompt_pack",
        "created": created,
        "status": "SEED IDENTITY ACTIVATED"
    }
