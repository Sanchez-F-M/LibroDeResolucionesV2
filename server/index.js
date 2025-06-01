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
  'https://libro-de-resoluciones-v2-9izd-fe0i5ihfg.vercel.app' // producción Vercel
].filter(Boolean) // Elimina valores falsy

// Configuración de CORS
const corsOptions = {
  origin: function (origin, callback) {
    // Permitir requests sin origin (ej: aplicaciones móviles, Postman)
    if (!origin) return callback(null, true)
    
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

// Health check endpoint detallado
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

// Endpoint de diagnóstico para deployment
app.get('/diagnose', async (req, res) => {
  try {
    console.log('🔍 Ejecutando diagnóstico de deployment')
    
    const diagnosis = {
      timestamp: new Date().toISOString(),
      environment: {
        NODE_ENV: process.env.NODE_ENV || 'NOT SET',
        PORT: process.env.PORT || 'NOT SET',
        JWT_SECRET_KEY: process.env.JWT_SECRET_KEY ? 'SET' : 'NOT SET',
        FRONTEND_URL: process.env.FRONTEND_URL || 'NOT SET',
        ADMIN_USERNAME: process.env.ADMIN_USERNAME || 'NOT SET',
        ADMIN_PASSWORD: process.env.ADMIN_PASSWORD ? 'SET' : 'NOT SET'
      },
      database: {
        status: 'unknown',
        tables: [],
        users: 0,
        books: 0
      },
      recommendations: []
    }
    
    // Verificar base de datos
    try {
      const sqlite3 = (await import('sqlite3')).default
      const { open } = await import('sqlite')
      const path = await import('path')
      const { fileURLToPath } = await import('url')
      
      const __filename = fileURLToPath(import.meta.url)
      const __dirname = path.dirname(__filename)
      const dbPath = path.join(__dirname, 'database.sqlite')
      
      const db = await open({
        filename: dbPath,
        driver: sqlite3.Database
      })
      
      diagnosis.database.status = 'connected'
      
      // Verificar tablas
      const tables = await db.all(`
        SELECT name FROM sqlite_master 
        WHERE type='table' AND name NOT LIKE 'sqlite_%'
      `)
      diagnosis.database.tables = tables.map(t => t.name)
      
      // Verificar usuarios
      try {
        const users = await db.all('SELECT COUNT(*) as count FROM users')
        diagnosis.database.users = users[0].count
      } catch (err) {
        diagnosis.database.users = 'table_not_exists'
      }
      
      // Verificar libros
      try {
        const books = await db.all('SELECT COUNT(*) as count FROM books')
        diagnosis.database.books = books[0].count
      } catch (err) {
        diagnosis.database.books = 'table_not_exists'
      }
      
      await db.close()
      
    } catch (error) {
      diagnosis.database.status = 'error'
      diagnosis.database.error = error.message
    }
    
    // Generar recomendaciones
    if (!process.env.JWT_SECRET_KEY) {
      diagnosis.recommendations.push('Configure JWT_SECRET_KEY en Render')
    }
    if (!process.env.FRONTEND_URL) {
      diagnosis.recommendations.push('Configure FRONTEND_URL en Render')
    }
    if (!process.env.ADMIN_USERNAME) {
      diagnosis.recommendations.push('Configure ADMIN_USERNAME en Render')
    }
    if (!process.env.ADMIN_PASSWORD) {
      diagnosis.recommendations.push('Configure ADMIN_PASSWORD en Render')
    }
    if (diagnosis.database.users === 0) {
      diagnosis.recommendations.push('Ejecutar create-admin script después de configurar variables')
    }
    
    res.json(diagnosis)
    
  } catch (error) {
    console.error('❌ Error en diagnóstico:', error)
    res.status(500).json({
      error: 'Error en diagnóstico',
      message: error.message
    })
  }
})

// Endpoint para crear admin manualmente
app.post('/create-admin', async (req, res) => {
  try {
    console.log('👤 Ejecutando creación manual de admin')
    
    const adminUsername = process.env.ADMIN_USERNAME || 'admin'
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123'
    
    const sqlite3 = (await import('sqlite3')).default
    const { open } = await import('sqlite')
    const bcrypt = await import('bcrypt')
    const path = await import('path')
    const { fileURLToPath } = await import('url')
    
    const __filename = fileURLToPath(import.meta.url)
    const __dirname = path.dirname(__filename)
    const dbPath = path.join(__dirname, 'database.sqlite')
    
    const db = await open({
      filename: dbPath,
      driver: sqlite3.Database
    })
    
    // Verificar si el usuario ya existe
    const existingUser = await db.get(
      'SELECT ID FROM users WHERE Nombre = ?',
      [adminUsername]
    )
    
    if (existingUser) {
      await db.close()
      return res.json({
        success: true,
        message: 'Usuario admin ya existe',
        username: adminUsername
      })
    }
    
    // Hashear la contraseña
    const hashedPassword = await bcrypt.hash(adminPassword, 10)
    
    // Insertar el usuario administrador
    await db.run(
      'INSERT INTO users (Nombre, Contrasena) VALUES (?, ?)',
      [adminUsername, hashedPassword]
    )
    
    await db.close()
    
    res.json({
      success: true,
      message: 'Usuario admin creado exitosamente',
      username: adminUsername
    })
    
  } catch (error) {
    console.error('❌ Error creando admin:', error)
    res.status(500).json({
      success: false,
      error: 'Error creando admin',
      message: error.message
    })
  }
})

// Usar rutas de la API
app.use('/api', routes)

// Middleware de manejo de errores
app.use((err, req, res, next) => {
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

{
  "configurations" [
    {
      "type": "node",
      "request": "launch",
      "name": "Launch Backend Server",
      "program": "${workspaceFolder}/server/index.js",
      "cwd": "${workspaceFolder}/server",
      "env": {
        "NODE_ENV": "development"
      },
      "envFile": "${workspaceFolder}/server/.env",
      "restart": true,
      "console": "integratedTerminal",
      "skipFiles": [
        "<node_internals>/**"
      ]
    },
    {
      "type": "node",
      "request": "launch",
      "name": "Launch Frontend Dev Server",
      "runtimeExecutable": "npm",
      "runtimeArgs": [
        "run",
        "dev"
      ],
      "cwd": "${workspaceFolder}/front",
      "console": "integratedTerminal",
      "env": {
        "NODE_ENV": "development"
      },
      "skipFiles": [
        "<node_internals>/**"
      ]
    },
    {
      "type": "node",
      "request": "launch",
      "name": "Run Population Script",
      "program": "${workspaceFolder}/populate-production-cjs.js",
      "cwd": "${workspaceFolder}",
      "console": "integratedTerminal",
      "skipFiles": [
        "<node_internals>/**"
      ]
    }
  ],
  "compounds" [
    {
      "name": "Launch Full Stack",
      "configurations": [
        "Launch Backend Server",
        "Launch Frontend Dev Server"
      ]
    }
  ]
}
