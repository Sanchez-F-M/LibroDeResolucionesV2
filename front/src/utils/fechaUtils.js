import { format } from 'date-fns';
import { es } from 'date-fns/locale';

/**
 * Utilidades para manejo robusto de fechas en el sistema
 */

/**
 * Limpia y corrige el formato de fecha que viene del backend
 * @param {string} fechaString - La fecha en formato string desde el backend
 * @returns {string} - Fecha corregida en formato válido
 */
export function limpiarFecha(fechaString) {
  if (!fechaString) return null;
  
  // Corregir dobles guiones que pueden venir del backend
  let fechaLimpia = fechaString.toString().replace(/--+/g, '-');
  
  // Asegurar que no termine o empiece con guión
  fechaLimpia = fechaLimpia.replace(/^-+|-+$/g, '');
  
  return fechaLimpia;
}

/**
 * Valida si una fecha string puede ser parseada correctamente
 * @param {string} fechaString - La fecha a validar
 * @returns {boolean} - true si es válida, false si no
 */
export function esFechaValida(fechaString) {
  if (!fechaString) return false;
  
  try {
    const fechaLimpia = limpiarFecha(fechaString);
    const fecha = new Date(fechaLimpia);
    return !isNaN(fecha.getTime()) && fecha.getFullYear() > 1900;
  } catch (error) {
    return false;
  }
}

/**
 * Formatea una fecha para mostrar en tarjetas/tablas (formato corto)
 * @param {string} fechaString - La fecha desde el backend
 * @returns {string} - Fecha formateada o mensaje de fallback
 */
export function formatearFechaCorta(fechaString) {
  if (!fechaString) return 'Fecha no disponible';
  
  try {
    const fechaLimpia = limpiarFecha(fechaString);
    
    if (!esFechaValida(fechaLimpia)) {
      console.warn('⚠️ Fecha inválida recibida:', fechaString);
      return 'Fecha inválida';
    }
    
    const fecha = new Date(fechaLimpia);
    return format(fecha, 'dd/MM/yyyy', { locale: es });
  } catch (error) {
    console.error('❌ Error al formatear fecha:', error, 'Fecha original:', fechaString);
    return 'Error en fecha';
  }
}

/**
 * Formatea una fecha para mostrar en modales (formato largo)
 * @param {string} fechaString - La fecha desde el backend  
 * @returns {string} - Fecha formateada en formato largo o mensaje de fallback
 */
export function formatearFechaLarga(fechaString) {
  if (!fechaString) return 'Fecha no disponible';
  
  try {
    const fechaLimpia = limpiarFecha(fechaString);
    
    if (!esFechaValida(fechaLimpia)) {
      console.warn('⚠️ Fecha inválida recibida:', fechaString);
      return 'Fecha inválida';
    }
    
    const fecha = new Date(fechaLimpia);
    return format(fecha, 'dd \'de\' MMMM \'de\' yyyy', { locale: es });
  } catch (error) {
    console.error('❌ Error al formatear fecha:', error, 'Fecha original:', fechaString);
    return 'Error en fecha';
  }
}

/**
 * Debug: Muestra información sobre una fecha problemática
 * @param {string} fechaString - La fecha a analizar
 * @param {string} contexto - Contexto donde se está usando
 */
export function debugFecha(fechaString, contexto = '') {
  console.group(`🐛 Debug fecha ${contexto ? `(${contexto})` : ''}`);
  console.log('📅 Fecha original:', fechaString);
  console.log('🧽 Fecha limpia:', limpiarFecha(fechaString));
  console.log('✅ Es válida:', esFechaValida(fechaString));
  
  if (esFechaValida(fechaString)) {
    const fechaLimpia = limpiarFecha(fechaString);
    const fecha = new Date(fechaLimpia);
    console.log('📊 Objeto Date:', fecha);
    console.log('📝 Formato corto:', formatearFechaCorta(fechaString));
    console.log('📜 Formato largo:', formatearFechaLarga(fechaString));
  }
  
  console.groupEnd();
}

// Exportar todas las utilidades
export default {
  limpiarFecha,
  esFechaValida,
  formatearFechaCorta,
  formatearFechaLarga,
  debugFecha
};
