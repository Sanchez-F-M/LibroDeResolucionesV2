import { v2 as cloudinary } from 'cloudinary'
import { CloudinaryStorage } from 'multer-storage-cloudinary'
import multer from 'multer'

// Configuración de Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
})

// Configuración del storage de Cloudinary para multer
const cloudinaryStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'libro-resoluciones', // Carpeta en Cloudinary donde se guardarán las imágenes
    allowed_formats: ['jpg', 'jpeg', 'png', 'pdf'], // Formatos permitidos
    transformation: [
      { width: 1200, height: 1600, crop: 'limit' }, // Limitar tamaño para optimizar
      { quality: 'auto', fetch_format: 'auto' } // Optimización automática
    ],
    public_id: (req, file) => {
      // Generar un ID único para cada archivo
      const timestamp = Date.now()
      const originalName = file.originalname.split('.')[0]
      return `${timestamp}-${originalName}`
    }
  }
})

// Configuración de multer con Cloudinary
export const uploadToCloudinary = multer({
  storage: cloudinaryStorage,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 10 * 1024 * 1024 // 10MB por defecto
  },
  fileFilter: (req, file, cb) => {
    // Verificar tipos de archivo permitidos
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf']
    
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true)
    } else {
      cb(new Error('Tipo de archivo no permitido. Solo se permiten JPG, PNG y PDF'), false)
    }
  }
})

// Configuración de multer local (fallback para desarrollo)
const localStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/')
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname)
  }
})

export const uploadToLocal = multer({ 
  storage: localStorage,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 10 * 1024 * 1024
  }
})

// Función para determinar qué storage usar
export const getUploadConfig = () => {
  const useCloudinary = process.env.NODE_ENV === 'production' || 
                       (process.env.CLOUDINARY_CLOUD_NAME && 
                        process.env.CLOUDINARY_API_KEY && 
                        process.env.CLOUDINARY_API_SECRET)
  
  console.log(`📁 Usando ${useCloudinary ? 'Cloudinary' : 'almacenamiento local'} para uploads`)
  
  return useCloudinary ? uploadToCloudinary : uploadToLocal
}

// Función para obtener la URL de la imagen
export const getImageUrl = (imagePath) => {
  // Si es una URL de Cloudinary, devolverla tal como está
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath
  }
  
  // Si es un path local, construir la URL local
  // Normalizar el path para usar siempre forward slashes
  const normalizedPath = imagePath.replace(/\\/g, '/')
  return `${process.env.BASE_URL}/${normalizedPath}`
}

export default cloudinary
