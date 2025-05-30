// Script para verificar y mostrar la estructura de la base de datos SQLite
import sqlite3 from 'sqlite3'
import { open } from 'sqlite'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Ruta de la base de datos
const dbPath = path.join(__dirname, 'database.sqlite')

async function checkDatabase() {
  let db = null
  
  try {
    console.log('🔍 VERIFICACIÓN DE BASE DE DATOS SQLite')
    console.log('=' .repeat(50))
    console.log(`📍 Ruta de la BD: ${dbPath}`)
    console.log('')

    // Conectar a la base de datos
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database
    })

    console.log('✅ Conexión exitosa a la base de datos')
    console.log('')

    // 1. Mostrar todas las tablas
    console.log('📋 TABLAS EXISTENTES:')
    console.log('-'.repeat(30))
    
    const tables = await db.all(`
      SELECT name FROM sqlite_master 
      WHERE type='table' AND name NOT LIKE 'sqlite_%'
      ORDER BY name
    `)

    if (tables.length === 0) {
      console.log('⚠️  No se encontraron tablas en la base de datos')
    } else {
      tables.forEach((table, index) => {
        console.log(`${index + 1}. ${table.name}`)
      })
    }
    console.log('')

    // 2. Mostrar estructura de cada tabla
    for (const table of tables) {
      console.log(`🗂️  ESTRUCTURA DE LA TABLA: ${table.name.toUpperCase()}`)
      console.log('-'.repeat(40))
      
      const columns = await db.all(`PRAGMA table_info(${table.name})`)
      
      console.log('Columnas:')
      columns.forEach(col => {
        const pk = col.pk ? ' [PRIMARY KEY]' : ''
        const notNull = col.notnull ? ' [NOT NULL]' : ''
        const defaultVal = col.dflt_value ? ` [DEFAULT: ${col.dflt_value}]` : ''
        console.log(`  • ${col.name}: ${col.type}${pk}${notNull}${defaultVal}`)
      })

      // Mostrar foreign keys si existen
      const foreignKeys = await db.all(`PRAGMA foreign_key_list(${table.name})`)
      if (foreignKeys.length > 0) {
        console.log('Foreign Keys:')
        foreignKeys.forEach(fk => {
          console.log(`  • ${fk.from} → ${fk.table}.${fk.to}`)
        })
      }

      // Mostrar índices
      const indexes = await db.all(`PRAGMA index_list(${table.name})`)
      if (indexes.length > 0) {
        console.log('Índices:')
        indexes.forEach(idx => {
          console.log(`  • ${idx.name} (${idx.unique ? 'UNIQUE' : 'INDEX'})`)
        })
      }

      // Contar registros
      const count = await db.get(`SELECT COUNT(*) as count FROM ${table.name}`)
      console.log(`Registros: ${count.count}`)
      console.log('')
    }

    // 3. Mostrar datos de muestra de cada tabla
    for (const table of tables) {
      console.log(`📄 DATOS DE MUESTRA - ${table.name.toUpperCase()}`)
      console.log('-'.repeat(40))
      
      const count = await db.get(`SELECT COUNT(*) as count FROM ${table.name}`)
      
      if (count.count === 0) {
        console.log('⚠️  Tabla vacía')
      } else {
        const sampleData = await db.all(`SELECT * FROM ${table.name} LIMIT 3`)
        
        if (sampleData.length > 0) {
          // Mostrar headers
          const headers = Object.keys(sampleData[0])
          console.log(headers.join(' | '))
          console.log('-'.repeat(headers.join(' | ').length))
          
          // Mostrar datos
          sampleData.forEach(row => {
            const values = headers.map(header => {
              const val = row[header]
              if (val === null) return 'NULL'
              if (typeof val === 'string' && val.length > 30) {
                return val.substring(0, 27) + '...'
              }
              return val
            })
            console.log(values.join(' | '))
          })
          
          if (count.count > 3) {
            console.log(`... y ${count.count - 3} registros más`)
          }
        }
      }
      console.log('')
    }

    // 4. Verificar integridad referencial
    console.log('🔗 VERIFICACIÓN DE INTEGRIDAD REFERENCIAL')
    console.log('-'.repeat(40))
    
    const integrityCheck = await db.get('PRAGMA integrity_check')
    console.log(`Estado: ${integrityCheck.integrity_check}`)
    
    const foreignKeyCheck = await db.get('PRAGMA foreign_key_check')
    if (foreignKeyCheck) {
      console.log('⚠️  Problema de foreign key detectado:', foreignKeyCheck)
    } else {
      console.log('✅ Foreign keys: OK')
    }
    console.log('')

    // 5. Información general de la base de datos
    console.log('ℹ️  INFORMACIÓN GENERAL')
    console.log('-'.repeat(30))
    
    const version = await db.get('SELECT sqlite_version() as version')
    console.log(`Versión SQLite: ${version.version}`)
    
    const pageCount = await db.get('PRAGMA page_count')
    const pageSize = await db.get('PRAGMA page_size')
    const dbSize = (pageCount.page_count * pageSize.page_size) / 1024 // KB
    
    console.log(`Tamaño de la BD: ${dbSize.toFixed(2)} KB`)
    console.log(`Páginas: ${pageCount.page_count}`)
    console.log(`Tamaño de página: ${pageSize.page_size} bytes`)

  } catch (error) {
    console.error('❌ Error al verificar la base de datos:', error)
  } finally {
    if (db) {
      await db.close()
      console.log('')
      console.log('🔒 Conexión cerrada')
    }
  }
}

// Ejecutar la verificación
checkDatabase()
  .then(() => {
    console.log('🎉 Verificación completada')
  })
  .catch((error) => {
    console.error('💥 Error en la verificación:', error)
    process.exit(1)
  })