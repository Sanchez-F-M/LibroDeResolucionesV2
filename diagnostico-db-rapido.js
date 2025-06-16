// Script para diagnosticar la conexión de la base de datos
import db from './server/db/connection.js'

async function diagnosticarDB() {
  console.log('🔍 Iniciando diagnóstico de la base de datos...')
  
  try {
    // Verificar conexión básica
    console.log('1. Verificando conexión...')
    const result = await db.query('SELECT NOW()')
    console.log('✅ Conexión exitosa:', result.rows[0])
    
    // Verificar tabla users
    console.log('2. Verificando tabla users...')
    const tableCheck = await db.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'users'
      )
    `)
    console.log('✅ Tabla users existe:', tableCheck.rows[0].exists)
    
    if (tableCheck.rows[0].exists) {
      // Verificar estructura de la tabla
      console.log('3. Verificando estructura de la tabla users...')
      const columns = await db.query(`
        SELECT column_name, data_type, is_nullable
        FROM information_schema.columns
        WHERE table_name = 'users'
        ORDER BY ordinal_position
      `)
      console.log('✅ Estructura de la tabla:')
      columns.rows.forEach(col => {
        console.log(`   - ${col.column_name}: ${col.data_type} (${col.is_nullable === 'YES' ? 'NULL' : 'NOT NULL'})`)
      })
      
      // Contar usuarios
      console.log('4. Contando usuarios...')
      const userCount = await db.query('SELECT COUNT(*) FROM users')
      console.log('✅ Total de usuarios:', userCount.rows[0].count)
      
      // Verificar usuarios de prueba
      console.log('5. Buscando usuario admin...')
      const adminUser = await db.query('SELECT "ID", "Nombre", "Rol" FROM users WHERE "Nombre" = $1', ['admin'])
      if (adminUser.rows.length > 0) {
        console.log('✅ Usuario admin encontrado:', adminUser.rows[0])
      } else {
        console.log('❌ Usuario admin no encontrado')
      }
    }
    
  } catch (error) {
    console.error('❌ Error en diagnóstico:', error)
    console.error('Stack:', error.stack)
  } finally {
    process.exit(0)
  }
}

diagnosticarDB()
