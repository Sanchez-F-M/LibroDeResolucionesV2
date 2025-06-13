import pkg from 'pg';
const { Pool } = pkg;
import dotenv from 'dotenv';
dotenv.config();

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

async function updateAdminRole() {
  try {
    console.log('🔧 Actualizando rol del usuario admin...');
    
    // Actualizar el usuario admin
    const updateResult = await pool.query(
      `UPDATE users SET Rol = $1 WHERE Nombre = $2 RETURNING *`,
      ['admin', 'admin']
    );
    
    if (updateResult.rows.length > 0) {
      console.log('✅ Usuario admin actualizado exitosamente:');
      console.table(updateResult.rows);
    } else {
      console.log('❌ No se encontró usuario con nombre "admin"');
    }
    
    // Verificar todos los usuarios después de la actualización
    console.log('\n🔍 Estado final de todos los usuarios:');
    const allUsers = await pool.query('SELECT ID, Nombre, Rol, created_at FROM users ORDER BY ID');
    console.table(allUsers.rows);
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await pool.end();
  }
}

updateAdminRole();
