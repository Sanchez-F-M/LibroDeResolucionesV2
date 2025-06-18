#!/usr/bin/env node

// Script para probar las rutas correctas del backend

const API_URL = 'https://libroderesoluciones-api.onrender.com'

async function probarRutasCorrectas() {
  console.log('🔍 PROBANDO RUTAS CORRECTAS DEL BACKEND')
  console.log('======================================\n')

  try {
    // Verificar endpoint de salud
    console.log('1. Verificando endpoint de salud...')
    const healthResponse = await fetch(`${API_URL}/health`)
    console.log(`✅ Health check: ${healthResponse.status}`)

    // Probar rutas correctas
    console.log('\n2. Probando rutas de API...')
    
    // Las rutas correctas según routes.js son:
    // /api/user (no /api/users)
    // /api/books
    // /api/search
    // /api/cloudinary

    const rutasPrueba = [
      { url: '/api/user/register', method: 'POST', body: {} },
      { url: '/api/user/login', method: 'POST', body: {} },
      { url: '/api/books', method: 'GET' },
      { url: '/api/search', method: 'POST', body: {} },
      { url: '/api/cloudinary/upload', method: 'POST' }
    ]

    for (const ruta of rutasPrueba) {
      console.log(`   Probando ${ruta.method} ${ruta.url}...`)
      
      try {
        const options = {
          method: ruta.method,
          headers: { 'Content-Type': 'application/json' }
        }

        if (ruta.method === 'POST' && ruta.body) {
          options.body = JSON.stringify(ruta.body)
        }

        const response = await fetch(`${API_URL}${ruta.url}`, options)
        console.log(`   Status: ${response.status} (${response.statusText})`)
        
        // No es 404 significa que la ruta existe
        if (response.status !== 404) {
          console.log(`   ✅ Ruta encontrada: ${ruta.url}`)
        } else {
          console.log(`   ❌ Ruta no encontrada: ${ruta.url}`)
        }
      } catch (error) {
        console.log(`   ❌ Error: ${error.message}`)
      }
    }

    console.log('\n3. Intentando crear usuario de prueba...')
      // Crear usuario de prueba
    const registerResponse = await fetch(`${API_URL}/api/user/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        Nombre: 'UsuarioTest',
        Contrasena: 'test123',
        Rol: 'admin'
      })
    })

    console.log(`Registro: ${registerResponse.status}`)
    
    if (registerResponse.ok) {
      const registerData = await registerResponse.json()
      console.log('✅ Usuario creado:', registerData.message || 'Éxito')
    } else {
      const registerError = await registerResponse.text()
      console.log('Detalles del error:', registerError)
    }

    console.log('\n4. Intentando hacer login...')
      // Hacer login
    const loginResponse = await fetch(`${API_URL}/api/user/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        Nombre: 'UsuarioTest',
        Contrasena: 'test123'
      })
    })

    console.log(`Login: ${loginResponse.status}`)
    
    if (loginResponse.ok) {
      const loginData = await loginResponse.json()
      console.log('✅ Login exitoso')
      
      const token = loginData.token
      console.log('Token obtenido:', token ? 'SÍ' : 'NO')

      if (token) {
        console.log('\n5. Probando endpoints protegidos...')
        
        // Probar getAllBooks
        const booksResponse = await fetch(`${API_URL}/api/books`, {
          headers: { 'Authorization': `Bearer ${token}` }
        })
        
        console.log(`GET /api/books: ${booksResponse.status}`)
        
        if (booksResponse.ok) {
          const booksData = await booksResponse.json()
          console.log(`✅ Libros obtenidos: ${booksData.length} encontrados`)
          
          // Mostrar estructura del primer libro si existe
          if (booksData.length > 0) {
            console.log('\nEstructura del primer resultado:')
            console.log(JSON.stringify(booksData[0], null, 2))
          }
        }

        // Probar búsqueda
        const searchResponse = await fetch(`${API_URL}/api/search`, {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` 
          },
          body: JSON.stringify({
            criterion: 'Asunto',
            value: 'test'
          })
        })
        
        console.log(`POST /api/search: ${searchResponse.status}`)
        
        if (searchResponse.ok) {
          const searchData = await searchResponse.json()
          console.log(`✅ Búsqueda exitosa: ${searchData.length} resultados`)
          
          // Mostrar estructura del primer resultado de búsqueda si existe
          if (searchData.length > 0) {
            console.log('\nEstructura del primer resultado de búsqueda:')
            console.log(JSON.stringify(searchData[0], null, 2))
          }
        } else {
          const searchError = await searchResponse.text()
          console.log(`❌ Error en búsqueda: ${searchError}`)
        }
      }
    } else {
      const loginError = await loginResponse.text()
      console.log('Detalles del error de login:', loginError)
    }

  } catch (error) {
    console.error('❌ Error en pruebas:', error.message)
  }
}

// Ejecutar pruebas
probarRutasCorrectas()
