#!/bin/bash
# Verificación completa del sistema en producción
# Fecha: 1 de junio de 2025

echo "=== VERIFICACIÓN COMPLETA DEL SISTEMA ==="
echo "Fecha: $(date)"
echo

# Variables
BACKEND_URL="https://libro-resoluciones-api.onrender.com"
FRONTEND_URL="https://libro-de-resoluciones-v2-9izd-fe0i5ihfg.vercel.app"

echo "🔧 CONFIGURACIÓN DEL SISTEMA:"
echo "Backend: $BACKEND_URL"
echo "Frontend: $FRONTEND_URL"
echo

# 1. Verificar estado del backend
echo "1️⃣ VERIFICANDO BACKEND..."
echo "----------------------------"
backend_status=$(curl -s -o /dev/null -w "%{http_code}" "$BACKEND_URL")
echo "Estado del backend: $backend_status"

if [ "$backend_status" = "200" ]; then
    echo "✅ Backend accesible"
else
    echo "❌ Backend no accesible"
fi

# 2. Verificar datos en base de datos
echo
echo "2️⃣ VERIFICANDO DATOS EN BASE DE DATOS..."
echo "----------------------------------------"
data_count=$(curl -s "$BACKEND_URL/api/books/all" | jq '. | length' 2>/dev/null || echo "Error")
echo "Número de resoluciones en BD: $data_count"

if [ "$data_count" -gt 0 ] 2>/dev/null; then
    echo "✅ Base de datos contiene $data_count resoluciones"
    
    # Mostrar primeras 3 resoluciones
    echo
    echo "📄 Primeras 3 resoluciones:"
    curl -s "$BACKEND_URL/api/books/all" | jq '.[0:3] | .[] | {NumdeResolucion, asunto}' 2>/dev/null || echo "Error al parsear JSON"
else
    echo "❌ Base de datos vacía o error en consulta"
fi

# 3. Verificar estado del frontend
echo
echo "3️⃣ VERIFICANDO FRONTEND..."
echo "---------------------------"
frontend_status=$(curl -s -o /dev/null -w "%{http_code}" "$FRONTEND_URL")
echo "Estado del frontend: $frontend_status"

if [ "$frontend_status" = "200" ]; then
    echo "✅ Frontend accesible"
else
    echo "❌ Frontend no accesible"
fi

# 4. Verificar página de búsquedas
echo
echo "4️⃣ VERIFICANDO PÁGINA DE BÚSQUEDAS..."
echo "-------------------------------------"
busquedas_status=$(curl -s -o /dev/null -w "%{http_code}" "$FRONTEND_URL/busquedas")
echo "Estado de /busquedas: $busquedas_status"

if [ "$busquedas_status" = "200" ]; then
    echo "✅ Página de búsquedas accesible"
else
    echo "❌ Página de búsquedas no accesible"
fi

# 5. Test de autenticación
echo
echo "5️⃣ VERIFICANDO AUTENTICACIÓN..."
echo "-------------------------------"
echo "Probando login de administrador..."

login_response=$(curl -s -X POST "$BACKEND_URL/api/user/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@admin.com","password":"admin123"}')

token=$(echo "$login_response" | jq -r '.token' 2>/dev/null)

if [ "$token" != "null" ] && [ "$token" != "" ]; then
    echo "✅ Autenticación exitosa"
    echo "Token obtenido: ${token:0:20}..."
else
    echo "❌ Error en autenticación"
    echo "Respuesta: $login_response"
fi

# 6. Verificar APIs protegidas
if [ "$token" != "null" ] && [ "$token" != "" ]; then
    echo
    echo "6️⃣ VERIFICANDO APIs PROTEGIDAS..."
    echo "---------------------------------"
    
    protected_response=$(curl -s "$BACKEND_URL/api/books/all" \
      -H "Authorization: Bearer $token")
    
    protected_count=$(echo "$protected_response" | jq '. | length' 2>/dev/null || echo "Error")
    
    if [ "$protected_count" -gt 0 ] 2>/dev/null; then
        echo "✅ APIs protegidas funcionando correctamente"
        echo "Resoluciones accesibles con token: $protected_count"
    else
        echo "❌ Error en APIs protegidas"
    fi
fi

# 7. Verificar conectividad completa
echo
echo "7️⃣ VERIFICANDO CONECTIVIDAD COMPLETA..."
echo "---------------------------------------"

# Test CORS
cors_test=$(curl -s -H "Origin: $FRONTEND_URL" \
  -H "Access-Control-Request-Method: GET" \
  -H "Access-Control-Request-Headers: Content-Type" \
  -X OPTIONS "$BACKEND_URL/api/books/all" \
  -w "%{http_code}" -o /dev/null)

echo "Test CORS: $cors_test"

if [ "$cors_test" = "200" ] || [ "$cors_test" = "204" ]; then
    echo "✅ CORS configurado correctamente"
else
    echo "⚠️  CORS puede necesitar configuración"
fi

# Resumen final
echo
echo "=== RESUMEN FINAL ==="
echo "Fecha de verificación: $(date)"
echo "Backend: $backend_status"
echo "Frontend: $frontend_status"
echo "Datos en BD: $data_count resoluciones"
echo "Autenticación: $([ "$token" != "null" ] && [ "$token" != "" ] && echo "✅ OK" || echo "❌ Error")"
echo
echo "🎯 ESTADO DEL SISTEMA: $([ "$backend_status" = "200" ] && [ "$frontend_status" = "200" ] && [ "$data_count" -gt 0 ] 2>/dev/null && echo "✅ OPERATIVO" || echo "⚠️  NECESITA ATENCIÓN")"
echo

# Instrucciones para el usuario
echo "📋 PRÓXIMOS PASOS RECOMENDADOS:"
echo "1. Esperar 2-3 minutos para que Vercel redeploy el frontend"
echo "2. Verificar que la variable VITE_API_BASE_URL esté configurada en Vercel"
echo "3. Probar manualmente el frontend en $FRONTEND_URL/busquedas"
echo "4. Verificar que las 9 resoluciones se muestren automáticamente"
echo
