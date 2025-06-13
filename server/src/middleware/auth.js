import jwt from 'jsonwebtoken'

// Buscar JWT_SECRET en múltiples variables posibles (igual que en verifyToken.js)
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY || 
                      process.env.JWT_SECRET || 
                      process.env.SECRET_KEY ||
                      'fallback-secret-for-development-only'

// Middleware para verificar roles
export const requireRole = (rolesPermitidos) => {
  return (req, res, next) => {
    try {
      const token = req.headers.authorization?.split(' ')[1] || req.headers.authorization

      if (!token) {
        return res.status(401).json({ 
          error: 'Token requerido',
          message: 'Debe iniciar sesión para acceder a este recurso' 
        })
      }

      const decoded = jwt.verify(token, JWT_SECRET_KEY)
      const userRole = decoded.Rol || 'usuario'

      // Verificar si el rol del usuario está en los roles permitidos
      if (!rolesPermitidos.includes(userRole)) {
        return res.status(403).json({ 
          error: 'Acceso denegado',
          message: `Su rol '${userRole}' no tiene permisos para esta acción. Roles requeridos: ${rolesPermitidos.join(', ')}`
        })
      }

      // Agregar información del usuario al request
      req.user = {
        ID: decoded.ID,
        Nombre: decoded.Nombre,
        Rol: userRole
      }

      next()
    } catch (error) {
      console.error('❌ Error en verificación de rol:', error)
      return res.status(401).json({ 
        error: 'Token inválido',
        message: 'Su sesión ha expirado. Por favor, inicie sesión nuevamente.'
      })
    }
  }
}

// Roles predefinidos para facilitar el uso
export const ROLES = {
  ADMIN: 'admin',
  SECRETARIA: 'secretaria', 
  USUARIO: 'usuario'
}

// Middleware específicos para cada nivel de acceso
export const requireAdmin = requireRole([ROLES.ADMIN])
export const requireSecretariaOrAdmin = requireRole([ROLES.SECRETARIA, ROLES.ADMIN])
export const requireAnyUser = requireRole([ROLES.USUARIO, ROLES.SECRETARIA, ROLES.ADMIN])

// Función para verificar permisos específicos
export const checkPermission = (action, userRole) => {
  const permissions = {
    // Administradores pueden hacer todo
    [ROLES.ADMIN]: [
      'create_user', 'delete_user', 'modify_user',
      'create_resolution', 'modify_resolution', 'delete_resolution',
      'view_all_resolutions', 'manage_system'
    ],
    
    // Secretaria puede gestionar resoluciones pero no usuarios
    [ROLES.SECRETARIA]: [
      'create_resolution', 'modify_resolution', 'delete_resolution',
      'view_all_resolutions'
    ],
    
    // Usuario normal solo puede ver
    [ROLES.USUARIO]: [
      'view_all_resolutions'
    ]
  }

  return permissions[userRole]?.includes(action) || false
}

export default { requireRole, requireAdmin, requireSecretariaOrAdmin, requireAnyUser, ROLES, checkPermission }
