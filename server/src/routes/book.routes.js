import express from 'express'
import {
  createBook,
  getAllBooks,
  getByIdBook,
  updateBook,
  deleteBook,
  getLastResolutionNumber,
  insertTestResolution
} from '../controllers/book.controller.js'
import { verifyToken } from '../../config/verifyToken.js'
import { requireAnyUser, requireSecretariaOrAdmin, requireAdmin } from '../middleware/auth.js'
import { getUploadConfig } from '../../config/cloudinary.js'

// Obtener la configuración de upload (Cloudinary o local según el entorno)
const upload = getUploadConfig()

const bookRouter = express.Router()

// Ruta principal que apunta a getAllBooks (para compatibilidad con el frontend que espera GET /api/books)
bookRouter.get('/', requireAnyUser, getAllBooks)                          // Cualquier usuario logueado

// Estas rutas deben ir después para evitar conflictos con la ruta raíz
bookRouter.get('/last-number', requireAnyUser, getLastResolutionNumber)   // Cualquier usuario logueado
bookRouter.get('/all', requireAnyUser, getAllBooks)                       // Cualquier usuario logueado (duplicada para compatibilidad)

// Ruta especial para insertar resoluciones de prueba (solo administradores)
bookRouter.post('/insert-test', requireAdmin, insertTestResolution)

// Resto de las rutas - /:id debe ir AL FINAL para no capturar las rutas específicas
bookRouter.get('/:id', requireAnyUser, getByIdBook)                       // Cualquier usuario logueado
bookRouter.post('/', requireSecretariaOrAdmin, upload.array('files'), createBook)  // Secretaria o Admin
bookRouter.put('/:id', requireSecretariaOrAdmin, updateBook)              // Secretaria o Admin
bookRouter.delete('/:id', requireAdmin, deleteBook)                      // Solo administradores

export default bookRouter
