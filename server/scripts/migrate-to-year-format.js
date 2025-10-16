import db from '../db/connection.js';
import yearResetService from '../services/YearResetService.js';

/**
 * Script de Migración de Datos al Nuevo Formato con Año
 *
 * Este script convierte todas las resoluciones existentes sin formato de año
 * al nuevo formato {número}-{año}.
 *
 * Ejemplo:
 * - "1" -> "001-2024" (usando la fecha de creación)
 * - "50" -> "050-2023"
 * - "001-2025" -> Sin cambios (ya tiene formato correcto)
 *
 * IMPORTANTE: Este script es idempotente (puede ejecutarse múltiples veces sin problemas)
 */

const TIMEZONE = process.env.TIMEZONE || 'America/Argentina/Buenos_Aires';
const DEFAULT_YEAR = 2024; // Año por defecto si no hay FechaCreacion

async function migrateResolutionsToYearFormat() {
  console.log('\n' + '='.repeat(70));
  console.log('🔄 INICIANDO MIGRACIÓN DE DATOS AL FORMATO CON AÑO');
  console.log('='.repeat(70));

  const client = await db.connect();
  let migratedCount = 0;
  let skippedCount = 0;
  let errorCount = 0;
  const migrations = [];

  try {
    // Iniciar transacción
    await client.query('BEGIN');

    console.log('\n📊 Obteniendo resoluciones existentes...');

    // Obtener todas las resoluciones
    const result = await client.query(`
      SELECT "NumdeResolucion", "FechaCreacion" 
      FROM resolution 
      ORDER BY "NumdeResolucion"
    `);

    console.log(`📦 Total de resoluciones encontradas: ${result.rows.length}`);

    if (result.rows.length === 0) {
      console.log('⚠️  No hay resoluciones para migrar');
      await client.query('ROLLBACK');
      return;
    }

    console.log('\n🔍 Analizando resoluciones...\n');

    // Procesar cada resolución
    for (const row of result.rows) {
      const oldNumber = row.NumdeResolucion;
      const fechaCreacion = row.FechaCreacion;

      // Verificar si ya tiene formato con año
      const parsed = yearResetService.parseResolutionNumber(oldNumber);

      if (parsed.year !== null) {
        // Ya tiene formato con año, saltar
        console.log(`⏭️  Saltando: ${oldNumber} (ya tiene formato correcto)`);
        skippedCount++;
        continue;
      }

      try {
        // Determinar el año a usar
        let yearToUse = DEFAULT_YEAR;

        if (fechaCreacion) {
          const date = new Date(fechaCreacion);
          if (!isNaN(date.getTime())) {
            yearToUse = date.getFullYear();
          }
        }

        // Generar nuevo número con formato
        const newNumber = yearResetService.migrateToNewFormat(
          oldNumber,
          yearToUse
        );

        // Verificar que el nuevo número no exista ya
        const checkExisting = await client.query(
          'SELECT "NumdeResolucion" FROM resolution WHERE "NumdeResolucion" = $1',
          [newNumber]
        );

        if (
          checkExisting.rows.length > 0 &&
          checkExisting.rows[0].NumdeResolucion !== oldNumber
        ) {
          console.log(
            `⚠️  Conflicto: ${oldNumber} -> ${newNumber} (ya existe)`
          );
          errorCount++;
          continue;
        }

        // Actualizar el número de resolución
        await client.query(
          'UPDATE resolution SET "NumdeResolucion" = $1 WHERE "NumdeResolucion" = $2',
          [newNumber, oldNumber]
        );

        // Actualizar las referencias en la tabla de imágenes
        await client.query(
          'UPDATE images SET "NumdeResolucion" = $1 WHERE "NumdeResolucion" = $2',
          [newNumber, oldNumber]
        );

        console.log(
          `✅ Migrado: ${oldNumber} -> ${newNumber} (año: ${yearToUse})`
        );
        migratedCount++;

        migrations.push({
          old: oldNumber,
          new: newNumber,
          year: yearToUse,
          fecha: fechaCreacion
            ? new Date(fechaCreacion).toISOString().split('T')[0]
            : 'N/A',
        });
      } catch (error) {
        console.error(`❌ Error migrando ${oldNumber}:`, error.message);
        errorCount++;
      }
    }

    // Confirmar transacción
    await client.query('COMMIT');

    console.log('\n' + '='.repeat(70));
    console.log('📊 RESUMEN DE MIGRACIÓN');
    console.log('='.repeat(70));
    console.log(`✅ Resoluciones migradas: ${migratedCount}`);
    console.log(`⏭️  Resoluciones saltadas: ${skippedCount}`);
    console.log(`❌ Errores: ${errorCount}`);
    console.log(`📦 Total procesadas: ${result.rows.length}`);
    console.log('='.repeat(70));

    if (migratedCount > 0) {
      console.log('\n📋 Detalle de migraciones:');
      console.log('─'.repeat(70));
      for (const migration of migrations.slice(0, 10)) {
        console.log(
          `   ${migration.old.padEnd(10)} → ${migration.new.padEnd(
            10
          )} | Año: ${migration.year} | Fecha: ${migration.fecha}`
        );
      }
      if (migrations.length > 10) {
        console.log(`   ... y ${migrations.length - 10} más`);
      }
      console.log('─'.repeat(70));
    }

    // Verificar integridad de datos después de la migración
    console.log('\n🔍 Verificando integridad de datos...');

    const verification = await client.query(`
      SELECT COUNT(*) as count 
      FROM resolution 
      WHERE "NumdeResolucion" NOT LIKE '%-%'
        AND "NumdeResolucion" !~ '^[0-9]{7}$'
    `);

    const legacyCount = parseInt(verification.rows[0].count, 10);

    if (legacyCount > 0) {
      console.log(
        `⚠️  Advertencia: Aún existen ${legacyCount} resoluciones con formato antiguo`
      );
    } else {
      console.log('✅ Todas las resoluciones tienen formato con año');
    }

    // Mostrar estadísticas por año
    const yearStats = await yearResetService.getYearlyStatistics();
    console.log('\n📊 Resoluciones por año después de la migración:');
    for (const stat of yearStats) {
      console.log(`   ${stat.year}: ${stat.count} resoluciones`);
    }

    console.log('\n✅ Migración completada exitosamente');
    console.log('='.repeat(70) + '\n');

    return {
      success: true,
      migrated: migratedCount,
      skipped: skippedCount,
      errors: errorCount,
      total: result.rows.length,
    };
  } catch (error) {
    // Revertir en caso de error
    await client.query('ROLLBACK');
    console.error('\n❌ ERROR CRÍTICO EN LA MIGRACIÓN:', error);
    console.error('🔄 Transacción revertida - No se realizaron cambios');
    throw error;
  } finally {
    client.release();
  }
}

// Función para crear backup antes de migrar (opcional pero recomendado)
async function createBackup() {
  console.log('\n💾 Creando backup de datos...');

  try {
    const now = new Date();
    const timestamp = `${now.getFullYear()}${String(
      now.getMonth() + 1
    ).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}_${String(
      now.getHours()
    ).padStart(2, '0')}${String(now.getMinutes()).padStart(2, '0')}${String(
      now.getSeconds()
    ).padStart(2, '0')}`;
    const backupData = await db.query(`
      SELECT * FROM resolution ORDER BY "NumdeResolucion"
    `);

    console.log(
      `✅ Backup conceptual realizado (${backupData.rows.length} registros)`
    );
    console.log(
      '💡 Tip: En producción, ejecuta un pg_dump antes de la migración'
    );
    console.log(
      `   Comando: pg_dump -h HOST -U USER -d DATABASE > backup_${timestamp}.sql\n`
    );

    return backupData.rows;
  } catch (error) {
    console.error('❌ Error creando backup:', error);
    throw error;
  }
}

// Ejecutar migración si se llama directamente
if (import.meta.url === `file://${process.argv[1]}`) {
  console.log('\n🚀 Ejecutando script de migración...\n');

  // Preguntar confirmación (en un entorno real)
  console.log(
    '⚠️  ADVERTENCIA: Este script modificará los números de resolución'
  );
  console.log(
    '📝 Asegúrate de tener un backup de la base de datos antes de continuar\n'
  );

  try {
    // Crear backup
    await createBackup();

    // Ejecutar migración
    const result = await migrateResolutionsToYearFormat();

    if (result.success) {
      console.log('🎉 ¡Migración exitosa!');
      process.exit(0);
    } else {
      console.error('❌ La migración falló');
      process.exit(1);
    }
  } catch (error) {
    console.error('💥 Error fatal:', error);
    process.exit(1);
  }
}

export { migrateResolutionsToYearFormat, createBackup };
export default migrateResolutionsToYearFormat;
