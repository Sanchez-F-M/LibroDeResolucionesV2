// Script para cargar datos de prueba en producción
// Se ejecuta en el backend para insertar resoluciones directamente en la base de datos

const db = require('../../db/connection.js');

const resolucionesPrueba = [
  {
    NumdeResolucion: 'PROD-001-2025',
    Asunto: 'Implementación de Sistema Digital de Resoluciones',
    Referencia: 'Decreto N° 001/2025 - Modernización Tecnológica',
    FechaCreacion: '2025-06-01'
  },
  {
    NumdeResolucion: 'PROD-002-2025',
    Asunto: 'Protocolo de Seguridad de Datos y Persistencia',
    Referencia: 'Circular Técnica N° 002/2025 - Área de Informática',
    FechaCreacion: '2025-06-01'
  },
  {
    NumdeResolucion: 'PROD-003-2025',
    Asunto: 'Configuración de Entorno de Producción',
    Referencia: 'Nota Técnica N° 003/2025 - Departamento de Sistemas',
    FechaCreacion: '2025-06-01'
  },
  {
    NumdeResolucion: 'PROD-004-2025',
    Asunto: 'Verificación de Persistencia de Datos',
    Referencia: 'Test de Funcionalidad N° 004/2025 - Control de Calidad',
    FechaCreacion: '2025-06-01'
  },
  {
    NumdeResolucion: 'PROD-005-2025',
    Asunto: 'Puesta en Marcha del Sistema en Producción',
    Referencia: 'Acta de Entrega N° 005/2025 - Proyecto Finalizado',
    FechaCreacion: '2025-06-01'
  }
];

async function cargarDatosPrueba() {
  try {
    console.log('🔄 Iniciando carga de datos de prueba...');
    
    // Verificar conexión a la base de datos
    await db.get('SELECT 1');
    console.log('✅ Conexión a base de datos establecida');
    
    // Verificar cuántas resoluciones existen actualmente
    const { count } = await db.get('SELECT COUNT(*) as count FROM resolution');
    console.log(`📊 Resoluciones actuales en base de datos: ${count}`);
    
    // Insertar cada resolución de prueba
    for (const resolucion of resolucionesPrueba) {
      try {
        // Verificar si ya existe
        const existing = await db.get(
          'SELECT NumdeResolucion FROM resolution WHERE NumdeResolucion = ?',
          [resolucion.NumdeResolucion]
        );
        
        if (existing) {
          console.log(`⚠️  Resolución ${resolucion.NumdeResolucion} ya existe, saltando...`);
          continue;
        }
        
        // Insertar nueva resolución
        await db.run(
          'INSERT INTO resolution (NumdeResolucion, Asunto, Referencia, FechaCreacion) VALUES (?, ?, ?, ?)',
          [resolucion.NumdeResolucion, resolucion.Asunto, resolucion.Referencia, resolucion.FechaCreacion]
        );
        
        console.log(`✅ Resolución ${resolucion.NumdeResolucion} creada exitosamente`);
        
      } catch (error) {
        console.error(`❌ Error creando resolución ${resolucion.NumdeResolucion}:`, error.message);
      }
    }
    
    // Verificar el resultado final
    const { count: finalCount } = await db.get('SELECT COUNT(*) as count FROM resolution');
    console.log(`📊 Total de resoluciones después de la carga: ${finalCount}`);
    console.log(`🔢 Se agregaron ${finalCount - count} nuevas resoluciones`);
    
    return {
      success: true,
      mensaje: `Datos de prueba cargados exitosamente. Total: ${finalCount} resoluciones`,
      antes: count,
      despues: finalCount,
      agregadas: finalCount - count
    };
    
  } catch (error) {
    console.error('❌ Error en carga de datos de prueba:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

module.exports = { cargarDatosPrueba };
