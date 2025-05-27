import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  TextField,
  CardMedia,
  Input,
  Fab,
  IconButton,
  Container,
  Box,
  Stack,
  Chip,
  Paper,
  Alert,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import ImageIcon from '@mui/icons-material/Image';
import DescriptionIcon from '@mui/icons-material/Description';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import api from '../../api/api';

const Cargas = () => {
  const [files, setFiles] = useState([]);
  const [asunto, setAsunto] = useState('');
  const [referencia, setReferencia] = useState('');
  const [previews, setPreviews] = useState([]);
  const [nextResolutionNumber, setNextResolutionNumber] = useState(null);
  const [fecha, setFecha] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  useEffect(() => {
    const fetchNextResolutionNumber = async () => {
      try {
        const response = await api.get('/api/books/last-number');
        console.log('Respuesta del servidor:', response.data);
        
        const nextNumber = response.data.lastNumber; // El servidor ya devuelve el siguiente número disponible
        console.log('Próximo número disponible:', nextNumber); 
        
        if (nextNumber) {
          setNextResolutionNumber(nextNumber);
        } else {
          console.error('No se recibió un número válido del servidor');
          setNextResolutionNumber(1); 
        }
      } catch (error) {
        console.error('Error al obtener el próximo número de resolución:', error);
        setNextResolutionNumber(1); 
      }
    };

    fetchNextResolutionNumber();
  }, []);

  const handleFileChange = (event) => {
    const selectedFiles = Array.from(event.target.files);
    setFiles((prevFiles) => [...prevFiles, ...selectedFiles]);

    selectedFiles.forEach((file) => {
      const fileUrl = URL.createObjectURL(file);
      setPreviews((prevPreviews) => [
        ...prevPreviews,
        {
          url: fileUrl,
          name: file.name,
          type: file.type,
        },
      ]);
    });
  };

  const handleDeleteFile = (index) => {
    setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
    setPreviews((prevPreviews) => {
      URL.revokeObjectURL(prevPreviews[index].url);
      return prevPreviews.filter((_, i) => i !== index);
    });
  };
  const handleUpload = async () => {
    if (files.length === 0 || !nextResolutionNumber || !asunto || !referencia || !fecha) {
      alert('Por favor complete todos los campos y seleccione al menos un archivo.');
      return;
    }

    setIsUploading(true);

    const formData = new FormData();

    files.forEach((file) => formData.append('files', file));

    formData.append('NumdeResolucion', nextResolutionNumber);
    formData.append('Asunto', asunto);
    formData.append('Referencia', referencia);
    formData.append('FechaCreacion', fecha.toISOString());

    try {
      const response = await api.post('/api/books', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });      if (response.status === 200 || response.status === 201) {
        setFiles([]);
        setAsunto('');
        setReferencia('');
        setFecha(null);
        setPreviews([]);
        alert('Resolución cargada exitosamente.');
        
        // Obtener el próximo número disponible (el servidor ya devuelve el siguiente número)
        const nextResponse = await api.get('/api/books/last-number');
        setNextResolutionNumber(nextResponse.data.lastNumber);
      }
    } catch (error) {
      console.error('Error al cargar la resolución:', error);
      alert('Error al cargar la resolución. Inténtelo nuevamente.');
    } finally {
      setIsUploading(false);
    }
  };

  const renderPreview = (preview, index) => {
    if (preview.type.startsWith('image/')) {
      return (
        <CardMedia
          component="img"
          height="200"
          image={preview.url}
          alt={`Previsualización ${index + 1}`}
        />
      );
    } else {
      return (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: 150,
            bgcolor: 'grey.200',
          }}
        >
          <Typography variant="body1">{preview.name}</Typography>
        </Box>
      );
    }
  };
  return (
    <Container 
      maxWidth="lg" 
      sx={{ 
        py: { xs: 2, sm: 3, md: 4 },
        px: { xs: 1, sm: 2 },
        minHeight: 'calc(100vh - 200px)',
      }}
    >
      <Card 
        elevation={4}
        sx={{
          borderRadius: { xs: 2, sm: 3 },
          overflow: 'visible',
        }}
      >
        <CardContent
          sx={{
            p: { xs: 2, sm: 3, md: 4 },
          }}
        >
          {/* Título principal */}
          <Box sx={{ textAlign: 'center', mb: { xs: 3, sm: 4 } }}>
            <Typography
              variant={isMobile ? 'h5' : isTablet ? 'h4' : 'h3'}
              sx={{ 
                color: 'primary.main', 
                fontWeight: 'bold',
                mb: 2,
              }}
            >
              Nueva Resolución
            </Typography>
            <Chip 
              label={`N° ${nextResolutionNumber || '...'}`}
              color="primary"
              size={isMobile ? 'medium' : 'large'}
              sx={{
                fontSize: { xs: '1rem', sm: '1.2rem' },
                fontWeight: 'bold',
                px: { xs: 2, sm: 3 },
              }}
            />
          </Box>

          {/* Formulario */}
          <Stack spacing={{ xs: 3, sm: 4 }}>
            {/* Campo Asunto */}
            <TextField
              label="Asunto"
              variant="outlined"
              fullWidth
              value={asunto}
              onChange={(e) => setAsunto(e.target.value)}
              size={isMobile ? 'small' : 'medium'}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: { xs: 1, sm: 2 },
                },
              }}
              multiline
              rows={isMobile ? 2 : 3}
            />

            {/* Campo Referencia */}
            <TextField
              label="Referencia"
              variant="outlined"
              fullWidth
              value={referencia}
              onChange={(e) => setReferencia(e.target.value)}
              size={isMobile ? 'small' : 'medium'}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: { xs: 1, sm: 2 },
                },
              }}
              multiline
              rows={isMobile ? 2 : 3}
            />

            {/* Campo Fecha */}
            <Box>
              <Typography 
                variant="h6" 
                sx={{ 
                  mb: 2,
                  fontSize: { xs: '1rem', sm: '1.25rem' },
                  fontWeight: 'bold',
                }}
              >
                Fecha de Resolución
              </Typography>
              <Paper
                elevation={1}
                sx={{
                  p: { xs: 2, sm: 3 },
                  borderRadius: { xs: 1, sm: 2 },
                  border: `1px solid ${theme.palette.divider}`,
                }}
              >
                <DatePicker
                  selected={fecha}
                  onChange={(date) => setFecha(date)}
                  dateFormat="dd/MM/yyyy"
                  className="form-control"
                  placeholderText="Seleccione una fecha"
                  style={{ 
                    width: '100%',
                    padding: isMobile ? '8px' : '12px',
                    fontSize: isMobile ? '14px' : '16px',
                  }}
                />
              </Paper>
            </Box>

            {/* Sección de archivos */}
            <Box>
              <Typography
                variant={isMobile ? 'h6' : 'h5'}
                sx={{ 
                  mb: 3,
                  textAlign: 'center',
                  fontWeight: 'bold',
                }}
              >
                Archivos Adjuntos
              </Typography>

              {/* Botón de selección de archivos */}
              <Box 
                sx={{ 
                  display: 'flex', 
                  justifyContent: 'center', 
                  mb: 3,
                }}
              >
                <Paper
                  elevation={2}
                  sx={{
                    p: { xs: 3, sm: 4 },
                    borderRadius: { xs: 2, sm: 3 },
                    border: `2px dashed ${theme.palette.primary.main}`,
                    textAlign: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      backgroundColor: theme.palette.primary.main + '10',
                      transform: 'translateY(-2px)',
                    },
                  }}
                  component="label"
                >
                  <CloudUploadIcon 
                    sx={{ 
                      fontSize: { xs: '2rem', sm: '3rem' },
                      color: 'primary.main',
                      mb: 1,
                    }} 
                  />
                  <Typography 
                    variant="body1" 
                    sx={{ 
                      fontWeight: 'bold',
                      color: 'primary.main',
                      mb: 1,
                    }}
                  >
                    Seleccionar Archivos
                  </Typography>
                  <Typography 
                    variant="body2" 
                    color="text.secondary"
                  >
                    Haga clic para seleccionar imágenes o documentos
                  </Typography>
                  <Input
                    type="file"
                    multiple
                    onChange={handleFileChange}
                    sx={{ display: 'none' }}
                    accept="image/*,.pdf,.doc,.docx"
                  />
                </Paper>
              </Box>

              {/* Vista previa de archivos */}
              {previews.length > 0 && (
                <Box sx={{ mb: 3 }}>
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      mb: 2,
                      fontSize: { xs: '1rem', sm: '1.25rem' },
                    }}
                  >
                    Archivos Seleccionados ({previews.length})
                  </Typography>
                  <Grid container spacing={{ xs: 1, sm: 2 }}>
                    {previews.map((preview, index) => (
                      <Grid item xs={12} sm={6} md={4} key={index}>
                        <Card 
                          elevation={3}
                          sx={{
                            borderRadius: { xs: 1, sm: 2 },
                            overflow: 'hidden',
                          }}
                        >
                          {preview.type.startsWith('image/') ? (
                            <CardMedia
                              component="img"
                              height={isMobile ? "150" : "200"}
                              image={preview.url}
                              alt={`Previsualización ${index + 1}`}
                              sx={{ objectFit: 'cover' }}
                            />
                          ) : (
                            <Box
                              sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                height: { xs: 120, sm: 150 },
                                bgcolor: 'grey.100',
                                p: 2,
                              }}
                            >
                              <DescriptionIcon 
                                sx={{ 
                                  fontSize: { xs: '2rem', sm: '3rem' },
                                  color: 'text.secondary',
                                  mb: 1,
                                }} 
                              />
                              <Typography 
                                variant="body2" 
                                textAlign="center"
                                sx={{
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                  whiteSpace: 'nowrap',
                                  maxWidth: '100%',
                                }}
                              >
                                {preview.name}
                              </Typography>
                            </Box>
                          )}
                          <Box
                            sx={{
                              p: { xs: 1, sm: 2 },
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              bgcolor: 'background.paper',
                            }}
                          >
                            <Typography 
                              variant="body2" 
                              sx={{
                                flex: 1,
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                                fontSize: { xs: '0.75rem', sm: '0.875rem' },
                              }}
                            >
                              {preview.name}
                            </Typography>
                            <IconButton
                              onClick={() => handleDeleteFile(index)}
                              color="error"
                              size={isMobile ? 'small' : 'medium'}
                              sx={{ ml: 1 }}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </Box>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                </Box>
              )}
            </Box>

            {/* Botones de acción */}
            <Stack 
              direction={{ xs: 'column', sm: 'row' }}
              spacing={{ xs: 2, sm: 3 }}
              sx={{ pt: 2 }}
            >
              <Button
                variant="contained"
                color="primary"
                fullWidth={isMobile}
                onClick={handleUpload}
                disabled={isUploading || !asunto || !referencia || !fecha || files.length === 0}
                size={isMobile ? 'medium' : 'large'}
                sx={{
                  py: { xs: 1.5, sm: 2 },
                  fontSize: { xs: '1rem', sm: '1.1rem' },
                  fontWeight: 'bold',
                  borderRadius: { xs: 1, sm: 2 },
                  flex: { sm: 2 },
                }}
              >
                {isUploading ? 'Guardando...' : `Guardar Resolución (${files.length} archivo${files.length !== 1 ? 's' : ''})`}
              </Button>

              <Button
                component={Link}
                to="/home"
                variant="outlined"
                color="primary"
                startIcon={<ArrowBackIcon />}
                fullWidth={isMobile}
                size={isMobile ? 'medium' : 'large'}
                sx={{
                  py: { xs: 1.5, sm: 2 },
                  fontSize: { xs: '1rem', sm: '1.1rem' },
                  fontWeight: 'bold',
                  borderRadius: { xs: 1, sm: 2 },
                  flex: { sm: 1 },
                }}
              >
                Volver al Inicio
              </Button>
            </Stack>

            {/* Información adicional */}
            {(!asunto || !referencia || !fecha || files.length === 0) && (
              <Alert 
                severity="info" 
                sx={{ 
                  mt: 2,
                  borderRadius: { xs: 1, sm: 2 },
                }}
              >
                Complete todos los campos y seleccione al menos un archivo para guardar la resolución.
              </Alert>
            )}
          </Stack>
        </CardContent>
      </Card>
    </Container>
  );
};

export default Cargas;
