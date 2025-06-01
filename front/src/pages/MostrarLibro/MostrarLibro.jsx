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
import { getImageUrl, downloadImage, handleImageError, preloadImage, getOptimizedImageUrl, testImageConnectivity } from '../../utils/imageUtils';

const MostrarLibro = () => {
  const { id } = useParams();
  const navigate = useNavigate();  const [resolutionData, setResolutionData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imageDialogOpen, setImageDialogOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageLoadingStates, setImageLoadingStates] = useState({});
  const [preloadedImages, setPreloadedImages] = useState({});
  const [debugMode, setDebugMode] = useState(false);

  // Responsive breakpoints
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      
      // En móviles, ejecutar test de conectividad si está en modo debug
      if (isMobile && (window.location.search.includes('debug') || localStorage.getItem('debugMode'))) {
        setDebugMode(true);
        console.log('🔍 Modo debug activado para móvil');
        try {
          const testResults = await testImageConnectivity();
          console.table(testResults.tests);
        } catch (testError) {
          console.error('❌ Error en test de conectividad:', testError);
        }
      }
      
      try {
        console.log(isMobile ? '📱 Cargando datos en móvil...' : '💻 Cargando datos en desktop...');
        const response = await api.get(`/api/books/${id}`);
        const resolution = response.data && response.data.length > 0 ? response.data[0] : null; 
        
        if (resolution) {
          setResolutionData(resolution);
          console.log('✅ Datos cargados:', resolution);
          
          // Precargar imágenes para móviles
          const images = resolution.images || resolution.Images || [];
          if (images.length > 0 && isMobile) {
            console.log('📱 Precargando', images.length, 'imágenes para móvil...');
            const preloadPromises = images.map(async (img, index) => {
              setImageLoadingStates(prev => ({ ...prev, [index]: true }));
              try {
                console.log(`📷 Precargando imagen ${index + 1}:`, img);
                const preloadedUrl = await preloadImage(img);
                setPreloadedImages(prev => ({ ...prev, [index]: preloadedUrl }));
                setImageLoadingStates(prev => ({ ...prev, [index]: false }));
                console.log(`✅ Imagen ${index + 1} precargada`);
              } catch (error) {
                console.error(`❌ Error precargando imagen ${index + 1}:`, error);
                setImageLoadingStates(prev => ({ ...prev, [index]: false }));
              }
            });
            
            // No bloquear la UI esperando todas las imágenes
            Promise.all(preloadPromises).catch(console.error);
          }
        } else {
          setError('No se encontró la resolución especificada.');
        }
      } catch (err) {
        console.error('❌ Error al cargar la resolución:', err);
        setError('Error al obtener los datos de la resolución. Verifique la conexión o el ID.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, isMobile]);
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
              </Box>              {/* Imágenes */}
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
                      {/* Botón de debug para móviles */}
                      {isMobile && (
                        <Button
                          size="small"
                          variant="outlined"
                          onClick={async () => {
                            console.log('🔍 Ejecutando test de conectividad...');
                            const results = await testImageConnectivity();
                            alert(`Test completado. Ver consola para detalles.\nBackend: ${results.tests.backendHealth?.status || 'Error'}\nImágenes: ${results.tests.imageAccess?.status || 'Error'}`);
                          }}
                          sx={{ ml: 'auto', fontSize: '0.7rem' }}
                        >
                          Debug
                        </Button>
                      )}
                    </Stack>{/* Grid de imágenes */}
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
                              {/* Loading state para móviles */}
                              {imageLoadingStates[index] && isMobile ? (
                                <Box sx={{
                                  display: 'flex',
                                  flexDirection: 'column',
                                  alignItems: 'center',
                                  gap: 2
                                }}>
                                  <CircularProgress size={40} />
                                  <Typography variant="body2" color="text.secondary">
                                    Cargando imagen...
                                  </Typography>
                                </Box>
                              ) : (
                                <img
                                  src={isMobile && preloadedImages[index] ? preloadedImages[index] : getOptimizedImageUrl(img, isMobile ? 'low' : 'medium')}
                                  alt={`Documento ${index + 1}`}
                                  className={isMobile ? 'pinch-zoom-image' : ''}
                                  style={{ 
                                    display: 'block',
                                    maxWidth: '100%',
                                    maxHeight: '100%',
                                    objectFit: 'contain',
                                    // Optimizaciones para móviles
                                    imageRendering: isMobile ? '-webkit-optimize-contrast' : 'auto',
                                    backfaceVisibility: 'hidden',
                                    WebkitBackfaceVisibility: 'hidden'
                                  }}
                                  onError={handleImageError}
                                  loading={isMobile ? "eager" : "lazy"}
                                />
                              )}
                              
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
                              className={isMobile ? "image-action-button" : ""}
                              sx={{ 
                                borderRadius: 2,
                                textTransform: 'none',
                                fontWeight: 600,
                                minHeight: isMobile ? 44 : 'auto'
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
      </Container>      {/* Dialog para vista ampliada de imágenes */}
      <Dialog
        open={imageDialogOpen}
        onClose={handleCloseImageDialog}
        maxWidth="lg"
        fullWidth
        fullScreen={isMobile}
        className={isMobile ? 'mobile-image-modal' : ''}
        sx={{
          '& .MuiDialog-paper': {
            borderRadius: isMobile ? 0 : 2,
            m: isMobile ? 0 : 2,
            bgcolor: 'black'
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
              },
              minHeight: isMobile ? 44 : 'auto',
              minWidth: isMobile ? 44 : 'auto'
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogActions>
        <DialogContent sx={{ 
          p: 0, 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          bgcolor: 'black',
          position: 'relative',
          overflow: 'hidden'
        }}>
          {selectedImage && (
            <img
              src={getImageUrl(selectedImage)}
              alt="Vista ampliada"
              className={isMobile ? 'pinch-zoom-image' : ''}
              style={{
                maxWidth: '100%',
                maxHeight: '100%',
                objectFit: 'contain',
                display: 'block',
                margin: 'auto',
                // Optimizaciones para móviles
                imageRendering: isMobile ? '-webkit-optimize-contrast' : 'auto',
                backfaceVisibility: 'hidden',
                WebkitBackfaceVisibility: 'hidden'
              }}
              onError={handleImageError}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default MostrarLibro;