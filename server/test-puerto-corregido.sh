#!/bin/bash

echo "🧪 ============================================"
echo "🧪 PRUEBA RÁPIDA - PUERTO CORREGIDO"
echo "🧪 ============================================"
echo ""

echo "1️⃣ Verificando servidor backend..."
BACKEND_STATUS=$(curl -s http://localhost:3000/health 2>&1)

if [ $? -eq 0 ]; then
  echo "✅ Backend respondiendo en puerto 3000"
else
  echo "❌ Backend NO responde - Inicia con: cd server && node index.js"
  exit 1
fi

echo ""
echo "2️⃣ Verificando servidor frontend..."
FRONTEND_STATUS=$(curl -s http://localhost:5173 2>&1 | head -n 5)

if [ $? -eq 0 ]; then
  echo "✅ Frontend respondiendo en puerto 5173"
else
  echo "❌ Frontend NO responde - Inicia con: cd front && npm run dev"
  exit 1
fi

echo ""
echo "3️⃣ Probando generación de enlace..."
RESPONSE=$(curl -s -X POST http://localhost:3000/admin/mobile-access/generate \
  -H "Content-Type: application/json" \
  -d '{"expiryHours": 2}')

# Extraer información
SUCCESS=$(echo "$RESPONSE" | grep -o '"success":true' | wc -l)

if [ $SUCCESS -gt 0 ]; then
  echo "✅ Enlace generado exitosamente"
  
  # Extraer token
  TOKEN=$(echo "$RESPONSE" | grep -o '"token":"[^"]*"' | cut -d'"' -f4)
  echo "   Token: ${TOKEN:0:20}..."
  
  # Extraer URL
  URL=$(echo "$RESPONSE" | grep -o '"url":"[^"]*"' | head -n 1 | cut -d'"' -f4)
  echo "   URL: $URL"
  
  # Verificar puerto
  if echo "$URL" | grep -q ":5173"; then
    echo "   ✅ Puerto correcto: 5173"
  else
    echo "   ❌ Puerto incorrecto: debería ser 5173"
  fi
  
else
  echo "❌ Error generando enlace"
  echo "$RESPONSE"
  exit 1
fi

echo ""
echo "4️⃣ Verificando token..."
VERIFY=$(curl -s -X POST http://localhost:3000/admin/mobile-access/verify \
  -H "Content-Type: application/json" \
  -d "{\"token\":\"$TOKEN\"}")

VALID=$(echo "$VERIFY" | grep -o '"valid":true' | wc -l)

if [ $VALID -gt 0 ]; then
  echo "✅ Token válido"
else
  echo "❌ Token inválido"
fi

echo ""
echo "5️⃣ Revocando acceso..."
REVOKE=$(curl -s -X DELETE http://localhost:3000/admin/mobile-access/revoke)

REVOKE_SUCCESS=$(echo "$REVOKE" | grep -o '"success":true' | wc -l)

if [ $REVOKE_SUCCESS -gt 0 ]; then
  echo "✅ Acceso revocado"
else
  echo "❌ Error revocando"
fi

echo ""
echo "🎉 ============================================"
echo "🎉 TODAS LAS PRUEBAS COMPLETADAS"
echo "🎉 ============================================"
echo ""
echo "📱 PRÓXIMO PASO:"
echo "1. Abre: http://localhost:5173"
echo "2. Inicia sesión como admin"
echo "3. Ve a: Administración de Enlaces Móviles"
echo "4. Genera un enlace"
echo "5. Haz clic en el botón verde 🔗 'Probar'"
echo "6. ¡Debería abrir la aplicación en el puerto 5173!"
echo ""
