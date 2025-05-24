# 📋 PASOS PARA QUE LA APLICACIÓN FUNCIONE COMPLETAMENTE

## 🎯 OBJETIVO
Asegurar que la aplicación web esté 100% operativa con frontend y backend conectados correctamente.

## ✅ PASO 1: VERIFICAR VARIABLES DE ENTORNO EN VERCEL

### 1.1 Acceder a Vercel Dashboard
1. Ir a [vercel.com](https://vercel.com)
2. Iniciar sesión con tu cuenta
3. Buscar el proyecto: `front-jibs1li4h-libro-de-resoluciones-projects`

### 1.2 Configurar Variables de Entorno
1. Ir a **Settings** → **Environment Variables**
2. Verificar/Agregar estas variables:

```bash
VITE_API_BASE_URL=https://libro-resoluciones-api.onrender.com
VITE_APP_TITLE=Libro de Resoluciones
VITE_APP_ENV=production
```

### 1.3 Redesplegar si es necesario
- En **Deployments** → **Redeploy** la última versión
- Esperar que termine el proceso (2-3 minutos)

## ✅ PASO 2: VERIFICAR BACKEND EN RENDER

### 2.1 Endpoints que deben funcionar:
```bash
✅ https://libro-resoluciones-api.onrender.com/health
✅ https://libro-resoluciones-api.onrender.com/api/books/all
✅ https://libro-resoluciones-api.onrender.com/api/user/login
```

### 2.2 Si hay problemas:
- Ir a [render.com](https://render.com)
- Acceder al servicio: `libro-resoluciones-api`
- Revisar **Logs** para errores
- Hacer **Manual Deploy** si es necesario

## ✅ PASO 3: PROBAR LOGIN Y FUNCIONALIDADES

### 3.1 Login Principal
1. Ir a: https://front-jibs1li4h-libro-de-resoluciones-projects.vercel.app/
2. Usar credenciales:
   - **Usuario:** admin
   - **Contraseña:** admin123

### 3.2 Funcionalidades a probar:
- ✅ Login → Debe redirigir a /home
- ✅ Buscar Resoluciones → Debe mostrar 8 resoluciones
- ✅ Cargar Resoluciones → Debe permitir crear nuevas
- ✅ Mostrar resolución individual
- ✅ Modificar resolución existente

## ✅ PASO 4: USAR HERRAMIENTAS DE DIAGNÓSTICO

### 4.1 Página de Verificación Completa
URL: https://front-jibs1li4h-libro-de-resoluciones-projects.vercel.app/production-verification.html

### 4.2 Diagnóstico React
URL: https://front-jibs1li4h-libro-de-resoluciones-projects.vercel.app/diagnostico

### 4.3 Qué debe mostrar:
- ✅ Health Check: Backend funcionando
- ✅ CORS: Sin errores
- ✅ Login: Token JWT generado
- ✅ API: Resoluciones cargadas
- ✅ Protected: Endpoints autenticados

## 🚨 PASO 5: SOLUCIONAR PROBLEMAS COMUNES

### 5.1 Error CORS
**Síntoma:** Error de "CORS policy" en consola del navegador
**Solución:**
```bash
# Verificar que el backend tenga configurado:
FRONTEND_URL=https://front-jibs1li4h-libro-de-resoluciones-projects.vercel.app
```

### 5.2 Error 404 en API calls
**Síntoma:** "Failed to fetch" o error 404
**Solución:**
- Verificar que `VITE_API_BASE_URL` esté configurada en Vercel
- Redesplegar frontend

### 5.3 Error de autenticación
**Síntoma:** Login no funciona
**Solución:**
- Verificar credenciales: admin/admin123
- Comprobar que el backend genere JWT tokens

### 5.4 Base de datos vacía
**Síntoma:** "No hay resoluciones"
**Solución:**
```bash
# Ejecutar script de población (ya ejecutado):
cd server
npm run populate-test
```

## 🔧 PASO 6: COMANDOS DE EMERGENCIA

### 6.1 Forzar redeploy del backend:
```bash
cd c:\Users\flavi\OneDrive\Escritorio\LibroDeResolucionesV2
echo "force deploy $(date)" >> FORCE_REDEPLOY.md
git add .
git commit -m "force: redeploy backend"
git push
```

### 6.2 Forzar redeploy del frontend:
```bash
cd c:\Users\flavi\OneDrive\Escritorio\LibroDeResolucionesV2\front
echo "force deploy $(date)" >> .env.production
git add .
git commit -m "force: redeploy frontend"
git push
```

### 6.3 Verificar localmente:
```bash
# Backend local
cd server
npm start

# Frontend local (en otra terminal)
cd front
npm run dev
```

## 📊 ESTADO ESPERADO FINAL

### ✅ URLs que deben funcionar:
- **Frontend:** https://front-jibs1li4h-libro-de-resoluciones-projects.vercel.app
- **Backend:** https://libro-resoluciones-api.onrender.com
- **Login:** admin/admin123 → Redirección a /home
- **Búsqueda:** Debe mostrar 8 resoluciones de prueba
- **Todas las operaciones CRUD:** Funcionando

### ✅ Resoluciones de prueba disponibles:
- 2025001: Designación de Personal de Seguridad
- 2025002: Modificación de Horarios de Guardia
- 2025003: Adquisición de Equipamiento Policial
- 2025004: Protocolo de Seguridad COVID-19
- 2025005: Creación de Nueva Comisaría
- RES-001-2024: Normativa de Funcionamiento Interno
- RES-002-2024: Presupuesto Anual 2024
- RES-003-2024: Protocolo de Seguridad

---
**Si después de estos pasos sigue sin funcionar, ejecutar diagnóstico completo y reportar errores específicos.**
