import sqlite3 from 'sqlite3'
import { open } from 'sqlite'
import bcrypt from 'bcrypt'
import path from 'path'
import { fileURLToPath } from 'url'
import 'dotenv/config'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Crear la base de datos en la carpeta del proyecto
const dbPath = path.join(__dirname, '../database.sqlite')

async function createAdminUser() {
  let db = null
  
  try {
    console.log('🔧 Conectando a la base de datos SQLite...')
    
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database
    })

    console.log('✅ Conexión exitosa a SQLite')

    // Credenciales del administrador
    const adminUsername = process.env.ADMIN_USERNAME || 'admin'
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123'

    console.log(`📝 Creando usuario administrador: ${adminUsername}`)

    // Verificar si el usuario ya existe
    const existingUser = await db.get(
      'SELECT ID FROM users WHERE Nombre = ?',
      [adminUsername]
    )    if (existingUser) {
      console.log('⚠️  El usuario administrador ya existe')
      console.log('✅ Sistema listo para usar')
      console.log(`👤 Usuario: ${adminUsername}`)
      console.log(`🔑 Contraseña: ${adminPassword}`)
      return
    }

    // Hashear la contraseña
    const hashedPassword = await bcrypt.hash(adminPassword, 10)

    // Insertar el usuario administrador
    const result = await db.run(
      'INSERT INTO users (Nombre, Contrasena) VALUES (?, ?)',
      [adminUsername, hashedPassword]
    )

    console.log('✅ Usuario administrador creado exitosamente')
    console.log('📋 Credenciales:')
    console.log(`   👤 Usuario: ${adminUsername}`)
    console.log(`   🔑 Contraseña: ${adminPassword}`)
    console.log('⚠️  IMPORTANTE: Cambie estas credenciales después del primer login')

    // Verificar la creación
    const createdUser = await db.get(
      'SELECT ID, Nombre, created_at FROM users WHERE ID = ?',
      [result.lastID]
    )

    if (createdUser) {
      console.log('✅ Verificación exitosa:')
      console.log(`   ID: ${createdUser.ID}`)
      console.log(`   Nombre: ${createdUser.Nombre}`)
      console.log(`   Creado: ${createdUser.created_at}`)
    }

  } catch (error) {
    console.error('❌ Error al crear usuario administrador:', error)
    
    if (error.code === 'SQLITE_CONSTRAINT_UNIQUE') {
      console.log('⚠️  El usuario ya existe en la base de datos')
    } else {
      console.error('💥 Error específico:', error.message)
    }
  } finally {
    if (db) {
      await db.close()
      console.log('🔒 Conexión a base de datos cerrada')
    }
  }
}

// Ejecutar el script
console.log('🚀 Iniciando creación de usuario administrador...')
console.log('📍 Base de datos:', dbPath)

createAdminUser()
  .then(() => {
    console.log('✨ Script completado')
    process.exit(0)
  })
  .catch((error) => {
    console.error('💥 Error fatal:', error)
    process.exit(1)
  })