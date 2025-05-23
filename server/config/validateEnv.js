// Validación de variables de entorno requeridas
const requiredEnvVars = ['JWT_SECRET_KEY', 'DB_HOST', 'DB_USER', 'DB_NAME'];

export function validateEnvironment() {
  const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
  
  if (missingVars.length > 0) {
    console.error('❌ Variables de entorno faltantes:', missingVars.join(', '));
    console.error('Por favor, configura estas variables antes de iniciar el servidor.');
    process.exit(1);
  }
  
  console.log('✅ Variables de entorno validadas correctamente');
}
