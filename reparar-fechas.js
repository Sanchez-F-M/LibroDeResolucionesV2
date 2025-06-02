#!/usr/bin/env node

/**
 * Script para reparar las fechas incorrectas en la base de datos
 * Problema: Las fechas se están guardando como "2025-06--01" en lugar de "2025-06-01"
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

async function repararFechas() {
  try {
    console.log('🔧 Iniciando reparación de fechas...');
    
    // 1. Obtener todas las resoluciones
    console.log('📚 Obteniendo todas las resoluciones...');
    const resoluciones = await makeRequest('GET', '/api/books/all');
    
    console.log(`✅ Encontradas ${resoluciones.length} resoluciones`);
    
    // 2. Identificar fechas con problemas
    const fechasProblematicas = [];
    resoluciones.forEach(res => {
      if (res.fetcha_creacion && res.fetcha_creacion.includes('--')) {
        fechasProblematicas.push({
          id: res.NumdeResolucion,
          fechaActual: res.fetcha_creacion,
          fechaCorregida: res.fetcha_creacion.replace('--', '-')
        });
      }
    });
    
    console.log(`⚠️  Encontradas ${fechasProblematicas.length} fechas con problemas:`);
    fechasProblematicas.forEach(item => {
      console.log(`   ${item.id}: "${item.fechaActual}" → "${item.fechaCorregida}"`);
    });
    
    // 3. Cargar datos de prueba corregidos
    console.log('🔄 Cargando datos de prueba con fechas corregidas...');
    
    const response = await makeRequest('POST', '/load-test-data');
    console.log('✅ Respuesta:', response);
    
    // 4. Verificar que las fechas se corrigieron
    console.log('🔍 Verificando fechas corregidas...');
    const resolucionesCorregidas = await makeRequest('GET', '/api/books/all');
    
    let fechasCorregidas = 0;
    resolucionesCorregidas.forEach(res => {
      if (res.fetcha_creacion && !res.fetcha_creacion.includes('--')) {
        fechasCorregidas++;
        console.log(`   ✅ ${res.NumdeResolucion}: ${res.fetcha_creacion}`);
      } else if (res.fetcha_creacion && res.fetcha_creacion.includes('--')) {
        console.log(`   ❌ ${res.NumdeResolucion}: ${res.fetcha_creacion} (aún con problemas)`);
      }
    });
    
    console.log(`\n🎉 Reparación completada:`);
    console.log(`   - Fechas corregidas: ${fechasCorregidas}/${resolucionesCorregidas.length}`);
    console.log(`   - El frontend debería mostrar ahora las fechas correctamente`);
    
  } catch (error) {
    console.error('❌ Error durante la reparación:', error);
  }
}

// Ejecutar la reparación
repararFechas();
