import db from './db/connection.js'

async function forceUpdateAdmin() {
  try {
    console.log('🔄 Forzando actualización del usuario admin...')
    
    // Forzar actualización del usuario admin
    const result = await db.query(`
      UPDATE users 
      SET "Rol" = 'admin' 
      WHERE "Nombre" = 'admin'
    `)
    
    console.log(`✅ Filas actualizadas: ${result.rowCount}`)
    
    // Verificar el resultado
    const check = await db.query(`
      SELECT "ID", "Nombre", "Rol" 
      FROM users 
      WHERE "Nombre" = 'admin'
    `)
    
    if (check.rows.length > 0) {
      console.log('👤 Usuario admin después de actualización:', check.rows[0])
    } else {
      console.log('❌ Usuario admin no encontrado')
    }
    
    console.log('\n✅ Actualización completada')
    process.exit(0)
    
  } catch (error) {
    console.error('❌ Error:', error)
    process.exit(1)
  }
}

forceUpdateAdmin()
