#!/bin/bash

# Script de Verificación Rápida - Persistencia de Datos
# Verificar que las resoluciones se mantengan después de recargar la página

echo "🔍 VERIFICACIÓN RÁPIDA - PERSISTENCIA DE DATOS"
echo "=============================================="

# Verificar servicios
echo "1. Verificando servicios..."
BACKEND_RUNNING=$(curl -s http://localhost:10000/api/books/all | head -c 10)
FRONTEND_RUNNING=$(curl -s http://localhost:5174 | head -c 10)

if [ ! -z "$BACKEND_RUNNING" ]; then
    echo "✅ Backend: ACTIVO en puerto 10000"
else
    echo "❌ Backend: INACTIVO"
    exit 1
fi

if [ ! -z "$FRONTEND_RUNNING" ]; then
    echo "✅ Frontend: ACTIVO en puerto 5174"
else
    echo "❌ Frontend: INACTIVO"
    exit 1
fi

# Verificar base de datos
echo ""
echo "2. Verificando base de datos..."
cd "c:\Users\flavi\OneDrive\Escritorio\LibroDeResolucionesV2\server"

DB_COUNT=$(sqlite3 database.sqlite "SELECT COUNT(*) FROM resolution;")
echo "📊 Resoluciones en BD: $DB_COUNT"

# Verificar API
echo ""
echo "3. Verificando API..."
API_COUNT=$(curl -s http://localhost:10000/api/books/all | grep -o '"NumdeResolucion"' | wc -l)
echo "📋 Resoluciones via API: $API_COUNT"

# Verificar coherencia
if [ "$DB_COUNT" = "$API_COUNT" ]; then
    echo "✅ COHERENCIA: BD y API coinciden"
else
    echo "❌ INCOHERENCIA: BD($DB_COUNT) ≠ API($API_COUNT)"
fi

echo ""
echo "4. Test de URLs principales..."
echo "🌐 Frontend: http://localhost:5174"
echo "🔍 Página de búsquedas: http://localhost:5174/busquedas"
echo "➕ Página de cargas: http://localhost:5174/cargas"

echo ""
echo "5. Resoluciones más recientes:"
sqlite3 database.sqlite "SELECT NumdeResolucion, Asunto FROM resolution ORDER BY created_at DESC LIMIT 5;" | head -5

echo ""
echo "✅ VERIFICACIÓN COMPLETADA"
echo "=========================="
echo "📋 Total de resoluciones: $DB_COUNT"
echo "🌐 Sistema disponible en: http://localhost:5174"
echo ""
echo "🔧 Para probar la persistencia:"
echo "   1. Abrir http://localhost:5174/busquedas"
echo "   2. Verificar que aparezcan $DB_COUNT resoluciones"
echo "   3. Recargar la página (F5)"
echo "   4. Verificar que las resoluciones siguen ahí"
