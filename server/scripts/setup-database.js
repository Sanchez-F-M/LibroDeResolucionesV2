import pkg from 'pg';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pkg;

// Configuración de conexión
const poolConfig = {
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'libro_resoluciones',
  password: process.env.DB_PASSWORD || 'admin123',
  port: parseInt(process.env.DB_PORT) || 5433,
  ssl: false,
};

const pool = new Pool(poolConfig);

async function setupDatabase() {
  const client = await pool.connect();

  try {
    console.log('🔄 Configurando base de datos...\n');

    // Crear tabla users si no existe
    console.log('📋 Creando tabla users...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        "ID" SERIAL PRIMARY KEY,
        "Nombre" VARCHAR(255) UNIQUE NOT NULL,
        "Contrasena" VARCHAR(255) NOT NULL,
        "Rol" VARCHAR(50) DEFAULT 'usuario' NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Tabla users creada\n');

    // Verificar si existe el usuario admin
    console.log('🔍 Verificando usuario admin...');
    const existingAdmin = await client.query(
      'SELECT * FROM users WHERE "Nombre" = $1',
      ['admin']
    );

    if (existingAdmin.rows.length > 0) {
      console.log('⚠️  Usuario admin ya existe');
      console.log('🔄 Actualizando contraseña...');

      // Actualizar contraseña del admin
      const hashedPassword = await bcrypt.hash('admin123', 10);
      await client.query(
        'UPDATE users SET "Contrasena" = $1, "Rol" = $2 WHERE "Nombre" = $3',
        [hashedPassword, 'admin', 'admin']
      );
      console.log('✅ Contraseña de admin actualizada\n');
    } else {
      console.log('➕ Creando usuario admin...');

      // Crear usuario admin
      const hashedPassword = await bcrypt.hash('admin123', 10);
      await client.query(
        'INSERT INTO users ("Nombre", "Contrasena", "Rol") VALUES ($1, $2, $3)',
        ['admin', hashedPassword, 'admin']
      );
      console.log('✅ Usuario admin creado\n');
    }

    // Crear usuarios adicionales de prueba
    console.log('👥 Creando usuarios de prueba...');

    const testUsers = [
      { nombre: 'secretaria', password: 'secretaria123', rol: 'secretaria' },
      { nombre: 'usuario', password: 'usuario123', rol: 'usuario' },
    ];

    for (const user of testUsers) {
      const existing = await client.query(
        'SELECT * FROM users WHERE "Nombre" = $1',
        [user.nombre]
      );

      if (existing.rows.length === 0) {
        const hashedPassword = await bcrypt.hash(user.password, 10);
        await client.query(
          'INSERT INTO users ("Nombre", "Contrasena", "Rol") VALUES ($1, $2, $3)',
          [user.nombre, hashedPassword, user.rol]
        );
        console.log(`✅ Usuario ${user.nombre} creado`);
      } else {
        console.log(`⚠️  Usuario ${user.nombre} ya existe`);
      }
    }

    // Mostrar todos los usuarios
    console.log('\n📊 Usuarios en la base de datos:');
    const allUsers = await client.query(
      'SELECT "ID", "Nombre", "Rol", created_at FROM users ORDER BY "ID"'
    );
    console.table(allUsers.rows);

    console.log('\n✅ Base de datos configurada exitosamente!');
    console.log('\n📝 Credenciales disponibles:');
    console.log('   Admin:      usuario: admin      | contraseña: admin123');
    console.log(
      '   Secretaria: usuario: secretaria | contraseña: secretaria123'
    );
    console.log('   Usuario:    usuario: usuario    | contraseña: usuario123');
  } catch (error) {
    console.error('\n❌ Error al configurar la base de datos:', error);
    console.error('Detalles:', error.message);
  } finally {
    client.release();
    await pool.end();
  }
}

setupDatabase();
