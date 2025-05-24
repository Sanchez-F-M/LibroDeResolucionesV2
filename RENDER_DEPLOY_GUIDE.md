# 🚀 GUÍA DE DESPLIEGUE EN RENDER - BACKEND CON SQLITE

## 📋 Resumen
Esta guía te llevará paso a paso para desplegar el backend de la aplicación "Libro de Resoluciones" en Render.com, utilizando SQLite como base de datos.

## ✅ Ventajas de SQLite en Render
- 🎯 **Cero configuración** de base de datos externa
- 💰 **Costo reducido** - Sin servicios de BD adicionales ($0/mes)
- ⚡ **Mayor rendimiento** - Base de datos integrada
- 🔒 **Más seguro** - Sin conexiones de red a BD externa
- 📦 **Portátil** - Todo incluido en el proyecto

## 🔧 Variables de entorno necesarias
Solo necesitas configurar **2 variables**:

| Variable | Valor | Descripción |
|----------|--------|-------------|
| `JWT_SECRET_KEY` | `tu-clave-secreta-segura` | Para autenticación JWT |
| `FRONTEND_URL` | `https://front-jibs1li4h-libro-de-resoluciones-projects.vercel.app` | URL de tu frontend |

## 📝 Pasos para el despliegue

### 1. Acceder a Render
1. Ve a [render.com](https://render.com)
2. Inicia sesión con tu cuenta
3. En el dashboard, haz clic en **"New +"**
4. Selecciona **"Web Service"**

### 2. Conectar repositorio
1. Selecciona **"Build and deploy from a Git repository"**
2. Conecta tu cuenta de GitHub si no lo has hecho
3. Busca y selecciona: `Sanchez-F-M/LibroDeResolucionesV2`
4. Haz clic en **"Connect"**

### 3. Configuración del servicio
Rellena los siguientes campos:

| Campo | Valor |
|-------|--------|
| **Name** | `libro-resoluciones-api` |
| **Region** | `Oregon (US West)` |
| **Branch** | `Flavio` |
| **Root Directory** | `server` |
| **Runtime** | `Node` |
| **Build Command** | `npm install` |
| **Start Command** | `npm start` |

### 4. Plan de servicio
- Selecciona **"Free"** (para empezar)
- Puedes actualizar más tarde si necesitas más recursos

### 5. Variables de entorno
En la sección **"Environment Variables"**, agrega:

```
JWT_SECRET_KEY = tu-clave-secreta-muy-segura-aqui
FRONTEND_URL = https://front-jibs1li4h-libro-de-resoluciones-projects.vercel.app
```

**⚠️ Importante:** Genera una clave JWT segura, por ejemplo:
```
JWT_SECRET_KEY = MiClaveSecreta2025LibroResolucionesPoliciaT ucuman!@#$
```

### 6. Configuración avanzada
En **"Advanced"**, configura:
- **Health Check Path**: `/health`
- **Auto-Deploy**: ✅ Activado

### 7. Desplegar
1. Haz clic en **"Create Web Service"**
2. Render comenzará el proceso de build automáticamente
3. El proceso tardará unos 2-3 minutos

## 🔍 Verificación del despliegue

### 1. Verificar el build
- En el dashboard de Render, verifica que el build haya sido exitoso
- Los logs deben mostrar: `✅ Variables de entorno validadas correctamente`

### 2. Probar el health check
Una vez desplegado, tu URL será algo como:
```
https://libro-resoluciones-api-xxxx.onrender.com
```

Prueba el endpoint de salud:
```
https://libro-resoluciones-api-xxxx.onrender.com/health
```

Debes ver una respuesta como:
```json
{
  "status": "OK",
  "timestamp": "2025-05-24T..."
}
```

### 3. Probar la API
Prueba algunos endpoints principales:
```
GET https://libro-resoluciones-api-xxxx.onrender.com/api/resolution/all
POST https://libro-resoluciones-api-xxxx.onrender.com/api/user/login
```

## 🔄 Siguiente paso: Actualizar frontend
Una vez que tengas la URL de tu backend desplegado:

1. Ve a tu proyecto en Vercel
2. En **Settings > Environment Variables**
3. Actualiza `VITE_API_BASE_URL` con tu nueva URL de Render:
   ```
   VITE_API_BASE_URL = https://libro-resoluciones-api-xxxx.onrender.com
   ```
4. Redesplega el frontend

## 🔧 Comandos útiles para testing local
Antes del despliegue, asegúrate de que todo funcione localmente:

```bash
# En el directorio server/
npm install
npm start

# En otra terminal, probar endpoints:
curl http://localhost:3000/health
curl http://localhost:3000/api/resolution/all
```

## 🐛 Solución de problemas

### Error: "Module not found"
- Verifica que todas las dependencias estén en `package.json`
- Asegúrate de que `npm install` se ejecute correctamente

### Error: "Variables de entorno faltantes"
- Verifica que `JWT_SECRET_KEY` y `FRONTEND_URL` estén configuradas
- Revisa que no haya espacios extra en los valores

### Error: "Cannot connect to database"
- SQLite se maneja automáticamente, no debería haber errores de conexión
- Si persiste, revisa los logs de Render

### El servicio no responde
- Verifica que el puerto sea configurado automáticamente por Render
- Revisa los logs en tiempo real en el dashboard de Render

## 📊 Monitoring después del despliegue
- Render proporciona métricas automáticas de CPU, memoria y respuesta
- Los logs están disponibles en tiempo real
- El health check se ejecuta automáticamente cada 30 segundos

## 🎉 ¡Listo!
Una vez completados estos pasos, tu backend estará funcionando en producción con:
- ✅ Base de datos SQLite integrada
- ✅ API REST completamente funcional
- ✅ Autenticación JWT
- ✅ Manejo de archivos e imágenes
- ✅ CORS configurado para tu frontend
- ✅ Datos de prueba ya cargados

**¡Tu aplicación web estará completamente desplegada y funcionando!** 🚀
