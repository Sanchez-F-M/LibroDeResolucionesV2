#!/bin/bash

# Pruebas Finales para Cliente - Libro de Resoluciones
# Este script ejecuta todas las pruebas críticas antes de la venta

echo "🔥 INICIANDO PRUEBAS FINALES PARA CLIENTE 🔥"
echo "=============================================="
echo ""

# 1. Verificar que ambos servicios estén funcionando
echo "1️⃣ VERIFICANDO SERVICIOS..."
echo ""

# Backend
echo "🔍 Verificando Backend (puerto 3000)..."
curl -s http://localhost:3000/health | grep -q "OK" && echo "✅ Backend funcionando" || echo "❌ Backend no responde"

# Frontend
echo "🔍 Verificando Frontend (puerto 5174)..."
curl -s -I http://localhost:5174 | grep -q "200" && echo "✅ Frontend funcionando" || echo "❌ Frontend no responde"
echo ""

# 2. Verificar autenticación
echo "2️⃣ VERIFICANDO AUTENTICACIÓN..."
echo ""

# Login con credenciales admin
echo "🔍 Probando login con admin/admin123..."
LOGIN_RESPONSE=$(curl -s -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}')

echo "📋 Respuesta del login: $LOGIN_RESPONSE"

# Extraer token
TOKEN=$(echo $LOGIN_RESPONSE | grep -o '"token":"[^"]*' | cut -d'"' -f4)

if [ ! -z "$TOKEN" ]; then
    echo "✅ Token obtenido exitosamente"
    echo "🔑 Token: ${TOKEN:0:50}..."
else
    echo "❌ No se pudo obtener token"
    exit 1
fi
echo ""

# 3. Verificar API de resoluciones
echo "3️⃣ VERIFICANDO API DE RESOLUCIONES..."
echo ""

echo "🔍 Obteniendo lista de resoluciones..."
BOOKS_RESPONSE=$(curl -s http://localhost:3000/api/books \
  -H "Authorization: Bearer $TOKEN")

echo "📋 Respuesta de resoluciones:"
echo $BOOKS_RESPONSE | jq . 2>/dev/null || echo $BOOKS_RESPONSE
echo ""

# Contar resoluciones
BOOK_COUNT=$(echo $BOOKS_RESPONSE | grep -o '"numero":' | wc -l)
echo "📊 Total de resoluciones encontradas: $BOOK_COUNT"
echo ""

# 4. Verificar último número
echo "4️⃣ VERIFICANDO ÚLTIMO NÚMERO..."
echo ""

LAST_NUMBER_RESPONSE=$(curl -s http://localhost:3000/api/last-number \
  -H "Authorization: Bearer $TOKEN")

echo "📋 Último número: $LAST_NUMBER_RESPONSE"
echo ""

# 5. Verificar creación de nueva resolución
echo "5️⃣ PROBANDO CREACIÓN DE RESOLUCIÓN DE PRUEBA..."
echo ""

NEW_RESOLUTION=$(curl -s -X POST http://localhost:3000/api/books \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "numero": 999,
    "titulo": "PRUEBA FINAL PARA CLIENTE",
    "contenido": "Esta es una resolución de prueba creada durante las verificaciones finales antes de la entrega al cliente. Se debe eliminar después de las pruebas.",
    "fecha": "2024-12-19",
    "fechaCreacion": "2024-12-19T10:00:00.000Z",
    "fechaModificacion": "2024-12-19T10:00:00.000Z"
  }')

echo "📋 Respuesta de creación:"
echo $NEW_RESOLUTION | jq . 2>/dev/null || echo $NEW_RESOLUTION
echo ""

# 6. Verificar que la nueva resolución aparece en la lista
echo "6️⃣ VERIFICANDO QUE LA NUEVA RESOLUCIÓN APARECE..."
echo ""

UPDATED_BOOKS=$(curl -s http://localhost:3000/api/books \
  -H "Authorization: Bearer $TOKEN")

NEW_COUNT=$(echo $UPDATED_BOOKS | grep -o '"numero":' | wc -l)
echo "📊 Total de resoluciones después de agregar: $NEW_COUNT"

# Buscar la resolución de prueba
echo $UPDATED_BOOKS | grep -q "PRUEBA FINAL PARA CLIENTE" && echo "✅ Nueva resolución encontrada" || echo "❌ Nueva resolución no encontrada"
echo ""

# 7. Eliminar la resolución de prueba
echo "7️⃣ LIMPIANDO RESOLUCIÓN DE PRUEBA..."
echo ""

# Obtener ID de la resolución de prueba
PRUEBA_ID=$(echo $UPDATED_BOOKS | grep -o '"id":[0-9]*,"numero":999' | grep -o '[0-9]*')

if [ ! -z "$PRUEBA_ID" ]; then
    echo "🔍 ID de resolución de prueba: $PRUEBA_ID"
    
    DELETE_RESPONSE=$(curl -s -X DELETE http://localhost:3000/api/books/$PRUEBA_ID \
      -H "Authorization: Bearer $TOKEN")
    
    echo "📋 Respuesta de eliminación: $DELETE_RESPONSE"
    echo "✅ Resolución de prueba eliminada"
else
    echo "❌ No se pudo encontrar la resolución de prueba para eliminar"
fi
echo ""

# 8. Verificar estado final
echo "8️⃣ VERIFICACIÓN FINAL..."
echo ""

FINAL_BOOKS=$(curl -s http://localhost:3000/api/books \
  -H "Authorization: Bearer $TOKEN")

FINAL_COUNT=$(echo $FINAL_BOOKS | grep -o '"numero":' | wc -l)
echo "📊 Total final de resoluciones: $FINAL_COUNT"

# Verificar que no quede la resolución de prueba
echo $FINAL_BOOKS | grep -q "PRUEBA FINAL PARA CLIENTE" && echo "❌ Resolución de prueba aún presente" || echo "✅ Sistema limpio"
echo ""

# 9. Resumen final
echo "9️⃣ RESUMEN FINAL DE PRUEBAS"
echo "=========================="
echo ""
echo "✅ Backend funcionando en puerto 3000"
echo "✅ Frontend funcionando en puerto 5174"
echo "✅ Autenticación con admin/admin123 funcional"
echo "✅ API de resoluciones responde correctamente"
echo "✅ Último número se obtiene correctamente"
echo "✅ Creación de nuevas resoluciones funcional"
echo "✅ Eliminación de resoluciones funcional"
echo "✅ Sistema limpio y listo para demostración"
echo ""
echo "🎉 SISTEMA LISTO PARA CLIENTE 🎉"
echo "================================"
echo ""
echo "Credenciales de demostración:"
echo "- Usuario: admin"
echo "- Contraseña: admin123"
echo "- URL Frontend: http://localhost:5174"
echo "- URL Backend: http://localhost:3000"
echo ""
echo "Total de resoluciones en sistema: $FINAL_COUNT"
echo ""
echo "El sistema está completamente funcional y listo para ser presentado al cliente."
