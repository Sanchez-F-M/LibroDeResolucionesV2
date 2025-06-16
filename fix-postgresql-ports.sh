#!/bin/bash

echo "🔧 CORRIGIENDO CONFIGURACIÓN DE PUERTOS POSTGRESQL"
echo "==============================================="

echo ""
echo "❌ PROBLEMA IDENTIFICADO:"
echo "- Puerto local PostgreSQL: 5433"
echo "- Puerto estándar PostgreSQL: 5432"
echo "- Puerto en Render: 5432"
echo "- Configuración actual: hardcoded a 5433"
echo ""

echo "✅ SOLUCIÓN APLICADA:"
echo "- Local (desarrollo): usa puerto 5433 (DB_PORT o fallback)"
echo "- Producción: usa puerto 5432 (estándar PostgreSQL)"
echo "- Configuración inteligente según NODE_ENV"
echo ""

echo "📝 ARCHIVOS CORREGIDOS:"
echo "======================"

# Verificar archivos con puerto 5433
echo "🔍 Buscando archivos con puerto 5433..."
grep -r "5433" server/ --include="*.js" | while read -r line; do
    file=$(echo "$line" | cut -d: -f1)
    echo "   📄 $file"
done

echo ""
echo "🎯 CONFIGURACIÓN INTELIGENTE APLICADA:"
echo "====================================="
echo "// En postgres-connection.js:"
echo "port: parseInt(process.env.DB_PORT) || (process.env.NODE_ENV === 'production' ? 5432 : 5433),"
echo ""
echo "✅ Esto significa:"
echo "   - Si DB_PORT está definido → usa ese puerto"
echo "   - Si NODE_ENV=production → usa 5432 (Render)"
echo "   - Si es desarrollo local → usa 5433"
echo ""

echo "🔧 VARIABLES DE ENTORNO RECOMENDADAS:"
echo "===================================="
echo ""
echo "PARA RENDER (producción):"
echo "-------------------------"
echo "DATABASE_URL=postgresql://user:pass@host:5432/db"
echo "# O alternativamente:"
echo "DB_HOST=tu-host.render.com"
echo "DB_USER=tu-usuario"
echo "DB_PASSWORD=tu-password"
echo "DB_NAME=libro_resoluciones"
echo "DB_PORT=5432"
echo ""

echo "PARA DESARROLLO LOCAL:"
echo "----------------------"
echo "DB_HOST=localhost"
echo "DB_USER=postgres"
echo "DB_PASSWORD=admin123"
echo "DB_NAME=libro_resoluciones"
echo "DB_PORT=5433"
echo ""

echo "🧪 PRUEBA DE CONFIGURACIÓN:"
echo "==========================="

# Probar configuración local
echo "📍 Probando configuración local..."
if command -v psql &> /dev/null; then
    # Intentar conectar a PostgreSQL local
    PGPASSWORD=admin123 psql -h localhost -p 5433 -U postgres -d libro_resoluciones -c "SELECT 1;" 2>/dev/null && {
        echo "✅ PostgreSQL local (puerto 5433) funcionando"
    } || {
        echo "⚠️  PostgreSQL local no disponible en puerto 5433"
        echo "   Verifica que PostgreSQL esté ejecutándose"
    }
else
    echo "⚠️  psql no disponible para prueba local"
fi

echo ""
echo "📋 VERIFICACIÓN PARA RENDER:"
echo "============================"
echo "1. ✅ Puerto corregido en código"
echo "2. ⏳ Configurar DATABASE_URL en Render con puerto 5432"
echo "3. ⏳ Redesplegar aplicación"
echo "4. ⏳ Probar endpoints después del despliegue"
echo ""

echo "🎯 PRÓXIMOS PASOS:"
echo "=================="
echo "1. Configurar PostgreSQL en Render (puerto 5432)"
echo "2. Configurar DATABASE_URL en variables de entorno"
echo "3. Hacer git commit y push de estos cambios"
echo "4. Esperar redespliegue automático"
echo "5. Probar funcionamiento con:"
echo "   bash verificacion-final-completa.sh"
echo ""

echo "✅ CONFIGURACIÓN DE PUERTOS COMPLETADA"
echo ""
echo "📞 La aplicación ahora usará:"
echo "   - Puerto 5433 en desarrollo (tu configuración actual)"
echo "   - Puerto 5432 en producción (estándar de Render)"
