/**
 * Utilidades para manejo de URLs de imágenes
 */

/**
 * Detecta si el dispositivo es móvil
 * @returns {boolean} true si es móvil
 */
const isMobileDevice = () => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
         window.innerWidth <= 768;
};

/**
 * Detecta si estamos en desarrollo o producción
 * @returns {boolean} true si es desarrollo
 */
const isDevelopmentEnvironment = () => {
  return window.location.hostname === 'localhost' || 
         window.location.hostname === '127.0.0.1' ||
         window.location.hostname.includes('localhost') ||
         window.location.protocol === 'file:';
};

/**
 * Genera la URL completa para una imagen dada su ruta relativa
 * @param {string} imagePath - Ruta de la imagen (ej: "uploads/1746055049685-diagrama_ep.png")
 * @returns {string} URL completa de la imagen
 */
export const getImageUrl = (imagePath) => {
  if (!imagePath) {
    console.warn('ImageUtils: imagePath vacía o no definida');
    return getPlaceholderImageUrl();
  }
  
  // Si ya es una URL completa, devolverla tal como está
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }
  
  // Obtener la URL base del backend desde variables de entorno
  let baseUrl = import.meta.env.VITE_API_BASE_URL;
  
  // Fallbacks mejorados para diferentes entornos y dispositivos
  if (!baseUrl) {
    if (isDevelopmentEnvironment()) {
      baseUrl = 'http://localhost:10000';
    } else {
      // URL de producción con protocolo seguro para móviles
      baseUrl = 'https://libro-resoluciones-backend.onrender.com';
    }
  }
  
  // Asegurar protocolo HTTPS en producción para móviles
  if (!isDevelopmentEnvironment() && baseUrl.startsWith('http://')) {
    baseUrl = baseUrl.replace('http://', 'https://');
    console.log('ImageUtils: Forzando HTTPS para móvil:', baseUrl);
  }
  
  // Si la ruta ya incluye 'uploads/', usar directamente
  // Si no, agregar 'uploads/' al inicio
  const fullPath = imagePath.startsWith('uploads/') ? imagePath : `uploads/${imagePath}`;
  
  const finalUrl = `${baseUrl}/${fullPath}`;
  
  // Log diferenciado para móviles
  if (isMobileDevice()) {
    console.log('📱 ImageUtils (Móvil): URL generada:', finalUrl);
  } else {
    console.log('💻 ImageUtils (Desktop): URL generada:', finalUrl);
  }
  
  return finalUrl;
};

/**
 * Descarga una imagen desde su URL con optimizaciones para móviles
 * @param {string} imageUrl - URL de la imagen
 * @param {string} fileName - Nombre del archivo para la descarga
 * @returns {Promise<void>}
 */
export const downloadImage = async (imageUrl, fileName = 'imagen') => {
  try {
    // Headers mejorados para móviles
    const headers = {
      'Accept': 'image/*',
      'Cache-Control': 'no-cache'
    };
    
    // Para móviles, añadir headers adicionales
    if (isMobileDevice()) {
      headers['User-Agent'] = navigator.userAgent;
      headers['X-Requested-With'] = 'XMLHttpRequest';
    }
    
    const response = await fetch(imageUrl, {
      method: 'GET',
      mode: 'cors',
      credentials: 'same-origin',
      headers
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    
    // En móviles, intentar usar el API nativo si está disponible
    if (isMobileDevice() && navigator.share) {
      try {
        const file = new File([blob], `${fileName}.${blob.type.split('/')[1]}`, { type: blob.type });
        await navigator.share({
          files: [file],
          title: `Descargar ${fileName}`
        });
        window.URL.revokeObjectURL(url);
        return;
      } catch (shareError) {
        console.log('📱 No se pudo compartir, usando descarga tradicional');
      }
    }
    
    // Descarga tradicional
    const a = document.createElement('a');
    a.href = url;
    a.download = `${fileName}.${blob.type.split('/')[1]}`;
    
    // Para móviles, asegurar que el elemento sea visible
    if (isMobileDevice()) {
      a.style.position = 'fixed';
      a.style.left = '-9999px';
    }
    
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
    
    console.log(isMobileDevice() ? '📱 Imagen descargada (móvil)' : '💻 Imagen descargada (desktop)');
  } catch (error) {
    console.error('❌ Error al descargar la imagen:', error);
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
  console.error(`❌ Error al cargar la imagen: ${event.target.src}`);
  
  // Log específico para móviles
  if (isMobileDevice()) {
    console.error('📱 Error de imagen en dispositivo móvil');
  }
  
  event.target.onerror = null; // Prevenir bucle infinito
  event.target.src = getPlaceholderImageUrl();
  event.target.alt = "Imagen no disponible";
  
  // Añadir clase CSS para identificar imágenes con error
  event.target.classList.add('image-error');
};

/**
 * Preloads an image to check if it's accessible before displaying
 * @param {string} imagePath - Path to the image
 * @returns {Promise<string>} Promise that resolves with the image URL or placeholder
 */
export const preloadImage = (imagePath) => {
  return new Promise((resolve) => {
    if (!imagePath) {
      resolve(getPlaceholderImageUrl());
      return;
    }
    
    const img = new Image();
    const imageUrl = getImageUrl(imagePath);
    
    img.onload = () => {
      console.log(isMobileDevice() ? '📱 Imagen precargada exitosamente' : '💻 Imagen precargada exitosamente');
      resolve(imageUrl);
    };
    
    img.onerror = () => {
      console.error('❌ Error al precargar imagen:', imageUrl);
      resolve(getPlaceholderImageUrl());
    };
    
    // Timeout para móviles (conexión lenta)
    const timeout = isMobileDevice() ? 10000 : 5000;
    setTimeout(() => {
      console.warn('⏰ Timeout al precargar imagen:', imageUrl);
      resolve(getPlaceholderImageUrl());
    }, timeout);
    
    img.src = imageUrl;
  });
};

/**
 * Optimiza la calidad de imagen basada en el dispositivo
 * @param {string} imagePath - Ruta de la imagen
 * @param {string} quality - Calidad deseada ('low', 'medium', 'high')
 * @returns {string} URL optimizada
 */
export const getOptimizedImageUrl = (imagePath, quality = 'medium') => {
  const baseUrl = getImageUrl(imagePath);
  
  // En móviles, usar calidad más baja por defecto para mejor rendimiento
  if (isMobileDevice() && quality === 'medium') {
    quality = 'low';
  }
  
  // Aquí podrías agregar parámetros de query para optimización de imágenes
  // Por ejemplo: ?quality=low&format=webp
  return baseUrl;
};
