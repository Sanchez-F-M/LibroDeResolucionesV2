import db from '../../db/connection.js';
import { getImageUrl } from '../../config/cloudinary.js';
import yearResetService from '../../services/YearResetService.js';
import path from 'path';

export const getByIdBook = async (req, res) => {
  const { id } = req.params;

  try {
    const resolutionResult = await db.query(
      'SELECT "NumdeResolucion", "Asunto", "Referencia", "FechaCreacion" as fetcha_creacion FROM resolution WHERE "NumdeResolucion" = $1',
      [id]
    );

    if (resolutionResult.rows.length === 0) {
      return res.status(404).json({ error: 'Resolución no encontrada' });
    }
    const resolution = resolutionResult.rows[0];
    const imagesResult = await db.query(
      'SELECT * FROM images WHERE "NumdeResolucion" = $1',
      [id]
    );

    const result = {
      NumdeResolucion: resolution.NumdeResolucion,
      asunto: resolution.Asunto,
      referencia: resolution.Referencia,
      fetcha_creacion: resolution.fetcha_creacion,
      images: imagesResult.rows.map(image => getImageUrl(image.ImagePath)),
    };

    res.status(200).json([result]); // Mantener formato array para compatibilidad
  } catch (error) {
    console.error('❌ Error en getByIdBook:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

export const updateBook = async (req, res) => {
  const { id } = req.params;
  const { Asunto, Referencia, ImagePaths } = req.body;

  if (!id) {
    return res.status(400).json({ error: ' ID de resolución requerido' });
  }
  if (!Asunto || !Referencia || !Array.isArray(ImagePaths)) {
    return res.status(400).json({ error: 'Datos incompletos o inválidos' });
  }

  const client = await db.connect();

  try {
    // Iniciar transacción
    await client.query('BEGIN');

    // Actualizar resolución
    await client.query(
      'UPDATE resolution SET "Asunto" = $1, "Referencia" = $2 WHERE "NumdeResolucion" = $3',
      [Asunto, Referencia, id]
    ); // Eliminar imágenes existentes
    await client.query('DELETE FROM images WHERE "NumdeResolucion" = $1', [id]);

    // Insertar nuevas imágenes
    for (const imagePath of ImagePaths) {
      await client.query(
        'INSERT INTO images ("NumdeResolucion", "ImagePath") VALUES ($1, $2)',
        [id, imagePath]
      );
    }

    // Confirmar transacción
    await client.query('COMMIT');

    res.status(200).json({
      message: 'Resolución y sus imágenes actualizadas exitosamente',
    });
  } catch (error) {
    // Revertir en caso de error
    await client.query('ROLLBACK');
    console.error('❌ Error en updateBook:', error);
    res
      .status(500)
      .json({ error: 'Error en la base de datos: ' + error.message });
  } finally {
    client.release();
  }
};

export const deleteBook = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ error: 'ID de resolución requerido' });
  }

  const client = await db.connect();

  try {
    // Iniciar transacción
    await client.query('BEGIN');

    // Eliminar resolución (las imágenes se eliminan automáticamente por CASCADE)
    const result = await client.query(
      'DELETE FROM resolution WHERE "NumdeResolucion" = $1',
      [id]
    );

    if (result.rowCount === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ error: 'Resolución no encontrada' });
    }

    // Eliminar imágenes asociadas
    await client.query('DELETE FROM images WHERE "NumdeResolucion" = $1', [id]);

    // Confirmar transacción
    await client.query('COMMIT');

    res.status(200).json({
      message: 'Resolución y sus imágenes eliminadas exitosamente',
    });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ Error en deleteBook:', error);
    res
      .status(500)
      .json({ error: 'Error al eliminar la resolución: ' + error.message });
  } finally {
    client.release();
  }
};

export const createBook = async (req, res) => {
  const { NumdeResolucion, Asunto, Referencia, FechaCreacion } = req.body;
  const ImagePath = req.files;

  if (
    !NumdeResolucion ||
    !Asunto ||
    !Referencia ||
    !FechaCreacion ||
    !ImagePath ||
    ImagePath.length === 0
  ) {
    return res.status(400).json({ error: 'Faltan datos o archivos' });
  }

  const fechaCreacion = new Date(FechaCreacion);

  const client = await db.connect();

  try {
    // Iniciar transacción
    await client.query('BEGIN');

    // Insertar resolución
    await client.query(
      'INSERT INTO resolution ("NumdeResolucion", "Asunto", "Referencia", "FechaCreacion") VALUES ($1, $2, $3, $4)',
      [NumdeResolucion, Asunto, Referencia, fechaCreacion.toISOString()]
    );

    // Insertar imágenes
    for (const file of ImagePath) {
      // Determinar la ruta de la imagen según si viene de Cloudinary o almacenamiento local
      let imagePath;

      if (
        file.path &&
        (file.path.startsWith('http://') || file.path.startsWith('https://'))
      ) {
        // Cloudinary: usar la URL completa (solo si es una URL válida)
        imagePath = file.path;
        console.log(`☁️ Guardando imagen de Cloudinary: ${imagePath}`);
      } else if (file.filename) {
        // Almacenamiento local: usar solo el nombre del archivo (no el path completo)
        imagePath = `uploads/${file.filename}`;
        console.log(`💾 Guardando imagen local: ${imagePath}`);
      } else if (file.path) {
        // Path local: extraer solo el nombre del archivo
        const fileName = path.basename(file.path);
        imagePath = `uploads/${fileName}`;
        console.log(`💾 Guardando imagen local (desde path): ${imagePath}`);
      } else {
        // Fallback: usar el path original
        imagePath = file.originalname;
        console.log(`⚠️ Usando nombre original como fallback: ${imagePath}`);
      }

      await client.query(
        'INSERT INTO images ("NumdeResolucion", "ImagePath") VALUES ($1, $2)',
        [NumdeResolucion, imagePath]
      );
    }

    // Confirmar transacción
    await client.query('COMMIT');

    res.status(201).json({
      message: 'Resolución creada exitosamente',
      NumdeResolucion,
      imagenes_guardadas: ImagePath.length,
    });
  } catch (error) {
    // Revertir en caso de error
    await client.query('ROLLBACK');
    console.error('Error en createBook:', error);
    if (error.code === '23505') {
      // PostgreSQL unique constraint violation
      return res
        .status(400)
        .json({ error: 'El número de resolución ya existe' });
    }
    res
      .status(500)
      .json({ error: 'Error al guardar la resolución: ' + error.message });
  } finally {
    client.release();
  }
};

export const getLastResolutionNumber = async (req, res) => {
  try {
    // Usar el servicio de reset anual para obtener el siguiente número
    const nextResolutionNumber =
      await yearResetService.getNextResolutionNumber();

    console.log(`📊 Próximo número de resolución: ${nextResolutionNumber}`);

    // Retornar el número completo en el formato esperado por el frontend
    res.status(200).json({
      lastNumber: nextResolutionNumber,
      format: 'NNN-YYYY',
    });
  } catch (error) {
    console.error('❌ Error en getLastResolutionNumber:', error);
    res
      .status(500)
      .json({ error: 'Error al obtener el último número de resolución' });
  }
};

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
    `);

    // Para cada resolución, obtener sus imágenes
    const resolutionsWithImages = await Promise.all(
      resolutions.rows.map(async resolution => {
        const images = await db.query(
          'SELECT "ImagePath" FROM images WHERE "NumdeResolucion" = $1',
          [resolution.NumdeResolucion]
        );

        return {
          NumdeResolucion: resolution.NumdeResolucion,
          asunto: resolution.Asunto,
          referencia: resolution.Referencia,
          fetcha_creacion: resolution.fetcha_creacion,
          images: images.rows.map(image => getImageUrl(image.ImagePath)),
        };
      })
    );

    res.status(200).json(resolutionsWithImages);
  } catch (error) {
    console.error('❌ Error en getAllBooks:', error);
    res
      .status(500)
      .json({ error: 'Error interno del servidor: ' + error.message });
  }
};

// Función especial para insertar resoluciones de prueba (sin archivos reales)
export const insertTestResolution = async (req, res) => {
  const { NumdeResolucion, Asunto, Referencia, FechaCreacion, ImagePaths } =
    req.body;

  if (!NumdeResolucion || !Asunto || !Referencia || !FechaCreacion) {
    return res.status(400).json({ error: 'Faltan datos requeridos' });
  }

  const fechaCreacion = new Date(FechaCreacion);

  const client = await db.connect();

  try {
    // Iniciar transacción
    await client.query('BEGIN');

    // Verificar si la resolución ya existe
    const existing = await client.query(
      'SELECT "NumdeResolucion" FROM resolution WHERE "NumdeResolucion" = $1',
      [NumdeResolucion]
    );
    if (existing.rows.length > 0) {
      await client.query('ROLLBACK');
      return res
        .status(400)
        .json({ error: 'El número de resolución ya existe' });
    }

    // Insertar resolución
    await client.query(
      'INSERT INTO resolution ("NumdeResolucion", "Asunto", "Referencia", "FechaCreacion") VALUES ($1, $2, $3, $4)',
      [NumdeResolucion, Asunto, Referencia, fechaCreacion.toISOString()]
    );

    // Insertar imágenes mock si se proporcionan
    if (ImagePaths && Array.isArray(ImagePaths)) {
      for (const imagePath of ImagePaths) {
        await client.query(
          'INSERT INTO images ("NumdeResolucion", "ImagePath") VALUES ($1, $2)',
          [NumdeResolucion, imagePath]
        );
      }
    }

    // Confirmar transacción
    await client.query('COMMIT');

    res.status(201).json({
      message: 'Resolución mock creada exitosamente',
      NumdeResolucion,
    });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error al crear resolución mock:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  } finally {
    client.release();
  }
};

export {
  getAllBooks as getResolutions,
  getByIdBook as getResolutionById,
  createBook as createResolution,
  updateBook as updateResolution,
  deleteBook as deleteResolution,
  insertTestResolution as createMockResolution,
};
