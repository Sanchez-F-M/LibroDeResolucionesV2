import db from '../../db/connection.js'

export const getByIdBook = async (req, res) => {
  const { id } = req.params

  try {
    const resolutionResult = await db.query('SELECT "NumdeResolucion", "Asunto", "Referencia", "FechaCreacion" as fetcha_creacion FROM resolution WHERE "NumdeResolucion" = $1', [id])

    if (resolutionResult.rows.length === 0) {
      return res.status(404).json({ error: 'Resolución no encontrada' })
    }

    const resolution = resolutionResult.rows[0]
    const imagesResult = await db.query('SELECT * FROM images WHERE "NumdeResolucion" = $1', [id])

    const result = {
      NumdeResolucion: resolution.NumdeResolucion,
      asunto: resolution.Asunto,
      referencia: resolution.Referencia,
      fetcha_creacion: resolution.fetcha_creacion,
      images: imagesResult.rows.map(image => image.ImagePath)
    }

    res.status(200).json([result]) // Mantener formato array para compatibilidad
  } catch (error) {
    console.error('❌ Error en getByIdBook:', error)
    res.status(500).json({ error: 'Error interno del servidor' })
  }
}

export const updateBook = async (req, res) => {
  const { id } = req.params
  const { Asunto, Referencia, ImagePaths } = req.body

  if (!id) {
    return res.status(400).json({ error: ' ID de resolución requerido' })
  }
  if (!Asunto || !Referencia || !Array.isArray(ImagePaths)) {
    return res.status(400).json({ error: 'Datos incompletos o inválidos' })
  }

  const client = await db.connect()
  
  try {
    // Iniciar transacción
    await client.query('BEGIN')

    // Actualizar resolución
    await client.query(
      'UPDATE resolution SET "Asunto" = $1, "Referencia" = $2 WHERE "NumdeResolucion" = $3',
      [Asunto, Referencia, id]
    )    // Eliminar imágenes existentes
    await client.query('DELETE FROM images WHERE "NumdeResolucion" = $1', [id])

    // Insertar nuevas imágenes
    for (const imagePath of ImagePaths) {
      await client.query(
        'INSERT INTO images ("NumdeResolucion", "ImagePath") VALUES ($1, $2)',
        [id, imagePath]
      )
    }

    // Confirmar transacción
    await client.query('COMMIT')

    res.status(200).json({
      message: 'Resolución y sus imágenes actualizadas exitosamente'
    })
  } catch (error) {
    // Revertir en caso de error
    await client.query('ROLLBACK')
    console.error('❌ Error en updateBook:', error)
    res.status(500).json({ error: 'Error en la base de datos: ' + error.message })
  } finally {
    client.release()
  }
}

export const deleteBook = async (req, res) => {
  const { id } = req.params

  if (!id) {
    return res.status(400).json({ error: 'ID de resolución requerido' })
  }

  const client = await db.connect()

  try {
    // Iniciar transacción
    await client.query('BEGIN')

    // Eliminar resolución (las imágenes se eliminan automáticamente por CASCADE)
    const result = await client.query('DELETE FROM resolution WHERE "NumdeResolucion" = $1', [id])

    if (result.rowCount === 0) {
      await client.query('ROLLBACK')
      return res.status(404).json({ error: 'Resolución no encontrada' })
    }

    // Eliminar imágenes asociadas
    await client.query('DELETE FROM images WHERE "NumdeResolucion" = $1', [id])

    // Confirmar transacción
    await client.query('COMMIT')

    res.status(200).json({
      message: 'Resolución y sus imágenes eliminadas exitosamente'
    })
  } catch (error) {
    await client.query('ROLLBACK')
    console.error('❌ Error en deleteBook:', error)
    res.status(500).json({ error: 'Error al eliminar la resolución: ' + error.message })
  } finally {
    client.release()
  }
}

export const createBook = async (req, res) => {
  const { NumdeResolucion, Asunto, Referencia, FechaCreacion } = req.body
  const ImagePath = req.files

  if (!NumdeResolucion || !Asunto || !Referencia || !FechaCreacion || !ImagePath || ImagePath.length === 0) {
    return res.status(400).json({ error: 'Faltan datos o archivos' })
  }

  const fechaCreacion = new Date(FechaCreacion)

  const client = await db.connect()

  try {
    // Iniciar transacción
    await client.query('BEGIN')

    // Insertar resolución
    await client.query(
      'INSERT INTO resolution ("NumdeResolucion", "Asunto", "Referencia", "FechaCreacion") VALUES ($1, $2, $3, $4)',
      [NumdeResolucion, Asunto, Referencia, fechaCreacion.toISOString()]
    )

    // Insertar imágenes
    for (const file of ImagePath) {
      await client.query(
        'INSERT INTO images ("NumdeResolucion", "ImagePath") VALUES ($1, $2)',
        [NumdeResolucion, `uploads/${file.filename}`]
      )
    }

    // Confirmar transacción
    await client.query('COMMIT')

    res.status(201).json({ message: 'Resolución creada exitosamente' })
  } catch (error) {
    // Revertir en caso de error
    await client.query('ROLLBACK')
    console.error('Error en createBook:', error)
    if (error.code === '23505') { // PostgreSQL unique constraint violation
      return res.status(400).json({ error: 'El número de resolución ya existe' })
    }
    res.status(500).json({ error: 'Error al guardar la resolución: ' + error.message })
  } finally {
    client.release()
  }
}

export const getLastResolutionNumber = async (req, res) => {
  try {
    // Obtener todos los números de resolución
    const results = await db.query('SELECT "NumdeResolucion" FROM resolution')
    
    let maxNumber = 0
    
    // Extraer números de diferentes formatos
    results.rows.forEach(row => {
      const resolutionNumber = row.NumdeResolucion
      let numberPart = 0
      
      if (typeof resolutionNumber === 'string') {
        // Caso 1: Formato "RES-XXX-YYYY" -> extraer XXX
        const resMatch = resolutionNumber.match(/^RES-(\d+)-/)
        if (resMatch) {
          numberPart = parseInt(resMatch[1], 10)
        }
        // Caso 2: Formato "YYYYNNN" (ej: 2025001) -> extraer NNN
        else if (/^\d{7}$/.test(resolutionNumber)) {
          numberPart = parseInt(resolutionNumber.slice(-3), 10)
        }
        // Caso 3: String numérico simple
        else if (/^\d+$/.test(resolutionNumber)) {
          numberPart = parseInt(resolutionNumber, 10)
        }
      } else if (typeof resolutionNumber === 'number') {
        // Caso 4: Número directo
        numberPart = resolutionNumber
      }
      
      if (numberPart > maxNumber) {
        maxNumber = numberPart
      }
    })
    
    const nextNumber = maxNumber + 1
    console.log(`📊 Último número encontrado: ${maxNumber}, próximo número: ${nextNumber}`)
    
    res.status(200).json({ lastNumber: nextNumber })
  } catch (error) {
    console.error('❌ Error en getLastResolutionNumber:', error)
    res.status(500).json({ error: 'Error al obtener el último número de resolución' })
  }
}

export const getAllBooks = async (req, res) => {
  try {
    const resolutions = await db.query(`
      SELECT 
        r."NumdeResolucion", 
        r."Asunto", 
        r."Referencia", 
        r."FechaCreacion" as fetcha_creacion 
      FROM resolution r 
      ORDER BY r."FechaCreacion" DESC, r."NumdeResolucion" DESC
    `)

    // Para cada resolución, obtener sus imágenes
    const resolutionsWithImages = await Promise.all(
      resolutions.rows.map(async (resolution) => {
        const images = await db.query('SELECT "ImagePath" FROM images WHERE "NumdeResolucion" = $1', [resolution.NumdeResolucion])
        
        return {
          NumdeResolucion: resolution.NumdeResolucion,
          asunto: resolution.Asunto,
          referencia: resolution.Referencia,
          fetcha_creacion: resolution.fetcha_creacion,
          images: images.rows.map(image => image.ImagePath)
        }
      })
    )

    res.status(200).json(resolutionsWithImages)
  } catch (error) {
    console.error('❌ Error en getAllBooks:', error)
    res.status(500).json({ error: 'Error interno del servidor: ' + error.message })
  }
}

// Función especial para insertar resoluciones de prueba (sin archivos reales)
export const insertTestResolution = async (req, res) => {
  const { NumdeResolucion, Asunto, Referencia, FechaCreacion, ImagePaths } = req.body

  if (!NumdeResolucion || !Asunto || !Referencia || !FechaCreacion) {
    return res.status(400).json({ error: 'Faltan datos requeridos' })
  }

  const fechaCreacion = new Date(FechaCreacion)

  const client = await db.connect()

  try {
    // Iniciar transacción
    await client.query('BEGIN')

    // Verificar si la resolución ya existe
    const existing = await client.query('SELECT "NumdeResolucion" FROM resolution WHERE "NumdeResolucion" = $1', [NumdeResolucion])
    if (existing.rows.length > 0) {
      await client.query('ROLLBACK')
      return res.status(400).json({ error: 'El número de resolución ya existe' })
    }

    // Insertar resolución
    await client.query(
      'INSERT INTO resolution ("NumdeResolucion", "Asunto", "Referencia", "FechaCreacion") VALUES ($1, $2, $3, $4)',
      [NumdeResolucion, Asunto, Referencia, fechaCreacion.toISOString()]
    )

    // Insertar imágenes mock si se proporcionan
    if (ImagePaths && Array.isArray(ImagePaths)) {
      for (const imagePath of ImagePaths) {
        await client.query(
          'INSERT INTO images ("NumdeResolucion", "ImagePath") VALUES ($1, $2)',
          [NumdeResolucion, imagePath]
        )
      }
    }

    // Confirmar transacción
    await client.query('COMMIT')

    res.status(201).json({ 
      message: 'Resolución mock creada exitosamente',
      NumdeResolucion
    })
  } catch (error) {
    await client.query('ROLLBACK')
    console.error('Error al crear resolución mock:', error)
    res.status(500).json({ error: 'Error interno del servidor' })
  } finally {
    client.release()
  }
}

export { 
  getAllBooks as getResolutions, 
  getByIdBook as getResolutionById, 
  createBook as createResolution, 
  updateBook as updateResolution, 
  deleteBook as deleteResolution,
  insertTestResolution as createMockResolution 
}
