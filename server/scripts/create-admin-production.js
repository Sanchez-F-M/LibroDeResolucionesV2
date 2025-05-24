const BACKEND_URL = 'https://libro-resoluciones-api.onrender.com'

async function createAdminViaAPI() {
  try {
    console.log('🌐 Creando usuario administrador vía API en producción...')
    console.log(`📍 Backend: ${BACKEND_URL}`)

    // Credenciales del administrador
    const adminData = {
      Nombre: process.env.ADMIN_USERNAME || 'admin',
      Contrasena: process.env.ADMIN_PASSWORD || 'admin123'
    }

    console.log(`👤 Usuario: ${adminData.Nombre}`)

    // Hacer petición POST al endpoint de registro
    const response = await fetch(`${BACKEND_URL}/api/user/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(adminData)
    })

    const result = await response.text()
    
    console.log(`📊 Status: ${response.status}`)
    console.log(`📝 Response: ${result}`)

    if (response.ok) {
      console.log('✅ Usuario administrador creado exitosamente en producción')
      console.log('📋 Credenciales para login:')
      console.log(`   👤 Usuario: ${adminData.Nombre}`)
      console.log(`   🔑 Contraseña: ${adminData.Contrasena}`)
    } else {
      try {
        const errorData = JSON.parse(result)
        if (errorData.error && errorData.error.includes('ya existe')) {
          console.log('⚠️  El usuario administrador ya existe en producción')
          console.log('📋 Credenciales existentes:')
          console.log(`   👤 Usuario: ${adminData.Nombre}`)
          console.log(`   🔑 Contraseña: ${adminData.Contrasena}`)
        } else {
          console.error('❌ Error al crear usuario:', errorData)
        }
      } catch {
        console.error('❌ Error en respuesta:', result)
      }
    }

  } catch (error) {
    console.error('💥 Error de conexión:', error.message)
    
    if (error.message.includes('fetch')) {
      console.log('🔧 Posibles soluciones:')
      console.log('   1. Verificar que el backend esté funcionando')
      console.log('   2. Verificar la URL del backend')
      console.log('   3. Verificar conectividad a internet')
    }
  }
}

// Verificar versión de Node.js para fetch nativo
const nodeVersion = process.version
const majorVersion = parseInt(nodeVersion.slice(1).split('.')[0])

if (majorVersion < 18) {
  console.error('❌ Este script requiere Node.js 18+ para fetch nativo')
  console.log('📦 Versión actual:', nodeVersion)
  console.log('🔧 Actualice Node.js o use: npm install node-fetch')
  process.exit(1)
}

// Mostrar ayuda
if (process.argv.includes('--help') || process.argv.includes('-h')) {
  console.log(`
🌐 Script de creación de usuario administrador en producción

📝 Uso:
   npm run create-admin-production
   node scripts/create-admin-production.js

🔧 Variables de entorno:
   ADMIN_USERNAME - Nombre de usuario (default: admin)
   ADMIN_PASSWORD - Contraseña (default: admin123)

📋 Ejemplo:
   ADMIN_USERNAME=policia ADMIN_PASSWORD=password123 npm run create-admin-production

`)
  process.exit(0)
}

// Ejecutar el script
console.log('🚀 Iniciando creación de usuario administrador en producción...')

createAdminViaAPI()
  .then(() => {
    console.log('✨ Script completado')
    process.exit(0)
  })
  .catch((error) => {
    console.error('💥 Error fatal:', error)
    process.exit(1)
  })
