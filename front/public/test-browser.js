// Test de las funciones utilitarias desde la consola del navegador
// Copiar y pegar este código en la consola del navegador para probar

console.log('🧪 Iniciando pruebas de funciones utilitarias...');

// Simular importación de funciones (en un contexto real serían importadas)
const getImageUrl = (imagePath) => {
  if (!imagePath) {
    return '';
  }
  
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }
  
  const baseUrl = 'http://localhost:10000'; // Hardcodeado para test
  const fullPath = imagePath.startsWith('uploads/') ? imagePath : `uploads/${imagePath}`;
  
  return `${baseUrl}/${fullPath}`;
};

const handleImageError = (event) => {
  console.error(`Error al cargar la imagen: ${event.target.src}`);
  event.target.onerror = null;
  event.target.src = '/placeholder-image.svg';
  event.target.alt = "Imagen no disponible";
};

// Tests
console.log('Test 1 - URL relativa:', getImageUrl('uploads/1746055049685-diagrama_ep.png'));
console.log('Test 2 - URL absoluta:', getImageUrl('https://example.com/image.png'));
console.log('Test 3 - Ruta sin uploads:', getImageUrl('1746055049685-diagrama_ep.png'));
console.log('Test 4 - Ruta vacía:', getImageUrl(''));

// Test de carga de imagen
const testImage = new Image();
testImage.onload = () => console.log('✅ Imagen cargada exitosamente');
testImage.onerror = (e) => {
  console.log('❌ Error al cargar imagen, probando función de error...');
  handleImageError(e);
};
testImage.src = getImageUrl('1746055049685-diagrama_ep.png');

console.log('🧪 Tests completados. Revisa los resultados arriba.');
