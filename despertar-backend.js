import axios from 'axios';

const BACKEND_URL = 'https://libroderesoluciones-api.onrender.com';

async function despertarBackend() {
    console.log('☕ Despertando backend de Render...\n');
    
    const endpoints = [
        '/api/user/login',  // Endpoint que sabemos que funciona
        '/api/books',       // Endpoint de libros
        '/api/cloudinary/status' // Endpoint de Cloudinary
    ];
    
    console.log('📍 Backend URL:', BACKEND_URL);
    console.log('⏰ Iniciando peticiones de "despertar"...\n');
    
    for (const endpoint of endpoints) {
        const startTime = Date.now();
        
        try {
            console.log(`🔍 Probando ${endpoint}...`);
            
            const response = await axios.get(`${BACKEND_URL}${endpoint}`, {
                timeout: 35000, // 35 segundos
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            
            const endTime = Date.now();
            const duration = endTime - startTime;
            
            console.log(`✅ ${endpoint}: ${response.status} (${duration}ms)`);
            
        } catch (error) {
            const endTime = Date.now();
            const duration = endTime - startTime;
            
            if (error.code === 'ECONNABORTED') {
                console.log(`⏰ ${endpoint}: Timeout después de ${duration}ms`);
            } else if (error.response) {
                console.log(`📄 ${endpoint}: ${error.response.status} (${duration}ms) - Servidor respondió`);
            } else {
                console.log(`❌ ${endpoint}: Error de conexión (${duration}ms)`);
            }
        }
        
        // Pequeña pausa entre peticiones
        await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    console.log('\n🎯 Proceso de "despertar" completado.');
    console.log('✅ El backend debería estar listo para responder rápidamente.');
    console.log('📱 Los usuarios ahora pueden registrarse sin timeout.');
}

// Ejecutar el script
despertarBackend().catch(console.error);
