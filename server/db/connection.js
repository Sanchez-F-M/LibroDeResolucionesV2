import mysql from 'mysql2/promise'

const db = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'libroderesolucionDB',
  port: 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
})

async function testConnection () {
  try {
    const connection = await db.getConnection() // Obtener conexión del pool
    console.log('✅ Conexión a la base de datos exitosa')
    connection.release() // Liberar conexión
  } catch (err) {
    console.error('❌ Error al conectar a la base de datos:', err.message)
    process.exit(1) // Detiene la ejecución si la conexión falla
  }
}

testConnection()

export default db
