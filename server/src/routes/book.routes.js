import express from 'express'
import multer from 'multer'
import {
  createBook,
  getAllBooks,
  getByIdBook,
  updateBook,
  deleteBook,
  getLastResolutionNumber
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

// Esta ruta debe ir primero para evitar conflictos con el parámetro :id
bookRouter.get('/last-number', getLastResolutionNumber)

// Ruta para obtener todas las resoluciones
bookRouter.get('/', getAllBooks)

// Resto de las rutas
bookRouter.get('/:id', getByIdBook)
bookRouter.post('/', upload.array('files'), createBook)
bookRouter.put('/:id', verifyToken, updateBook)
bookRouter.delete('/:id', deleteBook)

export default bookRouter
