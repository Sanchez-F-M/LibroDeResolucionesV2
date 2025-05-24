/**
 * Script para poblar la base de datos de producción con datos de prueba
 * Usa un endpoint especial que no requiere archivos
 */

const API_BASE_URL = 'https://libro-resoluciones-api.onrender.com';

// Función para hacer login y obtener token
async function getAuthToken() {
  try {
    const response = await fetch(`${API_BASE_URL}/api/user/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: 'admin',
        password: 'admin123'
      })
    });

    if (!response.ok) {
      throw new Error(`Error en login: ${response.status} - ${response.statusText}`);
    }

    const data = await response.json();
    return data.token;
  } catch (error) {
    console.error('❌ Error obteniendo token:', error);
    throw error;
  }
}

// Función para insertar resolución directamente en la base de datos (vía endpoint especial)
async function insertResolutionDirect(token, resolutionData) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/books/insert-test`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(resolutionData)
    });

    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(`${response.status}: ${errorData}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`❌ Error insertando resolución ${resolutionData.NumdeResolucion}:`, error.message);
    return null;
  }
}

// Datos de prueba
const testResolutions = [
  {
    NumdeResolucion: 2025001,
    Asunto: 'Aprobación del Presupuesto Anual 2025',
    Referencia: 'Expediente N° 12345/2025 - Secretaría de Hacienda',
    FechaCreacion: '2025-01-15T09:00:00.000Z',
    ImagePaths: ['uploads/presupuesto-2025.pdf', 'uploads/anexo-presupuestal.pdf']
  },
  {
    NumdeResolucion: 2025002,
    Asunto: 'Designación de Personal Policial',
    Referencia: 'Nota N° 456/2025 - División de Recursos Humanos',
    FechaCreacion: '2025-01-20T14:30:00.000Z',
    ImagePaths: ['uploads/designacion-personal.pdf']
  },
  {
    NumdeResolucion: 2025003,
    Asunto: 'Protocolo de Seguridad Ciudadana',
    Referencia: 'Informe N° 789/2025 - Comisaría Central',
    FechaCreacion: '2025-02-01T11:15:00.000Z',
    ImagePaths: ['uploads/protocolo-seguridad.pdf', 'uploads/manual-procedimientos.pdf']
  },
  {
    NumdeResolucion: 2025004,
    Asunto: 'Adquisición de Equipamiento Policial',
    Referencia: 'Licitación N° 101/2025 - Departamento de Compras',
    FechaCreacion: '2025-02-10T16:45:00.000Z',
    ImagePaths: ['uploads/equipamiento-propuesta.pdf', 'uploads/cotizaciones.pdf']
  },
  {
    NumdeResolucion: 2025005,
    Asunto: 'Modificación de Turnos de Servicio',
    Referencia: 'Memorando N° 234/2025 - Jefatura Operativa',
    FechaCreacion: '2025-02-15T08:20:00.000Z',
    ImagePaths: ['uploads/nuevos-turnos.pdf']
  }
];

// Función principal
async function populateDatabase() {
  console.log('🚀 Iniciando población de base de datos en producción (método directo)...');
  console.log('🌐 Backend URL:', API_BASE_URL);

  try {
    // Obtener token de autenticación
    console.log('🔐 Obteniendo token de autenticación...');
    const token = await getAuthToken();
    console.log('✅ Token obtenido exitosamente');

    let successCount = 0;
    let failureCount = 0;

    // Crear cada resolución
    for (const resolution of testResolutions) {
      console.log(`📝 Insertando resolución ${resolution.NumdeResolucion}...`);
      
      const result = await insertResolutionDirect(token, resolution);
      
      if (result) {
        console.log(`✅ Resolución ${resolution.NumdeResolucion} insertada exitosamente`);
        successCount++;
      } else {
        console.log(`❌ Error al insertar resolución ${resolution.NumdeResolucion}`);
        failureCount++;
      }
      
      // Pequeña pausa entre inserciones
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    console.log('\n📊 RESUMEN DE POBLACIÓN:');
    console.log(`✅ Resoluciones insertadas: ${successCount}`);
    console.log(`❌ Resoluciones fallidas: ${failureCount}`);
    console.log(`📈 Total procesadas: ${successCount + failureCount}`);

    // Verificar que los datos se guardaron
    console.log('\n🔍 Verificando base de datos...');
    const verifyResponse = await fetch(`${API_BASE_URL}/api/books/all`);
    
    if (verifyResponse.ok) {
      const data = await verifyResponse.json();
      console.log(`✅ Base de datos verificada: ${data.length} resoluciones encontradas`);
      
      if (data.length > 0) {
        console.log('📋 Resoluciones en la base de datos:');
        data.forEach(res => {
          console.log(`   - ${res.NumdeResolucion}: ${res.asunto}`);
        });
      }
    } else {
      console.log('⚠️ No se pudo verificar la base de datos');
    }

  } catch (error) {
    console.error('💥 Error crítico:', error);
    process.exit(1);
  }
}

// Verificar si Node.js está disponible
if (typeof fetch === 'undefined') {
  console.log('📦 Instalando node-fetch para compatibilidad...');
  const { default: fetch } = await import('node-fetch');
  global.fetch = fetch;
}

// Ejecutar el script
populateDatabase();
