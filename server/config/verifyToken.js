import jwt from 'jsonwebtoken'
import 'dotenv/config'

// Buscar JWT_SECRET en múltiples variables posibles
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY || 
                      process.env.JWT_SECRET || 
                      process.env.SECRET_KEY ||
                      'fallback-secret-for-development-only'

// Logging para debug en Render
console.log('🔐 JWT Secret check:', {
  JWT_SECRET_KEY_exists: !!process.env.JWT_SECRET_KEY,
  JWT_SECRET_exists: !!process.env.JWT_SECRET,
  SECRET_KEY_exists: !!process.env.SECRET_KEY,
  NODE_ENV: process.env.NODE_ENV,
  using_fallback: JWT_SECRET_KEY === 'fallback-secret-for-development-only'
})

if (!JWT_SECRET_KEY || JWT_SECRET_KEY === 'fallback-secret-for-development-only') {
  if (process.env.NODE_ENV === 'production') {
    throw new Error('❌ PRODUCCIÓN: La clave secreta para JWT no está configurada. Configurar JWT_SECRET_KEY en Render.')
  } else {
    console.warn('⚠️  DESARROLLO: Usando JWT secret por defecto (no usar en producción)')
  }
}

export const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]

  if (!token) {
    return res.status(401).json({ error: 'Acceso denegado. No se proporcionó un token.' })
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET_KEY)
    req.user = decoded
    next()
  } catch (error) {
    console.error('Error al verificar el token:', error)
    return res.status(403).json({ error: 'Token inválido o expirado.' })
  }
}
