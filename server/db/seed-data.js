import db from './sqlite-connection.js'
import bcrypt from 'bcrypt'

async function seedDatabase() {
  try {
    console.log('🌱 Iniciando seed de datos...')

    // Crear usuario administrador por defecto
    const hashedPassword = await bcrypt.hash('admin123', 10)
    
    try {
      await db.run(`
        INSERT INTO users (Nombre, Contrasena)
        VALUES (?, ?)
      `, ['admin', hashedPassword])
      console.log('✅ Usuario admin creado')
    } catch (error) {
      if (error.code === 'SQLITE_CONSTRAINT_UNIQUE') {
        console.log('⚠️ Usuario admin ya existe')
      } else {
        throw error
      }
    }

    // Insertar resoluciones de ejemplo
    const sampleResolutions = [
      {
        NumdeResolucion: 'RES-001-2024',
        Asunto: 'Normativa de Funcionamiento Interno',
        Referencia: 'REF-2024-001',
        FechaCreacion: '2024-01-15'
      },
      {
        NumdeResolucion: 'RES-002-2024',
        Asunto: 'Presupuesto Anual 2024',
        Referencia: 'REF-2024-002',
        FechaCreacion: '2024-01-20'
      },
      {
        NumdeResolucion: 'RES-003-2024',
        Asunto: 'Protocolo de Seguridad',
        Referencia: 'REF-2024-003',
        FechaCreacion: '2024-02-01'
      }
    ]

    for (const resolution of sampleResolutions) {
      try {
        await db.run(`
          INSERT INTO resolution (NumdeResolucion, Asunto, Referencia, FechaCreacion)
          VALUES (?, ?, ?, ?)
        `, [
          resolution.NumdeResolucion,
          resolution.Asunto,
          resolution.Referencia,
          resolution.FechaCreacion
        ])
        console.log(`✅ Resolución ${resolution.NumdeResolucion} insertada`)
      } catch (error) {
        if (error.code === 'SQLITE_CONSTRAINT_UNIQUE') {
          console.log(`⚠️ Resolución ${resolution.NumdeResolucion} ya existe`)
        } else {
          throw error
        }
      }
    }

    // Insertar imágenes de ejemplo (usando imágenes existentes del directorio uploads)
    const sampleImages = [
      { NumdeResolucion: 'RES-001-2024', ImagePath: 'uploads/1746055049685-diagrama_ep.png' },
      { NumdeResolucion: 'RES-002-2024', ImagePath: 'uploads/1746190709366-3.png' },
      { NumdeResolucion: 'RES-003-2024', ImagePath: 'uploads/1746190839944-3.png' }
    ]

    for (const image of sampleImages) {
      try {
        await db.run(`
          INSERT INTO images (NumdeResolucion, ImagePath)
          VALUES (?, ?)
        `, [image.NumdeResolucion, image.ImagePath])
        console.log(`✅ Imagen para ${image.NumdeResolucion} insertada`)
      } catch (error) {
        console.log(`⚠️ Error al insertar imagen: ${error.message}`)
      }
    }

    console.log('✅ Datos de prueba insertados exitosamente')
  } catch (error) {
    console.error('❌ Error al insertar datos de prueba:', error)
  }
}

// Ejecutar seed automáticamente
await seedDatabase()
console.log('🎉 Script de seed completado')

export { seedDatabase }
