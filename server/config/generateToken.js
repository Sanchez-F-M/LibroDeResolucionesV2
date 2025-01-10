import jwt from 'jsonwebtoken'
import 'dotenv/config'

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY

export const generateToken = (payload) => {
  const SignOptions = {
    expiresIn: '1d'
  }

  try {
    const token = jwt.sign(payload, JWT_SECRET_KEY, SignOptions)
    return token
  } catch (error) {
    console.log(error)
    return null
  }
}
