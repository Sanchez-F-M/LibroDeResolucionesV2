import db from '../../db/connection.js'
import { generateToken } from '../../config/generateToken.js'

import bcrypt from 'bcrypt'

export const createUser = async (req, res) => {
  try {
    const { Nombre, Contrasena, Rol = 'usuario' } = req.body

    if (!Nombre || !Contrasena) {
      return res.status(400).json({ error: 'Nombre y Contrasena son requeridos' })
    }

    // Validación de contraseña fuerte
    if (Contrasena.length < 6) {
      return res.status(400).json({ error: 'La contraseña debe tener al menos 6 caracteres' })
    }

    const weakPasswords = ['123', 'password', 'test', '12345', 'admin', 'qwerty']
    if (weakPasswords.includes(Contrasena.toLowerCase())) {
      return res.status(400).json({ error: 'La contraseña es demasiado débil. Use una contraseña más segura' })
    }

    // Validar rol
    const rolesPermitidos = ['usuario', 'secretaria', 'admin']
    if (!rolesPermitidos.includes(Rol)) {
      return res.status(400).json({ error: 'Rol no válido' })
    }

    const hashedPassword = await bcrypt.hash(Contrasena, 10)

    await db.query(
      `INSERT INTO users ("Nombre", "Contrasena", "Rol") VALUES ($1, $2, $3)`,
      [Nombre, hashedPassword, Rol]
    )

    res.status(201).json({
      message: 'Usuario creado exitosamente',
      user: { Nombre, Rol }
    })
  } catch (err) {
    console.error('❌ Error en createUser:', err)
    if (err.code === '23505') { // PostgreSQL unique constraint violation
      return res.status(400).json({ error: 'El usuario ya existe' })
    }
    res.status(500).json({ error: 'Error interno del servidor' })
  }
}

export const loginUser = async (req, res) => {
  try {
    const { Nombre, Contrasena } = req.body
    
    if (!Nombre || !Contrasena) {
      return res.status(400).json({ error: 'Nombre y Contrasena son requeridos' })
    }
    
    const user = await db.query('SELECT * FROM users WHERE "Nombre" = $1', [Nombre])
    
    if (user.rows.length === 0) {
      return res.status(401).json({ error: 'Credenciales inválidas' })
    }

    const userData = user.rows[0]
    const validPassword = await bcrypt.compare(Contrasena, userData.Contrasena)

    if (!validPassword) {
      return res.status(401).json({ error: 'Credenciales inválidas' })
    }
    
    try {
      const tokenPayload = { 
        Nombre: userData.Nombre,
        Rol: userData.Rol || 'usuario',
        ID: userData.ID
      }
      const token = generateToken(tokenPayload)

      return res.status(200).json({
        message: 'Usuario logueado correctamente',
        user: { 
          Nombre: userData.Nombre, 
          Rol: userData.Rol || 'usuario',
          ID: userData.ID
        },
        token
      })
    } catch (tokenError) {
      console.error('❌ Error al generar el token:', tokenError)
      return res.status(401).json({ error: 'Error al generar el token' })
    }
  } catch (err) {
    console.error('❌ Error en loginUser:', err)
    res.status(500).json({ error: 'Error interno del servidor' })
  }
}

export const getAllUsers = async (req, res) => {
  try {
    const users = await db.query('SELECT "ID", "Nombre", "Rol", "created_at" FROM users')
    res.status(200).json(users.rows)
  } catch (err) {
    console.error('❌ Error en getAllUsers:', err)
    res.status(500).json({ error: 'Error interno del servidor' })
  }
}

export const getUserById = async (req, res) => {
  try {
    const { id } = req.params

    const user = await db.query('SELECT "ID", "Nombre", "created_at" FROM users WHERE "ID" = $1', [id])

    if (user.rows.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' })
    }

    res.status(200).json(user.rows[0])
  } catch (err) {
    console.error('❌ Error en getUserById:', err)
    res.status(500).json({ error: 'Error interno del servidor' })
  }
}

export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params

    const result = await db.run('DELETE FROM users WHERE ID = ?', [id])

    if (result.changes === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' })
    }

    res.status(200).json({ message: 'Usuario eliminado correctamente' })
  } catch (err) {
    console.error('❌ Error en deleteUser:', err)
    res.status(500).json({ error: 'Error interno del servidor' })
  }
}
