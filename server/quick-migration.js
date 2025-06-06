// Simple migration using CommonJS
const sqlite3 = require('sqlite3');
const { Client } = require('pg');
const path = require('path');
require('dotenv').config();

async function quickMigration() {
  console.log('🔄 Iniciando migración rápida...');
  
  // Conectar a SQLite
  const sqlitePath = path.join(__dirname, 'database.sqlite');
  console.log('📍 Ruta SQLite:', sqlitePath);
  
  const sqliteDb = new sqlite3.Database(sqlitePath);
  
  // Obtener datos de SQLite
  const getResolutions = () => {
    return new Promise((resolve, reject) => {
      sqliteDb.all('SELECT * FROM resolution', (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  };
  
  const getImages = () => {
    return new Promise((resolve, reject) => {
      sqliteDb.all('SELECT * FROM images', (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  };
  
  try {
    const resolutions = await getResolutions();
    const images = await getImages();
    
    console.log(`📊 Encontradas ${resolutions.length} resoluciones en SQLite`);
    console.log(`📊 Encontradas ${images.length} imágenes en SQLite`);
    
    if (resolutions.length > 0) {
      console.log('📄 Ejemplo resolución:', resolutions[0]);
    }
    
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
    
    // Migrar resoluciones
    console.log('📋 Migrando resoluciones...');
    for (let i = 0; i < resolutions.length; i++) {
      const resolution = resolutions[i];
      try {
        await pgClient.query(`
          INSERT INTO resolution ("NumdeResolucion", "Asunto", "Referencia", "FechaCreacion")
          VALUES ($1, $2, $3, $4)
          ON CONFLICT ("NumdeResolucion") DO UPDATE SET
            "Asunto" = EXCLUDED."Asunto",
            "Referencia" = EXCLUDED."Referencia",
            "FechaCreacion" = EXCLUDED."FechaCreacion"
        `, [
          resolution.NumdeResolucion,
          resolution.Asunto,
          resolution.Referencia,
          resolution.FechaCreacion
        ]);
        console.log(`✅ Migrada resolución ${i + 1}/${resolutions.length}: ${resolution.NumdeResolucion}`);
      } catch (error) {
        console.error(`❌ Error migrando resolución ${resolution.NumdeResolucion}:`, error.message);
      }
    }
    
    // Migrar imágenes
    console.log('🖼️  Migrando imágenes...');
    for (let i = 0; i < images.length; i++) {
      const image = images[i];
      try {
        await pgClient.query(`
          INSERT INTO images ("NumdeResolucion", "ImagePath")
          VALUES ($1, $2)
          ON CONFLICT DO NOTHING
        `, [
          image.NumdeResolucion,
          image.ImagePath
        ]);
        console.log(`✅ Migrada imagen ${i + 1}/${images.length}: ${image.ImagePath}`);
      } catch (error) {
        console.error(`❌ Error migrando imagen ${image.id}:`, error.message);
      }
    }
    
    // Verificar resultado
    const result = await pgClient.query('SELECT COUNT(*) as count FROM resolution');
    console.log(`🎉 Migración completada. Total resoluciones en PostgreSQL: ${result.rows[0].count}`);
    
    await pgClient.end();
    sqliteDb.close();
    
  } catch (error) {
    console.error('❌ Error durante la migración:', error);
    sqliteDb.close();
  }
}

quickMigration();
