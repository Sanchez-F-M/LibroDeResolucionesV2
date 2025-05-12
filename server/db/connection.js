import mysql from 'mysql2/promise'
import dotenv from 'dotenv'
dotenv.config()

const db = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME || 'libroderesolucionDB',
  port: process.env.DB_PORT || 3306,
  ssl: process.env.NODE_ENV === 'production' ? {
    rejectUnauthorized: true
  } : false,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
})

async function testConnection () {
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
