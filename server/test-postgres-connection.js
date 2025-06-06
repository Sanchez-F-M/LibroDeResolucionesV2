// Test PostgreSQL connection
import db from './db/connection.js';

async function testConnection() {
  try {
    console.log('🔄 Probando conexión a PostgreSQL...');
    const result = await db.query('SELECT COUNT(*) as count FROM resolution');
    console.log('✅ PostgreSQL conectado exitosamente');
    console.log('📊 Resoluciones existentes:', result.rows[0].count);
    
    // También verificar imágenes
    const imagesResult = await db.query('SELECT COUNT(*) as count FROM images');
    console.log('📊 Imágenes existentes:', imagesResult.rows[0].count);
    
    // Verificar usuarios
    const usersResult = await db.query('SELECT COUNT(*) as count FROM users');
    console.log('📊 Usuarios existentes:', usersResult.rows[0].count);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error conectando a PostgreSQL:', error.message);
    console.error('Detalles:', error);
    process.exit(1);
  }
}

testConnection();
