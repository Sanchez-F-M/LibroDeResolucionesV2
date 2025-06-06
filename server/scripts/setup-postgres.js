#!/usr/bin/env node

import pkg from 'pg';
import dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config();

const { Client } = pkg;

async function setupDatabase() {
  console.log('🔧 Configurando PostgreSQL...');
  
  // Primero conectar a la base de datos 'postgres' para crear nuestra base de datos
  const adminClient = new Client({
    user: process.env.DB_USER || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    database: 'postgres', // Base de datos por defecto
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT || 5432,
  });

  try {
    // Conectar como administrador
    await adminClient.connect();
    console.log('✅ Conectado a PostgreSQL como administrador');

    // Verificar si la base de datos ya existe
    const dbName = process.env.DB_NAME || 'libro_resoluciones';
    const checkDbQuery = `SELECT 1 FROM pg_database WHERE datname = $1`;
    const dbExists = await adminClient.query(checkDbQuery, [dbName]);

    if (dbExists.rows.length === 0) {
      // Crear la base de datos
      await adminClient.query(`CREATE DATABASE ${dbName}`);
      console.log(`✅ Base de datos '${dbName}' creada exitosamente`);
    } else {
      console.log(`ℹ️  La base de datos '${dbName}' ya existe`);
    }

  } catch (error) {
    console.error('❌ Error durante la configuración:', error.message);
    console.log('\n📋 Instrucciones manuales:');
    console.log('1. Abre pgAdmin o usa psql');
    console.log('2. Ejecuta: CREATE DATABASE libro_resoluciones;');
    console.log('3. Verifica que las credenciales en .env sean correctas');
  } finally {
    await adminClient.end();
  }

  // Ahora conectar a nuestra base de datos para crear las tablas
  const appClient = new Client({
    user: process.env.DB_USER || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    database: process.env.DB_NAME || 'libro_resoluciones',
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT || 5432,
  });

  try {
    await appClient.connect();
    console.log('✅ Conectado a la base de datos de la aplicación');

    // Crear las tablas
    await createTables(appClient);
    console.log('✅ Base de datos configurada correctamente');

  } catch (error) {
    console.error('❌ Error al configurar las tablas:', error.message);
  } finally {
    await appClient.end();
  }
}

async function createTables(client) {
  try {
    // Crear tabla de resoluciones
    await client.query(`
      CREATE TABLE IF NOT EXISTS resolution (
        id SERIAL PRIMARY KEY,
        "NumdeResolucion" TEXT UNIQUE NOT NULL,
        "Asunto" TEXT NOT NULL,
        "Referencia" TEXT,
        "FechaCreacion" TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Crear índices para optimizar consultas
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_resolution_numero ON resolution("NumdeResolucion");
    `);
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_resolution_fecha ON resolution("FechaCreacion");
    `);
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_resolution_asunto ON resolution("Asunto");
    `);

    // Crear tabla de imágenes
    await client.query(`
      CREATE TABLE IF NOT EXISTS images (
        id SERIAL PRIMARY KEY,
        "NumdeResolucion" TEXT NOT NULL,
        "ImagePath" TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY ("NumdeResolucion") REFERENCES resolution("NumdeResolucion") ON DELETE CASCADE
      )
    `);

    // Crear índice para imágenes
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_images_resolucion ON images("NumdeResolucion");
    `);

    // Crear tabla de usuarios
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        "ID" SERIAL PRIMARY KEY,
        "Nombre" TEXT UNIQUE NOT NULL,
        "Contrasena" TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Crear índice para usuarios
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_users_nombre ON users("Nombre");
    `);

    console.log('✅ Tablas PostgreSQL creadas exitosamente');

  } catch (error) {
    console.error('❌ Error al crear tablas PostgreSQL:', error);
    throw error;
  }
}

// Ejecutar si es llamado directamente
if (import.meta.url === `file://${process.argv[1]}`) {
  setupDatabase().catch(console.error);
}

export { setupDatabase };
