#!/bin/bash

echo "📚 CREACIÓN DE RESOLUCIONES DE PRUEBA EN PRODUCCIÓN (Método API)"
echo "================================================================"
echo ""

BACKEND_URL="https://libro-resoluciones-api.onrender.com"

echo "🔐 1. Obteniendo token de autenticación..."
LOGIN_RESPONSE=$(curl -s -X POST ${BACKEND_URL}/api/user/login \
  -H "Content-Type: application/json" \
  -d '{"Nombre":"admin","Contrasena":"admin123"}')

TOKEN=$(echo "$LOGIN_RESPONSE" | grep -o '"token":"[^"]*"' | cut -d'"' -f4)

if [ -z "$TOKEN" ]; then
    echo "❌ Error: No se pudo obtener token de autenticación"
    echo "📋 Respuesta: $LOGIN_RESPONSE"
    exit 1
fi

echo "✅ Token obtenido exitosamente"
echo ""

echo "📊 2. Verificando estado actual..."
CURRENT_DATA=$(curl -s ${BACKEND_URL}/api/books/all)
CURRENT_COUNT=$(echo "$CURRENT_DATA" | grep -o '"NumdeResolucion"' | wc -l)
echo "📚 Resoluciones actuales: $CURRENT_COUNT"
echo ""

# Crear un archivo de texto temporal para simular archivos
echo "📄 3. Creando archivo temporal para pruebas..."
echo "Este es un documento de prueba para la resolución de producción" > temp_resolution_doc.txt

echo ""
echo "🔄 4. Intentando crear resoluciones usando el endpoint existente..."

# Intentar crear una resolución usando multipart/form-data
echo "📄 Creando resolución PROD-001-2025..."
RESPONSE1=$(curl -s -X POST ${BACKEND_URL}/api/books \
  -H "Authorization: Bearer $TOKEN" \
  -F "NumdeResolucion=PROD-001-2025" \
  -F "Asunto=Implementación de Sistema Digital de Resoluciones" \
  -F "Referencia=Decreto N° 001/2025 - Modernización Tecnológica" \
  -F "FechaCreacion=2025-06-01" \
  -F "files=@temp_resolution_doc.txt")

echo "📋 Respuesta 1: $RESPONSE1"

# Limpiar archivo temporal
rm -f temp_resolution_doc.txt

echo ""
echo "📊 5. Verificando resultado..."
FINAL_DATA=$(curl -s ${BACKEND_URL}/api/books/all)
FINAL_COUNT=$(echo "$FINAL_DATA" | grep -o '"NumdeResolucion"' | wc -l)
echo "📚 Resoluciones después del intento: $FINAL_COUNT"

if [ "$FINAL_COUNT" -gt "$CURRENT_COUNT" ]; then
    echo "✅ ¡Se creó al menos una resolución!"
    echo "🔢 Nuevas resoluciones: $(($FINAL_COUNT - $CURRENT_COUNT))"
else
    echo "⚠️  No se pudieron crear resoluciones con este método"
fi

echo ""
echo "📋 6. Datos actuales en producción:"
echo "$FINAL_DATA" | head -200

echo ""
echo "🎯 SIGUIENTE PASO:"
echo "   Si no funcionó, necesitamos crear las resoluciones manualmente"
echo "   a través de la interfaz web o esperar al despliegue del endpoint temporal"
echo ""
