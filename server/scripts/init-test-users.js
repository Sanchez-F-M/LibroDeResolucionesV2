// Script para inicializar usuarios de prueba en PostgreSQL
import pkg from 'pg';
const { Pool } = pkg;
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';

dotenv.config();

const testUsers = [
  { Nombre: 'admin', Contrasena: 'admin123', Rol: 'admin' },
  { Nombre: 'Admin', Contrasena: 'admin123', Rol: 'admin' },
  { Nombre: 'secretaria', Contrasena: 'secretaria123', Rol: 'secretaria' },
  { Nombre: 'usuario', Contrasena: 'usuario123', Rol: 'usuario' },
];

async function initUsers() {
  console.log('🔧 Iniciando creación de usuarios de prueba...');

  try {
    const pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl:
        process.env.NODE_ENV === 'production'
          ? { rejectUnauthorized: false }
          : false,
    });

    console.log('✅ Conectado a PostgreSQL');

    for (const user of testUsers) {
      // Verificar si el usuario ya existe
      const existing = await pool.query(
        'SELECT * FROM users WHERE "Nombre" = $1',
        [user.Nombre]
      );

      if (existing.rows.length > 0) {
        console.log(
          `✅ Usuario "${user.Nombre}" ya existe (ID: ${existing.rows[0].ID})`
        );
        continue;
      }

      // Crear usuario
      const hashedPassword = await bcrypt.hash(user.Contrasena, 10);
      const result = await pool.query(
        'INSERT INTO users ("Nombre", "Contrasena", "Rol") VALUES ($1, $2, $3) RETURNING "ID"',
        [user.Nombre, hashedPassword, user.Rol]
      );

      console.log(
        `✅ Usuario "${user.Nombre}" creado (ID: ${result.rows[0].ID}, Rol: ${user.Rol})`
      );
    }

    await pool.end();
    console.log('\n✅ Inicialización completada');
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

initUsers();
