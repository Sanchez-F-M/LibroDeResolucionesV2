// Simple migration test
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

async function testMigration() {
  console.log('🔄 Iniciando prueba de migración...');
  
  try {
    // Conectar a SQLite
    const sqlitePath = path.join(__dirname, 'database.sqlite');
    console.log('📍 Ruta SQLite:', sqlitePath);
    
    const sqliteDb = await open({
      filename: sqlitePath,
      driver: sqlite3.Database
    });
    console.log('✅ Conectado a SQLite');
    
    // Obtener una resolución de ejemplo
    const sampleResolution = await sqliteDb.get('SELECT * FROM resolution LIMIT 1');
    console.log('📄 Ejemplo de resolución:', sampleResolution);
    
    // Conectar a PostgreSQL
    const pgClient = new Client({
      user: process.env.DB_USER || 'postgres',
      host: process.env.DB_HOST || 'localhost',
      database: process.env.DB_NAME || 'libro_resoluciones',
      password: process.env.DB_PASSWORD || 'admin123',
      port: parseInt(process.env.DB_PORT) || 5433,
    });
    
    await pgClient.connect();
    console.log('✅ Conectado a PostgreSQL');
    
    // Verificar estructura de tablas
    const pgTables = await pgClient.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `);
    console.log('📋 Tablas en PostgreSQL:', pgTables.rows.map(r => r.table_name));
    
    // Cerrar conexiones
    await sqliteDb.close();
    await pgClient.end();
    
    console.log('✅ Prueba completada');
    
  } catch (error) {
    console.error('❌ Error en prueba:', error);
  }
}

testMigration();
