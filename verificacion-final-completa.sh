#!/bin/bash

echo "🧪 VERIFICACIÓN RÁPIDA - POSTGRESQL CONFIGURADO"
echo "=============================================="

BACKEND_URL="https://libroderesoluciones-api.onrender.com"

echo ""
echo "1. ✅ VERIFICANDO BACKEND BÁSICO"
echo "================================"
BASIC_CHECK=$(curl -s "$BACKEND_URL/" 2>/dev/null)
if [[ "$BASIC_CHECK" == *"OK"* ]]; then
    echo "✅ Backend funcionando correctamente"
    echo "   Respuesta: $BASIC_CHECK"
else
    echo "❌ Backend no responde"
    echo "   Error: $BASIC_CHECK"
    exit 1
fi

echo ""
echo "2. 🔐 PROBANDO REGISTRO DE USUARIO"
echo "=================================="
REGISTER_RESULT=$(curl -s -X POST "$BACKEND_URL/api/user/register" \
    -H "Content-Type: application/json" \
    -d '{"Nombre":"admin","Contrasena":"admin123","Rol":"admin"}' 2>/dev/null)

echo "Resultado del registro:"
echo "$REGISTER_RESULT"

if [[ "$REGISTER_RESULT" == *"exitosamente"* ]]; then
    echo "✅ REGISTRO EXITOSO - Base de datos funcionando"
    DB_WORKING=true
elif [[ "$REGISTER_RESULT" == *"ya existe"* ]]; then
    echo "✅ USUARIO YA EXISTE - Base de datos funcionando"
    DB_WORKING=true
elif [[ "$REGISTER_RESULT" == *"Error interno del servidor"* ]]; then
    echo "❌ ERROR DE BASE DE DATOS - PostgreSQL no configurado correctamente"
    DB_WORKING=false
else
    echo "❓ Respuesta inesperada: $REGISTER_RESULT"
    DB_WORKING=false
fi

echo ""
echo "3. 🔑 PROBANDO LOGIN DE USUARIO"
echo "==============================="
if [[ "$DB_WORKING" == true ]]; then
    LOGIN_RESULT=$(curl -s -X POST "$BACKEND_URL/api/user/login" \
        -H "Content-Type: application/json" \
        -d '{"Nombre":"admin","Contrasena":"admin123"}' 2>/dev/null)
    
    echo "Resultado del login:"
    echo "$LOGIN_RESULT"
    
    if [[ "$LOGIN_RESULT" == *"token"* ]]; then
        echo "✅ LOGIN EXITOSO - Autenticación funcionando"
        AUTH_WORKING=true
    elif [[ "$LOGIN_RESULT" == *"Usuario no encontrado"* ]]; then
        echo "⚠️  Usuario admin no existe, probando crear..."
        AUTH_WORKING=false
    else
        echo "❌ LOGIN FALLÓ"
        echo "Posible problema con JWT_SECRET o lógica de autenticación"
        AUTH_WORKING=false
    fi
else
    echo "⏭️  Saltando login - Base de datos no funciona"
    AUTH_WORKING=false
fi

echo ""
echo "4. ☁️ VERIFICANDO CLOUDINARY (OPCIONAL)"
echo "======================================="
CLOUDINARY_STATUS=$(curl -s "$BACKEND_URL/api/cloudinary/status" 2>/dev/null)
echo "Estado de Cloudinary:"
echo "$CLOUDINARY_STATUS"

if [[ "$CLOUDINARY_STATUS" == *"connected\":true"* ]]; then
    echo "✅ Cloudinary conectado correctamente"
elif [[ "$CLOUDINARY_STATUS" == *"connected\":false"* ]]; then
    echo "⚠️  Cloudinary no conectado (opcional para funcionamiento básico)"
else
    echo "❓ No se pudo verificar Cloudinary"
fi

echo ""
echo "📊 RESUMEN FINAL"
echo "==============="

if [[ "$DB_WORKING" == true && "$AUTH_WORKING" == true ]]; then
    echo "🎉 ¡SISTEMA COMPLETAMENTE FUNCIONAL!"
    echo "✅ Base de datos: FUNCIONANDO"
    echo "✅ Autenticación: FUNCIONANDO"
    echo "✅ Backend: FUNCIONANDO"
    echo ""
    echo "🚀 Próximos pasos:"
    echo "1. Probar desde el frontend"
    echo "2. Configurar Cloudinary si es necesario"
    echo "3. Crear usuarios adicionales"
    
elif [[ "$DB_WORKING" == true && "$AUTH_WORKING" == false ]]; then
    echo "⚠️  SISTEMA PARCIALMENTE FUNCIONAL"
    echo "✅ Base de datos: FUNCIONANDO"
    echo "❌ Autenticación: PROBLEMA"
    echo "✅ Backend: FUNCIONANDO"
    echo ""
    echo "🔧 Acción requerida:"
    echo "- Verificar que JWT_SECRET esté configurado en Render"
    echo "- Revisar logs del backend para errores de JWT"
    
elif [[ "$DB_WORKING" == false ]]; then
    echo "❌ SISTEMA NO FUNCIONAL"
    echo "❌ Base de datos: NO FUNCIONA"
    echo "❌ Autenticación: NO PUEDE FUNCIONAR"
    echo "✅ Backend: FUNCIONANDO"
    echo ""
    echo "🚨 Acción crítica requerida:"
    echo "1. Configurar DATABASE_URL en Render"
    echo "2. Crear PostgreSQL database"
    echo "3. Volver a ejecutar este script"
    echo ""
    echo "📖 Consultar: DIAGNOSTICO_DEFINITIVO_ERROR_500.md"
fi

echo ""
echo "🔗 ENLACES ÚTILES:"
echo "=================="
echo "• Render Dashboard: https://dashboard.render.com"
echo "• Backend Service: https://dashboard.render.com/web/srv-..."
echo "• Supabase (alternativa): https://supabase.com"
echo "• Documentación: ./DIAGNOSTICO_DEFINITIVO_ERROR_500.md"

echo ""
echo "⏰ Verificación completada: $(date)"
