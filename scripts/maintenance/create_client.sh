#!/bin/bash

# =========================================================
# BRAND EXPERIENCE — SMART CLIENT GENERATOR V3.1 (FIXED)
# =========================================================

# 1. Validar si se ingresó el nombre
if [ -z "$1" ]; then
  echo "❌ Error: Debes ingresar el nombre del cliente."
  echo 'Ejemplo: ./create_client.sh "Isa Tours"'
  exit 1
fi

CLIENT_NAME="$1"
# Definimos la ruta raíz basándonos en tu estructura
ROOT="BRAND_EXPERIENCE/03_CLIENT_SYSTEM/CLIENTES_ACTIVOS"
CLIENT_PATH="$ROOT/$CLIENT_NAME"
DATE_CREATED=$(date +%Y-%m-%d)

echo "🚀 Creando infraestructura para: $CLIENT_NAME..."

# 2. CREAR TODAS LAS CARPETAS PRIMERO (Crucial para que no de error)
# Usamos comillas "$CLIENT_PATH" para que los espacios no rompan el script

mkdir -p "$CLIENT_PATH/00_ADMIN/Contratos"
mkdir -p "$CLIENT_PATH/00_ADMIN/Pagos"
mkdir -p "$CLIENT_PATH/00_ADMIN/Presupuestos"
mkdir -p "$CLIENT_PATH/00_ADMIN/Datos_Cliente"
mkdir -p "$CLIENT_PATH/00_ADMIN/Links_Accesos"

mkdir -p "$CLIENT_PATH/01_DIAGNOSTICO_ACTUAL/Instagram_Actual"
mkdir -p "$CLIENT_PATH/01_DIAGNOSTICO_ACTUAL/Logos_Actuales"
mkdir -p "$CLIENT_PATH/01_DIAGNOSTICO_ACTUAL/Material_Actual"
mkdir -p "$CLIENT_PATH/01_DIAGNOSTICO_ACTUAL/Reuniones_Zoom"
mkdir -p "$CLIENT_PATH/01_DIAGNOSTICO_ACTUAL/Analisis_Brand_Experience"

mkdir -p "$CLIENT_PATH/02_ESENCIA_DE_MARCA/Identidad"
mkdir -p "$CLIENT_PATH/02_ESENCIA_DE_MARCA/Publico_Ideal"
mkdir -p "$CLIENT_PATH/02_ESENCIA_DE_MARCA/Emociones"
mkdir -p "$CLIENT_PATH/02_ESENCIA_DE_MARCA/Universo_Visual"
mkdir -p "$CLIENT_PATH/02_ESENCIA_DE_MARCA/Storytelling"

mkdir -p "$CLIENT_PATH/03_BRAND_TRANSFORMATION"
mkdir -p "$CLIENT_PATH/04_CONTENIDO"
mkdir -p "$CLIENT_PATH/05_ENTREGAS"
mkdir -p "$CLIENT_PATH/06_REFERENCIAS"

# 3. AHORA QUE LAS CARPETAS EXISTEN, CREAMOS LOS ARCHIVOS

# A. Crear el Perfil de Datos (JSON)
JSON_FILE="$CLIENT_PATH/00_ADMIN/Datos_Cliente/client_profile.json"
cat <<EOF > "$JSON_FILE"
{
  "client_info": {
    "name": "$CLIENT_NAME",
    "date": "$DATE_CREATED",
    "status": "Discovery"
  }
}
EOF

# B. Crear el Briefing Semilla (Markdown)
MD_FILE="$CLIENT_PATH/01_DIAGNOSTICO_ACTUAL/Briefing_Semilla.md"
cat <<EOF > "$MD_FILE"
# 🎯 BRIEFING: $CLIENT_NAME
- **Fecha:** $DATE_CREATED
- **Objetivo:** - **Estilo Visual:**
EOF

echo "🧠 Sistema dinámico activado."
echo "✅ Cliente '$CLIENT_NAME' creado con éxito en $CLIENT_PATH"
# =========================================================
# GENERAR BRIEFING SEMILLA AUTOMÁTICAMENTE
# =========================================================

MD_FILE="$CLIENT_PATH/01_DIAGNOSTICO_ACTUAL/Briefing_Semilla.md"

cat <<EOF > "$MD_FILE"
# 🎯 BRIEFING DE TRANSFORMACIÓN: $CLIENT_NAME

## 1. ESTADO ACTUAL (El "Antes")
- **¿Qué vende hoy?:** - **¿Cómo se ve su Instagram hoy? (3 adjetivos):**
- **Punto de dolor principal:** (Ej: "Se ve barato", "No tiene coherencia")

## 2. LA VISIÓN (El "Después")
- **Atmosfera deseada:** (Ej: Cyberpunk Luxury, Tropical Premium)
- **Sentimiento que debe evocar:** - **Referencia de marca aspiracional:**

## 3. DIFERENCIAL "BRAND EXPERIENCE"
- **¿Cuál es el 'alma' que vamos a revelar?:**
- **Elemento cinemático clave:** (Ej: Humo, neones, cámara lenta)
EOF

echo "📝 Archivo Briefing_Semilla.md creado en 01_DIAGNOSTICO_ACTUAL"
# =========================================================
# CLIENT CONTEXT
# =========================================================

cat <<EOF > "$CLIENT_PATH/02_ESENCIA_DE_MARCA/CLIENT_CONTEXT.md"
# CLIENT CONTEXT — $CLIENT_NAME

## INFORMACIÓN GENERAL

Nombre:
$CLIENT_NAME

Industria:

Ubicación:

---

# HISTORIA

---

# PERSONALIDAD

---

# PROBLEMAS ACTUALES

---

# PERCEPCIÓN DESEADA

---

# EXPERIENCIA IDEAL

---

# UNIVERSO VISUAL

---

# PÚBLICO IDEAL

---

# EMOCIONES PRINCIPALES

---

# OBJETIVO DE TRANSFORMACIÓN
EOF

# =========================================================
# INSTAGRAM EXTRACTION
# =========================================================

cat <<EOF > "$CLIENT_PATH/01_DIAGNOSTICO_ACTUAL/INSTAGRAM_EXTRACTION.md"
# INSTAGRAM EXTRACTION

## PERSONALIDAD DETECTADA

## PERCEPCIÓN ACTUAL

## UNIVERSO VISUAL

## EMOCIONES

## PÚBLICO IDEAL

## NIVEL PREMIUM

## PROBLEMAS VISUALES

## OPORTUNIDADES

## DIRECCIÓN RECOMENDADA

## TRANSFORMACIÓN IDEAL
EOF

# =========================================================
# BRAND DIAGNOSIS
# =========================================================

cat <<EOF > "$CLIENT_PATH/02_ESENCIA_DE_MARCA/BRAND_DIAGNOSIS.md"
# BRAND DIAGNOSIS

## PROBLEMAS ACTUALES

## DESCONEXIÓN EMOCIONAL

## PROBLEMAS DE PERCEPCIÓN

## FALTA DE IDENTIDAD

## OPORTUNIDADES PREMIUM

## DIRECCIÓN RECOMENDADA
EOF

# =========================================================
# VISUAL DIRECTION
# =========================================================

cat <<EOF > "$CLIENT_PATH/02_ESENCIA_DE_MARCA/VISUAL_DIRECTION.md"
# VISUAL DIRECTION

## PALETA CROMÁTICA

## TIPOGRAFÍAS

## ATMÓSFERA

## ILUMINACIÓN

## ESTILO FOTOGRÁFICO

## ESTÉTICA CINEMATOGRÁFICA

## COMPOSICIÓN

## REFERENCIAS

## EXPERIENCIA VISUAL
EOF

# =========================================================
# EMOTIONAL POSITIONING
# =========================================================

cat <<EOF > "$CLIENT_PATH/02_ESENCIA_DE_MARCA/EMOTIONAL_POSITIONING.md"
# EMOTIONAL POSITIONING

## PERCEPCIÓN ACTUAL

## PERCEPCIÓN IDEAL

## EMOCIONES

## DIFERENCIACIÓN

## EXPERIENCIA PREMIUM

## STORYTELLING EMOCIONAL

## POSICIONAMIENTO ASPIRACIONAL
EOF

# =========================================================
# STORYTELLING
# =========================================================

cat <<EOF > "$CLIENT_PATH/02_ESENCIA_DE_MARCA/STORYTELLING.md"
# STORYTELLING

## NARRATIVA DE MARCA

## HISTORIA EMOCIONAL

## EXPERIENCIA HUMANA

## ATMÓSFERA

## MENSAJE CENTRAL

## VOZ DE MARCA

## EXPERIENCIA CINEMATOGRÁFICA
EOF

# =========================================================
# INSTAGRAM FUTURE
# =========================================================

cat <<EOF > "$CLIENT_PATH/03_BRAND_TRANSFORMATION/INSTAGRAM_FUTURE.md"
# INSTAGRAM FUTURE

## FEED IDEAL

## ESTILO VISUAL

## PORTADAS

## STORYTELLING VISUAL

## RITMO VISUAL

## DIRECCIÓN CINEMATOGRÁFICA

## EXPERIENCIA PREMIUM
EOF

# =========================================================
# TRANSFORMATION GOAL
# =========================================================

cat <<EOF > "$CLIENT_PATH/03_BRAND_TRANSFORMATION/TRANSFORMATION_GOAL.md"
# TRANSFORMATION GOAL

## ESTADO ACTUAL

## PROBLEMAS

## DESCONEXIÓN

## OBJETIVO FINAL

## NUEVA IDENTIDAD

## NUEVA PERCEPCIÓN

## EXPERIENCIA ASPIRACIONAL

## TRANSFORMACIÓN PREMIUM
EOF

echo "🧠 Sistema emocional Brand Experience generado."