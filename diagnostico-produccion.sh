#!/bin/bash

echo "🔍 DIAGNÓSTICO DE PERSISTENCIA EN PRODUCCIÓN"
echo "============================================="
echo ""

# URLs de producción
BACKEND_URL="https://libro-resoluciones-api.onrender.com"
FRONTEND_URL="https://libro-de-resoluciones-v2-9izd-fe0i5ihfg.vercel.app"

echo "📊 1. Verificando estado del backend en producción..."
BACKEND_STATUS=$(curl -s -o /dev/null -w "%{http_code}" ${BACKEND_URL}/diagnose)
if [ "$BACKEND_STATUS" = "200" ]; then
    echo "✅ Backend en producción: FUNCIONANDO"
else
    echo "❌ Backend en producción: NO RESPONDE ($BACKEND_STATUS)"
    exit 1
fi

echo ""
echo "📈 2. Verificando resoluciones en producción..."
PRODUCTION_DATA=$(curl -s ${BACKEND_URL}/api/books/all)
PRODUCTION_COUNT=$(echo "$PRODUCTION_DATA" | grep -o '"NumdeResolucion"' | wc -l)
echo "📚 Resoluciones en producción: $PRODUCTION_COUNT"

if [ "$PRODUCTION_COUNT" -eq 0 ]; then
    echo "❌ PROBLEMA DETECTADO: La base de datos de producción está VACÍA"
    echo ""
    echo "🔧 SOLUCIONES POSIBLES:"
    echo "   1. Migrar datos desde desarrollo a producción"
    echo "   2. Crear resoluciones de prueba en producción"
    echo "   3. Verificar que el proceso de carga de datos funcione"
else
    echo "✅ Datos encontrados en producción"
fi

echo ""
echo "🌐 3. Verificando frontend en producción..."
FRONTEND_STATUS=$(curl -s -o /dev/null -w "%{http_code}" ${FRONTEND_URL})
if [ "$FRONTEND_STATUS" = "200" ]; then
    echo "✅ Frontend en producción: ACCESIBLE"
else
    echo "❌ Frontend en producción: NO ACCESIBLE ($FRONTEND_STATUS)"
fi

echo ""
echo "🔍 4. Verificando configuración de API en frontend..."
echo "⚠️  Verificar que el frontend esté configurado para usar:"
echo "    VITE_API_BASE_URL=${BACKEND_URL}"

echo ""
echo "💾 5. Comparando con datos locales..."
LOCAL_COUNT=$(curl -s http://localhost:10000/api/books/all 2>/dev/null | grep -o '"NumdeResolucion"' | wc -l)
if [ "$LOCAL_COUNT" -gt 0 ]; then
    echo "📊 Resoluciones locales: $LOCAL_COUNT"
    echo "🔄 Se puede migrar desde desarrollo a producción"
else
    echo "⚠️  No hay datos locales para migrar"
fi

echo ""
echo "🎯 RESUMEN DEL PROBLEMA:"
echo "   - Producción: $PRODUCTION_COUNT resoluciones"
echo "   - Local: $LOCAL_COUNT resoluciones"
echo "   - Causa: La base de datos de producción no tiene datos"
echo ""

if [ "$PRODUCTION_COUNT" -eq 0 ]; then
    echo "🚨 ACCIÓN REQUERIDA: Cargar datos en la base de datos de producción"
    echo ""
    echo "📋 PRÓXIMOS PASOS:"
    echo "   1. Crear resoluciones de prueba en producción"
    echo "   2. Verificar que la persistencia funcione con datos nuevos"
    echo "   3. Migrar datos existentes si es necesario"
fi

echo ""
