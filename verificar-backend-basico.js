#!/usr/bin/env node

// Script básico para verificar conexión al backend

const API_URL = 'https://libroderesoluciones-api.onrender.com'

async function verificarBackend() {
  console.log('🔍 VERIFICACIÓN BÁSICA DEL BACKEND')
  console.log('==================================\n')

  try {
    // Verificar endpoint de salud
    console.log('1. Verificando endpoint de salud...')
    const healthResponse = await fetch(`${API_URL}/health`)
    console.log(`Status: ${healthResponse.status}`)
    
    if (healthResponse.ok) {
      const healthText = await healthResponse.text()
      console.log(`✅ Backend respondiendo: ${healthText}`)
    } else {
      console.log('❌ Backend no responde correctamente')
    }

    // Verificar ruta raíz
    console.log('\n2. Verificando ruta raíz...')
    const rootResponse = await fetch(`${API_URL}/`)
    console.log(`Status: ${rootResponse.status}`)
    
    if (rootResponse.ok) {
      const rootText = await rootResponse.text()
      console.log(`Respuesta: ${rootText}`)
    }

    // Verificar estructura de rutas
    console.log('\n3. Verificando rutas de API...')
    const routes = [
      '/api/users/register',
      '/api/users/login',
      '/api/books',
      '/api/search'
    ]

    for (const route of routes) {
      console.log(`   Probando ${route}...`)
      try {
        const routeResponse = await fetch(`${API_URL}${route}`, {
          method: route.includes('register') || route.includes('login') || route.includes('search') ? 'POST' : 'GET',
          headers: { 'Content-Type': 'application/json' },
          body: route.includes('register') || route.includes('login') || route.includes('search') ? '{}' : undefined
        })
        console.log(`   Status: ${routeResponse.status}`)
      } catch (error) {
        console.log(`   ❌ Error: ${error.message}`)
      }
    }

  } catch (error) {
    console.error('❌ Error en verificación:', error.message)
  }
}

// Ejecutar verificación
verificarBackend()
