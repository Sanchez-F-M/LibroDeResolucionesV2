import db from './db/postgres-connection.js';

async function updateAdminRole() {
  try {
    console.log('🔄 Actualizando rol del usuario admin...');
    
    await db.query('UPDATE users SET "Rol" = \'admin\' WHERE "Nombre" = \'admin\'');
    console.log('✅ Usuario admin actualizado a rol administrador');
    
    const result = await db.query('SELECT "ID", "Nombre", "Rol" FROM users WHERE "Nombre" = \'admin\'');
    console.log('👤 Usuario admin:', result.rows[0]);
    
    // Verificar todos los usuarios
    const allUsers = await db.query('SELECT "ID", "Nombre", "Rol" FROM users ORDER BY "ID"');
    console.log('\n📊 Todos los usuarios:');
    allUsers.rows.forEach(user => {
      console.log(`   ${user.ID}. ${user.Nombre} - Rol: ${user.Rol}`);
    });
    
    console.log('\n✅ Actualización completada');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

updateAdminRole();
