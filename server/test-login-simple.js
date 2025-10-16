// Prueba simple de login sin importar módulos del servidor
import fetch from 'node-fetch';

const BASE_URL = 'http://localhost:3000';

async function testLogin(username, password) {
  console.log(`\n🧪 Probando login: ${username} / ${password}`);
  console.log('─'.repeat(60));

  try {
    const response = await fetch(`${BASE_URL}/api/user/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ Nombre: username, Contrasena: password }),
    });

    const data = await response.json();

    if (response.ok) {
      console.log('✅ LOGIN EXITOSO');
      console.log('📊 Usuario:', data.user);
      console.log('🎫 Token:', data.token.substring(0, 50) + '...');
      return true;
    } else {
      console.log('❌ LOGIN FALLIDO');
      console.log('📊 Status:', response.status);
      console.log('📊 Error:', data);
      return false;
    }
  } catch (error) {
    console.log('❌ ERROR DE CONEXIÓN');
    console.log('📊 Error:', error.message);
    return false;
  }
}

async function main() {
  console.log('🚀 PRUEBAS DE LOGIN - PostgreSQL');
  console.log('═'.repeat(60));

  // Probar conexión al servidor
  try {
    const health = await fetch(`${BASE_URL}/health`);
    if (!health.ok) throw new Error('Servidor no responde');
    console.log('✅ Servidor está corriendo\n');
  } catch (error) {
    console.log('❌ Error: Servidor no está corriendo en', BASE_URL);
    process.exit(1);
  }

  const tests = [
    ['Admin', 'admin123'],
    ['admin', 'admin123'],
    ['secretaria', 'secretaria123'],
    ['usuario', 'usuario123'],
    ['admin', 'wrongpass'],
    ['noexiste', 'admin123'],
  ];

  let passed = 0;
  let failed = 0;

  for (const [user, pass] of tests) {
    const result = await testLogin(user, pass);
    if (result) passed++;
    else failed++;
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  console.log('\n' + '═'.repeat(60));
  console.log('📊 RESUMEN');
  console.log('═'.repeat(60));
  console.log(`✅ Exitosos: ${passed}`);
  console.log(`❌ Fallidos: ${failed}`);
  console.log(`📊 Total: ${passed + failed}`);
  console.log('═'.repeat(60));
}

main();
