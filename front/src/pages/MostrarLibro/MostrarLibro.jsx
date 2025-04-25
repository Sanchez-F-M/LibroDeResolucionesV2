import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, Typography, TextField, Button, Grid, Container } from '@mui/material';
import api from '../../api/api';

const MostrarLibro = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    Asunto: '',
    Referencia: '',
    Images: []
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get(`/api/books/${id}`);
        const resolution = response.data[0];
        setFormData({
          Asunto: resolution.asunto,
          Referencia: resolution.referencia,
          Images: resolution.images || []
        });
      } catch (error) {
        console.error('Error al cargar la resolución:', error);
        alert('Error al obtener los datos de la resolución');
      }
    };
    fetchData();
  }, [id]);

  return (
    <Container>
      <Card>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            Modificar Resolución
          </Typography>

          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Asunto"
                value={formData.Asunto}
                onChange={(e) => setFormData({ ...formData, Asunto: e.target.value })}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Referencia"
                value={formData.Referencia}
                onChange={(e) => setFormData({ ...formData, Referencia: e.target.value })}
              />
            </Grid>

            {formData.Images.length > 0 && (
              <Grid item xs={12}>
                <Typography variant="subtitle1">Imágenes:</Typography>
                {formData.Images.map((img, index) => (
                  <img
                    key={index}
                    src={`http://localhost:3000/api/books/${img}`} // <-- Asegurate de que esta ruta sea válida
                    alt={`Imagen ${index + 1}`}
                    style={{ maxWidth: '100%', marginBottom: '10px', borderRadius: '8px' }}
                  />
                ))}
              </Grid>
            )}

            <Grid item xs={12}>
              <Button
                variant="contained"
                color="primary"
                onClick={() => navigate(-1)}
              >
                Volver
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Container>
  );
};

export default MostrarLibro;
