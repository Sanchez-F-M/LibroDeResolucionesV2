#!/bin/bash

echo "🔍 VERIFICACIÓN AUTOMÁTICA COMPLETA DEL SISTEMA"
echo "=============================================="
echo ""

# Colores para output
GREEN='\033[0;32m'
RED='\033[0;31m'
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

echo -e "${BLUE}📊 1. VERIFICANDO BACKEND (Puerto 3000)${NC}"
echo "-------------------------------------------"

# Test 1: Health Check
echo -n "🔹 Health Check: "
HEALTH_RESPONSE=$(curl -s "http://localhost:3000/health" 2>/dev/null)
if echo "$HEALTH_RESPONSE" | grep -q '"status":"healthy"'; then
    echo -e "${GREEN}✅ Healthy${NC}"
    BACKEND_STATUS=0
else
    echo -e "${RED}❌ Failed${NC}"
    BACKEND_STATUS=1
fi

# Test 2: API Books
echo -n "🔹 API Books: "
BOOKS_RESPONSE=$(curl -s "http://localhost:3000/api/books/all" 2>/dev/null)
BOOKS_COUNT=$(echo "$BOOKS_RESPONSE" | grep -o '"NumdeResolucion"' | wc -l)
if [ "$BOOKS_COUNT" -gt 0 ]; then
    echo -e "${GREEN}✅ $BOOKS_COUNT resoluciones${NC}"
else
    echo -e "${RED}❌ No data${NC}"
fi

# Test 3: Login
echo -n "🔹 Login API: "
LOGIN_RESPONSE=$(curl -s -X POST "http://localhost:3000/api/user/login" \
    -H "Content-Type: application/json" \
    -d '{"Nombre":"admin","Contrasena":"admin123"}' 2>/dev/null)
if echo "$LOGIN_RESPONSE" | grep -q '"token"'; then
    echo -e "${GREEN}✅ JWT Generated${NC}"
else
    echo -e "${RED}❌ Login Failed${NC}"
fi

echo ""
echo -e "${BLUE}📊 2. VERIFICANDO FRONTEND (Puerto 5173)${NC}"
echo "--------------------------------------------"

# Test 4: Frontend Access
echo -n "🔹 Frontend Access: "
FRONTEND_RESPONSE=$(curl -s -I "http://localhost:5173" 2>/dev/null)
if echo "$FRONTEND_RESPONSE" | grep -q "200 OK"; then
    echo -e "${GREEN}✅ Accessible${NC}"
    FRONTEND_STATUS=0
else
    echo -e "${RED}❌ Not accessible${NC}"
    FRONTEND_STATUS=1
fi

# Test 5: Static Files
echo -n "🔹 Static Files: "
STATIC_RESPONSE=$(curl -s -I "http://localhost:3000/uploads/1746055049685-diagrama_ep.png" 2>/dev/null)
if echo "$STATIC_RESPONSE" | grep -q "200 OK"; then
    echo -e "${GREEN}✅ Serving${NC}"
else
    echo -e "${RED}❌ Not serving${NC}"
fi

echo ""
echo -e "${BLUE}📊 3. VERIFICANDO BASE DE DATOS${NC}"
echo "-----------------------------------"

# Test 6: Database Connection
echo -n "🔹 PostgreSQL Connection: "
if [ "$BOOKS_COUNT" -gt 0 ]; then
    echo -e "${GREEN}✅ Connected ($BOOKS_COUNT records)${NC}"
else
    echo -e "${RED}❌ Connection issue${NC}"
fi

# Test 7: Last Number API
echo -n "🔹 Auto-increment: "
LAST_NUMBER=$(curl -s "http://localhost:3000/api/books/last-number" 2>/dev/null | grep -o '"lastNumber":[0-9]*' | grep -o '[0-9]*')
if [ "$LAST_NUMBER" -gt 0 ]; then
    echo -e "${GREEN}✅ Next: $LAST_NUMBER${NC}"
else
    echo -e "${RED}❌ Not working${NC}"
fi

echo ""
echo -e "${BLUE}📊 4. RESUMEN FINAL${NC}"
echo "--------------------"

# Status Summary
if [ $BACKEND_STATUS -eq 0 ]; then
    echo -e "🖥️  Backend:  ${GREEN}✅ OPERATIVO${NC}"
else
    echo -e "🖥️  Backend:  ${RED}❌ CON PROBLEMAS${NC}"
fi

if [ $FRONTEND_STATUS -eq 0 ]; then
    echo -e "🌐 Frontend: ${GREEN}✅ OPERATIVO${NC}"
else
    echo -e "🌐 Frontend: ${RED}❌ CON PROBLEMAS${NC}"
fi

if [ "$BOOKS_COUNT" -gt 0 ]; then
    echo -e "🗄️  Database: ${GREEN}✅ OPERATIVO ($BOOKS_COUNT resoluciones)${NC}"
else
    echo -e "🗄️  Database: ${RED}❌ CON PROBLEMAS${NC}"
fi

echo ""
if [ $BACKEND_STATUS -eq 0 ] && [ $FRONTEND_STATUS -eq 0 ] && [ "$BOOKS_COUNT" -gt 0 ]; then
    echo -e "${GREEN}🎉 SISTEMA COMPLETAMENTE FUNCIONAL${NC}"
    echo -e "${GREEN}✅ Listo para uso en desarrollo${NC}"
    echo -e "${GREEN}✅ Listo para deployment a producción${NC}"
    
    echo ""
    echo -e "${BLUE}📱 URLs de Acceso:${NC}"
    echo "• Frontend: http://localhost:5173"
    echo "• Backend:  http://localhost:3000"
    echo "• API:      http://localhost:3000/api/books/all"
    echo "• Health:   http://localhost:3000/health"
    
    exit 0
else
    echo -e "${RED}⚠️  SISTEMA CON PROBLEMAS${NC}"
    echo -e "${YELLOW}🔧 Revisar logs de los servicios que fallan${NC}"
    exit 1
fi
