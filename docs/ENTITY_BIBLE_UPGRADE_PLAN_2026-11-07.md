# Entity Bible — Plan de alteración y upgrade

## Decisión arquitectónica

Entity Bible no se conectará al runtime ORBIS como una biblioteca terminada. Antes deberá convertirse en un sistema de conocimiento versionado, trazable y gobernado.

El upgrade preservará todos los archivos actuales. No moverá, eliminará ni sobrescribirá ninguna de las tres versiones encontradas.

## Estado encontrado

| Árbol | Estado | Archivos Markdown | Uso actual |
|---|---:|---:|---|
| `BRAND_EXPERIENCE_OS/KNOWLEDGE/ENTITY_BIBLE/` | Biblioteca histórica completa | 222 | Fuente original consultada por Inteligencia integrada. |
| `backend/entity_bible/` | Selección curada | 29 | Contexto del loader tradicional del backend. |
| `entity_bible/` | Semilla mínima | 3 | Referencia histórica; no debe tratarse como fuente completa. |

La integración de septiembre de 2026 añadió búsqueda léxica y procedencia sobre la biblioteca original, pero no resolvió:

- versionado semántico;
- duplicación y contenido de plantilla;
- estado canónico de cada afirmación;
- relaciones entre conceptos;
- contradicciones;
- vigencia;
- permisos de uso;
- separación entre filosofía, método, evidencia, hipótesis y ejemplo;
- memoria de cambios y aprobaciones.

## Auditoría reproducible ejecutada

La primera ejecución del auditor v2 confirmó:

- 222 documentos inspeccionados;
- 220 documentos dominados por la plantilla común (99,1%);
- 150 secciones `Strategic Importance` sin indicadores enumerados;
- 0% de preparación semántica v2 promedio;
- 0 archivos originales modificados.

El 0% no significa que la biblioteca carezca de valor conceptual. Significa que ningún documento cumple todavía el contrato operativo completo: definición, uso, método, indicadores, preguntas, decisiones, ejemplos, límites y resultado esperado.

Artefactos de auditoría:

- `runtime/entity_bible_v2/entity_bible_v2_audit.json`
- `runtime/entity_bible_v2/entity_bible_v2_audit.md`

## Objetivo del upgrade

Transformar Entity Bible en una red de conocimiento gobernada que pueda responder:

- qué afirma;
- de dónde proviene;
- quién lo validó;
- cuándo entró en vigor;
- qué versión reemplaza;
- si es principio, método, interpretación, ejemplo o prohibición;
- qué agentes pueden utilizarlo;
- en qué decisiones fue aplicado;
- qué resultados produjo.

## Capas propuestas

### 1. Archivo histórico inmutable

Los 222 documentos originales permanecen en su ubicación actual y se identifican mediante hash. Esta capa preserva el legado; no se consume ciegamente como verdad.

### 2. Registro canónico

Un manifiesto versionado describirá cada unidad de conocimiento con:

- `knowledge_id`;
- título;
- dominio;
- tipo de conocimiento;
- estado: borrador, revisado, aprobado, deprecado o rechazado;
- fuente original y hash;
- autor o responsable;
- fecha y vigencia;
- nivel de confianza;
- alcance permitido;
- relaciones;
- contradicciones;
- versión reemplazada;
- aprobador humano.

### 3. Contenido curado

Solo los conocimientos revisados y aprobados entrarán al contexto operativo. Las copias curadas existentes se conservarán hasta completar la migración.

### 4. Motor de consulta

La consulta devolverá fragmentos junto con procedencia, estado, versión, confianza y restricciones. No devolverá texto sin contexto de autoridad.

### 5. Adaptador ORBIS

ORBIS podrá consultar Entity Bible, pero no modificar su canon directamente. Las propuestas de agentes crearán solicitudes de cambio pendientes de revisión humana.

### 6. Laboratorio aplicado MCOS

MCOS participa antes de la aprobación canónica. Su función es obligar a que cada concepto demuestre utilidad mediante transformaciones observables:

- traducción narrativa;
- comportamiento de personaje;
- escena y símbolo;
- dirección visual y cinematográfica;
- aplicación de marca;
- aplicación operativa cuando corresponda.

MCOS debe devolver diagnósticos con razones, linaje entre concepto y resultado, y comparación entre versiones. Sus outputs son pruebas y candidatos; no aprueban por sí mismos el canon.

Se adaptarán las capacidades del MCOS ejecutable de MPE sin conectar el producto a una ruta personal de OneDrive. El MCOS actualmente expuesto en `backend/services/mcos/` seguirá considerándose experimental hasta normalizar persistencia, contratos y motores reales.

## Alteraciones requeridas

1. Inventariar y calcular hash de los tres árboles.
2. Detectar duplicados exactos y similitud de plantillas.
3. Separar contenido sustantivo de relleno generado.
4. Definir la taxonomía canónica.
5. Crear manifiesto y esquema de conocimiento.
6. Clasificar los documentos existentes sin eliminarlos.
7. Establecer revisión y aprobación humana.
8. Crear historial de versiones y deprecaciones.
9. Actualizar el loader para consumir solo contenido aprobado.
10. Ejecutar pruebas aplicadas mediante MCOS y registrar linaje.
11. Someter cada unidad a revisión humana.
12. Conectar el adaptador ORBIS con procedencia completa.

## Orden actualizado de la Etapa 4

```text
Auditoría de Entity Bible
→ esquema v2
→ manifiesto e inventario
→ profundización semántica con Gravity
→ pruebas aplicadas con MCOS
→ comparación de escenarios con Possibility Lab
→ revisión y aprobación humana
→ loader v2
→ adaptador ORBIS
→ conexión con Brand Memory
```

MCOS no es solamente una salida audiovisual. En este flujo funciona como laboratorio de aplicación y coherencia. Possibility Lab compara las alternativas resultantes. Entity Bible conserva únicamente el conocimiento aprobado; Gravity analiza; ORBIS asigna responsabilidad y ejecuta.

## Frontera entre sistemas

```text
ENTITY BIBLE
Doctrina versionada y conocimiento aprobado
        ↓
GRAVITY
Análisis especializado y profundización
        ↓
MCOS
Aplicación narrativa, visual, simbólica y experiencial
        ↓
POSSIBILITY LAB
Comparación de escenarios, efectos y riesgos
        ↓
REVISIÓN HUMANA
Aprobación o rechazo del conocimiento candidato
        ↓
ORBIS
Responsabilidad, comunicación y ejecución
```

## Regla de seguridad

Ningún documento será promovido automáticamente a canon por haber sido generado, estar dentro de una carpeta llamada Entity Bible o aparecer repetido en varias copias.

## Piloto MCOS ejecutado

Se construyeron y validaron tres unidades candidatas:

| Candidato | Responsable principal | Aplicaciones MCOS | Estado |
|---|---|---|---|
| `eb-identity-before-design` | Nicolás / Nova | narrativa, personaje y marca | candidato pendiente de revisión |
| `eb-color-emotion` | Nova | visual, cinematográfica y marca | candidato pendiente de revisión |
| `eb-operational-coherence` | Lyra / Nicolás | operativa, marca y narrativa | candidato pendiente de revisión |

Los tres cumplen el contrato estructural y obtuvieron 100 puntos en la validación determinista. Ese puntaje expresa completitud para revisión, no verdad ni aprobación canónica.

Los tres fueron aprobados por Felipe Vallejo el 7 de noviembre de 2026 y promovidos al canon piloto v2. La aprobación conserva fuente histórica, hash, validación MCOS, revisor y fecha.

Rutas operativas:

- candidatos: `runtime/entity_bible_v2/candidates/`;
- validaciones y linaje: `runtime/entity_bible_v2/mcos_validations/`;
- canon aprobado: `runtime/entity_bible_v2/canon/`;
- API de revisión: `/api/entity-bible/v2/candidates`.

## Gravity y QSIM

Cada unidad canónica aprobada cuenta ahora con un paquete Gravity en `runtime/entity_bible_v2/gravity_reviews/`. El paquete respeta A23 → especialistas → neuronas → A99 → A00-B → A27-A34 → A00 y obliga a separar hecho, inferencia, hipótesis y recomendación.

El adaptador QSIM implementa conos de posibilidad, normalización de pesos declarados, entropía, índice de posibilidad y Top-K. Sus resultados siempre se etiquetan como simulación. No reutiliza las probabilidades de telemetría MPE para decisiones de marca y no produce una predicción única.
