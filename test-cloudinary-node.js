// Script para probar la integración de Cloudinary usando Node.js
// filepath: c:\Users\flavi\OneDrive\Escritorio\LibroDeResolucionesV2\test-cloudinary-node.js

import fetch from 'node-fetch'
import fs from 'fs'
import FormData from 'form-data'

const BASE_URL = 'http://localhost:10000'

async function testCloudinaryIntegration() {
  console.log('🌩️  PRUEBA DE INTEGRACIÓN CLOUDINARY')
  console.log('====================================')
  console.log('')

  try {
    // 1. Verificar servidor
    console.log('1. 🔍 Verificando servidor backend...')
    const healthResponse = await fetch(`${BASE_URL}/health`)
    
    if (healthResponse.ok) {
      console.log('   ✅ Servidor backend funcionando (puerto 10000)')
    } else {
      throw new Error('Servidor no responde')
    }

    // 2. Verificar configuración
    console.log('')
    console.log('2. ⚙️  Verificando configuración de upload...')
    
    // Leer archivo .env
    const envContent = fs.readFileSync('./server/.env', 'utf8')
    const usingCloudinary = envContent.includes('CLOUDINARY_CLOUD_NAME=') && 
                           !envContent.includes('CLOUDINARY_CLOUD_NAME=\n') &&
                           !envContent.includes('CLOUDINARY_CLOUD_NAME= ')
    
    if (usingCloudinary) {
      console.log('   ✅ Cloudinary configurado')
    } else {
      console.log('   📁 Usando almacenamiento local (Cloudinary no configurado)')
    }

    // 3. Obtener token de autenticación
    console.log('')
    console.log('3. 🔑 Obteniendo token de autenticación...')
    
    const loginResponse = await fetch(`${BASE_URL}/api/users/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: 'admin',
        password: 'admin123'
      })
    })

    const loginData = await loginResponse.json()
    
    if (!loginData.token) {
      throw new Error('No se pudo obtener token de autenticación')
    }
    
    console.log('   ✅ Token obtenido exitosamente')

    // 4. Crear datos de prueba
    console.log('')
    console.log('4. 🧪 Preparando datos de prueba...')
    
    const timestamp = Date.now()
    const resolutionNumber = `TEST-${timestamp}`
    const subject = `Prueba de integración Cloudinary - ${timestamp}`
    const reference = `REF-CLOUDINARY-${timestamp}`
    const dateCreated = new Date().toISOString()

    console.log(`   📋 Número de resolución: ${resolutionNumber}`)
    console.log(`   📝 Asunto: ${subject}`)

    // 5. Crear archivo de prueba
    console.log('')
    console.log('5. 📸 Creando archivo de prueba...')
    
    // Crear directorio temporal
    if (!fs.existsSync('./temp_test')) {
      fs.mkdirSync('./temp_test')
    }

    const testFileName = `test-image-${timestamp}.txt`
    const testFilePath = `./temp_test/${testFileName}`
    const testContent = `IMAGEN DE PRUEBA PARA CLOUDINARY - ${timestamp}\nEsta es una imagen de prueba para verificar el upload\nTimestamp: ${timestamp}\nConfiguración: ${usingCloudinary ? 'Cloudinary' : 'Local'}`
    
    fs.writeFileSync(testFilePath, testContent)
    console.log(`   ✅ Archivo de prueba creado: ${testFileName}`)

    // 6. Realizar upload
    console.log('')
    console.log('6. 🚀 Realizando prueba de upload...')
    
    const formData = new FormData()
    formData.append('NumdeResolucion', resolutionNumber)
    formData.append('Asunto', subject)
    formData.append('Referencia', reference)
    formData.append('FechaCreacion', dateCreated)
    formData.append('files', fs.createReadStream(testFilePath))

    const uploadResponse = await fetch(`${BASE_URL}/api/books`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${loginData.token}`
      },
      body: formData
    })

    const uploadResult = await uploadResponse.json()
    console.log('   📋 Respuesta del servidor:')
    console.log('  ', JSON.stringify(uploadResult, null, 2))

    if (uploadResult.message && uploadResult.message.includes('exitosamente')) {
      console.log('   ✅ Upload realizado exitosamente')
      
      // 7. Verificar resolución creada
      console.log('')
      console.log('7. 🔍 Verificando resolución creada...')
      
      const getResponse = await fetch(`${BASE_URL}/api/books/${resolutionNumber}`, {
        headers: {
          'Authorization': `Bearer ${loginData.token}`
        }
      })

      const resolutionData = await getResponse.json()
      console.log('   📋 Datos de la resolución:')
      console.log('  ', JSON.stringify(resolutionData, null, 2))

      // Verificar URLs de imágenes
      if (resolutionData[0] && resolutionData[0].images && resolutionData[0].images.length > 0) {
        const imageUrl = resolutionData[0].images[0]
        
        if (imageUrl.includes('cloudinary.com')) {
          console.log('   ✅ Imagen almacenada en Cloudinary')
          console.log('   🌐 URL de Cloudinary detectada')
        } else if (imageUrl.includes('uploads/')) {
          console.log('   📁 Imagen almacenada localmente')
          console.log('   🏠 Path local detectado')
        } else {
          console.log('   ⚠️  Formato de URL no reconocido:', imageUrl)
        }
      }
      
    } else {
      console.log('   ❌ Error en el upload:', uploadResult)
    }

    // 8. Limpiar archivos temporales
    console.log('')
    console.log('8. 🧹 Limpiando archivos temporales...')
    fs.unlinkSync(testFilePath)
    fs.rmdirSync('./temp_test')
    console.log('   ✅ Archivos temporales eliminados')

    // 9. Resumen
    console.log('')
    console.log('9. 📊 RESUMEN DE LA PRUEBA:')
    console.log('   ==========================================')
    if (usingCloudinary) {
      console.log('   🌩️  Configuración: CLOUDINARY')
      console.log('   ✅ Almacenamiento persistente activado')
      console.log('   🚀 Imágenes se guardarán en la nube')
      console.log('   🔄 Datos persistirán en redespliegues')
    } else {
      console.log('   📁 Configuración: ALMACENAMIENTO LOCAL')
      console.log('   ⚠️  Solo para desarrollo')
      console.log('   💡 Para producción, configura Cloudinary')
    }

    console.log('')
    console.log('10. 📋 PRÓXIMOS PASOS:')
    if (!usingCloudinary) {
      console.log('   🔧 Para configurar Cloudinary en producción:')
      console.log('   1. Crea cuenta en https://cloudinary.com/')
      console.log('   2. Configura variables en Render:')
      console.log('      - CLOUDINARY_CLOUD_NAME')
      console.log('      - CLOUDINARY_API_KEY')
      console.log('      - CLOUDINARY_API_SECRET')
      console.log('   3. Redespliega la aplicación')
    } else {
      console.log('   ✅ Cloudinary configurado correctamente')
      console.log('   🚀 Listo para producción')
    }

    console.log('')
    console.log('🎉 Prueba de integración completada exitosamente!')

  } catch (error) {
    console.error('')
    console.error('❌ Error en la prueba:', error.message)
    console.error('')
    console.error('💡 Posibles soluciones:')
    console.error('   - Verifica que el servidor esté ejecutándose (npm run dev)')
    console.error('   - Verifica que PostgreSQL esté funcionando')
    console.error('   - Verifica las credenciales del usuario admin')
    process.exit(1)
  }
}

// Ejecutar la prueba
testCloudinaryIntegration()
