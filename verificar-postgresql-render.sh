#!/bin/bash

echo "🔍 VERIFICADOR POSTGRESQL - RENDER"
echo "=================================="
echo ""

echo "Verificando estado actual del sistema..."
echo ""

# Función para verificar salud del backend
verificar_backend() {
    echo "📡 1. Verificando backend..."
    response=$(curl -s https://libroderesoluciones-api.onrender.com/health)
    
    if echo "$response" | grep -q "healthy"; then
        echo "✅ Backend funcionando"
        return 0
    else
        echo "❌ Backend con problemas"
        echo "Respuesta: $response"
        return 1
    fi
}

# Función para verificar base de datos
verificar_database() {
    echo "🗄️ 2. Verificando base de datos..."
    response=$(curl -s https://libroderesoluciones-api.onrender.com/diagnose)
    
    if echo "$response" | grep -q '"status":"connected"'; then
        echo "✅ Base de datos conectada"
        
        # Extraer información de la BD
        users=$(echo "$response" | grep -o '"users":[0-9]*' | cut -d':' -f2)
        books=$(echo "$response" | grep -o '"books":[0-9]*' | cut -d':' -f2)
        
        echo "📊 Usuarios en BD: $users"
        echo "📚 Resoluciones en BD: $books"
        return 0
    else
        echo "❌ Base de datos desconectada"
        echo "Respuesta: $response"
        return 1
    fi
}

# Función para verificar autenticación
verificar_auth() {
    echo "🔐 3. Verificando autenticación..."
    response=$(curl -s -X POST https://libroderesoluciones-api.onrender.com/api/user/login \
        -H "Content-Type: application/json" \
        -d '{"Nombre":"admin","Contrasena":"admin123"}')
    
    if echo "$response" | grep -q "token"; then
        echo "✅ Autenticación funcionando"
        echo "🎫 Token generado correctamente"
        return 0
    elif echo "$response" | grep -q "Error interno"; then
        echo "❌ Error interno en autenticación (problema de BD)"
        return 1
    else
        echo "⚠️ Respuesta inesperada:"
        echo "$response"
        return 1
    fi
}

# Función para probar registro de usuario
verificar_registro() {
    echo "👤 4. Verificando registro de usuarios..."
    timestamp=$(date +%s)
    test_user="test_user_$timestamp"
    
    response=$(curl -s -X POST https://libroderesoluciones-api.onrender.com/api/user/register \
        -H "Content-Type: application/json" \
        -d "{\"Nombre\":\"$test_user\",\"Contrasena\":\"test123\",\"Rol\":\"usuario\"}")
    
    if echo "$response" | grep -q "Usuario creado exitosamente"; then
        echo "✅ Registro de usuarios funcionando"
        return 0
    elif echo "$response" | grep -q "Error interno"; then
        echo "❌ Error interno en registro (problema de BD)"
        return 1
    else
        echo "⚠️ Respuesta inesperada:"
        echo "$response"
        return 1
    fi
}

# Ejecutar todas las verificaciones
echo "Iniciando verificación completa..."
echo "================================="

backend_ok=false
database_ok=false
auth_ok=false
register_ok=false

if verificar_backend; then
    backend_ok=true
    echo ""
    
    if verificar_database; then
        database_ok=true
        echo ""
        
        if verificar_auth; then
            auth_ok=true
            echo ""
            
            if verificar_registro; then
                register_ok=true
            fi
        fi
    fi
fi

echo ""
echo "📊 RESUMEN DE VERIFICACIÓN:"
echo "=========================="
echo "Backend:      $([ "$backend_ok" = true ] && echo "✅ OK" || echo "❌ FALLO")"
echo "Base de Datos: $([ "$database_ok" = true ] && echo "✅ OK" || echo "❌ FALLO")"
echo "Autenticación: $([ "$auth_ok" = true ] && echo "✅ OK" || echo "❌ FALLO")"
echo "Registro:      $([ "$register_ok" = true ] && echo "✅ OK" || echo "❌ FALLO")"
echo ""

if [ "$backend_ok" = true ] && [ "$database_ok" = true ] && [ "$auth_ok" = true ] && [ "$register_ok" = true ]; then
    echo "🎉 ¡SISTEMA COMPLETAMENTE FUNCIONAL!"
    echo "=================================="
    echo "✅ Todos los componentes funcionando"
    echo "✅ Base de datos PostgreSQL conectada"
    echo "✅ Autenticación operativa"
    echo "✅ Registro de usuarios funcional"
    echo ""
    echo "🌐 La aplicación está lista para uso en producción"
    echo ""
    echo "📱 URLs de acceso:"
    echo "Frontend: https://libro-de-resoluciones-v2-9izd.vercel.app"
    echo "Backend:  https://libroderesoluciones-api.onrender.com"
elif [ "$backend_ok" = true ] && [ "$database_ok" = false ]; then
    echo "⚠️ PROBLEMA DE BASE DE DATOS"
    echo "============================"
    echo "El backend funciona pero no puede conectarse a PostgreSQL"
    echo ""
    echo "🔧 SOLUCIÓN:"
    echo "1. Crear base de datos PostgreSQL en Render"
    echo "2. Configurar DATABASE_URL en el backend"
    echo "3. Redesplegar el servicio"
    echo ""
    echo "📋 Ejecutar: bash configurar-postgresql-render.sh"
else
    echo "❌ SISTEMA CON PROBLEMAS"
    echo "======================="
    echo "Verificar configuración y logs en Render"
fi
