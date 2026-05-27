from pathlib import Path
from datetime import datetime
import json
import shutil
import zipfile


PROJECT_ROOT = Path(__file__).resolve().parent

DOCS_DIR = PROJECT_ROOT / "docs"
EXPORTS_DIR = PROJECT_ROOT / "exports"
OUTPUT_DIR = EXPORTS_DIR / "BRAND_EXPERIENCE_CHATGPT_APP"

SYSTEM_DIR = OUTPUT_DIR / "00_SYSTEM"
CLIENT_INPUT_DIR = OUTPUT_DIR / "01_CLIENT_INPUT"
OUTPUT_TEMPLATES_DIR = OUTPUT_DIR / "02_OUTPUT_TEMPLATES"
PROMPTS_DIR = OUTPUT_DIR / "03_PROMPTS"
CLIENTS_DIR = OUTPUT_DIR / "04_CLIENTS"

MASTER_CONTEXT_SOURCE = DOCS_DIR / "BRAND_EXPERIENCE_OS_CHATGPT_CONTEXT.dm"

CLIENTES_ACTIVOS_DIR = (
    PROJECT_ROOT
    / "BRAND_EXPERIENCE"
    / "03_CLIENT_SYSTEM"
    / "CLIENTES_ACTIVOS"
)


def write_text(path: Path, content: str) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(content.strip() + "\n", encoding="utf-8")


def copy_if_exists(source: Path, destination: Path) -> bool:
    if not source.exists():
        return False

    destination.parent.mkdir(parents=True, exist_ok=True)
    shutil.copy2(source, destination)
    return True


def reset_output_dir() -> None:
    if OUTPUT_DIR.exists():
        shutil.rmtree(OUTPUT_DIR)

    for folder in [
        SYSTEM_DIR,
        CLIENT_INPUT_DIR,
        OUTPUT_TEMPLATES_DIR,
        PROMPTS_DIR,
        CLIENTS_DIR,
    ]:
        folder.mkdir(parents=True, exist_ok=True)


def create_system_files(report: dict) -> None:
    copied = copy_if_exists(
        MASTER_CONTEXT_SOURCE,
        SYSTEM_DIR / "BRAND_EXPERIENCE_OS_CHATGPT_CONTEXT.dm",
    )

    report["system_context_copied"] = copied

    write_text(
        SYSTEM_DIR / "README_SYSTEM.md",
        """
# Brand Experience OS — ChatGPT App

Este paquete contiene una versión portable del sistema Brand Experience OS para usar dentro de ChatGPT.

Uso recomendado:

1. Crear un Project en ChatGPT llamado `Brand Experience OS`.
2. Subir los archivos de `00_SYSTEM`.
3. Subir o pegar el contexto del cliente desde `01_CLIENT_INPUT` o `04_CLIENTS`.
4. Ejecutar los prompts de `03_PROMPTS`.
5. Generar entregables usando las plantillas de `02_OUTPUT_TEMPLATES`.

Este paquete está pensado para trabajar sin depender del backend local.
""",
    )

    write_text(
        SYSTEM_DIR / "VISUAL_GENERATION_MODE.dm",
        """
# VISUAL GENERATION MODE

## Regla principal

No diseñar antes de interpretar.

Antes de pedir logo, board o pieza visual, interpretar:

- entidad de marca
- energía emocional
- percepción actual
- percepción deseada
- promesa
- público
- nivel premium
- símbolos posibles
- riesgos de cliché

## Proceso

1. Interpretación estratégica
2. Dirección visual
3. Rutas creativas
4. Sistema de logo
5. Paleta cromática
6. Tipografía
7. Aplicaciones
8. Board final

## Para logos

Pedir siempre 3 rutas:

- concepto
- emoción
- símbolo
- tipografía
- paleta
- riesgos
- aplicación

Evitar:

- íconos obvios
- logos genéricos
- símbolos cliché
- demasiados elementos
- baja legibilidad
- estética barata o stock

## Para boards

El board debe ser:

- horizontal 16:9
- premium
- editorial
- modular
- con jerarquía fuerte
- con aire visual
- con mockups
- con módulos de distinta escala

Evitar:

- cards simples repetidas
- layout plano
- presentación corporativa genérica
- saturación visual
- estética stock
""",
    )


def create_client_input_templates() -> None:
    write_text(
        CLIENT_INPUT_DIR / "CLIENT_INTAKE_TEMPLATE.md",
        """
# CLIENT INTAKE TEMPLATE

## Cliente

Nombre:

Industria:

Ubicación:

Instagram:

Links:

## Contexto

¿Qué vende?

¿A quién le vende?

¿Qué problema resuelve?

¿Qué quiere lograr?

## Estado actual

¿Qué tiene hoy?

- Logo:
- Instagram:
- Web:
- Material comercial:
- Fotos/videos:
- Testimonios:

## Problemas percibidos

- 
- 
- 

## Objetivo del análisis

- 
- 
- 

## Notas adicionales

Pegar aquí transcripción, mensajes, brief o contexto.
""",
    )

    write_text(
        CLIENT_INPUT_DIR / "IDENTITY_CLIENTE_TEMPLATE.md",
        """
# IDENTITY CLIENTE — {CLIENT_NAME}

## Instrucción inicial

Este documento es el contexto maestro de identidad para trabajar esta marca dentro de ChatGPT.

## Perfil del cliente

## Diagnóstico actual

## Lectura de entidad

## Núcleo de marca

## Público ideal

## Tono de voz

## Dirección visual

## Logo System Direction

## Storytelling

## Contenido

## Objetivo creativo

## Instrucción final para ChatGPT

Actúa como director creativo senior, estratega de marca, diseñador de identidad visual premium y especialista en storytelling. Usa todo este documento como contexto maestro del cliente.
""",
    )

    write_text(
        CLIENT_INPUT_DIR / "MANUAL_FRAMEWORK_ANALYSIS_TEMPLATE.md",
        """
# MANUAL FRAMEWORK ANALYSIS — {CLIENT_NAME}

## 1. Contexto maestro

## 2. Diagnóstico estratégico

## 3. Identidad de marca

## 4. Percepción deseada

## 5. Universo visual

## 6. Paleta oficial

## 7. Fotografía y composición

## 8. Sistema de logo

## 9. Storytelling

## 10. Estrategia de contenido

## 11. Dirección comercial

## 12. Prompts base

## 13. Próximo sprint

## 14. Decisión final de dirección
""",
    )


def create_output_templates() -> None:
    templates = {
        "MASTER_BRAND_EXPERIENCE_TEMPLATE.md": """
# MASTER BRAND EXPERIENCE — {CLIENT_NAME}

## Portada

## Índice

## Diagnóstico Ejecutivo

## Lectura de Entidad

## Núcleo Identitario

## Percepción y Posicionamiento

## Universo Visual

## Tono de Marca

## Storytelling

## Estrategia de Contenido

## Dirección Comercial

## Prompt Pack

## Plan de Acción

## Próximo Sprint
""",
        "LOGO_SYSTEM_TEMPLATE.md": """
# LOGO SYSTEM — {CLIENT_NAME}

## Dirección conceptual

## Rutas creativas

### Ruta 1

### Ruta 2

### Ruta 3

## Logo principal

## Versión horizontal

## Versión compacta

## Isotipo / símbolo

## Monocromo

## Fondo claro

## Fondo oscuro

## Reglas de uso

## Qué evitar
""",
        "COLOR_PALETTE_TEMPLATE.md": """
# COLOR PALETTE — {CLIENT_NAME}

## Dirección cromática

## Color principal

## Colores secundarios

## Colores de acento

## Neutros

## Regla de uso porcentual

## Significado emocional

## Combinaciones recomendadas

## Qué evitar
""",
        "TONE_OF_BRAND_TEMPLATE.md": """
# TONE OF BRAND — {CLIENT_NAME}

## Personalidad verbal

## Voz

## Tono

## Palabras que sí usa

## Palabras que evita

## Frases modelo

## Tono Instagram

## Tono WhatsApp

## Tono comercial
""",
        "CONTENT_STRATEGY_TEMPLATE.md": """
# CONTENT STRATEGY — {CLIENT_NAME}

## Arquitectura de contenido

## Pilares

## Reels

## Carruseles

## Stories

## Prueba social

## Conversión

## Calendario semanal

## CTA
""",
        "WHATSAPP_SALES_TEMPLATE.md": """
# WHATSAPP SALES SYSTEM — {CLIENT_NAME}

## Mensaje de bienvenida

## Pedido de datos

## Presentación de oferta

## Objeción: precio

## Objeción: confianza

## Objeción: lo veo después

## Cierre

## Seguimiento

## Post-tour / testimonio
""",
        "PROMPT_PACK_TEMPLATE.md": """
# PROMPT PACK — {CLIENT_NAME}

## Prompt maestro

## Logo system prompt

## Color palette prompt

## Tone of brand prompt

## Brand identity board prompt

## Storytelling board prompt

## Visual universe board prompt

## Instagram feed prompt

## Commercial proposal prompt
""",
    }

    for filename, content in templates.items():
        write_text(OUTPUT_TEMPLATES_DIR / filename, content)


def create_prompts() -> None:
    prompts = {
        "01_RUN_FRAMEWORK_PROMPT.md": """
# RUN FRAMEWORK PROMPT

Lee `BRAND_EXPERIENCE_OS_CHATGPT_CONTEXT.dm` como sistema operativo de Brand Experience OS.

Luego lee el contexto del cliente.

Ejecuta el framework completo para este cliente usando:

- Entity Bible
- sistema de agentes
- pipeline de análisis
- reglas de percepción
- modo de generación visual
- output contract

No respondas como asistente genérico.
No hagas marketing superficial.
No inventes información no provista.

Entrega:

1. Executive Diagnosis
2. Scorecard
3. Entity Reading
4. Brand Core
5. Perception Strategy
6. Visual Direction
7. Tone of Brand
8. Storytelling
9. Content Strategy
10. Sales Direction
11. Prompt Pack Seeds
12. Next Sprint
""",
        "02_GENERATE_MASTER_PROMPT.md": """
# GENERATE MASTER PROMPT

Usa el análisis manual del cliente y conviértelo en un documento maestro de Brand Experience.

Debe ser claro, premium, ordenado y accionable.

Genera:

- portada
- diagnóstico
- lectura de entidad
- núcleo identitario
- percepción
- universo visual
- tono
- storytelling
- contenido
- dirección comercial
- prompts
- próximo sprint
""",
        "03_GENERATE_LOGO_SYSTEM_PROMPT.md": """
# GENERATE LOGO SYSTEM PROMPT

Usa el análisis del cliente para crear un sistema de logo.

Antes de diseñar, propone 3 rutas creativas.

Para cada ruta incluye:

- concepto
- emoción
- símbolo
- tipografía
- paleta
- riesgos
- aplicaciones

Después recomienda una ruta principal.
""",
        "04_GENERATE_COLOR_PALETTE_PROMPT.md": """
# GENERATE COLOR PALETTE PROMPT

Usa el análisis del cliente para definir una paleta cromática completa.

Incluye:

- color principal
- secundarios
- acentos
- neutros
- regla porcentual
- significado emocional
- combinaciones
- qué evitar
""",
        "05_GENERATE_TONE_PROMPT.md": """
# GENERATE TONE OF BRAND PROMPT

Usa el análisis del cliente para definir tono de marca.

Incluye:

- personalidad
- voz
- tono
- palabras que sí usa
- palabras que evita
- frases modelo
- tono Instagram
- tono WhatsApp
- tono comercial
""",
        "06_GENERATE_VISUAL_BOARD_PROMPT.md": """
# GENERATE VISUAL BOARD PROMPT

Usa el análisis del cliente para crear un prompt de visual identity board premium.

Debe incluir:

- logo
- variantes
- paleta
- tipografías
- tono
- aplicaciones digitales
- feed Instagram
- propuesta comercial
- beneficios
- footer conceptual

Formato: horizontal 16:9, editorial, premium, modular, con jerarquía fuerte.
""",
        "07_GENERATE_CONTENT_SYSTEM_PROMPT.md": """
# GENERATE CONTENT SYSTEM PROMPT

Usa el análisis del cliente para crear un sistema de contenido.

Incluye:

- pilares
- 12 ideas de posts
- 8 ideas de reels
- 5 carruseles educativos
- 5 secuencias de stories
- CTA
- tono por formato
- dirección visual de portadas
""",
    }

    for filename, content in prompts.items():
        write_text(PROMPTS_DIR / filename, content)


def copy_client_manual_analysis(report: dict) -> None:
    if not CLIENTES_ACTIVOS_DIR.exists():
        report["clients_copied"] = []
        return

    copied_clients = []

    for client_dir in sorted(CLIENTES_ACTIVOS_DIR.iterdir()):
        if not client_dir.is_dir():
            continue

        analysis_dir = (
            client_dir
            / "01_DIAGNOSTICO_ACTUAL"
            / "Analisis_Brand_Experience"
        )

        entregas_dir = client_dir / "05_ENTREGAS" / "prompt_pack"

        output_client_dir = CLIENTS_DIR / client_dir.name
        copied_any = False

        manual_analysis = analysis_dir / "MANUAL_FRAMEWORK_ANALYSIS.md"
        latest_md = analysis_dir / "LATEST_ANALYSIS.md"
        identity_cliente = entregas_dir / "identity_cliente.md"
        full_prompt_pack = entregas_dir / "full_brand_experience_prompt_pack.md"

        files_to_copy = [
            (manual_analysis, "MANUAL_FRAMEWORK_ANALYSIS.md"),
            (latest_md, "LATEST_ANALYSIS.md"),
            (identity_cliente, "identity_cliente.md"),
            (full_prompt_pack, "full_brand_experience_prompt_pack.md"),
        ]

        for source, filename in files_to_copy:
            if copy_if_exists(source, output_client_dir / filename):
                copied_any = True

        if copied_any:
            copied_clients.append(client_dir.name)

    report["clients_copied"] = copied_clients


def create_readme() -> None:
    write_text(
        OUTPUT_DIR / "README.md",
        """
# BRAND EXPERIENCE CHATGPT APP

Este paquete exporta Brand Experience OS para trabajar dentro de ChatGPT.

## Estructura

- `00_SYSTEM`: sistema operativo, contexto maestro y modo visual.
- `01_CLIENT_INPUT`: plantillas para cargar clientes.
- `02_OUTPUT_TEMPLATES`: plantillas de entregables.
- `03_PROMPTS`: prompts maestros para ejecutar el sistema.
- `04_CLIENTS`: clientes exportados desde la app local, si existen.

## Flujo recomendado

1. Subí `00_SYSTEM/BRAND_EXPERIENCE_OS_CHATGPT_CONTEXT.dm` a un Project de ChatGPT.
2. Subí o pegá el contexto del cliente.
3. Ejecutá `03_PROMPTS/01_RUN_FRAMEWORK_PROMPT.md`.
4. Guardá el resultado como `MANUAL_FRAMEWORK_ANALYSIS.md`.
5. Usá los prompts siguientes para generar Master, logo system, paleta, tono, visual board y contenido.

## Filosofía

La app local organiza.
ChatGPT interpreta.
El resultado vuelve como análisis maestro.
""",
    )


def make_zip(report: dict) -> Path:
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    zip_path = EXPORTS_DIR / f"BRAND_EXPERIENCE_CHATGPT_APP_{timestamp}.zip"

    with zipfile.ZipFile(zip_path, "w", compression=zipfile.ZIP_DEFLATED) as zf:
        for path in OUTPUT_DIR.rglob("*"):
            if path.is_file():
                zf.write(path, path.relative_to(EXPORTS_DIR))

    report["zip_path"] = str(zip_path.relative_to(PROJECT_ROOT))
    return zip_path


def write_report(report: dict) -> None:
    report_path = OUTPUT_DIR / "EXPORT_REPORT.json"
    report_path.write_text(json.dumps(report, indent=2, ensure_ascii=False), encoding="utf-8")

    md = [
        "# EXPORT REPORT",
        "",
        f"- Generated at: `{report['generated_at']}`",
        f"- Output dir: `{report['output_dir']}`",
        f"- Zip: `{report.get('zip_path')}`",
        "",
        "## Clients copied",
        "",
    ]

    for client in report.get("clients_copied", []):
        md.append(f"- {client}")

    write_text(OUTPUT_DIR / "EXPORT_REPORT.md", "\n".join(md))


def main() -> None:
    EXPORTS_DIR.mkdir(parents=True, exist_ok=True)

    report = {
        "generated_at": datetime.now().isoformat(timespec="seconds"),
        "project_root": str(PROJECT_ROOT),
        "output_dir": str(OUTPUT_DIR.relative_to(PROJECT_ROOT)),
    }

    reset_output_dir()

    create_system_files(report)
    create_client_input_templates()
    create_output_templates()
    create_prompts()
    copy_client_manual_analysis(report)
    create_readme()

    zip_path = make_zip(report)
    write_report(report)

    print("Export listo:")
    print(f"- Carpeta: {OUTPUT_DIR}")
    print(f"- ZIP: {zip_path}")
    print("")
    print("Siguiente paso:")
    print("Subí el ZIP o los archivos principales a un Project de ChatGPT llamado Brand Experience OS.")


if __name__ == "__main__":
    main()