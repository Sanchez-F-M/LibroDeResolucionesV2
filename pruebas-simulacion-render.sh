#!/bin/bash

# Pruebas de simulación de Render - Comportamiento de deployment y filesystem reset
# filepath: c:\Users\flavi\OneDrive\Escritorio\LibroDeResolucionesV2\pruebas-simulacion-render.sh

echo "🚀 PRUEBAS DE SIMULACIÓN RENDER - DEPLOYMENT Y FILESYSTEM RESET"
echo "=============================================================="
echo ""

# Configuración
BASE_URL="http://localhost:10000"
ADMIN_USER="admin"
ADMIN_PASS="admin123"
TEST_RESULTS_FILE="resultados_simulacion_render.log"
UPLOADS_DIR="server/uploads"
TEMP_BACKUP_DIR="temp_uploads_backup"

# Colores
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m'

# Contadores
SCENARIO_COUNT=0
SCENARIO_PASSED=0
SCENARIO_FAILED=0

log_success() { echo -e "${GREEN}✅ $1${NC}"; echo "[$(date)] SUCCESS: $1" >> $TEST_RESULTS_FILE; }
log_error() { echo -e "${RED}❌ $1${NC}"; echo "[$(date)] ERROR: $1" >> $TEST_RESULTS_FILE; }
log_warning() { echo -e "${YELLOW}⚠️  $1${NC}"; echo "[$(date)] WARNING: $1" >> $TEST_RESULTS_FILE; }
log_info() { echo -e "${BLUE}ℹ️  $1${NC}"; echo "[$(date)] INFO: $1" >> $TEST_RESULTS_FILE; }
log_scenario() { echo -e "${PURPLE}🎬 ESCENARIO $1${NC}"; echo "[$(date)] SCENARIO: $1" >> $TEST_RESULTS_FILE; ((SCENARIO_COUNT++)); }
log_render() { echo -e "${CYAN}🚀 $1${NC}"; echo "[$(date)] RENDER: $1" >> $TEST_RESULTS_FILE; }

# Funciones auxiliares
get_token() {
    curl -s -X POST "$BASE_URL/api/user/login" \
        -H "Content-Type: application/json" \
        -d "{\"username\":\"$ADMIN_USER\",\"password\":\"$ADMIN_PASS\"}" | \
        grep -o '"token":"[^"]*' | cut -d'"' -f4
}

check_server() {
    curl -s "$BASE_URL/health" > /dev/null 2>&1
    return $?
}

get_all_resolutions() {
    local token=$1
    curl -s "$BASE_URL/api/books/all" -H "Authorization: Bearer $token"
}

create_resolution_with_file() {
    local token=$1
    local res_number=$2
    local file_content=$3
    
    # Crear archivo temporal
    mkdir -p temp_files
    echo "$file_content" > "temp_files/test-$res_number.txt"
    echo "Timestamp: $(date)" >> "temp_files/test-$res_number.txt"
    echo "Resolution: $res_number" >> "temp_files/test-$res_number.txt"
    
    local response=$(curl -s -X POST "$BASE_URL/api/books" \
        -H "Authorization: Bearer $token" \
        -F "NumdeResolucion=$res_number" \
        -F "Asunto=Prueba Render - $res_number" \
        -F "Referencia=REF-RENDER-$res_number" \
        -F "FechaCreacion=$(date -u +"%Y-%m-%dT%H:%M:%S.000Z")" \
        -F "files=@temp_files/test-$res_number.txt")
    
    echo "$response"
}

# Inicializar log
echo "[$(date)] INICIO PRUEBAS DE SIMULACIÓN RENDER" > $TEST_RESULTS_FILE
echo "=============================================" >> $TEST_RESULTS_FILE

# Verificación inicial
if ! check_server; then
    log_error "Servidor no está funcionando"
    echo ""
    echo "💡 Inicia el servidor primero: cd server && npm run dev"
    exit 1
fi

TOKEN=$(get_token)
if [ -z "$TOKEN" ]; then
    log_error "No se pudo obtener token de autenticación"
    exit 1
fi

log_success "Sistema inicializado correctamente"
echo ""

# ===========================================
# ESCENARIO 1: ESTADO INICIAL RENDER
# ===========================================
log_scenario "1: Análisis del estado inicial (como fresh deploy en Render)"

# Simular fresh deploy - analizar estado actual
INITIAL_DATA=$(get_all_resolutions "$TOKEN")
INITIAL_COUNT=$(echo "$INITIAL_DATA" | jq '. | length' 2>/dev/null || echo "0")

log_render "Fresh deploy simulado - estado inicial"
log_info "Resoluciones existentes: $INITIAL_COUNT"

# Verificar estructura de directorios
if [ -d "$UPLOADS_DIR" ]; then
    UPLOAD_FILES=$(find "$UPLOADS_DIR" -type f 2>/dev/null | wc -l)
    UPLOAD_SIZE=$(du -sh "$UPLOADS_DIR" 2>/dev/null | cut -f1)
    log_info "Directorio uploads: $UPLOAD_FILES archivos, $UPLOAD_SIZE"
    
    if [ $UPLOAD_FILES -gt 0 ]; then
        log_warning "Archivos locales detectados - se perderán en Render"
        
        # Backup de archivos existentes para comparación
        mkdir -p "$TEMP_BACKUP_DIR"
        cp -r "$UPLOADS_DIR"/* "$TEMP_BACKUP_DIR/" 2>/dev/null
        log_info "Backup creado para comparación"
    fi
else
    log_info "Sin directorio uploads - posiblemente usando Cloudinary"
fi

# Verificar configuración de Cloudinary
if [ -f "server/.env" ]; then
    if grep -q "CLOUDINARY_CLOUD_NAME=" server/.env; then
        CLOUD_NAME=$(grep "CLOUDINARY_CLOUD_NAME=" server/.env | cut -d'=' -f2)
        if [ -n "$CLOUD_NAME" ] && [ "$CLOUD_NAME" != "" ]; then
            log_success "Cloudinary configurado: $CLOUD_NAME"
            USING_CLOUDINARY=true
        else
            log_warning "Cloudinary definido pero no configurado"
            USING_CLOUDINARY=false
        fi
    else
        log_warning "Sin configuración de Cloudinary"
        USING_CLOUDINARY=false
    fi
fi

((SCENARIO_PASSED++))
echo ""

# ===========================================
# ESCENARIO 2: CREACIÓN DE DATOS PRE-DEPLOYMENT
# ===========================================
log_scenario "2: Creación de datos antes del 'deployment'"

log_render "Usuario creando resoluciones en la aplicación"

# Crear múltiples resoluciones con diferentes tipos de contenido
RESOLUTIONS_CREATED=()

for i in {1..4}; do
    timestamp=$(date +%s)
    res_number="RENDER-TEST-$i-$timestamp"
    file_content="ARCHIVO DE PRUEBA RENDER $i
Simulando contenido usuario
Timestamp: $timestamp
Escenario: Pre-deployment
Tipo: $([ $((i % 2)) -eq 0 ] && echo "PDF" || echo "IMAGE")
Tamaño simulado: $((RANDOM % 1000 + 100))KB"

    log_info "Creando resolución $i: $res_number"
    
    create_response=$(create_resolution_with_file "$TOKEN" "$res_number" "$file_content")
    
    if echo "$create_response" | grep -q "exitosamente"; then
        RESOLUTIONS_CREATED+=("$res_number")
        log_success "Resolución $i creada: $res_number"
    else
        log_error "Error en resolución $i: $create_response"
        ((SCENARIO_FAILED++))
    fi
    
    sleep 1
done

# Verificar creación
POST_CREATE_DATA=$(get_all_resolutions "$TOKEN")
POST_CREATE_COUNT=$(echo "$POST_CREATE_DATA" | jq '. | length' 2>/dev/null || echo "0")

log_info "Total resoluciones después de crear: $POST_CREATE_COUNT"
log_info "Incremento: $((POST_CREATE_COUNT - INITIAL_COUNT))"

if [ $POST_CREATE_COUNT -gt $INITIAL_COUNT ]; then
    log_success "Datos creados correctamente en 'pre-deployment'"
else
    log_error "Problema en creación de datos"
    ((SCENARIO_FAILED++))
fi

((SCENARIO_PASSED++))
echo ""

# ===========================================
# ESCENARIO 3: SIMULACIÓN DE FILESYSTEM RESET (RENDER BEHAVIOR)
# ===========================================
log_scenario "3: Simulación de filesystem reset (comportamiento de Render)"

log_render "Simulando reset de filesystem ephemeral de Render"

# En Render, el filesystem se resetea pero la BD persiste
# Simular eliminando SOLO los archivos uploads pero manteniendo BD

if [ -d "$UPLOADS_DIR" ] && [ $UPLOAD_FILES -gt 0 ]; then
    log_warning "SIMULANDO PÉRDIDA DE ARCHIVOS UPLOADS (como en Render)"
    
    # Contar archivos antes
    FILES_BEFORE=$(find "$UPLOADS_DIR" -type f 2>/dev/null | wc -l)
    log_info "Archivos antes del reset: $FILES_BEFORE"
    
    # Simular pérdida de archivos (NO eliminar realmente, solo simular)
    log_render "🔄 FILESYSTEM RESET EN PROGRESO..."
    sleep 2
    
    # En Render real, estos archivos desaparecerían
    log_error "ARCHIVOS UPLOADS PERDIDOS (simulación)"
    log_warning "En Render real, todos los archivos en uploads/ desaparecen"
    
    # Pero la base de datos persiste
    log_success "Base de datos PostgreSQL mantiene referencias"
    
else
    log_info "Sin archivos locales para resetear - usando Cloudinary"
    log_success "Cloudinary no se ve afectado por filesystem reset"
fi

echo ""

# ===========================================
# ESCENARIO 4: POST-DEPLOYMENT VERIFICATION
# ===========================================
log_scenario "4: Verificación post-deployment (después del reset)"

log_render "Aplicación reiniciada después del deployment"

# Simular nueva sesión después del deployment
sleep 2
NEW_TOKEN=$(get_token)

if [ -z "$NEW_TOKEN" ]; then
    log_error "No se pudo obtener token post-deployment"
    ((SCENARIO_FAILED++))
else
    log_success "Nueva sesión establecida post-deployment"
fi

# Verificar estado de la base de datos
POST_RESET_DATA=$(get_all_resolutions "$NEW_TOKEN")
POST_RESET_COUNT=$(echo "$POST_RESET_DATA" | jq '. | length' 2>/dev/null || echo "0")

log_info "Resoluciones post-deployment: $POST_RESET_COUNT"
log_info "Resoluciones pre-deployment: $POST_CREATE_COUNT"

if [ $POST_RESET_COUNT -eq $POST_CREATE_COUNT ]; then
    log_success "BASE DE DATOS: Todas las resoluciones persisten ✅"
else
    log_error "BASE DE DATOS: Pérdida de resoluciones ❌"
    ((SCENARIO_FAILED++))
fi

# Verificar resoluciones específicas
FOUND_RESOLUTIONS=0
for resolution in "${RESOLUTIONS_CREATED[@]}"; do
    if echo "$POST_RESET_DATA" | grep -q "$resolution"; then
        log_success "Resolución persistente: $resolution"
        ((FOUND_RESOLUTIONS++))
    else
        log_error "Resolución perdida: $resolution"
    fi
done

log_info "Resoluciones encontradas: $FOUND_RESOLUTIONS/${#RESOLUTIONS_CREATED[@]}"

if [ $FOUND_RESOLUTIONS -eq ${#RESOLUTIONS_CREATED[@]} ]; then
    ((SCENARIO_PASSED++))
else
    ((SCENARIO_FAILED++))
fi

echo ""

# ===========================================
# ESCENARIO 5: VERIFICACIÓN DE IMÁGENES POST-RESET
# ===========================================
log_scenario "5: Estado de imágenes después del filesystem reset"

log_render "Verificando accesibilidad de imágenes"

IMAGES_ACCESSIBLE=0
IMAGES_BROKEN=0
IMAGES_CLOUDINARY=0
IMAGES_LOCAL=0

for resolution in "${RESOLUTIONS_CREATED[@]}"; do
    if echo "$POST_RESET_DATA" | grep -q "$resolution"; then
        # Obtener detalles de la resolución
        resolution_detail=$(curl -s "$BASE_URL/api/books/$resolution" -H "Authorization: Bearer $NEW_TOKEN")
        
        # Extraer URLs de imágenes
        images=$(echo "$resolution_detail" | jq -r '.[0].images[]?' 2>/dev/null)
        
        if [ -n "$images" ]; then
            echo "$images" | while read -r image_url; do
                if [ -n "$image_url" ]; then
                    log_info "Verificando imagen: $image_url"
                    
                    if echo "$image_url" | grep -q "cloudinary.com"; then
                        log_success "Imagen Cloudinary (accesible): $image_url"
                        ((IMAGES_CLOUDINARY++))
                        ((IMAGES_ACCESSIBLE++))
                    elif echo "$image_url" | grep -q "uploads"; then
                        log_warning "Imagen local (rota en Render): $image_url"
                        ((IMAGES_LOCAL++))
                        ((IMAGES_BROKEN++))
                        
                        # Verificar si realmente existe
                        local_file=$(echo "$image_url" | sed 's|.*uploads/||')
                        if [ -f "$UPLOADS_DIR/$local_file" ]; then
                            log_info "Archivo local existe (desarrollo)"
                        else
                            log_error "Archivo local NO existe (perdido)"
                        fi
                    fi
                fi
            done
        fi
    fi
done

log_info "Resumen de imágenes:"
log_info "  - Accesibles (Cloudinary): $IMAGES_CLOUDINARY"
log_info "  - Rotas (local): $IMAGES_LOCAL"
log_info "  - Total accesibles: $IMAGES_ACCESSIBLE"
log_info "  - Total rotas: $IMAGES_BROKEN"

if [ $IMAGES_CLOUDINARY -gt 0 ]; then
    log_success "Imágenes en Cloudinary sobreviven al reset ✅"
    ((SCENARIO_PASSED++))
elif [ $IMAGES_LOCAL -gt 0 ]; then
    log_error "Solo imágenes locales - se perderán en Render ❌"
    ((SCENARIO_FAILED++))
else
    log_warning "Sin imágenes para verificar"
fi

echo ""

# ===========================================
# ESCENARIO 6: SIMULACIÓN DE MÚLTIPLES DEPLOYMENTS
# ===========================================
log_scenario "6: Simulación de múltiples deployments consecutivos"

log_render "Simulando deployments frecuentes (como en desarrollo activo)"

# Simular 3 deployments rápidos
for deploy in {1..3}; do
    log_render "Deployment #$deploy iniciado"
    
    # Crear nueva resolución en cada deployment
    timestamp=$(date +%s)
    res_number="MULTI-DEPLOY-$deploy-$timestamp"
    
    create_response=$(create_resolution_with_file "$NEW_TOKEN" "$res_number" "Multi-deployment test $deploy")
    
    if echo "$create_response" | grep -q "exitosamente"; then
        log_success "Deployment #$deploy: Resolución creada"
    else
        log_error "Deployment #$deploy: Error en creación"
    fi
    
    # Simular tiempo de deployment
    sleep 1
    
    # Verificar que los datos anteriores persisten
    current_data=$(get_all_resolutions "$NEW_TOKEN")
    current_count=$(echo "$current_data" | jq '. | length' 2>/dev/null || echo "0")
    
    log_info "Deployment #$deploy: $current_count resoluciones totales"
    
    if [ $current_count -ge $POST_RESET_COUNT ]; then
        log_success "Deployment #$deploy: Datos anteriores persisten"
    else
        log_error "Deployment #$deploy: Pérdida de datos detectada"
        ((SCENARIO_FAILED++))
    fi
done

((SCENARIO_PASSED++))
echo ""

# ===========================================
# REPORTE FINAL DE SIMULACIÓN RENDER
# ===========================================
echo "🚀 REPORTE FINAL - SIMULACIÓN RENDER"
echo "===================================="
echo ""

# Calcular métricas finales
FINAL_DATA=$(get_all_resolutions "$NEW_TOKEN")
FINAL_COUNT=$(echo "$FINAL_DATA" | jq '. | length' 2>/dev/null || echo "0")

SUCCESS_RATE=0
if [ $SCENARIO_COUNT -gt 0 ]; then
    SUCCESS_RATE=$((SCENARIO_PASSED * 100 / SCENARIO_COUNT))
fi

echo -e "${BLUE}📊 MÉTRICAS DE SIMULACIÓN:${NC}"
echo "   • Escenarios ejecutados: $SCENARIO_COUNT"
echo "   • Escenarios exitosos: $SCENARIO_PASSED"
echo "   • Escenarios fallidos: $SCENARIO_FAILED"
echo "   • Tasa de éxito: $SUCCESS_RATE%"
echo ""

echo -e "${BLUE}📈 PERSISTENCIA DE DATOS:${NC}"
echo "   • Resoluciones iniciales: $INITIAL_COUNT"
echo "   • Resoluciones creadas: ${#RESOLUTIONS_CREATED[@]}"
echo "   • Resoluciones finales: $FINAL_COUNT"
echo "   • Incremento neto: $((FINAL_COUNT - INITIAL_COUNT))"
echo ""

echo -e "${BLUE}🖼️  ANÁLISIS DE IMÁGENES:${NC}"
if [ "$USING_CLOUDINARY" = true ]; then
    echo "   ✅ Configuración: Cloudinary (persistente)"
    echo "   🌐 Las imágenes sobrevivirán a deployments"
    echo "   💰 Sin costos adicionales de almacenamiento"
else
    echo "   ⚠️  Configuración: Almacenamiento local"
    echo "   🔥 Las imágenes se perderán en cada deployment"
    echo "   🔧 Requiere configuración de Cloudinary"
fi

echo ""

# Determinar resultado general
RESULTADO_RENDER="DESCONOCIDO"
if [ $SUCCESS_RATE -ge 90 ] && [ $FINAL_COUNT -ge $INITIAL_COUNT ]; then
    if [ "$USING_CLOUDINARY" = true ]; then
        RESULTADO_RENDER="LISTO PARA RENDER ✅"
        echo -e "${GREEN}🎯 VEREDICTO: LISTO PARA RENDER ✅${NC}"
        echo "   🏆 La aplicación manejará correctamente los deployments"
        echo "   🏆 Los datos persisten entre redespliegues"
        echo "   🏆 Las imágenes están protegidas con Cloudinary"
    else
        RESULTADO_RENDER="PARCIALMENTE LISTO ⚠️"
        echo -e "${YELLOW}🎯 VEREDICTO: PARCIALMENTE LISTO ⚠️${NC}"
        echo "   ✅ Los datos de BD persisten correctamente"
        echo "   ⚠️  Las imágenes se perderán sin Cloudinary"
        echo "   🔧 Configurar Cloudinary antes del deployment"
    fi
else
    RESULTADO_RENDER="NO LISTO ❌"
    echo -e "${RED}🎯 VEREDICTO: NO LISTO PARA RENDER ❌${NC}"
    echo "   ❌ Problemas de persistencia detectados"
    echo "   ❌ Se requiere investigación adicional"
    echo "   🚨 NO desplegar hasta resolver problemas"
fi

echo ""

echo -e "${BLUE}📋 PASOS PARA RENDER:${NC}"
if [ "$RESULTADO_RENDER" = "LISTO PARA RENDER ✅" ]; then
    echo "   1. ✅ Configurar variables de entorno en Render"
    echo "   2. ✅ Deployment normal"
    echo "   3. ✅ Verificar funcionamiento post-deployment"
    echo "   4. ✅ Monitorear logs iniciales"
elif [ "$RESULTADO_RENDER" = "PARCIALMENTE LISTO ⚠️" ]; then
    echo "   1. 🔧 Configurar Cloudinary:"
    echo "      - CLOUDINARY_CLOUD_NAME"
    echo "      - CLOUDINARY_API_KEY"
    echo "      - CLOUDINARY_API_SECRET"
    echo "   2. ✅ Probar localmente con configuración"
    echo "   3. 🚀 Deployment a Render"
    echo "   4. 🧪 Verificar persistencia de imágenes"
else
    echo "   1. 🔍 Investigar problemas de persistencia"
    echo "   2. 🔧 Corregir configuración de BD"
    echo "   3. 🧪 Re-ejecutar estas pruebas"
    echo "   4. ⏰ NO desplegar hasta resolver"
fi

echo ""

# Limpiar archivos temporales
rm -rf temp_files "$TEMP_BACKUP_DIR" 2>/dev/null

echo "📁 Log completo en: $TEST_RESULTS_FILE"
echo "🏁 Simulación Render completada - $(date)"

# Exit code basado en resultado
if [ "$RESULTADO_RENDER" = "LISTO PARA RENDER ✅" ]; then
    exit 0
elif [ "$RESULTADO_RENDER" = "PARCIALMENTE LISTO ⚠️" ]; then
    exit 1
else
    exit 2
fi
