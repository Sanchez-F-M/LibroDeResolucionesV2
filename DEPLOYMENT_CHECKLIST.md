# CHECKLIST DE DESPLIEGUE EN RENDER - CON SQLITE

## Pre-requisitos

- [X] Cuenta en Render.com
- [X] Repositorio de código en GitHub/GitLab
- [X] Migración a SQLite completada (sin necesidad de BD externa)
- [X] Frontend ya desplegado en Vercel

## Pasos para el despliegue del backend:

### 1. Configuración inicial en Render

- [ ] Crear nuevo Web Service
- [ ] Conectar repositorio
- [ ] Seleccionar la rama main/master
- [ ] Configurar Root Directory como `server`

### 2. Configuración del build

- [ ] Runtime: Node
- [ ] Build Command: `npm install`
- [ ] Start Command: `npm start`
- [ ] Environment: Node 18.x

### 3. Variables de entorno (solo 2 requeridas con SQLite)

- [ ] JWT_SECRET_KEY (generar una clave secreta fuerte)
- [ ] FRONTEND_URL (URL de tu frontend en Vercel)
- [X] NODE_ENV (se configura automáticamente como 'production')
- [X] PORT (se genera automáticamente por Render)

### 4. Configuración adicional

- [ ] Health Check Path: `/health`
- [ ] Auto-Deploy: Activado
- [ ] Region: Oregon (más cercano)

### 5. Después del despliegue

- [ ] Verificar que el servicio esté funcionando
- [ ] Probar el endpoint `/health`
- [ ] Actualizar VITE_API_BASE_URL en Vercel con la URL de Render
- [ ] Redesplegar el frontend en Vercel
- [ ] Probar la conectividad entre frontend y backend

## URLs importantes después del despliegue:

- Backend: `https://[tu-servicio].onrender.com`
- Health check: `https://[tu-servicio].onrender.com/health`
- API base: `https://[tu-servicio].onrender.com/api`

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
