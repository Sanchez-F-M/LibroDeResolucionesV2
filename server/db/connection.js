import mysql from 'mysql2/promise'
import dotenv from 'dotenv'
dotenv.config()

const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  // Configuración SSL para producción
  ...(process.env.NODE_ENV === 'production' && {
    ssl: {
      rejectUnauthorized: false // Para servicios de DB como PlanetScale o similares
    }
  })
}

const db = mysql.createPool(dbConfig)

async function testConnection() {
  try {
    const connection = await db.getConnection()
    console.log('✅ Conexión a la base de datos exitosa')
    connection.release()
  } catch (err) {
    console.error('❌ Error al conectar a la base de datos:', err.message)
    process.exit(1)
  }
}

testConnection()

export default db
