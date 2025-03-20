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

    // Usamos `await db.query()` en lugar de `db.query(..., callback)`
    await db.query(
      `INSERT INTO users (ID, Nombre, Contrasena) VALUES (NULL, ?, ?)`,
      [Nombre, hashedPassword]
    )

    res.status(201).json({
      message: 'Usuario creado exitosamente',
      user: { Nombre }
    })
  } catch (err) {
    console.error('❌ Error en createUser:', err)
    res.status(500).json({ error: 'Error interno del servidor' })
  }
}

export const loginUser = async (req, res) => {
  try {
    const { Nombre, Contrasena } = req.body

    if (!Nombre || !Contrasena) {
      return res.status(400).json({ error: 'Nombre y Contrasena son requeridos' })
    }

    // Buscamos el usuario
    const [rows] = await db.query('SELECT * FROM users WHERE Nombre = ?', [Nombre])

    if (rows.length === 0) {
      return res.status(400).json({ error: 'Usuario no encontrado' })
    }

    const user = rows[0]

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
    const [rows] = await db.query('SELECT * FROM users')

    res.status(200).json(rows)
  } catch (err) {
    console.error('❌ Error en getAllUsers:', err)
    res.status(500).json({ error: 'Error interno del servidor' })
  }
}
