import express from 'express'
import multer from 'multer'
import {
  createBook,
  getByIdBook,
  updateBook,
  deleteBook
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

bookRouter.get('/:id', getByIdBook)

bookRouter.post('/', upload.array('files'), createBook)

bookRouter.put('/:id', verifyToken, updateBook)

bookRouter.delete('/:id', deleteBook)

export default bookRouter
