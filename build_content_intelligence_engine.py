#!/usr/bin/env python3
# -*- coding: utf-8 -*-

"""
BRAND EXPERIENCE OS — CONTENT INTELLIGENCE ENGINE BUILDER
Prioridad 3: Content Intelligence Engine

Uso:
python build_content_intelligence_engine.py --client ryaanlouis --root "C:\\Users\\Bela Tours\\brandexperience\\BRAND_EXPERIENCE\\03_CLIENT_SYSTEM\\CLIENTES_ACTIVOS"

Qué genera dentro del cliente:
08_CONTENT_INTELLIGENCE_ENGINE/
  CONTENT_INTELLIGENCE_ENGINE_MASTER.md
  content_intelligence_engine.json
  README.md
  modules/
    01_CONTENT_STRATEGY.md
    02_FUNNEL_SYSTEM.md
    03_HOOK_ENGINE.md
    04_CAROUSEL_ENGINE.md
    05_REELS_ENGINE.md
    06_STORIES_ENGINE.md
    07_CTA_ENGINE.md
    08_CAMPAIGN_ENGINE.md
    09_CONTENT_CALENDAR_ENGINE.md
    10_CONTENT_PROMPT_ENGINE.md
"""

from pathlib import Path
import argparse
import json
import re
from datetime import datetime


def read_file(path: Path) -> str:
    if path.exists():
        return path.read_text(encoding="utf-8", errors="ignore")
    return ""


def write_file(path: Path, content: str):
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(content.strip() + "\n", encoding="utf-8")


def slugify(text: str) -> str:
    text = text.strip().lower()
    text = re.sub(r"[^a-z0-9áéíóúñü]+", "_", text)
    return text.strip("_") or "cliente"


def extract_section(text: str, title: str) -> str:
    pattern = rf"(##+\s+.*{re.escape(title)}.*?)(?=\n##+\s+|\Z)"
    match = re.search(pattern, text, flags=re.IGNORECASE | re.DOTALL)
    return match.group(1).strip() if match else ""


def load_json(path: Path) -> dict:
    if not path.exists():
        return {}
    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except Exception:
        return {}


def generate_content_strategy(identity: str) -> str:
    return f"""
# 01_CONTENT_STRATEGY

## Función
Define la estrategia madre de contenido de la marca.

## Base desde identidad
{extract_section(identity, "Contenido")}

## Objetivo del contenido
Convertir atención en confianza, deseo, prueba y acción.

## Principio central
Cada contenido debe reforzar una promesa de marca repetible.

## Pilares estratégicos
### 1. Autoridad
Demostrar criterio, método, experiencia y dominio de la categoría.

### 2. Deseo
Hacer que la transformación se sienta tangible antes de explicarla.

### 3. Prueba
Reducir incertidumbre con evidencia, proceso, resultados, casos y testimonios.

### 4. Conversión
Guiar al público hacia consulta, reserva, compra, diagnóstico o conversación.

## Reglas de contenido
- Una idea fuerte por pieza.
- Promesa clara.
- Visual coherente.
- CTA directo.
- No publicar contenido aislado sin sistema.
- No crear posts solo decorativos.
- Cada pieza debe mover al público a una etapa del funnel.
"""


def generate_funnel_system() -> str:
    return """
# 02_FUNNEL_SYSTEM

## Función
Define cómo el contenido mueve al público desde atención hasta acción.

## Funnel de percepción
### 1. Awareness / Atención
El público descubre una tensión o deseo.

Contenido recomendado:
- hooks visuales
- manifiestos
- frases fuertes
- reels cortos
- problemas comunes

### 2. Interest / Interés
El público entiende que la marca tiene criterio.

Contenido recomendado:
- carruseles educativos
- frameworks
- insights
- comparaciones
- errores frecuentes

### 3. Trust / Confianza
El público reduce dudas y percibe autoridad.

Contenido recomendado:
- pruebas
- procesos
- casos
- testimonios
- detrás de escena
- método

### 4. Desire / Deseo
El público imagina la transformación.

Contenido recomendado:
- antes/después
- storytelling
- experiencia deseada
- beneficios emocionales
- piezas aspiracionales

### 5. Action / Conversión
El público recibe una acción concreta.

Contenido recomendado:
- CTA directo
- oferta
- diagnóstico
- reserva
- DM
- formulario
- propuesta

## Regla
No pedir acción antes de construir percepción suficiente.
"""


def generate_hook_engine() -> str:
    return """
# 03_HOOK_ENGINE

## Función
Crear hooks que abran tensión, deseo o autoridad en los primeros segundos.

## Tipos de hooks
### Hook de tensión
- Tu marca no necesita publicar más. Necesita transmitir mejor.
- El problema no es tu diseño. Es la percepción que está construyendo.
- Si tu contenido no convierte, probablemente no tiene promesa repetible.

### Hook de autoridad
- Una marca premium no se explica primero. Se siente primero.
- La diferencia entre estética y estrategia está en la repetición.
- La confianza se diseña antes de vender.

### Hook de deseo
- Imagina que tu marca se sintiera premium antes de decir una palabra.
- Tu cliente decide antes de leer todo.
- Lo que se percibe bien, se vende mejor.

### Hook de contradicción
- Más contenido no siempre significa más autoridad.
- Un logo bonito no construye una marca.
- La estética sin sistema se olvida rápido.

### Hook de diagnóstico
- Si tu feed parece bonito pero no vende, revisa esto.
- Si tu marca cambia de estilo cada semana, hay un problema de identidad.
- Si tu cliente no entiende rápido tu valor, hay fricción de percepción.

## Fórmula base
Tensión clara + promesa de claridad + resultado deseado.

## Regla
El hook debe abrir una conversación, no solo llamar la atención.
"""


def generate_carousel_engine() -> str:
    return """
# 04_CAROUSEL_ENGINE

## Función
Crear carruseles que expliquen, eduquen, prueben y conviertan.

## Estructura principal
1. Portada: promesa fuerte.
2. Tensión: problema o error.
3. Insight: nueva forma de ver.
4. Sistema: método/framework.
5. Prueba: evidencia o ejemplo.
6. Transformación: beneficio claro.
7. CTA: acción directa.

## Tipos de carrusel
### Carrusel educativo
Objetivo: enseñar un concepto y demostrar criterio.

### Carrusel diagnóstico
Objetivo: mostrar errores y abrir necesidad.

### Carrusel de autoridad
Objetivo: posicionar método, visión o experiencia.

### Carrusel de prueba
Objetivo: reducir incertidumbre.

### Carrusel de conversión
Objetivo: llevar a DM, reserva, consulta o diagnóstico.

## Reglas visuales
- Formato 4:5.
- Texto grande.
- Una idea por slide.
- Mucho aire.
- Continuidad visual.
- Contraste alto.
- CTA final claro.

## Fórmula de portada
[Problema/Tensión] + [Transformación/Promesa]

Ejemplos:
- Tu marca no necesita más ruido. Necesita más precisión.
- De contenido disperso a sistema de percepción.
- El valor debe sentirse antes de explicarse.
"""


def generate_reels_engine() -> str:
    return """
# 05_REELS_ENGINE

## Función
Crear reels con narrativa rápida, dirección visual y objetivo comercial.

## Estructura base de reel
### 0–2s Hook
Abrir tensión, deseo o contradicción.

### 2–5s Contexto
Explicar por qué importa.

### 5–9s Sistema
Mostrar método, idea o transformación.

### 9–12s Prueba
Evidencia, ejemplo, caso o criterio.

### 12–15s CTA
Acción clara.

## Tipos de reels
### Reel manifiesto
Frase fuerte + visual premium + CTA suave.

### Reel educativo
Hook + insight + mini framework.

### Reel proceso
Antes/durante/después de una transformación.

### Reel prueba
Resultado, testimonio, caso o comparativo.

### Reel oferta
Problema + solución + CTA directo.

## Dirección visual
- Ritmo cinematográfico.
- Movimiento controlado.
- Tipografía editorial.
- Foco único.
- Contraste premium.
- No usar efectos de plantilla.

## CTA para reels
- Comenta “OS”.
- Mándame “MARCA”.
- Agenda un diagnóstico.
- Quieres que analice tu marca?
- Escribe “SISTEMA”.
"""


def generate_stories_engine() -> str:
    return """
# 06_STORIES_ENGINE

## Función
Crear secuencias de stories que muevan contexto, deseo, confianza y acción.

## Secuencia base de 5 stories
### Story 1 — Contexto
Mostrar situación o tensión.

### Story 2 — Insight
Explicar una idea clara.

### Story 3 — Prueba
Mostrar evidencia, proceso o ejemplo.

### Story 4 — Deseo
Mostrar transformación o beneficio.

### Story 5 — CTA
Invitar a responder, agendar, reservar o pedir diagnóstico.

## Tipos de stories
- Encuesta.
- Pregunta.
- Detrás de escena.
- Prueba social.
- Mini caso.
- Oferta.
- Cuenta regresiva.
- Testimonio.

## Reglas
- Texto breve.
- Visual claro.
- CTA simple.
- No saturar.
- Mantener tono cercano y seguro.
"""


def generate_cta_engine() -> str:
    return """
# 07_CTA_ENGINE

## Función
Crear llamadas a la acción según etapa del funnel.

## CTA suave
Para awareness/interés:
- Guarda esto si estás construyendo una marca.
- Comparte con alguien que necesita ordenar su comunicación.
- Comenta “OS” si quieres ver cómo funciona.

## CTA medio
Para confianza/deseo:
- Escríbeme “MARCA” y te digo por dónde empezar.
- Mándame tu Instagram y analizamos tu percepción.
- Responde esta story y te mando una idea.

## CTA fuerte
Para conversión:
- Agenda un diagnóstico.
- Solicita tu Brand Experience OS.
- Escríbeme para crear el sistema de tu marca.
- Reserva una consultoría estratégica.

## Regla
El CTA debe ser claro, único y proporcional al nivel de confianza construido.
"""


def generate_campaign_engine() -> str:
    return """
# 08_CAMPAIGN_ENGINE

## Función
Crear campañas completas con narrativa, contenido y conversión.

## Estructura de campaña
### 1. Big idea
La idea madre que conecta todo.

### 2. Tensión
El problema emocional/comercial que abre la campaña.

### 3. Promesa
La transformación clara.

### 4. Pilares
Autoridad, deseo, prueba y conversión.

### 5. Formatos
Reels, carruseles, stories, posts, emails, landing.

### 6. Secuencia
Orden lógico de publicación.

### 7. CTA
Acción principal.

## Campaña de 7 días
Día 1: Manifiesto / tensión.
Día 2: Insight educativo.
Día 3: Framework.
Día 4: Prueba / proceso.
Día 5: Deseo / transformación.
Día 6: Objeciones.
Día 7: CTA fuerte.

## Campaña de 30 días
Semana 1: Percepción y tensión.
Semana 2: Autoridad y sistema.
Semana 3: Prueba y deseo.
Semana 4: Conversión y oferta.

## Regla
Una campaña no es un conjunto de posts. Es una secuencia de percepción.
"""


def generate_calendar_engine() -> str:
    return """
# 09_CONTENT_CALENDAR_ENGINE

## Función
Crear calendarios de contenido coherentes con la estrategia.

## Calendario semanal base
### Lunes — Autoridad
Insight, framework o análisis.

### Martes — Deseo
Visual aspiracional, transformación o experiencia.

### Miércoles — Prueba
Caso, proceso, evidencia o testimonio.

### Jueves — Educación
Carrusel explicativo o reel framework.

### Viernes — Conversión
Oferta, diagnóstico, CTA o invitación.

### Sábado — Cercanía
Story, detrás de escena, reflexión o proceso.

### Domingo — Manifiesto
Visión, valores, frase de autoridad o storytelling.

## Distribución recomendada
- 40% autoridad.
- 25% deseo.
- 20% prueba.
- 15% conversión.

## Regla
No llenar calendario por llenar. Cada pieza debe cumplir una función.
"""


def generate_prompt_engine() -> str:
    return """
# 10_CONTENT_PROMPT_ENGINE

## Prompt maestro de contenido
Actúa como estratega senior de contenido, director creativo, copywriter de marca premium y especialista en funnels. Usa identity_cliente.md, BRAND_MEMORY_CORE_MASTER.md y VISUAL_DNA_ENGINE_MASTER.md como contexto obligatorio. Crea contenido que aumente claridad, autoridad, deseo, confianza y conversión. No generes piezas aisladas. Genera secuencias con lógica de percepción.

## Prompt para 30 días de contenido
Crea un calendario de 30 días para esta marca. Organiza el contenido por pilares: autoridad, deseo, prueba y conversión. Para cada día incluye formato, objetivo, hook, idea principal, visual sugerido y CTA.

## Prompt para reels
Crea 10 ideas de reels para esta marca. Cada reel debe incluir hook de 0–2 segundos, desarrollo, prueba o insight, CTA, dirección visual y texto en pantalla.

## Prompt para carrusel
Crea un carrusel 4:5 de 7 slides. Usa estructura: portada, tensión, insight, sistema, prueba, transformación y CTA. El tono debe ser premium, claro, editorial y orientado a valor percibido.

## Prompt para stories
Crea una secuencia de 5 stories que mueva al público desde contexto hasta acción. Incluir texto visual, sticker sugerido, objetivo emocional y CTA.

## Prompt para campaña
Crea una campaña de 7 días para lanzar una oferta. Incluye big idea, tensión, promesa, piezas por día, formato, hook, CTA y objetivo de cada pieza.

## Prompt para hooks
Genera 30 hooks divididos en tensión, autoridad, deseo, contradicción y diagnóstico.

## Prompt para CTA
Genera CTAs suaves, medios y fuertes según etapa del funnel.
"""


def generate_master(brand: str, modules: dict) -> str:
    joined = "\n\n---\n\n".join(modules.values())
    return f"""
# CONTENT INTELLIGENCE ENGINE — {brand}

Generado: {datetime.now().strftime("%Y-%m-%d %H:%M:%S")}

## Propósito
Este documento convierte identidad, memoria y visual DNA en un sistema de contenido, funnel y conversión.

Debe usarse para crear:
- calendarios
- reels
- carruseles
- stories
- campañas
- hooks
- CTAs
- secuencias comerciales
- contenido de autoridad
- contenido de prueba
- contenido de deseo
- contenido de conversión

## Regla principal
El contenido no debe publicarse aislado. Debe mover percepción hacia acción.

---

{joined}
"""


def generate_json(brand: str, modules: dict) -> dict:
    return {
        "brand_name": brand,
        "generated_at": datetime.now().isoformat(),
        "system": "Brand Experience OS",
        "priority": "03_CONTENT_INTELLIGENCE_ENGINE",
        "purpose": "Content, funnel and conversion engine for AI-assisted brand execution.",
        "main_rule": "Content must move perception toward action.",
        "content_logic": {
            "pillars": ["authority", "desire", "proof", "conversion"],
            "funnel": ["awareness", "interest", "trust", "desire", "action"],
            "carousel_structure": ["promise", "tension", "insight", "system", "proof", "transformation", "cta"],
            "reel_structure": ["hook", "context", "system", "proof", "cta"],
            "campaign_logic": "A campaign is a sequence of perception, not a set of isolated posts."
        },
        "modules": list(modules.keys())
    }


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--client", required=True, help="Nombre del cliente, ej: ryaanlouis")
    parser.add_argument("--root", required=True, help="Ruta CLIENTES_ACTIVOS")
    args = parser.parse_args()

    client_slug = slugify(args.client)
    root = Path(args.root)
    client_dir = root / client_slug

    if not client_dir.exists():
        print(f"ERROR: No existe la carpeta del cliente: {client_dir}")
        return

    identity_path = client_dir / "01_IDENTITY" / "identity_cliente.md"
    memory_path = client_dir / "02_MEMORY" / "BRAND_MEMORY_CORE_MASTER.md"
    visual_path = client_dir / "07_VISUAL_DNA_ENGINE" / "VISUAL_DNA_ENGINE_MASTER.md"
    memory_json_path = client_dir / "02_MEMORY" / "brand_memory_core.json"

    identity = read_file(identity_path)
    memory = read_file(memory_path)
    visual = read_file(visual_path)
    memory_json = load_json(memory_json_path)

    if not identity.strip():
        print(f"ERROR: No encontré identity_cliente.md en: {identity_path}")
        return

    if not memory.strip():
        print(f"ERROR: No encontré BRAND_MEMORY_CORE_MASTER.md en: {memory_path}")
        print("Primero ejecuta la Prioridad 1.")
        return

    if not visual.strip():
        print(f"ERROR: No encontré VISUAL_DNA_ENGINE_MASTER.md en: {visual_path}")
        print("Primero ejecuta la Prioridad 2.")
        return

    brand = memory_json.get("brand_name", args.client)

    output_dir = client_dir / "08_CONTENT_INTELLIGENCE_ENGINE"
    modules_dir = output_dir / "modules"
    modules_dir.mkdir(parents=True, exist_ok=True)

    modules = {
        "01_CONTENT_STRATEGY": generate_content_strategy(identity),
        "02_FUNNEL_SYSTEM": generate_funnel_system(),
        "03_HOOK_ENGINE": generate_hook_engine(),
        "04_CAROUSEL_ENGINE": generate_carousel_engine(),
        "05_REELS_ENGINE": generate_reels_engine(),
        "06_STORIES_ENGINE": generate_stories_engine(),
        "07_CTA_ENGINE": generate_cta_engine(),
        "08_CAMPAIGN_ENGINE": generate_campaign_engine(),
        "09_CONTENT_CALENDAR_ENGINE": generate_calendar_engine(),
        "10_CONTENT_PROMPT_ENGINE": generate_prompt_engine(),
    }

    for name, content in modules.items():
        write_file(modules_dir / f"{name}.md", content)

    write_file(output_dir / "CONTENT_INTELLIGENCE_ENGINE_MASTER.md", generate_master(brand, modules))
    write_file(output_dir / "content_intelligence_engine.json", json.dumps(generate_json(brand, modules), ensure_ascii=False, indent=2))

    readme = f"""
# CONTENT INTELLIGENCE ENGINE — {brand}

Esta carpeta contiene la Prioridad 3 del Brand Experience OS.

## Archivos principales
- CONTENT_INTELLIGENCE_ENGINE_MASTER.md
- content_intelligence_engine.json
- modules/

## Cómo usar
Antes de crear contenido o campañas, carga:

1. 01_IDENTITY/identity_cliente.md
2. 02_MEMORY/BRAND_MEMORY_CORE_MASTER.md
3. 07_VISUAL_DNA_ENGINE/VISUAL_DNA_ENGINE_MASTER.md
4. 08_CONTENT_INTELLIGENCE_ENGINE/CONTENT_INTELLIGENCE_ENGINE_MASTER.md

Después pide:
- 30 días de contenido
- 10 reels
- 1 carrusel
- 1 campaña de 7 días
- secuencia de stories
- hooks
- CTAs
"""
    write_file(output_dir / "README.md", readme)

    print("\n✅ CONTENT INTELLIGENCE ENGINE creado correctamente\n")
    print(f"Cliente: {brand}")
    print(f"Ubicación: {output_dir.resolve()}")
    print("\nArchivos clave:")
    print(f"- {output_dir / 'CONTENT_INTELLIGENCE_ENGINE_MASTER.md'}")
    print(f"- {output_dir / 'content_intelligence_engine.json'}")
    print(f"- {modules_dir}")


if __name__ == "__main__":
    main()
