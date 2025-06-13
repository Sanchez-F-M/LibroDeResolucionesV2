import pkg from 'pg';
const { Pool } = pkg;
import dotenv from 'dotenv';
dotenv.config();

console.log('📋 Variables de entorno:');
console.log('DB_HOST:', process.env.DB_HOST);
console.log('DB_PORT:', process.env.DB_PORT);
console.log('DB_NAME:', process.env.DB_NAME);
console.log('DB_USER:', process.env.DB_USER);

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

async function debugAdmin() {
  try {    console.log('🔍 Verificando conexión a la base de datos...');
    await pool.query('SELECT NOW()');
    console.log('✅ Conexión exitosa');
    
    console.log('🔍 Verificando tablas en la base de datos...');
    
    // Ver todas las tablas
    const tables = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `);
    console.log('\n📋 Tablas disponibles:');
    console.table(tables.rows);
    
    // Intentar con diferentes nombres de tabla
    const possibleTableNames = ['usuarios', 'users', 'user', 'usuario'];
    
    for (const tableName of possibleTableNames) {
      try {
        console.log(`\n🔍 Intentando con tabla: ${tableName}`);
        const result = await pool.query(`SELECT * FROM ${tableName} LIMIT 1`);
        console.log(`✅ Tabla ${tableName} encontrada!`);
        
        // Si encontramos la tabla, mostrar todos los usuarios
        const allUsers = await pool.query(`SELECT * FROM ${tableName}`);
        console.log(`\n📋 Usuarios en tabla ${tableName}:`);
        console.table(allUsers.rows);
        break;
        
      } catch (error) {
        console.log(`❌ Tabla ${tableName} no existe`);
      }
    }    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await pool.end();
  }
}

debugAdmin();
