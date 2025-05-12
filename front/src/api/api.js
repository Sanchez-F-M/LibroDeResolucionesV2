import axios from 'axios';

const apiUrl = import.meta.env.VITE_API_URL;
const maxUploadSize = import.meta.env.VITE_UPLOAD_MAX_SIZE;

const api = axios.create({
  baseURL: 'http://localhost:3000', 
});

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
