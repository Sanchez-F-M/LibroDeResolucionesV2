import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, Typography, Button, Grid, Container, CircularProgress, Box, Paper, useMediaQuery, useTheme } from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import api from '../../api/api';
import jsPDF from 'jspdf';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

const MostrarLibro = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [resolutionData, setResolutionData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Añadimos soporte para responsive
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await api.get(`/api/books/${id}`);
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
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const getImageUrl = (imagePath) => {
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
      return imagePath;
    }
    return `http://localhost:3000/${imagePath}`;
  };

  const handleDownload = async (imageUrl, index) => {
    try {
      const response = await fetch(imageUrl, {
        method: 'GET',
        mode: 'cors',
        credentials: 'same-origin',
        headers: {
          'Accept': 'image/*'
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `resolucion-${index + 1}.${blob.type.split('/')[1]}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error al descargar la imagen:', error);
      alert('Hubo un error al descargar la imagen. Por favor intente nuevamente.');
    }
  };

  const handleDownloadAllAsPDF = async () => {
    try {
      if (!resolutionData || !resolutionData.images || resolutionData.images.length === 0) {
        alert('No hay imágenes para descargar');
        return;
      }

      const pdf = new jsPDF();
      let isFirstPage = true;

      for (const imagePath of resolutionData.images) {
        try {
          const response = await fetch(getImageUrl(imagePath));
          const blob = await response.blob();
          const imageUrl = URL.createObjectURL(blob);

          const img = new Image();
          await new Promise((resolve, reject) => {
            img.onload = resolve;
            img.onerror = reject;
            img.src = imageUrl;
          });

          const pageWidth = pdf.internal.pageSize.getWidth();
          const pageHeight = pdf.internal.pageSize.getHeight();
          const imgRatio = img.width / img.height;
          let imgWidth = pageWidth - 20;
          let imgHeight = imgWidth / imgRatio;

          if (imgHeight > pageHeight - 20) {
            imgHeight = pageHeight - 20;
            imgWidth = imgHeight * imgRatio;
          }

          if (!isFirstPage) {
            pdf.addPage();
          }

          const x = (pageWidth - imgWidth) / 2;
          const y = (pageHeight - imgHeight) / 2;

          const canvas = document.createElement('canvas');
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0);
          const imageData = canvas.toDataURL('image/jpeg');

          pdf.addImage(imageData, 'JPEG', x, y, imgWidth, imgHeight);
          isFirstPage = false;

          URL.revokeObjectURL(imageUrl);
        } catch (error) {
          console.error('Error al procesar imagen:', error);
        }
      }

      pdf.save(`resolucion-${resolutionData.NumdeResolucion}.pdf`);
    } catch (error) {
      console.error('Error al generar PDF:', error);
      alert('Error al generar el PDF. Por favor, intente nuevamente.');
    }
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

  const images = resolutionData.images || resolutionData.Images || [];

  return (
    <Container maxWidth="xl" sx={{ mt: { xs: 10, md: 20 }, mb: 6 }}> 
      <Card component={Paper} elevation={3}>
        <CardContent>
          <Grid container spacing={5}>
            <Grid item xs={12}>
              {resolutionData?.NumdeResolucion && (
                <Typography variant={isMobile ? "h4" : "h3"} sx={{ mb: 2 }}>
                  <strong>N° Resolución:</strong> {resolutionData.NumdeResolucion}
                </Typography>
              )}
            </Grid>

            <Grid item xs={12}>
              <Typography variant={isMobile ? "h5" : "h4"}> 
                <strong>Asunto:</strong> {resolutionData?.Asunto || resolutionData?.asunto || 'No disponible'}
              </Typography>
            </Grid>

            <Grid item xs={12}>
              <Typography variant={isMobile ? "h5" : "h4"}>
                <strong>Referencia:</strong> {resolutionData?.Referencia || resolutionData?.referencia || 'No disponible'}
              </Typography>
            </Grid>

            <Grid item xs={12}>
              <Typography variant={isMobile ? "h6" : "h5"}>
                <strong>Fecha de Creación:</strong>{' '}
                {resolutionData?.fetcha_creacion ? 
                  format(new Date(resolutionData.fetcha_creacion), 'dd MMMM yyyy', { locale: es }) 
                  : 'No disponible'}
              </Typography>
            </Grid>

            

            {resolutionData && resolutionData.images && resolutionData.images.length > 0 ? (
              <Grid item xs={12}>
                <Typography variant={isMobile ? "h5" : "h4"} sx={{ mt: 2, mb: 2 }}>
                  Imágenes:
                </Typography>
                <Grid container spacing={2}> 
                  {resolutionData.images.map((img, index) => (
                    <Grid item xs={12} sm={6} md={4} key={index}>
                      <Box sx={{ 
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: 1
                      }}>
                        <Box sx={{ 
                          border: '5px solid #ddd', 
                          borderRadius: '10px', 
                          overflow: 'hidden',
                          boxShadow: 2,
                          backgroundColor: '#f9f9f9',
                          transition: 'transform 0.2s', 
                          '&:hover': {
                            transform: 'scale(1.02)',
                            boxShadow: 4,
                          },
                          p: 0,
                          height: '400px',
                          width: '100%',
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
                        <Button
                          variant="contained"
                          startIcon={<DownloadIcon />}
                          onClick={() => handleDownload(getImageUrl(img), index)}
                          sx={{ 
                            width: 'fit-content',
                            fontSize: { xs: '0.8rem', sm: '0.9rem' }
                          }}
                        >
                          Descargar
                        </Button>
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
{resolutionData && resolutionData.images && resolutionData.images.length > 0 && (
              <Grid item xs={12}>
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'center',
                  width: '100%',
                  mt: { xs: 2, sm: 3 },
                  mb: { xs: 2, sm: 3 }
                }}>
                  <Button
                    variant="contained"
                    color="primary"
                    startIcon={<PictureAsPdfIcon />}
                    onClick={handleDownloadAllAsPDF}
                    sx={{ 
                      minWidth: { xs: '90%', sm: '200px' },
                      py: { xs: 1.5, sm: 2 },
                      fontSize: { xs: '0.9rem', sm: '1rem' }
                    }}
                  >
                    Descargar PDF
                  </Button>
                </Box>
              </Grid>
            )}
            <Grid item xs={12} sx={{ mt: 3, mb: 5 }}>
              <Button
                variant="contained"
                color="primary"
                onClick={() => navigate(-1)}
                sx={{ 
                  fontSize: { xs: '0.9rem', sm: '1rem' },
                  py: { xs: 1, sm: 1.5 }
                }}
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