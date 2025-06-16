#!/bin/bash

echo "🔍 DIAGNÓSTICO AVANZADO DE POSTGRESQL EN RENDER"
echo "==============================================="

# Función para hacer requests seguros
safe_curl() {
  timeout 30 curl -s -f "$@" 2>/dev/null || echo "ERROR: Request falló"
}

echo ""
echo "1. VERIFICANDO ESTADO DEL SERVIDOR"
echo "-----------------------------------"
BACKEND_STATUS=$(safe_curl "https://libroderesoluciones-api.onrender.com/")
echo "✅ Estado del backend: $BACKEND_STATUS"

echo ""
echo "2. PROBANDO CONEXIÓN DE BASE DE DATOS"
echo "--------------------------------------"

# Crear un usuario de prueba para diagnosticar
echo "📝 Intentando registrar usuario de prueba..."
REGISTER_RESULT=$(safe_curl -X POST "https://libroderesoluciones-api.onrender.com/api/user/register" \
  -H "Content-Type: application/json" \
  -d '{"Nombre":"diagnostico_user","Contrasena":"test123","Rol":"usuario"}')

echo "Resultado del registro: $REGISTER_RESULT"

if [[ "$REGISTER_RESULT" == *"Error interno del servidor"* ]]; then
  echo "❌ ERROR: Problema de conexión con la base de datos en Render"
  echo ""
  echo "POSIBLES CAUSAS:"
  echo "1. Variable DATABASE_URL no configurada en Render"
  echo "2. Base de datos PostgreSQL no creada en Render"
  echo "3. Credenciales incorrectas"
  echo "4. Problemas de SSL/conexión"
  echo ""
  echo "SOLUCIONES RECOMENDADAS:"
  echo "1. Verificar variables de entorno en Render:"
  echo "   - DATABASE_URL debe estar configurada"
  echo "   - O configurar DB_HOST, DB_USER, DB_PASSWORD, DB_NAME, DB_PORT"
  echo ""
  echo "2. Crear base de datos PostgreSQL en Render:"
  echo "   - Ir a Dashboard de Render"
  echo "   - Crear nuevo PostgreSQL service"
  echo "   - Copiar DATABASE_URL al backend service"
  echo ""
  echo "3. Usar servicio externo como Supabase o Neon:"
  echo "   - Más confiable que PostgreSQL de Render"
  echo "   - Configuración más simple"
  
elif [[ "$REGISTER_RESULT" == *"Usuario creado exitosamente"* ]] || [[ "$REGISTER_RESULT" == *"El usuario ya existe"* ]]; then
  echo "✅ BASE DE DATOS CONECTADA CORRECTAMENTE"
  
  # Si la DB funciona, probar login
  echo ""
  echo "3. PROBANDO LOGIN"
  echo "-----------------"
  LOGIN_RESULT=$(safe_curl -X POST "https://libroderesoluciones-api.onrender.com/api/user/login" \
    -H "Content-Type: application/json" \
    -d '{"Nombre":"diagnostico_user","Contrasena":"test123"}')
  
  echo "Resultado del login: $LOGIN_RESULT"
  
  if [[ "$LOGIN_RESULT" == *"token"* ]]; then
    echo "✅ LOGIN FUNCIONANDO CORRECTAMENTE"
    echo ""
    echo "🎉 SISTEMA OPERATIVO - NO HAY ERRORES DE BASE DE DATOS"
  else
    echo "⚠️  Login falla pero registro funciona - revisar lógica de autenticación"
  fi
  
else
  echo "❓ Respuesta inesperada del servidor: $REGISTER_RESULT"
fi

echo ""
echo "4. VERIFICANDO CLOUDINARY"
echo "-------------------------"
CLOUDINARY_STATUS=$(safe_curl "https://libroderesoluciones-api.onrender.com/api/cloudinary/status")
echo "Estado de Cloudinary: $CLOUDINARY_STATUS"

echo ""
echo "✅ Diagnóstico completado"
echo "Para más información, revisar logs en Render Dashboard"
