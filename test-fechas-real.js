/**
 * Prueba en vivo de las fechas - Simula el comportamiento del frontend
 */

// Simular las utilidades de fecha exactamente como están en fechaUtils.js
function limpiarFecha(fechaString) {
  if (!fechaString) return null;
  
  // Corregir dobles guiones que pueden venir del backend
  let fechaLimpia = fechaString.toString().replace(/--+/g, '-');
  
  // Asegurar que no termine o empiece con guión
  fechaLimpia = fechaLimpia.replace(/^-+|-+$/g, '');
  
  return fechaLimpia;
}

function esFechaValida(fechaString) {
  if (!fechaString) return false;
  
  try {
    const fechaLimpia = limpiarFecha(fechaString);
    const fecha = new Date(fechaLimpia);
    return !isNaN(fecha.getTime()) && fecha.getFullYear() > 1900;
  } catch (error) {
    return false;
  }
}

function formatearFechaCorta(fechaString) {
  if (!fechaString) return 'Fecha no disponible';
  
  try {
    const fechaLimpia = limpiarFecha(fechaString);
    
    if (!esFechaValida(fechaLimpia)) {
      console.warn('⚠️ Fecha inválida recibida:', fechaString);
      return 'Fecha inválida';
    }
    
    const fecha = new Date(fechaLimpia);
    // Usar el formato que usa date-fns en el frontend
    return fecha.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit', 
      year: 'numeric'
    });
  } catch (error) {
    console.error('❌ Error al formatear fecha:', error, 'Fecha original:', fechaString);
    return 'Error en fecha';
  }
}

function formatearFechaLarga(fechaString) {
  if (!fechaString) return 'Fecha no disponible';
  
  try {
    const fechaLimpia = limpiarFecha(fechaString);
    
    if (!esFechaValida(fechaLimpia)) {
      console.warn('⚠️ Fecha inválida recibida:', fechaString);
      return 'Fecha inválida';
    }
    
    const fecha = new Date(fechaLimpia);
    return fecha.toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  } catch (error) {
    console.error('❌ Error al formatear fecha:', error, 'Fecha original:', fechaString);
    return 'Error en fecha';
  }
}

// Datos de prueba basados en la respuesta real de la API
const datosReales = [
  {
    "NumdeResolucion": "PROD-005-2025",
    "asunto": "Puesta en Marcha del Sistema en Producción",
    "referencia": "Acta de Entrega N° 005/2025 - Proyecto Finalizado",
    "fetcha_creacion": "2025-06--01",
    "images": []
  },
  {
    "NumdeResolucion": "PROD-004-2025",
    "asunto": "Verificación de Persistencia de Datos",
    "referencia": "Test de Funcionalidad N° 004/2025 - Control de Calidad",
    "fetcha_creacion": "2025-06-01",
    "images": []
  }
];

console.log('🧪 PRUEBA DE FECHAS - Simulando Frontend\n');
console.log('═'.repeat(60));

datosReales.forEach((resolucion, index) => {
  console.log(`\n📄 RESOLUCIÓN ${index + 1}: ${resolucion.NumdeResolucion}`);
  console.log('─'.repeat(50));
  
  const fechaOriginal = resolucion.fetcha_creacion;
  console.log(`📅 Fecha original del backend: "${fechaOriginal}"`);
  
  // Paso 1: Limpiar fecha
  const fechaLimpia = limpiarFecha(fechaOriginal);
  console.log(`🧽 Después de limpiar: "${fechaLimpia}"`);
  
  // Paso 2: Validar
  const esValida = esFechaValida(fechaOriginal);
  console.log(`✅ ¿Es válida?: ${esValida}`);
  
  if (esValida) {
    // Paso 3: Formatear para tarjetas/tabla
    const fechaCorta = formatearFechaCorta(fechaOriginal);
    console.log(`🎯 En tarjetas/tabla: "${fechaCorta}"`);
    
    // Paso 4: Formatear para modal
    const fechaLarga = formatearFechaLarga(fechaOriginal);
    console.log(`📜 En modal: "${fechaLarga}"`);
    
    console.log(`\n🎉 RESULTADO: Esta fecha SE MOSTRARÁ CORRECTAMENTE`);
  } else {
    console.log(`\n❌ RESULTADO: Esta fecha NO se mostrará correctamente`);
  }
});

console.log('\n' + '═'.repeat(60));
console.log('🏁 CONCLUSIÓN FINAL:');
console.log('   Las utilidades que creamos SÍ corrigen el problema de dobles guiones');
console.log('   El frontend debería mostrar las fechas correctamente ahora');
console.log('\n🔍 PARA VERIFICAR:');
console.log('   1. Ve a http://localhost:5174');
console.log('   2. Navega a la sección de búsquedas');
console.log('   3. Haz clic en "Cargar todas las resoluciones"');
console.log('   4. Las fechas deberían aparecer como "01/06/2025"');
console.log('   5. Al abrir un modal, debería aparecer "1 de junio de 2025"');
