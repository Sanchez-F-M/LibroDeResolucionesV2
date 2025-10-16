// Configuración de base de datos PostgreSQL
import dotenv from 'dotenv';
dotenv.config();

console.log('� Usando PostgreSQL');

// Importar PostgreSQL
const postgresModule = await import('./postgres-connection.js');
const db = postgresModule.default;

// Inicializar PostgreSQL
try {
  await postgresModule.initDatabase();
  console.log('✅ PostgreSQL inicializado correctamente');
} catch (error) {
  console.error('❌ Error al inicializar PostgreSQL:', error);
  console.error('Detalles:', error.message);
  throw new Error(
    'No se pudo conectar a la base de datos PostgreSQL. Verifica la configuración de DATABASE_URL.'
  );
}

export default db;
