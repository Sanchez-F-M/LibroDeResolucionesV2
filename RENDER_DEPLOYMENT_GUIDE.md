# 🚀 Guía de Deployment en Render

## ✅ Estado Actual de Fixes Aplicados

### Problemas Resueltos:
- [x] ✅ **Script create-admin.js**: Creado y funcional
- [x] ✅ **Referencias verifyToken.js**: Eliminadas completamente  
- [x] ✅ **Package.json limpio**: Scripts válidos y funcionales
- [x] ✅ **Dependencias corruptas**: Resueltas (node_modules regenerado)
- [x] ✅ **Headers de seguridad**: Implementados en server/index.js
- [x] ✅ **Validaciones de autenticación**: Mejoradas y unificadas
- [x] ✅ **Logging de seguridad**: Sistema implementado

### Cambios Commiteados:
```bash
Último commit: bc35cf9 - fix: Resolución completa de dependencias corruptas y errores de deployment
```

## 🔧 Configuración en Render

### 1. Crear Nuevo Servicio Web

1. Ir a [dashboard.render.com](https://dashboard.render.com/)
2. Click en "New" → "Web Service"
3. Conectar repositorio: `https://github.com/Sanchez-F-M/LibroDeResolucionesV2`

### 2. Configuración del Servicio

```yaml
# Configuración recomendada para Render
Name: libroderesolucionesv2-backend
Environment: Node
Region: Oregon (US West) - más económico
Branch: main
Root Directory: server
Build Command: npm install
Start Command: npm start
```

### 3. Variables de Entorno Requeridas

**🔐 Variables Críticas (configurar en Render Dashboard):**

```env
NODE_ENV=production
PORT=10000

# Base de datos PostgreSQL (usar Render PostgreSQL o externa)
DATABASE_URL=postgresql://username:password@host:port/database

# JWT Secret (generar uno nuevo para producción)
JWT_SECRET=tu_jwt_secret_super_seguro_aqui

# Cloudinary (para imágenes)
CLOUDINARY_CLOUD_NAME=tu_cloud_name
CLOUDINARY_API_KEY=tu_api_key  
CLOUDINARY_API_SECRET=tu_api_secret

# Configuración de CORS
FRONTEND_URL=https://tu-frontend.vercel.app
ALLOWED_ORIGINS=https://tu-frontend.vercel.app,http://localhost:3000,http://localhost:5173
```

### 4. Configuración de Base de Datos

**Opción A: PostgreSQL en Render (Recomendado)**
1. Crear PostgreSQL database en Render
2. Usar la DATABASE_URL proporcionada automáticamente

**Opción B: Base de datos externa**
1. Usar ElephantSQL, Aiven, o cualquier proveedor PostgreSQL
2. Configurar DATABASE_URL manualmente

### 5. Plan de Pricing

**Para desarrollo/pruebas:**
- Web Service: Free tier (con limitaciones de sleep)
- PostgreSQL: Free tier (100 MB)

**Para producción:**
- Web Service: Starter ($7/mes) - sin sleep
- PostgreSQL: Starter ($7/mes) - 1 GB

## 🔍 Troubleshooting de Deployment

### Logs Comunes de Error:

1. **"Cannot find module"** → ✅ RESUELTO (dependencias regeneradas)
2. **"Script create-admin not found"** → ✅ RESUELTO (script creado)
3. **"Cannot find './verifyToken'"** → ✅ RESUELTO (imports eliminados)
4. **Puerto no configurado** → Verificar PORT=10000 en variables de entorno

### Verificación Post-Deployment:

```bash
# Endpoints a verificar una vez deployado:
curl https://tu-app.onrender.com/health
curl https://tu-app.onrender.com/api/health
curl https://tu-app.onrender.com/
```

## 📋 Checklist de Deployment

- [ ] Crear servicio web en Render
- [ ] Configurar variables de entorno
- [ ] Configurar base de datos PostgreSQL
- [ ] Verificar build exitoso
- [ ] Probar endpoints críticos
- [ ] Configurar dominio personalizado (opcional)
- [ ] Actualizar FRONTEND_URL en variables de entorno

## 🌐 URLs Esperadas

Una vez configurado correctamente, la URL será algo como:
- `https://libroderesolucionesv2-backend.onrender.com`
- O el nombre que elijas en la configuración

## 🚨 Notas Importantes

1. **Free tier tiene limitaciones**: El servicio "duerme" después de 15 minutos de inactividad
2. **Cold starts**: Primer request puede tardar 30+ segundos en free tier
3. **Variables de entorno**: Cambios requieren redeploy automático
4. **Build time**: Node.js builds pueden tardar 2-5 minutos

## 🔧 Comandos de Diagnóstico Local

```bash
# Verificar que todo funciona local antes de deploy
cd server
npm install
npm start

# En otra terminal
curl http://localhost:10000/health
curl http://localhost:10000/
```

## 📞 Soporte

Si hay problemas específicos durante el deployment:
1. Revisar logs en Render Dashboard
2. Verificar todas las variables de entorno
3. Confirmar que el branch main tiene los últimos cambios
4. Verificar que server/package.json tiene scripts correctos
