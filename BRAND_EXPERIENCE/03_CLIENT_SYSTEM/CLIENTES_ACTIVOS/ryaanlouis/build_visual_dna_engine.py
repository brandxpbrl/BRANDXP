
#!/usr/bin/env python3
# -*- coding: utf-8 -*-

"""
BRAND EXPERIENCE OS — VISUAL DNA ENGINE BUILDER
Prioridad 2: Visual DNA Engine

Uso:
python build_visual_dna_engine.py --client ryaanlouis --root "C:\\Users\\Bela Tours\\brandexperience\\BRAND_EXPERIENCE\\03_CLIENT_SYSTEM\\CLIENTES_ACTIVOS"

Qué genera dentro del cliente:
07_VISUAL_DNA_ENGINE/
  VISUAL_DNA_ENGINE_MASTER.md
  visual_dna_engine.json
  README.md
  modules/
    01_GEOMETRY_SYSTEM.md
    02_COMPOSITION_RULES.md
    03_VISUAL_SIGNATURE.md
    04_MOTION_DNA.md
    05_INSTAGRAM_VISUAL_SYSTEM.md
    06_VISUAL_PROMPT_ENGINE.md
    07_FORBIDDEN_VISUALS.md
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


def generate_geometry_system(identity: str) -> str:
    return f"""
# 01_GEOMETRY_SYSTEM

## Función
Define la arquitectura visual de la marca: grids, proporciones, módulos, aire y estructura.

## Principio central
La geometría debe aumentar claridad, autoridad visual y valor percibido. No debe decorar.

## Base estratégica detectada
{extract_section(identity, "Direccion visual")}

## Reglas de grid
- Usar sistemas modulares.
- Mantener una zona de foco dominante.
- Trabajar con márgenes amplios.
- Usar bloques asimétricos cuando aporten tensión premium.
- Evitar layouts planos o genéricos.
- Mantener jerarquía antes de sumar elementos.

## Proporciones recomendadas
- 60/30/10 para jerarquía visual:
  - 60% espacio de atmósfera/foco.
  - 30% información secundaria.
  - 10% acento, CTA o detalle simbólico.
- En carruseles: una idea dominante por slide.
- En boards: módulos de distinta escala, no cards iguales.

## Spacing
- Usar espacio negativo como herramienta de lujo.
- Evitar que todo respire igual.
- Crear tensión entre bloques llenos y áreas silenciosas.
- Aumentar aire alrededor de frases principales.

## Formatos base
- Instagram feed: 4:5 / 1080x1350.
- Stories/Reels: 9:16 / 1080x1920.
- Brand boards: 16:9.
- Presentaciones: 16:9 premium editorial.
"""


def generate_composition_rules() -> str:
    return """
# 02_COMPOSITION_RULES

## Función
Define cómo ordenar imagen, texto, foco, contraste y profundidad.

## Reglas principales
- One clear focal point per piece.
- Usar contraste para guiar atención.
- Construir jerarquía antes de decoración.
- Usar espacio negativo para aumentar valor percibido.
- Componer con intención cinematográfica.

## Composición premium
- Foco dominante visible en menos de 1 segundo.
- Tipografía con lectura inmediata.
- Fondo con profundidad, no ruido.
- Elementos secundarios siempre subordinados.
- Acentos visuales usados con control.

## Profundidad
Usar capas:
1. Fondo atmosférico.
2. Plano medio visual.
3. Elemento principal.
4. Tipografía.
5. Detalle/acento.

## Ritmo visual
- Alternar slides de impacto con slides de explicación.
- Evitar que todos los slides tengan la misma densidad.
- Crear pausas visuales.
- Usar tensión/silencio como parte del lujo.

## Qué evitar
- Centrar todo sin intención.
- Agregar elementos para llenar.
- Usar muchos acentos al mismo tiempo.
- Sobreexplicar.
- Usar fondos que compitan con el mensaje.
"""


def generate_visual_signature(brand_name: str) -> str:
    return f"""
# 03_VISUAL_SIGNATURE

## Función
Define la firma visual propietaria de {brand_name}.

## Objetivo
Que la marca sea reconocible incluso sin logo.

## Firma visual recomendada
### Premium Cinematic Clarity
Una combinación de:
- fondo profundo
- foco único
- contraste elegante
- acento emocional controlado
- composición editorial
- sensación de silencio visual
- detalles de precisión

## Elementos propietarios
- Deep Base como atmósfera dominante.
- Signature Accent como momento emocional.
- Cool Signal como precisión moderna.
- Framing cinematográfico.
- Espacio negativo como lujo.
- Tipografía editorial con autoridad.
- Microdetalles visuales repetibles.

## Mecánica visual
Cada pieza debe sentirse como:
1. Una escena.
2. Una decisión.
3. Una promesa.
4. Una prueba de criterio.

## Patrón de reconocimiento
- Fondo oscuro o neutro profundo.
- Una frase dominante.
- Un detalle/acento de color.
- Un único elemento visual central.
- Mucho aire.
- Contraste alto.
- Sensación premium, no recargada.
"""


def generate_motion_dna() -> str:
    return """
# 04_MOTION_DNA

## Función
Define cómo se mueve la marca en video, reels, boards animados y contenido dinámico.

## Principio central
El movimiento debe parecer dirección cinematográfica, no efecto decorativo.

## Cinematic pacing
- Inicio con hook visual fuerte.
- Desarrollo con ritmo controlado.
- Microtransiciones limpias.
- Cierre con CTA claro.

## Comportamientos de cámara
- Slow push-in.
- Lateral drift.
- Focus pull.
- Parallax suave.
- Orbit sutil en objetos o interfaces.
- Cámara estable, precisa, premium.

## Movimiento tipográfico
- Aparición con delay sutil.
- Revelado por bloques.
- Fade elegante.
- Tracking controlado.
- No usar rebotes infantiles.
- No usar animaciones caóticas.

## Timing sugerido para reel
- 0–2s: impacto / tensión.
- 2–5s: insight.
- 5–9s: transformación / sistema.
- 9–12s: prueba.
- 12–15s: CTA.
"""


def generate_instagram_visual_system() -> str:
    return """
# 05_INSTAGRAM_VISUAL_SYSTEM

## Función
Define cómo debe verse la marca en Instagram.

## Feed
- Editorial.
- Premium.
- Claro.
- Aspiracional.
- Reconocible.
- Con estructuras recurrentes.

## Formatos
### Post 4:5
Uso para autoridad, manifiestos, piezas editoriales, prueba y promoción premium.

### Carrusel 4:5
Uso para explicar frameworks, mostrar transformación, educar con autoridad, presentar procesos y reducir objeciones.

### Reel 9:16
Uso para hook visual, narrativa rápida, deseo, prueba social y conversión.

### Stories 9:16
Uso para contexto, cercanía, prueba, CTA directo e interacción.

## Estructura de carrusel
1. Portada: promesa fuerte.
2. Problema: tensión.
3. Insight: claridad.
4. Sistema: método.
5. Prueba: evidencia.
6. Beneficio: transformación.
7. CTA: acción.

## Reglas visuales Instagram
- Máximo 1 idea dominante por slide.
- Texto grande y legible.
- No saturar.
- Usar alto contraste.
- Repetir códigos visuales.
- Mantener acento controlado.
- Crear sensación de campaña, no de post aislado.
"""


def generate_visual_prompt_engine() -> str:
    return """
# 06_VISUAL_PROMPT_ENGINE

## Función
Prompts maestros para generar piezas visuales coherentes con el Visual DNA Engine.

## Prompt maestro general
Actúa como director creativo senior, diseñador de identidad visual premium y director de arte cinematográfico. Usa el Brand Memory Core y el Visual DNA Engine como contexto maestro. Antes de diseñar, interpreta la entidad, la percepción deseada, la tensión visual, el nivel premium y el objetivo comercial. Genera una pieza con claridad, autoridad visual, deseo, confianza y valor percibido.

## Prompt para brand board 16:9
Crea un brand board horizontal 16:9 premium, editorial y modular. Usa una composición con jerarquía fuerte, espacio negativo, módulos de distinta escala, contraste profundo, acento controlado y sensación de sistema visual premium. Incluye hero de marca, paleta, tipografía, logo system, tono, aplicaciones, feed Instagram y propuesta comercial. No usar cards simples ni layout corporativo plano.

## Prompt para carrusel Instagram 4:5
Crea un carrusel Instagram 4:5 premium editorial. Cada slide debe tener una sola idea dominante, alto contraste, tipografía grande, espacio negativo, acento visual controlado y continuidad entre slides. La narrativa debe avanzar de tensión a transformación, prueba y acción.

## Prompt para reel 9:16
Crea un concepto visual para reel vertical 9:16 con dirección cinematográfica premium. Hook visual en los primeros 2 segundos, movimiento controlado, foco único, tipografía editorial animada con precisión, atmósfera profunda y CTA final claro.

## Prompt para campaña visual
Crea una campaña visual premium basada en percepción, deseo y confianza. Debe sentirse como sistema, no como pieza aislada. Usar composición cinematográfica, contraste, símbolo visual repetible, frase dominante y acento de color controlado.

## Negative prompt universal
generic template, stock design, cluttered composition, low contrast, cheap logo, overused icons, illegible typography, inconsistent palette, childish style, random gradients, too many effects, flat corporate layout, visual noise, cliché branding, generic startup aesthetic
"""


def generate_forbidden_visuals() -> str:
    return """
# 07_FORBIDDEN_VISUALS

## Función
Define todo lo que la marca debe evitar visualmente.

## Prohibido
- Plantillas genéricas.
- Cards corporativas básicas.
- Gradientes aleatorios.
- Iconos cliché.
- Exceso de efectos.
- Composición saturada.
- Tipografía ilegible.
- Baja jerarquía.
- Estética stock.
- Lujo falso.
- UI futurista sin criterio.
- Fondos ruidosos.
- Imágenes sin promesa.
- Piezas sin foco.
- Mezclar demasiados estilos.
- Copiar marcas existentes.

## Señales de alerta
Si una pieza se ve genérica, improvisada, decorativa, ruidosa, sin foco, sin tensión o sin sistema, debe rehacerse.

## Regla final
La estética debe servir a la percepción. Si no aumenta claridad, autoridad, deseo, confianza o recordación, debe eliminarse.
"""


def generate_master(brand: str, modules: dict) -> str:
    joined = "\n\n---\n\n".join(modules.values())
    return f"""
# VISUAL DNA ENGINE — {brand}

Generado: {datetime.now().strftime("%Y-%m-%d %H:%M:%S")}

## Propósito
Este documento convierte la memoria de marca en reglas visuales operativas.

Debe usarse antes de generar:
- boards
- logo systems
- posts
- carruseles
- reels
- campañas
- presentaciones
- landing pages
- mockups
- piezas comerciales

## Regla principal
La marca debe ser reconocible incluso sin logo.

---

{joined}
"""


def generate_json(brand: str, modules: dict) -> dict:
    return {
        "brand_name": brand,
        "generated_at": datetime.now().isoformat(),
        "system": "Brand Experience OS",
        "priority": "02_VISUAL_DNA_ENGINE",
        "purpose": "Operational visual identity rules for AI generation.",
        "main_rule": "The brand must be recognizable even without the logo.",
        "visual_logic": {
            "style": "Premium cinematic clarity",
            "composition": "One clear focal point, strong hierarchy, negative space",
            "motion": "Cinematic pacing, controlled movement, editorial timing",
            "instagram": "Editorial, premium, clear, aspirational, recognizable",
            "forbidden": "Generic templates, stock design, visual noise, low hierarchy"
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
    memory_json_path = client_dir / "02_MEMORY" / "brand_memory_core.json"

    identity = read_file(identity_path)
    memory = read_file(memory_path)
    memory_json = load_json(memory_json_path)

    if not identity.strip():
        print(f"ERROR: No encontré identity_cliente.md en: {identity_path}")
        return

    if not memory.strip():
        print(f"ERROR: No encontré BRAND_MEMORY_CORE_MASTER.md en: {memory_path}")
        print("Primero ejecuta la Prioridad 1.")
        return

    brand = memory_json.get("brand_name", args.client)

    output_dir = client_dir / "07_VISUAL_DNA_ENGINE"
    modules_dir = output_dir / "modules"
    modules_dir.mkdir(parents=True, exist_ok=True)

    modules = {
        "01_GEOMETRY_SYSTEM": generate_geometry_system(identity),
        "02_COMPOSITION_RULES": generate_composition_rules(),
        "03_VISUAL_SIGNATURE": generate_visual_signature(brand),
        "04_MOTION_DNA": generate_motion_dna(),
        "05_INSTAGRAM_VISUAL_SYSTEM": generate_instagram_visual_system(),
        "06_VISUAL_PROMPT_ENGINE": generate_visual_prompt_engine(),
        "07_FORBIDDEN_VISUALS": generate_forbidden_visuals(),
    }

    for name, content in modules.items():
        write_file(modules_dir / f"{name}.md", content)

    write_file(output_dir / "VISUAL_DNA_ENGINE_MASTER.md", generate_master(brand, modules))
    write_file(output_dir / "visual_dna_engine.json", json.dumps(generate_json(brand, modules), ensure_ascii=False, indent=2))

    readme = f"""
# VISUAL DNA ENGINE — {brand}

Esta carpeta contiene la Prioridad 2 del Brand Experience OS.

## Archivos principales
- VISUAL_DNA_ENGINE_MASTER.md
- visual_dna_engine.json
- modules/

## Cómo usar
Antes de generar cualquier pieza visual, carga:

1. 01_IDENTITY/identity_cliente.md
2. 02_MEMORY/BRAND_MEMORY_CORE_MASTER.md
3. 07_VISUAL_DNA_ENGINE/VISUAL_DNA_ENGINE_MASTER.md

Después usa el prompt específico según el output:
- brand board
- carrusel
- reel
- campaña
- logo system
- visual universe
"""
    write_file(output_dir / "README.md", readme)

    print("\n✅ VISUAL DNA ENGINE creado correctamente\n")
    print(f"Cliente: {brand}")
    print(f"Ubicación: {output_dir.resolve()}")
    print("\nArchivos clave:")
    print(f"- {output_dir / 'VISUAL_DNA_ENGINE_MASTER.md'}")
    print(f"- {output_dir / 'visual_dna_engine.json'}")
    print(f"- {modules_dir}")


if __name__ == "__main__":
    main()
