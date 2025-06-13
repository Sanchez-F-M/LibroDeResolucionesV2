import express from 'express'
import { createUser, loginUser, getAllUsers, getUserById, deleteUser } from '../controllers/user.controller.js'
import { requireAdmin, requireAnyUser } from '../middleware/auth.js'

const userRouter = express.Router()

// Rutas públicas (sin autenticación)
userRouter.post('/register', createUser)
userRouter.post('/login', loginUser)

// Rutas protegidas (requieren autenticación)
userRouter.get('/profile', requireAnyUser, getAllUsers)  // Cualquier usuario logueado
userRouter.get('/:id', requireAnyUser, getUserById)      // Cualquier usuario logueado

// Rutas de administración (solo administradores)
userRouter.delete('/:id', requireAdmin, deleteUser)     // Solo administradores

export default userRouter
