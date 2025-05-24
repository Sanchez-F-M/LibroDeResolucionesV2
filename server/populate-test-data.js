/**
 * Script para poblar la base de datos con datos de prueba
 * Este script se ejecuta una sola vez para agregar resoluciones de ejemplo
 */

import db from './db/connection.js';

const testResolutions = [
  {
    NumdeResolucion: 2025001,
    Asunto: 'Designación de Personal de Seguridad',
    Referencia: 'Expediente N° 12345/2025 - Ministerio de Seguridad',
    FechaCreacion: '2025-01-15',
    images: [
      'uploads/resolution-2025001-page1.jpg',
      'uploads/resolution-2025001-page2.jpg'
    ]
  },
  {
    NumdeResolucion: 2025002,
    Asunto: 'Modificación de Horarios de Guardia',
    Referencia: 'Nota Interna N° 456/2025 - Departamento de Personal',
    FechaCreacion: '2025-01-16',
    images: [
      'uploads/resolution-2025002-page1.jpg'
    ]
  },
  {
    NumdeResolucion: 2025003,
    Asunto: 'Adquisición de Equipamiento Policial',
    Referencia: 'Licitación Pública N° 001/2025 - Suministros',
    FechaCreacion: '2025-01-17',
    images: [
      'uploads/resolution-2025003-page1.jpg',
      'uploads/resolution-2025003-page2.jpg',
      'uploads/resolution-2025003-page3.jpg'
    ]
  },
  {
    NumdeResolucion: 2025004,
    Asunto: 'Protocolo de Seguridad COVID-19',
    Referencia: 'Circular N° 789/2025 - Área de Salud Ocupacional',
    FechaCreacion: '2025-01-18',
    images: []
  },
  {
    NumdeResolucion: 2025005,
    Asunto: 'Creación de Nueva Comisaría',
    Referencia: 'Decreto Provincial N° 123/2025 - Gobernación',
    FechaCreacion: '2025-01-19',
    images: [
      'uploads/resolution-2025005-page1.jpg',
      'uploads/resolution-2025005-page2.jpg'
    ]
  }
];

async function populateTestData() {
  try {
    console.log('🔄 Iniciando población de datos de prueba...');
    
    // Iniciar transacción
    await db.exec('BEGIN TRANSACTION');
    
    for (const resolution of testResolutions) {
      // Verificar si la resolución ya existe
      const existing = await db.get(
        'SELECT NumdeResolucion FROM resolution WHERE NumdeResolucion = ?',
        [resolution.NumdeResolucion]
      );
      
      if (existing) {
        console.log(`⚠️  Resolución ${resolution.NumdeResolucion} ya existe, omitiendo...`);
        continue;
      }
      
      // Insertar resolución
      await db.run(
        'INSERT INTO resolution (NumdeResolucion, Asunto, Referencia, FechaCreacion) VALUES (?, ?, ?, ?)',
        [resolution.NumdeResolucion, resolution.Asunto, resolution.Referencia, resolution.FechaCreacion]
      );
      
      console.log(`✅ Resolución ${resolution.NumdeResolucion} creada`);
      
      // Insertar imágenes si existen
      for (const imagePath of resolution.images) {
        await db.run(
          'INSERT INTO images (NumdeResolucion, ImagePath) VALUES (?, ?)',
          [resolution.NumdeResolucion, imagePath]
        );
      }
      
      if (resolution.images.length > 0) {
        console.log(`   📸 ${resolution.images.length} imagen(es) asociada(s)`);
      }
    }
    
    // Confirmar transacción
    await db.exec('COMMIT');
    
    console.log('🎉 Datos de prueba poblados exitosamente');
    
    // Verificar datos insertados
    const count = await db.get('SELECT COUNT(*) as total FROM resolution');
    console.log(`📊 Total de resoluciones en la base de datos: ${count.total}`);
    
    // Mostrar algunas resoluciones
    const resolutions = await db.all('SELECT NumdeResolucion, Asunto FROM resolution ORDER BY NumdeResolucion DESC LIMIT 5');
    console.log('📋 Últimas resoluciones:');
    resolutions.forEach(r => {
      console.log(`   - ${r.NumdeResolucion}: ${r.Asunto}`);
    });
    
  } catch (error) {
    await db.exec('ROLLBACK');
    console.error('❌ Error al poblar datos de prueba:', error);
    throw error;
  }
}

async function main() {
  try {
    await populateTestData();
    console.log('✅ Script completado exitosamente');
    process.exit(0);
  } catch (error) {
    console.error('💥 Error fatal:', error);
    process.exit(1);
  }
}

// Ejecutar main
main();
