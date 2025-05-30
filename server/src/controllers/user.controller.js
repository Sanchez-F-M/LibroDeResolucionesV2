import db from '../../db/connection.js'
import { generateToken } from '../../config/generateToken.js'

import bcrypt from 'bcrypt'

export const createUser = async (req, res) => {
  try {
    const { Nombre, Contrasena } = req.body

    if (!Nombre || !Contrasena) {
      return res.status(400).json({ error: 'Nombre y Contrasena son requeridos' })
    }

    const hashedPassword = await bcrypt.hash(Contrasena, 10)

    await db.run(
      `INSERT INTO users (Nombre, Contrasena) VALUES (?, ?)`,
      [Nombre, hashedPassword]
    )

    res.status(201).json({
      message: 'Usuario creado exitosamente',
      user: { Nombre }
    })
  } catch (err) {
    console.error('❌ Error en createUser:', err)
    if (err.code === 'SQLITE_CONSTRAINT_UNIQUE') {
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

    const user = await db.get('SELECT * FROM users WHERE Nombre = ?', [Nombre])

    if (!user) {
      return res.status(400).json({ error: 'Usuario no encontrado' })
    }

    const validPassword = await bcrypt.compare(Contrasena, user.Contrasena)

    if (!validPassword) {
      return res.status(400).json({ error: 'Contraseña incorrecta' })
    }

    try {
      const tokenPayload = { Nombre }
      const token = generateToken(tokenPayload)

      return res.status(200).json({
        message: 'Usuario logueado correctamente',
        user: { Nombre },
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
    const users = await db.all('SELECT ID, Nombre, created_at FROM users')
    res.status(200).json(users)
  } catch (err) {
    console.error('❌ Error en getAllUsers:', err)
    res.status(500).json({ error: 'Error interno del servidor' })
  }
}

export const getUserById = async (req, res) => {
  try {
    const { id } = req.params

    const user = await db.get('SELECT ID, Nombre, created_at FROM users WHERE ID = ?', [id])

    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' })
    }

    res.status(200).json(user)
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
