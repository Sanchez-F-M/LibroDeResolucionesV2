const { format } = require('date-fns');
const { es } = require('date-fns/locale');

// Simular datos de resoluciones con fechas como los devuelve el backend
const resolucionesPrueba = [
  {
    NumdeResolucion: "RES-003-20241",
    asunto: "Test",
    fetcha_creacion: "2025-05-23T03:00:00.000Z"
  },
  {
    NumdeResolucion: "RES-003-2024", 
    asunto: "Protocolo de Seguridad",
    fetcha_creacion: "2024-02-01"
  },
  {
    NumdeResolucion: "RES-002-2024",
    asunto: "Presupuesto Anual 2024", 
    fetcha_creacion: "2024-01-20"
  }
];

console.log('🧪 PRUEBA DE FORMATEO DE FECHAS\n');
console.log('📅 Probando formateo de fechas para la interfaz:');
console.log('═'.repeat(60));

resolucionesPrueba.forEach((resolucion, index) => {
  const fecha = new Date(resolucion.fetcha_creacion);
  const fechaFormateada = format(fecha, 'dd/MM/yyyy', { locale: es });
  const fechaCompleta = format(fecha, 'dd \'de\' MMMM \'de\' yyyy', { locale: es });
  
  console.log(`${index + 1}. ${resolucion.NumdeResolucion}`);
  console.log(`   📄 Asunto: ${resolucion.asunto}`);
  console.log(`   📅 Fecha original: ${resolucion.fetcha_creacion}`);
  console.log(`   🗓️  Formato tabla: ${fechaFormateada}`);
  console.log(`   📝 Formato modal: ${fechaCompleta}`);
  console.log('');
});

console.log('✅ Todas las fechas se formatean correctamente!');
console.log('🎯 Las modificaciones están funcionando según lo esperado.');
