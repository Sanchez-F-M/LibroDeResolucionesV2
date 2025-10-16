import express from 'express'
import { search } from '../controllers/search.controller.js'
import { requireAnyUser } from '../middleware/auth.js'

const searchRouter = express.Router()

searchRouter.post('/', requireAnyUser, search)  // Cualquier usuario logueado puede buscar

export default searchRouter
