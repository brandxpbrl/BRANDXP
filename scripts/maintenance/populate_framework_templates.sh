#!/bin/bash

# =========================================================
# BRAND EXPERIENCE — FRAMEWORK TEMPLATES POPULATOR
# =========================================================
# ESTE SCRIPT:
# ✅ PUEBLA FRAMEWORK_TEMPLATES
# ✅ CREA LOS .TXT SI NO EXISTEN
# ✅ NO SOBREESCRIBE
# ✅ CONSTRUYE EL SISTEMA OPERATIVO
# =========================================================

BASE="BRAND_EXPERIENCE/FRAMEWORK_TEMPLATES"

echo "🚀 Poblando FRAMEWORK_TEMPLATES..."

# =========================================================
# FUNCIÓN
# =========================================================

create_if_empty() {

FILE="$1"
CONTENT="$2"

if [ ! -f "$FILE" ]; then

    mkdir -p "$(dirname "$FILE")"

    echo "$CONTENT" > "$FILE"

    echo "✅ Archivo creado: $FILE"

elif [ ! -s "$FILE" ]; then

    echo "$CONTENT" > "$FILE"

    echo "✅ Archivo poblado: $FILE"

else

    echo "⚠️ Ya existe contenido: $FILE"

fi

}

# =========================================================
# 01 BRAND ANALYSIS
# =========================================================

create_if_empty \
"$BASE/01_Brand_Analysis/Instagram_Analysis_Framework.txt" \
"OBJETIVO:
Descubrir la esencia real de la marca.

Analizar:
- percepción
- branding
- emociones
- storytelling
- posicionamiento
- universo visual
- experiencia digital
- instagram
- coherencia estética
- percepción premium"

create_if_empty \
"$BASE/01_Brand_Analysis/Zoom_Analysis_Framework.txt" \
"Analizar reuniones Zoom desde la metodología Brand Experience.

Extraer:
- emociones
- visión
- personalidad
- identidad emocional
- percepción deseada
- experiencia ideal"

create_if_empty \
"$BASE/01_Brand_Analysis/Perception_Analysis_Framework.txt" \
"Analizar cómo se percibe actualmente la marca y cómo debería percibirse."

# =========================================================
# 02 BRAND TRANSFORMATION
# =========================================================

create_if_empty \
"$BASE/02_Brand_Transformation/Brand_Transformation_Framework.txt" \
"Proceso Brand Experience:

1. Diagnóstico
2. Percepción actual
3. Problemas visuales
4. Descubrimiento emocional
5. Extracción de esencia
6. Universo visual
7. Sistema visual premium
8. Transformación final"

create_if_empty \
"$BASE/02_Brand_Transformation/Identity_Reveal_System.txt" \
"No diseñar una marca.

Revelar la identidad real de la marca."

# =========================================================
# 03 INSTAGRAM SYSTEMS
# =========================================================

create_if_empty \
"$BASE/03_Instagram_Systems/Instagram_Feed_System.txt" \
"El feed debe sentirse:
- cinematográfico
- premium
- emocional
- coherente"

create_if_empty \
"$BASE/03_Instagram_Systems/Reels_System.txt" \
"Sistema de reels:
- hooks emocionales
- cinematic pacing
- storytelling visual"

# =========================================================
# 04 STORYTELLING
# =========================================================

create_if_empty \
"$BASE/04_Storytelling/Manifesto_Framework.txt" \
"Toda marca debe sentirse viva."

create_if_empty \
"$BASE/04_Storytelling/Narrative_Framework.txt" \
"Construir narrativa emocional cinematográfica."

# =========================================================
# 05 CINEMATIC CONTENT
# =========================================================

create_if_empty \
"$BASE/05_Cinematic_Content/Cinematic_Reels_Framework.txt" \
"Contenido cinematic:
- slow motion
- emotional pacing
- premium atmosphere"

create_if_empty \
"$BASE/05_Cinematic_Content/Luxury_Motion_System.txt" \
"Luxury motion system:
- glow
- particles
- cinematic movement"

# =========================================================
# 06 CLIENT EXPERIENCE
# =========================================================

create_if_empty \
"$BASE/06_Client_Experience/Onboarding_System.txt" \
"La experiencia del cliente debe sentirse:
- premium
- humana
- estratégica"

create_if_empty \
"$BASE/06_Client_Experience/Client_Journey.txt" \
"Journey del cliente Brand Experience."

# =========================================================
# 07 SALES SYSTEMS
# =========================================================

create_if_empty \
"$BASE/07_Sales_Systems/Premium_Sales_Framework.txt" \
"No vender diseño.

Vender transformación."

create_if_empty \
"$BASE/07_Sales_Systems/Closing_System.txt" \
"Cierre emocional premium."

# =========================================================
# 08 PREMIUM POSITIONING
# =========================================================

create_if_empty \
"$BASE/08_Premium_Positioning/Authority_Framework.txt" \
"Las marcas premium generan percepción."

create_if_empty \
"$BASE/08_Premium_Positioning/Luxury_Positioning_System.txt" \
"Posicionamiento premium emocional."

# =========================================================
# 09 MOODBOARDS
# =========================================================

create_if_empty \
"$BASE/09_Moodboards/Cinematic_Moodboard_Template.txt" \
"Cinematic luxury moodboard system."

create_if_empty \
"$BASE/09_Moodboards/Color_Atmosphere_System.txt" \
"Deep blue + neon premium atmosphere."

# =========================================================
# 10 PRESENTATION SYSTEMS
# =========================================================

create_if_empty \
"$BASE/10_Presentation_Systems/Brandbook_Template.txt" \
"Brandbook cinematic premium structure."

create_if_empty \
"$BASE/10_Presentation_Systems/Proposal_Template.txt" \
"Premium proposal system."

# =========================================================
# 11 REELS FRAMEWORKS
# =========================================================

create_if_empty \
"$BASE/11_Reels_Frameworks/Transformation_Reel_Framework.txt" \
"Cinematic transformation reel structure."

create_if_empty \
"$BASE/11_Reels_Frameworks/Hook_System.txt" \
"Hooks emocionales para reels premium."

# =========================================================
# 12 PROMPT FRAMEWORKS
# =========================================================

create_if_empty \
"$BASE/12_Prompt_Frameworks/GPT_Framework.txt" \
"GPT prompt architecture system."

create_if_empty \
"$BASE/12_Prompt_Frameworks/Gemini_Framework.txt" \
"Gemini cinematic prompting system."

create_if_empty \
"$BASE/12_Prompt_Frameworks/Veo_Framework.txt" \
"Veo cinematic motion framework."

# =========================================================
# 13 WORKFLOWS
# =========================================================

create_if_empty \
"$BASE/13_Workflows/New_Client_Workflow.txt" \
"1. Crear cliente
2. Diagnóstico
3. Branding
4. Delivery"

create_if_empty \
"$BASE/13_Workflows/Branding_Workflow.txt" \
"Workflow oficial Brand Experience."

# =========================================================
# 14 BRAND ARCHITECTURE
# =========================================================

create_if_empty \
"$BASE/14_Brand_Architecture/Brand_Core_System.txt" \
"Brand core identity system."

create_if_empty \
"$BASE/14_Brand_Architecture/Visual_Architecture.txt" \
"Arquitectura visual cinematográfica."

# =========================================================
# 15 CONTENT SYSTEMS
# =========================================================

create_if_empty \
"$BASE/15_Content_Systems/Content_Pillars.txt" \
"Pilares de contenido cinematográfico premium."

create_if_empty \
"$BASE/15_Content_Systems/Reels_Structure.txt" \
"Estructura oficial de reels."

echo ""
echo "========================================="
echo "🚀 FRAMEWORK TEMPLATES READY"
echo "========================================="
echo ""
echo "✅ Sistema poblado."
echo "✅ Frameworks creados."
echo "✅ Templates organizados."
echo "✅ Brand OS expandido."
echo ""
echo "🚀 Brand Experience Framework System listo."
