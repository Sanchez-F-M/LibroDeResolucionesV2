const axios = require('axios');

// Configuración para testing local
const LOCAL_BACKEND_URL = 'http://localhost:3000';

async function testLocalImprovements() {
    console.log('🧪 PROBANDO MEJORAS LOCALMENTE');
    console.log('================================');
    
    try {
        // Test 1: Headers de seguridad
        console.log('\n1. 🔒 Probando headers de seguridad...');
        const healthResponse = await axios.get(`${LOCAL_BACKEND_URL}/health`);
        const headers = healthResponse.headers;
        
        const securityHeaders = {
            'x-content-type-options': 'nosniff',
            'x-frame-options': 'DENY',
            'x-xss-protection': '1; mode=block'
        };
        
        let headersOk = true;
        for (const [header, expectedValue] of Object.entries(securityHeaders)) {
            if (headers[header]) {
                console.log(`✅ ${header}: ${headers[header]}`);
            } else {
                console.log(`❌ ${header}: FALTANTE`);
                headersOk = false;
            }
        }
        
        if (headersOk) {
            console.log('✅ Headers de seguridad implementados correctamente');
        } else {
            console.log('❌ Algunos headers de seguridad faltan');
        }
        
        // Test 2: Contraseñas débiles
        console.log('\n2. 🔐 Probando validación de contraseñas débiles...');
        try {
            await axios.post(`${LOCAL_BACKEND_URL}/api/user/register`, {
                Nombre: `TestWeak_${Date.now()}`,
                Contrasena: '123',
                Rol: 'usuario'
            });
            console.log('❌ Sistema acepta contraseñas débiles');
        } catch (error) {
            if (error.response && error.response.status === 400) {
                console.log('✅ Sistema rechaza contraseñas débiles correctamente');
                console.log(`   Mensaje: ${error.response.data.error}`);
            } else {
                console.log('❌ Error inesperado:', error.message);
            }
        }
        
        // Test 3: Login inválido devuelve 401
        console.log('\n3. 🚫 Probando login inválido...');
        try {
            await axios.post(`${LOCAL_BACKEND_URL}/api/user/login`, {
                Nombre: 'usuarioinexistente',
                Contrasena: 'contraseñaincorrecta'
            });
            console.log('❌ Login inválido no fue rechazado');
        } catch (error) {
            if (error.response && error.response.status === 401) {
                console.log('✅ Login inválido correctamente rechazado con status 401');
                console.log(`   Mensaje: ${error.response.data.error}`);
            } else {
                console.log(`❌ Status incorrecto: ${error.response?.status || 'ERROR'}`);
                console.log(`   Mensaje: ${error.response?.data?.error || error.message}`);
            }
        }
        
        // Test 4: Registro exitoso
        console.log('\n4. ✅ Probando registro exitoso...');
        try {
            const response = await axios.post(`${LOCAL_BACKEND_URL}/api/user/register`, {
                Nombre: `TestUser_${Date.now()}`,
                Contrasena: 'password123',
                Rol: 'usuario'
            });
            console.log('✅ Registro exitoso');
            console.log(`   Usuario: ${response.data.user.Nombre}`);
        } catch (error) {
            console.log('❌ Error en registro:', error.response?.data?.error || error.message);
        }
        
        console.log('\n🎯 TESTING LOCAL COMPLETADO');
        console.log('================================');
        
    } catch (error) {
        console.error('❌ Error general:', error.message);
        console.log('\n💡 Asegúrate de que el servidor local esté ejecutándose en http://localhost:3000');
    }
}

// Ejecutar si se llama directamente
if (require.main === module) {
    testLocalImprovements();
}

module.exports = { testLocalImprovements };
