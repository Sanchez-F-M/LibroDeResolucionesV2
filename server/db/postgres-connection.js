import pkg from 'pg';
import dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config();

const { Pool } = pkg;

// Configuración de la conexión a PostgreSQL
const poolConfig = {  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'libro_resoluciones',
  password: process.env.DB_PASSWORD || 'admin123',
  port: parseInt(process.env.DB_PORT) || 5433,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  max: 20, // máximo número de conexiones en el pool
  idleTimeoutMillis: 30000, // tiempo antes de cerrar conexiones inactivas
  connectionTimeoutMillis: 2000, // tiempo límite para obtener conexión
};

// Crear el pool de conexiones
const pool = new Pool(poolConfig);

// Función para inicializar la base de datos
async function initDatabase() {
  const client = await pool.connect();
  
  try {
    console.log('🔄 Inicializando base de datos PostgreSQL...');
    
    // Crear tabla de resoluciones
    await client.query(`
      CREATE TABLE IF NOT EXISTS resolution (
        id SERIAL PRIMARY KEY,
        "NumdeResolucion" VARCHAR(255) UNIQUE NOT NULL,
        "Asunto" TEXT NOT NULL,
        "Referencia" TEXT,
        "FechaCreacion" DATE DEFAULT CURRENT_DATE,
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
        "NumdeResolucion" VARCHAR(255) NOT NULL,
        "ImagePath" TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY ("NumdeResolucion") REFERENCES resolution("NumdeResolucion") ON DELETE CASCADE
      )
    `);

    // Crear índice para imágenes
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_images_resolucion ON images("NumdeResolucion");
    `);    // Crear tabla de usuarios
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        "ID" SERIAL PRIMARY KEY,
        "Nombre" VARCHAR(255) UNIQUE NOT NULL,
        "Contrasena" VARCHAR(255) NOT NULL,
        "Rol" VARCHAR(50) DEFAULT 'usuario' NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Agregar columna Rol si no existe (para bases de datos existentes)
    try {
      await client.query(`
        ALTER TABLE users ADD COLUMN IF NOT EXISTS "Rol" VARCHAR(50) DEFAULT 'usuario' NOT NULL
      `);
    } catch (error) {
      // La columna ya existe, continúa
      console.log('📝 Columna Rol ya existe en la tabla users');
    }

    // Crear índice para usuarios
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_users_nombre ON users("Nombre");
    `);    console.log('✅ Tablas PostgreSQL creadas exitosamente');
    return dbProxy;
    
  } catch (error) {
    console.error('❌ Error al inicializar la base de datos PostgreSQL:', error);
    throw error;
  } finally {
    client.release();
  }
}

// Funciones de utilidad para simular el comportamiento de SQLite
const dbProxy = {
  // Método query para compatibilidad con PostgreSQL puro
  async query(query, params = []) {
    const client = await pool.connect();
    try {
      const result = await client.query(query, params);
      return result;
    } finally {
      client.release();
    }
  },

  // Método connect para obtener un cliente específico
  async connect() {
    return await pool.connect();
  },

  // Ejecutar una consulta simple
  async get(query, params = []) {
    const client = await pool.connect();
    try {
      const result = await client.query(query, params);
      return result.rows[0] || null;
    } finally {
      client.release();
    }
  },

  // Ejecutar consulta que devuelve múltiples filas
  async all(query, params = []) {
    const client = await pool.connect();
    try {
      const result = await client.query(query, params);
      return result.rows;
    } finally {
      client.release();
    }
  },

  // Ejecutar consulta de inserción/actualización/eliminación
  async run(query, params = []) {
    const client = await pool.connect();
    try {
      const result = await client.query(query, params);
      return {
        changes: result.rowCount,
        lastInsertRowid: result.rows[0]?.id || null
      };
    } finally {
      client.release();
    }
  },

  // Ejecutar múltiples consultas (transacción)
  async exec(query) {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      const queries = query.split(';').filter(q => q.trim());
      
      for (const q of queries) {
        if (q.trim()) {
          await client.query(q);
        }
      }
      
      await client.query('COMMIT');
      return { changes: 1 };
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  },

  // Obtener el pool directamente para operaciones más complejas
  getPool() {
    return pool;
  }
};

// Verificar conexión al inicializar
pool.on('connect', () => {
  console.log('✅ Nueva conexión establecida con PostgreSQL');
});

pool.on('error', (err) => {
  console.error('❌ Error inesperado en el pool de PostgreSQL:', err);
  process.exit(-1);
});

export { pool, initDatabase };
export default dbProxy;
