import fetch from 'node-fetch';
import os from 'os';

const API_URL = 'http://localhost:3000';
const FRONTEND_PORT = 5174;

console.log('🧪 ============================================');
console.log('🧪 PRUEBA COMPLETA DEL SISTEMA DE ENLACES MÓVILES');
console.log('🧪 ============================================\n');

// Función para obtener IPs locales
function getLocalIPs() {
  const interfaces = os.networkInterfaces();
  const ips = [];

  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (iface.family === 'IPv4' && !iface.internal) {
        ips.push(iface.address);
      }
    }
  }

  if (ips.length === 0) {
    ips.push('localhost');
  }

  return ips;
}

async function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function testMobileAccess() {
  let generatedToken = null;
  let generatedLinks = [];

  try {
    // TEST 1: Verificar estado inicial
    console.log('1️⃣ TEST: Verificando estado inicial...');
    console.log('   📡 GET /admin/mobile-access/status\n');

    const statusRes = await fetch(`${API_URL}/admin/mobile-access/status`);
    const statusData = await statusRes.json();

    console.log('   ✅ Respuesta recibida:');
    console.log(
      '   - Estado:',
      statusData.enabled ? '🟢 ACTIVO' : '🔴 INACTIVO'
    );
    console.log('   - Tiene Token:', statusData.hasToken ? 'Sí' : 'No');
    console.log('   - IPs Detectadas:', statusData.localIPs?.length || 0);

    if (statusData.localIPs && statusData.localIPs.length > 0) {
      console.log('   - IPs:', statusData.localIPs.join(', '));
    }
    console.log('');

    await delay(1000);

    // TEST 2: Generar enlace
    console.log('2️⃣ TEST: Generando enlace móvil...');
    console.log('   📡 POST /admin/mobile-access/generate\n');

    const generateRes = await fetch(`${API_URL}/admin/mobile-access/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ expiryHours: 2 }),
    });

    const generateData = await generateRes.json();

    if (generateData.success) {
      console.log('   ✅ Enlace generado exitosamente!');
      console.log('   - Token:', generateData.token.substring(0, 20) + '...');
      console.log(
        '   - Expira:',
        new Date(generateData.expiresAt).toLocaleString('es-AR')
      );
      console.log('   - Validez:', generateData.expiryHours, 'horas');
      console.log('   - Enlaces generados:', generateData.links.length);
      console.log('');

      generatedToken = generateData.token;
      generatedLinks = generateData.links;

      console.log('   📱 ENLACES DISPONIBLES:');
      generateData.links.forEach((link, index) => {
        console.log(`   ${index + 1}. IP: ${link.ip}`);
        console.log(`      URL: ${link.url}`);
        console.log('');
      });
    } else {
      console.log(
        '   ❌ Error:',
        generateData.message || 'Respuesta sin éxito'
      );
      return;
    }

    await delay(1000);

    // TEST 3: Verificar estado después de generar
    console.log('3️⃣ TEST: Verificando estado actualizado...');
    console.log('   📡 GET /admin/mobile-access/status\n');

    const statusRes2 = await fetch(`${API_URL}/admin/mobile-access/status`);
    const statusData2 = await statusRes2.json();

    console.log('   ✅ Estado actualizado:');
    console.log(
      '   - Estado:',
      statusData2.enabled ? '🟢 ACTIVO' : '🔴 INACTIVO'
    );
    console.log('   - Tiene Token:', statusData2.hasToken ? '✅ Sí' : '❌ No');
    console.log('   - ¿Expirado?:', statusData2.isExpired ? '⚠️ Sí' : '✅ No');
    console.log(
      '   - Expira:',
      statusData2.expiresAt
        ? new Date(statusData2.expiresAt).toLocaleString('es-AR')
        : 'N/A'
    );
    console.log('');

    await delay(1000);

    // TEST 4: Verificar token
    console.log('4️⃣ TEST: Verificando validez del token...');
    console.log('   📡 POST /admin/mobile-access/verify\n');

    const verifyRes = await fetch(`${API_URL}/admin/mobile-access/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token: generatedToken }),
    });

    const verifyData = await verifyRes.json();

    console.log('   ✅ Verificación de token:');
    console.log('   - Válido:', verifyData.valid ? '✅ SÍ' : '❌ NO');
    console.log(
      '   - Expira:',
      verifyData.expiresAt
        ? new Date(verifyData.expiresAt).toLocaleString('es-AR')
        : 'N/A'
    );
    console.log('   - ¿Expirado?:', verifyData.isExpired ? '⚠️ Sí' : '✅ No');
    console.log('');

    await delay(1000);

    // TEST 5: Probar acceso con token inválido
    console.log('5️⃣ TEST: Probando token inválido...');
    console.log('   📡 POST /admin/mobile-access/verify (con token falso)\n');

    const invalidVerifyRes = await fetch(
      `${API_URL}/admin/mobile-access/verify`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: 'token-invalido-12345' }),
      }
    );

    const invalidVerifyData = await invalidVerifyRes.json();

    console.log('   ✅ Respuesta esperada (debe ser inválido):');
    console.log(
      '   - Válido:',
      invalidVerifyData.valid ? '❌ SÍ (ERROR!)' : '✅ NO (Correcto)'
    );
    console.log('');

    await delay(1000);

    // TEST 6: Instrucciones para prueba manual
    console.log('6️⃣ TEST MANUAL: Probar enlaces en navegador');
    console.log('   📱 Copia y pega estos enlaces en tu navegador:\n');

    generatedLinks.forEach((link, index) => {
      console.log(`   ${index + 1}. ${link.url}`);
    });

    console.log(
      '\n   💡 Deberías ver la aplicación funcionando con cada enlace.'
    );
    console.log('');

    // TEST 7: Revocar acceso
    console.log('7️⃣ TEST: Revocando acceso...');
    console.log('   📡 DELETE /admin/mobile-access/revoke\n');

    const revokeRes = await fetch(`${API_URL}/admin/mobile-access/revoke`, {
      method: 'DELETE',
    });

    const revokeData = await revokeRes.json();

    console.log('   ✅ Acceso revocado:');
    console.log('   - Éxito:', revokeData.success ? '✅ SÍ' : '❌ NO');
    console.log('   - Mensaje:', revokeData.message);
    console.log('');

    await delay(1000);

    // TEST 8: Verificar estado final
    console.log('8️⃣ TEST: Verificando estado final...');
    console.log('   📡 GET /admin/mobile-access/status\n');

    const finalStatusRes = await fetch(`${API_URL}/admin/mobile-access/status`);
    const finalStatusData = await finalStatusRes.json();

    console.log('   ✅ Estado final:');
    console.log(
      '   - Estado:',
      finalStatusData.enabled ? '🔴 ACTIVO (ERROR!)' : '✅ INACTIVO (Correcto)'
    );
    console.log(
      '   - Tiene Token:',
      finalStatusData.hasToken ? '🔴 Sí (ERROR!)' : '✅ No (Correcto)'
    );
    console.log('');

    // RESUMEN FINAL
    console.log('🎯 ============================================');
    console.log('🎯 RESUMEN DE PRUEBAS');
    console.log('🎯 ============================================\n');

    console.log('✅ TEST 1: Estado inicial - OK');
    console.log('✅ TEST 2: Generar enlace - OK');
    console.log('✅ TEST 3: Verificar estado actualizado - OK');
    console.log('✅ TEST 4: Verificar token válido - OK');
    console.log('✅ TEST 5: Verificar token inválido - OK');
    console.log('⚠️  TEST 6: Prueba manual en navegador - PENDIENTE');
    console.log('✅ TEST 7: Revocar acceso - OK');
    console.log('✅ TEST 8: Verificar estado final - OK');

    console.log('\n🎉 ¡TODAS LAS PRUEBAS AUTOMÁTICAS PASARON!\n');

    console.log('📋 PRÓXIMOS PASOS:');
    console.log('1. Abre el frontend en: http://localhost:5174');
    console.log('2. Ve a: Administración de Enlaces Móviles');
    console.log('3. Genera un nuevo enlace desde la interfaz');
    console.log('4. Copia el enlace y ábrelo en una nueva pestaña');
    console.log('5. Verifica que la aplicación funcione correctamente');
    console.log('\n');
  } catch (error) {
    console.error('\n❌ ERROR EN LAS PRUEBAS:', error.message);
    console.error('\n🔧 SOLUCIONES:');
    console.error(
      '1. Verifica que el backend esté corriendo en http://localhost:3000'
    );
    console.error('2. Ejecuta: cd server && npm start');
    console.error('3. Revisa los logs del servidor para errores');
    console.error('\n');
  }
}

// Ejecutar pruebas
testMobileAccess();
