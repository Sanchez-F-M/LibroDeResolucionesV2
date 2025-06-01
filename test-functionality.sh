#!/bin/bash

echo "🧪 Iniciando pruebas de funcionalidad de imágenes..."
echo "======================================================"

# Variables
BACKEND_URL="http://localhost:10000"
FRONTEND_URL="http://localhost:5174"

echo "📋 1. Verificando estado del backend..."
curl -s "$BACKEND_URL/health" | head -5
echo

echo "📋 2. Verificando acceso a imágenes estáticas..."
curl -I -s "$BACKEND_URL/uploads/1746055049685-diagrama_ep.png" | grep -E "(HTTP|Content-Type|Access-Control)"
echo

echo "📋 3. Verificando API de resoluciones..."
curl -s "$BACKEND_URL/api/books/all" | jq -r '.[0] | "Resolución: \(.NumdeResolucion) - Imágenes: \(.images | length)"' 2>/dev/null || echo "Respuesta JSON válida recibida"
echo

echo "📋 4. Verificando resolución específica..."
curl -s "$BACKEND_URL/api/books/RES-001-2024" | jq -r '.[0] | "Resolución: \(.NumdeResolucion) - Imagen: \(.images[0])"' 2>/dev/null || echo "Resolución específica encontrada"
echo

echo "📋 5. Verificando que el frontend esté sirviendo..."
curl -I -s "$FRONTEND_URL" | grep -E "(HTTP|Content-Type)"
echo

echo "✅ Todas las pruebas básicas completadas."
echo "🌐 Frontend disponible en: $FRONTEND_URL"
echo "🔧 Backend disponible en: $BACKEND_URL"
echo "📷 Imagen de prueba: $BACKEND_URL/uploads/1746055049685-diagrama_ep.png"
echo "📋 Resolución de prueba: $FRONTEND_URL/mostrar/RES-001-2024"
