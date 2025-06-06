#!/usr/bin/env node

import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import pkg from 'pg';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const { Client } = pkg;

async function migrateData() {
  console.log('🔄 Iniciando migración de SQLite a PostgreSQL...');

  // Conectar a SQLite
  const sqlitePath = path.join(__dirname, '../database.sqlite');
  let sqliteDb;
  
  try {
    sqliteDb = await open({
      filename: sqlitePath,
      driver: sqlite3.Database
    });
    console.log('✅ Conectado a SQLite');
  } catch (error) {
    console.log('ℹ️  No se encontró base de datos SQLite existente');
    return;
  }
  // Conectar a PostgreSQL
  const pgClient = new Client({
    user: process.env.DB_USER || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    database: process.env.DB_NAME || 'libro_resoluciones',
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT || 5433,
  });

  try {
    await pgClient.connect();
    console.log('✅ Conectado a PostgreSQL');

    // Migrar tabla resolution
    console.log('📋 Migrando resoluciones...');
    const resolutions = await sqliteDb.all('SELECT * FROM resolution');
    
    for (const resolution of resolutions) {
      try {
        await pgClient.query(`
          INSERT INTO resolution ("NumdeResolucion", "Asunto", "Referencia", "FechaCreacion", created_at, updated_at)
          VALUES ($1, $2, $3, $4, $5, $6)
          ON CONFLICT ("NumdeResolucion") DO UPDATE SET
            "Asunto" = EXCLUDED."Asunto",
            "Referencia" = EXCLUDED."Referencia",
            "FechaCreacion" = EXCLUDED."FechaCreacion",
            updated_at = CURRENT_TIMESTAMP
        `, [
          resolution.NumdeResolucion,
          resolution.Asunto,
          resolution.Referencia,
          resolution.FechaCreacion,
          resolution.created_at,
          resolution.updated_at
        ]);
      } catch (error) {
        console.error(`❌ Error migrando resolución ${resolution.NumdeResolucion}:`, error.message);
      }
    }
    console.log(`✅ ${resolutions.length} resoluciones migradas`);

    // Migrar tabla images
    console.log('🖼️  Migrando imágenes...');
    const images = await sqliteDb.all('SELECT * FROM images');
    
    for (const image of images) {
      try {
        await pgClient.query(`
          INSERT INTO images ("NumdeResolucion", "ImagePath", created_at)
          VALUES ($1, $2, $3)
          ON CONFLICT DO NOTHING
        `, [
          image.NumdeResolucion,
          image.ImagePath,
          image.created_at
        ]);
      } catch (error) {
        console.error(`❌ Error migrando imagen ${image.id}:`, error.message);
      }
    }
    console.log(`✅ ${images.length} imágenes migradas`);

    // Migrar tabla users
    console.log('👤 Migrando usuarios...');
    const users = await sqliteDb.all('SELECT * FROM users');
    
    for (const user of users) {
      try {
        await pgClient.query(`
          INSERT INTO users ("Nombre", "Contrasena", created_at)
          VALUES ($1, $2, $3)
          ON CONFLICT ("Nombre") DO UPDATE SET
            "Contrasena" = EXCLUDED."Contrasena"
        `, [
          user.Nombre,
          user.Contrasena,
          user.created_at
        ]);
      } catch (error) {
        console.error(`❌ Error migrando usuario ${user.Nombre}:`, error.message);
      }
    }
    console.log(`✅ ${users.length} usuarios migrados`);

    console.log('🎉 Migración completada exitosamente');

  } catch (error) {
    console.error('❌ Error durante la migración:', error);
  } finally {
    if (sqliteDb) await sqliteDb.close();
    await pgClient.end();
  }
}

// Ejecutar si es llamado directamente
if (import.meta.url === `file://${process.argv[1]}`) {
  migrateData().catch(console.error);
}

export { migrateData };
