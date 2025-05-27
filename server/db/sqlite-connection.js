import sqlite3 from 'sqlite3'
import { open } from 'sqlite'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Crear la base de datos en la carpeta del proyecto
const dbPath = path.join(__dirname, '../database.sqlite')

let db = null

async function initDatabase() {
  if (db) return db
  
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database
    })

    console.log('✅ Conexión a SQLite exitosa')
    
    // Crear tablas
    await createTables()
    
    return db
  } catch (error) {
    console.error('❌ Error al conectar a SQLite:', error)
    throw error
  }
}

async function createTables() {
  try {
    // Tabla de usuarios
    await db.exec(`
      CREATE TABLE IF NOT EXISTS users (
        ID INTEGER PRIMARY KEY AUTOINCREMENT,
        Nombre TEXT UNIQUE NOT NULL,
        Contrasena TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `)

    // Tabla de resoluciones
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

    // Tabla de imágenes
    await db.exec(`
      CREATE TABLE IF NOT EXISTS images (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        NumdeResolucion TEXT NOT NULL,
        ImagePath TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (NumdeResolucion) REFERENCES resolution (NumdeResolucion) ON DELETE CASCADE
      )
    `)

    // Crear índices para mejorar rendimiento
    await db.exec(`
      CREATE INDEX IF NOT EXISTS idx_resolution_numero ON resolution (NumdeResolucion);
      CREATE INDEX IF NOT EXISTS idx_resolution_asunto ON resolution (Asunto);
      CREATE INDEX IF NOT EXISTS idx_resolution_fecha ON resolution (FechaCreacion);
      CREATE INDEX IF NOT EXISTS idx_users_nombre ON users (Nombre);
      CREATE INDEX IF NOT EXISTS idx_images_resolucion ON images (NumdeResolucion);
    `)

    console.log('✅ Tablas SQLite creadas exitosamente')
  } catch (error) {
    console.error('❌ Error al crear tablas SQLite:', error)
    throw error
  }
}

// Inicializar la base de datos
const database = await initDatabase()

export default database
