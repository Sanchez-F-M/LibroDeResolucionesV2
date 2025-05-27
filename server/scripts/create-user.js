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

async function createCustomUser() {
  let db = null
  
  try {
    console.log('🔧 Conectando a la base de datos SQLite...')
    
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database
    })

    console.log('✅ Conexión exitosa a SQLite')

    // Obtener credenciales de argumentos de línea de comandos o variables de entorno
    const args = process.argv.slice(2)
    const username = args[0] || process.env.ADMIN_USERNAME || 'admin'
    const password = args[1] || process.env.ADMIN_PASSWORD || 'admin123'

    console.log(`📝 Creando usuario: ${username}`)

    // Verificar si el usuario ya existe
    const existingUser = await db.get(
      'SELECT ID FROM users WHERE Nombre = ?',
      [username]
    )

    if (existingUser) {
      console.log('⚠️  El usuario ya existe')
      console.log('❓ ¿Desea actualizar la contraseña? (s/n)')
      
      // En un entorno automatizado, podemos forzar la actualización
      if (process.env.FORCE_UPDATE === 'true') {
        console.log('🔄 Actualizando contraseña...')
        
        const hashedPassword = await bcrypt.hash(password, 10)
        
        await db.run(
          'UPDATE users SET Contrasena = ? WHERE Nombre = ?',
          [hashedPassword, username]
        )
        
        console.log('✅ Contraseña actualizada exitosamente')
        console.log(`👤 Usuario: ${username}`)
        console.log(`🔑 Nueva contraseña: ${password}`)
        
        return
      } else {
        console.log('💡 Para actualizar, use la variable FORCE_UPDATE=true')
        return
      }
    }

    // Hashear la contraseña
    const hashedPassword = await bcrypt.hash(password, 10)

    // Insertar el nuevo usuario
    const result = await db.run(
      'INSERT INTO users (Nombre, Contrasena) VALUES (?, ?)',
      [username, hashedPassword]
    )

    console.log('✅ Usuario creado exitosamente')
    console.log('📋 Credenciales:')
    console.log(`   👤 Usuario: ${username}`)
    console.log(`   🔑 Contraseña: ${password}`)
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

    // Mostrar total de usuarios
    const userCount = await db.get('SELECT COUNT(*) as count FROM users')
    console.log(`👥 Total de usuarios en el sistema: ${userCount.count}`)

  } catch (error) {
    console.error('❌ Error al crear usuario:', error)
    
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

// Mostrar ayuda
if (process.argv.includes('--help') || process.argv.includes('-h')) {
  console.log(`
🔧 Script de creación de usuarios

📝 Uso:
   npm run create-user [username] [password]
   node scripts/create-user.js [username] [password]

🔧 Variables de entorno:
   ADMIN_USERNAME - Nombre de usuario (default: admin)
   ADMIN_PASSWORD - Contraseña (default: admin123)
   FORCE_UPDATE   - Actualizar contraseña si usuario existe (true/false)

📋 Ejemplos:
   npm run create-user                          # Crear admin/admin123
   npm run create-user policia password123     # Crear usuario personalizado
   FORCE_UPDATE=true npm run create-user admin nuevapass  # Actualizar contraseña

`)
  process.exit(0)
}

// Ejecutar el script
console.log('🚀 Iniciando creación de usuario...')
console.log('📍 Base de datos:', dbPath)

createCustomUser()
  .then(() => {
    console.log('✨ Script completado')
    process.exit(0)
  })
  .catch((error) => {
    console.error('💥 Error fatal:', error)
    process.exit(1)
  })
