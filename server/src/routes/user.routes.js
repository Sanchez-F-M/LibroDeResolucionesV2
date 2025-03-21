import express from 'express'
import { createUser, loginUser, getAllUsers, getUserById, deleteUser } from '../controllers/user.controller.js'

const userRouter = express.Router()

userRouter.post('/register', createUser)
userRouter.post('/login', loginUser)

// Opcionales
userRouter.get('/profile', getAllUsers)
userRouter.get('/:id', getUserById)
userRouter.delete('/:id', deleteUser)

export default userRouter
