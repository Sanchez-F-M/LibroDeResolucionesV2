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

async function createTables () {
  try {
    // Crear tabla de resoluciones
    await db.exec(`
      CREATE TABLE IF NOT EXISTS resolution (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        NumdeResolucion TEXT UNIQUE NOT NULL,
        Asunto TEXT NOT NULL,
        Referencia TEXT,
        FechaCreacion DATETIME,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `)

    // Crear índices para optimizar consultas
    await db.exec(`
      CREATE INDEX IF NOT EXISTS idx_resolution_numero ON resolution(NumdeResolucion);
      CREATE INDEX IF NOT EXISTS idx_resolution_fecha ON resolution(FechaCreacion);
      CREATE INDEX IF NOT EXISTS idx_resolution_asunto ON resolution(Asunto);
    `)

    // Crear tabla de imágenes
    await db.exec(`
      CREATE TABLE IF NOT EXISTS images (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        NumdeResolucion TEXT NOT NULL,
        ImagePath TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (NumdeResolucion) REFERENCES resolution(NumdeResolucion) ON DELETE CASCADE
      )
    `)

    // Crear índice para imágenes
    await db.exec(`
      CREATE INDEX IF NOT EXISTS idx_images_resolucion ON images(NumdeResolucion);
    `)

    // Crear tabla de usuarios
    await db.exec(`
      CREATE TABLE IF NOT EXISTS users (
        ID INTEGER PRIMARY KEY AUTOINCREMENT,
        Nombre TEXT UNIQUE NOT NULL,
        Contrasena TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `)

    // Crear índice para usuarios
    await db.exec(`
      CREATE INDEX IF NOT EXISTS idx_users_nombre ON users(Nombre);
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
