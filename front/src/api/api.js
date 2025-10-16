import axios from 'axios';

// Configuración de la URL base con fallback
// Prioridad: VITE_API_URL (para red local) > VITE_API_BASE_URL > localhost
const BASE_URL =
  import.meta.env.VITE_API_URL ||
  import.meta.env.VITE_API_BASE_URL ||
  `${window.location.protocol}//${window.location.hostname}:3000`;

console.log('🔧 API configurada con baseURL:', BASE_URL);
console.log('🔧 Entorno:', import.meta.env.MODE || 'development');
console.log('🔧 Hostname:', window.location.hostname);

// Crear instancia de axios con configuración mejorada
const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: false,
});

// Interceptor de peticiones
api.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }

    const fullUrl = config.url?.startsWith('http')
      ? config.url
      : `${config.baseURL}${config.url}`;

    console.log('📤 Request:', config.method?.toUpperCase(), config.url);
    console.log('📍 Full URL:', fullUrl);

    return config;
  },
  error => {
    console.error('❌ Request error:', error);
    return Promise.reject(error);
  }
);

// Interceptor de respuestas mejorado
api.interceptors.response.use(
  response => {
    console.log('✅ Response success:', response.status, response.config.url);
    return response;
  },
  error => {
    // Crear objeto de error normalizado
    const normalizedError = {
      message: 'Error desconocido',
      isNetworkError: false,
      isServerError: false,
      status: null,
      data: null,
      original: error,
    };

    if (error.response) {
      // El servidor respondió con un código de error
      normalizedError.isServerError = true;
      normalizedError.status = error.response.status;
      normalizedError.data = error.response.data;
      normalizedError.message =
        error.response.data?.error ||
        error.response.data?.message ||
        'Error del servidor';

      console.error('❌ Server error:', {
        status: error.response.status,
        data: error.response.data,
      });

      // Manejo especial de 401
      if (error.response.status === 401) {
        localStorage.removeItem('token');
        if (
          window.location.pathname !== '/login' &&
          window.location.pathname !== '/'
        ) {
          window.location.href = '/login';
        }
      }
    } else if (error.request) {
      // La petición se hizo pero no hubo respuesta
      normalizedError.isNetworkError = true;
      normalizedError.message =
        'No se pudo conectar con el servidor. Verifique que el backend esté ejecutándose en ' +
        BASE_URL;

      console.error('❌ Network error:', {
        message: 'No response received',
        baseURL: BASE_URL,
      });
    } else {
      // Error al configurar la petición
      normalizedError.message =
        error.message || 'Error al configurar la petición';
      console.error('❌ Config error:', error.message);
    }

    // Agregar propiedades al error original
    error.isNetworkError = normalizedError.isNetworkError;
    error.isServerError = normalizedError.isServerError;
    error.normalizedMessage = normalizedError.message;

    return Promise.reject(error);
  }
);

// Función para verificar salud del servidor
export async function checkHealth() {
  try {
    const response = await api.get('/health');
    console.log('✅ Server health check passed:', response.data);
    return { success: true, data: response.data };
  } catch (error) {
    console.error('❌ Server health check failed:', error);
    return {
      success: false,
      error: error.normalizedMessage || 'Health check failed',
      isNetworkError: error.isNetworkError,
    };
  }
}

// Función para verificar conexión básica
export async function testConnection() {
  try {
    console.log('🔍 Testing connection to:', BASE_URL);
    const response = await fetch(BASE_URL + '/health', {
      method: 'GET',
      mode: 'cors',
    });

    if (response.ok) {
      const data = await response.json();
      console.log('✅ Connection test passed:', data);
      return { success: true, data };
    } else {
      console.error('❌ Connection test failed with status:', response.status);
      return {
        success: false,
        error: 'Server returned error status: ' + response.status,
      };
    }
  } catch (error) {
    console.error('❌ Connection test failed:', error);
    return {
      success: false,
      error: 'Cannot connect to server at ' + BASE_URL,
      details: error.message,
    };
  }
}

export default api;
