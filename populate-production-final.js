// Script final para poblar la base de datos de producción
// Usa la API estándar de creación de resoluciones

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
        Nombre: 'admin',
        Contrasena: 'admin123'
      })
    });

    if (!response.ok) {
      throw new Error(`Error en login: ${response.status}`);
    }

    const data = await response.json();
    console.log('✅ Login exitoso');
    return data.token;
  } catch (error) {
    console.error('❌ Error obteniendo token:', error);
    throw error;
  }
}

// Función para crear resolución usando FormData (simulando el form del frontend)
async function createResolution(token, resolutionData) {
  try {
    const formData = new FormData();
    formData.append('NumdeResolucion', resolutionData.NumdeResolucion);
    formData.append('Asunto', resolutionData.Asunto);
    formData.append('Referencia', resolutionData.Referencia);
    formData.append('FechaCreacion', resolutionData.FechaCreacion);

    const response = await fetch(`${API_BASE_URL}/api/books`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error(`❌ Error ${response.status}: ${errorData}`);
      return null;
    }

    const result = await response.json();
    console.log(`✅ Resolución ${resolutionData.NumdeResolucion} creada exitosamente`);
    return result;
  } catch (error) {
    console.error(`❌ Error creando resolución ${resolutionData.NumdeResolucion}:`, error.message);
    return null;
  }
}

// Datos de prueba realistas para la policía
const testResolutions = [
  {
    NumdeResolucion: '001-2025',
    Asunto: 'Aprobación del Presupuesto Anual 2025',
    Referencia: 'Expediente N° 12345/2025 - Secretaría de Hacienda',
    FechaCreacion: '2025-01-15'
  },
  {
    NumdeResolucion: '002-2025',
    Asunto: 'Designación de Personal en Comisaría Primera',
    Referencia: 'Nota N° 456/2025 - División de Recursos Humanos',
    FechaCreacion: '2025-01-20'
  },
  {
    NumdeResolucion: '003-2025',
    Asunto: 'Protocolo de Seguridad Ciudadana',
    Referencia: 'Informe N° 789/2025 - Comisaría Central',
    FechaCreacion: '2025-02-01'
  },
  {
    NumdeResolucion: '004-2025',
    Asunto: 'Adquisición de Equipamiento Policial',
    Referencia: 'Licitación N° 101/2025 - Departamento de Compras',
    FechaCreacion: '2025-02-10'
  },
  {
    NumdeResolucion: '005-2025',
    Asunto: 'Modificación de Turnos de Servicio',
    Referencia: 'Memorando N° 234/2025 - Jefatura Operativa',
    FechaCreacion: '2025-02-15'
  },
  {
    NumdeResolucion: '006-2025',
    Asunto: 'Procedimiento de Control Vehicular',
    Referencia: 'Circular N° 567/2025 - Tránsito Municipal',
    FechaCreacion: '2025-02-20'
  },
  {
    NumdeResolucion: '007-2025',
    Asunto: 'Capacitación en Derechos Humanos',
    Referencia: 'Programa N° 890/2025 - Instituto de Formación',
    FechaCreacion: '2025-02-25'
  },
  {
    NumdeResolucion: '008-2025',
    Asunto: 'Asignación de Móviles Policiales',
    Referencia: 'Listado N° 123/2025 - Parque Automotor',
    FechaCreacion: '2025-03-01'
  }
];

// Función principal
async function populateDatabase() {
  console.log('🚀 Iniciando población de base de datos en producción...');
  console.log('🌐 Backend URL:', API_BASE_URL);

  try {
    // Obtener token de autenticación
    console.log('🔐 Obteniendo token de autenticación...');
    const token = await getAuthToken();

    let successCount = 0;
    let errorCount = 0;

    console.log(`📝 Creando ${testResolutions.length} resoluciones de prueba...`);

    // Insertar resoluciones una por una
    for (const resolution of testResolutions) {
      console.log(`\n📄 Procesando: ${resolution.NumdeResolucion} - ${resolution.Asunto}`);
      
      const result = await createResolution(token, resolution);
      
      if (result) {
        successCount++;
      } else {
        errorCount++;
      }

      // Pausa pequeña entre requests para no sobrecargar el servidor
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    console.log('\n🎉 ========================================');
    console.log('🎉 POBLACIÓN DE DATOS COMPLETADA');
    console.log(`🎉 ✅ Exitosas: ${successCount}`);
    console.log(`🎉 ❌ Errores: ${errorCount}`);
    console.log('🎉 ========================================');

    // Verificar que las resoluciones se crearon correctamente
    console.log('\n🔍 Verificando datos creados...');
    const response = await fetch(`${API_BASE_URL}/api/books/all`);
    
    if (response.ok) {
      const allBooks = await response.json();
      if (Array.isArray(allBooks)) {
        console.log(`✅ Total de resoluciones en la base de datos: ${allBooks.length}`);
        allBooks.forEach((book, index) => {
          console.log(`   ${index + 1}. ${book.NumdeResolucion} - ${book.Asunto}`);
        });
      } else {
        console.log('⚠️  Formato de respuesta inesperado:', allBooks);
      }
    } else {
      console.log('❌ Error verificando datos:', response.status);
    }

  } catch (error) {
    console.error('❌ Error general:', error);
    process.exit(1);
  }
}

// Ejecutar si se llama directamente
if (typeof window === 'undefined') {
  // Estamos en Node.js
  import('node-fetch').then(({ default: fetch }) => {
    globalThis.fetch = fetch;
    globalThis.FormData = class FormData {
      constructor() {
        this.data = new Map();
      }
      append(key, value) {
        this.data.set(key, value);
      }
      toString() {
        const params = new URLSearchParams();
        this.data.forEach((value, key) => {
          params.append(key, value);
        });
        return params.toString();
      }
    };
    
    populateDatabase();
  }).catch(error => {
    console.error('❌ Error importando fetch:', error);
  });
} else {
  // Estamos en el browser
  populateDatabase();
}
