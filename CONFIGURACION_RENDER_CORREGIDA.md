# 🚀 CONFIGURACIÓN PARA RENDER (PRODUCCIÓN)

## Variables de Entorno OBLIGATORIAS en Render Web Service

### 📊 Base de Datos PostgreSQL
```
# IMPORTANTE: Usar las credenciales de tu PostgreSQL Service en Render
DB_HOST=dpg-[tu-id-postgresql]-a.oregon-postgres.render.com
DB_PORT=5432
DB_NAME=libro_resoluciones
DB_USER=libro_resoluciones_user
DB_PASSWORD=[password-generado-por-render]
DATABASE_URL=postgresql://libro_resoluciones_user:[password]@dpg-[tu-id]-a.oregon-postgres.render.com:5432/libro_resoluciones
```

### 🔐 Autenticación
```
JWT_SECRET_KEY=c4aa0b8b9962ef727f684398eaca42cef69b542035b0bf3059381617e85d45ac4754dc5cdde02ed9bed87ce47cc4ba1cd33d1c1e485df0fca433ba5bd2499f4a
NODE_ENV=production
```

### 🌐 URLs y CORS
```
PORT=10000
FRONTEND_URL=https://[tu-frontend].onrender.com
BASE_URL=https://[tu-backend].onrender.com
```

### 👤 Usuario Admin
```
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin123
```

### 🌩️ **CLOUDINARY (OBLIGATORIO para persistencia de imágenes)**
```
CLOUDINARY_CLOUD_NAME=[tu_cloud_name_de_cloudinary]
CLOUDINARY_API_KEY=[tu_api_key_de_cloudinary]
CLOUDINARY_API_SECRET=[tu_api_secret_de_cloudinary]
```

### 📁 Configuración de Uploads
```
MAX_FILE_SIZE=10485760
```

## 🔄 PERSISTENCIA DE DATOS - SOLUCIONADO ✅

### ❌ Problema Original en Render:
- Sistema de archivos efímero (se resetea)
- Carpeta `uploads` se pierde en cada redespliegue
- Pérdida de imágenes de resoluciones

### ✅ Solución Implementada:
- **Cloudinary Integration**: Almacenamiento persistente en la nube
- **Detección automática**: Local usa almacenamiento local, producción usa Cloudinary
- **URLs optimizadas**: Transformación y optimización automática de imágenes
- **CDN global**: Carga rápida desde cualquier ubicación
- ❌ Imágenes desaparecen

### Solución Implementada:
- ✅ PostgreSQL persistente para datos
- ✅ **Cloudinary para almacenamiento persistente de imágenes**
- ✅ Detección automática de entorno (local vs producción)

## 📋 CHECKLIST DEPLOY RENDER

### 1. PostgreSQL Service
- [ ] Crear PostgreSQL Service en Render
- [ ] Obtener credenciales (host, user, password)
- [ ] Configurar variables de entorno

### 2. Web Service
- [ ] Configurar todas las variables listadas arriba
- [ ] Verificar Build Command: `npm install`
- [ ] Verificar Start Command: `npm start`

### 3. Frontend Service  
- [ ] Configurar variable VITE_API_BASE_URL
- [ ] Apuntar al backend de Render

### 4. Verificación
- [ ] Logs muestran conexión PostgreSQL exitosa
- [ ] Resoluciones persisten después de redeploy
- [ ] No hay errores de CORS

## 🚨 PROBLEMA ACTUAL IDENTIFICADO

Tu aplicación local usa:
- Puerto: 5433
- Usuario: postgres

Tu base de datos en Render usa:
- Puerto: 5432  
- Usuario: libro_resoluciones_user

**SOLUCIÓN**: Las variables de entorno en Render sobrescriben la configuración local.
