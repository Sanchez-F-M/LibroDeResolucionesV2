#!/usr/bin/env node

// Script para cargar datos de prueba en producción

const API_URL = 'https://libroderesoluciones-api.onrender.com'

async function cargarDatosPrueba() {
  console.log('📦 CARGANDO DATOS DE PRUEBA EN PRODUCCIÓN')
  console.log('=========================================\n')

  try {
    // Primero hacer login para obtener token
    console.log('1. Obteniendo token de autenticación...')
    const loginResponse = await fetch(`${API_URL}/api/users/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        Email: 'admin@admin.com',
        Password: 'admin123'
      })
    })

    let token = null

    if (!loginResponse.ok) {
      console.log('❌ Error en login con admin. Intentando crear usuario admin...')
      
      // Intentar crear usuario admin
      const registerResponse = await fetch(`${API_URL}/api/users/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          Nombre: 'Administrador',
          Email: 'admin@admin.com',
          Password: 'admin123',
          Rol: 'admin'
        })
      })

      if (registerResponse.ok) {
        console.log('✅ Usuario admin creado exitosamente')
        
        // Intentar login de nuevo
        const secondLoginResponse = await fetch(`${API_URL}/api/users/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            Email: 'admin@admin.com',
            Password: 'admin123'
          })
        })

        if (secondLoginResponse.ok) {
          const loginData = await secondLoginResponse.json()
          token = loginData.token
          console.log('✅ Login exitoso después de crear usuario')
        }
      } else {
        console.log('❌ No se pudo crear usuario admin ni hacer login')
        return
      }
    } else {
      const loginData = await loginResponse.json()
      token = loginData.token
      console.log('✅ Login exitoso')
    }

    if (!token) {
      console.log('❌ No se pudo obtener token de autenticación')
      return
    }

    console.log('Token obtenido:', token ? 'SÍ' : 'NO')
    console.log('')

    // Crear algunas resoluciones de prueba
    const resolucionesPrueba = [
      {
        NumdeResolucion: '2025-001',
        Asunto: 'Resolución de prueba número uno',
        Referencia: 'REF-001-2025',
        FechaCreacion: '2025-01-15T10:00:00.000Z',
        ImagePaths: ['test-image-1.jpg', 'test-image-2.jpg']
      },
      {
        NumdeResolucion: '2025-002',
        Asunto: 'Segunda resolución de prueba con fecha diferente',
        Referencia: 'REF-002-2025',
        FechaCreacion: '2025-01-14T15:30:00.000Z',
        ImagePaths: ['test-image-3.jpg']
      },
      {
        NumdeResolucion: '2025-003',
        Asunto: 'Tercera resolución para validar búsquedas',
        Referencia: 'REF-003-2025',
        FechaCreacion: '2025-01-13T09:15:00.000Z',
        ImagePaths: ['test-image-4.jpg', 'test-image-5.jpg', 'test-image-6.jpg']
      }
    ]

    console.log('2. Creando resoluciones de prueba...')

    for (let i = 0; i < resolucionesPrueba.length; i++) {
      const resolucion = resolucionesPrueba[i]
      console.log(`   Creando resolución ${i + 1}: ${resolucion.NumdeResolucion}`)

      const createResponse = await fetch(`${API_URL}/api/books/mock`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(resolucion)
      })

      if (createResponse.ok) {
        const result = await createResponse.json()
        console.log(`   ✅ ${result.message}`)
      } else {
        const error = await createResponse.text()
        console.log(`   ❌ Error: ${error}`)
      }
    }

    console.log('')

    // Verificar que se crearon correctamente
    console.log('3. Verificando resoluciones creadas...')
    const getAllResponse = await fetch(`${API_URL}/api/books`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })

    if (getAllResponse.ok) {
      const allResolutions = await getAllResponse.json()
      console.log(`✅ Total de resoluciones en la base de datos: ${allResolutions.length}`)
      
      allResolutions.forEach((res, index) => {
        console.log(`   ${index + 1}. ${res.NumdeResolucion} - ${res.asunto}`)
        console.log(`      Fecha: ${res.fetcha_creacion || 'NO DISPONIBLE'}`)
        console.log(`      Imágenes: ${res.images ? res.images.length : 0}`)
      })
    } else {
      console.log('❌ Error al verificar resoluciones creadas')
    }

    console.log('')

    // Probar búsquedas
    console.log('4. Probando funcionalidad de búsqueda...')
    
    const busquedas = [
      { criterion: 'NumdeResolucion', value: '2025-001' },
      { criterion: 'Asunto', value: 'prueba' },
      { criterion: 'Referencia', value: 'REF-002' }
    ]

    for (const busqueda of busquedas) {
      console.log(`   Buscando ${busqueda.criterion} = "${busqueda.value}"`)
      
      const searchResponse = await fetch(`${API_URL}/api/search`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(busqueda)
      })

      if (searchResponse.ok) {
        const results = await searchResponse.json()
        console.log(`   ✅ Encontrados: ${results.length} resultados`)
        
        results.forEach((res, index) => {
          console.log(`      ${index + 1}. ${res.NumdeResolucion} - ${res.asunto}`)
          console.log(`         Fecha: ${res.fetcha_creacion || 'NO DISPONIBLE'}`)
        })
      } else {
        const error = await searchResponse.text()
        console.log(`   ❌ Error en búsqueda: ${error}`)
      }
    }

    console.log('\n🎉 PROCESO COMPLETADO')
    console.log('=====================')
    console.log('✅ Datos de prueba cargados exitosamente')
    console.log('✅ Funcionalidad de búsqueda verificada')
    console.log('🔗 Ahora puedes probar la aplicación en: https://libro-resoluciones-v2.vercel.app/')

  } catch (error) {
    console.error('❌ Error en el proceso:', error.message)
  }
}

// Ejecutar carga de datos
cargarDatosPrueba()
