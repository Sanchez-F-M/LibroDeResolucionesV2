# 🚨 ERROR CRÍTICO - BASE DE DATOS POSTGRESQL NO CONFIGURADA

## ❌ **Problema Identificado**

```
Error: getaddrinfo ENOTFOUND libro-resoluciones-db
```

**Causa**: El backend intenta conectarse a una base de datos PostgreSQL que **NO EXISTE** en Render.

## 🎯 **Solución Inmediata Requerida**

### **PASO 1: Crear Base de Datos PostgreSQL en Render**

1. **Ir a**: https://dashboard.render.com
2. **Hacer clic en**: `New +` → `PostgreSQL`
3. **Configurar**:
   ```
   Name: libro-resoluciones-db
   Database: libro_resoluciones  
   User: libro_user
   Region: Misma que tu backend
   Plan: Free
   ```
4. **Crear**: `Create Database`
5. **Esperar**: 2-3 minutos hasta que aparezca como `Available`

### **PASO 2: Obtener Credenciales de la BD**

Una vez creada la base de datos, **copiar estas variables**:

- ✅ **Internal Database URL** (termina en `.render.com`)
- ✅ **Username**
- ✅ **Password** 
- ✅ **Database Name**
- ✅ **Port** (normalmente `5432`)

### **PASO 3: Configurar Variables en Backend**

1. **Ir al servicio backend**: `libroderesoluciones-api`
2. **Environment** → **Edit**
3. **Agregar estas variables**:

```bash
DB_HOST=<internal-hostname-de-la-bd>
DB_USER=<username-de-la-bd>
DB_PASSWORD=<password-de-la-bd>
DB_NAME=libro_resoluciones
DB_PORT=5432
```

**Ejemplo**:
```bash
DB_HOST=libro-resoluciones-db-abc123.render.com
DB_USER=libro_user  
DB_PASSWORD=abcd1234efgh5678
DB_NAME=libro_resoluciones
DB_PORT=5432
```

### **PASO 4: Redesplegar Backend**

1. **Después de configurar variables**
2. **Manual Deploy** del backend
3. **Esperar 3-5 minutos**

## 🧪 **Verificación Post-Configuración**

### **Test 1: Health Check**
```bash
curl https://libroderesoluciones-api.onrender.com/health
```
**Esperado**: Status healthy sin errores de BD

### **Test 2: Registro de Usuario**
```bash
curl -X POST https://libroderesoluciones-api.onrender.com/api/user/register \
  -H "Content-Type: application/json" \
  -d '{"Nombre":"test_user","Contrasena":"test123","Rol":"usuario"}'
```
**Esperado**: Usuario creado exitosamente

## ⚠️ **Notas Importantes**

1. **Usar Internal URL**: Más rápido que External URL
2. **Misma Región**: Backend y BD deben estar en la misma región
3. **Plan Free**: Suficiente para desarrollo/testing
4. **Credenciales Exactas**: Copiar/pegar sin errores tipográficos

## 🕐 **Tiempo Estimado**

- **Crear BD**: 3-5 minutos
- **Configurar Variables**: 2 minutos  
- **Deploy Backend**: 3-5 minutos
- **Total**: **10-15 minutos**

## 🆘 **Troubleshooting**

Si persisten errores después de la configuración:

1. **Verificar que BD esté `Available`**
2. **Usar EXACTAMENTE el Internal Database URL**
3. **Comprobar credenciales en la sección Info de la BD**
4. **Verificar logs del backend durante startup**

---

## 📋 **Estado Actual**

- ❌ **PostgreSQL**: No configurado (causa del error 500)
- ✅ **Backend Code**: Funcionando (se inicia correctamente)
- ✅ **Variables JWT**: Configuradas
- ✅ **Cloudinary**: Configurado

**Una vez configurada la BD, el error 500 se resolverá automáticamente.**
