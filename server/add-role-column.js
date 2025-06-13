import db from './db/connection.js'

async function addRoleColumn() {
  try {
    console.log('🔍 Verificando estructura de la tabla users...')
    
    // Verificar si la columna Rol ya existe
    const checkColumn = await db.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'users' AND column_name = 'Rol'
    `)
    
    if (checkColumn.rows.length > 0) {
      console.log('✅ La columna "Rol" ya existe en la tabla users')
    } else {
      console.log('➕ Agregando columna "Rol" a la tabla users...')
      
      // Agregar la columna Rol con valor por defecto 'usuario'
      await db.query(`
        ALTER TABLE users 
        ADD COLUMN "Rol" VARCHAR(20) DEFAULT 'usuario'
      `)
      
      console.log('✅ Columna "Rol" agregada exitosamente')
    }
    
    // Actualizar usuarios existentes que no tengan rol
    console.log('🔄 Actualizando usuarios existentes...')
    const updateResult = await db.query(`
      UPDATE users 
      SET "Rol" = 'admin' 
      WHERE "Nombre" = 'admin' AND ("Rol" IS NULL OR "Rol" = '')
    `)
    
    if (updateResult.rowCount > 0) {
      console.log(`✅ Usuario 'admin' actualizado con rol 'admin'`)
    }
    
    // Actualizar otros usuarios existentes con rol 'usuario'
    const updateOthers = await db.query(`
      UPDATE users 
      SET "Rol" = 'usuario' 
      WHERE "Rol" IS NULL OR "Rol" = ''
    `)
    
    if (updateOthers.rowCount > 0) {
      console.log(`✅ ${updateOthers.rowCount} usuarios actualizados con rol 'usuario'`)
    }
    
    // Mostrar estado final
    console.log('\n📊 Estado final de usuarios:')
    const allUsers = await db.query('SELECT "ID", "Nombre", "Rol", "created_at" FROM users ORDER BY "ID"')
      allUsers.rows.forEach(user => {
      const dateStr = user.created_at ? 
        (typeof user.created_at === 'string' ? user.created_at.split('T')[0] : 
         user.created_at.toISOString().split('T')[0]) : 
        'Sin fecha'
      console.log(`   ${user.ID}. ${user.Nombre} - Rol: ${user.Rol} (${dateStr})`)
    })
    
    console.log('\n✅ Migración de roles completada exitosamente')
    
  } catch (error) {
    console.error('❌ Error en la migración de roles:', error)
    throw error
  }
}

// Ejecutar la migración
console.log('🚀 Iniciando migración de roles...')
addRoleColumn()
  .then(() => {
    console.log('✨ Migración completada')
    process.exit(0)
  })
  .catch((error) => {
    console.error('💥 Error fatal:', error)
    process.exit(1)
  })
