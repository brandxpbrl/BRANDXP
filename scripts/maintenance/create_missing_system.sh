#!/bin/bash

# =========================================================
# BRAND EXPERIENCE — CREATE MISSING SYSTEM
# =========================================================
# ESTE SCRIPT:
# ✅ CREA CARPETAS FALTANTES
# ✅ CREA ARCHIVOS FALTANTES
# ✅ USA LOS REPORTES DEL AUDIT
# =========================================================

BASE="BRAND_EXPERIENCE"

REPORTS="$BASE/00_REPORTS"

MISSING_FOLDERS="$REPORTS/missing_folders.txt"
MISSING_FILES="$REPORTS/missing_files.txt"

echo "🚀 Creando sistema faltante..."

# =========================================================
# CREAR CARPETAS
# =========================================================

while IFS= read -r line
do

    FOLDER=$(echo "$line" | sed 's/❌ FALTA: //')

    if [ ! -z "$FOLDER" ]; then

        mkdir -p "$BASE/$FOLDER"

        echo "📁 Carpeta creada: $FOLDER"

    fi

done < "$MISSING_FOLDERS"

# =========================================================
# CREAR ARCHIVOS
# =========================================================

while IFS= read -r line
do

    FILE=$(echo "$line" | sed 's/❌ FALTA: //')

    if [ ! -z "$FILE" ]; then

        touch "$BASE/$FILE"

        echo "📄 Archivo creado: $FILE"

    fi

done < "$MISSING_FILES"

echo ""
echo "✅ Sistema faltante creado correctamente."
echo "🚀 Brand Experience actualizado."