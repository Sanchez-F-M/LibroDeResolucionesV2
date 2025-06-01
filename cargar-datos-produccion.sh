#!/bin/bash

echo "📚 SCRIPT DE CARGA DE DATOS DE PRUEBA EN PRODUCCIÓN"
echo "==================================================="
echo ""

BACKEND_URL="https://libro-resoluciones-api.onrender.com"

echo "🔐 1. Obteniendo token de autenticación..."
# Intentar login con credenciales admin
LOGIN_RESPONSE=$(curl -s -X POST ${BACKEND_URL}/api/user/login \
  -H "Content-Type: application/json" \
  -d '{"Nombre":"admin","Contrasena":"admin123"}')

TOKEN=$(echo "$LOGIN_RESPONSE" | grep -o '"token":"[^"]*"' | cut -d'"' -f4)

if [ -z "$TOKEN" ]; then
    echo "❌ Error: No se pudo obtener token de autenticación"
    echo "📋 Respuesta del login: $LOGIN_RESPONSE"
    echo ""
    echo "🔧 Intentando crear usuario admin primero..."
    
    CREATE_ADMIN_RESPONSE=$(curl -s -X POST ${BACKEND_URL}/create-admin)
    echo "📋 Respuesta create-admin: $CREATE_ADMIN_RESPONSE"
    
    # Intentar login nuevamente
    LOGIN_RESPONSE=$(curl -s -X POST ${BACKEND_URL}/api/user/login \
      -H "Content-Type: application/json" \
      -d '{"Nombre":"admin","Contrasena":"admin123"}')
    
    TOKEN=$(echo "$LOGIN_RESPONSE" | grep -o '"token":"[^"]*"' | cut -d'"' -f4)
    
    if [ -z "$TOKEN" ]; then
        echo "❌ Error: Aún no se pudo obtener token. Respuesta: $LOGIN_RESPONSE"
        exit 1
    fi
fi

echo "✅ Token obtenido exitosamente"
echo ""

echo "📊 2. Verificando estado actual de la base de datos..."
CURRENT_COUNT=$(curl -s ${BACKEND_URL}/api/books/all | grep -o '"NumdeResolucion"' | wc -l)
echo "📚 Resoluciones actuales en producción: $CURRENT_COUNT"
echo ""

echo "🔄 3. Creando resoluciones de prueba..."

# Resolución 1
echo "📄 Creando resolución PROD-001-2025..."
RESPONSE1=$(curl -s -X POST ${BACKEND_URL}/api/books \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "NumdeResolucion": "PROD-001-2025",
    "asunto": "Implementación de Sistema Digital de Resoluciones",
    "referencia": "Decreto N° 001/2025 - Modernización Tecnológica",
    "fetcha_creacion": "2025-06-01"
  }')

if echo "$RESPONSE1" | grep -q "NumdeResolucion"; then
    echo "✅ Resolución PROD-001-2025 creada exitosamente"
else
    echo "❌ Error creando PROD-001-2025: $RESPONSE1"
fi

# Resolución 2
echo "📄 Creando resolución PROD-002-2025..."
RESPONSE2=$(curl -s -X POST ${BACKEND_URL}/api/books \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "NumdeResolucion": "PROD-002-2025",
    "asunto": "Protocolo de Seguridad de Datos y Persistencia",
    "referencia": "Circular Técnica N° 002/2025 - Área de Informática",
    "fetcha_creacion": "2025-06-01"
  }')

if echo "$RESPONSE2" | grep -q "NumdeResolucion"; then
    echo "✅ Resolución PROD-002-2025 creada exitosamente"
else
    echo "❌ Error creando PROD-002-2025: $RESPONSE2"
fi

# Resolución 3
echo "📄 Creando resolución PROD-003-2025..."
RESPONSE3=$(curl -s -X POST ${BACKEND_URL}/api/books \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "NumdeResolucion": "PROD-003-2025",
    "asunto": "Configuración de Entorno de Producción",
    "referencia": "Nota Técnica N° 003/2025 - Departamento de Sistemas",
    "fetcha_creacion": "2025-06-01"
  }')

if echo "$RESPONSE3" | grep -q "NumdeResolucion"; then
    echo "✅ Resolución PROD-003-2025 creada exitosamente"
else
    echo "❌ Error creando PROD-003-2025: $RESPONSE3"
fi

# Resolución 4
echo "📄 Creando resolución PROD-004-2025..."
RESPONSE4=$(curl -s -X POST ${BACKEND_URL}/api/books \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "NumdeResolucion": "PROD-004-2025",
    "asunto": "Verificación de Persistencia de Datos",
    "referencia": "Test de Funcionalidad N° 004/2025 - Control de Calidad",
    "fetcha_creacion": "2025-06-01"
  }')

if echo "$RESPONSE4" | grep -q "NumdeResolucion"; then
    echo "✅ Resolución PROD-004-2025 creada exitosamente"
else
    echo "❌ Error creando PROD-004-2025: $RESPONSE4"
fi

# Resolución 5
echo "📄 Creando resolución PROD-005-2025..."
RESPONSE5=$(curl -s -X POST ${BACKEND_URL}/api/books \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "NumdeResolucion": "PROD-005-2025",
    "asunto": "Puesta en Marcha del Sistema en Producción",
    "referencia": "Acta de Entrega N° 005/2025 - Proyecto Finalizado",
    "fetcha_creacion": "2025-06-01"
  }')

if echo "$RESPONSE5" | grep -q "NumdeResolucion"; then
    echo "✅ Resolución PROD-005-2025 creada exitosamente"
else
    echo "❌ Error creando PROD-005-2025: $RESPONSE5"
fi

echo ""
echo "📊 4. Verificando datos cargados..."
FINAL_COUNT=$(curl -s ${BACKEND_URL}/api/books/all | grep -o '"NumdeResolucion"' | wc -l)
echo "📚 Total de resoluciones después de la carga: $FINAL_COUNT"

if [ "$FINAL_COUNT" -gt "$CURRENT_COUNT" ]; then
    echo "✅ ¡Datos cargados exitosamente en producción!"
    echo "🔢 Se agregaron $(($FINAL_COUNT - $CURRENT_COUNT)) nuevas resoluciones"
else
    echo "⚠️  No se detectaron cambios en el número de resoluciones"
fi

echo ""
echo "🌐 5. URLs para verificar:"
echo "   📋 API: ${BACKEND_URL}/api/books/all"
echo "   🖥️  Frontend: https://libro-de-resoluciones-v2-9izd-fe0i5ihfg.vercel.app/busquedas"
echo ""
echo "🎯 6. Próximo paso:"
echo "   Verificar que el frontend muestre automáticamente las $FINAL_COUNT resoluciones"
echo "   al acceder a la página de búsquedas"
echo ""
