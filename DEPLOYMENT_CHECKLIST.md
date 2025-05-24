# CHECKLIST DE DESPLIEGUE EN RENDER

## Pre-requisitos

- [X] Cuenta en Render.com
- [X] Repositorio de código en GitHub/GitLab
- [ ] Base de datos MySQL en la nube configurada
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

### 3. Variables de entorno (copiar de RENDER_ENV_VARS.md)

- [ ] JWT_SECRET_KEY
- [ ] DB_HOST
- [ ] DB_USER
- [ ] DB_PASSWORD
- [ ] DB_NAME
- [ ] DB_PORT
- [ ] NODE_ENV
- [ ] FRONTEND_URL

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

1. **Error de build**: Verificar versión de Node.js
2. **Error de base de datos**: Verificar variables de entorno y conectividad
3. **Error de CORS**: Verificar FRONTEND_URL
4. **Servicio no responde**: Verificar logs en Render dashboard
