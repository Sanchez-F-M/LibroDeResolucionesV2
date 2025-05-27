#!/bin/bash

# Script para crear usuario administrador inicial
# Uso: ./create-admin-production.sh [username] [password]

echo "🚀 Creando usuario administrador inicial..."

# Directorio del script
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SERVER_DIR="$(dirname "$SCRIPT_DIR")"

# Cambiar al directorio del servidor
cd "$SERVER_DIR"

# Verificar que estamos en el directorio correcto
if [ ! -f "package.json" ]; then
    echo "❌ Error: No se encontró package.json. Asegúrese de estar en el directorio del servidor."
    exit 1
fi

# Establecer variables de entorno para credenciales personalizadas
if [ ! -z "$1" ]; then
    export ADMIN_USERNAME="$1"
    echo "👤 Usuario personalizado: $1"
else
    export ADMIN_USERNAME="admin"
    echo "👤 Usuario por defecto: admin"
fi

if [ ! -z "$2" ]; then
    export ADMIN_PASSWORD="$2"
    echo "🔑 Contraseña personalizada establecida"
else
    export ADMIN_PASSWORD="admin123"
    echo "🔑 Contraseña por defecto: admin123"
fi

echo "📍 Directorio de trabajo: $(pwd)"
echo "📂 Ejecutando script de creación..."

# Ejecutar el script de Node.js
node scripts/create-admin.js

echo "✨ Proceso completado"