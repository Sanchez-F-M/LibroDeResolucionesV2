import jwt from 'jsonwebtoken'
import 'dotenv/config'

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY

if (!JWT_SECRET_KEY) {
  throw new Error('La clave secreta para JWT no está configurada.')
}

export const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]

  if (!token) {
    return res.status(401).json({ error: 'Acceso denegado. No se proporcionó un token.' })
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET_KEY)
    req.user = decoded // Agregar el usuario decodificado al objeto de solicitud
    next() // Continuar con el siguiente middleware
  } catch (error) {
    console.error('Error al verificar el token:', error)
    return res.status(403).json({ error: 'Token inválido o expirado.' })
  }
}
