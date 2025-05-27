import mysql from 'mysql2/promise'
import dotenv from 'dotenv'
dotenv.config()

const db = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: process.env.DB_PASSWORD,
  database: 'libroderesolucionDB',
  port: 3306,
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
