const mysql = require('mysql2');

const db = mysql.createConnection(
    {
        host: '127.0.0.1',
        user: 'root',
        password: 'root',
        database: 'libroderesolucionDB'
    }
);

db.connect((err)=> {
    if(err) {
        throw err
    }
    console.log("Base de datos conectado"); 
});

module.exports = db;