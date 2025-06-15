import express from 'express'
import { v2 as cloudinary } from 'cloudinary'

const cloudinaryRouter = express.Router()

// Endpoint para verificar el estado de Cloudinary
cloudinaryRouter.get('/status', async (req, res) => {
  try {
    console.log('🔍 Verificando conexión a Cloudinary...')
    
    // Verificar variables de entorno
    const hasCredentials = !!(
      process.env.CLOUDINARY_CLOUD_NAME &&
      process.env.CLOUDINARY_API_KEY &&
      process.env.CLOUDINARY_API_SECRET
    )

    const envDetails = {
      cloud_name: !!process.env.CLOUDINARY_CLOUD_NAME,
      api_key: !!process.env.CLOUDINARY_API_KEY,
      api_secret: !!process.env.CLOUDINARY_API_SECRET,
      environment: process.env.NODE_ENV
    }

    if (!hasCredentials) {
      return res.json({
        connected: false,
        storage_mode: 'local',
        error: 'Credenciales de Cloudinary no configuradas',
        details: envDetails,
        message: 'La aplicación usará almacenamiento local como fallback'
      })
    }

    // Probar conexión real a Cloudinary
    try {
      const result = await cloudinary.api.ping()
      
      res.json({
        connected: true,
        storage_mode: 'cloudinary',
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        status: result.status || 'ok',
        details: envDetails,
        folder: 'libro-resoluciones',
        message: 'Cloudinary conectado correctamente',
        timestamp: new Date().toISOString()
      })

    } catch (cloudinaryError) {
      console.error('❌ Error en ping a Cloudinary:', cloudinaryError.message)
      
      res.json({
        connected: false,
        storage_mode: 'local',
        error: `Error de conexión: ${cloudinaryError.message}`,
        details: envDetails,
        message: 'Credenciales configuradas pero conexión falló'
      })
    }

  } catch (error) {
    console.error('❌ Error verificando Cloudinary:', error.message)
    
    res.status(500).json({
      connected: false,
      storage_mode: 'unknown',
      error: error.message,
      message: 'Error interno verificando Cloudinary'
    })
  }
})

// Endpoint para probar upload a Cloudinary
cloudinaryRouter.post('/test-upload', async (req, res) => {
  try {
    // Verificar que Cloudinary esté configurado
    const hasCredentials = !!(
      process.env.CLOUDINARY_CLOUD_NAME &&
      process.env.CLOUDINARY_API_KEY &&
      process.env.CLOUDINARY_API_SECRET
    )

    if (!hasCredentials) {
      return res.json({
        success: false,
        error: 'Cloudinary no configurado',
        message: 'No se puede probar upload sin credenciales'
      })
    }

    // Crear imagen de prueba (pixel 1x1 transparente)
    const testImageBase64 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=='
    
    const result = await cloudinary.uploader.upload(testImageBase64, {
      folder: 'libro-resoluciones',
      public_id: `test-${Date.now()}`,
      tags: ['test', 'verificacion']
    })

    res.json({
      success: true,
      message: 'Upload de prueba exitoso',
      url: result.secure_url,
      public_id: result.public_id,
      size: result.bytes,
      format: result.format,
      cloudinary_working: true,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('❌ Error en test upload:', error.message)
    
    res.json({
      success: false,
      error: error.message,
      cloudinary_working: false,
      message: 'Error en upload de prueba'
    })
  }
})

// Endpoint para obtener información de la carpeta
cloudinaryRouter.get('/folder-info', async (req, res) => {
  try {
    const hasCredentials = !!(
      process.env.CLOUDINARY_CLOUD_NAME &&
      process.env.CLOUDINARY_API_KEY &&
      process.env.CLOUDINARY_API_SECRET
    )

    if (!hasCredentials) {
      return res.json({
        error: 'Cloudinary no configurado',
        folder_info: null
      })
    }

    // Obtener recursos de la carpeta libro-resoluciones
    const result = await cloudinary.api.resources({
      type: 'upload',
      prefix: 'libro-resoluciones/',
      max_results: 10
    })

    res.json({
      folder: 'libro-resoluciones',
      total_resources: result.total_count,
      resources_found: result.resources.length,
      resources: result.resources.map(resource => ({
        public_id: resource.public_id,
        url: resource.secure_url,
        size: resource.bytes,
        format: resource.format,
        created_at: resource.created_at
      })),
      cloudinary_working: true
    })

  } catch (error) {
    console.error('❌ Error obteniendo info de carpeta:', error.message)
    
    res.json({
      error: error.message,
      folder_info: null,
      cloudinary_working: false
    })
  }
})

export default cloudinaryRouter
