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

// Configuración de CORS más específica
app.use(cors({
  origin: 'http://localhost:5173', // URL de tu frontend
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'Origin', 'X-Requested-With'],
  optionsSuccessStatus: 200 // Para soporte de navegadores legacy
}

app.use(cors(corsOptions))

// Middleware adicional para manejar preflight requests
app.options('*', (req, res) => {
  console.log('🔄 OPTIONS request recibido para:', req.url)
  const origin = req.headers.origin
  
  if (!origin || allowedOrigins.includes(origin) || 
      origin.includes('vercel.app') || origin.includes('render.com') ||
      process.env.NODE_ENV !== 'production') {
    
    if (origin) {
      res.header('Access-Control-Allow-Origin', origin)
    } else {
      res.header('Access-Control-Allow-Origin', '*')
    }
    
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Accept, Origin, X-Requested-With')
    res.header('Access-Control-Allow-Credentials', 'true')
    res.header('Access-Control-Max-Age', '86400') // Cache preflight por 24 horas
    
    return res.sendStatus(200)
  }
  
  res.sendStatus(403)
})

// Middleware para archivos estáticos con CORS mejorado
app.use('/uploads', (req, res, next) => {
  const origin = req.headers.origin
  
  // Ser más permisivo con archivos estáticos
  if (!origin || allowedOrigins.includes(origin) || 
      origin.includes('vercel.app') || origin.includes('render.com') ||
      process.env.NODE_ENV !== 'production') {
    if (origin) {
      res.header('Access-Control-Allow-Origin', origin)
    } else {
      res.header('Access-Control-Allow-Origin', '*')
    }
  }
  
  res.header('Access-Control-Allow-Methods', 'GET, OPTIONS')
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  res.header('Access-Control-Allow-Credentials', 'true')
  
  next()
}, express.static(path.join(__dirname, 'uploads')))

// Middlewares para parseo de datos
app.use(express.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// Puerto para el servidor
const PORT = process.env.PORT || 3000

// Health check específico para Render (sin CORS)
app.get('/render-health', (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.status(200).json({ 
    status: 'OK', 
    service: 'libro-resoluciones-api',
    timestamp: new Date().toISOString(),
    env: process.env.NODE_ENV || 'development'
  })
})

// Health check para Render (ruta raíz)
app.get('/', (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.status(200).json({ 
    status: 'OK', 
    message: 'Libro de Resoluciones API is running',
    timestamp: new Date().toISOString(),
    env: process.env.NODE_ENV || 'development',
    port: PORT
  })
})

// Verificación de estado del servidor (endpoint principal para Render)
app.get('/health', (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Content-Type', 'application/json')
  res.status(200).json({ 
    status: 'OK', 
    service: 'libro-resoluciones-api',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    env: process.env.NODE_ENV || 'development',
    port: PORT
  })
})

// Rutas API
app.use('/api', routes)

// Iniciar el servidor
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`)
  console.log('Environment:', process.env.NODE_ENV || 'development')
  console.log('Allowed origins:', allowedOrigins)
})
