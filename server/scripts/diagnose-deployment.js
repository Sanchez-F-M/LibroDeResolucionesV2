import 'dotenv/config'
import sqlite3 from 'sqlite3'
import { open } from 'sqlite'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const dbPath = path.join(__dirname, '../database.sqlite')

async function diagnoseDeployment() {
  console.log('🔍 DIAGNÓSTICO DE DEPLOYMENT')
  console.log('=' .repeat(50))
  
  // 1. Variables de entorno
  console.log('\n📋 VARIABLES DE ENTORNO:')
  console.log(`NODE_ENV: ${process.env.NODE_ENV || 'NOT SET'}`)
  console.log(`PORT: ${process.env.PORT || 'NOT SET'}`)
  console.log(`JWT_SECRET_KEY: ${process.env.JWT_SECRET_KEY ? 'SET (****)' : 'NOT SET'}`)
  console.log(`FRONTEND_URL: ${process.env.FRONTEND_URL || 'NOT SET'}`)
  console.log(`ADMIN_USERNAME: ${process.env.ADMIN_USERNAME || 'NOT SET'}`)
  console.log(`ADMIN_PASSWORD: ${process.env.ADMIN_PASSWORD ? 'SET (****)' : 'NOT SET'}`)
  
  // 2. Base de datos
  console.log('\n🗄️ BASE DE DATOS:')
  try {
    const db = await open({
      filename: dbPath,
      driver: sqlite3.Database
    })
    
    console.log('✅ Conexión exitosa a SQLite')
    
    // Verificar tablas
    const tables = await db.all(`
      SELECT name FROM sqlite_master 
      WHERE type='table' AND name NOT LIKE 'sqlite_%'
    `)
    
    console.log(`📊 Tablas encontradas: ${tables.map(t => t.name).join(', ') || 'NINGUNA'}`)
    
    // Verificar usuarios
    try {
      const users = await db.all('SELECT ID, Nombre FROM users')
      console.log(`👥 Usuarios en la base de datos: ${users.length}`)
      users.forEach(user => {
        console.log(`   - ID: ${user.ID}, Nombre: ${user.Nombre}`)
      })
    } catch (error) {
      console.log('❌ Error al consultar usuarios:', error.message)
    }
    
    // Verificar libros
    try {
      const books = await db.all('SELECT COUNT(*) as count FROM books')
      console.log(`📚 Libros en la base de datos: ${books[0].count}`)
    } catch (error) {
      console.log('❌ Error al consultar libros:', error.message)
    }
    
    await db.close()
    
  } catch (error) {
    console.log('❌ Error de conexión a la base de datos:', error.message)
  }
  
  // 3. Archivos importantes
  console.log('\n📁 ARCHIVOS:')
  try {
    const fs = await import('fs')
    console.log(`database.sqlite existe: ${fs.existsSync(dbPath) ? '✅' : '❌'}`)
  } catch (error) {
    console.log('❌ Error verificando archivos:', error.message)
  }
  
  console.log('\n🎯 RECOMENDACIONES:')
  if (!process.env.JWT_SECRET_KEY) {
    console.log('❌ JWT_SECRET_KEY no configurado en Render')
  }
  if (!process.env.FRONTEND_URL) {
    console.log('❌ FRONTEND_URL no configurado en Render')
  }
  if (!process.env.ADMIN_USERNAME) {
    console.log('❌ ADMIN_USERNAME no configurado en Render')
  }
  if (!process.env.ADMIN_PASSWORD) {
    console.log('❌ ADMIN_PASSWORD no configurado en Render')
  }
  
  console.log('\n✅ Diagnóstico completado')
}

diagnoseDeployment().catch(console.error)
