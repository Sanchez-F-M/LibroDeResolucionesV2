import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'
import compression from 'compression'
import 'dotenv/config'
import path from 'path'
import { fileURLToPath } from 'url'

import routes from './src/routes/routes.js'
import { validateEnvironment } from './config/validateEnv.js'

// Validar variables de entorno al inicio
validateEnvironment()

const app = express()
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Middleware de compresión para mejorar rendimiento
app.use(compression())

// Definir orígenes permitidos globalmente
const allowedOrigins = [
  process.env.FRONTEND_URL,
  'http://localhost:5173', // desarrollo local
  'http://localhost:5174', // desarrollo local alternativo
  'http://localhost:5175', // desarrollo local alternativo 2
  'http://localhost:3000',
  'https://libro-de-resoluciones-v2.vercel.app', // producción Vercel principal
  'https://front-jibs1li4h-libro-de-resoluciones-projects.vercel.app' // producción Vercel alternativo
].filter(Boolean) // Elimina valores falsy

// Configuración de CORS
const corsOptions = {
  origin: function (origin, callback) {
    // Permitir requests sin origin (ej: aplicaciones móviles, Postman)
    if (!origin) return callback(null, true)
    
<<<<<<< HEAD
    // Permitir dominios específicos en desarrollo
    if (process.env.NODE_ENV !== 'production') {
      if (origin.includes('localhost') || origin.includes('127.0.0.1')) {
        return callback(null, true)
      }
    }
    
    // Verificar si el origin está en la lista permitida
    if (allowedOrigins.includes(origin) || 
        origin.includes('vercel.app') || 
        origin.includes('render.com')) {
      return callback(null, true)
    }
    
    callback(null, true) // Ser permisivo en desarrollo
=======
    // Permitir requests sin origin (health checks, Postman, curl, etc.)
    if (!origin) {
      console.log('✅ Permitiendo request sin origin')
      return callback(null, true)
    }
    
    // Permitir orígenes en la lista
    if (allowedOrigins.includes(origin)) {
      console.log('✅ Origen permitido:', origin)
      return callback(null, true)
    }
    
    // Permitir dominios de Vercel y Render
    if (origin.includes('vercel.app') || origin.includes('render.com')) {
      console.log('✅ Permitiendo dominio de plataforma:', origin)
      return callback(null, true)
    }

    console.log('❌ Origen rechazado:', origin)
    callback(new Error(`No permitido por CORS: ${origin}`))
>>>>>>> Flavio
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'Origin', 'X-Requested-With'],
  credentials: true,
  optionsSuccessStatus: 200
}

app.use(cors(corsOptions))

// Middleware adicional para manejar preflight requests
app.options('*', (req, res) => {
  console.log('🔄 OPTIONS request recibido para:', req.url)
  const origin = req.headers.origin
  
  if (!origin || allowedOrigins.includes(origin) || origin.includes('vercel.app') || origin.includes('render.com')) {
    res.header('Access-Control-Allow-Origin', origin || '*')
    res.header('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS')
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Accept, Origin, X-Requested-With')
    res.header('Access-Control-Allow-Credentials', 'true')
    res.status(200).send()
  } else {
    res.status(403).send('CORS no permitido')
  }
})

// Body parsers
app.use(bodyParser.json({ limit: '50mb' }))
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }))
app.use(express.json({ limit: '50mb' }))

// Configurar directorio de archivos estáticos
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

// Middleware de logging para todas las requests
app.use((req, res, next) => {
  const timestamp = new Date().toISOString()
  console.log(`📋 [${timestamp}] ${req.method} ${req.path} - Origin: ${req.headers.origin || 'No origin'}`)
  next()
<<<<<<< HEAD
}, express.static(path.join(__dirname, 'uploads')))

// Middlewares para parseo de datos
app.use(compression())
app.use(express.json({ limit: '50mb' }))
app.use(express.urlencoded({ extended: true, limit: '50mb' }))
app.use(bodyParser.json({ limit: '50mb' }))

// Health check específico para Render
app.get('/render-health', (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.status(200).json({ 
    status: 'OK', 
    service: 'libro-resoluciones-api',
    timestamp: new Date().toISOString(),
    env: process.env.NODE_ENV || 'development'
  })
=======
>>>>>>> Flavio
})

// Health check en ruta raíz para Render
app.get('/', (req, res) => {
  console.log('❤️ Health check desde ruta raíz')
  res.status(200).json({
    status: 'OK',
    message: 'Libro de Resoluciones API is running',
    timestamp: new Date().toISOString(),
    env: process.env.NODE_ENV || 'development',
    port: process.env.PORT || 3000
  })
})

<<<<<<< HEAD
// Verificación de estado del servidor
=======
// Health check endpoint detallado
>>>>>>> Flavio
app.get('/health', (req, res) => {
  console.log('❤️ Health check detallado')
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    env: process.env.NODE_ENV || 'development',
    corsOrigins: allowedOrigins.length,
    port: process.env.PORT || 3000
  })
})

// Usar rutas de la API
app.use('/api', routes)

// Middleware de manejo de errores
app.use((err, req, res, next) => {
<<<<<<< HEAD
  console.error('❌ Error:', err.stack)
  res.status(500).json({ 
    error: 'Algo salió mal!',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Error interno del servidor'
  })
})

// Ruta 404
app.use('*', (req, res) => {
  res.status(404).json({ 
    error: 'Ruta no encontrada',
    path: req.originalUrl 
  })
})

// Iniciar el servidor
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${PORT}`)
  console.log('🌍 Environment:', process.env.NODE_ENV || 'development')
  console.log('🔗 Allowed origins:', allowedOrigins)
  console.log('📁 Static files served from:', path.join(__dirname, 'uploads'))
})

// Manejo de errores no capturados
process.on('uncaughtException', (err) => {
  console.error('❌ Uncaught Exception:', err)
  process.exit(1)
})

process.on('unhandledRejection', (err) => {
  console.error('❌ Unhandled Rejection:', err)
  process.exit(1)
=======
  console.error('❌ Error middleware:', err.message)
  
  if (err.message.includes('CORS')) {
    return res.status(403).json({
      error: 'CORS Error',
      message: err.message,
      origin: req.headers.origin
    })
  }
  
  res.status(500).json({
    error: 'Error interno del servidor',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Error interno'
  })
>>>>>>> Flavio
})

// Manejo de rutas no encontradas
app.use('*', (req, res) => {
  console.log(`❓ Ruta no encontrada: ${req.method} ${req.originalUrl}`)
  res.status(404).json({
    error: 'Ruta no encontrada',
    path: req.originalUrl,
    method: req.method
  })
})

// Configuración del puerto
const PORT = process.env.PORT || 3000

// Iniciar servidor
app.listen(PORT, '0.0.0.0', () => {
  console.log('🚀 ========================================')
  console.log(`🚀 Server running on port ${PORT}`)
  console.log(`🚀 Environment: ${process.env.NODE_ENV || 'development'}`)
  console.log(`🚀 CORS origins: ${allowedOrigins.length} configured`)
  console.log('🚀 Health check: / and /health')
  console.log('🚀 API endpoints: /api/*')
  console.log('🚀 ========================================')
})

// Manejo de errores no capturados
process.on('uncaughtException', (err) => {
  console.error('❌ Uncaught Exception:', err)
  process.exit(1)
})

process.on('unhandledRejection', (err) => {
  console.error('❌ Unhandled Rejection:', err)
  process.exit(1)
})

export default app
