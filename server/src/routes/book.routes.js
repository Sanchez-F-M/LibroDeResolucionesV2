import express from 'express'
import multer from 'multer'
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

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/')
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname)
  }
})

const upload = multer({ storage })

const bookRouter = express.Router()

// Estas rutas deben ir primero para evitar conflictos con el parámetro :id
bookRouter.get('/last-number', getLastResolutionNumber)
bookRouter.get('/all', getAllBooks)

// Ruta especial para insertar resoluciones de prueba (requiere autenticación)
bookRouter.post('/insert-test', verifyToken, insertTestResolution)

// Resto de las rutas - /:id debe ir AL FINAL para no capturar las rutas específicas
bookRouter.get('/:id', getByIdBook)
bookRouter.post('/', upload.array('files'), createBook)
bookRouter.put('/:id', verifyToken, updateBook)
bookRouter.delete('/:id', deleteBook)

export default bookRouter
