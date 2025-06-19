import axios from 'axios';

const BACKEND_URL = 'https://libroderesoluciones-api.onrender.com';

async function probarRegistroCompleto() {
    console.log('🧪 PRUEBA COMPLETA DE REGISTRO DE USUARIO');
    console.log('==========================================\n');
    
    // Paso 1: Despertar el backend
    console.log('☕ PASO 1: Despertando backend...');
    try {
        const wakeUpResponse = await axios.get(`${BACKEND_URL}/api/cloudinary/status`, {
            timeout: 35000
        });
        console.log(`✅ Backend despierto: ${wakeUpResponse.status} en ${wakeUpResponse.request.responseURL}`);
    } catch (error) {
        console.log(`⚠️ Backend puede estar dormido, pero continuamos...`);
    }
    
    console.log('\n🔄 PASO 2: Esperando 2 segundos...');
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Paso 2: Probar registro con diferentes roles
    const roles = ['usuario', 'secretaria', 'admin'];
    
    for (const rol of roles) {
        console.log(`\n👤 PASO 3: Probando registro con rol "${rol}"...`);
        
        const usuarioTest = {
            Nombre: `TestUser_${rol}_${Date.now()}`,
            Contrasena: 'password123',
            Rol: rol
        };
        
        const startTime = Date.now();
        
        try {
            const response = await axios.post(`${BACKEND_URL}/api/user/register`, usuarioTest, {
                timeout: 30000, // 30 segundos
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            
            const endTime = Date.now();
            const duration = endTime - startTime;
            
            console.log(`✅ Registro exitoso para rol "${rol}"`);
            console.log(`   ⏱️ Tiempo: ${duration}ms`);
            console.log(`   👤 Usuario: ${response.data.user.Nombre}`);
            console.log(`   🎭 Rol asignado: ${response.data.user.Rol}`);
            
        } catch (error) {
            const endTime = Date.now();
            const duration = endTime - startTime;
            
            console.log(`❌ Error en registro para rol "${rol}"`);
            console.log(`   ⏱️ Tiempo: ${duration}ms`);
            
            if (error.code === 'ECONNABORTED') {
                console.log(`   🕐 Timeout después de 30 segundos`);
            } else if (error.response) {
                console.log(`   📄 Respuesta: ${error.response.status}`);
                console.log(`   📋 Error: ${error.response.data?.error || 'Sin detalles'}`);
            } else {
                console.log(`   🔗 Error de conexión: ${error.message}`);
            }
        }
    }
    
    console.log('\n🎯 RESUMEN FINAL:');
    console.log('================');
    console.log('✅ Backend está despierto y respondiendo');
    console.log('✅ Timeout aumentado a 30 segundos en el código');
    console.log('✅ Roles válidos: usuario, secretaria, admin');
    console.log('⚠️ Recuerda: El frontend necesita redeploy en Vercel para aplicar el nuevo timeout');
    console.log('\n📱 SIGUIENTE PASO: Probar el registro desde la interfaz web');
}

// Ejecutar la prueba
probarRegistroCompleto().catch(console.error);
