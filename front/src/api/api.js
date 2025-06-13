import axios from 'axios';

const apiUrl = import.meta.env.VITE_API_URL;
const maxUploadSize = import.meta.env.VITE_UPLOAD_MAX_SIZE;

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:10000',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Log de debugging para desarrollo - siempre activo en desarrollo
console.log('🔧 API configurada con baseURL:', import.meta.env.VITE_API_BASE_URL || 'http://localhost:10000');
console.log('🔧 Entorno:', import.meta.env.MODE);

api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
    // Log de debugging para desarrollo - siempre activo
  console.log('📤 Request:', config.method?.toUpperCase(), config.url, 'Full URL:', config.baseURL + config.url);
  
  return config;
}, error => {
  console.error('❌ Request error:', error);
  return Promise.reject(error);
});

// Interceptor de respuesta para manejo de errores
api.interceptors.response.use(  response => {
    // Log de debugging para desarrollo - siempre activo
    console.log('📥 Response:', response.status, response.config.url);
    return response;
  },
  async error => {
    console.error('❌ Response error:', error.response?.status, error.message);
    
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

export default api;
