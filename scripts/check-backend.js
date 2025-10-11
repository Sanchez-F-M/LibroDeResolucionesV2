const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:3000';

async function checkBackend() {
  console.log('🔍 Verificando backend en:', BACKEND_URL);

  try {
    const response = await fetch(`${BACKEND_URL}/health`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });

    if (response.ok) {
      const data = await response.json();
      console.log('✅ Backend está funcionando!');
      console.log('📊 Estado:', JSON.stringify(data, null, 2));
      return true;
    } else {
      console.log('❌ Backend respondió con error:', response.status);
      return false;
    }
  } catch (error) {
    console.log('❌ No se pudo conectar al backend');
    console.log('📋 Error:', error.message);
    console.log('\n💡 Solución:');
    console.log('   1. Asegúrese de estar en la carpeta server');
    console.log('   2. Ejecute: npm install');
    console.log('   3. Ejecute: npm run dev');
    console.log('   4. El servidor debe iniciar en http://localhost:3000\n');
    return false;
  }
}

checkBackend()
  .then(success => process.exit(success ? 0 : 1))
  .catch(error => {
    console.error('Error inesperado:', error);
    process.exit(1);
  });
