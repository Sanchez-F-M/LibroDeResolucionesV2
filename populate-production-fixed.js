/**
 * Script para poblar la base de datos en producción via endpoint
 * Se ejecutará mediante llamadas HTTP al backend en Render
 */

const https = require('https')

const BASE_URL = 'https://libro-resoluciones-api.onrender.com'

const testResolutions = [
  {
    NumdeResolucion: 2025001,
    Asunto: 'Designación de Personal de Seguridad',
    Referencia: 'Expediente N° 12345/2025 - Ministerio de Seguridad',
    FechaCreacion: '2025-01-15'
  },
  {
    NumdeResolucion: 2025002,
    Asunto: 'Modificación de Horarios de Guardia',
    Referencia: 'Nota Interna N° 456/2025 - Departamento de Personal',
    FechaCreacion: '2025-01-16'
  },
  {
    NumdeResolucion: 2025003,
    Asunto: 'Adquisición de Equipamiento Policial',
    Referencia: 'Licitación Pública N° 001/2025 - Suministros',
    FechaCreacion: '2025-01-17'
  },
  {
    NumdeResolucion: 2025004,
    Asunto: 'Protocolo de Seguridad COVID-19',
    Referencia: 'Circular N° 789/2025 - Área de Salud Ocupacional',
    FechaCreacion: '2025-01-18'
  },
  {
    NumdeResolucion: 2025005,
    Asunto: 'Creación de Nueva Comisaría',
    Referencia: 'Decreto Provincial N° 123/2025 - Gobernación',
    FechaCreacion: '2025-01-19'
  }
]

// Función para hacer requests HTTP
function makeRequest(url, method, data = null) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url)
    const options = {
      hostname: urlObj.hostname,
      port: urlObj.port || 443,
      path: urlObj.pathname,
      method: method,
      headers: {
        'Content-Type': 'application/json',
      }
    }

    if (data) {
      const postData = JSON.stringify(data)
      options.headers['Content-Length'] = Buffer.byteLength(postData)
    }

    const req = https.request(options, (res) => {
      let responseData = ''
      
      res.on('data', (chunk) => {
        responseData += chunk
      })
      
      res.on('end', () => {
        try {
          const jsonData = JSON.parse(responseData)
          resolve({ status: res.statusCode, data: jsonData })
        } catch (e) {
          resolve({ status: res.statusCode, data: responseData })
        }
      })
    })

    req.on('error', (e) => {
      reject(e)
    })

    if (data) {
      req.write(JSON.stringify(data))
    }
    
    req.end()
  })
}

// Función para crear usuario admin
async function createAdminUser() {
  console.log('👤 Creando usuario admin...')
  
  try {
    const response = await makeRequest(`${BASE_URL}/api/user/register`, 'POST', {
      Nombre: 'admin',
      Contrasena: 'admin123'
    })

    if (response.status === 200 || response.status === 201) {
      console.log('✅ Usuario admin creado exitosamente')
      return true
    } else if (response.status === 409) {
      console.log('ℹ️ Usuario admin ya existe')
      return true
    } else {
      console.log('⚠️ Respuesta al crear usuario:', response)
      return true // Continuar de todas formas
    }
  } catch (error) {
    console.log('⚠️ Error al crear usuario (continuando):', error.message)
    return true // Continuar de todas formas
  }
}

// Función para obtener token
async function getAuthToken() {
  console.log('🔐 Obteniendo token de autenticación...')
  
  try {
    const response = await makeRequest(`${BASE_URL}/api/user/login`, 'POST', {
      Nombre: 'admin',
      Contrasena: 'admin123'
    })

    if (response.status === 200 && response.data.token) {
      console.log('✅ Token obtenido exitosamente')
      return response.data.token
    } else {
      throw new Error(`Error en login: ${JSON.stringify(response.data)}`)
    }
  } catch (error) {
    throw new Error(`Error en login: ${error.message}`)
  }
}

// Función para crear resolución
async function createResolution(resolution, token) {
  console.log(`📄 Creando resolución: ${resolution.NumdeResolucion}`)
  
  try {
    const response = await makeRequest(`${BASE_URL}/api/books`, 'POST', resolution)

    if (response.status === 200 || response.status === 201) {
      console.log(`✅ Resolución ${resolution.NumdeResolucion} creada`)
      return true
    } else {
      console.log(`⚠️ Error al crear resolución ${resolution.NumdeResolucion}:`, response)
      return false
    }
  } catch (error) {
    console.log(`❌ Error al crear resolución ${resolution.NumdeResolucion}:`, error.message)
    return false
  }
}

// Función principal
async function populateDatabase() {
  console.log('🚀 Iniciando población de base de datos en producción...')
  console.log('🌐 Backend URL:', BASE_URL)
  console.log('')

  try {
    // 1. Crear usuario admin si no existe
    await createAdminUser()

    // 2. Obtener token
    const token = await getAuthToken()

    // 3. Crear resoluciones
    console.log('')
    console.log('📋 Creando resoluciones de prueba...')
    console.log('-'.repeat(50))

    let successCount = 0
    
    for (const resolution of testResolutions) {
      const success = await createResolution(resolution, token)
      if (success) successCount++
      
      // Pausa pequeña entre requests
      await new Promise(resolve => setTimeout(resolve, 500))
    }

    console.log('')
    console.log('📊 RESUMEN:')
    console.log(`✅ Resoluciones creadas: ${successCount}/${testResolutions.length}`)
    console.log('')
    console.log('🎉 ¡Población de base de datos completada!')
    console.log('')
    console.log('🔗 Verificar en: https://libro-de-resoluciones-v2.vercel.app')
    console.log('🔑 Login: admin / admin123')

  } catch (error) {
    console.error('❌ Error fatal:', error)
    process.exit(1)
  }
}

// Ejecutar script
populateDatabase()
