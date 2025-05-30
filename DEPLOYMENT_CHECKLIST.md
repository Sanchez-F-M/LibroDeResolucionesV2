# CHECKLIST DE DESPLIEGUE EN RENDER - CON SQLITE

## Pre-requisitos

- [X] Cuenta en Render.com
- [X] Repositorio de código en GitHub/GitLab
- [X] Migración a SQLite completada (sin necesidad de BD externa)
- [X] Frontend ya desplegado en Vercel

## Pasos para el despliegue del backend:

### 1. Configuración inicial en Render

- [X] Crear nuevo Web Service
- [X] Conectar repositorio
- [X] Seleccionar la rama main/master
- [X] Configurar Root Directory como `server`

### 2. Configuración del build

- [X] Runtime: Node
- [X] Build Command: `npm install`
- [X] Start Command: `npm start`
- [ ] Environment: Node 18.x

### 3. Variables de entorno (solo 2 requeridas con SQLite)

- [X] JWT_SECRET_KEY (generar una clave secreta fuerte)
- [X] FRONTEND_URL (URL de tu frontend en Vercel)
- [X] NODE_ENV (se configura automáticamente como 'production')
- [X] PORT (se genera automáticamente por Render)

### 4. Configuración adicional

- [X] Health Check Path: `/health`
- [X] Auto-Deploy: Activado
- [X] Region: Oregon (más cercano)

### 5. Después del despliegue

- [X] Verificar que el servicio esté funcionando
- [X] Probar el endpoint `/health`
- [X] Verificar endpoints de API funcionando
- [X] Crear usuario administrador inicial
- [ ] Actualizar VITE_API_BASE_URL en Vercel con la URL de Render
- [ ] Redesplegar el frontend en Vercel
- [ ] Probar la conectividad entre frontend y backend

## URLs importantes después del despliegue:

- Backend: `https://libro-resoluciones-api.onrender.com`
- Health check: `https://libro-resoluciones-api.onrender.com/health`
- API base: `https://libro-resoluciones-api.onrender.com/api`

## Estado actual verificado:

- ✅ Backend desplegado y funcionando
- ✅ Health checks: OK
- ✅ API endpoints: Respondiendo correctamente
- ✅ Base de datos SQLite: Operativa con usuario administrador
- ✅ Usuario administrador: Creado y verificado (admin/admin123)
- 🔄 Pendiente: Actualizar frontend en Vercel

## 🔐 Credenciales del Administrador:
- **Usuario:** admin
- **Contraseña:** admin123
- **ID:** 1
- **Creado:** 2025-05-24 19:57:53

⚠️ **Cambiar estas credenciales después del primer login por seguridad**

## Solución de problemas comunes:

1. **Error de build**: Verificar versión de Node.js y dependencias SQLite
2. **Error de SQLite**: Verificar permisos de escritura (automático en Render)
3. **Error de CORS**: Verificar FRONTEND_URL
4. **Servicio no responde**: Verificar logs en Render dashboard
5. **Variables de entorno**: Solo se necesitan JWT_SECRET_KEY y FRONTEND_URL

## Ventajas de SQLite en Render:

- 🎯 **Cero configuración** de base de datos externa
- 💰 **Costo reducido** - Sin servicios de BD adicionales
- ⚡ **Mayor rendimiento** - Base de datos integrada
- 🔒 **Más seguro** - Sin conexiones de red a BD externa
