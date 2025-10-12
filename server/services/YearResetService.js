import db from '../db/connection.js';

/**
 * Servicio de Reset Anual de Numeración de Resoluciones
 *
 * Este servicio maneja la lógica de reset automático de numeración
 * cada 1 de enero, manteniendo el formato {número}-{año} y preservando
 * todos los datos históricos.
 */
class YearResetService {
  constructor() {
    this.timezone = process.env.TIMEZONE || 'America/Argentina/Buenos_Aires';
    this.resetHour = parseInt(process.env.RESET_HOUR || '0', 10);
    this.lastCheckedYear = null;

    console.log(
      `📅 YearResetService inicializado - Zona horaria: ${this.timezone}`
    );
  }

  /**
   * Obtiene el año actual en la zona horaria configurada
   */
  getCurrentYear() {
    // Usar la fecha local del servidor
    const now = new Date();
    return now.getFullYear();
  }

  /**
   * Extrae el número y el año de un NumdeResolucion
   * Soporta múltiples formatos:
   * - "001-2025" -> { number: 1, year: 2025 }
   * - "123" -> { number: 123, year: null }
   * - "RES-045-2024" -> { number: 45, year: 2024 }
   */
  parseResolutionNumber(resolutionNumber) {
    if (!resolutionNumber) {
      return { number: 0, year: null };
    }

    const str = String(resolutionNumber);

    // Formato: "NNN-YYYY" o "NNNN-YYYY"
    const yearFormatMatch = str.match(/^(\d+)-(\d{4})$/);
    if (yearFormatMatch) {
      return {
        number: parseInt(yearFormatMatch[1], 10),
        year: parseInt(yearFormatMatch[2], 10),
      };
    }

    // Formato: "RES-NNN-YYYY"
    const resFormatMatch = str.match(/^RES-(\d+)-(\d{4})$/);
    if (resFormatMatch) {
      return {
        number: parseInt(resFormatMatch[1], 10),
        year: parseInt(resFormatMatch[2], 10),
      };
    }

    // Formato: "YYYYNNN" (7 dígitos)
    if (/^\d{7}$/.test(str)) {
      return {
        number: parseInt(str.slice(-3), 10),
        year: parseInt(str.slice(0, 4), 10),
      };
    }

    // Formato: Solo número
    if (/^\d+$/.test(str)) {
      return {
        number: parseInt(str, 10),
        year: null,
      };
    }

    // Formato desconocido
    return { number: 0, year: null };
  }

  /**
   * Obtiene el último número de resolución del año especificado
   */
  async getLastNumberForYear(year) {
    try {
      const result = await db.query(
        `
        SELECT "NumdeResolucion" 
        FROM resolution 
        WHERE "NumdeResolucion" LIKE $1 
           OR "NumdeResolucion" LIKE $2
        ORDER BY "NumdeResolucion" DESC
      `,
        [`%-${year}`, `RES-%-${year}`]
      );

      if (result.rows.length === 0) {
        return 0;
      }

      // Extraer el máximo número de todas las resoluciones del año
      let maxNumber = 0;
      for (const row of result.rows) {
        const parsed = this.parseResolutionNumber(row.NumdeResolucion);
        if (parsed.year === year && parsed.number > maxNumber) {
          maxNumber = parsed.number;
        }
      }

      return maxNumber;
    } catch (error) {
      console.error('❌ Error obteniendo último número del año:', error);
      throw error;
    }
  }

  /**
   * Genera el siguiente número de resolución para el año actual
   * Formato: "001-2025", "002-2025", etc.
   */
  async getNextResolutionNumber() {
    try {
      const currentYear = this.getCurrentYear();
      const lastNumber = await this.getLastNumberForYear(currentYear);
      const nextNumber = lastNumber + 1;

      // Formatear con padding de 3 dígitos
      const formattedNumber = String(nextNumber).padStart(3, '0');
      const resolutionNumber = `${formattedNumber}-${currentYear}`;

      console.log(
        `📊 Generando número de resolución: ${resolutionNumber} (último: ${lastNumber})`
      );

      return resolutionNumber;
    } catch (error) {
      console.error('❌ Error generando siguiente número:', error);
      throw error;
    }
  }

  /**
   * Verifica si necesita hacer reset (cambió el año)
   * Retorna true si es necesario resetear
   */
  async checkIfResetNeeded() {
    const currentYear = this.getCurrentYear();

    // Primera verificación
    if (this.lastCheckedYear === null) {
      this.lastCheckedYear = currentYear;
      console.log(`📅 Primera verificación del año: ${currentYear}`);
      return false;
    }

    // Verificar si cambió el año
    if (currentYear > this.lastCheckedYear) {
      console.log(
        `🔄 ¡Cambio de año detectado! ${this.lastCheckedYear} → ${currentYear}`
      );
      this.lastCheckedYear = currentYear;
      return true;
    }

    return false;
  }

  /**
   * Ejecuta el reset anual
   * En realidad no hace nada porque el sistema ya maneja automáticamente
   * el cambio de año al generar números con el año actual
   */
  async executeYearReset() {
    try {
      const currentYear = this.getCurrentYear();
      const now = new Date();
      const formattedDate = now.toLocaleString('es-AR', {
        timeZone: this.timezone,
      });

      console.log('\n' + '='.repeat(60));
      console.log('🎉 EJECUTANDO RESET ANUAL DE NUMERACIÓN');
      console.log('='.repeat(60));
      console.log(`📅 Fecha: ${formattedDate}`);
      console.log(`🔢 Nuevo año: ${currentYear}`);
      console.log(`📍 Zona horaria: ${this.timezone}`);

      // Verificar si ya existen resoluciones del nuevo año
      const existingCount = await db.query(
        `
        SELECT COUNT(*) as count 
        FROM resolution 
        WHERE "NumdeResolucion" LIKE $1
      `,
        [`%-${currentYear}`]
      );

      const count = parseInt(existingCount.rows[0].count, 10);

      if (count > 0) {
        console.log(
          `⚠️  Ya existen ${count} resoluciones del año ${currentYear}`
        );
        console.log(
          '✅ El sistema continuará desde el último número registrado'
        );
      } else {
        console.log(
          `✨ Año ${currentYear} limpio - La numeración comenzará desde 001-${currentYear}`
        );
      }

      // Obtener estadísticas de años anteriores
      const yearsStats = await this.getYearlyStatistics();
      console.log('\n📊 Estadísticas históricas:');
      for (const stat of yearsStats) {
        console.log(`   ${stat.year || 'Sin año'}: ${stat.count} resoluciones`);
      }

      console.log('\n✅ Reset anual completado exitosamente');
      console.log('='.repeat(60) + '\n');

      return {
        success: true,
        year: currentYear,
        existingResolutions: count,
        message:
          count > 0
            ? `Continuando numeración del año ${currentYear}`
            : `Iniciando numeración del año ${currentYear} desde 001`,
      };
    } catch (error) {
      console.error('❌ Error ejecutando reset anual:', error);
      throw error;
    }
  }

  /**
   * Obtiene estadísticas de resoluciones por año
   */
  async getYearlyStatistics() {
    try {
      const result = await db.query(`
        SELECT "NumdeResolucion" 
        FROM resolution 
        ORDER BY "NumdeResolucion"
      `);

      const yearCounts = {};

      for (const row of result.rows) {
        const parsed = this.parseResolutionNumber(row.NumdeResolucion);
        const yearKey = parsed.year || 'legacy';
        yearCounts[yearKey] = (yearCounts[yearKey] || 0) + 1;
      }

      return Object.entries(yearCounts)
        .map(([year, count]) => ({ year, count }))
        .sort((a, b) => {
          if (a.year === 'legacy') return 1;
          if (b.year === 'legacy') return -1;
          return parseInt(b.year) - parseInt(a.year);
        });
    } catch (error) {
      console.error('❌ Error obteniendo estadísticas:', error);
      return [];
    }
  }

  /**
   * Verifica si un número de resolución tiene formato válido
   */
  validateResolutionFormat(resolutionNumber) {
    const str = String(resolutionNumber);

    // Formatos válidos:
    // - "001-2025" (formato nuevo)
    // - "123" (formato legacy)
    // - "RES-001-2025" (formato alternativo)

    const validFormats = [
      /^\d{3,4}-\d{4}$/, // NNN-YYYY o NNNN-YYYY
      /^\d+$/, // Solo números (legacy)
      /^RES-\d{3,4}-\d{4}$/, // RES-NNN-YYYY
    ];

    return validFormats.some(regex => regex.test(str));
  }

  /**
   * Migra un número de resolución antiguo al nuevo formato
   */
  migrateToNewFormat(oldNumber, year) {
    const parsed = this.parseResolutionNumber(oldNumber);

    // Si ya tiene formato con año, no hacer nada
    if (parsed.year !== null) {
      return oldNumber;
    }

    // Convertir al nuevo formato
    const formattedNumber = String(parsed.number).padStart(3, '0');
    return `${formattedNumber}-${year}`;
  }

  /**
   * Ejecuta verificación periódica de reset
   * Este método debe ser llamado regularmente (por ejemplo, cada día a medianoche)
   */
  async periodicCheck() {
    try {
      const now = new Date();
      const hour = now.getHours();

      console.log(
        `⏰ Verificación periódica - Hora: ${now.toLocaleTimeString('es-AR')}`
      );

      // Solo verificar a la hora configurada (por defecto medianoche)
      if (hour === this.resetHour) {
        const needsReset = await this.checkIfResetNeeded();

        if (needsReset) {
          console.log('🔔 ¡Reset anual necesario!');
          await this.executeYearReset();
        } else {
          console.log('✅ No se requiere reset - Año actual sin cambios');
        }
      }
    } catch (error) {
      console.error('❌ Error en verificación periódica:', error);
    }
  }

  /**
   * Inicializa el servicio al arrancar el servidor
   */
  async initialize() {
    try {
      const currentYear = this.getCurrentYear();
      this.lastCheckedYear = currentYear;

      console.log('\n' + '='.repeat(60));
      console.log('🚀 Inicializando YearResetService');
      console.log('='.repeat(60));
      console.log(`📅 Año actual: ${currentYear}`);
      console.log(`📍 Zona horaria: ${this.timezone}`);
      console.log(`⏰ Hora de reset: ${this.resetHour}:00`);

      // Obtener estadísticas
      const stats = await this.getYearlyStatistics();
      console.log('\n📊 Resoluciones por año:');
      for (const stat of stats) {
        console.log(`   ${stat.year || 'Legacy'}: ${stat.count} resoluciones`);
      }

      const lastNumber = await this.getLastNumberForYear(currentYear);
      console.log(`\n🔢 Último número del año ${currentYear}: ${lastNumber}`);
      console.log(
        `➡️  Próximo número: ${String(lastNumber + 1).padStart(
          3,
          '0'
        )}-${currentYear}`
      );
      console.log('='.repeat(60) + '\n');

      return {
        success: true,
        currentYear,
        lastNumber,
        statistics: stats,
      };
    } catch (error) {
      console.error('❌ Error inicializando YearResetService:', error);
      throw error;
    }
  }
}

// Exportar instancia singleton
const yearResetService = new YearResetService();

export default yearResetService;
