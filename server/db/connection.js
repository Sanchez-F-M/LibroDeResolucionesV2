<<<<<<< HEAD
import mysql from 'mysql2/promise'
import dotenv from 'dotenv'
dotenv.config()

const db = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: process.env.DB_PASSWORD,
  database: 'libroderesolucionDB',
  port: 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
})
=======
// Configuración SQLite para producción
import sqlite3 from 'sqlite3'
import { open } from 'sqlite'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Crear la base de datos en la carpeta del proyecto
const dbPath = path.join(__dirname, '../database.sqlite')

let db = null

async function initDatabase () {
  if (db) return db
>>>>>>> Flavio

  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database
    })

    console.log('✅ Conexión a SQLite exitosa:', dbPath)

    // Crear tablas si no existen
    await createTables()
    
    return db
  } catch (error) {
    console.error('❌ Error al conectar a SQLite:', error)
    throw error
  }
}

<<<<<<< HEAD
testConnection()
=======
async function createTables () {
  try {
    // Crear tabla de resoluciones
    await db.exec(`
      CREATE TABLE IF NOT EXISTS resolution (
        NumdeResolucion TEXT PRIMARY KEY,
        Asunto TEXT NOT NULL,
        Referencia TEXT NOT NULL,
        FechaCreacion DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `)
>>>>>>> Flavio

    // Crear tabla de imágenes
    await db.exec(`
      CREATE TABLE IF NOT EXISTS images (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        NumdeResolucion TEXT NOT NULL,
        ImagePath TEXT NOT NULL,
        FOREIGN KEY (NumdeResolucion) REFERENCES resolution(NumdeResolucion) ON DELETE CASCADE
      )
    `)

    // Crear tabla de usuarios
    await db.exec(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        Nombre TEXT UNIQUE NOT NULL,
        Contrasena TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `)

    console.log('✅ Tablas SQLite creadas exitosamente')
  } catch (error) {
    console.error('❌ Error al crear tablas SQLite:', error)
    throw error
  }
}

// Proxy para manejar las llamadas a la base de datos
const dbProxy = new Proxy({}, {
  get(target, prop) {
    return async function(...args) {
      if (!db) {
        await initDatabase()
      }
      return db[prop](...args)
    }
  }
})

export default dbProxy
