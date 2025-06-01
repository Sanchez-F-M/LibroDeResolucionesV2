// 🔍 DIAGNÓSTICO AVANZADO PARA PROBLEMAS DE IMÁGENES EN MÓVILES
// Ejecutar en la consola del navegador móvil para identificar la causa raíz

console.log('🚀 DIAGNÓSTICO AVANZADO INICIADO');
console.log('Timestamp:', new Date().toISOString());

// 1. INFORMACIÓN DEL ENTORNO
console.log('\n📱 INFORMACIÓN DEL DISPOSITIVO:');
console.log('User-Agent:', navigator.userAgent);
console.log('Viewport:', window.innerWidth + 'x' + window.innerHeight);
console.log('Connection:', navigator.connection ? navigator.connection.effectiveType : 'No disponible');
console.log('Online:', navigator.onLine);
console.log('Protocol:', window.location.protocol);
console.log('Host:', window.location.host);

// 2. VARIABLES DE ENTORNO
console.log('\n🔧 VARIABLES DE ENTORNO:');
const apiBaseUrl = window.__VITE_CONFIG__?.VITE_API_BASE_URL || 'No configurada';
console.log('VITE_API_BASE_URL:', apiBaseUrl);

// 3. TEST DE CONECTIVIDAD PASO A PASO
console.log('\n🌐 TESTS DE CONECTIVIDAD:');

const runConnectivityTests = async () => {
  const results = {};
  
  // Test 1: Backend Health Check
  console.log('\n🔍 Test 1: Backend Health Check');
  try {
    const healthUrl = 'https://libro-resoluciones-backend.onrender.com/render-health';
    const response = await fetch(healthUrl, {
      method: 'GET',
      mode: 'cors',
      cache: 'no-cache'
    });
    
    results.healthCheck = {
      url: healthUrl,
      status: response.status,
      ok: response.ok,
      headers: Object.fromEntries(response.headers.entries())
    };
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Backend health OK:', data);
      results.healthCheck.data = data;
    } else {
      console.log('❌ Backend health failed:', response.status);
    }
  } catch (error) {
    console.log('❌ Backend health error:', error.message);
    results.healthCheck = { error: error.message };
  }
  
  // Test 2: CORS Preflight
  console.log('\n🔍 Test 2: CORS Preflight');
  try {
    const corsUrl = 'https://libro-resoluciones-backend.onrender.com/api/books';
    const corsResponse = await fetch(corsUrl, {
      method: 'OPTIONS',
      headers: {
        'Origin': window.location.origin,
        'Access-Control-Request-Method': 'GET',
        'Access-Control-Request-Headers': 'Content-Type'
      }
    });
    
    results.corsTest = {
      url: corsUrl,
      status: corsResponse.status,
      headers: Object.fromEntries(corsResponse.headers.entries())
    };
    
    console.log('✅ CORS preflight status:', corsResponse.status);
    console.log('CORS headers:', Object.fromEntries(corsResponse.headers.entries()));
  } catch (error) {
    console.log('❌ CORS preflight error:', error.message);
    results.corsTest = { error: error.message };
  }
  
  // Test 3: API Endpoint Test
  console.log('\n🔍 Test 3: API Endpoint');
  try {
    const apiUrl = 'https://libro-resoluciones-backend.onrender.com/api/books';
    const apiResponse = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });
    
    results.apiTest = {
      url: apiUrl,
      status: apiResponse.status,
      ok: apiResponse.ok
    };
    
    if (apiResponse.ok) {
      console.log('✅ API endpoint OK');
    } else {
      console.log('❌ API endpoint failed:', apiResponse.status);
    }
  } catch (error) {
    console.log('❌ API endpoint error:', error.message);
    results.apiTest = { error: error.message };
  }
  
  // Test 4: Image Direct Access
  console.log('\n🔍 Test 4: Acceso Directo a Imagen');
  const testImageUrl = 'https://libro-resoluciones-backend.onrender.com/uploads/1746055049685-diagrama_ep.png';
  
  try {
    const imageResponse = await fetch(testImageUrl, {
      method: 'HEAD',
      mode: 'cors'
    });
    
    results.imageTest = {
      url: testImageUrl,
      status: imageResponse.status,
      ok: imageResponse.ok,
      headers: Object.fromEntries(imageResponse.headers.entries())
    };
    
    console.log('✅ Image HEAD request status:', imageResponse.status);
    console.log('Image headers:', Object.fromEntries(imageResponse.headers.entries()));
    
    // Test de carga real de imagen
    const imgElement = new Image();
    imgElement.crossOrigin = 'anonymous';
    
    imgElement.onload = () => {
      console.log('✅ Imagen cargada exitosamente:', imgElement.width + 'x' + imgElement.height);
      results.imageLoad = { success: true, dimensions: imgElement.width + 'x' + imgElement.height };
    };
    
    imgElement.onerror = (error) => {
      console.log('❌ Error al cargar imagen:', error);
      results.imageLoad = { success: false, error: error.type };
    };
    
    imgElement.src = testImageUrl;
    
  } catch (error) {
    console.log('❌ Image test error:', error.message);
    results.imageTest = { error: error.message };
  }
  
  // Test 5: Network Information
  console.log('\n🔍 Test 5: Información de Red');
  if (navigator.connection) {
    results.networkInfo = {
      effectiveType: navigator.connection.effectiveType,
      downlink: navigator.connection.downlink,
      rtt: navigator.connection.rtt,
      saveData: navigator.connection.saveData
    };
    console.log('📶 Network info:', results.networkInfo);
  } else {
    console.log('📶 Network API no disponible');
    results.networkInfo = { available: false };
  }
  
  // Test 6: Storage and Cache
  console.log('\n🔍 Test 6: Storage y Cache');
  try {
    localStorage.setItem('test', 'test');
    localStorage.removeItem('test');
    results.storage = { localStorage: true };
    console.log('✅ LocalStorage disponible');
  } catch (error) {
    results.storage = { localStorage: false, error: error.message };
    console.log('❌ LocalStorage error:', error.message);
  }
  
  // Resumen final
  console.log('\n📊 RESUMEN DE RESULTADOS:');
  console.log(JSON.stringify(results, null, 2));
  
  return results;
};

// Ejecutar tests
runConnectivityTests().then(results => {
  console.log('\n🎯 RECOMENDACIONES BASADAS EN RESULTADOS:');
  
  if (results.healthCheck?.ok) {
    console.log('✅ Backend funcionando correctamente');
  } else {
    console.log('❌ PROBLEMA: Backend no accesible - Verificar URL o servicio');
  }
  
  if (results.corsTest?.status === 200) {
    console.log('✅ CORS configurado correctamente');
  } else {
    console.log('❌ PROBLEMA: CORS no configurado - Verificar headers del servidor');
  }
  
  if (results.imageTest?.ok) {
    console.log('✅ Imágenes accesibles desde el servidor');
  } else {
    console.log('❌ PROBLEMA: Imágenes no accesibles - Verificar ruta /uploads');
  }
  
  if (results.networkInfo?.effectiveType) {
    console.log(`📶 Conexión: ${results.networkInfo.effectiveType}`);
    if (['slow-2g', '2g'].includes(results.networkInfo.effectiveType)) {
      console.log('⚠️ Conexión lenta detectada - Considerar optimizaciones');
    }
  }
});

console.log('\n⏳ Ejecutando tests... Por favor espera unos segundos para ver los resultados completos.');
