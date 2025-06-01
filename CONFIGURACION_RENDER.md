# VARIABLES DE ENTORNO PARA RENDER

## ⚙️ CONFIGURACIÓN REQUERIDA EN RENDER

Para restaurar la funcionalidad completa de la aplicación, debes configurar estas variables de entorno en el dashboard de Render:

### 📋 Variables de Entorno Necesarias

```
NODE_ENV=production
PORT=10000
JWT_SECRET_KEY=a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b8c9d0e1f2g3h4i5j6k7l8m9n0o1p2q3r4s5t6u7v8w9x0y1z2a3b4c5d6e7f8g9h0
FRONTEND_URL=https://libro-de-resoluciones-v2-9izd-fe0i5ihfg.vercel.app
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin123
```

### 🔧 Instrucciones de Configuración

1. **Acceder al Dashboard de Render:**
   - Ve a https://dashboard.render.com
   - Busca el servicio "libro-resoluciones-api"
   - Haz clic en el servicio

2. **Configurar Variables de Entorno:**
   - Ve a la pestaña "Environment"
   - Haz clic en "Add Environment Variable"
   - Agrega cada variable una por una:

   **Variable 1:**
   - Key: `NODE_ENV`
   - Value: `production`

   **Variable 2:**
   - Key: `PORT`
   - Value: `10000`

   **Variable 3:**
   - Key: `JWT_SECRET_KEY`
   - Value: `a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b8c9d0e1f2g3h4i5j6k7l8m9n0o1p2q3r4s5t6u7v8w9x0y1z2a3b4c5d6e7f8g9h0`

   **Variable 4:**
   - Key: `FRONTEND_URL`
   - Value: `https://libro-de-resoluciones-v2-9izd-fe0i5ihfg.vercel.app`

   **Variable 5:**
   - Key: `ADMIN_USERNAME`
   - Value: `admin`

   **Variable 6:**
   - Key: `ADMIN_PASSWORD`
   - Value: `admin123`

3. **Redesplegar el Servicio:**
   - Después de agregar todas las variables, ve a la pestaña "Deploys"
   - Haz clic en "Trigger Deploy" para forzar un redespliegue
   - O simplemente espera que Render detecte los cambios del repositorio

### 🎯 Verificación Post-Configuración

Una vez configuradas las variables de entorno y redesplegado el servicio:

1. **Verificar Diagnóstico:**
   ```bash
   curl https://libro-resoluciones-api.onrender.com/diagnose
   ```

2. **Crear Admin Manualmente (si es necesario):**
   ```bash
   curl -X POST https://libro-resoluciones-api.onrender.com/create-admin
   ```

3. **Probar Login:**
   ```bash
   curl -X POST https://libro-resoluciones-api.onrender.com/api/user/login \
        -H "Content-Type: application/json" \
        -d '{"Nombre":"admin","Contrasena":"admin123"}'
   ```

### 🚨 PROBLEMA DE VERCEL

**CRÍTICO:** El frontend en Vercel está bloqueado por autenticación. Debes:

1. Ir al dashboard de Vercel: https://vercel.com/dashboard
2. Buscar el proyecto "libro-de-resoluciones-v2-9izd"
3. Ve a Settings → Security
4. Desactivar cualquier protección de autenticación habilitada

### ✅ Estado Esperado Después de la Configuración

- ✅ Backend funcionando en: `https://libro-resoluciones-api.onrender.com`
- ✅ Frontend accesible en: `https://libro-de-resoluciones-v2-9izd-fe0i5ihfg.vercel.app`
- ✅ Usuario admin creado automáticamente
- ✅ Login funcionando con admin/admin123
- ✅ Conectividad completa frontend-backend

### 🔍 URLs de Verificación

- **Backend Health:** https://libro-resoluciones-api.onrender.com/health
- **Diagnóstico:** https://libro-resoluciones-api.onrender.com/diagnose
- **Frontend:** https://libro-de-resoluciones-v2-9izd-fe0i5ihfg.vercel.app
- **Admin Creation:** POST https://libro-resoluciones-api.onrender.com/create-admin

---

**Última actualización:** 31 de mayo de 2025
**Estado:** Esperando configuración de variables de entorno en Render
