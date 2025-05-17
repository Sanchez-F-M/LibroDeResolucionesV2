import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'
import 'dotenv/config'
import path from 'path'
import { fileURLToPath } from 'url'

import routes from './src/routes/routes.js'

const app = express()

// Configuración de CORS mejorada
const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = [
      process.env.FRONTEND_URL,
      'http://localhost:5173', // desarrollo
    ]
    
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true)
    } else {
      callback(new Error('No permitido por CORS'))
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}

app.use(cors(corsOptions))

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Middleware para archivos estáticos
app.use('/uploads', (req, res, next) => {
  const origin = req.headers.origin
  if (allowedOrigins.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin)
  }
  res.header('Access-Control-Allow-Methods', 'GET')
  res.header('Access-Control-Allow-Headers', 'Content-Type')
  next()
}, express.static(path.join(__dirname, 'uploads')))

// Middlewares para parseo de datos
app.use(express.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// Puerto para el servidor
const PORT = process.env.PORT || 3000

// Rutas API
app.use('/api', routes)

// Verificación de estado del servidor
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() })
})

// Iniciar el servidor
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`)
  console.log('Environment:', process.env.NODE_ENV || 'development')
  console.log('Allowed origins:', allowedOrigins)
})
