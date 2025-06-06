import pkg from 'pg';
const { Client } = pkg;

console.log('🔄 Iniciando prueba de conexión...');

async function testConnection() {
  console.log('📡 Creando cliente PostgreSQL...');
  const client = new Client({
    user: 'postgres',
    host: 'localhost',
    database: 'libro_resoluciones',
    password: 'admin123',
    port: 5433,
  });
  try {
    console.log('🔗 Intentando conectar...');
    await client.connect();
    console.log('✅ Conexión exitosa a PostgreSQL');
    
    // Verificar si la base de datos existe
    const dbResult = await client.query("SELECT current_database()");
    console.log('📊 Base de datos actual:', dbResult.rows[0].current_database);
    
    // Listar todas las tablas
    const tablesResult = await client.query(`
      SELECT tablename 
      FROM pg_tables 
      WHERE schemaname = 'public'
    `);
    
    console.log('📋 Tablas encontradas:');
    tablesResult.rows.forEach(row => {
      console.log('- ' + row.tablename);
    });
    
  } catch (error) {
    console.error('❌ Error de conexión:', error.message);
  } finally {
    await client.end();
  }
}

testConnection();
