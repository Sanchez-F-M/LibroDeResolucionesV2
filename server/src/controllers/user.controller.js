import db from '../../db/connection.js'
import { generateToken } from '../../config/generateToken.js'

import bcrypt from 'bcrypt'

export const createUser = async (req, res) => {
  try {
    const { Nombre, Contrasena } = req.body

    if (!Nombre || !Contrasena) {
      return res.status(400).json({ error: 'Nombre y Constrasena son requeridos' })
    }

    const hashedPassword = await bcrypt.hash(Contrasena, 10)

    db.query(`INSERT INTO users 
                (ID, Nombre, Contrasena)
                VALUES(NULL, ?, ?)`,
    [Nombre, hashedPassword], (err, rows) => {
      if (err) {
        return res.status(400).json({ err: 'Error al insertar usuario en la base de datos' })
      }

      return res.status(201).json({
        message: 'Usuario creado',
        user: {
          Nombre
        }
      })
    })
  } catch (err) {
    console.log(err)
    res.status(500).json({ error: 'Error interno del servidor' })
  }
}

export const loginUser = async (req, res) => {
  const { Nombre, Contrasena } = req.body

  if (!Nombre || !Contrasena) {
    return res.status(400).json({ error: 'Nombre y Constrasena son requeridos' })
  }

  db.query('SELECT * FROM users WHERE Nombre = ?', [Nombre], async (err, rows) => {
    if (err) {
      return res.status(400).json({ err: 'Error al buscar usuario en la base de datos' })
    }

    if (!rows.length) {
      return res.status(400).json({ error: 'Usuario no encontrado' })
    }

    const user = rows[0]

    const validPassword = await bcrypt.compare(Contrasena, user.Contrasena)

    if (!validPassword) {
      return res.status(400).json({ error: 'Contrasena incorrecta' })
    }

    const tokenPayload = { Nombre }
    const token = generateToken(tokenPayload)

    if (!token) {
      console.error('Error al generar token', err)
      return res.status(500).json({ error: 'Error al generar token' })
    }

    return res.status(200).json({
      message: 'Usuario logueado',
      user: {
        Nombre
      },
      token
    })
  })
}
