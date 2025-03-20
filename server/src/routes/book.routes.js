import express from 'express'
import {
  createBook,
  getByIdBook,
  updateBook,
  deleteBook
} from '../controllers/book.controller.js'
import { verifyToken } from '../../config/verifyToken.js'

const bookRouter = express.Router()

bookRouter.get('/:id', getByIdBook)

bookRouter.post('/', createBook)

bookRouter.put('/:id', verifyToken, updateBook)

bookRouter.delete('/:id', deleteBook)

export default bookRouter
