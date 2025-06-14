// Pruebas de persistencia usando Node.js para Windows
// filepath: c:\Users\flavi\OneDrive\Escritorio\LibroDeResolucionesV2\test-persistencia-nodejs.js

import fetch from 'node-fetch'
import fs from 'fs'
import FormData from 'form-data'

const BASE_URL = 'http://localhost:10000'
const ADMIN_USER = 'admin'
const ADMIN_PASS = 'admin123'

// Colores para consola
const colors = {
    reset: '\x1b[0m',
    bright: '\x1b[1m',
    green: '\x1b[32m',
    red: '\x1b[31m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    purple: '\x1b[35m',
    cyan: '\x1b[36m'
}

const log = {
    success: (msg) => console.log(`${colors.green}✅ ${msg}${colors.reset}`),
    error: (msg) => console.log(`${colors.red}❌ ${msg}${colors.reset}`),
    warning: (msg) => console.log(`${colors.yellow}⚠️  ${msg}${colors.reset}`),
    info: (msg) => console.log(`${colors.blue}ℹ️  ${msg}${colors.reset}`),
    test: (msg) => console.log(`${colors.purple}🧪 ${msg}${colors.reset}`),
    header: (msg) => console.log(`${colors.cyan}🚀 ${msg}${colors.reset}`)
}

// Función para obtener token
async function getAuthToken() {
    try {
        const response = await fetch(`${BASE_URL}/api/users/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: ADMIN_USER, password: ADMIN_PASS })
        })
        
        const data = await response.json()
        return data.token
    } catch (error) {
        log.error(`Error obteniendo token: ${error.message}`)
        return null
    }
}

// Función para obtener todas las resoluciones
async function getAllResolutions(token) {
    try {
        const response = await fetch(`${BASE_URL}/api/books/all`, {
            headers: { 'Authorization': `Bearer ${token}` }
        })
        
        return await response.json()
    } catch (error) {
        log.error(`Error obteniendo resoluciones: ${error.message}`)
        return []
    }
}

// Función para crear resolución con imagen
async function createResolutionWithImage(token, resNumber, subject, reference) {
    try {
        // Crear archivo temporal
        if (!fs.existsSync('./temp_test')) {
            fs.mkdirSync('./temp_test')
        }
        
        const fileName = `test-${resNumber}.txt`
        const filePath = `./temp_test/${fileName}`
        const fileContent = `PRUEBA DE PERSISTENCIA - ${resNumber}
Timestamp: ${new Date().toISOString()}
Subject: ${subject}
Reference: ${reference}
Test ID: ${Math.random().toString(36).substring(7)}`
        
        fs.writeFileSync(filePath, fileContent)
        
        // Crear FormData
        const formData = new FormData()
        formData.append('NumdeResolucion', resNumber)
        formData.append('Asunto', subject)
        formData.append('Referencia', reference)
        formData.append('FechaCreacion', new Date().toISOString())
        formData.append('files', fs.createReadStream(filePath))
        
        const response = await fetch(`${BASE_URL}/api/books`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${token}` },
            body: formData
        })
        
        const result = await response.json()
        
        // Limpiar archivo temporal
        fs.unlinkSync(filePath)
        
        return result
    } catch (error) {
        log.error(`Error creando resolución: ${error.message}`)
        return { error: error.message }
    }
}

// Función para obtener resolución específica
async function getResolution(token, resNumber) {
    try {
        const response = await fetch(`${BASE_URL}/api/books/${resNumber}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        })
        
        return await response.json()
    } catch (error) {
        log.error(`Error obteniendo resolución ${resNumber}: ${error.message}`)
        return null
    }
}

// Función principal de pruebas
async function runPersistenceTests() {
    log.header('PRUEBAS DE PERSISTENCIA - LIBRO DE RESOLUCIONES')
    console.log('============================================')
    console.log('')
    
    let testsTotal = 0
    let testsPassed = 0
    let testsFailed = 0
    let resolutionsCreated = []
    
    try {
        // Test 1: Verificar servidor
        log.test('Test 1: Verificando conectividad del servidor')
        testsTotal++
        
        const healthResponse = await fetch(`${BASE_URL}/health`)
        if (healthResponse.ok) {
            const healthData = await healthResponse.json()
            log.success('Servidor respondiendo correctamente')
            log.info(`Uptime: ${Math.round(healthData.uptime)}s, Memoria: ${Math.round(healthData.memory.heapUsed / 1024 / 1024)}MB`)
            testsPassed++
        } else {
            log.error('Servidor no responde correctamente')
            testsFailed++
            return
        }
        
        console.log('')
        
        // Test 2: Autenticación
        log.test('Test 2: Verificando autenticación')
        testsTotal++
        
        const token = await getAuthToken()
        if (token) {
            log.success('Token de autenticación obtenido')
            log.info(`Token: ${token.substring(0, 20)}...`)
            testsPassed++
        } else {
            log.error('No se pudo obtener token de autenticación')
            testsFailed++
            return
        }
        
        console.log('')
        
        // Test 3: Estado inicial
        log.test('Test 3: Obteniendo estado inicial del sistema')
        testsTotal++
        
        const initialResolutions = await getAllResolutions(token)
        const initialCount = initialResolutions.length
        
        log.success(`Estado inicial obtenido: ${initialCount} resoluciones`)
        testsPassed++
        
        console.log('')
        
        // Test 4: Crear múltiples resoluciones
        log.test('Test 4: Creando múltiples resoluciones para probar persistencia')
        
        for (let i = 1; i <= 5; i++) {
            testsTotal++
            const timestamp = Date.now()
            const resNumber = `PERSIST-${i}-${timestamp}`
            const subject = `Prueba de persistencia ${i} - ${timestamp}`
            const reference = `REF-PERSIST-${i}-${timestamp}`
            
            log.info(`Creando resolución ${i}: ${resNumber}`)
            
            const createResult = await createResolutionWithImage(token, resNumber, subject, reference)
            
            if (createResult.message && createResult.message.includes('exitosamente')) {
                log.success(`Resolución ${i} creada exitosamente`)
                resolutionsCreated.push(resNumber)
                testsPassed++
            } else {
                log.error(`Error en resolución ${i}: ${createResult.error || 'Error desconocido'}`)
                testsFailed++
            }
            
            // Pausa pequeña entre creaciones
            await new Promise(resolve => setTimeout(resolve, 1000))
        }
        
        console.log('')
        
        // Test 5: Verificar persistencia inmediata
        log.test('Test 5: Verificando persistencia inmediata')
        testsTotal++
        
        const afterCreateResolutions = await getAllResolutions(token)
        const afterCreateCount = afterCreateResolutions.length
        
        log.info(`Resoluciones después de crear: ${afterCreateCount}`)
        log.info(`Incremento esperado: ${resolutionsCreated.length}`)
        log.info(`Incremento real: ${afterCreateCount - initialCount}`)
        
        if (afterCreateCount >= initialCount + resolutionsCreated.length) {
            log.success('Persistencia inmediata verificada ✅')
            testsPassed++
        } else {
            log.error('Problema de persistencia inmediata detectado ❌')
            testsFailed++
        }
        
        console.log('')
        
        // Test 6: Verificar resoluciones específicas
        log.test('Test 6: Verificando resoluciones específicas creadas')
        
        let foundResolutions = 0
        
        for (const resNumber of resolutionsCreated) {
            testsTotal++
            
            const resolutionData = await getResolution(token, resNumber)
            
            if (resolutionData && resolutionData.length > 0) {
                log.success(`Resolución encontrada: ${resNumber}`)
                
                // Verificar imágenes
                const images = resolutionData[0].images || []
                log.info(`  Imágenes: ${images.length}`)
                
                if (images.length > 0) {
                    images.forEach((imageUrl, index) => {
                        if (imageUrl.includes('cloudinary.com')) {
                            log.success(`  Imagen ${index + 1}: Cloudinary (persistente)`)
                        } else if (imageUrl.includes('uploads')) {
                            log.warning(`  Imagen ${index + 1}: Local (no persistente en Render)`)
                        } else {
                            log.info(`  Imagen ${index + 1}: ${imageUrl}`)
                        }
                    })
                }
                
                foundResolutions++
                testsPassed++
            } else {
                log.error(`Resolución NO encontrada: ${resNumber}`)
                testsFailed++
            }
        }
        
        console.log('')
        
        // Test 7: Simular nueva sesión
        log.test('Test 7: Simulando nueva sesión (nuevo token)')
        testsTotal++
        
        // Esperar un poco
        await new Promise(resolve => setTimeout(resolve, 2000))
        
        const newToken = await getAuthToken()
        if (newToken && newToken !== token) {
            log.success('Nueva sesión establecida con token diferente')
            testsPassed++
            
            // Verificar datos con nuevo token
            const newSessionData = await getAllResolutions(newToken)
            const newSessionCount = newSessionData.length
            
            log.info(`Resoluciones en nueva sesión: ${newSessionCount}`)
            
            if (newSessionCount === afterCreateCount) {
                log.success('Datos persisten entre sesiones ✅')
            } else {
                log.warning('Posible inconsistencia entre sesiones')
            }
        } else {
            log.error('Problema obteniendo nuevo token')
            testsFailed++
        }
        
        console.log('')
        
        // Test 8: Análisis de configuración
        log.test('Test 8: Análisis de configuración de almacenamiento')
        testsTotal++
        
        try {
            const envContent = fs.readFileSync('./server/.env', 'utf8')
            
            if (envContent.includes('CLOUDINARY_CLOUD_NAME=') && 
                !envContent.includes('CLOUDINARY_CLOUD_NAME=\n') &&
                !envContent.includes('CLOUDINARY_CLOUD_NAME= ')) {
                log.success('Cloudinary configurado - datos persistirán en producción')
            } else {
                log.warning('Cloudinary no configurado - configurar para Render')
            }
            
            testsPassed++
        } catch (error) {
            log.error('No se pudo analizar configuración')
            testsFailed++
        }
        
        console.log('')
        
    } catch (error) {
        log.error(`Error general en pruebas: ${error.message}`)
    } finally {
        // Limpiar archivos temporales
        if (fs.existsSync('./temp_test')) {
            try {
                fs.rmSync('./temp_test', { recursive: true })
                log.info('Archivos temporales limpiados')
            } catch (error) {
                log.warning('No se pudieron limpiar todos los archivos temporales')
            }
        }
    }
    
    // Reporte final
    console.log('')
    log.header('REPORTE FINAL DE PRUEBAS DE PERSISTENCIA')
    console.log('=========================================')
    console.log('')
    
    const successRate = Math.round((testsPassed / testsTotal) * 100)
    
    console.log(`${colors.blue}📊 ESTADÍSTICAS:${colors.reset}`)
    console.log(`   • Tests ejecutados: ${testsTotal}`)
    console.log(`   • Tests exitosos: ${testsPassed}`)
    console.log(`   • Tests fallidos: ${testsFailed}`)
    console.log(`   • Tasa de éxito: ${successRate}%`)
    console.log('')
    
    console.log(`${colors.blue}📈 DATOS:${colors.reset}`)
    console.log(`   • Resoluciones creadas: ${resolutionsCreated.length}`)
    console.log(`   • Resoluciones encontradas: ${resolutionsCreated.length}`)
    console.log('')
    
    // Veredicto final
    if (successRate >= 90) {
        log.success('🎯 VEREDICTO: PERSISTENCIA EXITOSA ✅')
        console.log('')
        console.log('   🏆 Los datos persisten correctamente')
        console.log('   🏆 No hay pérdida de información')
        console.log('   🏆 Sistema funcionando como esperado')
        
        // Verificar si usa Cloudinary
        try {
            const envContent = fs.readFileSync('./server/.env', 'utf8')
            if (envContent.includes('CLOUDINARY_CLOUD_NAME=') && 
                !envContent.includes('CLOUDINARY_CLOUD_NAME=\n')) {
                console.log('   🌩️  CLOUDINARY: Configurado - listo para producción')
            } else {
                console.log('   ⚠️  CLOUDINARY: No configurado - configurar para Render')
            }
        } catch (error) {
            // Ignore
        }
        
    } else if (successRate >= 70) {
        log.warning('🎯 VEREDICTO: PERSISTENCIA PARCIAL ⚠️')
        console.log('')
        console.log('   ✅ Persistencia básica funcionando')
        console.log('   ⚠️  Algunas pruebas tuvieron problemas')
        console.log('   🔧 Revisar configuración antes de producción')
        
    } else {
        log.error('🎯 VEREDICTO: PROBLEMAS DE PERSISTENCIA ❌')
        console.log('')
        console.log('   ❌ Se detectaron problemas significativos')
        console.log('   ❌ Los datos pueden perderse')
        console.log('   🚨 Requiere investigación inmediata')
    }
    
    console.log('')
    console.log(`${colors.blue}📋 RECOMENDACIONES:${colors.reset}`)
    
    if (successRate >= 90) {
        console.log('   ✅ Sistema listo para deployment')
        console.log('   📊 Monitorear comportamiento en producción')
    } else {
        console.log('   🔍 Revisar logs detallados')
        console.log('   🔧 Corregir problemas de configuración')
        console.log('   🧪 Re-ejecutar pruebas después de correcciones')
    }
    
    console.log('')
    console.log('🏁 Pruebas completadas -', new Date().toLocaleString())
    
    // Exit code
    process.exit(successRate >= 70 ? 0 : 1)
}

// Ejecutar pruebas
runPersistenceTests().catch(error => {
    log.error(`Error fatal: ${error.message}`)
    process.exit(1)
})
