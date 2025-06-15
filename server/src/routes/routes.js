import express from 'express'
import userRouter from './user.routes.js'
import bookRouter from './book.routes.js'
import searchRouter from './search.routes.js'
import cloudinaryRouter from './cloudinary.routes.js'

const router = express.Router()

router.use('/user', userRouter)
router.use('/books', bookRouter)
router.use('/search', searchRouter)
router.use('/cloudinary', cloudinaryRouter)

export default router
