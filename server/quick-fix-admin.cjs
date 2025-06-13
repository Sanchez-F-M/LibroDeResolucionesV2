const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

async function updateAdmin() {
  try {
    console.log('🔧 Actualizando rol del usuario admin...');
    const result = await pool.query(
      'UPDATE users SET Rol = $1 WHERE Nombre = $2 RETURNING *',
      ['admin', 'admin']
    );
    console.log('✅ Resultado:', result.rows);
    
    console.log('\n📋 Verificando todos los usuarios:');
    const allUsers = await pool.query('SELECT ID, Nombre, Rol FROM users ORDER BY ID');
    console.table(allUsers.rows);
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await pool.end();
  }
}

updateAdmin();
