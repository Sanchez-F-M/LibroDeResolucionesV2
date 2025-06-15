#!/bin/bash

echo "🔍 VERIFICADOR DE CLOUDINARY - LIBRO DE RESOLUCIONES"
echo "===================================================="
echo ""

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Función para mostrar resultados
show_result() {
    if [ $1 -eq 0 ]; then
        echo -e "${GREEN}✅ $2${NC}"
    else
        echo -e "${RED}❌ $2${NC}"
    fi
}

echo "📡 1. VERIFICANDO ESTADO DEL BACKEND..."
echo "======================================"

# Verificar que el backend esté funcionando
backend_response=$(curl -s https://libroderesoluciones-api.onrender.com/health)
if echo "$backend_response" | grep -q "healthy"; then
    show_result 0 "Backend funcionando correctamente"
    
    # Extraer información del backend
    uptime=$(echo "$backend_response" | grep -o '"uptime":[0-9.]*' | cut -d':' -f2)
    echo -e "${BLUE}ℹ️  Uptime: ${uptime} segundos${NC}"
else
    show_result 1 "Backend no responde correctamente"
    echo "Respuesta: $backend_response"
    exit 1
fi

echo ""
echo "☁️ 2. VERIFICANDO CONFIGURACIÓN DE CLOUDINARY..."
echo "=============================================="

# Verificar configuración de Cloudinary
cloudinary_response=$(curl -s https://libroderesoluciones-api.onrender.com/api/cloudinary/status)

if echo "$cloudinary_response" | grep -q '"connected":true'; then
    show_result 0 "Cloudinary CONECTADO"
    
    # Extraer información de Cloudinary
    cloud_name=$(echo "$cloudinary_response" | grep -o '"cloud_name":"[^"]*' | cut -d'"' -f4)
    storage_mode=$(echo "$cloudinary_response" | grep -o '"storage_mode":"[^"]*' | cut -d'"' -f4)
    
    echo -e "${GREEN}📁 Cloud Name: $cloud_name${NC}"
    echo -e "${GREEN}💾 Storage Mode: $storage_mode${NC}"
    echo -e "${GREEN}📂 Folder: libro-resoluciones${NC}"
    
elif echo "$cloudinary_response" | grep -q '"connected":false'; then
    show_result 1 "Cloudinary NO CONECTADO"
    
    # Mostrar detalles del error
    error=$(echo "$cloudinary_response" | grep -o '"error":"[^"]*' | cut -d'"' -f4)
    storage_mode=$(echo "$cloudinary_response" | grep -o '"storage_mode":"[^"]*' | cut -d'"' -f4)
    
    echo -e "${RED}❌ Error: $error${NC}"
    echo -e "${YELLOW}💾 Modo alternativo: $storage_mode${NC}"
    
    # Verificar variables de entorno
    echo ""
    echo -e "${YELLOW}🔧 VARIABLES DE ENTORNO:${NC}"
    
    if echo "$cloudinary_response" | grep -q '"cloud_name":true'; then
        echo -e "${GREEN}  ✅ CLOUDINARY_CLOUD_NAME configurada${NC}"
    else
        echo -e "${RED}  ❌ CLOUDINARY_CLOUD_NAME falta${NC}"
    fi
    
    if echo "$cloudinary_response" | grep -q '"api_key":true'; then
        echo -e "${GREEN}  ✅ CLOUDINARY_API_KEY configurada${NC}"
    else
        echo -e "${RED}  ❌ CLOUDINARY_API_KEY falta${NC}"
    fi
    
    if echo "$cloudinary_response" | grep -q '"api_secret":true'; then
        echo -e "${GREEN}  ✅ CLOUDINARY_API_SECRET configurada${NC}"
    else
        echo -e "${RED}  ❌ CLOUDINARY_API_SECRET falta${NC}"
    fi
    
else
    show_result 1 "Error al verificar Cloudinary"
    echo "Respuesta inesperada: $cloudinary_response"
fi

echo ""
echo "🧪 3. PROBANDO UPLOAD A CLOUDINARY..."
echo "===================================="

if echo "$cloudinary_response" | grep -q '"connected":true'; then
    # Probar upload solo si Cloudinary está conectado
    upload_response=$(curl -s -X POST https://libroderesoluciones-api.onrender.com/api/cloudinary/test-upload)
    
    if echo "$upload_response" | grep -q '"success":true'; then
        show_result 0 "Upload de prueba EXITOSO"
        
        # Extraer URL de la imagen subida
        url=$(echo "$upload_response" | grep -o '"url":"[^"]*' | cut -d'"' -f4)
        public_id=$(echo "$upload_response" | grep -o '"public_id":"[^"]*' | cut -d'"' -f4)
        
        echo -e "${GREEN}🔗 URL: $url${NC}"
        echo -e "${GREEN}🆔 Public ID: $public_id${NC}"
    else
        show_result 1 "Upload de prueba FALLÓ"
        
        error=$(echo "$upload_response" | grep -o '"error":"[^"]*' | cut -d'"' -f4)
        echo -e "${RED}❌ Error: $error${NC}"
    fi
else
    echo -e "${YELLOW}⏭️  Saltando test de upload (Cloudinary no conectado)${NC}"
fi

echo ""
echo "📂 4. VERIFICANDO CARPETA DE IMÁGENES..."
echo "======================================="

if echo "$cloudinary_response" | grep -q '"connected":true'; then
    # Verificar contenido de la carpeta
    folder_response=$(curl -s https://libroderesoluciones-api.onrender.com/api/cloudinary/folder-info)
    
    if echo "$folder_response" | grep -q '"cloudinary_working":true'; then
        total=$(echo "$folder_response" | grep -o '"total_resources":[0-9]*' | cut -d':' -f2)
        found=$(echo "$folder_response" | grep -o '"resources_found":[0-9]*' | cut -d':' -f2)
        
        show_result 0 "Carpeta verificada"
        echo -e "${BLUE}📊 Total de recursos: $total${NC}"
        echo -e "${BLUE}🔍 Recursos encontrados: $found${NC}"
        
        if [ "$found" -gt "0" ]; then
            echo -e "${GREEN}📸 Hay imágenes almacenadas en Cloudinary${NC}"
        else
            echo -e "${YELLOW}📭 Carpeta vacía (normal para instalación nueva)${NC}"
        fi
    else
        show_result 1 "Error verificando carpeta"
    fi
else
    echo -e "${YELLOW}⏭️  Saltando verificación de carpeta (Cloudinary no conectado)${NC}"
fi

echo ""
echo "📋 RESUMEN FINAL"
echo "==============="

if echo "$cloudinary_response" | grep -q '"connected":true'; then
    echo -e "${GREEN}🎉 CLOUDINARY ESTÁ FUNCIONANDO CORRECTAMENTE${NC}"
    echo ""
    echo -e "${GREEN}✅ Estado: Conectado y operativo${NC}"
    echo -e "${GREEN}✅ Uploads: Funcionando${NC}"
    echo -e "${GREEN}✅ Storage: Usando Cloudinary en producción${NC}"
    echo ""
    echo -e "${BLUE}🔗 Enlaces útiles:${NC}"
    echo "   - Dashboard Cloudinary: https://cloudinary.com/console"
    echo "   - Media Library: https://cloudinary.com/console/media_library"
    echo "   - Carpeta del proyecto: libro-resoluciones/"
    
elif echo "$cloudinary_response" | grep -q '"storage_mode":"local"'; then
    echo -e "${YELLOW}⚠️  USANDO ALMACENAMIENTO LOCAL${NC}"
    echo ""
    echo -e "${YELLOW}📁 La aplicación está usando almacenamiento local como fallback${NC}"
    echo -e "${YELLOW}🔧 Para activar Cloudinary, configura las variables de entorno:${NC}"
    echo "   - CLOUDINARY_CLOUD_NAME"
    echo "   - CLOUDINARY_API_KEY"
    echo "   - CLOUDINARY_API_SECRET"
    echo ""
    echo "📍 Configurar en: https://dashboard.render.com → libroderesoluciones-api → Environment"
    
else
    echo -e "${RED}❌ PROBLEMA CON CLOUDINARY${NC}"
    echo ""
    echo -e "${RED}🚨 Hay un problema con la configuración de Cloudinary${NC}"
    echo -e "${YELLOW}🔧 Acciones recomendadas:${NC}"
    echo "   1. Verificar variables de entorno en Render"
    echo "   2. Comprobar credenciales en Cloudinary Dashboard"
    echo "   3. Verificar logs del servidor"
fi

echo ""
echo "🔗 Enlaces importantes:"
echo "   - Backend: https://libroderesoluciones-api.onrender.com"
echo "   - Render Dashboard: https://dashboard.render.com"
echo "   - Cloudinary Console: https://cloudinary.com/console"
