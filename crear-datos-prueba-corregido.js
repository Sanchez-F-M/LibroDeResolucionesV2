#!/usr/bin/env node

// Script para crear datos de prueba usando las rutas correctas

const API_URL = 'https://libroderesoluciones-api.onrender.com'

async function crearDatosPrueba() {
  console.log('📦 CREANDO DATOS DE PRUEBA CON RUTAS CORRECTAS')
  console.log('===============================================\n')

  try {
    // Crear usuario admin si no existe
    console.log('1. Creando usuario admin...')
    const registerResponse = await fetch(`${API_URL}/api/user/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        Nombre: 'AdminTest',
        Contrasena: 'admin123',
        Rol: 'admin'
      })
    })

    if (registerResponse.ok) {
      const registerData = await registerResponse.json()
      console.log('✅ Usuario admin creado:', registerData.message)
    } else if (registerResponse.status === 400) {
      console.log('ℹ️  Usuario admin ya existe')
    } else {
      console.log('❌ Error creando usuario admin')
      return
    }

    // Hacer login
    console.log('\n2. Haciendo login...')
    const loginResponse = await fetch(`${API_URL}/api/user/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        Nombre: 'AdminTest',
        Contrasena: 'admin123'
      })
    })

    if (!loginResponse.ok) {
      console.log('❌ Error en login')
      return
    }

    const loginData = await loginResponse.json()
    const token = loginData.token
    console.log('✅ Login exitoso')

    // Crear resoluciones de prueba usando el endpoint mock
    console.log('\n3. Creando resoluciones de prueba...')
    
    const resoluciones = [
      {
        NumdeResolucion: '2025-001',
        Asunto: 'Primera resolución con fecha para probar búsquedas',
        Referencia: 'REF-001-2025',
        FechaCreacion: '2025-06-17T10:00:00.000Z',
        ImagePaths: ['test-image-1.jpg', 'test-image-2.jpg']
      },
      {
        NumdeResolucion: '2025-002',
        Asunto: 'Segunda resolución con tema diferente',
        Referencia: 'REF-002-2025',
        FechaCreacion: '2025-06-16T15:30:00.000Z',
        ImagePaths: ['test-image-3.jpg']
      },
      {
        NumdeResolucion: '2025-003',
        Asunto: 'Tercera resolución para validar fechas en búsqueda',
        Referencia: 'REF-003-2025',
        FechaCreacion: '2025-06-15T09:15:00.000Z',
        ImagePaths: ['test-image-4.jpg', 'test-image-5.jpg']
      }
    ]

    for (let i = 0; i < resoluciones.length; i++) {
      const resolucion = resoluciones[i]
      console.log(`   Creando ${resolucion.NumdeResolucion}...`)

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

    // Verificar que las rutas funcionen correctamente
    console.log('\n4. Verificando rutas...')
    
    // Probar /api/books/all (la ruta que sabemos que existe)
    console.log('   Probando GET /api/books/all...')
    const allBooksResponse = await fetch(`${API_URL}/api/books/all`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
    
    console.log(`   Status: ${allBooksResponse.status}`)
    if (allBooksResponse.ok) {
      const allBooks = await allBooksResponse.json()
      console.log(`   ✅ Resoluciones encontradas: ${allBooks.length}`)
      
      if (allBooks.length > 0) {
        console.log('\n   Estructura del primer resultado:')
        console.log('   Campos disponibles:', Object.keys(allBooks[0]))
        console.log('   Fecha:', allBooks[0].fetcha_creacion || 'NO DISPONIBLE')
        console.log('   NumdeResolucion:', allBooks[0].NumdeResolucion)
        console.log('   Asunto:', allBooks[0].asunto)
      }
    }

    // Probar /api/books (la ruta que agregamos)
    console.log('\n   Probando GET /api/books...')
    const booksResponse = await fetch(`${API_URL}/api/books`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
    
    console.log(`   Status: ${booksResponse.status}`)
    if (booksResponse.ok) {
      const books = await booksResponse.json()
      console.log(`   ✅ Ruta /api/books funciona: ${books.length} resoluciones`)
    } else {
      console.log('   ❌ Ruta /api/books aún no funciona')
    }

    // Probar búsqueda
    console.log('\n5. Probando búsqueda...')
    const searchResponse = await fetch(`${API_URL}/api/search`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        criterion: 'Asunto',
        value: 'resolución'
      })
    })

    console.log(`   Status búsqueda: ${searchResponse.status}`)
    if (searchResponse.ok) {
      const searchResults = await searchResponse.json()
      console.log(`   ✅ Búsqueda exitosa: ${searchResults.length} resultados`)
      
      if (searchResults.length > 0) {
        console.log('\n   Estructura del primer resultado de búsqueda:')
        console.log('   Campos disponibles:', Object.keys(searchResults[0]))
        console.log('   Fecha:', searchResults[0].fetcha_creacion || 'NO DISPONIBLE')
        console.log('   NumdeResolucion:', searchResults[0].NumdeResolucion)
        console.log('   Asunto:', searchResults[0].asunto)
      }
    } else {
      const searchError = await searchResponse.text()
      console.log(`   ❌ Error en búsqueda: ${searchError}`)
    }

    console.log('\n🎉 PROCESO COMPLETADO')
    console.log('====================')
    console.log('✅ Datos de prueba creados')
    console.log('✅ Rutas verificadas')
    console.log('🔗 Ahora puedes probar la aplicación en: https://libro-resoluciones-v2.vercel.app/')

  } catch (error) {
    console.error('❌ Error:', error.message)
  }
}

// Ejecutar creación de datos
crearDatosPrueba()
