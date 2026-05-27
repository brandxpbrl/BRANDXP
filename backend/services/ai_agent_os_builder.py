import json
from datetime import datetime
from pathlib import Path


BASE_DIR = Path(__file__).resolve().parents[1]
PROJECT_ROOT = BASE_DIR.parent
CLIENTS_ROOT = PROJECT_ROOT / "BRAND_EXPERIENCE" / "03_CLIENT_SYSTEM" / "CLIENTES_ACTIVOS"


def _resolve_client_path(client_name):
    safe_name = (client_name or "").strip()

    if not safe_name or not CLIENTS_ROOT.exists():
        return None, None

    for candidate in CLIENTS_ROOT.iterdir():
        if candidate.is_dir() and candidate.name.casefold() == safe_name.casefold():
            return candidate.name, candidate

    return safe_name, None


def _read_file(path):
    try:
        return path.read_text(encoding="utf-8", errors="ignore")
    except OSError:
        return ""


def _write_file(path, content):
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(content.strip() + "\n", encoding="utf-8")


def _load_json(path):
    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError):
        return {}


def _require_file(path, label):
    content = _read_file(path)

    if not content.strip():
        raise ValueError(f"Falta {label}. Ejecuta las prioridades anteriores antes de generar AI Agent OS.")

    return content


def _brand_name(client_name, client_path):
    memory_json = _load_json(client_path / "02_MEMORY" / "brand_memory_core.json")
    return memory_json.get("brand_name") or client_name


def _module_orchestration(brand):
    return f"""
# 01_ORCHESTRATION_SYSTEM

## Funcion
Define como debe operar el sistema multiagente para {brand}.

## Principio central
Los agentes no deben responder como voces aisladas. Deben funcionar como un equipo de especialistas coordinados por una misma memoria de marca.

## Orden operativo
1. Leer Brand Memory Core.
2. Leer Visual DNA Engine.
3. Leer Content Intelligence Engine.
4. Interpretar el pedido del usuario.
5. Activar solo la especialidad necesaria.
6. Entregar diagnostico, decision y siguiente accion.

## Regla de coordinacion
Cada agente debe aportar desde su disciplina sin repetir al resto.

## Sintesis final
La sintesis debe conservar la especialidad de cada agente y convertirla en direccion ejecutable.
"""


def _module_agent_roles(brand):
    return f"""
# 02_AGENT_ROLES

## Funcion
Define el rol de cada agente dentro del sistema de {brand}.

## Branding Agent
Revela identidad, promesa, posicionamiento, codigos de marca y coherencia general.

## Strategy Agent
Prioriza decisiones, ordena oportunidades, detecta brechas y define secuencia de crecimiento.

## Psychology Agent
Lee deseos, objeciones, confianza, percepcion, tension emocional y barreras de decision.

## Cinematic Director Agent
Traduce identidad en atmosfera, composicion, ritmo, luz, simbolos y presencia visual.

## Content Agent
Convierte estrategia en pilares, formatos, hooks, calendarios y secuencias narrativas.

## Instagram Audit Agent
Evalua perfil, feed, bio, claridad visual, conversion social y consistencia publica.

## Sales Agent
Convierte percepcion en oferta, CTA, propuesta comercial, objeciones resueltas y cierre.

## Regla
Cada agente debe responder desde su rol. Si una respuesta podria venir de cualquier agente, no es suficientemente especializada.
"""


def _module_behavior_rules():
    return """
# 03_AGENT_BEHAVIOR_RULES

## Funcion
Define comportamiento, limites y calidad minima de respuesta.

## Reglas obligatorias
- Analizar antes de crear.
- Usar evidencia del cliente antes de recomendar.
- No generar contenido generico.
- No repetir la misma conclusion con palabras distintas.
- Separar diagnostico, riesgo y accion.
- Respetar la memoria del cliente como fuente primaria.
- Mantener claridad estrategica aunque el lenguaje sea premium.

## Conductas prohibidas
- Inventar assets que no fueron generados.
- Contradecir el Brand Memory Core.
- Ignorar restricciones visuales.
- Sugerir contenido aislado sin sistema.
- Responder como agencia tradicional.

## Calidad minima
Toda salida debe incluir:
- senal usada
- interpretacion especialista
- riesgo si se ignora
- proximo paso claro
"""


def _module_context_routing():
    return """
# 04_CONTEXT_ROUTING

## Funcion
Define que contexto debe leer cada tipo de tarea.

## Si el pedido es identidad
Cargar:
- Brand Memory Core
- 01_ENTITY_CORE
- 03_SYMBOL_SYSTEM
- 05_STORY_ENGINE

## Si el pedido es visual
Cargar:
- Brand Memory Core
- Visual DNA Engine
- Composition Rules
- Visual Signature
- Forbidden Visuals

## Si el pedido es contenido
Cargar:
- Brand Memory Core
- Content Intelligence Engine
- Funnel System
- Hook Engine
- CTA Engine

## Si el pedido es comercial
Cargar:
- Brand Memory Core
- Content Intelligence Engine
- Sales Agent
- CTA Engine
- oferta, objeciones y prueba

## Si el pedido es sintesis
Cargar:
- todos los outputs de agentes
- memoria del cliente
- estado actual del sistema

## Regla
No todos los archivos deben cargarse siempre. El contexto debe ser suficiente, no obeso.
"""


def _module_output_protocol():
    return """
# 05_OUTPUT_PROTOCOL

## Funcion
Define como deben entregarse resultados multiagente.

## Estructura base
1. Diagnostico especialista.
2. Senales utilizadas.
3. Decision recomendada.
4. Riesgo si no se ejecuta.
5. Output concreto.
6. Proximo paso.

## Para respuestas multiagente
La sintesis debe mostrar:
- que detecto cada especialidad
- donde coinciden
- donde difieren
- decision final
- secuencia ejecutable

## Para outputs visuales
Incluir:
- intencion visual
- composicion
- paleta
- tipografia
- atmosfera
- restricciones
- prompt final si aplica

## Para contenido
Incluir:
- objetivo de percepcion
- etapa del funnel
- formato
- hook
- desarrollo
- CTA
"""


def _generate_master(brand, modules):
    body = "\n\n---\n\n".join(modules.values())
    return f"""
# AI AGENT OS — {brand}

Generado: {datetime.now().strftime("%Y-%m-%d %H:%M:%S")}

## Proposito
Esta capa convierte la memoria, el ADN visual y la inteligencia de contenido en reglas operativas para agentes IA.

Debe usarse para:
- orquestacion multiagente
- respuestas especializadas
- rutas de contexto
- protocolos de output
- diagnosticos por agente
- sintesis ejecutiva

## Regla principal
Los agentes no son asistentes genericos. Son especialistas coordinados por la memoria viva del cliente.

---

{body}
"""


def _generate_json(brand, modules):
    return {
        "brand_name": brand,
        "generated_at": datetime.now().isoformat(),
        "system": "Brand Experience OS",
        "priority": "04_AI_AGENT_OS",
        "purpose": "Agent operating system for client-specific multi-agent orchestration.",
        "main_rule": "Agents must operate as coordinated specialists, not generic assistants.",
        "agent_logic": {
            "context_order": [
                "brand_memory_core",
                "visual_dna_engine",
                "content_intelligence_engine",
                "ai_agent_os",
            ],
            "specialist_rule": "Each agent must think, diagnose and deliver from its own discipline.",
            "synthesis_rule": "The orchestrator must preserve specialist differences while producing one executable direction.",
        },
        "modules": list(modules.keys()),
    }


def _generate_readme(brand):
    return f"""
# AI AGENT OS — {brand}

Esta carpeta contiene la Prioridad 4 del Brand Experience OS.

## Archivos principales
- AI_AGENT_OS_MASTER.md
- ai_agent_os.json
- modules/

## Como usar
Antes de ejecutar respuestas multiagente avanzadas, cargar:

1. 02_MEMORY/BRAND_MEMORY_CORE_MASTER.md
2. 07_VISUAL_DNA_ENGINE/VISUAL_DNA_ENGINE_MASTER.md
3. 08_CONTENT_INTELLIGENCE_ENGINE/CONTENT_INTELLIGENCE_ENGINE_MASTER.md
4. 09_AI_AGENT_OS/AI_AGENT_OS_MASTER.md

## Funcion
Define roles, comportamiento, rutas de contexto y estructura de salida para que los agentes trabajen como un equipo real de especialistas.
"""


def generate_ai_agent_os(client_name):
    resolved_client_name, client_path = _resolve_client_path(client_name)

    if not client_path:
        return None

    _require_file(client_path / "02_MEMORY" / "BRAND_MEMORY_CORE_MASTER.md", "Brand Memory Core")
    _require_file(client_path / "07_VISUAL_DNA_ENGINE" / "VISUAL_DNA_ENGINE_MASTER.md", "Visual DNA Engine")
    _require_file(
        client_path / "08_CONTENT_INTELLIGENCE_ENGINE" / "CONTENT_INTELLIGENCE_ENGINE_MASTER.md",
        "Content Intelligence Engine",
    )

    brand = _brand_name(resolved_client_name, client_path)
    output_dir = client_path / "09_AI_AGENT_OS"
    modules_dir = output_dir / "modules"

    modules = {
        "01_ORCHESTRATION_SYSTEM": _module_orchestration(brand),
        "02_AGENT_ROLES": _module_agent_roles(brand),
        "03_AGENT_BEHAVIOR_RULES": _module_behavior_rules(),
        "04_CONTEXT_ROUTING": _module_context_routing(),
        "05_OUTPUT_PROTOCOL": _module_output_protocol(),
    }

    for name, content in modules.items():
        _write_file(modules_dir / f"{name}.md", content)

    _write_file(output_dir / "AI_AGENT_OS_MASTER.md", _generate_master(brand, modules))
    _write_file(output_dir / "ai_agent_os.json", json.dumps(_generate_json(brand, modules), ensure_ascii=False, indent=2))
    _write_file(output_dir / "README.md", _generate_readme(brand))

    created = [
        (output_dir / "AI_AGENT_OS_MASTER.md").relative_to(client_path).as_posix(),
        (output_dir / "ai_agent_os.json").relative_to(client_path).as_posix(),
        (output_dir / "README.md").relative_to(client_path).as_posix(),
    ] + [(modules_dir / f"{name}.md").relative_to(client_path).as_posix() for name in modules]

    return {
        "client": resolved_client_name,
        "base": "09_AI_AGENT_OS",
        "created": created,
        "modules": list(modules.keys()),
    }
