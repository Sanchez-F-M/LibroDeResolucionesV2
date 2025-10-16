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
        console.error(
          'Error al obtener el próximo número de resolución:',
          error
        );
        setNextResolutionNumber(1);
      }
    };

    fetchNextResolutionNumber();
  }, []);

  const handleFileChange = event => {
    const selectedFiles = Array.from(event.target.files);
    setFiles(prevFiles => [...prevFiles, ...selectedFiles]);

    selectedFiles.forEach(file => {
      const fileUrl = URL.createObjectURL(file);
      setPreviews(prevPreviews => [
        ...prevPreviews,
        {
          url: fileUrl,
          name: file.name,
          type: file.type,
        },
      ]);
    });
  };

  const handleDeleteFile = index => {
    setFiles(prevFiles => prevFiles.filter((_, i) => i !== index));
    setPreviews(prevPreviews => {
      URL.revokeObjectURL(prevPreviews[index].url);
      return prevPreviews.filter((_, i) => i !== index);
    });
  };
  const handleUpload = async () => {
    if (
      files.length === 0 ||
      !nextResolutionNumber ||
      !asunto ||
      !referencia ||
      !fecha
    ) {
      alert(
        'Por favor complete todos los campos y seleccione al menos un archivo.'
      );
      return;
    }

    setIsUploading(true);

    const formData = new FormData();

    files.forEach(file => formData.append('files', file));

    formData.append('NumdeResolucion', nextResolutionNumber);
    formData.append('Asunto', asunto);
    formData.append('Referencia', referencia);
    formData.append('FechaCreacion', fecha.toISOString());

    try {
      const response = await api.post('/api/books', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      if (response.status === 200 || response.status === 201) {
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
        py: { xs: 1.5, sm: 2, md: 2.5 },
        px: { xs: 1, sm: 2 },
        minHeight: 'calc(100vh - 200px)',
      }}
    >
      {/* ✨ Línea decorativa superior institucional */}
      <Box
        sx={{
          height: '4px',
          background:
            'linear-gradient(90deg, #1976d2 0%, #64b5f6 50%, #1976d2 100%)',
          boxShadow: '0 2px 8px rgba(25, 118, 210, 0.5)',
          borderRadius: '4px 4px 0 0',
          mb: 3,
        }}
      />

      <Card
        elevation={8}
        sx={{
          borderRadius: { xs: 2, sm: 3 },
          overflow: 'visible',
          background: theme =>
            theme.palette.mode === 'dark'
              ? 'linear-gradient(135deg, rgba(30,30,30,0.98) 0%, rgba(44,62,80,0.95) 100%)'
              : 'linear-gradient(135deg, rgba(255,255,255,0.98) 0%, rgba(245,247,250,0.95) 100%)',
          border: theme =>
            `2px solid ${
              theme.palette.mode === 'dark'
                ? 'rgba(25, 118, 210, 0.3)'
                : 'rgba(25, 118, 210, 0.2)'
            }`,
          boxShadow:
            '0 8px 32px rgba(25, 118, 210, 0.15), 0 0 0 1px rgba(25, 118, 210, 0.1)',
          transition: 'all 0.3s ease',
          '&:hover': {
            boxShadow: '0 12px 48px rgba(25, 118, 210, 0.25)',
            transform: 'translateY(-2px)',
          },
        }}
      >
        <CardContent
          sx={{
            p: { xs: 2, sm: 3, md: 4 },
          }}
        >
          {/* ✨ Título principal con estilo institucional */}
          <Box
            sx={{
              textAlign: 'center',
              mb: { xs: 3, sm: 4 },
              position: 'relative',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: -20,
                left: '50%',
                transform: 'translateX(-50%)',
                width: '60px',
                height: '4px',
                background: 'linear-gradient(90deg, #1976d2 0%, #64b5f6 100%)',
                borderRadius: '2px',
              },
            }}
          >
            <Typography
              variant={isMobile ? 'h5' : isTablet ? 'h4' : 'h3'}
              sx={{
                color: 'primary.main',
                fontWeight: 700,
                mb: 2,
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                textShadow: theme =>
                  theme.palette.mode === 'dark'
                    ? '0 2px 8px rgba(25, 118, 210, 0.3)'
                    : '0 2px 4px rgba(0,0,0,0.1)',
                background: theme =>
                  theme.palette.mode === 'dark'
                    ? 'linear-gradient(135deg, #1976d2 0%, #64b5f6 100%)'
                    : 'linear-gradient(135deg, #2c3e50 0%, #1976d2 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
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
                background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
                boxShadow: '0 4px 12px rgba(25, 118, 210, 0.3)',
                border: '2px solid rgba(100, 181, 246, 0.3)',
                '& .MuiChip-label': {
                  textShadow: '0 1px 2px rgba(0,0,0,0.2)',
                },
              }}
            />
          </Box>

          {/* Formulario */}
          <Stack spacing={{ xs: 3, sm: 4 }}>
            {/* ✨ Campo Asunto con estilo profesional */}
            <TextField
              label="Asunto"
              variant="outlined"
              fullWidth
              value={asunto}
              onChange={e => setAsunto(e.target.value)}
              size={isMobile ? 'small' : 'medium'}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: { xs: 1, sm: 2 },
                  background: theme =>
                    theme.palette.mode === 'dark'
                      ? 'rgba(25, 118, 210, 0.05)'
                      : 'rgba(255, 255, 255, 0.8)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    background: theme =>
                      theme.palette.mode === 'dark'
                        ? 'rgba(25, 118, 210, 0.08)'
                        : 'rgba(255, 255, 255, 1)',
                    boxShadow: '0 4px 12px rgba(25, 118, 210, 0.15)',
                  },
                  '&.Mui-focused': {
                    boxShadow: '0 0 0 3px rgba(25, 118, 210, 0.2)',
                  },
                },
                '& .MuiInputLabel-root': {
                  fontWeight: 600,
                  '&.Mui-focused': {
                    color: '#1976d2',
                  },
                },
              }}
              multiline
              rows={isMobile ? 2 : 3}
            />

            {/* ✨ Campo Referencia con estilo profesional */}
            <TextField
              label="Referencia"
              variant="outlined"
              fullWidth
              value={referencia}
              onChange={e => setReferencia(e.target.value)}
              size={isMobile ? 'small' : 'medium'}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: { xs: 1, sm: 2 },
                  background: theme =>
                    theme.palette.mode === 'dark'
                      ? 'rgba(25, 118, 210, 0.05)'
                      : 'rgba(255, 255, 255, 0.8)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    background: theme =>
                      theme.palette.mode === 'dark'
                        ? 'rgba(25, 118, 210, 0.08)'
                        : 'rgba(255, 255, 255, 1)',
                    boxShadow: '0 4px 12px rgba(25, 118, 210, 0.15)',
                  },
                  '&.Mui-focused': {
                    boxShadow: '0 0 0 3px rgba(25, 118, 210, 0.2)',
                  },
                },
                '& .MuiInputLabel-root': {
                  fontWeight: 600,
                  '&.Mui-focused': {
                    color: '#1976d2',
                  },
                },
              }}
              multiline
              rows={isMobile ? 2 : 3}
            />

            {/* ✨ Campo Fecha con estilo institucional */}
            <Box>
              <Typography
                variant="h6"
                sx={{
                  mb: 2,
                  fontSize: { xs: '1rem', sm: '1.25rem' },
                  fontWeight: 700,
                  color: 'primary.main',
                  letterSpacing: '0.3px',
                  textTransform: 'uppercase',
                }}
              >
                Fecha de Resolución
              </Typography>
              <Paper
                elevation={3}
                sx={{
                  p: { xs: 2, sm: 3 },
                  borderRadius: { xs: 1, sm: 2 },
                  border: theme =>
                    `2px solid ${
                      theme.palette.mode === 'dark'
                        ? 'rgba(25, 118, 210, 0.3)'
                        : 'rgba(25, 118, 210, 0.2)'
                    }`,
                  background: theme =>
                    theme.palette.mode === 'dark'
                      ? 'rgba(25, 118, 210, 0.05)'
                      : 'rgba(255, 255, 255, 0.9)',
                  boxShadow: '0 4px 12px rgba(25, 118, 210, 0.1)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    boxShadow: '0 6px 20px rgba(25, 118, 210, 0.2)',
                    transform: 'translateY(-2px)',
                  },
                }}
              >
                <DatePicker
                  selected={fecha}
                  onChange={date => setFecha(date)}
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

            {/* ✨ Sección de archivos con diseño institucional */}
            <Box>
              <Typography
                variant={isMobile ? 'h6' : 'h5'}
                sx={{
                  mb: 3,
                  textAlign: 'center',
                  fontWeight: 700,
                  color: 'primary.main',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  position: 'relative',
                  '&::after': {
                    content: '""',
                    position: 'absolute',
                    bottom: -8,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: '80px',
                    height: '3px',
                    background:
                      'linear-gradient(90deg, transparent 0%, #1976d2 50%, transparent 100%)',
                    borderRadius: '2px',
                  },
                }}
              >
                Archivos Adjuntos
              </Typography>

              {/* ✨ Botón de selección de archivos mejorado */}
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  mb: 3,
                }}
              >
                <Paper
                  elevation={4}
                  sx={{
                    p: { xs: 3, sm: 4 },
                    borderRadius: { xs: 2, sm: 3 },
                    border: `3px dashed ${theme.palette.primary.main}`,
                    textAlign: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    background: theme =>
                      theme.palette.mode === 'dark'
                        ? 'rgba(25, 118, 210, 0.05)'
                        : 'rgba(25, 118, 210, 0.02)',
                    boxShadow: '0 4px 20px rgba(25, 118, 210, 0.15)',
                    '&:hover': {
                      backgroundColor: theme =>
                        theme.palette.mode === 'dark'
                          ? 'rgba(25, 118, 210, 0.12)'
                          : 'rgba(25, 118, 210, 0.08)',
                      transform: 'translateY(-4px)',
                      boxShadow: '0 8px 32px rgba(25, 118, 210, 0.25)',
                      borderColor: '#64b5f6',
                    },
                  }}
                  component="label"
                >
                  <CloudUploadIcon
                    sx={{
                      fontSize: { xs: '2.5rem', sm: '3.5rem' },
                      color: 'primary.main',
                      mb: 1,
                      filter: 'drop-shadow(0 2px 8px rgba(25, 118, 210, 0.4))',
                      animation: 'pulse 2s ease-in-out infinite',
                      '@keyframes pulse': {
                        '0%, 100%': {
                          transform: 'scale(1)',
                        },
                        '50%': {
                          transform: 'scale(1.05)',
                        },
                      },
                    }}
                  />
                  <Typography
                    variant="body1"
                    sx={{
                      fontWeight: 700,
                      color: 'primary.main',
                      mb: 1,
                      fontSize: { xs: '1rem', sm: '1.1rem' },
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                    }}
                  >
                    Seleccionar Archivos
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: 'text.secondary',
                      fontWeight: 500,
                      opacity: 0.8,
                    }}
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

              {/* ✨ Vista previa de archivos con diseño mejorado */}
              {previews.length > 0 && (
                <Box sx={{ mb: 3 }}>
                  <Typography
                    variant="h6"
                    sx={{
                      mb: 2,
                      fontSize: { xs: '1rem', sm: '1.25rem' },
                      fontWeight: 700,
                      color: 'primary.main',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                      '&::before': {
                        content: '""',
                        width: '4px',
                        height: '24px',
                        background:
                          'linear-gradient(180deg, #1976d2 0%, #64b5f6 100%)',
                        borderRadius: '2px',
                      },
                    }}
                  >
                    Archivos Seleccionados ({previews.length})
                  </Typography>
                  <Grid container spacing={{ xs: 1, sm: 2 }}>
                    {previews.map((preview, index) => (
                      <Grid item xs={12} sm={6} md={4} key={index}>
                        <Card
                          elevation={6}
                          sx={{
                            borderRadius: { xs: 1, sm: 2 },
                            overflow: 'hidden',
                            border: theme =>
                              `2px solid ${
                                theme.palette.mode === 'dark'
                                  ? 'rgba(25, 118, 210, 0.3)'
                                  : 'rgba(25, 118, 210, 0.2)'
                              }`,
                            transition: 'all 0.3s ease',
                            '&:hover': {
                              transform: 'translateY(-4px)',
                              boxShadow: '0 12px 24px rgba(25, 118, 210, 0.25)',
                              borderColor: '#64b5f6',
                            },
                          }}
                        >
                          {preview.type.startsWith('image/') ? (
                            <CardMedia
                              component="img"
                              height={isMobile ? '150' : '200'}
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

            {/* ✨ Botones de acción con diseño profesional */}
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
                disabled={
                  isUploading ||
                  !asunto ||
                  !referencia ||
                  !fecha ||
                  files.length === 0
                }
                size={isMobile ? 'medium' : 'large'}
                sx={{
                  py: { xs: 1.5, sm: 2 },
                  fontSize: { xs: '1rem', sm: '1.1rem' },
                  fontWeight: 700,
                  borderRadius: { xs: 1, sm: 2 },
                  flex: { sm: 2 },
                  background:
                    'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
                  boxShadow: '0 6px 20px rgba(25, 118, 210, 0.4)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    background:
                      'linear-gradient(135deg, #1565c0 0%, #0d47a1 100%)',
                    boxShadow: '0 8px 28px rgba(25, 118, 210, 0.5)',
                    transform: 'translateY(-2px)',
                  },
                  '&:disabled': {
                    background: 'rgba(0, 0, 0, 0.12)',
                    boxShadow: 'none',
                  },
                }}
              >
                {isUploading
                  ? 'Guardando...'
                  : `Guardar Resolución (${files.length} archivo${
                      files.length !== 1 ? 's' : ''
                    })`}
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
                  fontWeight: 700,
                  borderRadius: { xs: 1, sm: 2 },
                  flex: { sm: 1 },
                  borderWidth: '2px',
                  borderColor: 'primary.main',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    borderWidth: '2px',
                    background: 'rgba(25, 118, 210, 0.08)',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 4px 12px rgba(25, 118, 210, 0.3)',
                  },
                }}
              >
                Volver al Inicio
              </Button>
            </Stack>

            {/* ✨ Información adicional con diseño mejorado */}
            {(!asunto || !referencia || !fecha || files.length === 0) && (
              <Alert
                severity="info"
                sx={{
                  mt: 2,
                  borderRadius: { xs: 1, sm: 2 },
                  border: '2px solid rgba(25, 118, 210, 0.3)',
                  background: theme =>
                    theme.palette.mode === 'dark'
                      ? 'rgba(25, 118, 210, 0.1)'
                      : 'rgba(25, 118, 210, 0.05)',
                  boxShadow: '0 4px 12px rgba(25, 118, 210, 0.15)',
                  '& .MuiAlert-icon': {
                    color: '#1976d2',
                  },
                  '& .MuiAlert-message': {
                    fontWeight: 500,
                  },
                }}
              >
                Complete todos los campos y seleccione al menos un archivo para
                guardar la resolución.
              </Alert>
            )}
          </Stack>
        </CardContent>
      </Card>
    </Container>
  );
};

export default Cargas;
