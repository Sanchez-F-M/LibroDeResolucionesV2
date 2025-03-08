import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, Typography, TextField, Button, Grid, Container } from '@mui/material';
import api from '../../api/api'; // Importamos la instancia de Axios

const ModificarResolucion = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    Asunto: '',
    Referencia: ''
  });

  useEffect(() => {
    // Cargar datos actuales de la resolución para mostrarlos
    const fetchData = async () => {
      try {
        const response = await api.get(`/book/${id}`);
        const resolution = response.data[0];
        setFormData({ Asunto: resolution.Asunto, Referencia: resolution.Referencia });
      } catch (error) {
        console.error('Error al cargar la resolución:', error);
        alert('Error al obtener los datos de la resolución');
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
      await api.put(`/book/${id}`, {
        Asunto: formData.Asunto,
        Referencia: formData.Referencia,
        ImagePaths: [] // Si necesitas actualizar imágenes, envía sus rutas
      });
      alert('Resolución actualizada exitosamente');
      navigate('/buscador');
    } catch (err) {
      console.error('Error al actualizar la resolución:', err);
      alert('Error al actualizar la resolución');
    }
  };

  return (
    <Container maxWidth="md" sx={{ marginTop: '300px', marginBottom: '95px', textAlign: 'center' }}>
      <Card>
        <CardContent>
          <Typography variant="h6" align="left" sx={{ padding: 2 }}>
            Resolución N°: {id}
          </Typography>
          <Grid container spacing={3} direction="column" sx={{ padding: 2 }}>
            <Grid item>
              <TextField
                fullWidth
                label="Modificar Asunto"
                name="Asunto"
                value={formData.Asunto}
                onChange={handleChange}
                variant="outlined"
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
              />
            </Grid>
            <Grid item>
              <Button variant="contained" color="primary" fullWidth onClick={handleSubmit}>
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
