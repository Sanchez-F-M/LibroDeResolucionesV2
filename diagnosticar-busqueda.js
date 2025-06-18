#!/usr/bin/env node

// Script para diagnosticar la respuesta del backend en búsquedas

const API_URL = 'https://libroderesoluciones-api.onrender.com'

async function diagnosticarBusqueda() {
  console.log('🔍 DIAGNÓSTICO DE BÚSQUEDA - Backend')
  console.log('===================================\n')

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

    if (!loginResponse.ok) {
      console.log('❌ Error en login:', loginResponse.status, loginResponse.statusText)
      return
    }

    const loginData = await loginResponse.json()
    const token = loginData.token

    console.log('✅ Login exitoso')
    console.log('Token:', token ? 'Obtenido' : 'No obtenido')
    console.log('')

    // Probar búsqueda por diferentes criterios
    const criterios = [
      { criterion: 'NumdeResolucion', value: '001' },
      { criterion: 'Asunto', value: 'test' },
      { criterion: 'Referencia', value: 'ref' }
    ]

    for (const criterio of criterios) {
      console.log(`2. Probando búsqueda por ${criterio.criterion} = "${criterio.value}"...`)
      
      const searchResponse = await fetch(`${API_URL}/api/search`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(criterio)
      })

      console.log(`Status: ${searchResponse.status} ${searchResponse.statusText}`)
      
      if (searchResponse.ok) {
        const searchData = await searchResponse.json()
        console.log('✅ Respuesta exitosa:')
        console.log('Cantidad de resultados:', searchData.length)
        
        if (searchData.length > 0) {
          console.log('Primer resultado:')
          console.log(JSON.stringify(searchData[0], null, 2))
          
          // Verificar campos específicos
          const primerResultado = searchData[0]
          console.log('\n📊 Análisis de campos:')
          console.log('- NumdeResolucion:', primerResultado.NumdeResolucion || 'NO PRESENTE')
          console.log('- Asunto:', primerResultado.Asunto || 'NO PRESENTE')
          console.log('- Referencia:', primerResultado.Referencia || 'NO PRESENTE')
          console.log('- FechaCreacion:', primerResultado.FechaCreacion || 'NO PRESENTE')
          console.log('- fetcha_creacion:', primerResultado.fetcha_creacion || 'NO PRESENTE')
          console.log('- images:', primerResultado.images ? 'PRESENTE' : 'NO PRESENTE')
        }
      } else {
        const errorData = await searchResponse.text()
        console.log('❌ Error en búsqueda:', errorData)
      }
      
      console.log('\n---\n')
    }

    // Comparar con getAllBooks
    console.log('3. Comparando con getAllBooks...')
    const allBooksResponse = await fetch(`${API_URL}/api/books`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })

    if (allBooksResponse.ok) {
      const allBooksData = await allBooksResponse.json()
      console.log('✅ getAllBooks exitoso:')
      console.log('Cantidad de resoluciones:', allBooksData.length)
      
      if (allBooksData.length > 0) {
        console.log('Primera resolución:')
        console.log(JSON.stringify(allBooksData[0], null, 2))
        
        // Verificar campos específicos
        const primerResultado = allBooksData[0]
        console.log('\n📊 Análisis de campos (getAllBooks):')
        console.log('- NumdeResolucion:', primerResultado.NumdeResolucion || 'NO PRESENTE')
        console.log('- asunto:', primerResultado.asunto || 'NO PRESENTE')
        console.log('- referencia:', primerResultado.referencia || 'NO PRESENTE')
        console.log('- fetcha_creacion:', primerResultado.fetcha_creacion || 'NO PRESENTE')
        console.log('- images:', primerResultado.images ? `PRESENTE (${primerResultado.images.length})` : 'NO PRESENTE')
      }
    } else {
      console.log('❌ Error en getAllBooks:', allBooksResponse.status)
    }

  } catch (error) {
    console.error('❌ Error en diagnóstico:', error.message)
  }
}

// Ejecutar diagnóstico
diagnosticarBusqueda()
