#!/usr/bin/env node

/**
 * Script para probar específicamente el funcionamiento de las fechas en el frontend
 */

const https = require('https');

function makeRequest(method, path, data = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'libro-resoluciones-api.onrender.com',
      port: 443,
      path: path,
      method: method,
      headers: {
        'Content-Type': 'application/json',
      }
    };

    if (data) {
      const postData = JSON.stringify(data);
      options.headers['Content-Length'] = Buffer.byteLength(postData);
    }

    const req = https.request(options, (res) => {
      let responseData = '';
      
      res.on('data', (chunk) => {
        responseData += chunk;
      });
      
      res.on('end', () => {
        try {
          const parsed = JSON.parse(responseData);
          resolve(parsed);
        } catch (e) {
          resolve(responseData);
        }
      });
    });

    req.on('error', (e) => {
      reject(e);
    });

    if (data) {
      req.write(JSON.stringify(data));
    }
    
    req.end();
  });
}

// Simular las funciones de fechaUtils para verificar que funcionan
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
    return fecha.toLocaleDateString('es-ES');
  } catch (error) {
    console.error('❌ Error al formatear fecha:', error, 'Fecha original:', fechaString);
    return 'Error en fecha';
  }
}

async function probarFechas() {
  try {
    console.log('🧪 Probando funcionalidad de fechas...\n');
    
    // 1. Obtener datos del backend
    console.log('📡 Obteniendo datos del backend...');
    const resoluciones = await makeRequest('GET', '/api/books/all');
    
    if (!resoluciones || resoluciones.length === 0) {
      console.log('❌ No se encontraron resoluciones');
      return;
    }
    
    console.log(`✅ Obtenidas ${resoluciones.length} resoluciones\n`);
    
    // 2. Probar cada fecha
    resoluciones.forEach((res, index) => {
      console.log(`📄 Resolución ${index + 1}: ${res.NumdeResolucion}`);
      console.log(`   📅 Fecha raw: "${res.fetcha_creacion}"`);
      
      // Aplicar las funciones de limpieza
      const fechaLimpia = limpiarFecha(res.fetcha_creacion);
      console.log(`   🧽 Fecha limpia: "${fechaLimpia}"`);
      
      const esValida = esFechaValida(res.fetcha_creacion);
      console.log(`   ✅ Es válida: ${esValida}`);
      
      if (esValida) {
        const fechaFormateada = formatearFechaCorta(res.fetcha_creacion);
        console.log(`   🎨 Fecha formateada: "${fechaFormateada}"`);
        console.log(`   ✨ RESULTADO: Las fechas deberían mostrarse como "${fechaFormateada}" en el frontend`);
      } else {
        console.log(`   ❌ PROBLEMA: Esta fecha no se mostrará correctamente`);
      }
      
      console.log('');
    });
    
    // 3. Resumen
    const fechasValidas = resoluciones.filter(res => esFechaValida(res.fetcha_creacion)).length;
    
    console.log('📊 RESUMEN DE PRUEBA:');
    console.log(`   • Total de resoluciones: ${resoluciones.length}`);
    console.log(`   • Fechas válidas: ${fechasValidas}`);
    console.log(`   • Fechas problemáticas: ${resoluciones.length - fechasValidas}`);
    
    if (fechasValidas === resoluciones.length) {
      console.log('\n🎉 ¡ÉXITO! Todas las fechas deberían mostrarse correctamente en el frontend');
      console.log('   👉 Visita http://localhost:5174 y ve a la sección de búsquedas para verificar');
    } else {
      console.log('\n⚠️  Hay algunas fechas que podrían no mostrarse correctamente');
      console.log('   👉 Las fechas válidas se mostrarán bien, las inválidas mostrarán "Fecha inválida"');
    }
    
  } catch (error) {
    console.error('❌ Error durante la prueba:', error);
  }
}

// Ejecutar la prueba
probarFechas();
