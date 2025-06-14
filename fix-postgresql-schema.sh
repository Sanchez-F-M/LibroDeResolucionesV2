#!/bin/bash

echo "🔧 SCRIPT DE REPARACIÓN POSTGRESQL - COLUMNA ROL"
echo "================================================="
echo ""
echo "📋 PROBLEMA IDENTIFICADO:"
echo "  - Error 500 al crear usuarios en producción"
echo "  - La tabla 'users' no tiene la columna 'Rol'"
echo "  - El controlador createUser intenta insertar en columna inexistente"
echo ""
echo "✅ SOLUCIÓN APLICADA:"
echo "  - Agregada columna 'Rol' a la tabla users en postgres-connection.js"
echo "  - Configurado valor por defecto: 'usuario'"
echo "  - Agregado ALTER TABLE para bases de datos existentes"
echo ""

echo "🚀 PASOS PARA APLICAR EN RENDER:"
echo "================================"
echo ""
echo "1. HACER COMMIT Y PUSH DE LOS CAMBIOS:"
echo "   git add server/db/postgres-connection.js"
echo "   git commit -m 'Fix: Agregar columna Rol a tabla users PostgreSQL'"
echo "   git push origin main"
echo ""
echo "2. FORZAR REDEPLOY EN RENDER:"
echo "   - Ir a https://dashboard.render.com"
echo "   - Seleccionar servicio 'libroderesoluciones-api'"
echo "   - Hacer clic en 'Manual Deploy' → 'Deploy latest commit'"
echo "   - Esperar 3-5 minutos hasta que termine el deploy"
echo ""
echo "3. VERIFICAR LA CORRECCIÓN:"
echo "   curl -X POST https://libroderesoluciones-api.onrender.com/api/user/register \\"
echo "     -H \"Content-Type: application/json\" \\"
echo "     -d '{\"Nombre\":\"secretario_test\",\"Contrasena\":\"test123\",\"Rol\":\"secretaria\"}'"
echo ""
echo "📊 RESULTADO ESPERADO:"
echo "   {\"message\":\"Usuario creado exitosamente\",\"user\":{\"Nombre\":\"secretario_test\",\"Rol\":\"secretaria\"}}"
echo ""

echo "🔍 ¿Quieres hacer el commit ahora? (y/n)"
read -r response

if [[ "$response" =~ ^[Yy]$ ]]; then
    echo "📤 Haciendo commit y push..."
    
    cd "$(dirname "$0")"
    
    git add server/db/postgres-connection.js
    git commit -m "Fix: Agregar columna Rol a tabla users PostgreSQL - Solución error 500 registro usuarios"
    
    echo "🚀 Pushing a GitHub..."
    git push origin main
    
    if [ $? -eq 0 ]; then
        echo "✅ CAMBIOS SUBIDOS EXITOSAMENTE"
        echo ""
        echo "📱 PRÓXIMOS PASOS:"
        echo "1. Ir a Render Dashboard"
        echo "2. Hacer Manual Deploy del servicio backend"
        echo "3. Probar registro de secretario"
        echo ""
        echo "⏱️  Tiempo estimado: 5 minutos"
    else
        echo "❌ Error al hacer push. Verifica tu configuración git."
        exit 1
    fi
else
    echo "⏸️  Commit cancelado. Haz el commit manualmente cuando estés listo."
fi

echo ""
echo "🎯 RESUMEN DE LA CORRECCIÓN:"
echo "=============================="
echo "✅ Archivo modificado: server/db/postgres-connection.js"
echo "✅ Columna agregada: 'Rol' VARCHAR(50) DEFAULT 'usuario' NOT NULL"
echo "✅ Compatibilidad: Funciona con bases de datos nuevas y existentes"
echo "✅ Próximo paso: Deploy en Render"
echo ""
echo "📞 Si persisten problemas después del deploy, verificar:"
echo "   - Variables de entorno PostgreSQL en Render"
echo "   - Logs del servicio durante el startup"
echo "   - Conectividad a la base de datos"
