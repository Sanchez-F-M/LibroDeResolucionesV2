import express from 'express'
import { createUser, loginUser } from '../controllers/user.controller.js'

const userRouter = express.Router()

userRouter.post('/user/register', createUser)
userRouter.post('/user/login', loginUser)

export default userRouter
