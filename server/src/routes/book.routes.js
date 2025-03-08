import express from 'express';
import {
  createBook,
  getByIdBook,
  updateBook,
  deleteBook,
} from '../controllers/book.controller.js';
import { verifyToken } from '../../config/verifyToken.js';

const bookRouter = express.Router();

bookRouter.get('/book/:id', verifyToken, getByIdBook);

bookRouter.post('/book', verifyToken, createBook);

bookRouter.put('/book/:id', verifyToken, updateBook);

bookRouter.delete('/book/:id', deleteBook);

export default bookRouter;
