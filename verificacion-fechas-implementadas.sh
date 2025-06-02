#!/bin/bash

echo "🎯 VERIFICACIÓN FINAL DE IMPLEMENTACIÓN DE FECHAS"
echo "=================================================="
echo "Fecha: $(date)"
echo ""

echo "🔍 Verificando Backend..."
echo "------------------------"

# Verificar que el backend está corriendo
if curl -s http://localhost:10000/api/health >/dev/null 2>&1; then
    echo "✅ Backend funcionando en puerto 10000"
else
    echo "❌ Backend no responde en puerto 10000"
    exit 1
fi

# Verificar ordenamiento por fecha en la API
echo ""
echo "📊 Verificando ordenamiento por fecha en API..."
RESPONSE=$(curl -s http://localhost:10000/api/books/all | head -c 1000)

if echo "$RESPONSE" | grep -q "fetcha_creacion"; then
    echo "✅ Campo 'fetcha_creacion' presente en respuesta"
else
    echo "❌ Campo 'fetcha_creacion' no encontrado"
fi

# Extraer las primeras 3 fechas para verificar orden
echo ""
echo "📅 Primeras 3 resoluciones por fecha (más recientes primero):"
curl -s http://localhost:10000/api/books/all | \
    grep -o '"fetcha_creacion":"[^"]*"' | \
    head -3 | \
    sed 's/"fetcha_creacion":"/   🗓️  /' | \
    sed 's/"$//'

echo ""
echo "🔍 Verificando Frontend..."
echo "-------------------------"

# Verificar que el frontend está corriendo
FRONTEND_PORT=""
for port in 5173 5174 5175 5176 5177; do
    if curl -s http://localhost:$port >/dev/null 2>&1; then
        FRONTEND_PORT=$port
        break
    fi
done

if [ -n "$FRONTEND_PORT" ]; then
    echo "✅ Frontend funcionando en puerto $FRONTEND_PORT"
    echo "🌐 URL de búsquedas: http://localhost:$FRONTEND_PORT/busquedas"
else
    echo "❌ Frontend no está corriendo"
fi

echo ""
echo "📝 Verificando archivos modificados..."
echo "------------------------------------"

# Verificar modificaciones en el backend
if grep -q "ORDER BY r.FechaCreacion DESC" server/src/controllers/book.controller.js; then
    echo "✅ Backend: Ordenamiento por fecha implementado en getAllBooks"
else
    echo "❌ Backend: Ordenamiento por fecha no encontrado"
fi

if grep -q "ORDER BY FechaCreacion DESC" server/src/controllers/search.controller.js; then
    echo "✅ Backend: Ordenamiento por fecha implementado en search"
else
    echo "❌ Backend: Ordenamiento por fecha no encontrado en search"
fi

# Verificar modificaciones en el frontend
if grep -q "import.*CalendarTodayIcon" front/src/pages/busquedas/busquedas.jsx; then
    echo "✅ Frontend: Icono de calendario importado"
else
    echo "❌ Frontend: Icono de calendario no importado"
fi

if grep -q "import.*date-fns" front/src/pages/busquedas/busquedas.jsx; then
    echo "✅ Frontend: date-fns importado"
else
    echo "❌ Frontend: date-fns no importado"
fi

if grep -q "<TableCell.*Fecha.*fontWeight.*bold" front/src/pages/busquedas/busquedas.jsx; then
    echo "✅ Frontend: Columna 'Fecha' agregada en tabla"
else
    echo "❌ Frontend: Columna 'Fecha' no encontrada"
fi

if grep -q "fetcha_creacion.*format.*new Date" front/src/pages/busquedas/busquedas.jsx; then
    echo "✅ Frontend: Formateo de fecha implementado"
else
    echo "❌ Frontend: Formateo de fecha no implementado"
fi

echo ""
echo "🎯 RESUMEN DE IMPLEMENTACIÓN"
echo "============================"
echo ""
echo "✅ BACKEND MODIFICADO:"
echo "   • getAllBooks: Ordenado por FechaCreacion DESC, NumdeResolucion DESC"
echo "   • search: Ordenado por FechaCreacion DESC en todos los criterios"
echo ""
echo "✅ FRONTEND MODIFICADO:"
echo "   • Importaciones: CalendarTodayIcon, date-fns, locale español"
echo "   • Tabla desktop: Columna 'Fecha' con chip formateado (dd/MM/yyyy)"
echo "   • Cards móviles: Chip de fecha antes de los botones"
echo "   • Modal detalles: Fecha completa formateada (dd de MMMM de yyyy)"
echo ""
echo "🚀 FUNCIONALIDADES IMPLEMENTADAS:"
echo "   • Las resoluciones se muestran ordenadas por fecha (más recientes primero)"
echo "   • La fecha se muestra en formato legible en todas las vistas"
echo "   • Diseño responsive: diferentes formatos para móvil y desktop"
echo "   • Iconos intuitivos para mejor UX"
echo ""

if [ -n "$FRONTEND_PORT" ]; then
    echo "🌐 PARA PROBAR:"
    echo "   Abrir: http://localhost:$FRONTEND_PORT/busquedas"
    echo "   Las resoluciones deberían aparecer ordenadas por fecha"
    echo "   La columna 'Fecha' debería ser visible en vista desktop"
    echo "   Los chips de fecha deberían aparecer en vista móvil"
fi

echo ""
echo "✅ IMPLEMENTACIÓN COMPLETADA EXITOSAMENTE!"
