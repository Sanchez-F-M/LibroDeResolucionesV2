#!/usr/bin/env node

// Script para probar búsqueda específica que coincida con los datos reales

const API_URL = 'https://libroderesoluciones-api.onrender.com'

async function probarBusquedaEspecifica() {
  console.log('🔍 PROBANDO BÚSQUEDA ESPECÍFICA')
  console.log('==============================\n')

  try {
    // Login
    console.log('1. Haciendo login...')
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

    // Obtener todos los datos primero para ver qué buscar
    console.log('\n2. Obteniendo todas las resoluciones...')
    const allResponse = await fetch(`${API_URL}/api/books/all`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })

    if (allResponse.ok) {
      const allData = await allResponse.json()
      console.log(`✅ Total resoluciones: ${allData.length}`)
      
      if (allData.length > 0) {
        const primera = allData[0]
        console.log('\nPrimera resolución encontrada:')
        console.log(`   NumdeResolucion: ${primera.NumdeResolucion}`)
        console.log(`   Asunto: ${primera.asunto}`)
        console.log(`   Referencia: ${primera.referencia}`) 
        console.log(`   Fecha: ${primera.fetcha_creacion}`)
        
        // Probar búsqueda específica
        console.log('\n3. Probando búsqueda específica...')
        
        const criterioBusqueda = [
          { criterion: 'NumdeResolucion', value: primera.NumdeResolucion },
          { criterion: 'Asunto', value: primera.asunto },
          { criterion: 'Referencia', value: 'test' }  // parte de la referencia
        ]

        for (const busqueda of criterioBusqueda) {
          console.log(`\n   Buscando ${busqueda.criterion} = "${busqueda.value}"`)
          
          const searchResponse = await fetch(`${API_URL}/api/search`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(busqueda)
          })

          console.log(`   Status: ${searchResponse.status}`)
          
          if (searchResponse.ok) {
            const searchResults = await searchResponse.json()
            console.log(`   ✅ Resultados encontrados: ${searchResults.length}`)
            
            if (searchResults.length > 0) {
              const resultado = searchResults[0]
              console.log('\n   Estructura del resultado:')
              console.log('   Campos disponibles:', Object.keys(resultado))
              console.log(`   NumdeResolucion: ${resultado.NumdeResolucion}`)
              console.log(`   asunto: ${resultado.asunto}`)
              console.log(`   referencia: ${resultado.referencia}`)
              console.log(`   fetcha_creacion: ${resultado.fetcha_creacion}`)
              
              // Simular formateo de fecha como lo haría el frontend
              if (resultado.fetcha_creacion) {
                const fecha = new Date(resultado.fetcha_creacion)
                const fechaFormateada = fecha.toLocaleDateString('es-ES', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric'
                })
                console.log(`   📅 Fecha formateada para frontend: ${fechaFormateada}`)
                console.log('   ✅ Esta fecha SÍ se mostraría correctamente en el frontend')
              } else {
                console.log('   ❌ No hay fecha disponible')
              }
            }
          } else {
            const error = await searchResponse.text()
            console.log(`   ❌ Error: ${error}`)
          }
        }
      }
    }

    console.log('\n🎯 RESUMEN')
    console.log('==========')
    console.log('Si las búsquedas funcionan correctamente, el problema de "Fecha no disponible"')
    console.log('podría ser un problema de caché del frontend o configuración incorrecta.')
    console.log('')
    console.log('📝 Próximos pasos:')
    console.log('1. Verificar que el frontend use las rutas correctas')
    console.log('2. Limpiar caché del navegador')
    console.log('3. Verificar configuración de API_URL en el frontend')

  } catch (error) {
    console.error('❌ Error:', error.message)
  }
}

// Ejecutar prueba
probarBusquedaEspecifica()
