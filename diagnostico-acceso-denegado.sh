#!/bin/bash

echo "🔍 DIAGNÓSTICO COMPLETO - PROBLEMA DE ACCESO DENEGADO"
echo "===================================================="

echo ""
echo "❌ PROBLEMA IDENTIFICADO:"
echo "========================"
echo "1. Los usuarios no pueden hacer login (Error 500 backend)"
echo "2. Sin login exitoso, no hay rol asignado"
echo "3. Sin rol, ProtectedRoute niega el acceso"
echo "4. Backend usa 'Rol' pero frontend buscaba 'role'"
echo ""

echo "✅ CORRECCIONES APLICADAS:"
echo "========================="
echo "1. AuthContext ahora soporta tanto 'Rol' como 'role'"
echo "2. ProtectedRoute muestra el rol correcto en debug"
echo ""

echo "🎯 CONFIGURACIÓN DE PERMISOS ACTUAL:"
echo "==================================="
echo ""
echo "📋 Rutas y permisos:"
echo "• /home - Acceso libre"
echo "• /login - Acceso libre"
echo "• /busquedas - Requiere login (cualquier rol)"
echo "• /cargas - Requiere rol 'secretaria' o 'admin'"
echo "• /modificar/:id - Requiere rol 'secretaria' o 'admin'"
echo "• /mostrar/:id - Requiere login (cualquier rol)"
echo ""

echo "👥 Jerarquía de roles:"
echo "• admin: Puede hacer TODO (admin, secretaria, usuario)"
echo "• secretaria: Puede ver y editar (secretaria, usuario)"
echo "• usuario: Solo puede ver (usuario)"
echo ""

echo "🎯 SEGÚN TUS REQUERIMIENTOS:"
echo "=========================="
echo "✅ Usuario: NO puede cargar resoluciones"
echo "✅ Secretaria: SÍ puede cargar resoluciones"
echo "✅ Admin: SÍ puede cargar resoluciones"
echo ""
echo "La configuración actual YA cumple estos requerimientos."
echo ""

echo "🚨 PROBLEMA RAÍZ: BACKEND NO FUNCIONA"
echo "===================================="
echo "El acceso denegado es porque:"
echo "1. No puedes hacer login (Error 500)"
echo "2. Sin login, no tienes rol asignado"
echo "3. Sin rol, se niega el acceso"
echo ""

echo "🧪 PROBANDO BACKEND ACTUAL..."
echo "============================"

# Probar registro
echo "📝 Probando registro de usuario..."
REGISTER_RESULT=$(curl -s -X POST "https://libroderesoluciones-api.onrender.com/api/user/register" \
    -H "Content-Type: application/json" \
    -d '{"Nombre":"secretaria_test","Contrasena":"test123","Rol":"secretaria"}' 2>/dev/null)

echo "Resultado registro: $REGISTER_RESULT"

if [[ "$REGISTER_RESULT" == *"exitosamente"* ]]; then
    echo "✅ Backend funcionando - Registro exitoso"
    
    # Probar login
    echo ""
    echo "🔐 Probando login..."
    LOGIN_RESULT=$(curl -s -X POST "https://libroderesoluciones-api.onrender.com/api/user/login" \
        -H "Content-Type: application/json" \
        -d '{"Nombre":"secretaria_test","Contrasena":"test123"}' 2>/dev/null)
    
    echo "Resultado login: $LOGIN_RESULT"
    
    if [[ "$LOGIN_RESULT" == *"token"* ]]; then
        echo "🎉 ¡BACKEND FUNCIONANDO! El problema era temporal"
        echo ""
        echo "📱 PROBAR AHORA EN LA APP:"
        echo "1. Ir a la aplicación web"
        echo "2. Hacer login con:"
        echo "   Usuario: secretaria_test"
        echo "   Contraseña: test123"
        echo "3. Deberías poder acceder a 'Cargas'"
        
    else
        echo "❌ Login falla - revisar configuración JWT"
    fi
    
elif [[ "$REGISTER_RESULT" == *"ya existe"* ]]; then
    echo "⚠️  Usuario ya existe, probando login directo..."
    LOGIN_RESULT=$(curl -s -X POST "https://libroderesoluciones-api.onrender.com/api/user/login" \
        -H "Content-Type: application/json" \
        -d '{"Nombre":"secretaria_test","Contrasena":"test123"}' 2>/dev/null)
    
    echo "Resultado login: $LOGIN_RESULT"
    
elif [[ "$REGISTER_RESULT" == *"Error interno del servidor"* ]]; then
    echo "❌ Backend con problemas de base de datos"
    echo ""
    echo "🔧 SOLUCIÓN URGENTE:"
    echo "==================="
    echo "1. Corregir DATABASE_URL en Render:"
    echo "   DATABASE_URL=postgresql://libro_resoluciones_1gp9_user:gi1xhsRlAmVGc6sFYjdKLZOrSRWadgp-dlrIIbgd3pr7SsIG1B.oregon-postgres.render.com/libro_resoluciones_1gp9"
    echo ""
    echo "2. Eliminar variables redundantes:"
    echo "   - DATABASE_URL_EXTERNAL"
    echo "   - POSTGRES_URL"
    echo "   - DB_HOST, DB_USER, DB_PASSWORD, etc."
    echo ""
    echo "3. Save Changes y esperar redespliegue"
    echo ""
    
else
    echo "❓ Respuesta inesperada: $REGISTER_RESULT"
fi

echo ""
echo "📋 RESUMEN DE ACCIONES:"
echo "======================"
echo "1. ✅ Corregir compatibilidad Rol/role (HECHO)"
echo "2. ⏳ Arreglar DATABASE_URL en Render (PENDIENTE)"
echo "3. ⏳ Probar login después de arreglar backend"
echo "4. ⏳ Verificar acceso a diferentes secciones por rol"
echo ""

echo "💡 LA LÓGICA DE PERMISOS YA ESTÁ CORRECTA"
echo "========================================="
echo "Solo necesitas arreglar el backend para que funcione el login."
echo ""
echo "Una vez que puedas hacer login:"
echo "• Como 'usuario': Solo verás inicio y búsquedas"
echo "• Como 'secretaria': Verás inicio, búsquedas Y cargas"
echo "• Como 'admin': Verás todo incluyendo funciones de administración"
