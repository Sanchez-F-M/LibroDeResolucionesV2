const BACKEND_URL = 'https://libro-resoluciones-api.onrender.com'

async function verifyAdminLogin() {
  try {
    console.log('🔐 Verificando login del usuario administrador...')
    console.log(`📍 Backend: ${BACKEND_URL}`)

    // Credenciales del administrador
    const loginData = {
      Nombre: 'admin',
      Contrasena: 'admin123'
    }

    console.log(`👤 Intentando login con usuario: ${loginData.Nombre}`)

    // Hacer petición POST al endpoint de login
    const response = await fetch(`${BACKEND_URL}/api/user/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(loginData)
    })

    const result = await response.text()
    
    console.log(`📊 Status: ${response.status}`)
    console.log(`📝 Response: ${result}`)

    if (response.ok) {
      try {
        const loginResponse = JSON.parse(result)
        console.log('✅ Login exitoso!')
        
        if (loginResponse.token) {
          console.log('🎟️  Token JWT generado correctamente')
          console.log(`🔑 Token: ${loginResponse.token.substring(0, 50)}...`)
        }
        
        if (loginResponse.user) {
          console.log(`👤 Usuario logueado: ${loginResponse.user.Nombre}`)
          console.log(`🆔 ID de usuario: ${loginResponse.user.ID}`)
        }
        
        console.log('✅ Sistema de autenticación funcionando correctamente')
        
      } catch {
        console.log('✅ Login exitoso (respuesta no JSON)')
      }
    } else {
      try {
        const errorData = JSON.parse(result)
        console.error('❌ Error en login:', errorData)
      } catch {
        console.error('❌ Error en login:', result)
      }
    }

    // Verificar también el endpoint de usuarios
    console.log('\n📋 Verificando lista de usuarios...')
    const usersResponse = await fetch(`${BACKEND_URL}/api/user/profile`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      }
    })

    const usersResult = await usersResponse.text()
    console.log(`📊 Status usuarios: ${usersResponse.status}`)
    
    if (usersResponse.ok) {
      try {
        const users = JSON.parse(usersResult)
        console.log(`👥 Total de usuarios registrados: ${users.length}`)
        
        if (users.length > 0) {
          users.forEach((user, index) => {
            console.log(`   ${index + 1}. ID: ${user.ID}, Nombre: ${user.Nombre}`)
          })
        }
      } catch {
        console.log('📝 Respuesta usuarios:', usersResult)
      }
    }

  } catch (error) {
    console.error('💥 Error de conexión:', error.message)
  }
}

// Verificar versión de Node.js para fetch nativo
const nodeVersion = process.version
const majorVersion = parseInt(nodeVersion.slice(1).split('.')[0])

if (majorVersion < 18) {
  console.error('❌ Este script requiere Node.js 18+ para fetch nativo')
  console.log('📦 Versión actual:', nodeVersion)
  process.exit(1)
}

// Ejecutar verificación
console.log('🚀 Iniciando verificación de usuario administrador...')

verifyAdminLogin()
  .then(() => {
    console.log('\n✨ Verificación completada')
    process.exit(0)
  })
  .catch((error) => {
    console.error('💥 Error fatal:', error)
    process.exit(1)
  })
