import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Container,
  Alert,
  Box,
  Paper,
  Stack,
  CircularProgress,
  useMediaQuery,
  useTheme,
  IconButton,
  Divider,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import TagIcon from '@mui/icons-material/Tag';
import DescriptionIcon from '@mui/icons-material/Description';
import api from '../../api/api';

const ModificarResolucion = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    Asunto: '',
    Referencia: '',
    ImagePaths: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Responsive breakpoints
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get(`/api/books/${id}`);
        const resolution = response.data[0];
        if (resolution) {
          setFormData({
            Asunto: resolution.Asunto || resolution.asunto,
            Referencia: resolution.Referencia || resolution.referencia,
            ImagePaths: resolution.images || resolution.Images || [],
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

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  const handleSubmit = async () => {
    setSubmitting(true);
    setError('');
    setSuccess('');

    try {
      // Validar datos antes de enviar
      if (!formData.Asunto.trim() || !formData.Referencia.trim()) {
        setError('Por favor complete todos los campos requeridos');
        setSubmitting(false);
        return;
      }

      const response = await api.put(`/api/books/${id}`, {
        Asunto: formData.Asunto.trim(),
        Referencia: formData.Referencia.trim(),
        ImagePaths: formData.ImagePaths,
      });

      if (response.status === 200) {
        setSuccess('Resolución actualizada exitosamente');
        setTimeout(() => {
          navigate('/buscador');
        }, 2000);
      }
    } catch (err) {
      console.error('Error al actualizar la resolución:', err);
      setError(
        err.response?.data?.error ||
          'Error al actualizar la resolución. Intente nuevamente.'
      );
    } finally {
      setSubmitting(false);
    }
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
          gap: 2,
        }}
      >
        <CircularProgress
          size={60}
          sx={{
            color: '#1976d2',
            filter: 'drop-shadow(0 2px 8px rgba(25, 118, 210, 0.4))',
          }}
        />
        <Typography
          variant="h6"
          sx={{
            color: 'text.secondary',
            fontWeight: 600,
          }}
        >
          Cargando resolución...
        </Typography>
      </Container>
    );
  }

  return (
    <Container
      maxWidth="md"
      sx={{
        mt: { xs: 10, md: 12 },
        mb: { xs: 4, md: 6 },
        px: { xs: 2, sm: 3, md: 4 },
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

      {/* ✨ Header con botón de volver mejorado */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          mb: 3,
          gap: 2,
        }}
      >
        <IconButton
          onClick={() => navigate(-1)}
          sx={{
            p: { xs: 1, sm: 1.5 },
            background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
            color: 'white',
            boxShadow: '0 4px 12px rgba(25, 118, 210, 0.4)',
            transition: 'all 0.3s ease',
            '&:hover': {
              background: 'linear-gradient(135deg, #1565c0 0%, #0d47a1 100%)',
              transform: 'scale(1.1) rotate(-5deg)',
              boxShadow: '0 6px 20px rgba(25, 118, 210, 0.5)',
            },
          }}
        >
          <ArrowBackIcon />
        </IconButton>
        <Typography
          variant={isMobile ? 'h5' : 'h4'}
          sx={{
            fontWeight: 700,
            color: 'primary.main',
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
          Modificar Resolución
        </Typography>
      </Box>

      <Card
        component={Paper}
        elevation={8}
        sx={{
          borderRadius: { xs: 2, md: 3 },
          overflow: 'hidden',
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
        }}
      >
        <CardContent
          sx={{
            p: { xs: 2, sm: 3, md: 4 },
            '&:last-child': { pb: { xs: 2, sm: 3, md: 4 } },
          }}
        >
          <Stack spacing={3}>
            {/* ✨ Número de resolución con diseño institucional */}
            <Box
              sx={{
                textAlign: 'center',
                position: 'relative',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: -16,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: '60px',
                  height: '4px',
                  background:
                    'linear-gradient(90deg, #1976d2 0%, #64b5f6 100%)',
                  borderRadius: '2px',
                },
              }}
            >
              <Stack
                direction="row"
                alignItems="center"
                justifyContent="center"
                spacing={1}
                sx={{ mb: 2 }}
              >
                <TagIcon
                  color="primary"
                  fontSize={isMobile ? 'medium' : 'large'}
                  sx={{
                    filter: 'drop-shadow(0 2px 8px rgba(25, 118, 210, 0.4))',
                  }}
                />
                <Typography
                  variant={isMobile ? 'h6' : 'h5'}
                  sx={{
                    color: 'primary.main',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                  }}
                >
                  Resolución N° {id}
                </Typography>
              </Stack>
            </Box>

            <Divider
              sx={{
                borderColor: 'rgba(25, 118, 210, 0.2)',
                borderWidth: 1,
              }}
            />

            {/* ✨ Alertas con diseño mejorado */}
            {error && (
              <Alert
                severity="error"
                sx={{
                  borderRadius: 2,
                  border: '2px solid rgba(211, 47, 47, 0.3)',
                  boxShadow: '0 4px 12px rgba(211, 47, 47, 0.15)',
                  fontWeight: 500,
                }}
              >
                {error}
              </Alert>
            )}

            {success && (
              <Alert
                severity="success"
                sx={{
                  borderRadius: 2,
                  border: '2px solid rgba(46, 125, 50, 0.3)',
                  boxShadow: '0 4px 12px rgba(46, 125, 50, 0.15)',
                  fontWeight: 500,
                }}
              >
                {success}
              </Alert>
            )}

            {/* ✨ Formulario con diseño profesional */}
            <Stack spacing={3}>
              {/* ✨ Campo Asunto mejorado */}
              <Box>
                <Stack
                  direction="row"
                  alignItems="center"
                  spacing={1}
                  sx={{ mb: 2 }}
                >
                  <DescriptionIcon
                    color="primary"
                    fontSize="medium"
                    sx={{
                      filter: 'drop-shadow(0 2px 8px rgba(25, 118, 210, 0.4))',
                    }}
                  />
                  <Typography
                    variant="h6"
                    sx={{
                      color: 'primary.main',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      letterSpacing: '0.3px',
                    }}
                  >
                    Asunto
                  </Typography>
                </Stack>
                <TextField
                  fullWidth
                  name="Asunto"
                  value={formData.Asunto}
                  onChange={handleChange}
                  variant="outlined"
                  placeholder="Ingrese el asunto de la resolución"
                  error={!formData.Asunto.trim()}
                  helperText={
                    !formData.Asunto.trim() ? 'El asunto es requerido' : ''
                  }
                  multiline
                  rows={isMobile ? 3 : 4}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      fontSize: { xs: '0.9rem', sm: '1rem' },
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
                  disabled={submitting}
                />
              </Box>

              {/* ✨ Campo Referencia mejorado */}
              <Box>
                <Stack
                  direction="row"
                  alignItems="center"
                  spacing={1}
                  sx={{ mb: 2 }}
                >
                  <DescriptionIcon
                    color="primary"
                    fontSize="medium"
                    sx={{
                      filter: 'drop-shadow(0 2px 8px rgba(25, 118, 210, 0.4))',
                    }}
                  />
                  <Typography
                    variant="h6"
                    sx={{
                      color: 'primary.main',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      letterSpacing: '0.3px',
                    }}
                  >
                    Referencia
                  </Typography>
                </Stack>
                <TextField
                  fullWidth
                  name="Referencia"
                  value={formData.Referencia}
                  onChange={handleChange}
                  variant="outlined"
                  placeholder="Ingrese la referencia de la resolución"
                  error={!formData.Referencia.trim()}
                  helperText={
                    !formData.Referencia.trim()
                      ? 'La referencia es requerida'
                      : ''
                  }
                  multiline
                  rows={isMobile ? 3 : 4}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      fontSize: { xs: '0.9rem', sm: '1rem' },
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
                  disabled={submitting}
                />
              </Box>

              <Divider
                sx={{
                  borderColor: 'rgba(25, 118, 210, 0.2)',
                  borderWidth: 1,
                }}
              />

              {/* ✨ Botones de acción con diseño profesional */}
              <Stack
                direction={{ xs: 'column', sm: 'row' }}
                spacing={2}
                sx={{ mt: 3 }}
              >
                <Button
                  variant="outlined"
                  onClick={() => navigate(-1)}
                  fullWidth={isMobile}
                  size={isMobile ? 'large' : 'large'}
                  sx={{
                    borderRadius: 2,
                    textTransform: 'uppercase',
                    fontWeight: 700,
                    py: { xs: 1.5, sm: 1.5 },
                    borderWidth: '2px',
                    letterSpacing: '0.5px',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      borderWidth: '2px',
                      background: 'rgba(25, 118, 210, 0.08)',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 4px 12px rgba(25, 118, 210, 0.3)',
                    },
                  }}
                  disabled={submitting}
                >
                  Cancelar
                </Button>

                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleSubmit}
                  disabled={
                    !formData.Asunto.trim() ||
                    !formData.Referencia.trim() ||
                    submitting
                  }
                  fullWidth={isMobile}
                  size={isMobile ? 'large' : 'large'}
                  startIcon={
                    submitting ? (
                      <CircularProgress size={20} color="inherit" />
                    ) : (
                      <SaveIcon />
                    )
                  }
                  sx={{
                    borderRadius: 2,
                    textTransform: 'uppercase',
                    fontWeight: 700,
                    py: { xs: 1.5, sm: 1.5 },
                    letterSpacing: '0.5px',
                    background:
                      'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
                    boxShadow: '0 4px 12px rgba(25, 118, 210, 0.4)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      background:
                        'linear-gradient(135deg, #1565c0 0%, #0d47a1 100%)',
                      transform: submitting ? 'none' : 'translateY(-2px)',
                      boxShadow: '0 6px 20px rgba(25, 118, 210, 0.6)',
                    },
                    '&:disabled': {
                      background:
                        'linear-gradient(135deg, rgba(25, 118, 210, 0.3) 0%, rgba(21, 101, 192, 0.3) 100%)',
                      color: 'rgba(255, 255, 255, 0.5)',
                    },
                  }}
                >
                  {submitting ? 'Guardando...' : 'Guardar Cambios'}
                </Button>
              </Stack>
            </Stack>
          </Stack>
        </CardContent>
      </Card>
    </Container>
  );
};

export default ModificarResolucion;
