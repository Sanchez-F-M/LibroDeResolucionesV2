#!/bin/bash

# 👤 SCRIPT PARA CREAR NUEVOS USUARIOS
# Libro de Resoluciones V2

echo "👤 CREADOR DE USUARIOS - Libro de Resoluciones V2"
echo "=============================================="
echo ""

# Verificar que el backend esté funcionando
echo "🔍 Verificando que el backend esté activo..."
BACKEND_STATUS=$(curl -s http://localhost:3000/health 2>/dev/null | grep -o '"status":"[^"]*' | cut -d'"' -f4)

if [ "$BACKEND_STATUS" != "healthy" ]; then
    echo "❌ El backend no está funcionando en puerto 3000"
    echo "💡 Asegúrate de que el servidor esté iniciado:"
    echo "   cd server && npm start"
    exit 1
fi

echo "✅ Backend funcionando correctamente"
echo ""

# Solicitar datos del nuevo usuario
echo "📝 Ingrese los datos del nuevo usuario:"
echo ""

read -p "👤 Nombre de usuario: " username
if [ -z "$username" ]; then
    echo "❌ El nombre de usuario es obligatorio"
    exit 1
fi

while true; do
    read -s -p "🔐 Contraseña: " password
    echo ""
    read -s -p "🔐 Confirmar contraseña: " password_confirm
    echo ""
    
    if [ "$password" = "$password_confirm" ]; then
        if [ ${#password} -lt 6 ]; then
            echo "❌ La contraseña debe tener al menos 6 caracteres"
            continue
        fi
        break
    else
        echo "❌ Las contraseñas no coinciden. Intente nuevamente."
    fi
done

echo ""
echo "🚀 Creando usuario '$username'..."

# Crear el usuario
RESPONSE=$(curl -s -X POST http://localhost:3000/api/user/register \
  -H "Content-Type: application/json" \
  -d "{\"Nombre\":\"$username\",\"Contrasena\":\"$password\"}")

# Verificar la respuesta
if echo "$RESPONSE" | grep -q "Usuario creado exitosamente"; then
    echo "✅ Usuario '$username' creado exitosamente"
    echo ""
    echo "📋 Datos del usuario:"
    echo "   • Nombre: $username"
    echo "   • Estado: Activo"
    echo "   • Fecha de creación: $(date)"
    echo ""
    echo "🔐 Credenciales de acceso:"
    echo "   • Usuario: $username"
    echo "   • Contraseña: [configurada]"
    echo "   • URL de acceso: http://localhost:5174"
    echo ""
    
    # Probar login del nuevo usuario
    echo "🧪 Probando login del nuevo usuario..."
    LOGIN_TEST=$(curl -s -X POST http://localhost:3000/api/user/login \
      -H "Content-Type: application/json" \
      -d "{\"Nombre\":\"$username\",\"Contrasena\":\"$password\"}")
    
    if echo "$LOGIN_TEST" | grep -q "token"; then
        echo "✅ Login del nuevo usuario funcional"
        TOKEN=$(echo "$LOGIN_TEST" | grep -o '"token":"[^"]*' | cut -d'"' -f4)
        echo "🔑 Token generado: ${TOKEN:0:50}..."
    else
        echo "⚠️  Advertencia: Usuario creado pero hay problemas con el login"
        echo "📋 Respuesta del login: $LOGIN_TEST"
    fi
    
else
    echo "❌ Error al crear el usuario"
    echo "📋 Respuesta del servidor:"
    echo "$RESPONSE"
    
    # Verificar si el usuario ya existe
    if echo "$RESPONSE" | grep -q "ya existe"; then
        echo ""
        echo "💡 El usuario '$username' ya existe en el sistema"
        echo "🔧 Para ver usuarios existentes, ejecute:"
        echo "   curl -s http://localhost:3000/api/user/profile"
    fi
fi

echo ""
echo "================================================"
echo "🎯 Proceso de creación de usuario completado"
echo "================================================"
