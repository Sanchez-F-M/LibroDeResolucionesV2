import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, Typography, Button, Grid, Container, CircularProgress, Box, Paper } from '@mui/material';
import api from '../../api/api'; // Asume que api está configurado

const MostrarLibro = () => {
  const { id } = useParams(); // Obtiene el ID de la URL
  const navigate = useNavigate();
  const [resolutionData, setResolutionData] = useState(null); // Estado para guardar los datos de la resolución
  const [loading, setLoading] = useState(true); // Estado de carga
  const [error, setError] = useState(null); // Estado de error

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true); // Inicia la carga
      setError(null); // Resetea el error
      try {
        const response = await api.get(`/api/books/${id}`);
        // Asumiendo que la API devuelve un array con un solo objeto
        const resolution = response.data && response.data.length > 0 ? response.data[0] : null; 
        if (resolution) {
          setResolutionData(resolution); 
        } else {
          setError('No se encontró la resolución especificada.');
        }
      } catch (err) {
        console.error('Error al cargar la resolución:', err);
        setError('Error al obtener los datos de la resolución. Verifique la conexión o el ID.');
      } finally {
        setLoading(false); // Finaliza la carga
      }
    };
    fetchData();
  }, [id]); // Se ejecuta cada vez que el 'id' cambie

  // Función para construir la URL de la imagen
  const getImageUrl = (imagePath) => {
    // Si la imagen ya es una URL completa, la devolvemos tal cual
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
      return imagePath;
    }

    // Construimos la URL completa usando la ruta base del backend
    // Cambia '/static/uploads/' por la ruta correcta si es diferente
    return `http://localhost:3000/static/uploads/${imagePath}`;
  };

  if (loading) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <Typography color="error" sx={{ mt: 4 }}>{error}</Typography>
        <Button variant="outlined" onClick={() => navigate(-1)} sx={{ mt: 2 }}>
           Volver
         </Button>
      </Container>
    );
  }

  // Si no hay datos después de cargar (y sin error explícito), muestra un mensaje
  if (!resolutionData) {
    return (
      <Container>
        <Typography sx={{ mt: 4 }}>No se pudieron cargar los datos de la resolución.</Typography>
        <Button variant="outlined" onClick={() => navigate(-1)} sx={{ mt: 2 }}>
          Volver
        </Button>
      </Container>
    );
  }

  // Obtenemos el array de imágenes considerando ambas posibles nomenclaturas
  const images = resolutionData.images || resolutionData.Images || [];

  return (
    <Container maxWidth="lg" sx={{ mt: { xs: 4, md: 8 }, mb: 4 }}> 
      <Card component={Paper} elevation={3}>
        <CardContent>
          <Typography variant="h4" gutterBottom sx={{ fontSize: { xs: '1.8rem', md: '2.125rem' } }}>
            Detalles de la Resolución
          </Typography>

          <Grid container spacing={3}>
            <Grid item xs={12}>
              {/* Muestra el N° Resolución si existe */}
              {resolutionData.NumdeResolucion && (
                <Typography variant="h6">
                  <strong>N° Resolución:</strong> {resolutionData.NumdeResolucion}
                </Typography>
              )}
            </Grid>
            <Grid item xs={12}>
              <Typography variant="body1"> 
                <strong>Asunto:</strong> {resolutionData.Asunto || resolutionData.asunto || 'No disponible'}
              </Typography>
            </Grid>

            <Grid item xs={12}>
              <Typography variant="body1">
                <strong>Referencia:</strong> {resolutionData.Referencia || resolutionData.referencia || 'No disponible'}
              </Typography>
            </Grid>

            {/* Sección de Imágenes */}
            {images.length > 0 ? (
              <Grid item xs={12}>
                <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>Imágenes:</Typography>
                <Grid container spacing={2}>
                  {images.map((img, index) => (
                    <Grid item xs={12} sm={6} md={4} key={index}>
                      <Box sx={{ 
                        border: '1px solid #ddd', 
                        borderRadius: '4px', 
                        overflow: 'hidden', 
                        p: 1,
                        height: '300px', // Altura consistente
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <img
                          src={getImageUrl(img)}
                          alt={`Imagen ${index + 1}`}
                          style={{ 
                            display: 'block',
                            maxWidth: '100%',
                            maxHeight: '100%',
                            objectFit: 'contain',
                            borderRadius: '4px'
                          }}
                          onError={(e) => { 
                            console.error(`Error al cargar la imagen: ${img}`);
                            e.target.onerror = null; 
                            e.target.src="/placeholder-image.png"; 
                            e.target.alt="Imagen no disponible";
                          }}
                        />
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </Grid>
            ) : (
              <Grid item xs={12}>
                <Typography sx={{ mt: 2 }}>No hay imágenes asociadas a esta resolución.</Typography>
              </Grid>
            )}

            {/* Botón Volver */}
            <Grid item xs={12} sx={{ mt: 3 }}>
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