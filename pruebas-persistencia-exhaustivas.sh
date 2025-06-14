#!/bin/bash

# Pruebas exhaustivas de persistencia de datos - Aplicación Libro de Resoluciones
# filepath: c:\Users\flavi\OneDrive\Escritorio\LibroDeResolucionesV2\pruebas-persistencia-exhaustivas.sh

echo "🔬 PRUEBAS EXHAUSTIVAS DE PERSISTENCIA - LIBRO DE RESOLUCIONES"
echo "============================================================="
echo ""

# Configuración
BASE_URL="http://localhost:10000"
TEST_DIR="temp_persistencia_tests"
ADMIN_USER="admin"
ADMIN_PASS="admin123"
TEST_RESULTS_FILE="resultados_persistencia.log"

# Colores
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
NC='\033[0m'

# Contadores
TESTS_TOTAL=0
TESTS_PASSED=0
TESTS_FAILED=0
RESOLUTIONS_CREATED=0
IMAGES_UPLOADED=0

# Funciones de logging
log_success() {
    echo -e "${GREEN}✅ $1${NC}"
    echo "[$(date)] SUCCESS: $1" >> $TEST_RESULTS_FILE
    ((TESTS_PASSED++))
}

log_error() {
    echo -e "${RED}❌ $1${NC}"
    echo "[$(date)] ERROR: $1" >> $TEST_RESULTS_FILE
    ((TESTS_FAILED++))
}

log_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
    echo "[$(date)] WARNING: $1" >> $TEST_RESULTS_FILE
}

log_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
    echo "[$(date)] INFO: $1" >> $TEST_RESULTS_FILE
}

log_test() {
    echo -e "${PURPLE}🧪 $1${NC}"
    echo "[$(date)] TEST: $1" >> $TEST_RESULTS_FILE
    ((TESTS_TOTAL++))
}

# Función para obtener token JWT
get_auth_token() {
    local response=$(curl -s -X POST "$BASE_URL/api/user/login" \
        -H "Content-Type: application/json" \
        -d "{\"username\":\"$ADMIN_USER\",\"password\":\"$ADMIN_PASS\"}")
    
    echo "$response" | grep -o '"token":"[^"]*' | cut -d'"' -f4
}

# Función para crear archivo de imagen de prueba
create_test_image() {
    local filename=$1
    local content=$2
    
    mkdir -p $TEST_DIR
    echo "$content" > "$TEST_DIR/$filename"
    echo "$(date)" >> "$TEST_DIR/$filename"
    echo "Test ID: $(uuidgen 2>/dev/null || echo $RANDOM$RANDOM)" >> "$TEST_DIR/$filename"
}

# Función para crear resolución con imagen
create_resolution_with_image() {
    local res_number=$1
    local subject=$2
    local reference=$3
    local image_file=$4
    local token=$5
    
    local response=$(curl -s -X POST "$BASE_URL/api/books" \
        -H "Authorization: Bearer $token" \
        -F "NumdeResolucion=$res_number" \
        -F "Asunto=$subject" \
        -F "Referencia=$reference" \
        -F "FechaCreacion=$(date -u +"%Y-%m-%dT%H:%M:%S.000Z")" \
        -F "files=@$TEST_DIR/$image_file")
    
    echo "$response"
}

# Función para obtener resolución
get_resolution() {
    local res_number=$1
    local token=$2
    
    curl -s "$BASE_URL/api/books/$res_number" \
        -H "Authorization: Bearer $token"
}

# Función para obtener todas las resoluciones
get_all_resolutions() {
    local token=$1
    
    curl -s "$BASE_URL/api/books/all" \
        -H "Authorization: Bearer $token"
}

# Función para verificar servidor
check_server() {
    local health_response=$(curl -s "$BASE_URL/health" 2>/dev/null)
    
    if echo "$health_response" | grep -q "healthy"; then
        return 0
    else
        return 1
    fi
}

# Limpiar archivos anteriores
echo "🧹 Preparando entorno de pruebas..."
rm -rf $TEST_DIR 2>/dev/null
rm -f $TEST_RESULTS_FILE 2>/dev/null
mkdir -p $TEST_DIR

echo "[$(date)] INICIO DE PRUEBAS EXHAUSTIVAS DE PERSISTENCIA" > $TEST_RESULTS_FILE
echo "" >> $TEST_RESULTS_FILE

# ===========================================
# PRUEBA 1: VERIFICACIÓN INICIAL DEL SERVIDOR
# ===========================================
log_test "PRUEBA 1: Verificación inicial del servidor"

if check_server; then
    log_success "Servidor respondiendo correctamente"
    
    # Obtener información del servidor
    SERVER_INFO=$(curl -s "$BASE_URL/health")
    log_info "Información del servidor: $(echo $SERVER_INFO | head -c 100)..."
else
    log_error "Servidor no está respondiendo"
    echo ""
    echo "❌ PRUEBAS CANCELADAS: El servidor debe estar ejecutándose"
    echo "💡 Para iniciar el servidor: cd server && npm run dev"
    exit 1
fi

echo ""

# ===========================================
# PRUEBA 2: AUTENTICACIÓN Y TOKEN
# ===========================================
log_test "PRUEBA 2: Autenticación y obtención de token"

TOKEN=$(get_auth_token)

if [ -n "$TOKEN" ] && [ "$TOKEN" != "null" ]; then
    log_success "Token JWT obtenido correctamente"
    log_info "Token: ${TOKEN:0:20}..."
else
    log_error "No se pudo obtener token de autenticación"
    echo ""
    echo "❌ PRUEBAS CANCELADAS: Problema de autenticación"
    exit 1
fi

echo ""

# ===========================================
# PRUEBA 3: ESTADO INICIAL DE LA BASE DE DATOS
# ===========================================
log_test "PRUEBA 3: Estado inicial de la base de datos"

INITIAL_RESOLUTIONS=$(get_all_resolutions "$TOKEN")
INITIAL_COUNT=$(echo "$INITIAL_RESOLUTIONS" | jq '. | length' 2>/dev/null || echo "0")

log_info "Resoluciones existentes al inicio: $INITIAL_COUNT"
echo "Estado inicial de BD:" >> $TEST_RESULTS_FILE
echo "$INITIAL_RESOLUTIONS" >> $TEST_RESULTS_FILE
echo "" >> $TEST_RESULTS_FILE

echo ""

# ===========================================
# PRUEBA 4: CREAR MÚLTIPLES RESOLUCIONES
# ===========================================
log_test "PRUEBA 4: Creación de múltiples resoluciones con imágenes"

# Crear 5 resoluciones de prueba
for i in {1..5}; do
    timestamp=$(date +%s)
    res_number="PERSIST-TEST-$i-$timestamp"
    subject="Prueba de persistencia $i - $timestamp"
    reference="REF-PERSIST-$i-$timestamp"
    image_file="imagen-test-$i-$timestamp.txt"
    
    # Crear imagen de prueba
    create_test_image "$image_file" "IMAGEN DE PRUEBA $i PARA PERSISTENCIA - $timestamp"
    
    log_info "Creando resolución $i: $res_number"
    
    # Crear resolución
    create_response=$(create_resolution_with_image "$res_number" "$subject" "$reference" "$image_file" "$TOKEN")
    
    if echo "$create_response" | grep -q "exitosamente"; then
        log_success "Resolución $i creada exitosamente"
        ((RESOLUTIONS_CREATED++))
        ((IMAGES_UPLOADED++))
        
        # Verificar inmediatamente que se puede recuperar
        sleep 1
        get_response=$(get_resolution "$res_number" "$TOKEN")
        
        if echo "$get_response" | grep -q "$res_number"; then
            log_success "Resolución $i verificada - se puede recuperar inmediatamente"
        else
            log_error "Resolución $i NO se puede recuperar inmediatamente"
        fi
    else
        log_error "Error al crear resolución $i: $create_response"
    fi
    
    # Pequeña pausa entre creaciones
    sleep 2
done

echo ""
log_info "Resoluciones creadas en esta sesión: $RESOLUTIONS_CREATED"
log_info "Imágenes subidas en esta sesión: $IMAGES_UPLOADED"

echo ""

# ===========================================
# PRUEBA 5: VERIFICAR PERSISTENCIA INMEDIATA
# ===========================================
log_test "PRUEBA 5: Verificación de persistencia inmediata"

# Obtener todas las resoluciones después de las creaciones
AFTER_CREATE_RESOLUTIONS=$(get_all_resolutions "$TOKEN")
AFTER_CREATE_COUNT=$(echo "$AFTER_CREATE_RESOLUTIONS" | jq '. | length' 2>/dev/null || echo "0")

log_info "Resoluciones después de crear: $AFTER_CREATE_COUNT"
log_info "Incremento esperado: $RESOLUTIONS_CREATED"

if [ $AFTER_CREATE_COUNT -ge $((INITIAL_COUNT + RESOLUTIONS_CREATED)) ]; then
    log_success "Todas las resoluciones persisten correctamente en BD"
else
    log_error "Algunas resoluciones NO persisten - esperado: $((INITIAL_COUNT + RESOLUTIONS_CREATED)), actual: $AFTER_CREATE_COUNT"
fi

echo ""

# ===========================================
# PRUEBA 6: VERIFICAR IMÁGENES INDIVIDUALES
# ===========================================
log_test "PRUEBA 6: Verificación individual de imágenes"

# Buscar las resoluciones creadas en esta sesión
CREATED_RESOLUTIONS=$(echo "$AFTER_CREATE_RESOLUTIONS" | jq -r '.[] | select(.NumdeResolucion | startswith("PERSIST-TEST-")) | .NumdeResolucion' 2>/dev/null)

if [ -n "$CREATED_RESOLUTIONS" ]; then
    echo "$CREATED_RESOLUTIONS" | while read -r resolution_number; do
        if [ -n "$resolution_number" ]; then
            log_info "Verificando resolución: $resolution_number"
            
            resolution_data=$(get_resolution "$resolution_number" "$TOKEN")
            
            # Verificar que tiene imágenes
            images_count=$(echo "$resolution_data" | jq -r '.[0].images | length' 2>/dev/null || echo "0")
            
            if [ "$images_count" -gt 0 ]; then
                log_success "Resolución $resolution_number tiene $images_count imagen(es)"
                
                # Verificar URLs de imágenes
                image_urls=$(echo "$resolution_data" | jq -r '.[0].images[]' 2>/dev/null)
                echo "$image_urls" | while read -r image_url; do
                    if [ -n "$image_url" ]; then
                        log_info "URL de imagen: $image_url"
                        
                        # Verificar si es URL de Cloudinary o local
                        if echo "$image_url" | grep -q "cloudinary.com"; then
                            log_success "Imagen almacenada en Cloudinary (persistente)"
                        elif echo "$image_url" | grep -q "uploads"; then
                            log_warning "Imagen almacenada localmente (no persistente en Render)"
                        else
                            log_warning "Formato de URL no reconocido: $image_url"
                        fi
                    fi
                done
            else
                log_error "Resolución $resolution_number NO tiene imágenes"
            fi
        fi
    done
else
    log_warning "No se encontraron resoluciones creadas en esta sesión"
fi

echo ""

# ===========================================
# PRUEBA 7: SIMULAR REINICIO (TEST DE MEMORIA)
# ===========================================
log_test "PRUEBA 7: Simulación de reinicio - Test de memoria vs persistencia"

log_info "Esperando 5 segundos para simular paso del tiempo..."
sleep 5

# Obtener nuevo token (simula nueva sesión)
NEW_TOKEN=$(get_auth_token)

if [ -n "$NEW_TOKEN" ] && [ "$NEW_TOKEN" != "null" ]; then
    log_success "Nuevo token obtenido (simula nueva sesión)"
    
    # Verificar que todas las resoluciones siguen ahí
    AFTER_RESTART_RESOLUTIONS=$(get_all_resolutions "$NEW_TOKEN")
    AFTER_RESTART_COUNT=$(echo "$AFTER_RESTART_RESOLUTIONS" | jq '. | length' 2>/dev/null || echo "0")
    
    log_info "Resoluciones después de 'reinicio': $AFTER_RESTART_COUNT"
    
    if [ $AFTER_RESTART_COUNT -eq $AFTER_CREATE_COUNT ]; then
        log_success "PERSISTENCIA VERIFICADA: Todas las resoluciones sobreviven al reinicio simulado"
    else
        log_error "PROBLEMA DE PERSISTENCIA: Se perdieron datos después del reinicio simulado"
    fi
else
    log_error "No se pudo obtener nuevo token después del reinicio simulado"
fi

echo ""

# ===========================================
# PRUEBA 8: PRUEBA DE CARGA (MÚLTIPLES OPERACIONES)
# ===========================================
log_test "PRUEBA 8: Prueba de carga - Operaciones concurrentes"

log_info "Creando 3 resoluciones adicionales rápidamente..."

for i in {6..8}; do
    timestamp=$(date +%s)
    res_number="LOAD-TEST-$i-$timestamp"
    subject="Prueba de carga $i - $timestamp"
    reference="REF-LOAD-$i-$timestamp"
    image_file="imagen-load-$i-$timestamp.txt"
    
    create_test_image "$image_file" "IMAGEN DE CARGA $i - $timestamp"
    
    # Crear resolución sin esperar
    create_response=$(create_resolution_with_image "$res_number" "$subject" "$reference" "$image_file" "$NEW_TOKEN")
    
    if echo "$create_response" | grep -q "exitosamente"; then
        log_success "Resolución de carga $i creada"
        ((RESOLUTIONS_CREATED++))
    else
        log_error "Error en resolución de carga $i"
    fi
done

echo ""

# ===========================================
# PRUEBA 9: VERIFICACIÓN FINAL DE CONSISTENCIA
# ===========================================
log_test "PRUEBA 9: Verificación final de consistencia de datos"

FINAL_RESOLUTIONS=$(get_all_resolutions "$NEW_TOKEN")
FINAL_COUNT=$(echo "$FINAL_RESOLUTIONS" | jq '. | length' 2>/dev/null || echo "0")

log_info "Conteo final de resoluciones: $FINAL_COUNT"
log_info "Resoluciones creadas en total: $RESOLUTIONS_CREATED"
log_info "Conteo inicial: $INITIAL_COUNT"
log_info "Esperado final: $((INITIAL_COUNT + RESOLUTIONS_CREATED))"

if [ $FINAL_COUNT -eq $((INITIAL_COUNT + RESOLUTIONS_CREATED)) ]; then
    log_success "CONSISTENCIA PERFECTA: Todos los datos están presentes"
else
    difference=$((FINAL_COUNT - INITIAL_COUNT))
    log_warning "INCONSISTENCIA: Esperado $RESOLUTIONS_CREATED, encontrado $difference nuevas resoluciones"
fi

# Verificar que no hay duplicados
DUPLICATE_CHECK=$(echo "$FINAL_RESOLUTIONS" | jq -r '.[].NumdeResolucion' | sort | uniq -d 2>/dev/null)

if [ -z "$DUPLICATE_CHECK" ]; then
    log_success "No se encontraron duplicados - Integridad OK"
else
    log_error "Se encontraron duplicados: $DUPLICATE_CHECK"
fi

echo ""

# ===========================================
# PRUEBA 10: ANÁLISIS DE CONFIGURACIÓN DE ALMACENAMIENTO
# ===========================================
log_test "PRUEBA 10: Análisis de configuración de almacenamiento"

# Verificar configuración de Cloudinary
if [ -f "server/.env" ]; then
    if grep -q "CLOUDINARY_CLOUD_NAME=" server/.env; then
        CLOUD_NAME=$(grep "CLOUDINARY_CLOUD_NAME=" server/.env | cut -d'=' -f2)
        if [ -n "$CLOUD_NAME" ] && [ "$CLOUD_NAME" != "" ]; then
            log_success "Cloudinary configurado (Cloud Name: $CLOUD_NAME)"
            log_info "PREDICCIÓN: En producción usará Cloudinary (persistente)"
        else
            log_warning "Cloudinary definido pero vacío - usando almacenamiento local"
            log_warning "PREDICCIÓN: En producción podría perder imágenes"
        fi
    else
        log_warning "Cloudinary no configurado - usando almacenamiento local"
        log_warning "PREDICCIÓN: En producción perderá imágenes"
    fi
else
    log_error "Archivo .env no encontrado"
fi

# Verificar directorio uploads
if [ -d "server/uploads" ]; then
    upload_count=$(find server/uploads -type f 2>/dev/null | wc -l)
    log_info "Archivos en directorio uploads: $upload_count"
    
    if [ $upload_count -gt 0 ]; then
        log_warning "Usando almacenamiento local - archivos se perderán en Render"
    fi
else
    log_info "Directorio uploads no existe (posiblemente usando Cloudinary)"
fi

echo ""

# ===========================================
# REPORTE FINAL
# ===========================================
echo "📊 REPORTE FINAL DE PRUEBAS DE PERSISTENCIA"
echo "==========================================="
echo ""

# Calcular estadísticas
TOTAL_EXPECTED=$((INITIAL_COUNT + RESOLUTIONS_CREATED))
SUCCESS_RATE=0

if [ $TESTS_TOTAL -gt 0 ]; then
    SUCCESS_RATE=$((TESTS_PASSED * 100 / TESTS_TOTAL))
fi

echo -e "${BLUE}📈 ESTADÍSTICAS:${NC}"
echo "   • Total de pruebas ejecutadas: $TESTS_TOTAL"
echo "   • Pruebas exitosas: $TESTS_PASSED"
echo "   • Pruebas fallidas: $TESTS_FAILED"
echo "   • Tasa de éxito: $SUCCESS_RATE%"
echo ""

echo -e "${BLUE}📊 DATOS:${NC}"
echo "   • Resoluciones iniciales: $INITIAL_COUNT"
echo "   • Resoluciones creadas: $RESOLUTIONS_CREATED"
echo "   • Imágenes subidas: $IMAGES_UPLOADED"
echo "   • Total final: $FINAL_COUNT"
echo "   • Esperado: $TOTAL_EXPECTED"
echo ""

# Evaluación final
echo -e "${BLUE}🎯 EVALUACIÓN FINAL:${NC}"

if [ $FINAL_COUNT -eq $TOTAL_EXPECTED ] && [ $SUCCESS_RATE -ge 80 ]; then
    echo -e "${GREEN}✅ PERSISTENCIA VERIFICADA EXITOSAMENTE${NC}"
    echo ""
    echo "   🏆 Todos los datos persisten correctamente"
    echo "   🏆 No hay pérdida de información"
    echo "   🏆 Sistema funcionando como esperado"
    echo ""
    
    if grep -q "cloudinary.com" $TEST_RESULTS_FILE 2>/dev/null; then
        echo -e "${GREEN}   🌩️  CLOUDINARY DETECTADO: Datos persistirán en producción${NC}"
    else
        echo -e "${YELLOW}   ⚠️  ALMACENAMIENTO LOCAL: Configurar Cloudinary para producción${NC}"
    fi
    
elif [ $FINAL_COUNT -eq $TOTAL_EXPECTED ]; then
    echo -e "${YELLOW}⚠️  PERSISTENCIA PARCIAL${NC}"
    echo ""
    echo "   ✅ Los datos persisten en esta sesión"
    echo "   ⚠️  Algunas pruebas tuvieron advertencias"
    echo "   💡 Revisar configuración de almacenamiento"
    
else
    echo -e "${RED}❌ PROBLEMA DE PERSISTENCIA DETECTADO${NC}"
    echo ""
    echo "   ❌ Se perdieron datos durante las pruebas"
    echo "   ❌ Diferencia: esperado $TOTAL_EXPECTED, actual $FINAL_COUNT"
    echo "   🔧 Requiere investigación adicional"
fi

echo ""

# Recomendaciones
echo -e "${BLUE}📋 RECOMENDACIONES:${NC}"

if grep -q "CLOUDINARY_CLOUD_NAME=" server/.env && grep -q "CLOUDINARY_API_KEY=" server/.env; then
    CLOUD_NAME=$(grep "CLOUDINARY_CLOUD_NAME=" server/.env | cut -d'=' -f2)
    if [ -n "$CLOUD_NAME" ] && [ "$CLOUD_NAME" != "" ]; then
        echo "   ✅ Cloudinary configurado - listo para producción"
    else
        echo "   🔧 Configurar credenciales de Cloudinary para producción"
        echo "   📝 Variables requeridas: CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET"
    fi
else
    echo "   🔧 Configurar Cloudinary para persistencia en producción"
    echo "   📝 Sin Cloudinary, las imágenes se perderán en Render"
fi

echo "   📊 Monitorear regularmente la persistencia de datos"
echo "   🧪 Ejecutar estas pruebas antes de cada deployment"

echo ""

# Limpiar archivos de prueba
echo "🧹 Limpiando archivos temporales..."
rm -rf $TEST_DIR

echo ""
echo "📁 Log completo guardado en: $TEST_RESULTS_FILE"
echo "🏁 Pruebas completadas - $(date)"

# Exit code basado en resultados
if [ $FINAL_COUNT -eq $TOTAL_EXPECTED ] && [ $SUCCESS_RATE -ge 80 ]; then
    exit 0
else
    exit 1
fi
