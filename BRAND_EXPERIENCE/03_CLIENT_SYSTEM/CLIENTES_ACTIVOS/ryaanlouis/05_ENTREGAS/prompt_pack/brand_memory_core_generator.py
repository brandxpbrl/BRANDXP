#!/usr/bin/env python3
# -*- coding: utf-8 -*-

"""
BRAND MEMORY CORE GENERATOR
Autor: Brand Experience OS

Este script crea la PRIORIDAD 1:
BRAND MEMORY CORE — una memoria persistente de marca para IA.

Uso:
1. Coloca este script en la misma carpeta donde tienes:
   - identity_cliente.md
   - visual_generation_mode.md
   - logo_system_prompt.md
   - color_palette_prompt.md
   - tone_of_brand_prompt.md
   - storytelling_board_prompt.md
   - visual_universe_board_prompt.md
   - brand_identity_board_prompt.md
   - full_brand_experience_prompt_pack.md

2. Ejecuta:
   python brand_memory_core_generator.py

3. Se creará una carpeta:
   BRAND_MEMORY_CORE_OUTPUT/
"""

from pathlib import Path
import json
import re
from datetime import datetime


# =========================
# CONFIGURACIÓN
# =========================

INPUT_FILES = {
    "identity": "identity_cliente.md",
    "visual_mode": "visual_generation_mode.md",
    "logo_system": "logo_system_prompt.md",
    "color_palette": "color_palette_prompt.md",
    "tone": "tone_of_brand_prompt.md",
    "storytelling": "storytelling_board_prompt.md",
    "visual_universe": "visual_universe_board_prompt.md",
    "brand_board": "brand_identity_board_prompt.md",
    "full_pack": "full_brand_experience_prompt_pack.md",
}

OUTPUT_DIR = Path("BRAND_MEMORY_CORE_OUTPUT")


# =========================
# UTILIDADES
# =========================

def read_file(path: Path) -> str:
    if not path.exists():
        return ""
    return path.read_text(encoding="utf-8", errors="ignore")


def clean_text(text: str) -> str:
    text = text.replace("\r\n", "\n")
    text = re.sub(r"\n{3,}", "\n\n", text)
    return text.strip()


def extract_section(text: str, title: str) -> str:
    """
    Extrae una sección markdown aproximada por título.
    """
    pattern = rf"(##+\s+.*{re.escape(title)}.*?)(?=\n##+\s+|\Z)"
    match = re.search(pattern, text, flags=re.IGNORECASE | re.DOTALL)
    return clean_text(match.group(1)) if match else ""


def bullet_list_from_section(section: str) -> list:
    items = []
    for line in section.splitlines():
        line = line.strip()
        if line.startswith("- "):
            items.append(line[2:].strip())
    return items


def write_md(filename: str, content: str):
    path = OUTPUT_DIR / filename
    path.write_text(clean_text(content) + "\n", encoding="utf-8")
    return path


def write_json(filename: str, data: dict):
    path = OUTPUT_DIR / filename
    path.write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding="utf-8")
    return path


# =========================
# CARGA DE ARCHIVOS
# =========================

def load_sources(base_dir: Path) -> dict:
    sources = {}
    for key, filename in INPUT_FILES.items():
        sources[key] = read_file(base_dir / filename)
    return sources


# =========================
# GENERADORES
# =========================

def generate_entity_core(identity: str) -> str:
    lectura = extract_section(identity, "Lectura de entidad")
    nucleo = extract_section(identity, "Nucleo de marca")
    publico = extract_section(identity, "Publico ideal")
    objetivo = extract_section(identity, "Objetivo creativo")

    return f"""
# 01_ENTITY_CORE — Brand Memory Core

## Función
Esta capa define cómo piensa, siente y debe ser percibida la marca antes de cualquier diseño, copy, campaña o pieza visual.

## Lectura de entidad
{lectura}

## Núcleo de marca
{nucleo}

## Público ideal
{publico}

## Objetivo creativo
{objetivo}

## Regla principal
La marca no debe buscar parecer más fuerte. Debe transmitir con más precisión.

## Principio rector
El valor debe sentirse antes de explicarse.

## Uso para IA
Antes de generar cualquier output, la IA debe interpretar:
- energía emocional
- percepción deseada
- tensión actual
- promesa central
- transformación esperada
- nivel premium
- razón clara para confiar
"""


def generate_visual_dna(identity: str, visual_universe: str, color_palette: str) -> str:
    visual = extract_section(identity, "Direccion visual")

    return f"""
# 02_VISUAL_DNA — Brand Memory Core

## Función
Esta capa define cómo debe verse, sentirse y organizarse visualmente la marca.

## Dirección visual desde identidad
{visual}

## Reglas visuales base
- Un solo foco claro por pieza.
- Usar espacio negativo para aumentar valor percibido.
- Crear jerarquía antes de decorar.
- Usar contraste para guiar atención.
- Evitar ruido visual.
- Evitar layouts genéricos.
- Mantener atmósfera premium, editorial y cinematográfica.

## Sistema cromático base
Usar como referencia principal:
- Deep Base: profundidad, foco y autoridad.
- Signature Accent: deseo, distinción y momento emocional.
- Cool Signal: modernidad, precisión y dirección contemporánea.

## Prompt operativo para paleta
{color_palette}

## Prompt operativo para universo visual
{visual_universe}

## Uso para IA
Cada pieza visual debe responder:
1. ¿Dónde está el foco?
2. ¿Qué emoción domina?
3. ¿Qué elemento aumenta valor percibido?
4. ¿Qué se debe eliminar para aumentar precisión?
"""


def generate_symbol_system(identity: str, logo_system: str) -> str:
    logo = extract_section(identity, "Logo System Direction")

    return f"""
# 03_SYMBOL_SYSTEM — Brand Memory Core

## Función
Esta capa define cómo construir memorabilidad visual mediante símbolos, geometría y sistemas reconocibles.

## Dirección de logo desde identidad
{logo}

## Reglas de símbolo
- Debe ser simple, memorable y adaptable.
- Debe funcionar como favicon, avatar, marca de agua, sello, ícono social y sistema visual.
- No debe depender de efectos complejos.
- Debe tener lectura clara en tamaño pequeño.
- Debe poder vivir en fondo claro y oscuro.

## Sistema mínimo obligatorio
- Logo principal
- Versión horizontal
- Versión compacta
- Símbolo / ícono
- Monocromo
- Fondo claro
- Fondo oscuro
- Favicon
- Avatar social

## Prompt operativo de logo system
{logo_system}

## Lo que debe evitar
- Iconos obvios.
- Símbolos cliché.
- Mezcla excesiva de elementos.
- Tipografías ilegibles.
- Logos genéricos de agencia.
"""


def generate_typography_dna(identity: str) -> str:
    return """
# 04_TYPOGRAPHY_DNA — Brand Memory Core

## Función
Esta capa define cómo debe comportarse la tipografía de la marca.

## Dirección tipográfica
La tipografía debe transmitir:
- claridad
- autoridad
- precisión
- valor percibido
- sensación editorial premium

## Reglas recomendadas
- Usar titulares fuertes con mucho aire.
- Evitar tipografías decorativas sin función.
- Priorizar legibilidad sobre ornamento.
- Usar contraste entre pesos: bold / regular / light.
- Mantener tracking controlado.
- Evitar exceso de estilos en una misma pieza.

## Jerarquía sugerida
- H1: frase dominante, máximo impacto.
- H2: idea estratégica o promesa.
- Body: explicación clara y breve.
- Microcopy: CTA, prueba o sistema.

## Comportamiento visual
La tipografía debe sentirse como dirección editorial, no como decoración.
"""


def generate_story_engine(identity: str, storytelling: str, tone: str) -> str:
    story = extract_section(identity, "Storytelling")
    contenido = extract_section(identity, "Contenido")
    tono = extract_section(identity, "Tono de voz")

    return f"""
# 05_STORY_ENGINE — Brand Memory Core

## Función
Esta capa define cómo la marca transforma tensión en deseo, prueba y acción.

## Storytelling desde identidad
{story}

## Sistema de contenido desde identidad
{contenido}

## Tono desde identidad
{tono}

## Prompt operativo de storytelling
{storytelling}

## Prompt operativo de tono
{tone}

## Framework narrativo base
1. Tensión: mostrar el problema de percepción.
2. Claridad: ordenar lo que está disperso.
3. Deseo: hacer visible la transformación.
4. Prueba: demostrar proceso, evidencia o método.
5. Acción: guiar hacia consulta, compra, reserva o diagnóstico.

## Frases maestras
- El valor debe sentirse antes de explicarse.
- Cada pieza debe reforzar la misma promesa.
- La estética debe servir a la percepción.
- La historia no decora la oferta. Hace visible la transformación.
"""


def generate_content_engine(identity: str) -> str:
    contenido = extract_section(identity, "Contenido")

    return f"""
# 06_CONTENT_ENGINE — Brand Memory Core

## Función
Esta capa convierte identidad en contenido comercial, social y narrativo.

## Base de contenido
{contenido}

## Pilares de contenido
- Autoridad: demostrar criterio, método y dominio.
- Deseo: hacer tangible la experiencia deseada.
- Prueba: reducir incertidumbre con evidencia.
- Conversión: guiar hacia acción concreta.

## Formatos prioritarios
- Short reels
- Carruseles
- Stories secuenciales
- Manifiestos
- Antes / después
- Procesos
- Pruebas
- CTA comerciales

## Reglas para Instagram
- Una idea fuerte por post.
- Jerarquía visual clara.
- Copy breve y editorial.
- Recurrencia visual para crear recordación.
- Prueba fácil de escanear.
- CTA concreto.

## Estructura de reel
1. Hook de percepción.
2. Tensión clara.
3. Transformación visible.
4. Prueba o criterio.
5. CTA directo.

## Estructura de carrusel
1. Portada con promesa.
2. Tensión/problema.
3. Insight.
4. Sistema/framework.
5. Prueba o ejemplo.
6. Beneficio.
7. CTA.
"""


def generate_motion_system() -> str:
    return """
# 07_MOTION_SYSTEM — Brand Memory Core

## Función
Esta capa define cómo se mueve la marca.

## Principios de motion
- Movimiento preciso, no decorativo.
- Ritmo cinematográfico.
- Transiciones limpias.
- Apariciones con intención.
- Cámara con control premium.
- Tipografía con timing editorial.
- Profundidad y contraste como lenguaje.

## Comportamientos recomendados
- Slow reveal.
- Focus pull.
- Parallax sutil.
- Cámara lateral lenta.
- Zoom mínimo con intención.
- Glow controlado.
- Fade elegante.
- Cortes limpios en momentos de tensión.

## Timing sugerido
- Hook visual: 0 a 2 segundos.
- Desarrollo: 2 a 7 segundos.
- Prueba / transformación: 7 a 12 segundos.
- CTA: últimos 2 segundos.

## Evitar
- Transiciones exageradas.
- Efectos sin propósito.
- Movimiento caótico.
- Zooms agresivos sin criterio.
- Animaciones infantiles.
"""


def generate_ai_restrictions(visual_mode: str) -> str:
    return f"""
# 08_AI_RESTRICTIONS — Brand Memory Core

## Función
Esta capa impide que la IA rompa la identidad de marca.

## Restricciones maestras
- No diseñar antes de interpretar.
- No generar estética sin estrategia.
- No crear piezas genéricas.
- No usar plantillas básicas.
- No saturar la composición.
- No usar recursos stock.
- No confundir premium con exceso de efectos.
- No perder jerarquía.
- No perder legibilidad.
- No romper la promesa central.

## Negative prompt base
- generic template
- stock design
- cluttered composition
- low contrast
- cheap logo
- overused icons
- illegible typography
- inconsistent palette
- childish style
- random gradients
- too many effects
- flat corporate layout
- visual noise
- cliché branding

## Visual Generation Mode
{visual_mode}
"""


def generate_prompt_engine(sources: dict) -> str:
    return f"""
# 09_PROMPT_ENGINE — Brand Memory Core

## Función
Esta capa centraliza los prompts operativos que permiten ejecutar la marca en IA.

## Orden correcto de uso
1. Pegar identity_cliente.md
2. Pegar BRAND_MEMORY_CORE_MASTER.md
3. Pegar el módulo específico según output
4. Pedir rutas creativas antes del resultado final
5. Generar variaciones controladas
6. Seleccionar una dirección
7. Recién después producir el output final

## Módulos disponibles
- Logo System
- Color Palette
- Tone of Brand
- Storytelling Board
- Visual Universe Board
- Brand Identity Board
- Visual Generation Mode
- Full Brand Experience Prompt Pack

## Prompt maestro universal
Actúa como director creativo senior, estratega de marca, diseñador de identidad visual premium y especialista en storytelling. Usa el BRAND MEMORY CORE como memoria persistente de la marca. Antes de generar cualquier pieza, interpreta la entidad, la percepción deseada, la tensión actual, la promesa, el territorio visual y el objetivo comercial. No generes estética decorativa. Genera sistemas coherentes, memorables y orientados a valor percibido.

## Prompt Logo System
{sources.get("logo_system", "")}

## Prompt Color Palette
{sources.get("color_palette", "")}

## Prompt Tone Of Brand
{sources.get("tone", "")}

## Prompt Storytelling Board
{sources.get("storytelling", "")}

## Prompt Visual Universe Board
{sources.get("visual_universe", "")}

## Prompt Brand Identity Board
{sources.get("brand_board", "")}
"""


def generate_master_md(parts: dict) -> str:
    joined = "\n\n---\n\n".join(parts.values())
    return f"""
# BRAND MEMORY CORE — MASTER

Generado automáticamente el {datetime.now().strftime("%Y-%m-%d %H:%M:%S")}

## Propósito
Este documento funciona como memoria persistente de marca para IA. Debe usarse antes de generar diseños, campañas, logos, storytelling, contenidos, boards, videos, reels, landings o propuestas comerciales.

## Regla principal
La IA no debe producir outputs sueltos. Debe operar como la marca.

---

{joined}
"""


def generate_memory_json(identity: str, sources: dict) -> dict:
    return {
        "brand_memory_core": {
            "generated_at": datetime.now().isoformat(),
            "purpose": "Persistent AI-readable brand memory for strategy, design, storytelling, content and visual generation.",
            "primary_rule": "Do not design before interpreting the brand entity.",
            "brand_logic": {
                "perception": "Value must be felt before it is explained.",
                "creative_goal": "Increase clarity, authority, desire, trust and memorability.",
                "visual_style": "Premium cinematic clarity.",
                "narrative_structure": "Tension → Transformation → Proof → Action.",
                "commercial_focus": "Convert attention into trust and action."
            },
            "modules": {
                "entity_core": "01_ENTITY_CORE.md",
                "visual_dna": "02_VISUAL_DNA.md",
                "symbol_system": "03_SYMBOL_SYSTEM.md",
                "typography_dna": "04_TYPOGRAPHY_DNA.md",
                "story_engine": "05_STORY_ENGINE.md",
                "content_engine": "06_CONTENT_ENGINE.md",
                "motion_system": "07_MOTION_SYSTEM.md",
                "ai_restrictions": "08_AI_RESTRICTIONS.md",
                "prompt_engine": "09_PROMPT_ENGINE.md"
            },
            "source_files_loaded": {
                key: bool(value.strip()) for key, value in sources.items()
            }
        }
    }


# =========================
# MAIN
# =========================

def main():
    base_dir = Path.cwd()
    OUTPUT_DIR.mkdir(exist_ok=True)

    sources = load_sources(base_dir)
    identity = sources.get("identity", "")

    if not identity.strip():
        print("ERROR: No se encontró identity_cliente.md en la carpeta actual.")
        print("Coloca el archivo identity_cliente.md junto al script y vuelve a ejecutar.")
        return

    parts = {
        "01_ENTITY_CORE": generate_entity_core(identity),
        "02_VISUAL_DNA": generate_visual_dna(
            identity,
            sources.get("visual_universe", ""),
            sources.get("color_palette", "")
        ),
        "03_SYMBOL_SYSTEM": generate_symbol_system(
            identity,
            sources.get("logo_system", "")
        ),
        "04_TYPOGRAPHY_DNA": generate_typography_dna(identity),
        "05_STORY_ENGINE": generate_story_engine(
            identity,
            sources.get("storytelling", ""),
            sources.get("tone", "")
        ),
        "06_CONTENT_ENGINE": generate_content_engine(identity),
        "07_MOTION_SYSTEM": generate_motion_system(),
        "08_AI_RESTRICTIONS": generate_ai_restrictions(
            sources.get("visual_mode", "")
        ),
        "09_PROMPT_ENGINE": generate_prompt_engine(sources),
    }

    generated_files = []

    for name, content in parts.items():
        generated_files.append(str(write_md(f"{name}.md", content)))

    master_md = generate_master_md(parts)
    generated_files.append(str(write_md("BRAND_MEMORY_CORE_MASTER.md", master_md)))

    memory_json = generate_memory_json(identity, sources)
    generated_files.append(str(write_json("brand_memory_core.json", memory_json)))

    readme = f"""
# BRAND MEMORY CORE OUTPUT

Archivos generados:

{chr(10).join(f"- {Path(file).name}" for file in generated_files)}

## Cómo usar

1. Abre `BRAND_MEMORY_CORE_MASTER.md`.
2. Súbelo a ChatGPT, Gemini, Claude o tu agente.
3. Usa ese archivo como memoria estratégica antes de generar:
   - logo
   - paleta
   - tono
   - storytelling
   - universo visual
   - contenido
   - reels
   - propuestas comerciales
   - campañas

## Orden recomendado

1. identity_cliente.md
2. BRAND_MEMORY_CORE_MASTER.md
3. módulo específico según tarea
4. generación final
"""
    generated_files.append(str(write_md("README.md", readme)))

    print("\nBRAND MEMORY CORE generado correctamente.\n")
    print(f"Carpeta de salida: {OUTPUT_DIR.resolve()}\n")
    print("Archivos creados:")
    for file in generated_files:
        print(f"- {file}")


if __name__ == "__main__":
    main()
