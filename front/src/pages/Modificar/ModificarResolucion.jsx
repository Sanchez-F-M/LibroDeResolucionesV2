import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, Typography, TextField, Button, Grid, Container } from '@mui/material';
import api from '../../api/api';

const ModificarResolucion = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    Asunto: '',
    Referencia: '',
    ImagePaths: [] // Mantener las rutas de las imágenes existentes
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get(`/api/books/${id}`);
        const resolution = response.data[0];
        if (resolution) {
          setFormData({
            Asunto: resolution.Asunto || resolution.asunto,
            Referencia: resolution.Referencia || resolution.referencia,
            ImagePaths: resolution.images || resolution.Images || []
          });
        } else {
          setError('No se encontró la resolución');
        }
      } catch (error) {
        console.error('Error al cargar la resolución:', error);
        setError('Error al cargar los datos de la resolución');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    try {
      // Validar datos antes de enviar
      if (!formData.Asunto || !formData.Referencia) {
        setError('Por favor complete todos los campos');
        return;
      }

      const response = await api.put(`/api/books/${id}`, {
        Asunto: formData.Asunto,
        Referencia: formData.Referencia,
        ImagePaths: formData.ImagePaths
      });

      if (response.status === 200) {
        alert('Resolución actualizada exitosamente');
        navigate('/buscador');
      }
    } catch (err) {
      console.error('Error al actualizar la resolución:', err);
      setError(err.response?.data?.error || 'Error al actualizar la resolución');
    }
  };

  if (loading) {
    return (
      <Container maxWidth="xl" sx={{ mt: { xs: 4, md: '100px' } }}>
        <Typography>Cargando...</Typography>
      </Container>
    );
  }

  return (
    <Container 
      maxWidth="xl" 
      sx={{ 
        mt: { xs: 4, md: '100px' }, 
        mb: { xs: 4, md: '95px' }, 
        textAlign: 'center' 
      }}
    >
      <Card>
        <CardContent>
          <Typography 
            variant="h4" 
            align="left" 
            sx={{ p: { xs: 2, md: 10 }, mt: { xs: 6, md: 10 } }}
          >
            Resolución N°: {id}
          </Typography>
          {error && (
            <Typography color="error" sx={{ mb: 2 }}>
              {error}
            </Typography>
          )}
          <Grid 
            container 
            spacing={3} 
            direction="column" 
            sx={{ p: { xs: 2, md: 5 } }}
          >
            <Grid item>
              <TextField
                fullWidth
                label="Modificar Asunto"
                name="Asunto"
                value={formData.Asunto}
                onChange={handleChange}
                variant="outlined"
                error={!formData.Asunto}
                helperText={!formData.Asunto ? 'El asunto es requerido' : ''}
              />
            </Grid>
            <Grid item>
              <TextField
                fullWidth
                label="Modificar Referencia"
                name="Referencia"
                value={formData.Referencia}
                onChange={handleChange}
                variant="outlined"
                error={!formData.Referencia}
                helperText={!formData.Referencia ? 'La referencia es requerida' : ''}
              />
            </Grid>
            <Grid item>
              <Button 
                variant="contained" 
                color="primary" 
                fullWidth 
                sx={{ mt: { xs: 2, md: 5 }, mb: { xs: 2, md: 16.2 } }} 
                onClick={handleSubmit}
                disabled={!formData.Asunto || !formData.Referencia}
              >
                Guardar Cambios
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Container>
  );
};

export default ModificarResolucion;
