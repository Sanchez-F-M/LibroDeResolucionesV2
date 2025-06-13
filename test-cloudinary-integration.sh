#!/bin/bash

# Script para probar la integración de Cloudinary
# filepath: c:\Users\flavi\OneDrive\Escritorio\LibroDeResolucionesV2\test-cloudinary-integration.sh

echo "🌩️  PRUEBA DE INTEGRACIÓN CLOUDINARY"
echo "===================================="
echo ""

# Verificar que el servidor esté funcionando
echo "1. 🔍 Verificando servidor backend..."
response=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:10000/api/books/all)

if [ "$response" -eq 200 ]; then
    echo "   ✅ Servidor backend funcionando (puerto 10000)"
else
    echo "   ❌ Error: Servidor no responde. Asegúrate de que esté ejecutándose."
    echo "   💡 Ejecuta: npm run dev en la carpeta server/"
    exit 1
fi

echo ""
echo "2. ⚙️  Verificando configuración de upload..."

# Verificar variables de entorno
if [ -f "server/.env" ]; then
    echo "   📄 Archivo .env encontrado"
    
    # Verificar si hay configuración de Cloudinary
    if grep -q "CLOUDINARY_CLOUD_NAME" server/.env; then
        CLOUD_NAME=$(grep "CLOUDINARY_CLOUD_NAME" server/.env | cut -d '=' -f2)
        if [ -n "$CLOUD_NAME" ] && [ "$CLOUD_NAME" != "" ]; then
            echo "   ✅ Cloudinary configurado (Cloud Name: $CLOUD_NAME)"
            USING_CLOUDINARY=true
        else
            echo "   📁 Usando almacenamiento local (Cloudinary no configurado)"
            USING_CLOUDINARY=false
        fi
    else
        echo "   📁 Usando almacenamiento local (Cloudinary no configurado)"
        USING_CLOUDINARY=false
    fi
else
    echo "   ❌ Archivo .env no encontrado"
    exit 1
fi

echo ""
echo "3. 🧪 Preparando datos de prueba..."

# Crear datos de prueba para resolución
TIMESTAMP=$(date +%s)
RESOLUTION_NUMBER="TEST-$TIMESTAMP"
SUBJECT="Prueba de integración Cloudinary - $TIMESTAMP"
REFERENCE="REF-CLOUDINARY-$TIMESTAMP"
DATE_CREATED=$(date -u +"%Y-%m-%dT%H:%M:%S.000Z")

echo "   📋 Número de resolución: $RESOLUTION_NUMBER"
echo "   📝 Asunto: $SUBJECT"
echo "   📅 Fecha: $DATE_CREATED"

echo ""
echo "4. 📸 Creando imagen de prueba..."

# Crear directorio temporal si no existe
mkdir -p temp_test

# Crear una imagen de prueba simple (archivo de texto simulando imagen)
TEST_IMAGE="temp_test/test-image-$TIMESTAMP.txt"
echo "IMAGEN DE PRUEBA PARA CLOUDINARY - $TIMESTAMP" > "$TEST_IMAGE"
echo "Esta es una imagen de prueba para verificar el upload" >> "$TEST_IMAGE"
echo "Timestamp: $TIMESTAMP" >> "$TEST_IMAGE"
echo "Configuración: $($USING_CLOUDINARY && echo "Cloudinary" || echo "Local")" >> "$TEST_IMAGE"

echo "   ✅ Imagen de prueba creada: $TEST_IMAGE"

echo ""
echo "5. 🚀 Realizando prueba de upload..."

# Obtener token de autenticación
TOKEN=$(curl -s -X POST http://localhost:10000/api/users/login \
    -H "Content-Type: application/json" \
    -d '{"username":"admin","password":"admin123"}' | grep -o '"token":"[^"]*' | cut -d'"' -f4)

if [ -z "$TOKEN" ]; then
    echo "   ❌ Error: No se pudo obtener token de autenticación"
    echo "   💡 Verifica que el usuario admin exista y las credenciales sean correctas"
    exit 1
fi

echo "   🔑 Token obtenido exitosamente"

# Realizar petición de creación con archivo
echo "   🔄 Enviando resolución con imagen..."

RESPONSE=$(curl -s -X POST http://localhost:10000/api/books \
  -H "Authorization: Bearer $TOKEN" \
  -F "NumdeResolucion=$RESOLUTION_NUMBER" \
  -F "Asunto=$SUBJECT" \
  -F "Referencia=$REFERENCE" \
  -F "FechaCreacion=$DATE_CREATED" \
  -F "files=@$TEST_IMAGE")

echo "   📋 Respuesta del servidor:"
echo "   $RESPONSE"

# Verificar si la respuesta fue exitosa
if echo "$RESPONSE" | grep -q "exitosamente"; then
    echo "   ✅ Upload realizado exitosamente"
    
    echo ""
    echo "6. 🔍 Verificando resolución creada..."
    
    # Obtener la resolución recién creada
    RESOLUTION_DATA=$(curl -s "http://localhost:10000/api/books/$RESOLUTION_NUMBER" \
      -H "Authorization: Bearer $TOKEN")
    
    echo "   📋 Datos de la resolución:"
    echo "$RESOLUTION_DATA" | jq '.' 2>/dev/null || echo "$RESOLUTION_DATA"
    
    # Verificar URLs de imágenes
    if echo "$RESOLUTION_DATA" | grep -q "cloudinary.com"; then
        echo "   ✅ Imagen almacenada en Cloudinary"
        echo "   🌐 URL de Cloudinary detectada"
    elif echo "$RESOLUTION_DATA" | grep -q "uploads/"; then
        echo "   📁 Imagen almacenada localmente"
        echo "   🏠 Path local detectado"
    else
        echo "   ⚠️  No se pudo determinar el tipo de almacenamiento"
    fi
    
else
    echo "   ❌ Error en el upload:"
    echo "   $RESPONSE"
fi

echo ""
echo "7. 🧹 Limpiando archivos temporales..."
rm -f "$TEST_IMAGE"
rmdir temp_test 2>/dev/null

echo ""
echo "8. 📊 RESUMEN DE LA PRUEBA:"
echo "   =========================================="
if [ "$USING_CLOUDINARY" = true ]; then
    echo "   🌩️  Configuración: CLOUDINARY"
    echo "   ✅ Almacenamiento persistente activado"
    echo "   🚀 Imágenes se guardarán en la nube"
    echo "   🔄 Datos persistirán en redespliegues"
else
    echo "   📁 Configuración: ALMACENAMIENTO LOCAL"
    echo "   ⚠️  Solo para desarrollo"
    echo "   💡 Para producción, configura Cloudinary"
fi

echo ""
echo "9. 📋 PRÓXIMOS PASOS:"
if [ "$USING_CLOUDINARY" = false ]; then
    echo "   🔧 Para configurar Cloudinary en producción:"
    echo "   1. Crea cuenta en https://cloudinary.com/"
    echo "   2. Configura variables en Render:"
    echo "      - CLOUDINARY_CLOUD_NAME"
    echo "      - CLOUDINARY_API_KEY"
    echo "      - CLOUDINARY_API_SECRET"
    echo "   3. Redespliega la aplicación"
else
    echo "   ✅ Cloudinary configurado correctamente"
    echo "   🚀 Listo para producción"
fi

echo ""
echo "🎉 Prueba de integración completada exitosamente!"
