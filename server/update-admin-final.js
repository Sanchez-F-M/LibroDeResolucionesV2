import pkg from 'pg';
import dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config();

const { Pool } = pkg;

// Usar la misma configuración que el sistema
const poolConfig = {
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'libro_resoluciones',
  password: process.env.DB_PASSWORD || 'admin123',
  port: parseInt(process.env.DB_PORT) || 5433,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
};

const pool = new Pool(poolConfig);

async function updateAdminRole() {
  let client;
  
  try {
    console.log('🔧 Conectando a PostgreSQL...');
    console.log('📍 Base de datos:', poolConfig.database);
    console.log('🏠 Host:', poolConfig.host);
    console.log('🚪 Puerto:', poolConfig.port);
    
    client = await pool.connect();
    console.log('✅ Conexión exitosa');
    
    // Verificar usuarios actuales
    console.log('\n📋 Usuarios actuales:');
    const currentUsers = await client.query('SELECT "ID", "Nombre", "Rol", created_at FROM users ORDER BY "ID"');
    console.table(currentUsers.rows);
    
    // Actualizar el usuario admin
    console.log('\n🔧 Actualizando rol del usuario admin...');
    const updateResult = await client.query(
      'UPDATE users SET "Rol" = $1 WHERE "Nombre" = $2 RETURNING "ID", "Nombre", "Rol"',
      ['admin', 'admin']
    );
    
    if (updateResult.rows.length > 0) {
      console.log('✅ Usuario admin actualizado exitosamente:');
      console.table(updateResult.rows);
    } else {
      console.log('❌ No se encontró usuario con nombre "admin"');
      
      // Intentar buscar con diferentes variaciones
      const searchResult = await client.query(
        'SELECT "ID", "Nombre", "Rol" FROM users WHERE "Nombre" ILIKE $1',
        ['%admin%']
      );
      
      if (searchResult.rows.length > 0) {
        console.log('🔍 Usuarios que contienen "admin":');
        console.table(searchResult.rows);
      }
    }
    
    // Verificar estado final
    console.log('\n🔍 Estado final de todos los usuarios:');
    const finalUsers = await client.query('SELECT "ID", "Nombre", "Rol", created_at FROM users ORDER BY "ID"');
    console.table(finalUsers.rows);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.code) {
      console.error('Código de error:', error.code);
    }
  } finally {
    if (client) {
      client.release();
    }
    await pool.end();
  }
}

updateAdminRole();
