console.log('🚀 Verificando usuario administrador...')

// Usar curl para hacer las peticiones
import { exec } from 'child_process'
import { promisify } from 'util'

const execAsync = promisify(exec)

async function testLogin() {
  try {
    console.log('🔐 Probando login del usuario administrador...')
    
    const loginCommand = `curl -s -X POST "https://libro-resoluciones-api.onrender.com/api/user/login" -H "Content-Type: application/json" -d "{\\"Nombre\\":\\"admin\\",\\"Contrasena\\":\\"admin123\\"}"`
    
    const { stdout, stderr } = await execAsync(loginCommand)
    
    if (stderr) {
      console.error('❌ Error en curl:', stderr)
      return
    }
    
    console.log('📝 Respuesta del login:')
    console.log(stdout)
    
    try {
      const response = JSON.parse(stdout)
      if (response.token) {
        console.log('✅ Login exitoso! Token generado')
        console.log(`👤 Usuario: ${response.user.Nombre}`)
      } else if (response.error) {
        console.log('❌ Error en login:', response.error)
      }
    } catch {
      console.log('📄 Respuesta no es JSON válido')
    }
    
  } catch (error) {
    console.error('💥 Error:', error.message)
  }
}

async function testGetUsers() {
  try {
    console.log('\n👥 Obteniendo lista de usuarios...')
    
    const usersCommand = `curl -s -X GET "https://libro-resoluciones-api.onrender.com/api/user/profile" -H "Accept: application/json"`
    
    const { stdout, stderr } = await execAsync(usersCommand)
    
    if (stderr) {
      console.error('❌ Error en curl:', stderr)
      return
    }
    
    console.log('📝 Lista de usuarios:')
    console.log(stdout)
    
    try {
      const users = JSON.parse(stdout)
      console.log(`✅ Total de usuarios: ${users.length}`)
      users.forEach((user, index) => {
        console.log(`   ${index + 1}. ID: ${user.ID}, Nombre: ${user.Nombre}`)
      })
    } catch {
      console.log('📄 Respuesta no es JSON válido')
    }
    
  } catch (error) {
    console.error('💥 Error:', error.message)
  }
}

// Ejecutar pruebas
testLogin()
  .then(() => testGetUsers())
  .then(() => {
    console.log('\n✨ Verificación completada')
  })
  .catch(error => {
    console.error('💥 Error fatal:', error)
  })
