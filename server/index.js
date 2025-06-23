import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'
import compression from 'compression'
import 'dotenv/config'
import path from 'path'
import { fileURLToPath } from 'url'

import routes from './src/routes/routes.js'
import { validateEnvironment } from './config/validateEnv.js'
import db from './db/connection.js'

// Validar variables de entorno al inicio
validateEnvironment()

const app = express()
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Middleware de compresión para mejorar rendimiento
app.use(compression())

// Headers de seguridad mejorados para CORS
app.use((req, res, next) => {
  // Prevenir MIME type sniffing
  res.setHeader('X-Content-Type-Options', 'nosniff');
  
  // Prevenir clickjacking
  res.setHeader('X-Frame-Options', 'DENY');
  
  // Habilitar filtro XSS del navegador
  res.setHeader('X-XSS-Protection', '1; mode=block');
  
  // Control de referrer
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  
  // Política de permisos
  res.setHeader('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');
  
  next();
});

// Definir orígenes permitidos globalmente
const allowedOrigins = [
  process.env.FRONTEND_URL,
  'http://localhost:5173', // desarrollo local
  'http://localhost:5174', // desarrollo local alternativo
  'http://localhost:5175', // desarrollo local alternativo 2
  'https://libro-de-resoluciones-v2-9izd-fe0i5ihfg.vercel.app', // producción Vercel
  'https://libro-de-resoluciones-v2.vercel.app', // URL actualizada de Vercel
  'https://libro-de-resoluciones-v2-9izd.vercel.app' // URL actual de Vercel
].filter(Boolean) // Elimina valores falsy

// Configuración de CORS con optimizaciones para móviles
const corsOptions = {
  origin: function (origin, callback) {
    // Permitir requests sin origin (ej: aplicaciones móviles, Postman, WebView)
    if (!origin) {
      console.log('✅ Request sin origin permitido (posible móvil/app)')
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

    // Permitir localhost con diferentes puertos (para desarrollo móvil)
    if (origin.includes('localhost') || origin.includes('127.0.0.1') || origin.includes('192.168.')) {
      console.log('✅ Permitiendo desarrollo local/móvil:', origin)
      return callback(null, true)
    }

    console.log('❌ Origen rechazado:', origin)
    callback(new Error(`No permitido por CORS: ${origin}`))
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'HEAD'],
  allowedHeaders: [
    'Content-Type', 
    'Authorization', 
    'Accept', 
    'Origin', 
    'X-Requested-With',
    'Cache-Control',
    'User-Agent'
  ],
  credentials: true,
  optionsSuccessStatus: 200,
  // Configuraciones adicionales para móviles
  preflightContinue: false,
  maxAge: 86400 // Cache preflight por 24 horas
}

app.use(cors(corsOptions))

// Middleware adicional para manejar preflight requests y móviles
app.options('*', (req, res) => {
  console.log('🔄 OPTIONS request recibido para:', req.url)
  const origin = req.headers.origin
  const userAgent = req.headers['user-agent'] || ''
  
  // Detectar si es una request móvil
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent)
  if (isMobile) {
    console.log('📱 Request móvil detectado:', userAgent.substring(0, 50))
  }
  
  if (!origin || allowedOrigins.includes(origin) || 
      origin.includes('vercel.app') || origin.includes('render.com') ||
      origin.includes('localhost') || origin.includes('127.0.0.1') || origin.includes('192.168.')) {
    res.header('Access-Control-Allow-Origin', origin || '*')
    res.header('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS')
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Accept, Origin, X-Requested-With, Cache-Control, User-Agent')
    res.header('Access-Control-Allow-Credentials', 'true')
    res.header('Access-Control-Max-Age', '86400') // Cache por 24 horas
    
    // Headers adicionales para móviles
    if (isMobile) {
      res.header('Vary', 'Origin, User-Agent')
      res.header('Cache-Control', 'public, max-age=3600')
    }
    
    res.status(200).send()
  } else {
    res.status(403).send('CORS no permitido')
  }
})

// Middleware de logging para todas las requests
app.use((req, res, next) => {
  const timestamp = new Date().toISOString()
  console.log(`📋 [${timestamp}] ${req.method} ${req.path} - Origin: ${req.headers.origin || 'No origin'}`)
  next()
})

// Body parsers (sin duplicados)
app.use(express.json({ limit: '50mb' }))
app.use(express.urlencoded({ extended: true, limit: '50mb' }))

// Configurar directorio de archivos estáticos con headers CORS optimizados para móviles
app.use('/uploads', (req, res, next) => {
  const userAgent = req.headers['user-agent'] || ''
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent)
  
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS')
  res.header('Access-Control-Allow-Headers', 'Content-Type, Accept, Cache-Control')
  
  // Headers específicos para móviles
  if (isMobile) {
    res.header('Cache-Control', 'public, max-age=31536000, immutable') // Cache por 1 año en móviles
    res.header('Vary', 'Accept-Encoding, User-Agent')
  } else {
    res.header('Cache-Control', 'public, max-age=3600') // Cache por 1 hora en desktop
  }
  
  console.log(isMobile ? '📱 Sirviendo imagen para móvil:' : '💻 Sirviendo imagen para desktop:', req.path)
  next()
})
app.use('/uploads', express.static(path.join(__dirname, 'uploads'), {
  // Configuraciones adicionales para mejor rendimiento
  etag: true,
  lastModified: true,
  maxAge: '1d'
}))

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
    port: process.env.PORT || 3000,
    version: '2.1.0', // Versión actualizada con diagnóstico
    diagnosticEndpoint: '/diagnose',
    adminCreationEndpoint: '/create-admin'
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
      // Verificar base de datos PostgreSQL
    try {
      // Probar la conexión
      await db.query('SELECT NOW() as server_time');
      diagnosis.database.status = 'connected'
      
      // Verificar tablas existentes
      const tables = await db.query(`
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public'
      `);
      diagnosis.database.tables = tables.map(t => t.table_name)
      
      // Verificar usuarios
      try {
        const users = await db.query('SELECT COUNT(*) as count FROM users')
        diagnosis.database.users = users[0].count
      } catch (err) {
        diagnosis.database.users = 'table_not_exists'
      }
      
      // Verificar libros
      try {
        const books = await db.query('SELECT COUNT(*) as count FROM book')
        diagnosis.database.books = books[0].count
      } catch (err) {
        diagnosis.database.books = 'table_not_exists'
      }
      
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

// Endpoint temporal para inicializar base de datos
app.post('/init-db', async (req, res) => {
  try {
    console.log('🗄️ Inicializando base de datos PostgreSQL')
    
    // La inicialización de PostgreSQL ya se maneja en db/connection.js
    // Solo verificamos que las tablas estén creadas
    const tables = await db.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `);
    
    res.json({
      success: true,
      message: 'Base de datos PostgreSQL inicializada exitosamente',
      tables: tables.map(t => t.table_name)
    })
    
  } catch (error) {
    console.error('❌ Error inicializando DB:', error)
    res.status(500).json({
      success: false,
      error: 'Error inicializando base de datos PostgreSQL',
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
    
    const bcrypt = await import('bcrypt')
    
    // Verificar si el usuario ya existe
    const existingUser = await db.get(
      'SELECT id FROM users WHERE nombre = $1',
      [adminUsername]
    )
    
    if (existingUser) {
      return res.json({
        success: true,
        message: 'Usuario admin ya existe',
        username: adminUsername
      })
    }
    
    // Hashear la contraseña
    const hashedPassword = await bcrypt.hash(adminPassword, 10)
    
    // Insertar el usuario administrador
    await db.query(
      'INSERT INTO users (nombre, contrasena) VALUES ($1, $2)',
      [adminUsername, hashedPassword]
    )
    
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

// Endpoint temporal para cargar datos de prueba en producción
app.post('/load-test-data', async (req, res) => {
  try {
    console.log('📚 Cargando datos de prueba en producción PostgreSQL...')
    
    // Resoluciones de prueba
    const resolucionesPrueba = [
      {
        NumdeResolucion: 'PROD-001-2025',
        Asunto: 'Implementación de Sistema Digital de Resoluciones',
        Referencia: 'Decreto N° 001/2025 - Modernización Tecnológica',
        FechaCreacion: '2025-06-01'
      },
      {
        NumdeResolucion: 'PROD-002-2025',
        Asunto: 'Protocolo de Seguridad de Datos y Persistencia',
        Referencia: 'Circular Técnica N° 002/2025 - Área de Informática',
        FechaCreacion: '2025-06-01'
      },
      {
        NumdeResolucion: 'PROD-003-2025',
        Asunto: 'Configuración de Entorno de Producción',
        Referencia: 'Nota Técnica N° 003/2025 - Departamento de Sistemas',
        FechaCreacion: '2025-06-01'
      },
      {
        NumdeResolucion: 'PROD-004-2025',
        Asunto: 'Verificación de Persistencia de Datos',
        Referencia: 'Test de Funcionalidad N° 004/2025 - Control de Calidad',
        FechaCreacion: '2025-06-01'
      },
      {
        NumdeResolucion: 'PROD-005-2025',
        Asunto: 'Puesta en Marcha del Sistema en Producción',
        Referencia: 'Acta de Entrega N° 005/2025 - Proyecto Finalizado',
        FechaCreacion: '2025-06-01'
      }
    ]
    
    // Verificar cuántas resoluciones existen actualmente
    const currentCount = await db.get('SELECT COUNT(*) as count FROM book')
    console.log(`📊 Resoluciones actuales: ${currentCount.count}`)
    
    let agregadas = 0
    
    // Insertar cada resolución de prueba
    for (const resolucion of resolucionesPrueba) {
      try {
        // Verificar si ya existe
        const existing = await db.get(
          'SELECT numeroresolucion FROM book WHERE numeroresolucion = $1',
          [resolucion.NumdeResolucion]
        )
        
        if (existing) {
          console.log(`⚠️  Resolución ${resolucion.NumdeResolucion} ya existe`)
          continue
        }
        
        // Insertar nueva resolución
        await db.query(
          'INSERT INTO book (numeroresolucion, tema, descripcion, fecha) VALUES ($1, $2, $3, $4)',
          [resolucion.NumdeResolucion, resolucion.Asunto, resolucion.Referencia, resolucion.FechaCreacion]
        )
        
        agregadas++
        console.log(`✅ Resolución ${resolucion.NumdeResolucion} creada`)
        
      } catch (error) {
        console.error(`❌ Error creando ${resolucion.NumdeResolucion}:`, error.message)
      }
    }
    
    // Verificar el resultado final
    const finalCount = await db.get('SELECT COUNT(*) as count FROM book')
    
    res.json({
      success: true,
      message: 'Datos de prueba cargados exitosamente en PostgreSQL',
      antes: currentCount.count,
      despues: finalCount.count,
      agregadas: agregadas,
      resoluciones: resolucionesPrueba.map(r => r.NumdeResolucion)
    })
    
  } catch (error) {
    console.error('❌ Error cargando datos de prueba:', error)
    res.status(500).json({
      success: false,
      error: 'Error cargando datos de prueba',
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
