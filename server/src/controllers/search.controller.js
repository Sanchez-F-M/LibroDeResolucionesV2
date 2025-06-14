import db from '../../db/connection.js'

export const search = async (req, res) => {
  const { criterion, value } = req.body

  const validCriteria = ['NumdeResolucion', 'Asunto', 'Referencia']
  if (!validCriteria.includes(criterion)) {
    return res.status(400).json({ error: 'Criterio de búsqueda inválido' })
  }  let query = ''
  let params = []
  switch (criterion) {
    case 'NumdeResolucion':
      query = 'SELECT * FROM resolution WHERE "NumdeResolucion" = $1 ORDER BY "FechaCreacion" DESC, "NumdeResolucion" DESC'
      params = [value]
      break
    case 'Asunto':
      query = 'SELECT * FROM resolution WHERE "Asunto" ILIKE $1 ORDER BY "FechaCreacion" DESC, "NumdeResolucion" DESC'
      params = [`%${value}%`]
      break
    case 'Referencia':
      query = 'SELECT * FROM resolution WHERE "Referencia" ILIKE $1 ORDER BY "FechaCreacion" DESC, "NumdeResolucion" DESC'
      params = [`%${value}%`]
      break
  }

  try {
    const data = await db.all(query, params)

    if (!data.length) {
      return res.status(404).json({ error: 'No se encontraron resoluciones' })
    }

    res.status(200).json(data)
  } catch (error) {
    console.error('Error al realizar la búsqueda:', error)
    return res.status(500).json({ error: 'Error interno del servidor' })
  }
}
