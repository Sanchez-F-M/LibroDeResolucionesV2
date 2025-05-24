/**
 * Script para poblar la base de datos en producción via endpoint
 * Se ejecutará mediante llamadas HTTP al backend en Render
 */

const BACKEND_URL = 'https://libro-resoluciones-api.onrender.com';

const testResolutions = [
  {
    NumdeResolucion: 2025001,
    Asunto: 'Designación de Personal de Seguridad',
    Referencia: 'Expediente N° 12345/2025 - Ministerio de Seguridad',
    FechaCreacion: '2025-01-15'
  },
  {
    NumdeResolucion: 2025002,
    Asunto: 'Modificación de Horarios de Guardia',
    Referencia: 'Nota Interna N° 456/2025 - Departamento de Personal',
    FechaCreacion: '2025-01-16'
  },
  {
    NumdeResolucion: 2025003,
    Asunto: 'Adquisición de Equipamiento Policial',
    Referencia: 'Licitación Pública N° 001/2025 - Suministros',
    FechaCreacion: '2025-01-17'
  },
  {
    NumdeResolucion: 2025004,
    Asunto: 'Protocolo de Seguridad COVID-19',
    Referencia: 'Circular N° 789/2025 - Área de Salud Ocupacional',
    FechaCreacion: '2025-01-18'
  },
  {
    NumdeResolucion: 2025005,
    Asunto: 'Creación de Nueva Comisaría',
    Referencia: 'Decreto Provincial N° 123/2025 - Gobernación',
    FechaCreacion: '2025-01-19'
  }
];

async function loginAndGetToken() {
  console.log('🔐 Obteniendo token de autenticación...');
  
  const response = await fetch(`${BACKEND_URL}/api/user/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      Nombre: 'admin',
      Contrasena: 'admin123'
    })
  });
  
  const data = await response.json();
  
  if (response.ok && data.token) {
    console.log('✅ Token obtenido exitosamente');
    return data.token;
  } else {
    throw new Error(`Error en login: ${data.error || 'Sin token'}`);
  }
}

async function createResolution(resolution, token) {
  console.log(`📝 Creando resolución ${resolution.NumdeResolucion}...`);
  
  const formData = new FormData();
  formData.append('NumdeResolucion', resolution.NumdeResolucion);
  formData.append('Asunto', resolution.Asunto);
  formData.append('Referencia', resolution.Referencia);
  formData.append('FechaCreacion', resolution.FechaCreacion);
  
  const response = await fetch(`${BACKEND_URL}/api/books`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`
    },
    body: formData
  });
  
  const data = await response.json();
  
  if (response.ok) {
    console.log(`✅ Resolución ${resolution.NumdeResolucion} creada exitosamente`);
    return true;
  } else {
    console.log(`⚠️ Error al crear resolución ${resolution.NumdeResolucion}: ${data.error}`);
    return false;
  }
}

async function populateProductionDatabase() {
  try {
    console.log('🚀 Iniciando población de base de datos en producción...');
    console.log(`🌐 Backend URL: ${BACKEND_URL}`);
    
    // Obtener token de autenticación
    const token = await loginAndGetToken();
    
    // Crear cada resolución
    let created = 0;
    let failed = 0;
    
    for (const resolution of testResolutions) {
      try {
        const success = await createResolution(resolution, token);
        if (success) {
          created++;
        } else {
          failed++;
        }
        
        // Pausa entre requests para no sobrecargar
        await new Promise(resolve => setTimeout(resolve, 1000));
        
      } catch (error) {
        console.error(`❌ Error al crear resolución ${resolution.NumdeResolucion}:`, error.message);
        failed++;
      }
    }
    
    console.log('\n📊 RESUMEN DE POBLACIÓN:');
    console.log(`✅ Resoluciones creadas: ${created}`);
    console.log(`❌ Resoluciones fallidas: ${failed}`);
    console.log(`📋 Total procesadas: ${created + failed}`);
    
    // Verificar resultado final
    console.log('\n🔍 Verificando base de datos...');
    const verifyResponse = await fetch(`${BACKEND_URL}/api/books/all`);
    const allResolutions = await verifyResponse.json();
    
    if (Array.isArray(allResolutions) && allResolutions.length > 0) {
      console.log(`🎉 ¡Éxito! Base de datos tiene ${allResolutions.length} resoluciones`);
      console.log('\n📋 Resoluciones disponibles:');
      allResolutions.forEach(r => {
        console.log(`   - ${r.NumdeResolucion}: ${r.asunto || r.Asunto}`);
      });
    } else {
      console.log('⚠️ La base de datos sigue vacía o hay un problema');
    }
    
  } catch (error) {
    console.error('💥 Error fatal:', error);
  }
}

// Ejecutar si es llamado directamente
if (typeof window !== 'undefined') {
  // Ejecutar en navegador
  populateProductionDatabase();
} else {
  // Ejecutar en Node.js (si se llama desde línea de comandos)
  populateProductionDatabase();
}
