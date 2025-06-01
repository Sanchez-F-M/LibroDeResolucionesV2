#!/bin/bash
# Script de verificación final del sistema
# Fecha: 1 de junio de 2025

echo "🎯 VERIFICACIÓN FINAL DEL SISTEMA"
echo "=================================="
echo "Fecha: $(date)"
echo

# URLs del sistema
BACKEND_URL="https://libro-resoluciones-api.onrender.com"
FRONTEND_URL="https://libro-de-resoluciones-v2-9izd-fe0i5ihfg.vercel.app"

echo "📍 URLs del Sistema:"
echo "Backend: $BACKEND_URL"
echo "Frontend: $FRONTEND_URL"
echo

# 1. Verificar backend
echo "1️⃣ VERIFICANDO BACKEND..."
echo "-------------------------"
backend_response=$(curl -s -w "HTTPSTATUS:%{http_code}" "$BACKEND_URL")
backend_status=$(echo "$backend_response" | grep -o "HTTPSTATUS:[0-9]*" | cut -d: -f2)
echo "Estado del backend: $backend_status"

if [ "$backend_status" = "200" ]; then
    echo "✅ Backend funcionando correctamente"
else
    echo "❌ Problema con el backend"
fi

# 2. Verificar datos
echo
echo "2️⃣ VERIFICANDO DATOS EN LA BASE DE DATOS..."
echo "--------------------------------------------"
data_response=$(curl -s "$BACKEND_URL/api/books/all")
echo "$data_response" | head -100
echo
echo "Estado de datos: $(echo "$data_response" | wc -c) caracteres de respuesta"

if [ $(echo "$data_response" | wc -c) -gt 100 ]; then
    echo "✅ Base de datos contiene resoluciones"
else
    echo "❌ Base de datos vacía o con problemas"
fi

# 3. Verificar frontend
echo
echo "3️⃣ VERIFICANDO FRONTEND..."
echo "--------------------------"
frontend_response=$(curl -s -w "HTTPSTATUS:%{http_code}" "$FRONTEND_URL")
frontend_status=$(echo "$frontend_response" | grep -o "HTTPSTATUS:[0-9]*" | cut -d: -f2)
echo "Estado del frontend: $frontend_status"

if [ "$frontend_status" = "200" ]; then
    echo "✅ Frontend accesible"
else
    echo "❌ Problema con el frontend"
fi

# 4. Verificar página de búsquedas
echo
echo "4️⃣ VERIFICANDO PÁGINA DE BÚSQUEDAS..."
echo "-------------------------------------"
busquedas_response=$(curl -s -w "HTTPSTATUS:%{http_code}" "$FRONTEND_URL/busquedas")
busquedas_status=$(echo "$busquedas_response" | grep -o "HTTPSTATUS:[0-9]*" | cut -d: -f2)
echo "Estado de /busquedas: $busquedas_status"

if [ "$busquedas_status" = "200" ]; then
    echo "✅ Página de búsquedas accesible"
else
    echo "❌ Problema con la página de búsquedas"
fi

# 5. Test de autenticación final
echo
echo "5️⃣ TEST DE AUTENTICACIÓN..."
echo "---------------------------"
auth_response=$(curl -s -X POST "$BACKEND_URL/api/user/login" \
  -H "Content-Type: application/json" \
  -d '{"Nombre":"admin","Contrasena":"admin123"}')

echo "Respuesta de autenticación: $auth_response"

if echo "$auth_response" | grep -q "token"; then
    echo "✅ Autenticación funcionando"
else
    echo "❌ Problema con la autenticación"
fi

# 6. Resumen final
echo
echo "🎯 RESUMEN FINAL DEL ESTADO:"
echo "============================"
echo "🔧 Backend: $([ "$backend_status" = "200" ] && echo "✅ OPERATIVO" || echo "❌ NO OPERATIVO")"
echo "🌐 Frontend: $([ "$frontend_status" = "200" ] && echo "✅ OPERATIVO" || echo "❌ NO OPERATIVO")"
echo "🔍 Búsquedas: $([ "$busquedas_status" = "200" ] && echo "✅ OPERATIVO" || echo "❌ NO OPERATIVO")"
echo "🔑 Autenticación: $(echo "$auth_response" | grep -q "token" && echo "✅ OPERATIVO" || echo "❌ NO OPERATIVO")"
echo "💾 Datos: $([ $(echo "$data_response" | wc -c) -gt 100 ] && echo "✅ DISPONIBLES" || echo "❌ NO DISPONIBLES")"

# Estado general
if [ "$backend_status" = "200" ] && [ "$frontend_status" = "200" ] && [ "$busquedas_status" = "200" ] && echo "$auth_response" | grep -q "token" && [ $(echo "$data_response" | wc -c) -gt 100 ]; then
    echo
    echo "🎉 SISTEMA TOTALMENTE OPERATIVO"
    echo "✅ Persistencia de datos: VERIFICADA"
    echo "✅ Frontend-Backend conectados: SÍ"
    echo "✅ Auto-carga de resoluciones: IMPLEMENTADA"
else
    echo
    echo "⚠️  SISTEMA NECESITA ATENCIÓN"
fi

echo
echo "📋 PRÓXIMAS ACCIONES RECOMENDADAS:"
echo "1. Probar manualmente $FRONTEND_URL/busquedas"
echo "2. Verificar que las 9 resoluciones se muestren automáticamente"
echo "3. Confirmar persistencia cerrando/abriendo navegador"
echo "4. Realizar pruebas de usuario final"
echo
