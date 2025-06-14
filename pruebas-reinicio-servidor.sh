#!/bin/bash

# Pruebas de reinicio y persistencia - Simulación de deployment en Render
# filepath: c:\Users\flavi\OneDrive\Escritorio\LibroDeResolucionesV2\pruebas-reinicio-servidor.sh

echo "🔄 PRUEBAS DE REINICIO Y PERSISTENCIA DEL SERVIDOR"
echo "=================================================="
echo ""

# Configuración
BASE_URL="http://localhost:10000"
ADMIN_USER="admin"
ADMIN_PASS="admin123"
TEST_RESULTS_FILE="resultados_reinicio.log"

# Colores
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
NC='\033[0m'

# Variables de control
SERVIDOR_PID=""
DATOS_ANTES=""
DATOS_DESPUES=""

log_success() { echo -e "${GREEN}✅ $1${NC}"; }
log_error() { echo -e "${RED}❌ $1${NC}"; }
log_warning() { echo -e "${YELLOW}⚠️  $1${NC}"; }
log_info() { echo -e "${BLUE}ℹ️  $1${NC}"; }
log_test() { echo -e "${PURPLE}🧪 $1${NC}"; }

# Función para obtener token
get_token() {
    curl -s -X POST "$BASE_URL/api/user/login" \
        -H "Content-Type: application/json" \
        -d "{\"username\":\"$ADMIN_USER\",\"password\":\"$ADMIN_PASS\"}" | \
        grep -o '"token":"[^"]*' | cut -d'"' -f4
}

# Función para verificar servidor
check_server() {
    curl -s "$BASE_URL/health" > /dev/null 2>&1
    return $?
}

# Función para obtener todas las resoluciones
get_all_data() {
    local token=$1
    curl -s "$BASE_URL/api/books/all" -H "Authorization: Bearer $token"
}

# Función para crear resolución de prueba
create_test_resolution() {
    local token=$1
    local timestamp=$(date +%s)
    local res_number="RESTART-TEST-$timestamp"
    
    # Crear archivo temporal
    mkdir -p temp_restart
    echo "PRUEBA DE REINICIO - $timestamp" > "temp_restart/test-$timestamp.txt"
    
    local response=$(curl -s -X POST "$BASE_URL/api/books" \
        -H "Authorization: Bearer $token" \
        -F "NumdeResolucion=$res_number" \
        -F "Asunto=Prueba de reinicio $timestamp" \
        -F "Referencia=REF-RESTART-$timestamp" \
        -F "FechaCreacion=$(date -u +"%Y-%m-%dT%H:%M:%S.000Z")" \
        -F "files=@temp_restart/test-$timestamp.txt")
    
    rm -rf temp_restart
    echo "$res_number"
}

echo "[$(date)] INICIO PRUEBAS DE REINICIO" > $TEST_RESULTS_FILE

# ===========================================
# FASE 1: VERIFICACIÓN INICIAL
# ===========================================
log_test "FASE 1: Verificación inicial del sistema"

if check_server; then
    log_success "Servidor respondiendo inicialmente"
else
    log_error "Servidor no está ejecutándose"
    echo ""
    echo "💡 Para estas pruebas, el servidor debe estar corriendo:"
    echo "   cd server && npm run dev"
    exit 1
fi

TOKEN=$(get_token)
if [ -z "$TOKEN" ]; then
    log_error "No se pudo obtener token inicial"
    exit 1
fi

log_success "Token inicial obtenido"

# Obtener estado inicial
DATOS_INICIALES=$(get_all_data "$TOKEN")
COUNT_INICIAL=$(echo "$DATOS_INICIALES" | jq '. | length' 2>/dev/null || echo "0")

log_info "Resoluciones en sistema: $COUNT_INICIAL"

echo ""

# ===========================================
# FASE 2: CREAR DATOS DE PRUEBA
# ===========================================
log_test "FASE 2: Creación de datos de prueba antes del reinicio"

log_info "Creando 3 resoluciones de prueba..."

RESOLUCIONES_CREADAS=()
for i in {1..3}; do
    res_created=$(create_test_resolution "$TOKEN")
    if [ -n "$res_created" ]; then
        RESOLUCIONES_CREADAS+=("$res_created")
        log_success "Resolución $i creada: $res_created"
    else
        log_error "Error creando resolución $i"
    fi
    sleep 1
done

# Verificar que se crearon
sleep 2
DATOS_ANTES_REINICIO=$(get_all_data "$TOKEN")
COUNT_ANTES=$(echo "$DATOS_ANTES_REINICIO" | jq '. | length' 2>/dev/null || echo "0")

log_info "Total de resoluciones antes del reinicio: $COUNT_ANTES"
log_info "Incremento esperado: ${#RESOLUCIONES_CREADAS[@]}"

if [ $COUNT_ANTES -eq $((COUNT_INICIAL + ${#RESOLUCIONES_CREADAS[@]})) ]; then
    log_success "Todas las resoluciones se guardaron correctamente"
else
    log_warning "Posible inconsistencia en la creación de datos"
fi

echo ""

# ===========================================
# FASE 3: REINICIO SIMULADO DEL SERVIDOR
# ===========================================
log_test "FASE 3: Simulación de reinicio del servidor"

log_warning "⚠️  IMPORTANTE: Esta prueba simulará un reinicio del servidor"
log_info "El servidor se detendrá y reiniciará automáticamente"
echo ""

# Guardar datos antes del reinicio
echo "$DATOS_ANTES_REINICIO" > "datos_antes_reinicio.json"
log_info "Datos guardados para comparación"

# Buscar proceso del servidor
log_info "Buscando proceso del servidor Node.js..."

# En Windows, buscar procesos node
if command -v tasklist > /dev/null 2>&1; then
    NODE_PROCESSES=$(tasklist /FI "IMAGENAME eq node.exe" /FO CSV | grep -v "INFO:" | wc -l)
    log_info "Procesos Node.js encontrados: $NODE_PROCESSES"
fi

log_warning "INICIANDO REINICIO EN 3 SEGUNDOS..."
sleep 1
log_warning "REINICIO EN 2 SEGUNDOS..."
sleep 1
log_warning "REINICIO EN 1 SEGUNDO..."
sleep 1

# Detener servidor (simulación)
log_error "🔄 DETENIENDO SERVIDOR..."

# En Windows, buscar y detener proceso en puerto 10000
if command -v netstat > /dev/null 2>&1; then
    PORT_PID=$(netstat -ano | grep ":10000" | awk '{print $5}' | head -1)
    if [ -n "$PORT_PID" ]; then
        log_info "Proceso encontrado en puerto 10000: PID $PORT_PID"
        
        # Detener proceso
        if command -v taskkill > /dev/null 2>&1; then
            taskkill //PID $PORT_PID //F > /dev/null 2>&1
            log_warning "Servidor detenido (PID $PORT_PID)"
        fi
    fi
fi

# Esperar que el servidor se detenga
log_info "Esperando que el servidor se detenga..."
sleep 3

# Verificar que está detenido
if check_server; then
    log_warning "Servidor aún responde - puede estar en modo automático"
else
    log_success "Servidor detenido exitosamente"
fi

echo ""

# ===========================================
# FASE 4: ESPERAR REINICIO AUTOMÁTICO
# ===========================================
log_test "FASE 4: Esperando reinicio automático del servidor"

log_info "Si está usando nodemon, el servidor debería reiniciar automáticamente..."
log_info "Esperando hasta 30 segundos para que el servidor reinicie..."

# Esperar hasta 30 segundos para que el servidor reinicie
for i in {1..30}; do
    if check_server; then
        log_success "¡Servidor reiniciado después de $i segundos!"
        break
    else
        if [ $((i % 5)) -eq 0 ]; then
            log_info "Esperando reinicio... ($i/30 segundos)"
        fi
        sleep 1
    fi
done

# Verificar si el servidor está de vuelta
if check_server; then
    log_success "Servidor está funcionando después del reinicio"
else
    log_error "Servidor no reinició automáticamente"
    echo ""
    echo "🔧 INSTRUCCIONES PARA CONTINUAR:"
    echo "1. Inicia manualmente el servidor: cd server && npm run dev"
    echo "2. Cuando esté funcionando, presiona ENTER para continuar"
    read -p "Presiona ENTER cuando el servidor esté funcionando..."
    
    # Verificar nuevamente
    if check_server; then
        log_success "Servidor manual confirmado funcionando"
    else
        log_error "Servidor aún no responde - abortando pruebas"
        exit 1
    fi
fi

echo ""

# ===========================================
# FASE 5: VERIFICACIÓN POST-REINICIO
# ===========================================
log_test "FASE 5: Verificación de datos después del reinicio"

# Obtener nuevo token (nueva sesión)
log_info "Obteniendo nuevo token de autenticación..."
NEW_TOKEN=$(get_token)

if [ -z "$NEW_TOKEN" ]; then
    log_error "No se pudo obtener token después del reinicio"
    log_warning "Posible problema de autenticación o base de datos"
else
    log_success "Nuevo token obtenido después del reinicio"
fi

# Obtener datos después del reinicio
log_info "Recuperando datos después del reinicio..."
DATOS_DESPUES_REINICIO=$(get_all_data "$NEW_TOKEN")
COUNT_DESPUES=$(echo "$DATOS_DESPUES_REINICIO" | jq '. | length' 2>/dev/null || echo "0")

log_info "Resoluciones después del reinicio: $COUNT_DESPUES"
log_info "Resoluciones antes del reinicio: $COUNT_ANTES"

# Guardar datos después para comparación
echo "$DATOS_DESPUES_REINICIO" > "datos_despues_reinicio.json"

echo ""

# ===========================================
# FASE 6: ANÁLISIS DE PERSISTENCIA
# ===========================================
log_test "FASE 6: Análisis de persistencia de datos"

# Comparar conteos
if [ $COUNT_DESPUES -eq $COUNT_ANTES ]; then
    log_success "PERSISTENCIA EXITOSA: Mismo número de resoluciones ($COUNT_DESPUES)"
elif [ $COUNT_DESPUES -gt $COUNT_ANTES ]; then
    diff=$((COUNT_DESPUES - COUNT_ANTES))
    log_warning "Datos adicionales encontrados: +$diff resoluciones"
    log_info "Posibles duplicados o datos de sesiones anteriores"
elif [ $COUNT_DESPUES -lt $COUNT_ANTES ]; then
    diff=$((COUNT_ANTES - COUNT_DESPUES))
    log_error "PÉRDIDA DE DATOS: -$diff resoluciones perdidas"
    log_error "Problema de persistencia detectado"
fi

# Verificar resoluciones específicas creadas
log_info "Verificando resoluciones específicas creadas en esta sesión..."

FOUND_RESOLUTIONS=0
for resolution in "${RESOLUCIONES_CREADAS[@]}"; do
    if echo "$DATOS_DESPUES_REINICIO" | grep -q "$resolution"; then
        log_success "Resolución encontrada: $resolution"
        ((FOUND_RESOLUTIONS++))
    else
        log_error "Resolución PERDIDA: $resolution"
    fi
done

log_info "Resoluciones encontradas: $FOUND_RESOLUTIONS/${#RESOLUCIONES_CREADAS[@]}"

echo ""

# ===========================================
# FASE 7: VERIFICACIÓN DE IMÁGENES
# ===========================================
log_test "FASE 7: Verificación de persistencia de imágenes"

if [ $FOUND_RESOLUTIONS -gt 0 ]; then
    log_info "Verificando imágenes de las resoluciones encontradas..."
    
    IMAGES_FOUND=0
    IMAGES_CLOUDINARY=0
    IMAGES_LOCAL=0
    
    for resolution in "${RESOLUCIONES_CREADAS[@]}"; do
        if echo "$DATOS_DESPUES_REINICIO" | grep -q "$resolution"; then
            # Obtener detalles de la resolución
            resolution_detail=$(curl -s "$BASE_URL/api/books/$resolution" -H "Authorization: Bearer $NEW_TOKEN")
            
            # Contar imágenes
            images=$(echo "$resolution_detail" | jq -r '.[0].images[]' 2>/dev/null)
            
            if [ -n "$images" ]; then
                echo "$images" | while read -r image_url; do
                    if [ -n "$image_url" ]; then
                        ((IMAGES_FOUND++))
                        
                        if echo "$image_url" | grep -q "cloudinary.com"; then
                            ((IMAGES_CLOUDINARY++))
                            log_success "Imagen en Cloudinary: $image_url"
                        elif echo "$image_url" | grep -q "uploads"; then
                            ((IMAGES_LOCAL++))
                            log_warning "Imagen local: $image_url"
                        fi
                    fi
                done
            fi
        fi
    done
    
    log_info "Total de imágenes encontradas: $IMAGES_FOUND"
    log_info "Imágenes en Cloudinary: $IMAGES_CLOUDINARY"
    log_info "Imágenes locales: $IMAGES_LOCAL"
    
    if [ $IMAGES_CLOUDINARY -gt 0 ]; then
        log_success "Imágenes en Cloudinary - persistirán en producción"
    elif [ $IMAGES_LOCAL -gt 0 ]; then
        log_warning "Imágenes locales - se perderán en Render"
    fi
else
    log_warning "No hay resoluciones para verificar imágenes"
fi

echo ""

# ===========================================
# REPORTE FINAL
# ===========================================
echo "📊 REPORTE FINAL - PRUEBAS DE REINICIO"
echo "======================================"
echo ""

# Determinar resultado general
RESULTADO_GENERAL="DESCONOCIDO"
COLOR_RESULTADO=$YELLOW

if [ $COUNT_DESPUES -eq $COUNT_ANTES ] && [ $FOUND_RESOLUTIONS -eq ${#RESOLUCIONES_CREADAS[@]} ]; then
    RESULTADO_GENERAL="EXITOSO ✅"
    COLOR_RESULTADO=$GREEN
elif [ $COUNT_DESPUES -ge $COUNT_ANTES ] && [ $FOUND_RESOLUTIONS -gt 0 ]; then
    RESULTADO_GENERAL="PARCIALMENTE EXITOSO ⚠️"
    COLOR_RESULTADO=$YELLOW
else
    RESULTADO_GENERAL="FALLIDO ❌"
    COLOR_RESULTADO=$RED
fi

echo -e "${COLOR_RESULTADO}🎯 RESULTADO GENERAL: $RESULTADO_GENERAL${NC}"
echo ""

echo -e "${BLUE}📈 ESTADÍSTICAS DE PERSISTENCIA:${NC}"
echo "   • Resoluciones antes del reinicio: $COUNT_ANTES"
echo "   • Resoluciones después del reinicio: $COUNT_DESPUES"
echo "   • Resoluciones creadas en sesión: ${#RESOLUCIONES_CREADAS[@]}"
echo "   • Resoluciones encontradas: $FOUND_RESOLUTIONS"
echo "   • Tasa de persistencia: $((FOUND_RESOLUTIONS * 100 / ${#RESOLUCIONES_CREADAS[@]} ))%"
echo ""

echo -e "${BLUE}🖼️  ANÁLISIS DE IMÁGENES:${NC}"
if [ -f "server/.env" ] && grep -q "CLOUDINARY_CLOUD_NAME=" server/.env; then
    CLOUD_NAME=$(grep "CLOUDINARY_CLOUD_NAME=" server/.env | cut -d'=' -f2)
    if [ -n "$CLOUD_NAME" ] && [ "$CLOUD_NAME" != "" ]; then
        echo "   ✅ Cloudinary configurado (persistente)"
        echo "   🌐 Las imágenes sobrevivirán a reinicios en producción"
    else
        echo "   ⚠️  Cloudinary no configurado (no persistente)"
        echo "   🔧 Configurar para producción en Render"
    fi
else
    echo "   ❌ Sin configuración de Cloudinary"
    echo "   ⚠️  Las imágenes se perderán en Render"
fi

echo ""

echo -e "${BLUE}📋 CONCLUSIONES:${NC}"

if [ "$RESULTADO_GENERAL" = "EXITOSO ✅" ]; then
    echo "   🏆 El sistema mantiene la persistencia correctamente"
    echo "   🏆 Los datos sobreviven a reinicios del servidor"
    echo "   🏆 Base de datos funcionando correctamente"
    
    if grep -q "cloudinary.com" datos_despues_reinicio.json 2>/dev/null; then
        echo "   🌩️  Cloudinary detectado - listo para producción"
    else
        echo "   ⚠️  Configurar Cloudinary para producción completa"
    fi
    
elif [ "$RESULTADO_GENERAL" = "PARCIALMENTE EXITOSO ⚠️" ]; then
    echo "   ✅ Persistencia básica funcionando"
    echo "   ⚠️  Algunas inconsistencias menores detectadas"
    echo "   🔧 Revisar configuración antes de producción"
    
else
    echo "   ❌ Problemas serios de persistencia"
    echo "   ❌ Los datos no sobreviven a reinicios"
    echo "   🚨 Requiere atención inmediata"
fi

echo ""

echo -e "${BLUE}🚀 RECOMENDACIONES PARA PRODUCCIÓN:${NC}"
echo "   1. Verificar que PostgreSQL esté configurado correctamente"
echo "   2. Configurar Cloudinary para persistencia de imágenes"
echo "   3. Probar deployment en Render con datos de prueba"
echo "   4. Monitorear logs después de cada redeploy"

echo ""

# Limpiar archivos temporales
rm -f datos_antes_reinicio.json datos_despues_reinicio.json temp_restart/* 2>/dev/null
rmdir temp_restart 2>/dev/null

echo "📁 Log detallado guardado en: $TEST_RESULTS_FILE"
echo "🏁 Pruebas de reinicio completadas - $(date)"

# Exit code basado en resultado
if [ "$RESULTADO_GENERAL" = "EXITOSO ✅" ]; then
    exit 0
elif [ "$RESULTADO_GENERAL" = "PARCIALMENTE EXITOSO ⚠️" ]; then
    exit 1
else
    exit 2
fi
