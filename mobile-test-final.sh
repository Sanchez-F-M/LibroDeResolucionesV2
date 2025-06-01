#!/bin/bash

# Script de Prueba Final para Dispositivos Móviles
# Versión: 1.0 - Enero 2025

echo "🔋 INICIANDO PRUEBA FINAL PARA DISPOSITIVOS MÓVILES"
echo "=================================================="

# Obtener IP local
LOCAL_IP=$(ipconfig | grep "IPv4" | grep "192.168" | head -1 | awk '{print $NF}')
if [ -z "$LOCAL_IP" ]; then
    LOCAL_IP="192.168.1.235"
fi

echo "📍 IP Local detectada: $LOCAL_IP"

# Verificar servicios activos
echo ""
echo "🔍 VERIFICANDO SERVICIOS..."
echo "----------------------------"

BACKEND_STATUS=$(curl -s http://localhost:10000/api/books/all | head -c 50)
if [ ! -z "$BACKEND_STATUS" ]; then
    echo "✅ Backend: ACTIVO en puerto 10000"
else
    echo "❌ Backend: INACTIVO - Iniciando..."
    cd "c:\Users\flavi\OneDrive\Escritorio\LibroDeResolucionesV2\server"
    npm start &
    sleep 5
fi

FRONTEND_CHECK=$(netstat -an | grep ":5173")
if [ ! -z "$FRONTEND_CHECK" ]; then
    echo "✅ Frontend: ACTIVO en puerto 5173"
else
    echo "❌ Frontend: INACTIVO - Iniciando..."
    cd "c:\Users\flavi\OneDrive\Escritorio\LibroDeResolucionesV2\front"
    npm run dev &
    sleep 5
fi

echo ""
echo "📱 URLS PARA TESTING MÓVIL"
echo "==========================="
echo "🌐 Aplicación Principal: http://$LOCAL_IP:5173"
echo "🔧 Diagnóstico Móvil: http://$LOCAL_IP:5173/mobile-diagnostic.html"
echo "⚙️  API Backend: http://$LOCAL_IP:10000/api/books/all"
echo "🖼️  Imagen de Prueba: http://$LOCAL_IP:10000/uploads/1746055049685-diagrama_ep.png"

echo ""
echo "📋 CHECKLIST PARA PRUEBA MÓVIL"
echo "==============================="
echo "1. ✅ Conectar dispositivo móvil a la misma WiFi"
echo "2. ✅ Abrir navegador móvil (Chrome/Safari)"
echo "3. ✅ Navegar a: http://$LOCAL_IP:5173"
echo "4. ✅ Probar búsqueda de resoluciones"
echo "5. ✅ Verificar carga de imágenes"
echo "6. ✅ Probar descarga de documentos"
echo "7. ✅ Verificar herramienta diagnóstico: http://$LOCAL_IP:5173/mobile-diagnostic.html"

echo ""
echo "🔧 COMANDOS DE VERIFICACIÓN"
echo "==========================="
echo "# Verificar API desde móvil:"
echo "curl http://$LOCAL_IP:10000/api/books/all"
echo ""
echo "# Verificar imagen desde móvil:"
echo "curl -I http://$LOCAL_IP:10000/uploads/1746055049685-diagrama_ep.png"

echo ""
echo "📊 ESTADO ACTUAL DEL SISTEMA"
echo "============================="

# Verificar base de datos
DB_COUNT=$(curl -s http://localhost:10000/api/books/all | grep -o '"NumdeResolucion"' | wc -l)
echo "📚 Resoluciones en base de datos: $DB_COUNT"

# Verificar archivos de imagen disponibles
UPLOAD_COUNT=$(ls "c:\Users\flavi\OneDrive\Escritorio\LibroDeResolucionesV2\server\uploads" 2>/dev/null | wc -l)
echo "🖼️  Archivos en uploads: $UPLOAD_COUNT"

# Test de conectividad básica
echo ""
echo "🌐 TEST DE CONECTIVIDAD"
echo "=======================" 
ping -c 1 $LOCAL_IP > /dev/null 2>&1
if [ $? -eq 0 ]; then
    echo "✅ IP local accesible"
else
    echo "❌ Problema de conectividad IP local"
fi

curl -s http://localhost:10000/api/books/all > /dev/null 2>&1
if [ $? -eq 0 ]; then
    echo "✅ API Backend responde"
else
    echo "❌ API Backend no responde"
fi

curl -s http://localhost:5173 > /dev/null 2>&1
if [ $? -eq 0 ]; then
    echo "✅ Frontend responde"
else
    echo "❌ Frontend no responde"
fi

echo ""
echo "🎯 PRÓXIMOS PASOS"
echo "=================="
echo "1. Usar dispositivo móvil conectado a WiFi"
echo "2. Abrir http://$LOCAL_IP:5173 en el navegador móvil"
echo "3. Probar funcionalidad completa"
echo "4. Si hay problemas, usar http://$LOCAL_IP:5173/mobile-diagnostic.html"
echo "5. Reportar cualquier error encontrado"

echo ""
echo "✨ SISTEMA LISTO PARA PRUEBAS MÓVILES ✨"
echo "========================================"
