#!/bin/bash

echo "🔍 VERIFICADOR AUTOMÁTICO - CORRECCIÓN ERROR 500"
echo "==============================================="
echo ""

# Función para verificar el estado del backend
check_backend_status() {
    echo "📡 Verificando estado del backend..."
    
    response=$(curl -s -o /dev/null -w "%{http_code}" https://libroderesoluciones-api.onrender.com/health)
    
    if [ "$response" = "200" ]; then
        echo "✅ Backend funcionando (HTTP 200)"
        return 0
    else
        echo "❌ Backend no responde (HTTP $response)"
        return 1
    fi
}

# Función para probar el registro de usuario
test_user_registration() {
    echo "🧪 Probando registro de secretario..."
    
    # Crear nombre único para evitar conflictos
    timestamp=$(date +%s)
    test_name="secretario_test_$timestamp"
    
    response=$(curl -s -X POST https://libroderesoluciones-api.onrender.com/api/user/register \
        -H "Content-Type: application/json" \
        -d "{\"Nombre\":\"$test_name\",\"Contrasena\":\"test123\",\"Rol\":\"secretaria\"}")
    
    echo "📋 Respuesta del servidor:"
    echo "$response" | jq . 2>/dev/null || echo "$response"
    echo ""
    
    if echo "$response" | grep -q "Usuario creado exitosamente"; then
        echo "✅ ÉXITO: Registro de secretario funcionando correctamente"
        return 0
    elif echo "$response" | grep -q "Error interno del servidor"; then
        echo "❌ FALLO: Persiste error 500 - Deploy pendiente"
        return 1
    elif echo "$response" | grep -q "El usuario ya existe"; then
        echo "⚠️ ADVERTENCIA: Usuario ya existe, pero el endpoint funciona"
        return 0
    else
        echo "❓ DESCONOCIDO: Respuesta inesperada"
        return 1
    fi
}

# Función para verificar continuamente
monitor_deployment() {
    echo "⏰ Monitoreando deploy cada 30 segundos..."
    echo "   Presiona Ctrl+C para detener"
    echo ""
    
    attempt=1
    max_attempts=20  # 10 minutos máximo
    
    while [ $attempt -le $max_attempts ]; do
        echo "🔄 Intento $attempt de $max_attempts"
        echo "$(date '+%H:%M:%S') - Verificando..."
        
        if check_backend_status; then
            echo ""
            if test_user_registration; then
                echo ""
                echo "🎉 ¡CORRECCIÓN EXITOSA!"
                echo "================================"
                echo "✅ El error 500 ha sido solucionado"
                echo "✅ El registro de secretarios funciona correctamente"
                echo "✅ Puedes proceder a usar la aplicación"
                echo ""
                echo "📱 Próximos pasos:"
                echo "1. Probar registro desde el frontend"
                echo "2. Verificar que los roles se asignen correctamente"
                echo "3. Confirmar que los permisos funcionen"
                break
            else
                echo ""
                echo "⏳ Deploy aún en progreso..."
            fi
        else
            echo "⏳ Servidor reiniciándose..."
        fi
        
        if [ $attempt -eq $max_attempts ]; then
            echo ""
            echo "⏰ TIMEOUT: Máximo tiempo de espera alcanzado"
            echo "🔧 Acciones recomendadas:"
            echo "1. Verificar el deploy manual en Render Dashboard"
            echo "2. Revisar logs de deploy en Render"
            echo "3. Confirmar que el último commit se deployó"
            break
        fi
        
        echo "⏳ Esperando 30 segundos antes del próximo intento..."
        sleep 30
        ((attempt++))
        echo ""
    done
}

# Función para verificación única
single_check() {
    echo "🔍 VERIFICACIÓN ÚNICA:"
    echo "====================="
    
    if check_backend_status; then
        echo ""
        test_user_registration
    fi
}

# Menú principal
echo "Selecciona una opción:"
echo "1) Verificación única"
echo "2) Monitoreo continuo"
echo "3) Solo verificar backend"
echo ""
read -p "Opción (1-3): " choice

case $choice in
    1)
        single_check
        ;;
    2)
        monitor_deployment
        ;;
    3)
        check_backend_status
        ;;
    *)
        echo "❌ Opción inválida"
        exit 1
        ;;
esac

echo ""
echo "🔗 Enlaces útiles:"
echo "- Render Dashboard: https://dashboard.render.com"
echo "- Backend Health: https://libroderesoluciones-api.onrender.com/health"
echo "- Frontend: https://libro-de-resoluciones-v2-9izd-fe0i5ihfg.vercel.app"
