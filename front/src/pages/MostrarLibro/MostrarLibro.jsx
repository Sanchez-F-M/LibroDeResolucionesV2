import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Card, 
  CardContent, 
  Typography, 
  Button, 
  Grid, 
  Container, 
  CircularProgress, 
  Box, 
  Paper, 
  useMediaQuery, 
  useTheme,
  Stack,
  Chip,
  Alert,
  Divider,
  IconButton,
  Dialog,
  DialogContent,
  DialogActions
} from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import CloseIcon from '@mui/icons-material/Close';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import DescriptionIcon from '@mui/icons-material/Description';
import TagIcon from '@mui/icons-material/Tag';
import api from '../../api/api';
import jsPDF from 'jspdf';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { getImageUrl, downloadImage, handleImageError } from '../../utils/imageUtils';

const MostrarLibro = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [resolutionData, setResolutionData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imageDialogOpen, setImageDialogOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  // Responsive breakpoints
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));

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
  const handleDownload = async (imageUrl, index) => {
    await downloadImage(imageUrl, `resolucion-${index + 1}`);
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
  const handleImageClick = (imagePath) => {
    setSelectedImage(imagePath);
    setImageDialogOpen(true);
  };

  const handleCloseImageDialog = () => {
    setImageDialogOpen(false);
    setSelectedImage(null);
  };

  if (loading) {
    return (
      <Container 
        maxWidth="sm" 
        sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '80vh',
          flexDirection: 'column',
          gap: 2
        }}
      >
        <CircularProgress size={60} />
        <Typography variant="h6" color="text.secondary">
          Cargando resolución...
        </Typography>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md" sx={{ mt: { xs: 10, md: 12 } }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <Button 
            variant="contained" 
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate(-1)}
            size={isMobile ? "medium" : "large"}
          >
            Volver
          </Button>
        </Box>
      </Container>
    );
  }

  if (!resolutionData) {
    return (
      <Container maxWidth="md" sx={{ mt: { xs: 10, md: 12 } }}>
        <Alert severity="warning" sx={{ mb: 3 }}>
          No se pudieron cargar los datos de la resolución.
        </Alert>
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <Button 
            variant="contained" 
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate(-1)}
            size={isMobile ? "medium" : "large"}
          >
            Volver
          </Button>
        </Box>
      </Container>
    );
  }
  const images = resolutionData.images || resolutionData.Images || [];

  return (
    <>
      <Container maxWidth="xl" sx={{ 
        mt: { xs: 10, md: 12 }, 
        mb: { xs: 4, md: 6 },
        px: { xs: 2, sm: 3, md: 4 }
      }}> 
        {/* Header con botón de volver */}
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          mb: 3,
          gap: 2
        }}>
          <IconButton 
            onClick={() => navigate(-1)}
            sx={{ 
              p: { xs: 1, sm: 1.5 },
              bgcolor: 'primary.main',
              color: 'white',
              '&:hover': {
                bgcolor: 'primary.dark',
                transform: 'scale(1.05)'
              }
            }}
          >
            <ArrowBackIcon />
          </IconButton>
          <Typography 
            variant={isMobile ? "h5" : "h4"} 
            color="primary" 
            fontWeight="bold"
          >
            Detalle de Resolución
          </Typography>
        </Box>

        <Card 
          component={Paper} 
          elevation={isMobile ? 1 : 3}
          sx={{
            borderRadius: { xs: 2, md: 3 },
            overflow: 'hidden'
          }}
        >
          <CardContent sx={{ 
            p: { xs: 2, sm: 3, md: 4 },
            '&:last-child': { pb: { xs: 2, sm: 3, md: 4 } }
          }}>
            {/* Información principal */}
            <Stack spacing={3}>
              {/* Número de resolución */}
              {resolutionData?.NumdeResolucion && (
                <Box>
                  <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
                    <TagIcon color="primary" fontSize={isMobile ? "medium" : "large"} />
                    <Typography 
                      variant={isMobile ? "h6" : "h5"} 
                      color="primary" 
                      fontWeight="bold"
                    >
                      Número de Resolución
                    </Typography>
                  </Stack>
                  <Chip 
                    label={`N° ${resolutionData.NumdeResolucion}`}
                    color="primary"
                    variant="filled"
                    size={isMobile ? "medium" : "large"}
                    sx={{ 
                      fontSize: { xs: '1rem', sm: '1.1rem', md: '1.2rem' },
                      fontWeight: 'bold',
                      py: { xs: 2, sm: 3 },
                      px: { xs: 2, sm: 3 }
                    }}
                  />
                </Box>
              )}

              <Divider />

              {/* Asunto */}
              <Box>
                <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
                  <DescriptionIcon color="primary" fontSize={isMobile ? "medium" : "large"} />
                  <Typography 
                    variant={isMobile ? "h6" : "h5"} 
                    color="primary" 
                    fontWeight="bold"
                  >
                    Asunto
                  </Typography>
                </Stack>
                <Typography 
                  variant={isMobile ? "body1" : "h6"}
                  sx={{ 
                    lineHeight: 1.6,
                    textAlign: 'justify',
                    wordBreak: 'break-word'
                  }}
                >
                  {resolutionData?.Asunto || resolutionData?.asunto || 'No disponible'}
                </Typography>
              </Box>

              <Divider />

              {/* Referencia */}
              <Box>
                <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
                  <DescriptionIcon color="primary" fontSize={isMobile ? "medium" : "large"} />
                  <Typography 
                    variant={isMobile ? "h6" : "h5"} 
                    color="primary" 
                    fontWeight="bold"
                  >
                    Referencia
                  </Typography>
                </Stack>
                <Typography 
                  variant={isMobile ? "body1" : "h6"}
                  sx={{ 
                    lineHeight: 1.6,
                    textAlign: 'justify',
                    wordBreak: 'break-word'
                  }}
                >
                  {resolutionData?.Referencia || resolutionData?.referencia || 'No disponible'}
                </Typography>
              </Box>

              <Divider />

              {/* Fecha de creación */}
              <Box>
                <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
                  <CalendarTodayIcon color="primary" fontSize={isMobile ? "medium" : "large"} />
                  <Typography 
                    variant={isMobile ? "h6" : "h5"} 
                    color="primary" 
                    fontWeight="bold"
                  >
                    Fecha de Creación
                  </Typography>
                </Stack>
                <Chip 
                  label={resolutionData?.fetcha_creacion ? 
                    format(new Date(resolutionData.fetcha_creacion), 'dd \'de\' MMMM \'de\' yyyy', { locale: es }) 
                    : 'No disponible'}
                  variant="outlined"
                  color="primary"
                  size={isMobile ? "medium" : "large"}
                  sx={{ 
                    fontSize: { xs: '0.9rem', sm: '1rem' },
                    py: { xs: 1.5, sm: 2 }
                  }}
                />
              </Box>

              {/* Imágenes */}
              {images && images.length > 0 ? (
                <>
                  <Divider />
                  <Box>
                    <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 3 }}>
                      <PictureAsPdfIcon color="primary" fontSize={isMobile ? "medium" : "large"} />
                      <Typography 
                        variant={isMobile ? "h6" : "h5"} 
                        color="primary" 
                        fontWeight="bold"
                      >
                        Documentos Adjuntos ({images.length})
                      </Typography>
                    </Stack>

                    {/* Grid de imágenes */}
                    <Grid container spacing={{ xs: 2, sm: 3, md: 4 }}>
                      {images.map((img, index) => (
                        <Grid item xs={12} sm={6} lg={4} key={index}>
                          <Box sx={{ 
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 2
                          }}>
                            <Paper
                              elevation={2}
                              sx={{ 
                                border: '2px solid',
                                borderColor: 'grey.200',
                                borderRadius: 2,
                                overflow: 'hidden',
                                cursor: 'pointer',
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                  borderColor: 'primary.main',
                                  transform: 'translateY(-4px)',
                                  boxShadow: theme.shadows[8],
                                },
                                position: 'relative',
                                height: { xs: 250, sm: 300, md: 350 },
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                bgcolor: '#f9f9f9'
                              }}
                              onClick={() => handleImageClick(img)}
                            >
                              <img
                                src={getImageUrl(img)}
                                alt={`Documento ${index + 1}`}
                                style={{ 
                                  display: 'block',
                                  maxWidth: '100%',
                                  maxHeight: '100%',
                                  objectFit: 'contain'
                                }}                                onError={handleImageError}
                              />
                              {/* Overlay con icono de zoom */}
                              <Box sx={{
                                position: 'absolute',
                                top: 8,
                                right: 8,
                                bgcolor: 'rgba(0,0,0,0.7)',
                                borderRadius: '50%',
                                p: 1,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                opacity: 0,
                                transition: 'opacity 0.3s ease',
                                '.MuiPaper-root:hover &': {
                                  opacity: 1
                                }
                              }}>
                                <ZoomInIcon sx={{ color: 'white', fontSize: 20 }} />
                              </Box>
                            </Paper>

                            {/* Botón de descarga individual */}
                            <Button
                              variant="outlined"
                              startIcon={<DownloadIcon />}
                              onClick={() => handleDownload(getImageUrl(img), index)}
                              fullWidth
                              size={isMobile ? "medium" : "large"}
                              sx={{ 
                                borderRadius: 2,
                                textTransform: 'none',
                                fontWeight: 600
                              }}
                            >
                              Descargar Documento {index + 1}
                            </Button>
                          </Box>
                        </Grid>
                      ))}
                    </Grid>

                    {/* Botón de descarga de PDF */}
                    <Box sx={{ 
                      display: 'flex', 
                      justifyContent: 'center',
                      mt: 4
                    }}>
                      <Button
                        variant="contained"
                        color="primary"
                        startIcon={<PictureAsPdfIcon />}
                        onClick={handleDownloadAllAsPDF}
                        size={isMobile ? "large" : "large"}
                        sx={{ 
                          minWidth: { xs: '100%', sm: 300 },
                          py: { xs: 1.5, sm: 2 },
                          fontSize: { xs: '1rem', sm: '1.1rem' },
                          fontWeight: 'bold',
                          borderRadius: 2,
                          textTransform: 'none',
                          boxShadow: theme.shadows[4],
                          '&:hover': {
                            boxShadow: theme.shadows[8],
                            transform: 'translateY(-2px)'
                          }
                        }}
                      >
                        Descargar Todo como PDF
                      </Button>
                    </Box>
                  </Box>
                </>
              ) : (
                <>
                  <Divider />
                  <Alert severity="info" sx={{ borderRadius: 2 }}>
                    <Typography variant="body1">
                      No hay documentos adjuntos para esta resolución.
                    </Typography>
                  </Alert>
                </>
              )}
            </Stack>
          </CardContent>
        </Card>
      </Container>

      {/* Dialog para vista ampliada de imágenes */}
      <Dialog
        open={imageDialogOpen}
        onClose={handleCloseImageDialog}
        maxWidth="lg"
        fullWidth
        fullScreen={isMobile}
        sx={{
          '& .MuiDialog-paper': {
            borderRadius: isMobile ? 0 : 2,
            m: isMobile ? 0 : 2
          }
        }}
      >
        <DialogActions sx={{ 
          position: 'absolute', 
          top: 0, 
          right: 0, 
          zIndex: 1,
          p: 1
        }}>
          <IconButton 
            onClick={handleCloseImageDialog}
            sx={{
              bgcolor: 'rgba(0,0,0,0.5)',
              color: 'white',
              '&:hover': {
                bgcolor: 'rgba(0,0,0,0.7)'
              }
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogActions>
        <DialogContent sx={{ p: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {selectedImage && (
            <img
              src={getImageUrl(selectedImage)}
              alt="Vista ampliada"
              style={{
                maxWidth: '100%',
                maxHeight: '100%',
                objectFit: 'contain'
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default MostrarLibro;