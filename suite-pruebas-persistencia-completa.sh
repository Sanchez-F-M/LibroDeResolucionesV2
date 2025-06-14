#!/bin/bash

# Suite completa de pruebas de persistencia - Maestro
# filepath: c:\Users\flavi\OneDrive\Escritorio\LibroDeResolucionesV2\suite-pruebas-persistencia-completa.sh

echo "🔬 SUITE COMPLETA DE PRUEBAS DE PERSISTENCIA"
echo "============================================"
echo "🎯 Objetivo: Verificar si la aplicación persiste datos o se resetea/recrea"
echo ""

# Configuración
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
RESULTS_DIR="resultados_persistencia_$TIMESTAMP"
SUMMARY_FILE="$RESULTS_DIR/resumen_ejecutivo.md"

# Colores
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m'

# Contadores globales
TOTAL_SUITES=3
SUITES_PASSED=0
SUITES_FAILED=0
SUITES_WARNING=0

log_header() { echo -e "${CYAN}🚀 $1${NC}"; }
log_success() { echo -e "${GREEN}✅ $1${NC}"; }
log_error() { echo -e "${RED}❌ $1${NC}"; }
log_warning() { echo -e "${YELLOW}⚠️  $1${NC}"; }
log_info() { echo -e "${BLUE}ℹ️  $1${NC}"; }
log_suite() { echo -e "${PURPLE}📋 SUITE $1${NC}"; }

# Función para verificar servidor
check_server() {
    curl -s http://localhost:10000/health > /dev/null 2>&1
    return $?
}

# Crear directorio de resultados
mkdir -p "$RESULTS_DIR"

echo "📁 Resultados se guardarán en: $RESULTS_DIR"
echo ""

# Verificación inicial
log_header "VERIFICACIÓN INICIAL DEL SISTEMA"

if check_server; then
    log_success "Servidor backend funcionando en puerto 10000"
else
    log_error "El servidor no está funcionando"
    echo ""
    echo "🚨 IMPORTANTE: El servidor debe estar ejecutándose para las pruebas"
    echo ""
    echo "Para iniciar el servidor:"
    echo "   cd server"
    echo "   npm run dev"
    echo ""
    echo "Después ejecuta este script nuevamente."
    exit 1
fi

# Verificar autenticación
TOKEN_TEST=$(curl -s -X POST "http://localhost:10000/api/user/login" \
    -H "Content-Type: application/json" \
    -d '{"Nombre":"admin","Contrasena":"admin123"}' | \
    grep -o '"token":"[^"]*' | cut -d'"' -f4)

if [ -n "$TOKEN_TEST" ]; then
    log_success "Sistema de autenticación funcionando"
else
    log_error "Problema con autenticación - verificar usuario admin"
    exit 1
fi

echo ""

# Inicializar reporte ejecutivo
cat > "$SUMMARY_FILE" << EOF
# 📊 REPORTE EJECUTIVO - PRUEBAS DE PERSISTENCIA

**Fecha:** $(date)  
**Objetivo:** Verificar comportamiento de persistencia de datos  
**Sistema:** Libro de Resoluciones V2  

## 🎯 RESUMEN EJECUTIVO

EOF

# ===========================================
# SUITE 1: PRUEBAS EXHAUSTIVAS DE PERSISTENCIA
# ===========================================
log_suite "1: PRUEBAS EXHAUSTIVAS DE PERSISTENCIA"
echo ""

log_info "Ejecutando pruebas exhaustivas de persistencia..."
log_info "Estas pruebas verifican la persistencia básica de datos"

if bash pruebas-persistencia-exhaustivas.sh > "$RESULTS_DIR/suite1_exhaustivas.log" 2>&1; then
    SUITE1_RESULT="EXITOSO"
    log_success "Suite 1 completada exitosamente"
    ((SUITES_PASSED++))
else
    SUITE1_EXIT_CODE=$?
    if [ $SUITE1_EXIT_CODE -eq 1 ]; then
        SUITE1_RESULT="CON ADVERTENCIAS"
        log_warning "Suite 1 completada con advertencias"
        ((SUITES_WARNING++))
    else
        SUITE1_RESULT="FALLIDO"
        log_error "Suite 1 falló"
        ((SUITES_FAILED++))
    fi
fi

# Extraer métricas de la suite 1
if [ -f "resultados_persistencia.log" ]; then
    SUITE1_METRICS=$(tail -20 "resultados_persistencia.log")
    mv "resultados_persistencia.log" "$RESULTS_DIR/"
fi

echo ""

# ===========================================
# SUITE 2: PRUEBAS DE REINICIO DE SERVIDOR
# ===========================================
log_suite "2: PRUEBAS DE REINICIO DE SERVIDOR"
echo ""

log_info "Ejecutando pruebas de reinicio de servidor..."
log_info "Estas pruebas simulan reinicios y verifican persistencia"

# Dar tiempo para que el servidor se estabilice después de la suite anterior
sleep 3

if bash pruebas-reinicio-servidor.sh > "$RESULTS_DIR/suite2_reinicio.log" 2>&1; then
    SUITE2_RESULT="EXITOSO"
    log_success "Suite 2 completada exitosamente"
    ((SUITES_PASSED++))
else
    SUITE2_EXIT_CODE=$?
    if [ $SUITE2_EXIT_CODE -eq 1 ]; then
        SUITE2_RESULT="CON ADVERTENCIAS"
        log_warning "Suite 2 completada con advertencias"
        ((SUITES_WARNING++))
    else
        SUITE2_RESULT="FALLIDO"
        log_error "Suite 2 falló"
        ((SUITES_FAILED++))
    fi
fi

# Extraer métricas de la suite 2
if [ -f "resultados_reinicio.log" ]; then
    SUITE2_METRICS=$(tail -20 "resultados_reinicio.log")
    mv "resultados_reinicio.log" "$RESULTS_DIR/"
fi

echo ""

# ===========================================
# SUITE 3: SIMULACIÓN DE RENDER
# ===========================================
log_suite "3: SIMULACIÓN DE COMPORTAMIENTO RENDER"
echo ""

log_info "Ejecutando simulación de Render deployment..."
log_info "Estas pruebas simulan el comportamiento específico de Render"

# Dar tiempo para estabilización
sleep 3

if bash pruebas-simulacion-render.sh > "$RESULTS_DIR/suite3_render.log" 2>&1; then
    SUITE3_RESULT="EXITOSO"
    log_success "Suite 3 completada exitosamente"
    ((SUITES_PASSED++))
else
    SUITE3_EXIT_CODE=$?
    if [ $SUITE3_EXIT_CODE -eq 1 ]; then
        SUITE3_RESULT="CON ADVERTENCIAS"
        log_warning "Suite 3 completada con advertencias"
        ((SUITES_WARNING++))
    else
        SUITE3_RESULT="FALLIDO"
        log_error "Suite 3 falló"
        ((SUITES_FAILED++))
    fi
fi

# Extraer métricas de la suite 3
if [ -f "resultados_simulacion_render.log" ]; then
    SUITE3_METRICS=$(tail -20 "resultados_simulacion_render.log")
    mv "resultados_simulacion_render.log" "$RESULTS_DIR/"
fi

echo ""

# ===========================================
# ANÁLISIS CONSOLIDADO
# ===========================================
log_header "ANÁLISIS CONSOLIDADO DE RESULTADOS"

# Obtener estado final del sistema
FINAL_TOKEN=$(curl -s -X POST "http://localhost:10000/api/user/login" \
    -H "Content-Type: application/json" \
    -d '{"username":"admin","password":"admin123"}' | \
    grep -o '"token":"[^"]*' | cut -d'"' -f4)

if [ -n "$FINAL_TOKEN" ]; then
    FINAL_DATA=$(curl -s "http://localhost:10000/api/books/all" -H "Authorization: Bearer $FINAL_TOKEN")
    FINAL_COUNT=$(echo "$FINAL_DATA" | jq '. | length' 2>/dev/null || echo "0")
    
    log_info "Estado final del sistema: $FINAL_COUNT resoluciones totales"
    
    # Guardar estado final
    echo "$FINAL_DATA" > "$RESULTS_DIR/estado_final.json"
else
    log_warning "No se pudo obtener estado final del sistema"
    FINAL_COUNT="N/A"
fi

echo ""

# ===========================================
# VERIFICACIÓN DE CONFIGURACIÓN
# ===========================================
log_header "VERIFICACIÓN DE CONFIGURACIÓN"

# Verificar Cloudinary
CLOUDINARY_STATUS="NO CONFIGURADO"
if [ -f "server/.env" ]; then
    if grep -q "CLOUDINARY_CLOUD_NAME=" server/.env; then
        CLOUD_NAME=$(grep "CLOUDINARY_CLOUD_NAME=" server/.env | cut -d'=' -f2)
        if [ -n "$CLOUD_NAME" ] && [ "$CLOUD_NAME" != "" ]; then
            CLOUDINARY_STATUS="CONFIGURADO"
            log_success "Cloudinary configurado: $CLOUD_NAME"
        else
            CLOUDINARY_STATUS="DEFINIDO PERO VACÍO"
            log_warning "Cloudinary definido pero sin configurar"
        fi
    else
        log_warning "Cloudinary no configurado"
    fi
fi

# Verificar PostgreSQL
POSTGRES_STATUS="DESCONOCIDO"
if [ -f "server/.env" ]; then
    if grep -q "DATABASE_URL=" server/.env || grep -q "DB_HOST=" server/.env; then
        POSTGRES_STATUS="CONFIGURADO"
        log_success "PostgreSQL configurado"
    else
        POSTGRES_STATUS="NO CONFIGURADO"
        log_warning "PostgreSQL no configurado"
    fi
fi

echo ""

# ===========================================
# GENERACIÓN DE REPORTE EJECUTIVO
# ===========================================
log_header "GENERANDO REPORTE EJECUTIVO"

# Calcular métricas generales
SUCCESS_RATE=$((SUITES_PASSED * 100 / TOTAL_SUITES))
WARNING_RATE=$((SUITES_WARNING * 100 / TOTAL_SUITES))
FAILURE_RATE=$((SUITES_FAILED * 100 / TOTAL_SUITES))

# Determinar veredicto general
VEREDICTO_GENERAL="INDETERMINADO"
if [ $SUITES_PASSED -eq $TOTAL_SUITES ]; then
    VEREDICTO_GENERAL="PERSISTENCIA EXITOSA ✅"
elif [ $((SUITES_PASSED + SUITES_WARNING)) -eq $TOTAL_SUITES ]; then
    VEREDICTO_GENERAL="PERSISTENCIA CON ADVERTENCIAS ⚠️"
else
    VEREDICTO_GENERAL="PROBLEMAS DE PERSISTENCIA ❌"
fi

# Generar reporte completo
cat >> "$SUMMARY_FILE" << EOF

### 🎯 VEREDICTO GENERAL: $VEREDICTO_GENERAL

## 📊 MÉTRICAS DE PRUEBAS

| Métrica | Valor |
|---------|-------|
| Suites ejecutadas | $TOTAL_SUITES |
| Suites exitosas | $SUITES_PASSED |
| Suites con advertencias | $SUITES_WARNING |
| Suites fallidas | $SUITES_FAILED |
| Tasa de éxito | $SUCCESS_RATE% |

## 🧪 RESULTADOS POR SUITE

### Suite 1: Pruebas Exhaustivas
**Resultado:** $SUITE1_RESULT  
**Descripción:** Verificación básica de persistencia de datos  

### Suite 2: Pruebas de Reinicio
**Resultado:** $SUITE2_RESULT  
**Descripción:** Simulación de reinicios de servidor  

### Suite 3: Simulación Render
**Resultado:** $SUITE3_RESULT  
**Descripción:** Comportamiento específico de deployment en Render  

## ⚙️ CONFIGURACIÓN DEL SISTEMA

| Componente | Estado |
|------------|--------|
| Cloudinary | $CLOUDINARY_STATUS |
| PostgreSQL | $POSTGRES_STATUS |
| Resoluciones finales | $FINAL_COUNT |

## 📋 RECOMENDACIONES

EOF

# Agregar recomendaciones basadas en resultados
if [ "$VEREDICTO_GENERAL" = "PERSISTENCIA EXITOSA ✅" ]; then
    cat >> "$SUMMARY_FILE" << EOF
✅ **SISTEMA LISTO PARA PRODUCCIÓN**

- Los datos persisten correctamente entre operaciones
- No se detectaron problemas de pérdida de datos
- El sistema está preparado para deployment en Render

### Próximos pasos:
1. Configurar variables de entorno en Render
2. Realizar deployment de prueba
3. Verificar funcionamiento en producción
EOF

elif [ "$VEREDICTO_GENERAL" = "PERSISTENCIA CON ADVERTENCIAS ⚠️" ]; then
    cat >> "$SUMMARY_FILE" << EOF
⚠️ **SISTEMA FUNCIONAL CON OBSERVACIONES**

- La persistencia básica funciona correctamente
- Hay algunas configuraciones que requieren atención
- Se recomienda resolver advertencias antes de producción

### Acciones requeridas:
EOF

    if [ "$CLOUDINARY_STATUS" != "CONFIGURADO" ]; then
        cat >> "$SUMMARY_FILE" << EOF
- 🔧 **Configurar Cloudinary** para persistencia de imágenes
EOF
    fi
    
    cat >> "$SUMMARY_FILE" << EOF
- 🧪 Ejecutar pruebas adicionales después de correcciones
- 📊 Monitorear comportamiento en ambiente de staging
EOF

else
    cat >> "$SUMMARY_FILE" << EOF
❌ **PROBLEMAS CRÍTICOS DETECTADOS**

- Se encontraron problemas significativos de persistencia
- NO se recomienda deployment hasta resolver los problemas
- Se requiere investigación adicional

### Acciones urgentes:
1. 🔍 Revisar logs detallados en $RESULTS_DIR
2. 🔧 Corregir problemas de configuración
3. 🧪 Re-ejecutar todas las pruebas
4. ⏰ NO desplegar hasta resolver todos los problemas
EOF
fi

cat >> "$SUMMARY_FILE" << EOF

## 📁 ARCHIVOS DE DETALLE

- **Suite 1:** \`suite1_exhaustivas.log\`
- **Suite 2:** \`suite2_reinicio.log\`
- **Suite 3:** \`suite3_render.log\`
- **Estado final:** \`estado_final.json\`

---

**Generado:** $(date)  
**Duración total:** Aproximadamente $((SECONDS / 60)) minutos  
**Directorio:** \`$RESULTS_DIR\`
EOF

echo ""

# ===========================================
# MOSTRAR RESUMEN FINAL
# ===========================================
log_header "RESUMEN FINAL DE PRUEBAS DE PERSISTENCIA"

echo -e "${BLUE}📊 ESTADÍSTICAS FINALES:${NC}"
echo "   • Total de suites: $TOTAL_SUITES"
echo "   • Suites exitosas: $SUITES_PASSED"
echo "   • Suites con advertencias: $SUITES_WARNING"
echo "   • Suites fallidas: $SUITES_FAILED"
echo "   • Tasa de éxito: $SUCCESS_RATE%"
echo ""

case "$VEREDICTO_GENERAL" in
    "PERSISTENCIA EXITOSA ✅")
        echo -e "${GREEN}🎯 VEREDICTO: PERSISTENCIA EXITOSA ✅${NC}"
        echo ""
        echo "   🏆 La aplicación mantiene la persistencia correctamente"
        echo "   🏆 Los datos NO se resetean ni se recrean"
        echo "   🏆 Sistema preparado para Render"
        
        if [ "$CLOUDINARY_STATUS" = "CONFIGURADO" ]; then
            echo "   🌩️  Cloudinary configurado - imágenes persistentes"
        else
            echo "   ⚠️  Configurar Cloudinary para persistencia completa"
        fi
        ;;
        
    "PERSISTENCIA CON ADVERTENCIAS ⚠️")
        echo -e "${YELLOW}🎯 VEREDICTO: PERSISTENCIA CON ADVERTENCIAS ⚠️${NC}"
        echo ""
        echo "   ✅ Persistencia básica funcionando"
        echo "   ⚠️  Algunas configuraciones necesitan atención"
        echo "   🔧 Resolver advertencias antes de producción"
        ;;
        
    *)
        echo -e "${RED}🎯 VEREDICTO: PROBLEMAS DE PERSISTENCIA ❌${NC}"
        echo ""
        echo "   ❌ Se detectaron problemas críticos"
        echo "   ❌ Los datos pueden perderse o resetearse"
        echo "   🚨 NO desplegar hasta resolver problemas"
        ;;
esac

echo ""

echo -e "${BLUE}📁 DOCUMENTACIÓN GENERADA:${NC}"
echo "   • Reporte ejecutivo: $SUMMARY_FILE"
echo "   • Logs detallados: $RESULTS_DIR/"
echo "   • Estado final: $RESULTS_DIR/estado_final.json"

echo ""

echo -e "${BLUE}🚀 SIGUIENTES PASOS:${NC}"
if [ "$VEREDICTO_GENERAL" = "PERSISTENCIA EXITOSA ✅" ]; then
    echo "   1. ✅ Revisar reporte ejecutivo"
    echo "   2. 🚀 Proceder con deployment a Render"
    echo "   3. 📊 Monitorear comportamiento en producción"
elif [ "$VEREDICTO_GENERAL" = "PERSISTENCIA CON ADVERTENCIAS ⚠️" ]; then
    echo "   1. 📖 Revisar advertencias en $SUMMARY_FILE"
    echo "   2. 🔧 Aplicar correcciones recomendadas"
    echo "   3. 🧪 Re-ejecutar pruebas específicas"
    echo "   4. 🚀 Deployment después de correcciones"
else
    echo "   1. 🔍 Investigar problemas en logs detallados"
    echo "   2. 🔧 Corregir configuración del sistema"
    echo "   3. 🧪 Re-ejecutar suite completa"
    echo "   4. ⏰ NO desplegar hasta resolver problemas"
fi

echo ""
echo "🏁 Suite completa de pruebas finalizada - $(date)"
echo "⏱️  Duración total: $((SECONDS / 60)) minutos"

# Exit code basado en resultado general
case "$VEREDICTO_GENERAL" in
    "PERSISTENCIA EXITOSA ✅") exit 0 ;;
    "PERSISTENCIA CON ADVERTENCIAS ⚠️") exit 1 ;;
    *) exit 2 ;;
esac
