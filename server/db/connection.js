import mysql from 'mysql2'

const db = mysql.createConnection(
  {
    host: '127.0.0.1',
    user: 'root',
    password: 'root',
    database: 'libroderesolucionDB'
  }
).promise()

db.connect((err) => {
  if (err) {
    throw err
  }
  console.log('Connected to database')
})

export default db
