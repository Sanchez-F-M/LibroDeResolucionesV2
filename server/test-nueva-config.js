import pkg from 'pg';
import dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config();

const { Pool } = pkg;

async function testConnection() {
  const poolConfig = {
    user: process.env.DB_USER || 'libro_resoluciones_user',
    host: process.env.DB_HOST || 'localhost',
    database: process.env.DB_NAME || 'libro_resoluciones',
    password: process.env.DB_PASSWORD || 'admin123',
    port: parseInt(process.env.DB_PORT) || 5432,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  };

  console.log('🔧 PRUEBA DE CONEXIÓN CORREGIDA');
  console.log('================================');
  console.log('📍 Configuración:');
  console.log('   Host:', poolConfig.host);
  console.log('   Puerto:', poolConfig.port);
  console.log('   Base de datos:', poolConfig.database);
  console.log('   Usuario:', poolConfig.user);
  console.log('   SSL:', poolConfig.ssl);
  console.log('');

  const pool = new Pool(poolConfig);

  try {
    console.log('🔍 Intentando conectar...');
    const client = await pool.connect();
    
    console.log('✅ Conexión exitosa!');
    
    // Verificar que las tablas existen
    console.log('\n📋 Verificando estructura de base de datos...');
    
    const tables = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name
    `);
    
    console.log('📊 Tablas encontradas:');
    tables.rows.forEach(row => {
      console.log(`   - ${row.table_name}`);
    });
    
    // Verificar datos
    console.log('\n📈 Contando registros...');
    
    try {
      const resolutions = await client.query('SELECT COUNT(*) FROM resolution');
      console.log(`   📚 Resoluciones: ${resolutions.rows[0].count}`);
    } catch (e) {
      console.log('   📚 Resoluciones: tabla no encontrada');
    }
    
    try {
      const users = await client.query('SELECT COUNT(*) FROM users');
      console.log(`   👥 Usuarios: ${users.rows[0].count}`);
    } catch (e) {
      console.log('   👥 Usuarios: tabla no encontrada');
    }
    
    try {
      const images = await client.query('SELECT COUNT(*) FROM imagenes');
      console.log(`   🖼️ Imágenes: ${images.rows[0].count}`);
    } catch (e) {
      console.log('   🖼️ Imágenes: tabla no encontrada');
    }
    
    client.release();
    console.log('\n✅ Prueba completada exitosamente');
    
  } catch (error) {
    console.error('\n❌ Error de conexión:');
    console.error('   Mensaje:', error.message);
    console.error('   Código:', error.code);
    
    if (error.code === 'ECONNREFUSED') {
      console.log('\n💡 Sugerencias:');
      console.log('   1. Verificar que PostgreSQL esté ejecutándose');
      console.log('   2. Verificar que el puerto 5432 esté abierto');
      console.log('   3. Verificar credenciales de usuario');
    }
    
    if (error.code === '28P01') {
      console.log('\n🔐 Error de autenticación:');
      console.log('   1. Verificar usuario: libro_resoluciones_user');
      console.log('   2. Verificar contraseña');
      console.log('   3. Verificar permisos de la base de datos');
    }
  } finally {
    await pool.end();
  }
}

testConnection();
