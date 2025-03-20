import express from 'express'
import { search } from '../controllers/search.controller.js'

const searchRouter = express.Router()

searchRouter.post('/', search)

export default searchRouter
