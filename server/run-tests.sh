#!/bin/bash

echo "🚀 INICIANDO PRUEBAS DEL SISTEMA DE ENLACES MÓVILES"
echo ""

# Matar procesos node existentes
echo "🔄 Limpiando procesos anteriores..."
taskkill //F //IM node.exe 2>/dev/null || true
sleep 2

# Iniciar servidor en segundo plano
echo "🔄 Iniciando servidor backend..."
cd server
node index.js &
SERVER_PID=$!

# Esperar a que el servidor esté listo
echo "⏳ Esperando a que el servidor esté listo..."
sleep 5

# Verificar que el servidor responde
echo "🔍 Verificando conectividad..."
curl -s http://localhost:3000/health > /dev/null

if [ $? -eq 0 ]; then
  echo "✅ Servidor respondiendo correctamente"
  echo ""
  
  # Ejecutar pruebas
  echo "🧪 Ejecutando pruebas..."
  node test-mobile-links.js
  
else
  echo "❌ Servidor no responde"
  echo "Por favor, inicia el servidor manualmente con: cd server && node index.js"
fi

# Limpiar
echo ""
echo "🔄 Limpiando..."
kill $SERVER_PID 2>/dev/null || true

echo "✅ Pruebas completadas"
