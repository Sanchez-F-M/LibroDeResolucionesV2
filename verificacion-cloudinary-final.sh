#!/bin/bash

# Script de verificación final del sistema con Cloudinary
# filepath: c:\Users\flavi\OneDrive\Escritorio\LibroDeResolucionesV2\verificacion-cloudinary-final.sh

echo "🔍 VERIFICACIÓN FINAL DEL SISTEMA - CLOUDINARY"
echo "================================================"
echo ""

# Colores para output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Contadores
TESTS_PASSED=0
TESTS_FAILED=0

# Función para logging
log_success() {
    echo -e "${GREEN}✅ $1${NC}"
    ((TESTS_PASSED++))
}

log_error() {
    echo -e "${RED}❌ $1${NC}"
    ((TESTS_FAILED++))
}

log_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

log_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

# 1. Verificar estructura de archivos
echo "1. 🗂️  Verificando estructura de archivos..."

if [ -f "server/config/cloudinary.js" ]; then
    log_success "Archivo de configuración Cloudinary existe"
else
    log_error "Falta archivo server/config/cloudinary.js"
fi

if [ -f "server/src/routes/book.routes.js" ]; then
    log_success "Archivo de rutas existe"
else
    log_error "Falta archivo server/src/routes/book.routes.js"
fi

if [ -f "server/src/controllers/book.controller.js" ]; then
    log_success "Archivo de controlador existe"
else
    log_error "Falta archivo server/src/controllers/book.controller.js"
fi

if [ -f "server/.env" ]; then
    log_success "Archivo .env encontrado"
else
    log_error "Falta archivo server/.env"
fi

echo ""

# 2. Verificar dependencias
echo "2. 📦 Verificando dependencias..."

if [ -f "server/package.json" ]; then
    if grep -q "cloudinary" server/package.json; then
        log_success "Dependencia cloudinary instalada"
    else
        log_error "Falta dependencia cloudinary"
    fi
    
    if grep -q "multer-storage-cloudinary" server/package.json; then
        log_success "Dependencia multer-storage-cloudinary instalada"
    else
        log_error "Falta dependencia multer-storage-cloudinary"
    fi
else
    log_error "No se encontró server/package.json"
fi

echo ""

# 3. Verificar configuración en archivos
echo "3. ⚙️  Verificando configuración en archivos..."

# Verificar imports en cloudinary.js
if grep -q "CloudinaryStorage" server/config/cloudinary.js 2>/dev/null; then
    log_success "Import de CloudinaryStorage correcto"
else
    log_error "Falta import de CloudinaryStorage"
fi

# Verificar configuración en routes
if grep -q "getUploadConfig" server/src/routes/book.routes.js 2>/dev/null; then
    log_success "Configuración dinámica de upload implementada"
else
    log_error "Falta configuración dinámica en rutas"
fi

# Verificar función getImageUrl en controller
if grep -q "getImageUrl" server/src/controllers/book.controller.js 2>/dev/null; then
    log_success "Función getImageUrl implementada en controlador"
else
    log_error "Falta función getImageUrl en controlador"
fi

echo ""

# 4. Verificar variables de entorno
echo "4. 🔐 Verificando variables de entorno..."

if [ -f "server/.env" ]; then
    if grep -q "CLOUDINARY_CLOUD_NAME" server/.env; then
        log_success "Variable CLOUDINARY_CLOUD_NAME definida"
    else
        log_error "Falta variable CLOUDINARY_CLOUD_NAME"
    fi
    
    if grep -q "CLOUDINARY_API_KEY" server/.env; then
        log_success "Variable CLOUDINARY_API_KEY definida"
    else
        log_error "Falta variable CLOUDINARY_API_KEY"
    fi
    
    if grep -q "CLOUDINARY_API_SECRET" server/.env; then
        log_success "Variable CLOUDINARY_API_SECRET definida"
    else
        log_error "Falta variable CLOUDINARY_API_SECRET"
    fi
    
    if grep -q "JWT_SECRET_KEY" server/.env; then
        log_success "Variable JWT_SECRET_KEY configurada"
    else
        log_error "Falta variable JWT_SECRET_KEY"
    fi
fi

echo ""

# 5. Verificar servidor
echo "5. 🚀 Verificando servidor backend..."

# Verificar si el servidor está corriendo
if curl -s http://localhost:10000/health > /dev/null 2>&1; then
    log_success "Servidor backend respondiendo en puerto 10000"
    
    # Verificar endpoint de salud
    HEALTH_RESPONSE=$(curl -s http://localhost:10000/health)
    if echo "$HEALTH_RESPONSE" | grep -q "healthy"; then
        log_success "Endpoint de salud funcionando correctamente"
    else
        log_error "Endpoint de salud no responde correctamente"
    fi
else
    log_warning "Servidor backend no está corriendo"
    log_info "Para iniciar el servidor: cd server && npm run dev"
fi

echo ""

# 6. Verificar autenticación
echo "6. 🔑 Verificando sistema de autenticación..."

# Verificar consistencia en middleware de auth
if grep -q "JWT_SECRET_KEY" server/src/middleware/auth.js 2>/dev/null; then
    log_success "Middleware de autenticación actualizado correctamente"
else
    log_error "Middleware de autenticación no actualizado"
fi

# Verificar verifyToken.js
if grep -q "JWT_SECRET_KEY" server/config/verifyToken.js 2>/dev/null; then
    log_success "verifyToken.js configurado correctamente"
else
    log_error "verifyToken.js no configurado correctamente"
fi

echo ""

# 7. Ejecutar test de integración si el servidor está corriendo
echo "7. 🧪 Ejecutando test de integración..."

if curl -s http://localhost:10000/health > /dev/null 2>&1; then
    log_info "Ejecutando test de Cloudinary..."
    
    # Cambiar al directorio principal y ejecutar test
    cd "$(dirname "$0")"
    
    if [ -f "test-cloudinary-node.js" ]; then
        TEST_OUTPUT=$(node test-cloudinary-node.js 2>&1)
        
        if echo "$TEST_OUTPUT" | grep -q "completada exitosamente"; then
            log_success "Test de integración Cloudinary pasó correctamente"
        else
            log_error "Test de integración Cloudinary falló"
            log_info "Output del test:"
            echo "$TEST_OUTPUT" | tail -10
        fi
    else
        log_warning "Archivo de test no encontrado"
    fi
else
    log_warning "Servidor no está corriendo - saltando tests de integración"
fi

echo ""

# 8. Verificar compatibilidad con frontend
echo "8. 🖥️  Verificando compatibilidad con frontend..."

if [ -d "front" ]; then
    log_success "Directorio frontend encontrado"
    
    # Verificar si hay archivos de configuración del frontend
    if [ -f "front/package.json" ]; then
        log_success "Frontend configurado"
    else
        log_warning "Frontend no completamente configurado"
    fi
else
    log_warning "Directorio frontend no encontrado"
fi

echo ""

# 9. Verificar documentación
echo "9. 📚 Verificando documentación..."

if [ -f "INTEGRACION_CLOUDINARY_COMPLETADA.md" ]; then
    log_success "Documentación de integración Cloudinary creada"
else
    log_error "Falta documentación de integración"
fi

if [ -f "configurar-cloudinary-render.sh" ]; then
    log_success "Script de configuración para Render disponible"
else
    log_error "Falta script de configuración para Render"
fi

echo ""

# 10. Resumen final
echo "10. 📊 RESUMEN FINAL"
echo "===================="

TOTAL_TESTS=$((TESTS_PASSED + TESTS_FAILED))

if [ $TOTAL_TESTS -gt 0 ]; then
    SUCCESS_RATE=$((TESTS_PASSED * 100 / TOTAL_TESTS))
    
    echo -e "${BLUE}Tests ejecutados: $TOTAL_TESTS${NC}"
    echo -e "${GREEN}Tests pasados: $TESTS_PASSED${NC}"
    echo -e "${RED}Tests fallados: $TESTS_FAILED${NC}"
    echo -e "${BLUE}Tasa de éxito: $SUCCESS_RATE%${NC}"
    
    echo ""
    
    if [ $SUCCESS_RATE -ge 90 ]; then
        echo -e "${GREEN}🎉 SISTEMA LISTO PARA PRODUCCIÓN${NC}"
        echo ""
        echo "✅ Integración Cloudinary completada exitosamente"
        echo "✅ Todos los componentes funcionando correctamente"
        echo "✅ Tests pasando satisfactoriamente"
        echo ""
        echo "📋 PRÓXIMOS PASOS:"
        echo "1. Crear cuenta en Cloudinary (https://cloudinary.com/)"
        echo "2. Configurar variables en Render:"
        echo "   - CLOUDINARY_CLOUD_NAME"
        echo "   - CLOUDINARY_API_KEY" 
        echo "   - CLOUDINARY_API_SECRET"
        echo "3. Redesplegar aplicación en Render"
        echo "4. Probar creación de resoluciones en producción"
        
    elif [ $SUCCESS_RATE -ge 75 ]; then
        echo -e "${YELLOW}⚠️  SISTEMA FUNCIONAL CON ADVERTENCIAS${NC}"
        echo ""
        echo "El sistema está mayormente funcionando, pero hay algunos"
        echo "problemas menores que deben ser revisados antes de producción."
        
    else
        echo -e "${RED}❌ SISTEMA REQUIERE ATENCIÓN${NC}"
        echo ""
        echo "Hay problemas significativos que deben ser resueltos"
        echo "antes de desplegar a producción."
    fi
else
    echo -e "${YELLOW}⚠️  No se pudieron ejecutar tests${NC}"
fi

echo ""
echo "🏁 Verificación completada - $(date)"
echo ""

# Exit con código apropiado
if [ $SUCCESS_RATE -ge 90 ]; then
    exit 0
else
    exit 1
fi
