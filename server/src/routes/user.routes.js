import express from 'express'
import { createUser, loginUser, getAllUsers } from '../controllers/user.controller.js'

const userRouter = express.Router()

userRouter.post('/register', createUser)
userRouter.post('/login', loginUser)

// Opcionales
userRouter.get('/profile', getAllUsers)

export default userRouter
