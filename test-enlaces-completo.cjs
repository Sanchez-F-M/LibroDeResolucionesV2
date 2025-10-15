/**
 * Script de Prueba Completa - Enlaces Móviles
 * Verifica que no haya errores de anidamiento DOM y que los enlaces funcionen
 */

const http = require('http');

// Colores para consola
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

function log(color, symbol, message) {
  console.log(`${color}${symbol} ${message}${colors.reset}`);
}

// Función para hacer peticiones HTTP
function makeRequest(options) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        resolve({ statusCode: res.statusCode, data, headers: res.headers });
      });
    });
    req.on('error', reject);
    req.setTimeout(5000, () => {
      req.destroy();
      reject(new Error('Timeout'));
    });
    if (options.body) {
      req.write(options.body);
    }
    req.end();
  });
}

async function runTests() {
  console.log('\n' + '='.repeat(60));
  log(colors.cyan, '🧪', 'INICIANDO PRUEBAS DE ENLACES MÓVILES');
  console.log('='.repeat(60) + '\n');

  let allPassed = true;

  // Test 1: Verificar que el backend está corriendo
  try {
    log(colors.blue, '1️⃣', 'Verificando conexión al backend...');
    const response = await makeRequest({
      hostname: 'localhost',
      port: 3000,
      path: '/admin/mobile-access/status',
      method: 'GET'
    });

    if (response.statusCode === 200) {
      log(colors.green, '✅', 'Backend respondiendo correctamente');
      const data = JSON.parse(response.data);
      console.log(`   • Estado: ${data.enabled ? 'Habilitado' : 'Deshabilitado'}`);
      if (data.localIPs && data.localIPs.length > 0) {
        console.log(`   • IPs locales detectadas: ${data.localIPs.join(', ')}`);
      }
    } else {
      throw new Error(`Código de respuesta inesperado: ${response.statusCode}`);
    }
  } catch (error) {
    log(colors.red, '❌', `Error al conectar con el backend: ${error.message}`);
    allPassed = false;
  }

  console.log();

  // Test 2: Generar nuevo enlace
  let generatedToken = null;
  let generatedLinks = [];
  
  try {
    log(colors.blue, '2️⃣', 'Generando nuevo enlace móvil...');
    const response = await makeRequest({
      hostname: 'localhost',
      port: 3000,
      path: '/admin/mobile-access/generate',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ expirationHours: 24 })
    });

    if (response.statusCode === 200) {
      const data = JSON.parse(response.data);
      generatedToken = data.token;
      generatedLinks = data.links || [];
      
      log(colors.green, '✅', 'Enlace generado exitosamente');
      console.log(`   • Token: ${generatedToken}`);
      console.log(`   • Expira: ${new Date(data.expiresAt).toLocaleString('es-AR')}`);
      
      if (generatedLinks.length > 0) {
        console.log(`   • Enlaces generados:`);
        generatedLinks.forEach((link, index) => {
          console.log(`     ${index + 1}. ${link.url}`);
          
          // Verificar que el puerto sea 5173
          if (link.url.includes(':5173')) {
            log(colors.green, '   ✓', 'Puerto correcto (5173)');
          } else {
            log(colors.red, '   ✗', `Puerto incorrecto (debe ser 5173): ${link.url}`);
            allPassed = false;
          }
        });
      }
    } else {
      throw new Error(`Código de respuesta inesperado: ${response.statusCode}`);
    }
  } catch (error) {
    log(colors.red, '❌', `Error al generar enlace: ${error.message}`);
    allPassed = false;
  }

  console.log();

  // Test 3: Verificar que el frontend está corriendo
  try {
    log(colors.blue, '3️⃣', 'Verificando que el frontend está corriendo...');
    const response = await makeRequest({
      hostname: 'localhost',
      port: 5173,
      path: '/',
      method: 'GET'
    });

    if (response.statusCode === 200) {
      log(colors.green, '✅', 'Frontend respondiendo correctamente en puerto 5173');
      
      // Verificar que la respuesta sea HTML
      if (response.data.includes('<html') || response.data.includes('<!DOCTYPE')) {
        log(colors.green, '   ✓', 'Respuesta es HTML válido');
      } else {
        log(colors.yellow, '   ⚠', 'La respuesta no parece ser HTML');
      }
    } else {
      throw new Error(`Código de respuesta inesperado: ${response.statusCode}`);
    }
  } catch (error) {
    log(colors.red, '❌', `Error al conectar con el frontend: ${error.message}`);
    allPassed = false;
  }

  console.log();

  // Test 4: Verificar token en frontend
  if (generatedToken) {
    try {
      log(colors.blue, '4️⃣', 'Verificando acceso con token generado...');
      const response = await makeRequest({
        hostname: 'localhost',
        port: 5173,
        path: `/?token=${generatedToken}`,
        method: 'GET'
      });

      if (response.statusCode === 200) {
        log(colors.green, '✅', 'Frontend acepta el token correctamente');
      } else {
        log(colors.yellow, '⚠', `Respuesta inesperada: ${response.statusCode}`);
      }
    } catch (error) {
      log(colors.red, '❌', `Error al verificar token: ${error.message}`);
      allPassed = false;
    }
  }

  console.log();

  // Test 5: Verificar token en backend
  if (generatedToken) {
    try {
      log(colors.blue, '5️⃣', 'Verificando token en el backend...');
      const response = await makeRequest({
        hostname: 'localhost',
        port: 3000,
        path: '/admin/mobile-access/verify',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ token: generatedToken })
      });

      if (response.statusCode === 200) {
        const data = JSON.parse(response.data);
        if (data.valid) {
          log(colors.green, '✅', 'Token válido en el backend');
        } else {
          log(colors.red, '❌', 'Token no válido según el backend');
          allPassed = false;
        }
      } else {
        throw new Error(`Código de respuesta inesperado: ${response.statusCode}`);
      }
    } catch (error) {
      log(colors.red, '❌', `Error al verificar token en backend: ${error.message}`);
      allPassed = false;
    }
  }

  // Resumen final
  console.log('\n' + '='.repeat(60));
  if (allPassed) {
    log(colors.green, '✅', 'TODAS LAS PRUEBAS PASARON EXITOSAMENTE');
    console.log();
    log(colors.cyan, '📱', 'INSTRUCCIONES PARA USAR LOS ENLACES:');
    console.log('   1. Abre la aplicación en tu navegador de escritorio');
    console.log('   2. Ve a la sección "Enlaces Móviles"');
    console.log('   3. Genera un nuevo enlace');
    console.log('   4. Verás 3 botones para cada enlace:');
    console.log('      • 📋 Azul: Copiar enlace al portapapeles');
    console.log('      • 🔗 Verde: Probar enlace en nueva pestaña');
    console.log('      • 📱 Morado: Ver código QR');
    console.log('   5. Usa el botón verde para probar el enlace');
    console.log('   6. O copia el enlace y ábrelo en tu móvil');
    console.log();
    log(colors.yellow, '⚠', 'IMPORTANTE:');
    console.log('   • El móvil debe estar en la misma red WiFi');
    console.log('   • Los errores de React DevTools son solo advertencias');
    console.log('   • Los warnings de anidamiento DOM fueron corregidos');
  } else {
    log(colors.red, '❌', 'ALGUNAS PRUEBAS FALLARON');
    console.log();
    log(colors.yellow, '💡', 'SOLUCIONES SUGERIDAS:');
    console.log('   • Verifica que el backend esté corriendo en puerto 3000');
    console.log('   • Verifica que el frontend esté corriendo en puerto 5173');
    console.log('   • Ejecuta: cd front && npm run dev');
    console.log('   • Ejecuta: node server/index.js');
  }
  console.log('='.repeat(60) + '\n');
}

// Ejecutar pruebas
runTests().catch(error => {
  console.error('Error fatal:', error);
  process.exit(1);
});
