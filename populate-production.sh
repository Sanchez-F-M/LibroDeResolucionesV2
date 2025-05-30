#!/bin/bash

# Script para poblar la base de datos de producción
# Usar desde Git Bash en Windows

API_BASE_URL="https://libro-resoluciones-api.onrender.com"
DUMMY_FILE="dummy.txt"

echo "🚀 Iniciando poblado de base de datos en producción..."
echo "🌐 Backend URL: $API_BASE_URL"

# Crear archivo dummy para los uploads
echo "Documento de resolución - generado automáticamente" > $DUMMY_FILE

# Función para obtener token
get_token() {
    echo "🔐 Obteniendo token de autenticación..."
    TOKEN=$(curl -s -X POST -H "Content-Type: application/json" \
        -d '{"Nombre":"admin","Contrasena":"admin123"}' \
        "$API_BASE_URL/api/user/login" | \
        grep -o '"token":"[^"]*"' | cut -d'"' -f4)
    
    if [ -z "$TOKEN" ]; then
        echo "❌ Error obteniendo token"
        exit 1
    fi
    
    echo "✅ Token obtenido exitosamente"
}

# Función para crear resolución
create_resolution() {
    local num="$1"
    local asunto="$2"
    local referencia="$3"
    local fecha="$4"
    
    echo "📄 Creando resolución: $num - $asunto"
    
    RESPONSE=$(curl -s -X POST \
        -H "Authorization: Bearer $TOKEN" \
        -F "NumdeResolucion=$num" \
        -F "Asunto=$asunto" \
        -F "Referencia=$referencia" \
        -F "FechaCreacion=$fecha" \
        -F "files=@$DUMMY_FILE" \
        "$API_BASE_URL/api/books")
    
    if echo "$RESPONSE" | grep -q "exitosamente"; then
        echo "✅ Resolución $num creada exitosamente"
        return 0
    else
        echo "❌ Error creando resolución $num: $RESPONSE"
        return 1
    fi
}

# Obtener token
get_token

echo ""
echo "📝 Creando resoluciones de prueba..."

SUCCESS_COUNT=0
ERROR_COUNT=0

# Crear resoluciones
create_resolution "001-2025" "Aprobación del Presupuesto Anual 2025" "Expediente N° 12345/2025 - Secretaría de Hacienda" "2025-01-15"
[ $? -eq 0 ] && ((SUCCESS_COUNT++)) || ((ERROR_COUNT++))

sleep 1

create_resolution "002-2025" "Designación de Personal en Comisaría Primera" "Nota N° 456/2025 - División de Recursos Humanos" "2025-01-20"
[ $? -eq 0 ] && ((SUCCESS_COUNT++)) || ((ERROR_COUNT++))

sleep 1

create_resolution "003-2025" "Protocolo de Seguridad Ciudadana" "Informe N° 789/2025 - Comisaría Central" "2025-02-01"
[ $? -eq 0 ] && ((SUCCESS_COUNT++)) || ((ERROR_COUNT++))

sleep 1

create_resolution "004-2025" "Adquisición de Equipamiento Policial" "Licitación N° 101/2025 - Departamento de Compras" "2025-02-10"
[ $? -eq 0 ] && ((SUCCESS_COUNT++)) || ((ERROR_COUNT++))

sleep 1

create_resolution "005-2025" "Modificación de Turnos de Servicio" "Memorando N° 234/2025 - Jefatura Operativa" "2025-02-15"
[ $? -eq 0 ] && ((SUCCESS_COUNT++)) || ((ERROR_COUNT++))

sleep 1

create_resolution "006-2025" "Procedimiento de Control Vehicular" "Circular N° 567/2025 - Tránsito Municipal" "2025-02-20"
[ $? -eq 0 ] && ((SUCCESS_COUNT++)) || ((ERROR_COUNT++))

sleep 1

create_resolution "007-2025" "Capacitación en Derechos Humanos" "Programa N° 890/2025 - Instituto de Formación" "2025-02-25"
[ $? -eq 0 ] && ((SUCCESS_COUNT++)) || ((ERROR_COUNT++))

sleep 1

create_resolution "008-2025" "Asignación de Móviles Policiales" "Listado N° 123/2025 - Parque Automotor" "2025-03-01"
[ $? -eq 0 ] && ((SUCCESS_COUNT++)) || ((ERROR_COUNT++))

echo ""
echo "🎉 ========================================"
echo "🎉 POBLACIÓN DE DATOS COMPLETADA"
echo "🎉 ✅ Exitosas: $SUCCESS_COUNT"
echo "🎉 ❌ Errores: $ERROR_COUNT"
echo "🎉 ========================================"

# Verificar datos creados
echo ""
echo "🔍 Verificando datos en la base de datos..."
BOOKS_RESPONSE=$(curl -s "$API_BASE_URL/api/books/all")

if echo "$BOOKS_RESPONSE" | grep -q "NumdeResolucion"; then
    echo "✅ Base de datos poblada correctamente"
    echo "📊 Resoluciones encontradas:"
    echo "$BOOKS_RESPONSE" | jq -r '.[] | "   \(.NumdeResolucion) - \(.Asunto)"' 2>/dev/null || echo "$BOOKS_RESPONSE"
else
    echo "⚠️  Posible problema con la verificación"
    echo "Respuesta: $BOOKS_RESPONSE"
fi

# Limpiar archivo temporal
rm -f $DUMMY_FILE

echo ""
echo "🎉 Script completado!"
