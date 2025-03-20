import db from '../../db/connection.js'

export const getByIdBook = async (req, res) => {
  const { id } = req.params

  try {
    const [resolutions] = await db.query('SELECT * FROM resolution WHERE NumdeResolucion = ?', [id])

    if (resolutions.length === 0) {
      return res.status(404).json({ error: 'Resolución no encontrada' })
    }

    const [images] = await db.query('SELECT * FROM images WHERE NumdeResolucion = ?', [id])

    const result = resolutions.map(resolution => ({
      numderesoluciones: resolution.NumdeResolucion,
      asunto: resolution.Asunto,
      referencia: resolution.Referencia,
      images: images
        .filter(image => image.NumdeResolucion === resolution.NumdeResolucion)
        .map(image => image.ImagePath)
    }))

    res.status(200).json(result)
  } catch (error) {
    console.error('❌ Error en getByIdBook:', error)
    res.status(500).json({ error: 'Error interno del servidor' })
  }
}

export const updateBook = async (req, res) => {
  const { id } = req.params
  const { Asunto, Referencia, ImagePaths } = req.body

  if (!id) {
    return res.status(400).json({ error: 'ID de resolución requerido' })
  }
  if (!Asunto || !Referencia || !Array.isArray(ImagePaths)) {
    return res.status(400).json({ error: 'Datos incompletos o inválidos' })
  }

  let connection

  try {
    connection = await db.getConnection()
    await connection.beginTransaction()

    const resolutionQuery =
      'UPDATE resolution SET Asunto = ?, Referencia = ? WHERE NumdeResolucion = ?'
    await connection.query(resolutionQuery, [Asunto, Referencia, id])

    await connection.query('DELETE FROM images WHERE NumdeResolucion = ?', [id])

    const imagesData = ImagePaths.map(path => [id, path])
    const imagesQuery =
      'INSERT INTO images (NumdeResolucion, ImagePath) VALUES ?'
    await connection.query(imagesQuery, [imagesData])

    await connection.commit()

    res.status(200).json({
      message: 'Resolución y sus imágenes actualizadas exitosamente'
    })
  } catch (error) {
    if (connection) await connection.rollback()
    console.error('❌ Error en updateBook:', error)
    res.status(500).json({ error: 'Error en la base de datos: ' + error.message })
  } finally {
    if (connection) connection.release()
  }
}

export const deleteBook = async (req, res) => {
  const { id } = req.params

  if (!id) {
    return res.status(400).json({ error: 'ID de resolución requerido' })
  }

  db.beginTransaction(err => {
    if (err) {
      return res.status(500).json({ error: 'Error al iniciar la transacción' })
    }

    db.query('DELETE FROM resolution WHERE NumdeResolucion = ?', [id], err => {
      if (err) {
        return db.rollback(() => {
          res.status(500).json({ error: 'Error al eliminar la resolución' })
        })
      }

      db.query('DELETE FROM images WHERE NumdeResolucion = ?', [id], err => {
        if (err) {
          return db.rollback(() => {
            res.status(500).json({ error: 'Error al eliminar las imágenes' })
          })
        }

        db.commit(err => {
          if (err) {
            return db.rollback(() => {
              res
                .status(500)
                .json({ error: 'Error al confirmar la transacción' })
            })
          }

          res.status(200).json({
            message: 'Resolución y sus imágenes eliminadas exitosamente'
          })
        })
      })
    })
  })
}

export const createBook = async (req, res) => {
  const { NumdeResolucion, Asunto, Referencia, ImagePaths } = req.body

  if (!NumdeResolucion || !Asunto || !Referencia || !Array.isArray(ImagePaths)) {
    return res.status(400).json({ error: 'Datos incompletos o inválidos' })
  }

  let connection

  try {
    connection = await db.getConnection()

    await connection.beginTransaction()

    const resolutionQuery = 'INSERT INTO resolution (NumdeResolucion, Asunto, Referencia) VALUES (?, ?, ?)'
    await connection.query(resolutionQuery, [NumdeResolucion, Asunto, Referencia])

    const imagesData = ImagePaths.map(path => [NumdeResolucion, path])
    const imagesQuery = 'INSERT INTO images (NumdeResolucion, ImagePath) VALUES ?'
    await connection.query(imagesQuery, [imagesData])

    await connection.commit()

    res.status(201).json({ message: 'Resolución y sus imágenes creadas exitosamente' })
  } catch (error) {
    if (connection) await connection.rollback()
    res.status(500).json({ error: 'Error en la base de datos: ' + error.message })
  } finally {
    if (connection) connection.release()
  }
}
