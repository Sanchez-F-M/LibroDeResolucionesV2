// Test script para verificar las funciones utilitarias de imágenes
import { getImageUrl, downloadImage } from './imageUtils.js';

// Test 1: Verificar getImageUrl con ruta relativa
console.log('Test 1 - URL relativa:');
console.log(getImageUrl('uploads/test-image.png'));

// Test 2: Verificar getImageUrl con URL absoluta
console.log('Test 2 - URL absoluta:');
console.log(getImageUrl('https://example.com/image.png'));

// Test 3: Verificar getImageUrl con ruta que no comienza con uploads/
console.log('Test 3 - Ruta sin uploads/:');
console.log(getImageUrl('1746055049685-diagrama_ep.png'));

console.log('Variables de entorno disponibles:');
console.log('VITE_API_BASE_URL:', import.meta.env.VITE_API_BASE_URL);
