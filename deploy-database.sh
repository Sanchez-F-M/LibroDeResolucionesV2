#!/bin/bash
# Script para poblar la base de datos de producción en Render

API_BASE_URL="https://libro-resoluciones-api.onrender.com"

echo "🚀 Iniciando población de base de datos de producción..."

# 1. Hacer login para obtener token
echo "📝 Haciendo login..."
LOGIN_RESPONSE=$(curl -s -X POST "${API_BASE_URL}/api/user/login" \
  -H "Content-Type: application/json" \
  -d '{
    "Nombre": "admin",
    "Contrasena": "admin123"
  }')

echo "Respuesta del login: $LOGIN_RESPONSE"

# Extraer token de la respuesta
TOKEN=$(echo $LOGIN_RESPONSE | grep -o '"token":"[^"]*"' | cut -d'"' -f4)

if [ -z "$TOKEN" ]; then
    echo "❌ Error: No se pudo obtener el token de autenticación"
    exit 1
fi

echo "✅ Token obtenido exitosamente"

# 2. Crear resoluciones de prueba
echo "📄 Creando resoluciones..."

# Resolución 1
echo "Creando resolución RES-001-2024..."
curl -s -X POST "${API_BASE_URL}/api/books" \
  -H "Authorization: Bearer $TOKEN" \
  -F "NumdeResolucion=RES-001-2024" \
  -F "Asunto=Normativa de Funcionamiento Interno" \
  -F "Referencia=REF-2024-001" \
  -F "FechaCreacion=2024-01-15"

# Resolución 2
echo "Creando resolución RES-002-2024..."
curl -s -X POST "${API_BASE_URL}/api/books" \
  -H "Authorization: Bearer $TOKEN" \
  -F "NumdeResolucion=RES-002-2024" \
  -F "Asunto=Presupuesto Anual 2024" \
  -F "Referencia=REF-2024-002" \
  -F "FechaCreacion=2024-01-20"

# Resolución 3
echo "Creando resolución RES-003-2024..."
curl -s -X POST "${API_BASE_URL}/api/books" \
  -H "Authorization: Bearer $TOKEN" \
  -F "NumdeResolucion=RES-003-2024" \
  -F "Asunto=Protocolo de Seguridad" \
  -F "Referencia=REF-2024-003" \
  -F "FechaCreacion=2024-02-01"

# Resolución 4
echo "Creando resolución RES-004-2024..."
curl -s -X POST "${API_BASE_URL}/api/books" \
  -H "Authorization: Bearer $TOKEN" \
  -F "NumdeResolucion=RES-004-2024" \
  -F "Asunto=Política de Recursos Humanos" \
  -F "Referencia=REF-2024-004" \
  -F "FechaCreacion=2024-02-15"

# Resolución 5
echo "Creando resolución RES-005-2024..."
curl -s -X POST "${API_BASE_URL}/api/books" \
  -H "Authorization: Bearer $TOKEN" \
  -F "NumdeResolucion=RES-005-2024" \
  -F "Asunto=Restructuración Organizacional" \
  -F "Referencia=REF-2024-005" \
  -F "FechaCreacion=2024-03-01"

# Resolución 6
echo "Creando resolución RES-006-2024..."
curl -s -X POST "${API_BASE_URL}/api/books" \
  -H "Authorization: Bearer $TOKEN" \
  -F "NumdeResolucion=RES-006-2024" \
  -F "Asunto=Implementación de Software" \
  -F "Referencia=REF-2024-006" \
  -F "FechaCreacion=2024-03-15"

# Resolución 7
echo "Creando resolución RES-007-2024..."
curl -s -X POST "${API_BASE_URL}/api/books" \
  -H "Authorization: Bearer $TOKEN" \
  -F "NumdeResolucion=RES-007-2024" \
  -F "Asunto=Auditoría Interna" \
  -F "Referencia=REF-2024-007" \
  -F "FechaCreacion=2024-04-01"

# Resolución 8
echo "Creando resolución RES-008-2024..."
curl -s -X POST "${API_BASE_URL}/api/books" \
  -H "Authorization: Bearer $TOKEN" \
  -F "NumdeResolucion=RES-008-2024" \
  -F "Asunto=Capacitación del Personal" \
  -F "Referencia=REF-2024-008" \
  -F "FechaCreacion=2024-04-15"

echo "✅ Población de base de datos completada"

# 3. Verificar que las resoluciones se crearon
echo "🔍 Verificando resoluciones creadas..."
curl -s "${API_BASE_URL}/api/books/all" | head -50

echo ""
echo "🎉 Deploy de base de datos completado!"
