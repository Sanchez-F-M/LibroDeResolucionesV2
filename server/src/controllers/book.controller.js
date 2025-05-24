import db from '../../db/connection.js'

export const getByIdBook = async (req, res) => {
  const { id } = req.params

  try {
    const resolution = await db.get('SELECT NumdeResolucion, Asunto, Referencia, FechaCreacion as fetcha_creacion FROM resolution WHERE NumdeResolucion = ?', [id])

    if (!resolution) {
      return res.status(404).json({ error: 'Resolución no encontrada' })
    }

    const images = await db.all('SELECT * FROM images WHERE NumdeResolucion = ?', [id])

    const result = {
      NumdeResolucion: resolution.NumdeResolucion,
      asunto: resolution.Asunto,
      referencia: resolution.Referencia,
      fetcha_creacion: resolution.fetcha_creacion,
      images: images.map(image => image.ImagePath)
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

  try {
    // Iniciar transacción
    await db.exec('BEGIN TRANSACTION')

    // Actualizar resolución
    await db.run(
      'UPDATE resolution SET Asunto = ?, Referencia = ? WHERE NumdeResolucion = ?',
      [Asunto, Referencia, id]
    )

    // Eliminar imágenes existentes
    await db.run('DELETE FROM images WHERE NumdeResolucion = ?', [id])

    // Insertar nuevas imágenes
    for (const imagePath of ImagePaths) {
      await db.run(
        'INSERT INTO images (NumdeResolucion, ImagePath) VALUES (?, ?)',
        [id, imagePath]
      )
    }

    // Confirmar transacción
    await db.exec('COMMIT')

    res.status(200).json({
      message: 'Resolución y sus imágenes actualizadas exitosamente'
    })
  } catch (error) {
    // Revertir en caso de error
    await db.exec('ROLLBACK')
    console.error('❌ Error en updateBook:', error)
    res.status(500).json({ error: 'Error en la base de datos: ' + error.message })
  }
}

export const deleteBook = async (req, res) => {
  const { id } = req.params

  if (!id) {
    return res.status(400).json({ error: 'ID de resolución requerido' })
  }

  try {
    // Iniciar transacción
    await db.exec('BEGIN TRANSACTION')

    // Eliminar resolución (las imágenes se eliminan automáticamente por CASCADE)
    const result = await db.run('DELETE FROM resolution WHERE NumdeResolucion = ?', [id])

    if (result.changes === 0) {
      await db.exec('ROLLBACK')
      return res.status(404).json({ error: 'Resolución no encontrada' })
    }

    // Eliminar imágenes asociadas
    await db.run('DELETE FROM images WHERE NumdeResolucion = ?', [id])

    // Confirmar transacción
    await db.exec('COMMIT')

    res.status(200).json({
      message: 'Resolución y sus imágenes eliminadas exitosamente'
    })
  } catch (error) {
    await db.exec('ROLLBACK')
    console.error('❌ Error en deleteBook:', error)
    res.status(500).json({ error: 'Error al eliminar la resolución: ' + error.message })
  }
}

export const createBook = async (req, res) => {
  const { NumdeResolucion, Asunto, Referencia, FechaCreacion } = req.body
  const ImagePath = req.files

  if (!NumdeResolucion || !Asunto || !Referencia || !FechaCreacion || !ImagePath || ImagePath.length === 0) {
    return res.status(400).json({ error: 'Faltan datos o archivos' })
  }

  const fechaCreacion = new Date(FechaCreacion)

  try {
    // Iniciar transacción
    await db.exec('BEGIN TRANSACTION')

    // Insertar resolución
    await db.run(
      'INSERT INTO resolution (NumdeResolucion, Asunto, Referencia, FechaCreacion) VALUES (?, ?, ?, ?)',
      [NumdeResolucion, Asunto, Referencia, fechaCreacion.toISOString()]
    )

    // Insertar imágenes
    for (const file of ImagePath) {
      await db.run(
        'INSERT INTO images (NumdeResolucion, ImagePath) VALUES (?, ?)',
        [NumdeResolucion, `uploads/${file.filename}`]
      )
    }

    // Confirmar transacción
    await db.exec('COMMIT')

    res.status(201).json({ message: 'Resolución creada exitosamente' })
  } catch (error) {
    // Revertir en caso de error
    await db.exec('ROLLBACK')
    console.error('Error en createBook:', error)
    if (error.code === 'SQLITE_CONSTRAINT_UNIQUE') {
      return res.status(400).json({ error: 'El número de resolución ya existe' })
    }
    res.status(500).json({ error: 'Error al guardar la resolución: ' + error.message })
  }
}

export const getLastResolutionNumber = async (req, res) => {
  try {
    const result = await db.get('SELECT MAX(NumdeResolucion) as lastNumber FROM resolution')
    const lastNumber = result?.lastNumber || 0 // Si no hay resoluciones, devuelve 0
    res.status(200).json({ lastNumber: lastNumber + 1 }) // Devuelve el siguiente número
  } catch (error) {
    console.error('❌ Error en getLastResolutionNumber:', error)
    res.status(500).json({ error: 'Error al obtener el último número de resolución' })
  }
}

export const getAllBooks = async (req, res) => {
  try {
    const resolutions = await db.all(`
      SELECT 
        r.NumdeResolucion, 
        r.Asunto, 
        r.Referencia, 
        r.FechaCreacion as fetcha_creacion 
      FROM resolution r 
      ORDER BY r.NumdeResolucion DESC
    `)

    // Para cada resolución, obtener sus imágenes
    const resolutionsWithImages = await Promise.all(
      resolutions.map(async (resolution) => {
        const images = await db.all('SELECT ImagePath FROM images WHERE NumdeResolucion = ?', [resolution.NumdeResolucion])
        
        return {
          NumdeResolucion: resolution.NumdeResolucion,
          asunto: resolution.Asunto,
          referencia: resolution.Referencia,
          fetcha_creacion: resolution.fetcha_creacion,
          images: images.map(image => image.ImagePath)
        }
      })
    )

    res.status(200).json(resolutionsWithImages)
  } catch (error) {
    console.error('❌ Error en getAllBooks:', error)
    res.status(500).json({ error: 'Error interno del servidor: ' + error.message })
  }
}
