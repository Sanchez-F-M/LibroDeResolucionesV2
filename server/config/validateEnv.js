// Validación de variables de entorno requeridas para PostgreSQL
const requiredEnvVars = ['JWT_SECRET_KEY', 'FRONTEND_URL', 'DATABASE_URL'];

export function validateEnvironment() {
  const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
  
  if (missingVars.length > 0) {
    console.error('❌ Variables de entorno faltantes:', missingVars.join(', '));
    console.error('Por favor, configura estas variables antes de iniciar el servidor.');
    process.exit(1);
  }
  
  console.log('✅ Variables de entorno validadas correctamente');
}
