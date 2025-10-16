import fetch from 'node-fetch';

const BASE_URL = 'http://localhost:3000';

async function testLogin(username, password) {
  console.log(`\n🧪 Probando login con: ${username} / ${password}`);
  console.log('─'.repeat(60));

  try {
    const response = await fetch(`${BASE_URL}/api/user/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        Nombre: username,
        Contrasena: password,
      }),
    });

    const data = await response.json();

    if (response.ok) {
      console.log('✅ LOGIN EXITOSO');
      console.log('📊 Respuesta:', JSON.stringify(data, null, 2));
      return true;
    } else {
      console.log('❌ LOGIN FALLIDO');
      console.log('📊 Status:', response.status);
      console.log('📊 Error:', JSON.stringify(data, null, 2));
      return false;
    }
  } catch (error) {
    console.log('❌ ERROR DE CONEXIÓN');
    console.log('📊 Error:', error.message);
    return false;
  }
}

async function runAllTests() {
  console.log('\n🚀 INICIANDO PRUEBAS DE LOGIN');
  console.log('═'.repeat(60));

  // Verificar que el servidor esté corriendo
  console.log('\n🔍 Verificando servidor...');
  try {
    const healthCheck = await fetch(`${BASE_URL}/health`);
    if (healthCheck.ok) {
      console.log('✅ Servidor está corriendo en', BASE_URL);
    } else {
      console.log('⚠️  Servidor respondió con status:', healthCheck.status);
    }
  } catch (error) {
    console.log('❌ No se pudo conectar al servidor');
    console.log(
      '💡 Asegúrate de que el servidor esté corriendo en puerto 3000'
    );
    return;
  }

  // Pruebas de login
  const tests = [
    {
      username: 'Admin',
      password: 'admin123',
      description: 'Admin con mayúscula',
    },
    {
      username: 'admin',
      password: 'admin123',
      description: 'admin con minúscula',
    },
    {
      username: 'secretaria',
      password: 'secretaria123',
      description: 'Usuario secretaria',
    },
    {
      username: 'usuario',
      password: 'usuario123',
      description: 'Usuario normal',
    },
    {
      username: 'admin',
      password: 'wrongpassword',
      description: 'Contraseña incorrecta',
    },
    {
      username: 'noexiste',
      password: 'admin123',
      description: 'Usuario inexistente',
    },
  ];

  let passed = 0;
  let failed = 0;

  for (const test of tests) {
    const result = await testLogin(test.username, test.password);
    if (result) {
      passed++;
    } else {
      failed++;
    }
    // Esperar un poco entre pruebas
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  console.log('\n═'.repeat(60));
  console.log('📊 RESUMEN DE PRUEBAS');
  console.log('═'.repeat(60));
  console.log(`✅ Exitosas: ${passed}`);
  console.log(`❌ Fallidas: ${failed}`);
  console.log(`📊 Total: ${passed + failed}`);
  console.log('═'.repeat(60));
}

runAllTests().catch(console.error);
