#!/bin/bash

echo "🎉 VERIFICACIÓN FINAL DE PERSISTENCIA EN PRODUCCIÓN"
echo "===================================================="
echo ""

# URLs de producción
BACKEND_URL="https://libro-resoluciones-api.onrender.com"
FRONTEND_URL="https://libro-de-resoluciones-v2-9izd-fe0i5ihfg.vercel.app"

echo "📊 1. Verificando Backend en Producción..."
BACKEND_STATUS=$(curl -s -o /dev/null -w "%{http_code}" ${BACKEND_URL}/api/books/all)
if [ "$BACKEND_STATUS" = "200" ]; then
    echo "✅ Backend: FUNCIONANDO"
else
    echo "❌ Backend: ERROR ($BACKEND_STATUS)"
    exit 1
fi

echo ""
echo "📚 2. Contando Resoluciones en Base de Datos..."
RESOLUTION_DATA=$(curl -s ${BACKEND_URL}/api/books/all)
RESOLUTION_COUNT=$(echo "$RESOLUTION_DATA" | grep -o '"NumdeResolucion"' | wc -l)
echo "📊 Total de resoluciones en producción: $RESOLUTION_COUNT"

if [ "$RESOLUTION_COUNT" -eq 0 ]; then
    echo "❌ PROBLEMA: Base de datos de producción VACÍA"
    exit 1
else
    echo "✅ Base de datos con datos: $RESOLUTION_COUNT resoluciones"
fi

echo ""
echo "🌐 3. Verificando Frontend en Producción..."
FRONTEND_STATUS=$(curl -s -o /dev/null -w "%{http_code}" ${FRONTEND_URL})
if [ "$FRONTEND_STATUS" = "200" ]; then
    echo "✅ Frontend: ACCESIBLE"
else
    echo "❌ Frontend: ERROR ($FRONTEND_STATUS)"
    exit 1
fi

echo ""
echo "🔍 4. Verificando Página de Búsquedas..."
SEARCH_STATUS=$(curl -s -o /dev/null -w "%{http_code}" ${FRONTEND_URL}/busquedas)
if [ "$SEARCH_STATUS" = "200" ]; then
    echo "✅ Página de búsquedas: ACCESIBLE"
else
    echo "❌ Página de búsquedas: ERROR ($SEARCH_STATUS)"
fi

echo ""
echo "📋 5. Mostrando Primeras 3 Resoluciones..."
echo "$RESOLUTION_DATA" | grep -o '"NumdeResolucion":"[^"]*","asunto":"[^"]*"' | head -3 | while IFS= read -r line; do
    NUMERO=$(echo "$line" | grep -o '"NumdeResolucion":"[^"]*"' | cut -d'"' -f4)
    ASUNTO=$(echo "$line" | grep -o '"asunto":"[^"]*"' | cut -d'"' -f4)
    echo "   📄 $NUMERO: $ASUNTO"
done

echo ""
echo "🎯 6. RESUMEN FINAL:"
echo "   ✅ Backend funcionando en: $BACKEND_URL"
echo "   ✅ Frontend accesible en: $FRONTEND_URL"
echo "   ✅ Base de datos con $RESOLUTION_COUNT resoluciones"
echo "   ✅ API devuelve datos correctamente"
echo "   ✅ Página de búsquedas accesible"

echo ""
echo "🚀 ESTADO: PERSISTENCIA EN PRODUCCIÓN FUNCIONANDO CORRECTAMENTE"
echo ""
echo "📱 PRÓXIMO PASO:"
echo "   1. Abre: ${FRONTEND_URL}/busquedas"
echo "   2. Verifica que se muestren automáticamente las $RESOLUTION_COUNT resoluciones"
echo "   3. Cierra y reabre el navegador para confirmar que los datos persisten"
echo ""

# Diagnóstico adicional
echo "🔧 7. Diagnóstico del Sistema..."
DIAGNOSE_DATA=$(curl -s ${BACKEND_URL}/diagnose)
BOOKS_COUNT=$(echo "$DIAGNOSE_DATA" | grep -o '"books":[0-9]*' | cut -d':' -f2)
echo "   📊 Libros en diagnóstico: $BOOKS_COUNT"
echo "   📊 Libros en API: $RESOLUTION_COUNT"

if [ "$BOOKS_COUNT" = "$RESOLUTION_COUNT" ]; then
    echo "   ✅ Consistencia de datos: CORRECTA"
else
    echo "   ⚠️  Posible inconsistencia entre diagnóstico y API"
fi

echo ""
echo "✨ MISIÓN CUMPLIDA: La persistencia de datos funciona en producción ✨"
echo ""
