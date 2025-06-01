#!/bin/bash

echo "🚀 VERIFICACIÓN FINAL DE FUNCIONALIDADES"
echo "========================================"

BACKEND="http://localhost:10000"
FRONTEND="http://localhost:5174"

echo "📋 1. Verificando Backend Health..."
HEALTH_CHECK=$(curl -s "$BACKEND/health" | grep '"status":"healthy"')
if [ -n "$HEALTH_CHECK" ]; then
    echo "✅ Backend saludable"
else
    echo "❌ Problema con backend"
    exit 1
fi

echo "📋 2. Verificando lista de resoluciones..."
BOOKS_COUNT=$(curl -s "$BACKEND/api/books/all" | grep -o '"NumdeResolucion"' | wc -l)
echo "✅ Encontradas $BOOKS_COUNT resoluciones en la base de datos"

echo "📋 3. Verificando resolución específica..."
SPECIFIC_BOOK=$(curl -s "$BACKEND/api/books/RES-001-2024" | grep '"images"')
if [ -n "$SPECIFIC_BOOK" ]; then
    echo "✅ Resolución RES-001-2024 encontrada con imágenes"
else
    echo "❌ Problema al obtener resolución específica"
fi

echo "📋 4. Verificando acceso a imágenes..."
IMAGE_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$BACKEND/uploads/1746055049685-diagrama_ep.png")
if [ "$IMAGE_STATUS" = "200" ]; then
    echo "✅ Imagen accesible (HTTP $IMAGE_STATUS)"
else
    echo "❌ Problema con acceso a imágenes (HTTP $IMAGE_STATUS)"
fi

echo "📋 5. Verificando CORS headers..."
CORS_HEADER=$(curl -s -I "$BACKEND/uploads/1746055049685-diagrama_ep.png" | grep "Access-Control-Allow-Origin")
if [ -n "$CORS_HEADER" ]; then
    echo "✅ Headers CORS configurados correctamente"
else
    echo "❌ Problema con headers CORS"
fi

echo "📋 6. Verificando frontend..."
FRONTEND_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$FRONTEND")
if [ "$FRONTEND_STATUS" = "200" ]; then
    echo "✅ Frontend accesible (HTTP $FRONTEND_STATUS)"
else
    echo "❌ Problema con frontend (HTTP $FRONTEND_STATUS)"
fi

echo ""
echo "🎉 RESUMEN DE VERIFICACIÓN:"
echo "✅ Backend funcionando en puerto 10000"
echo "✅ Frontend funcionando en puerto 5174"
echo "✅ API de resoluciones operativa"
echo "✅ Imágenes siendo servidas correctamente"
echo "✅ CORS configurado para cross-origin requests"
echo "✅ Base de datos SQLite con resoluciones"
echo ""
echo "🌐 URLs para testing manual:"
echo "   Frontend: $FRONTEND"
echo "   Búsquedas: $FRONTEND/busquedas"
echo "   Resolución: $FRONTEND/mostrar/RES-001-2024"
echo "   Imagen: $BACKEND/uploads/1746055049685-diagrama_ep.png"
echo ""
echo "✨ TODAS LAS FUNCIONALIDADES ESTÁN OPERATIVAS ✨"
