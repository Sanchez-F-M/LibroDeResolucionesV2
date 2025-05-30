#!/bin/bash

# Script para verificar la configuración antes del despliegue en Render
echo "🔧 Verificando configuración para Render..."

# Verificar variables de entorno
echo ""
echo "📋 Variables de entorno requeridas:"
echo "NODE_ENV: ${NODE_ENV:-'no configurada'}"
echo "PORT: ${PORT:-'no configurada'}"
echo "JWT_SECRET_KEY: ${JWT_SECRET_KEY:+configurada}"
echo "FRONTEND_URL: ${FRONTEND_URL:-'no configurada'}"

# Verificar archivos importantes
echo ""
echo "📂 Verificando archivos importantes:"

if [ -f "index.js" ]; then
    echo "✅ index.js encontrado"
else
    echo "❌ index.js NO encontrado"
fi

if [ -f "package.json" ]; then
    echo "✅ package.json encontrado"
    echo "📦 Scripts disponibles:"
    cat package.json | grep -A 10 '"scripts"' | head -15
else
    echo "❌ package.json NO encontrado"
fi

if [ -f "database.sqlite" ]; then
    echo "✅ database.sqlite encontrado"
else
    echo "⚠️  database.sqlite no encontrado (se creará automáticamente)"
fi

# Verificar dependencias críticas
echo ""
echo "📋 Dependencias críticas:"
if [ -f "package.json" ]; then
    echo "🔍 CORS:"
    cat package.json | grep '"cors"' || echo "❌ CORS no encontrado en package.json"
    
    echo "🔍 Express:"
    cat package.json | grep '"express"' || echo "❌ Express no encontrado en package.json"
    
    echo "🔍 SQLite:"
    cat package.json | grep '"sqlite"' || echo "❌ SQLite no encontrado en package.json"
fi

# Verificar configuración de CORS en código
echo ""
echo "🌐 Verificando configuración de CORS:"
if grep -q "allowedOrigins" index.js; then
    echo "✅ allowedOrigins configurado"
    echo "🔍 Orígenes configurados:"
    grep -A 5 "allowedOrigins" index.js
else
    echo "❌ allowedOrigins NO configurado"
fi

echo ""
echo "✨ Verificación completada"
echo ""
echo "🚀 Para desplegar en Render:"
echo "1. Subir cambios a GitHub"
echo "2. Configurar variables de entorno en Render dashboard"
echo "3. Ejecutar redeploy en Render"
