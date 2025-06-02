#!/usr/bin/env node

/**
 * Script para diagnosticar y corregir fechas en la base de datos
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

async function diagnosticarFechas() {
  try {
    console.log('🔍 Diagnosticando fechas en la base de datos...\n');
    
    // 1. Obtener todas las resoluciones
    const resoluciones = await makeRequest('GET', '/api/books/all');
    console.log(`📚 Total de resoluciones: ${resoluciones.length}\n`);
    
    // 2. Analizar cada fecha
    resoluciones.forEach((res, index) => {
      console.log(`📄 Resolución ${index + 1}: ${res.NumdeResolucion}`);
      console.log(`   📅 Fecha cruda: "${res.fetcha_creacion}"`);
      
      if (res.fetcha_creacion) {
        // Intentar parsear la fecha
        const fechaOriginal = res.fetcha_creacion;
        const fechaCorregida = fechaOriginal.replace(/--+/g, '-'); // Reemplazar múltiples guiones
        
        console.log(`   🔧 Fecha corregida: "${fechaCorregida}"`);
        
        try {
          const fechaParseada = new Date(fechaCorregida);
          if (isNaN(fechaParseada.getTime())) {
            console.log(`   ❌ No se puede parsear como fecha válida`);
          } else {
            console.log(`   ✅ Fecha válida: ${fechaParseada.toLocaleDateString('es-ES')}`);
            
            // Simular el formateo que hace el frontend
            const formatoFrontend = fechaParseada.toLocaleDateString('es-ES', {
              year: 'numeric',
              month: '2-digit', 
              day: '2-digit'
            });
            console.log(`   🎨 Como se vería en frontend: ${formatoFrontend}`);
          }
        } catch (error) {
          console.log(`   ❌ Error al parsear: ${error.message}`);
        }
      } else {
        console.log(`   ❌ No tiene fecha`);
      }
      console.log('');
    });
    
    // 3. Crear una resolución de prueba específica con fecha correcta
    console.log('🧪 Creando resolución de prueba con fecha corregida...');
    
    const resolucionPrueba = {
      NumdeResolucion: 'TEST-FIX-2025',
      Asunto: 'Prueba de Corrección de Fechas',
      Referencia: 'Test de formato de fecha corregido',
      FechaCreacion: '2025-06-01', // Fecha sin dobles guiones
      ImagePaths: []
    };
    
    try {
      const respuesta = await makeRequest('POST', '/api/books/insert-test', resolucionPrueba);
      console.log('✅ Respuesta de inserción:', respuesta);
      
      // Verificar la nueva resolución
      const verificacion = await makeRequest('GET', '/api/books/TEST-FIX-2025');
      console.log('🔍 Verificación de la resolución creada:', verificacion);
      
    } catch (error) {
      console.log('❌ Error al crear resolución de prueba:', error.message);
    }
    
  } catch (error) {
    console.error('❌ Error durante el diagnóstico:', error);
  }
}

// Ejecutar el diagnóstico
diagnosticarFechas();
