import db from '../../db/connection.js'
import { getImageUrl } from '../../config/cloudinary.js'

export const search = async (req, res) => {
  const { criterion, value } = req.body

  const validCriteria = ['NumdeResolucion', 'Asunto', 'Referencia']
  if (!validCriteria.includes(criterion)) {
    return res.status(400).json({ error: 'Criterio de búsqueda inválido' })
  }

  let query = ''
  let params = []
  
  switch (criterion) {
    case 'NumdeResolucion':
      query = 'SELECT "NumdeResolucion", "Asunto", "Referencia", "FechaCreacion" as fetcha_creacion FROM resolution WHERE "NumdeResolucion" = $1 ORDER BY "FechaCreacion" DESC, "NumdeResolucion" DESC'
      params = [value]
      break
    case 'Asunto':
      query = 'SELECT "NumdeResolucion", "Asunto", "Referencia", "FechaCreacion" as fetcha_creacion FROM resolution WHERE "Asunto" ILIKE $1 ORDER BY "FechaCreacion" DESC, "NumdeResolucion" DESC'
      params = [`%${value}%`]
      break
    case 'Referencia':
      query = 'SELECT "NumdeResolucion", "Asunto", "Referencia", "FechaCreacion" as fetcha_creacion FROM resolution WHERE "Referencia" ILIKE $1 ORDER BY "FechaCreacion" DESC, "NumdeResolucion" DESC'
      params = [`%${value}%`]
      break
  }

  try {
    // Usar db.query() para PostgreSQL, no db.all()
    const result = await db.query(query, params)
    const resolutions = result.rows

    if (!resolutions.length) {
      return res.status(404).json({ error: 'No se encontraron resoluciones' })
    }

    // Para cada resolución, obtener sus imágenes y formatear igual que getAllBooks
    const resolutionsWithImages = await Promise.all(
      resolutions.map(async (resolution) => {        const images = await db.query('SELECT "ImagePath" FROM images WHERE "NumdeResolucion" = $1', [resolution.NumdeResolucion])
        
        return {
          NumdeResolucion: resolution.NumdeResolucion,
          asunto: resolution.Asunto,
          referencia: resolution.Referencia,
          fetcha_creacion: resolution.fetcha_creacion || resolution.FechaCreacion,  // Manejar ambos casos
          images: images.rows.map(image => getImageUrl(image.ImagePath))
        }
      })
    )

    res.status(200).json(resolutionsWithImages)
  } catch (error) {
    console.error('❌ Error al realizar la búsqueda:', error)
    return res.status(500).json({ error: 'Error interno del servidor' })
  }
}
