import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'
import 'dotenv/config'
import path from 'path'
import { fileURLToPath } from 'url'

import routes from './src/routes/routes.js'

const app = express()
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Configuración de CORS más específica
const allowedOrigins = [
  'http://localhost:5173',
  'https://libro-de-resoluciones.vercel.app', // Añade aquí tu dominio de Vercel
  process.env.FRONTEND_URL // URL desde variable de entorno
].filter(Boolean);

app.use(cors({
  origin: function(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
  exposedHeaders: ['Content-Disposition'] // Importante para las descargas
}))

// Configurar headers para archivos estáticos
app.use('/uploads', (req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:5173');
  res.header('Access-Control-Allow-Methods', 'GET');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
}, express.static(path.join(__dirname, 'uploads')))

app.use(express.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

const PORT = process.env.PORT || 3000

app.use('/api', routes)

app.listen(PORT, () => {
  console.log(`Server running in http://localhost:${PORT}`)
  console.log('Defined routes:')
  console.log(`[GET] http://localhost:${PORT}`)
})
