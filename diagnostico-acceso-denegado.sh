#!/bin/bash

echo "� SOLUCIONANDO ACCESO DENEGADO - DIAGNÓSTICO URGENTE"
echo "===================================================="

echo ""
echo "❌ PROBLEMA OBSERVADO:"
echo "====================="
echo "• Pantalla muestra: 'Tu rol: Sin rol'"
echo "• Esto indica que el login no está funcionando correctamente"
echo "• El usuario no se está autenticando o el rol no se guarda"
echo ""

echo "🧪 VERIFICANDO BACKEND NUEVAMENTE..."
echo "==================================="

# Verificar login con el usuario que creamos
echo "� Probando login con secretaria_test..."
LOGIN_RESULT=$(curl -s -X POST "https://libroderesoluciones-api.onrender.com/api/user/login" \
    -H "Content-Type: application/json" \
    -d '{"Nombre":"secretaria_test","Contrasena":"test123"}' 2>/dev/null)

echo "Respuesta completa del login:"
echo "$LOGIN_RESULT"

if [[ "$LOGIN_RESULT" == *"token"* ]]; then
    echo ""
    echo "✅ Backend responde correctamente con token"
    
    # Extraer información del token
    TOKEN=$(echo "$LOGIN_RESULT" | grep -o '"token":"[^"]*"' | cut -d'"' -f4)
    USER_DATA=$(echo "$LOGIN_RESULT" | grep -o '"user":{[^}]*}')
    
    echo "🔑 Token generado: ${TOKEN:0:50}..."
    echo "👤 Datos de usuario: $USER_DATA"
    
else
    echo "❌ Login falla en backend"
    
    # Intentar crear el usuario admin también
    echo ""
    echo "📝 Creando usuario admin para pruebas..."
    ADMIN_REGISTER=$(curl -s -X POST "https://libroderesoluciones-api.onrender.com/api/user/register" \
        -H "Content-Type: application/json" \
        -d '{"Nombre":"admin","Contrasena":"admin123","Rol":"admin"}' 2>/dev/null)
    
    echo "Resultado registro admin: $ADMIN_REGISTER"
fi

echo ""
echo "� POSIBLES CAUSAS DEL PROBLEMA:"
echo "================================"
echo "1. El frontend no está enviando las credenciales correctas"
echo "2. El frontend no está guardando el token/usuario en localStorage"
echo "3. Hay un problema con la URL del API en el frontend"
echo "4. El frontend está usando campos incorrectos (email vs Nombre)"
echo ""

echo "🔧 VERIFICANDO CONFIGURACIÓN DEL FRONTEND..."
echo "==========================================="

# Verificar la configuración de la API en el frontend
if [ -f "front/.env.production" ]; then
    echo "📄 Configuración API frontend (.env.production):"
    grep "VITE_API" front/.env.production
else
    echo "⚠️  No se encontró front/.env.production"
fi

echo ""
echo "🎯 SOLUCIONES A APLICAR:"
echo "======================="
echo "1. Verificar que el frontend use la URL correcta del API"
echo "2. Asegurar que use campos 'Nombre' y 'Contrasena'"
echo "3. Verificar que guarde correctamente el usuario y token"
echo "4. Crear un usuario de prueba específico para debugging"
echo ""

echo "� CREDENCIALES DE PRUEBA DISPONIBLES:"
echo "====================================="
echo "Usuario: secretaria_test"
echo "Contraseña: test123"
echo "Rol: secretaria"
echo ""
echo "Usuario: admin"
echo "Contraseña: admin123" 
echo "Rol: admin"
echo ""

echo "🆘 PRÓXIMOS PASOS INMEDIATOS:"
echo "============================"
echo "1. Revisar consola del navegador para errores"
echo "2. Verificar configuración de API URL"
echo "3. Corregir problemas de autenticación en frontend"
echo "4. Probar login nuevamente"
