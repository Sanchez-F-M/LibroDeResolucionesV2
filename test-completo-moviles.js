// 🧪 TEST COMPLETO DEL FLUJO DE IMÁGENES EN MÓVILES
// Ejecutar este script en la consola del navegador móvil

console.log('🧪 INICIANDO TEST COMPLETO DE FLUJO MÓVILES');
console.log('========================================');

// Configuración del test
const CONFIG = {
    LOCAL_API: 'http://192.168.1.235:10000',
    PROD_API: 'https://libro-resoluciones-backend.onrender.com',
    TEST_RESOLUTION: 'RES-001-2024',
    TEST_IMAGE: '1746055049685-diagrama_ep.png'
};

// Utilidad para medir tiempo
const timer = {
    start: (name) => console.time(`⏱️ ${name}`),
    end: (name) => console.timeEnd(`⏱️ ${name}`)
};

// Función principal de test
async function runCompleteTest() {
    const results = {
        timestamp: new Date().toISOString(),
        device: {
            userAgent: navigator.userAgent,
            viewport: `${window.innerWidth}x${window.innerHeight}`,
            connection: navigator.connection ? navigator.connection.effectiveType : 'unknown',
            online: navigator.onLine
        },
        tests: {}
    };
    
    console.log('📱 Información del dispositivo:', results.device);
    
    // Test 1: Conectividad básica
    console.log('\n🔍 TEST 1: CONECTIVIDAD BÁSICA');
    console.log('==============================');
    
    timer.start('Conectividad');
    
    try {
        // Test local backend
        const localHealthResponse = await fetch(`${CONFIG.LOCAL_API}/render-health`);
        results.tests.localBackend = {
            url: `${CONFIG.LOCAL_API}/render-health`,
            status: localHealthResponse.status,
            ok: localHealthResponse.ok,
            data: await localHealthResponse.json()
        };
        console.log('✅ Backend local:', localHealthResponse.status);
        
        // Test producción backend
        const prodHealthResponse = await fetch(`${CONFIG.PROD_API}/render-health`);
        results.tests.prodBackend = {
            url: `${CONFIG.PROD_API}/render-health`,
            status: prodHealthResponse.status,
            ok: prodHealthResponse.ok,
            data: await prodHealthResponse.json()
        };
        console.log('✅ Backend producción:', prodHealthResponse.status);
        
    } catch (error) {
        console.log('❌ Error en conectividad:', error.message);
        results.tests.connectivity = { error: error.message };
    }
    
    timer.end('Conectividad');
    
    // Test 2: APIs de datos
    console.log('\n🔍 TEST 2: APIs DE DATOS');
    console.log('========================');
    
    timer.start('APIs');
    
    try {
        // Test obtener todas las resoluciones
        const allBooksResponse = await fetch(`${CONFIG.LOCAL_API}/api/books/all`);
        const allBooks = await allBooksResponse.json();
        
        results.tests.allBooks = {
            url: `${CONFIG.LOCAL_API}/api/books/all`,
            status: allBooksResponse.status,
            count: allBooks.length,
            success: allBooksResponse.ok
        };
        
        console.log(`✅ Resoluciones obtenidas: ${allBooks.length}`);
        
        // Test obtener resolución específica
        const specificResponse = await fetch(`${CONFIG.LOCAL_API}/api/books/${CONFIG.TEST_RESOLUTION}`);
        const specificBook = await specificResponse.json();
        
        results.tests.specificBook = {
            url: `${CONFIG.LOCAL_API}/api/books/${CONFIG.TEST_RESOLUTION}`,
            status: specificResponse.status,
            hasImages: specificBook[0] && specificBook[0].images && specificBook[0].images.length > 0,
            imageCount: specificBook[0] ? (specificBook[0].images || []).length : 0,
            success: specificResponse.ok
        };
        
        console.log(`✅ Resolución específica: ${specificBook[0] ? specificBook[0].asunto : 'No encontrada'}`);
        console.log(`📷 Imágenes encontradas: ${results.tests.specificBook.imageCount}`);
        
    } catch (error) {
        console.log('❌ Error en APIs:', error.message);
        results.tests.apis = { error: error.message };
    }
    
    timer.end('APIs');
    
    // Test 3: Carga de imágenes
    console.log('\n🔍 TEST 3: CARGA DE IMÁGENES');
    console.log('============================');
    
    timer.start('Imágenes');
    
    const imageTests = [
        { name: 'local', url: `${CONFIG.LOCAL_API}/uploads/${CONFIG.TEST_IMAGE}` },
        { name: 'prod', url: `${CONFIG.PROD_API}/uploads/${CONFIG.TEST_IMAGE}` }
    ];
    
    for (const test of imageTests) {
        try {
            // Test HEAD request
            const headResponse = await fetch(test.url, { method: 'HEAD' });
            
            // Test carga real de imagen
            const imageLoadTest = await new Promise((resolve) => {
                const img = new Image();
                const timeout = setTimeout(() => {
                    resolve({ success: false, error: 'timeout' });
                }, 10000);
                
                img.onload = () => {
                    clearTimeout(timeout);
                    resolve({
                        success: true,
                        dimensions: `${img.naturalWidth}x${img.naturalHeight}`,
                        size: img.naturalWidth * img.naturalHeight
                    });
                };
                
                img.onerror = () => {
                    clearTimeout(timeout);
                    resolve({ success: false, error: 'load_error' });
                };
                
                img.crossOrigin = 'anonymous';
                img.src = test.url;
            });
            
            results.tests[`image_${test.name}`] = {
                url: test.url,
                headStatus: headResponse.status,
                headOk: headResponse.ok,
                loadSuccess: imageLoadTest.success,
                dimensions: imageLoadTest.dimensions,
                error: imageLoadTest.error
            };
            
            console.log(`${imageLoadTest.success ? '✅' : '❌'} Imagen ${test.name}: ${imageLoadTest.success ? imageLoadTest.dimensions : imageLoadTest.error}`);
            
        } catch (error) {
            console.log(`❌ Error imagen ${test.name}:`, error.message);
            results.tests[`image_${test.name}`] = { error: error.message };
        }
    }
    
    timer.end('Imágenes');
    
    // Test 4: Simulación de funciones frontend
    console.log('\n🔍 TEST 4: FUNCIONES FRONTEND');
    console.log('=============================');
    
    timer.start('Frontend');
    
    // Simular imageUtils.js functions
    try {
        // Función de detección móvil
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth <= 768;
        
        // Función de generación de URL
        const getImageUrl = (imagePath) => {
            const baseUrl = CONFIG.LOCAL_API;
            const fullPath = imagePath.startsWith('uploads/') ? imagePath : `uploads/${imagePath}`;
            return `${baseUrl}/${fullPath}`;
        };
        
        // Test de generación de URL
        const testUrl = getImageUrl(CONFIG.TEST_IMAGE);
        
        results.tests.frontend = {
            isMobileDetected: isMobile,
            urlGeneration: testUrl,
            expectedUrl: `${CONFIG.LOCAL_API}/uploads/${CONFIG.TEST_IMAGE}`,
            urlCorrect: testUrl === `${CONFIG.LOCAL_API}/uploads/${CONFIG.TEST_IMAGE}`
        };
        
        console.log(`✅ Detección móvil: ${isMobile}`);
        console.log(`✅ URL generada: ${testUrl}`);
        console.log(`✅ URL correcta: ${results.tests.frontend.urlCorrect}`);
        
    } catch (error) {
        console.log('❌ Error funciones frontend:', error.message);
        results.tests.frontend = { error: error.message };
    }
    
    timer.end('Frontend');
    
    // Test 5: Performance móvil
    console.log('\n🔍 TEST 5: PERFORMANCE MÓVIL');
    console.log('=============================');
    
    timer.start('Performance');
    
    try {
        const perfData = {
            memory: performance.memory ? {
                used: Math.round(performance.memory.usedJSHeapSize / 1024 / 1024),
                total: Math.round(performance.memory.totalJSHeapSize / 1024 / 1024),
                limit: Math.round(performance.memory.jsHeapSizeLimit / 1024 / 1024)
            } : 'No disponible',
            connection: navigator.connection ? {
                effectiveType: navigator.connection.effectiveType,
                downlink: navigator.connection.downlink,
                rtt: navigator.connection.rtt,
                saveData: navigator.connection.saveData
            } : 'No disponible',
            storage: {
                localStorage: (() => {
                    try {
                        localStorage.setItem('test', 'test');
                        localStorage.removeItem('test');
                        return 'Disponible';
                    } catch (e) {
                        return 'No disponible';
                    }
                })()
            }
        };
        
        results.tests.performance = perfData;
        
        console.log('📊 Memoria:', perfData.memory);
        console.log('📶 Conexión:', perfData.connection);
        console.log('💾 Storage:', perfData.storage);
        
    } catch (error) {
        console.log('❌ Error performance:', error.message);
        results.tests.performance = { error: error.message };
    }
    
    timer.end('Performance');
    
    // Resumen final
    console.log('\n🎯 RESUMEN FINAL');
    console.log('================');
    
    const summary = {
        backendLocal: results.tests.localBackend?.ok || false,
        backendProd: results.tests.prodBackend?.ok || false,
        apisWorking: results.tests.allBooks?.success && results.tests.specificBook?.success,
        imagesLocal: results.tests.image_local?.loadSuccess || false,
        imagesProd: results.tests.image_prod?.loadSuccess || false,
        frontendFunctions: results.tests.frontend?.urlCorrect || false
    };
    
    const allWorking = Object.values(summary).every(Boolean);
    
    console.log('📊 Estado de componentes:');
    Object.entries(summary).forEach(([key, value]) => {
        console.log(`${value ? '✅' : '❌'} ${key}: ${value}`);
    });
    
    console.log(`\n🎉 RESULTADO GENERAL: ${allWorking ? '✅ TODO FUNCIONANDO' : '❌ HAY PROBLEMAS'}`);
    
    if (allWorking) {
        console.log('\n🎯 ¡SISTEMA COMPLETAMENTE FUNCIONAL EN MÓVILES!');
        console.log('Las imágenes deberían visualizarse correctamente.');
    } else {
        console.log('\n🔧 Problemas detectados que requieren atención:');
        Object.entries(summary).forEach(([key, value]) => {
            if (!value) {
                console.log(`⚠️ ${key} no está funcionando`);
            }
        });
    }
    
    // Almacenar resultados
    window.mobileTestResults = results;
    console.log('\n💾 Resultados completos guardados en window.mobileTestResults');
    
    return results;
}

// Ejecutar test automáticamente
runCompleteTest().then(results => {
    console.log('\n📋 Para exportar resultados:');
    console.log('JSON.stringify(window.mobileTestResults, null, 2)');
}).catch(error => {
    console.error('❌ Error en test completo:', error);
});

console.log('\n⏳ Ejecutando test completo... Por favor espera...');
