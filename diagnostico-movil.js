// Diagnóstico específico para problemas de imágenes en móviles
// Ejecutar en la consola del navegador móvil

console.log('🔍 DIAGNÓSTICO MÓVIL - INICIO');

// 1. Información del dispositivo
console.log('📱 INFORMACIÓN DEL DISPOSITIVO:');
console.log('User Agent:', navigator.userAgent);
console.log('Ancho de pantalla:', window.innerWidth);
console.log('Alto de pantalla:', window.innerHeight);
console.log('Conexión:', navigator.connection ? navigator.connection.effectiveType : 'No disponible');

// 2. Variables de entorno
console.log('🔧 VARIABLES DE ENTORNO:');
console.log('VITE_API_BASE_URL:', import.meta?.env?.VITE_API_BASE_URL || 'No definida');
console.log('Location hostname:', window.location.hostname);
console.log('Location protocol:', window.location.protocol);

// 3. Test de conectividad básica
console.log('🌐 TEST DE CONECTIVIDAD:');
const testUrls = [
    'https://libro-resoluciones-backend.onrender.com/render-health',
    'https://libro-resoluciones-backend.onrender.com/api/books',
    'https://libro-resoluciones-backend.onrender.com/uploads/'
];

testUrls.forEach(async (url, index) => {
    try {
        const response = await fetch(url, { method: 'HEAD' });
        console.log(`✅ URL ${index + 1} (${response.status}):`, url);
    } catch (error) {
        console.log(`❌ URL ${index + 1} ERROR:`, url, error.message);
    }
});

// 4. Test específico de imagen
console.log('🖼️ TEST DE IMAGEN:');
const testImageUrl = 'https://libro-resoluciones-backend.onrender.com/uploads/1746055049685-diagrama_ep.png';

fetch(testImageUrl)
    .then(response => {
        console.log('✅ Imagen response status:', response.status);
        console.log('✅ Imagen headers:', Object.fromEntries(response.headers.entries()));
        return response.blob();
    })
    .then(blob => {
        console.log('✅ Imagen blob size:', blob.size, 'bytes');
        console.log('✅ Imagen type:', blob.type);
        
        // Crear URL y probar en img element
        const imgUrl = URL.createObjectURL(blob);
        const img = new Image();
        img.onload = () => {
            console.log('✅ Imagen cargada exitosamente:', img.width, 'x', img.height);
            URL.revokeObjectURL(imgUrl);
        };
        img.onerror = (error) => {
            console.log('❌ Error al cargar imagen:', error);
            URL.revokeObjectURL(imgUrl);
        };
        img.src = imgUrl;
    })
    .catch(error => {
        console.log('❌ Error al obtener imagen:', error);
    });

// 5. Test de CORS
console.log('🔒 TEST DE CORS:');
fetch('https://libro-resoluciones-backend.onrender.com/api/books', {
    method: 'OPTIONS',
    headers: {
        'Origin': window.location.origin,
        'Access-Control-Request-Method': 'GET'
    }
})
.then(response => {
    console.log('✅ CORS preflight status:', response.status);
    console.log('✅ CORS headers:', Object.fromEntries(response.headers.entries()));
})
.catch(error => {
    console.log('❌ CORS error:', error);
});

console.log('🔍 DIAGNÓSTICO MÓVIL - FIN');
console.log('📋 Copia estos resultados para análisis');
