# 🛠️ CORRECCIÓN DE ERROR CORS EN RENDER

## 🚨 Problema Identificado
**Error:** `Error: No permitido por CORS`

**Causa:** La configuración de CORS en el servidor era demasiado restrictiva y no manejaba correctamente:
- Requests sin origin (health checks de Render)
- Múltiples dominios de desarrollo
- Dominios de plataformas como Vercel y Render
- Requests OPTIONS (preflight)

## ✅ Soluciones Aplicadas

### 1. **Configuración de CORS Mejorada**
```javascript
// Orígenes permitidos expandidos
const allowedOrigins = [
  process.env.FRONTEND_URL,
  'http://localhost:5173', // desarrollo local
  'http://localhost:5174', // desarrollo local alternativo
  'http://localhost:5175', // desarrollo local alternativo 2
  'https://front-jibs1li4h-libro-de-resoluciones-projects.vercel.app', // producción Vercel
]

// Lógica de CORS más permisiva
const corsOptions = {
  origin: function (origin, callback) {
    // Permitir requests sin origin (health checks, Postman, curl)
    if (!origin) return callback(null, true)
    
    // Permitir orígenes en la lista
    if (allowedOrigins.includes(origin)) return callback(null, true)
    
    // En desarrollo, ser más permisivo
    if (process.env.NODE_ENV !== 'production') return callback(null, true)
    
    // Permitir dominios de plataformas conocidas
    if (origin.includes('vercel.app') || origin.includes('render.com')) {
      return callback(null, true)
    }
    
    callback(new Error(`No permitido por CORS: ${origin}`))
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'Origin', 'X-Requested-With'],
  optionsSuccessStatus: 200
}
```

### 2. **Middleware OPTIONS Explícito**
```javascript
// Manejo explícito de preflight requests
app.options('*', (req, res) => {
  const origin = req.headers.origin
  
  if (!origin || allowedOrigins.includes(origin) || 
      origin.includes('vercel.app') || origin.includes('render.com') ||
      process.env.NODE_ENV !== 'production') {
    
    // Configurar headers CORS apropiados
    res.header('Access-Control-Allow-Origin', origin || '*')
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Accept, Origin, X-Requested-With')
    res.header('Access-Control-Allow-Credentials', 'true')
    res.header('Access-Control-Max-Age', '86400')
    
    return res.sendStatus(200)
  }
  
  res.sendStatus(403)
})
```

### 3. **Logging Mejorado**
```javascript
console.log('🌐 Orígenes permitidos:', allowedOrigins)
console.log('🌐 FRONTEND_URL:', process.env.FRONTEND_URL)
console.log('🌐 NODE_ENV:', process.env.NODE_ENV)

// En cada request
console.log('🔍 Request origin:', origin)
console.log('✅ Permitiendo request sin origin')
console.log('✅ Origen permitido:', origin)
```

### 4. **Middleware de Archivos Estáticos Mejorado**
```javascript
app.use('/uploads', (req, res, next) => {
  const origin = req.headers.origin
  
  // Ser más permisivo con archivos estáticos
  if (!origin || allowedOrigins.includes(origin) || 
      origin.includes('vercel.app') || origin.includes('render.com') ||
      process.env.NODE_ENV !== 'production') {
    
    res.header('Access-Control-Allow-Origin', origin || '*')
    res.header('Access-Control-Allow-Methods', 'GET, OPTIONS')
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
    res.header('Access-Control-Allow-Credentials', 'true')
  }
  
  next()
}, express.static(path.join(__dirname, 'uploads')))
```

## 🔧 Variables de Entorno en Render

Asegúrate de que estas variables estén configuradas en el dashboard de Render:

```bash
NODE_ENV=production
PORT=10000
JWT_SECRET_KEY=SecretKey
FRONTEND_URL=https://front-jibs1li4h-libro-de-resoluciones-projects.vercel.app
```

## 🚀 Próximos Pasos

### 1. **Commit y Push de Cambios**
```bash
git add .
git commit -m "fix: Corregir configuración CORS para Render"
git push origin main
```

### 2. **Redeploy en Render**
- Ve al dashboard de Render
- Selecciona el servicio del backend
- Haz clic en "Manual Deploy" > "Deploy latest commit"

### 3. **Verificar Funcionamiento**
```bash
# Test health check
curl https://libro-resoluciones-api.onrender.com/health

# Test login
curl -X POST https://libro-resoluciones-api.onrender.com/api/user/login \
  -H "Content-Type: application/json" \
  -d '{"Nombre":"admin","Contrasena":"admin123"}'
```

## 🔍 Debugging

Si persisten problemas, revisar los logs de Render:
1. Dashboard de Render > Tu servicio > Logs
2. Buscar mensajes de CORS en los logs
3. Verificar que las variables de entorno estén configuradas
4. Confirmar que el origin del frontend coincida con FRONTEND_URL

## 📋 Checklist de Verificación

- ✅ Configuración de CORS más permisiva
- ✅ Manejo explícito de requests OPTIONS
- ✅ Logging mejorado para debugging
- ✅ Variables de entorno documentadas
- ✅ Script de verificación creado
- ✅ Middleware de archivos estáticos mejorado

---
**Fecha:** 24 de mayo de 2025  
**Status:** 🛠️ CORRECCIÓN APLICADA - LISTA PARA REDEPLOY
