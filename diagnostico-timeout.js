#!/usr/bin/env node

// Script para diagnosticar y despertar el backend

const API_URL = 'https://libroderesoluciones-api.onrender.com'

async function diagnosticarBackend() {
  console.log('🔍 DIAGNÓSTICO DEL BACKEND - TIMEOUT ISSUES')
  console.log('===========================================\n')

  try {
    console.log('1. Verificando si el backend está activo...')
    console.log(`🌐 URL: ${API_URL}`)
    
    // Primer intento - endpoint de salud
    console.log('\n📡 Intentando conectar al health endpoint...')
    const start = Date.now()
    
    try {
      const healthResponse = await fetch(`${API_URL}/health`, {
        method: 'GET',
        signal: AbortSignal.timeout(15000) // 15 segundos timeout
      })
      
      const elapsed = Date.now() - start
      console.log(`⏱️  Tiempo de respuesta: ${elapsed}ms`)
      
      if (healthResponse.ok) {
        const healthData = await healthResponse.json()
        console.log('✅ Backend está ACTIVO')
        console.log(`📊 Status: ${healthData.status}`)
        console.log(`🚀 Uptime: ${Math.round(healthData.uptime)}s`)
        console.log(`💾 Memoria: ${Math.round(healthData.memory.heapUsed / 1024 / 1024)}MB`)
        
        // Si está activo, probar endpoints de API
        console.log('\n2. Probando endpoints de API...')
        
        // Probar registro (que está fallando)
        console.log('📝 Probando endpoint de registro...')
        const registerStart = Date.now()
        
        try {
          const registerResponse = await fetch(`${API_URL}/api/user/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              Nombre: 'TestTimeout',
              Contrasena: 'test123',
              Rol: 'usuario'
            }),
            signal: AbortSignal.timeout(15000)
          })
          
          const registerElapsed = Date.now() - registerStart
          console.log(`⏱️  Tiempo de respuesta registro: ${registerElapsed}ms`)
          console.log(`📋 Status registro: ${registerResponse.status}`)
          
          if (registerResponse.ok) {
            console.log('✅ Endpoint de registro funciona correctamente')
          } else {
            const errorText = await registerResponse.text()
            console.log('⚠️  Endpoint responde pero con error:', errorText)
          }
          
        } catch (registerError) {
          console.log('❌ Error en endpoint de registro:', registerError.message)
        }
        
      } else {
        console.log(`❌ Backend responde pero con error: ${healthResponse.status}`)
      }
      
    } catch (healthError) {
      console.log('❌ Error al conectar con health endpoint:', healthError.message)
      
      if (healthError.name === 'TimeoutError' || healthError.message.includes('timeout')) {
        console.log('\n🛌 DIAGNÓSTICO: El backend parece estar DORMIDO')
        console.log('⏰ En Render, las apps gratuitas se duermen después de 15 min de inactividad')
        console.log('🔄 Intentando despertar el backend...')
        
        // Intentar despertar con múltiples requests
        console.log('\n🚀 Enviando requests para despertar el backend...')
        
        for (let i = 1; i <= 3; i++) {
          console.log(`   Intento ${i}/3...`)
          try {
            const wakeupResponse = await fetch(`${API_URL}/`, {
              method: 'GET',
              signal: AbortSignal.timeout(30000) // 30 segundos para despertar
            })
            
            if (wakeupResponse.ok) {
              console.log(`   ✅ Intento ${i} exitoso!`)
              break
            } else {
              console.log(`   ⚠️  Intento ${i}: Status ${wakeupResponse.status}`)
            }
          } catch (wakeupError) {
            console.log(`   ❌ Intento ${i} falló: ${wakeupError.message}`)
          }
          
          // Esperar 5 segundos entre intentos
          if (i < 3) {
            console.log('   ⏳ Esperando 5 segundos...')
            await new Promise(resolve => setTimeout(resolve, 5000))
          }
        }
        
        // Verificar si se despertó
        console.log('\n🔍 Verificando si el backend se despertó...')
        try {
          const finalCheck = await fetch(`${API_URL}/health`, {
            signal: AbortSignal.timeout(10000)
          })
          
          if (finalCheck.ok) {
            const finalData = await finalCheck.json()
            console.log('🎉 ¡Backend DESPERTADO exitosamente!')
            console.log(`⏱️  Uptime: ${Math.round(finalData.uptime)}s`)
            console.log('\n✅ SOLUCIÓN: Espera 1-2 minutos y prueba la aplicación de nuevo')
          } else {
            console.log('❌ El backend aún no responde correctamente')
          }
        } catch (finalError) {
          console.log('❌ El backend aún no se ha despertado completamente')
        }
      }
    }
    
  } catch (error) {
    console.error('❌ Error general en diagnóstico:', error.message)
  }
  
  console.log('\n📋 RECOMENDACIONES:')
  console.log('1. 🔄 Refrescar la página en 1-2 minutos')
  console.log('2. 🌐 Verificar conexión a internet')
  console.log('3. 🛠️  Si persiste, verificar logs de Render')
  console.log('4. ⏰ Recordar que apps gratuitas de Render se duermen automáticamente')
}

// Ejecutar diagnóstico
diagnosticarBackend()
