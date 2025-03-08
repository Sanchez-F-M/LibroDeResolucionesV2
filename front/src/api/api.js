// api.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000', // Ajusta el puerto si es necesario
});

// Interceptor para agregar el token a cada petición si existe
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
}, error => {
  return Promise.reject(error);
});

export default api;
