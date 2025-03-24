import express from 'express'
import userRouter from './user.routes.js'
import bookRouter from './book.routes.js'
import searchRouter from './search.routes.js'

const router = express.Router()

router.use('/user', userRouter)
router.use('/books', bookRouter)
router.use('/search', searchRouter)

export default router
