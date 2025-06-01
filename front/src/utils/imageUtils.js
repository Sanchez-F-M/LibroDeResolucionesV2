/**
 * Utilidades para manejo de URLs de imágenes
 */

/**
 * Genera la URL completa para una imagen dada su ruta relativa
 * @param {string} imagePath - Ruta de la imagen (ej: "uploads/1746055049685-diagrama_ep.png")
 * @returns {string} URL completa de la imagen
 */
export const getImageUrl = (imagePath) => {
  if (!imagePath) {
    return '';
  }
  
  // Si ya es una URL completa, devolverla tal como está
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }
  
  // Obtener la URL base del backend desde variables de entorno
  const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';
  
  // Si la ruta ya incluye 'uploads/', usar directamente
  // Si no, agregar 'uploads/' al inicio
  const fullPath = imagePath.startsWith('uploads/') ? imagePath : `uploads/${imagePath}`;
  
  return `${baseUrl}/${fullPath}`;
};

/**
 * Descarga una imagen desde su URL
 * @param {string} imageUrl - URL de la imagen
 * @param {string} fileName - Nombre del archivo para la descarga
 * @returns {Promise<void>}
 */
export const downloadImage = async (imageUrl, fileName = 'imagen') => {
  try {
    const response = await fetch(imageUrl, {
      method: 'GET',
      mode: 'cors',
      credentials: 'same-origin',
      headers: {
        'Accept': 'image/*'
      }
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${fileName}.${blob.type.split('/')[1]}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Error al descargar la imagen:', error);
    throw error;
  }
};

/**
 * Obtiene la URL de la imagen de placeholder
 * @returns {string} URL de la imagen de placeholder
 */
export const getPlaceholderImageUrl = () => {
  return '/placeholder-image.svg';
};

/**
 * Genera la URL completa para una imagen con fallback a placeholder
 * @param {string} imagePath - Ruta de la imagen
 * @returns {string} URL completa de la imagen o placeholder
 */
export const getImageUrlWithFallback = (imagePath) => {
  if (!imagePath) {
    return getPlaceholderImageUrl();
  }
  
  return getImageUrl(imagePath);
};

/**
 * Maneja errores de carga de imágenes estableciendo un placeholder
 * @param {Event} event - Evento de error de la imagen
 */
export const handleImageError = (event) => {
  console.error(`Error al cargar la imagen: ${event.target.src}`);
  event.target.onerror = null; // Prevenir bucle infinito
  event.target.src = getPlaceholderImageUrl();
  event.target.alt = "Imagen no disponible";
};
