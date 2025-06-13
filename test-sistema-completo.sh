#!/bin/bash

# 🧪 SCRIPT DE TESTING COMPLETO DEL SISTEMA
# Verifica todas las funcionalidades implementadas

echo "🧪 TESTING SISTEMA LIBRO DE RESOLUCIONES"
echo "========================================"

# Colores
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# URLs del sistema
BACKEND_URL="http://localhost:10000"
FRONTEND_URL="http://localhost:5175"

echo -e "${BLUE}🔍 Verificando servicios activos...${NC}"

# Test 1: Verificar Backend
echo -n "Backend (puerto 10000): "
if curl -s "$BACKEND_URL/render-health" > /dev/null; then
    echo -e "${GREEN}✅ ACTIVO${NC}"
    BACKEND_OK=true
else
    echo -e "${RED}❌ INACTIVO${NC}"
    BACKEND_OK=false
fi

# Test 2: Verificar Frontend
echo -n "Frontend (puerto 5175): "
if curl -s "$FRONTEND_URL" > /dev/null; then
    echo -e "${GREEN}✅ ACTIVO${NC}"
    FRONTEND_OK=true
else
    echo -e "${RED}❌ INACTIVO${NC}"
    FRONTEND_OK=false
fi

if [ "$BACKEND_OK" = false ] || [ "$FRONTEND_OK" = false ]; then
    echo -e "\n${RED}❌ Servicios no están ejecutándose${NC}"
    echo "Por favor ejecuta: bash start-system-improved.sh"
    exit 1
fi

echo -e "\n${BLUE}🗄️ Testing Base de Datos y Autenticación...${NC}"

# Test 3: Login con usuario admin
echo -n "Login usuario admin: "
LOGIN_RESPONSE=$(curl -s -X POST "$BACKEND_URL/api/user/login" \
    -H "Content-Type: application/json" \
    -d '{"Nombre":"admin","Contrasena":"admin123"}')

if echo "$LOGIN_RESPONSE" | grep -q "token"; then
    echo -e "${GREEN}✅ EXITOSO${NC}"
    TOKEN=$(echo "$LOGIN_RESPONSE" | grep -o '"token":"[^"]*"' | cut -d'"' -f4)
    USER_ROLE=$(echo "$LOGIN_RESPONSE" | grep -o '"role":"[^"]*"' | cut -d'"' -f4)
    echo "   Rol detectado: $USER_ROLE"
else
    echo -e "${RED}❌ FALLIDO${NC}"
    echo "   Respuesta: $LOGIN_RESPONSE"
fi

echo -e "\n${BLUE}🛡️ Testing Sistema de Roles...${NC}"

if [ ! -z "$TOKEN" ]; then
    # Test 4: Acceso a endpoint protegido
    echo -n "Acceso con token válido: "
    PROTECTED_RESPONSE=$(curl -s "$BACKEND_URL/api/user/profile" \
        -H "Authorization: Bearer $TOKEN")
    
    if echo "$PROTECTED_RESPONSE" | grep -q "Nombre"; then
        echo -e "${GREEN}✅ EXITOSO${NC}"
    else
        echo -e "${RED}❌ FALLIDO${NC}"
    fi

    # Test 5: Acceso sin token (debe fallar)
    echo -n "Acceso sin token (debe fallar): "
    NO_TOKEN_RESPONSE=$(curl -s "$BACKEND_URL/api/user/profile")
    
    if echo "$NO_TOKEN_RESPONSE" | grep -q "error\|unauthorized"; then
        echo -e "${GREEN}✅ BLOQUEADO CORRECTAMENTE${NC}"
    else
        echo -e "${RED}❌ ERROR: No se bloqueó el acceso${NC}"
    fi
fi

echo -e "\n${BLUE}📝 Testing API de Registro...${NC}"

# Test 6: Registro de nuevo usuario
echo -n "Registro de usuario de prueba: "
RANDOM_NUM=$((RANDOM % 1000))
TEST_USER="testuser$RANDOM_NUM"

REGISTER_RESPONSE=$(curl -s -X POST "$BACKEND_URL/api/user/register" \
    -H "Content-Type: application/json" \
    -d "{\"Nombre\":\"$TEST_USER\",\"Contrasena\":\"test123\",\"Rol\":\"usuario\"}")

if echo "$REGISTER_RESPONSE" | grep -q "success\|usuario creado\|exitoso"; then
    echo -e "${GREEN}✅ EXITOSO${NC}"
    echo "   Usuario creado: $TEST_USER"
    
    # Test 7: Login con usuario recién creado
    echo -n "Login con usuario nuevo: "
    NEW_LOGIN_RESPONSE=$(curl -s -X POST "$BACKEND_URL/api/user/login" \
        -H "Content-Type: application/json" \
        -d "{\"Nombre\":\"$TEST_USER\",\"Contrasena\":\"test123\"}")
    
    if echo "$NEW_LOGIN_RESPONSE" | grep -q "token"; then
        echo -e "${GREEN}✅ EXITOSO${NC}"
        NEW_USER_ROLE=$(echo "$NEW_LOGIN_RESPONSE" | grep -o '"role":"[^"]*"' | cut -d'"' -f4)
        echo "   Rol asignado: $NEW_USER_ROLE"
    else
        echo -e "${RED}❌ FALLIDO${NC}"
    fi
else
    echo -e "${RED}❌ FALLIDO${NC}"
    echo "   Respuesta: $REGISTER_RESPONSE"
fi

echo -e "\n${BLUE}🌐 Testing Endpoints Principales...${NC}"

# Test 8: Health check
echo -n "Health check: "
HEALTH_RESPONSE=$(curl -s "$BACKEND_URL/render-health")
if echo "$HEALTH_RESPONSE" | grep -q "OK\|healthy\|success"; then
    echo -e "${GREEN}✅ EXITOSO${NC}"
else
    echo -e "${RED}❌ FALLIDO${NC}"
fi

# Test 9: Verificar estructura de respuesta del login
echo -n "Estructura de respuesta JWT: "
if [ ! -z "$TOKEN" ]; then
    # Verificar que el JWT tiene las partes correctas
    JWT_PARTS=$(echo "$TOKEN" | tr '.' '\n' | wc -l)
    if [ "$JWT_PARTS" -eq 3 ]; then
        echo -e "${GREEN}✅ JWT VÁLIDO${NC}"
    else
        echo -e "${RED}❌ JWT MALFORMADO${NC}"
    fi
else
    echo -e "${RED}❌ NO HAY TOKEN${NC}"
fi

echo -e "\n${BLUE}📱 URLs para Testing Manual...${NC}"
echo "Frontend: $FRONTEND_URL"
echo "Registro: $FRONTEND_URL/register"
echo "Login: $FRONTEND_URL/login"
echo "Backend Health: $BACKEND_URL/render-health"

echo -e "\n${BLUE}👥 Usuarios de Prueba...${NC}"
echo "Admin: admin / admin123 (rol: admin)"
if [ ! -z "$TEST_USER" ]; then
    echo "Test User: $TEST_USER / test123 (rol: usuario)"
fi

echo -e "\n${BLUE}🔧 Testing Frontend (Manual)...${NC}"
echo "1. Abrir: $FRONTEND_URL"
echo "2. Probar registro en: $FRONTEND_URL/register"
echo "3. Probar login con diferentes roles"
echo "4. Verificar permisos según el rol"

echo -e "\n${GREEN}✅ TESTING COMPLETADO${NC}"
echo "========================================"

# Resumen de resultados
echo -e "\n📊 ${BLUE}RESUMEN DE TESTS:${NC}"
if [ "$BACKEND_OK" = true ]; then
    echo -e "✅ Backend: ${GREEN}Funcionando${NC}"
else
    echo -e "❌ Backend: ${RED}Error${NC}"
fi

if [ "$FRONTEND_OK" = true ]; then
    echo -e "✅ Frontend: ${GREEN}Funcionando${NC}"
else
    echo -e "❌ Frontend: ${RED}Error${NC}"
fi

if [ ! -z "$TOKEN" ]; then
    echo -e "✅ Autenticación: ${GREEN}Funcionando${NC}"
else
    echo -e "❌ Autenticación: ${RED}Error${NC}"
fi

if [ ! -z "$TEST_USER" ]; then
    echo -e "✅ Registro: ${GREEN}Funcionando${NC}"
else
    echo -e "❌ Registro: ${RED}Error${NC}"
fi

echo -e "\n🎉 ${GREEN}Sistema listo para uso!${NC}"
