import db from '../../db/connection.js'

export const getByIdBook = async (req, res) => {
  try {
    const { id } = req.params;

    db.query(
      'SELECT * FROM resolution WHERE NumdeResolucion = ?',
      [id],
      (err, resolutions) => {
        if (err) {
          return res.status(400).json({ error: err.message });
        }

        db.query(
          'SELECT * FROM images WHERE NumdeResolucion = ?',
          [id],
          (err, images) => {
            if (err) {
              return res.status(400).json({ error: err.message });
            }

            const result = resolutions.map(resolution => ({
              numderesoluciones: resolution.NumdeResolucion,
              asunto: resolution.Asunto,
              referencia: resolution.Referencia,
              images: images
                .filter(
                  image => image.NumdeResolucion === resolution.NumdeResolucion
                )
                .map(image => image.ImagePath),
            }));

            res.status(200).json(result);
          }
        );
      }
    );
  } catch (error) {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

export const createBook = async (req, res) => {
  const { NumdeResolucion, Asunto, Referencia, ImagePaths } = req.body;

  if (
    !NumdeResolucion ||
    !Asunto ||
    !Referencia ||
    !Array.isArray(ImagePaths)
  ) {
    return res.status(400).json({ error: 'Datos incompletos o inválidos' });
  }

  db.beginTransaction(err => {
    if (err) {
      return res.status(500).json({ error: 'Error al iniciar la transacción' });
    }

    const resolutionQuery =
      'INSERT INTO resolution (NumdeResolucion, Asunto, Referencia) VALUES (?, ?, ?)';
    db.query(resolutionQuery, [NumdeResolucion, Asunto, Referencia], err => {
      if (err) {
        return db.rollback(() => {
          res.status(500).json({ error: 'Error al insertar la resolución' });
        });
      }

      const imagesData = ImagePaths.map(path => [NumdeResolucion, path]);
      const imagesQuery =
        'INSERT INTO images (NumdeResolucion, ImagePath) VALUES ?';

      db.query(imagesQuery, [imagesData], err => {
        if (err) {
          return db.rollback(() => {
            res.status(500).json({ error: 'Error al insertar las imágenes' });
          });
        }

        db.commit(err => {
          if (err) {
            return db.rollback(() => {
              res
                .status(500)
                .json({ error: 'Error al confirmar la transacción' });
            });
          }

          res.status(201).json({
            message: 'Resolución y sus imágenes creadas exitosamente',
          });
        });
      });
    });
  });
};

export const updateBook = async (req, res) => {
  const { id } = req.params;
  const { Asunto, Referencia, ImagePaths } = req.body;

  if (!id) {
    return res.status(400).json({ error: 'ID de resolución requerido' });
  }
  if (!Asunto || !Referencia || !Array.isArray(ImagePaths)) {
    return res.status(400).json({ error: 'Datos incompletos o inválidos' });
  }

  db.beginTransaction(err => {
    if (err) {
      return res.status(500).json({ error: 'Error al iniciar la transacción' });
    }

    const resolutionQuery =
      'UPDATE resolution SET Asunto = ?, Referencia = ? WHERE NumdeResolucion = ?';
    db.query(resolutionQuery, [Asunto, Referencia, id], err => {
      if (err) {
        return db.rollback(() => {
          res.status(500).json({ error: 'Error al actualizar la resolución' });
        });
      }

      const imagesData = ImagePaths.map(path => [id, path]);
      const imagesQuery =
        'INSERT INTO images (NumdeResolucion, ImagePath) VALUES ?';

      db.query('DELETE FROM images WHERE NumdeResolucion = ?', [id], err => {
        if (err) {
          return db.rollback(() => {
            res.status(500).json({ error: 'Error al eliminar las imágenes' });
          });
        }

        db.query(imagesQuery, [imagesData], err => {
          if (err) {
            return db.rollback(() => {
              res.status(500).json({ error: 'Error al insertar las imágenes' });
            });
          }

          db.commit(err => {
            if (err) {
              return db.rollback(() => {
                res
                  .status(500)
                  .json({ error: 'Error al confirmar la transacción' });
              });
            }

            res.status(200).json({
              message: 'Resolución y sus imágenes actualizadas exitosamente',
            });
          });
        });
      });
    });
  });
};

export const deleteBook = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ error: 'ID de resolución requerido' });
  }

  db.beginTransaction(err => {
    if (err) {
      return res.status(500).json({ error: 'Error al iniciar la transacción' });
    }

    db.query('DELETE FROM resolution WHERE NumdeResolucion = ?', [id], err => {
      if (err) {
        return db.rollback(() => {
          res.status(500).json({ error: 'Error al eliminar la resolución' });
        });
      }

      db.query('DELETE FROM images WHERE NumdeResolucion = ?', [id], err => {
        if (err) {
          return db.rollback(() => {
            res.status(500).json({ error: 'Error al eliminar las imágenes' });
          });
        }

        db.commit(err => {
          if (err) {
            return db.rollback(() => {
              res
                .status(500)
                .json({ error: 'Error al confirmar la transacción' });
            });
          }

          res.status(200).json({
            message: 'Resolución y sus imágenes eliminadas exitosamente',
          });
        });
      });
    });
  });
};
