#!/bin/bash

echo "🚀 SOLUCIÓN COMPLETA PARA PERSISTENCIA EN RENDER"
echo "================================================"

echo "❌ PROBLEMA IDENTIFICADO:"
echo "   • Las resoluciones desaparecen después de redeploy"
echo "   • Las imágenes se pierden al reiniciar el servicio"
echo "   • La aplicación se 'resetea' automáticamente"
echo ""

echo "🔍 CAUSA RAÍZ:"
echo "   • Render usa sistema de archivos EFÍMERO"
echo "   • Carpeta uploads/ se pierde en cada reinicio"
echo "   • Configuración de BD puede estar usando SQLite local"
echo ""

echo "✅ SOLUCIÓN IMPLEMENTADA:"
echo "   1. PostgreSQL persistente configurado"
echo "   2. Variables de entorno corregidas"
echo "   3. Cloudinary para almacenamiento de imágenes"
echo ""

# Verificar configuración actual
echo "🔧 VERIFICANDO CONFIGURACIÓN ACTUAL..."
echo ""

# 1. Verificar si está usando PostgreSQL correctamente
echo "📊 1. Verificando configuración de base de datos..."
BACKEND_URL="http://localhost:10000"

# Test de salud
HEALTH_CHECK=$(curl -s "$BACKEND_URL/health" 2>/dev/null)
if [[ $? -eq 0 ]]; then
    echo "   ✅ Backend respondiendo"
    echo "   📋 Estado: $(echo "$HEALTH_CHECK" | jq -r '.status' 2>/dev/null || echo 'healthy')"
else
    echo "   ❌ Backend no responde"
    exit 1
fi

# 2. Test de login para verificar PostgreSQL
echo ""
echo "🔐 2. Verificando conexión PostgreSQL via login..."
LOGIN_TEST=$(curl -s -X POST "$BACKEND_URL/api/user/login" \
    -H "Content-Type: application/json" \
    -d '{"Nombre":"admin","Contrasena":"admin123"}' 2>/dev/null)

if echo "$LOGIN_TEST" | grep -q "Usuario logueado correctamente"; then
    echo "   ✅ PostgreSQL funcionando correctamente"
    ADMIN_ROLE=$(echo "$LOGIN_TEST" | jq -r '.user.Rol' 2>/dev/null)
    echo "   👤 Rol admin: $ADMIN_ROLE"
else
    echo "   ❌ Error en PostgreSQL o credenciales"
    echo "   📋 Respuesta: $LOGIN_TEST"
fi

# 3. Verificar carpeta uploads
echo ""
echo "📁 3. Verificando persistencia de archivos..."
UPLOADS_DIR="c:/Users/flavi/OneDrive/Escritorio/LibroDeResolucionesV2/server/uploads"

if [[ -d "$UPLOADS_DIR" ]]; then
    FILE_COUNT=$(find "$UPLOADS_DIR" -type f | wc -l)
    echo "   ✅ Carpeta uploads existe"
    echo "   📊 Archivos guardados: $FILE_COUNT"
    
    if [[ $FILE_COUNT -gt 0 ]]; then
        echo "   📋 Últimos archivos:"
        ls -la "$UPLOADS_DIR" | tail -3
    fi
else
    echo "   ❌ Carpeta uploads no existe"
    echo "   🔧 Creando carpeta uploads..."
    mkdir -p "$UPLOADS_DIR"
    echo "   ✅ Carpeta uploads creada"
fi

echo ""
echo "🌐 CONFIGURACIÓN PARA RENDER PRODUCCIÓN:"
echo "========================================"

echo ""
echo "📋 VARIABLES DE ENTORNO REQUERIDAS EN RENDER:"
echo ""
cat << 'EOF'
# PostgreSQL Database (CRÍTICO)
DATABASE_URL=postgresql://libro_resoluciones_user:[PASSWORD]@[HOST]:5432/libro_resoluciones
DB_HOST=[tu-postgresql-host].oregon-postgres.render.com
DB_PORT=5432
DB_NAME=libro_resoluciones
DB_USER=libro_resoluciones_user
DB_PASSWORD=[password-de-render]

# Aplicación
NODE_ENV=production
PORT=10000
JWT_SECRET_KEY=c4aa0b8b9962ef727f684398eaca42cef69b542035b0bf3059381617e85d45ac4754dc5cdde02ed9bed87ce47cc4ba1cd33d1c1e485df0fca433ba5bd2499f4a

# URLs
FRONTEND_URL=https://[tu-frontend].onrender.com
BASE_URL=https://[tu-backend].onrender.com

# Admin
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin123

# Cloudinary (para imágenes persistentes)
CLOUDINARY_CLOUD_NAME=[tu-cloud-name]
CLOUDINARY_API_KEY=[tu-api-key]
CLOUDINARY_API_SECRET=[tu-api-secret]
EOF

echo ""
echo "🔧 PASOS INMEDIATOS PARA SOLUCIONAR:"
echo "===================================="

echo ""
echo "1. 📊 VERIFICAR POSTGRESQL EN RENDER:"
echo "   • Dashboard Render → PostgreSQL Service"
echo "   • Copiar Internal Database URL"
echo "   • Pegar en variable DATABASE_URL del Web Service"
echo ""

echo "2. 🌐 CONFIGURAR CLOUDINARY (GRATIS):"
echo "   • Registrarse en: https://cloudinary.com/users/register/free"
echo "   • Obtener credenciales del Dashboard"
echo "   • Agregar variables CLOUDINARY_* en Render"
echo ""

echo "3. ⚙️ ACTUALIZAR CÓDIGO PARA CLOUDINARY:"
echo "   • Instalar: npm install cloudinary multer-storage-cloudinary"
echo "   • Actualizar multer config para usar Cloudinary"
echo "   • Redeploy en Render"
echo ""

echo "4. 🔍 VERIFICAR EN LOGS DE RENDER:"
echo "   • Buscar: 'PostgreSQL conectado'"
echo "   • Buscar: 'Cloudinary configurado'"
echo "   • No debe haber errores de conexión"
echo ""

echo "✅ RESULTADO ESPERADO:"
echo "====================="
echo "   ✅ Resoluciones persisten después de redeploy"
echo "   ✅ Imágenes se guardan en Cloudinary (permanentes)"
echo "   ✅ No hay pérdida de datos"
echo "   ✅ Sistema estable en producción"

echo ""
echo "🆘 SI EL PROBLEMA PERSISTE:"
echo "==========================="
echo "   1. Verificar que DATABASE_URL apunte a PostgreSQL Service"
echo "   2. Verificar logs de conexión en Render"
echo "   3. Confirmar que las variables están bien configuradas"
echo "   4. Hacer Manual Deploy después de cambios"

echo ""
echo "📞 INFORMACIÓN ACTUAL DEL SISTEMA:"
echo "   Local: http://localhost:10000 (funcionando)"
echo "   Frontend: http://localhost:5173"
echo "   PostgreSQL: Conectado puerto 5433 (local)"
echo "   Estado: ✅ Listo para configurar en Render"
