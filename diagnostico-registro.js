import axios from 'axios';

const BASE_URL = 'https://libroderesoluciones-api.onrender.com';

async function probarRegistro() {
    console.log('🧪 Probando registro de usuario...\n');    const usuarioTest = {
        Nombre: `TestUser_${Date.now()}`,
        Email: `test_${Date.now()}@email.com`,
        Contrasena: 'password123',
        Rol: 'usuario'
    };

    const startTime = Date.now();
    
    try {
        console.log('📝 Enviando solicitud de registro...');
        console.log('URL:', `${BASE_URL}/api/user/register`);
        console.log('Datos:', JSON.stringify(usuarioTest, null, 2));
        
        const response = await axios.post(`${BASE_URL}/api/user/register`, usuarioTest, {
            timeout: 30000, // 30 segundos de timeout
            headers: {
                'Content-Type': 'application/json'
            }
        });
        
        const endTime = Date.now();
        const duration = endTime - startTime;
        
        console.log('✅ Registro exitoso!');
        console.log(`⏱️ Tiempo de respuesta: ${duration}ms`);
        console.log('📋 Respuesta:', JSON.stringify(response.data, null, 2));
        
    } catch (error) {
        const endTime = Date.now();
        const duration = endTime - startTime;
        
        console.log('❌ Error en registro');
        console.log(`⏱️ Tiempo transcurrido: ${duration}ms`);
        
        if (error.code === 'ECONNABORTED') {
            console.log('🕐 Error de timeout - El servidor tardó más de 30 segundos en responder');
        } else if (error.response) {
            console.log('📄 Respuesta de error:', error.response.status);
            console.log('📋 Datos:', JSON.stringify(error.response.data, null, 2));
        } else {
            console.log('🔗 Error de conexión:', error.message);
        }
    }
}

// Ejecutar la prueba
probarRegistro().catch(console.error);
