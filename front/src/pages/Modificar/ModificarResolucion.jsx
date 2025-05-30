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
  Divider
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
    ImagePaths: []
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
        ImagePaths: formData.ImagePaths
      });

      if (response.status === 200) {
        setSuccess('Resolución actualizada exitosamente');
        setTimeout(() => {
          navigate('/buscador');
        }, 2000);
      }
    } catch (err) {
      console.error('Error al actualizar la resolución:', err);
      setError(err.response?.data?.error || 'Error al actualizar la resolución. Intente nuevamente.');
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

  return (
    <Container maxWidth="md" sx={{ 
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
          Modificar Resolución
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
          <Stack spacing={3}>
            {/* Número de resolución */}
            <Box sx={{ textAlign: 'center' }}>
              <Stack direction="row" alignItems="center" justifyContent="center" spacing={1} sx={{ mb: 2 }}>
                <TagIcon color="primary" fontSize={isMobile ? "medium" : "large"} />
                <Typography 
                  variant={isMobile ? "h6" : "h5"} 
                  color="primary" 
                  fontWeight="bold"
                >
                  Resolución N° {id}
                </Typography>
              </Stack>
            </Box>

            <Divider />

            {/* Alertas */}
            {error && (
              <Alert severity="error" sx={{ borderRadius: 2 }}>
                {error}
              </Alert>
            )}

            {success && (
              <Alert severity="success" sx={{ borderRadius: 2 }}>
                {success}
              </Alert>
            )}

            {/* Formulario */}
            <Stack spacing={3}>
              {/* Campo Asunto */}
              <Box>
                <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
                  <DescriptionIcon color="primary" fontSize="medium" />
                  <Typography 
                    variant="h6" 
                    color="primary" 
                    fontWeight="bold"
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
                  helperText={!formData.Asunto.trim() ? 'El asunto es requerido' : ''}
                  multiline
                  rows={isMobile ? 3 : 4}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      fontSize: { xs: '0.9rem', sm: '1rem' }
                    }
                  }}
                  disabled={submitting}
                />
              </Box>

              {/* Campo Referencia */}
              <Box>
                <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
                  <DescriptionIcon color="primary" fontSize="medium" />
                  <Typography 
                    variant="h6" 
                    color="primary" 
                    fontWeight="bold"
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
                  helperText={!formData.Referencia.trim() ? 'La referencia es requerida' : ''}
                  multiline
                  rows={isMobile ? 3 : 4}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      fontSize: { xs: '0.9rem', sm: '1rem' }
                    }
                  }}
                  disabled={submitting}
                />
              </Box>

              <Divider />

              {/* Botones de acción */}
              <Stack 
                direction={{ xs: 'column', sm: 'row' }} 
                spacing={2} 
                sx={{ mt: 3 }}
              >
                <Button
                  variant="outlined"
                  onClick={() => navigate(-1)}
                  fullWidth={isMobile}
                  size={isMobile ? "large" : "large"}
                  sx={{ 
                    borderRadius: 2,
                    textTransform: 'none',
                    fontWeight: 600,
                    py: { xs: 1.5, sm: 1.5 }
                  }}
                  disabled={submitting}
                >
                  Cancelar
                </Button>

                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleSubmit}
                  disabled={!formData.Asunto.trim() || !formData.Referencia.trim() || submitting}
                  fullWidth={isMobile}
                  size={isMobile ? "large" : "large"}
                  startIcon={submitting ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
                  sx={{ 
                    borderRadius: 2,
                    textTransform: 'none',
                    fontWeight: 'bold',
                    py: { xs: 1.5, sm: 1.5 },
                    boxShadow: theme.shadows[4],
                    '&:hover': {
                      boxShadow: theme.shadows[8],
                      transform: submitting ? 'none' : 'translateY(-2px)'
                    },
                    '&:disabled': {
                      bgcolor: 'action.disabledBackground'
                    }
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
