import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  TextField,
  Button,
  Card,
  CardContent,
  Typography,
  Grid,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Container,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CardMedia,
  useMediaQuery,
  Box,
  IconButton,
  Stack,
  Chip,
  CircularProgress,
  Alert,
  Divider,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CloseIcon from '@mui/icons-material/Close';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import { useTheme } from '@mui/material/styles';
import api from '../../api/api';
import {
  getImageUrl,
  handleImageError,
  preloadImage,
  getOptimizedImageUrl,
} from '../../utils/imageUtils';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import {
  formatearFechaCorta,
  formatearFechaLarga,
  debugFecha,
} from '../../utils/fechaUtils';

const Busquedas = () => {
  const [searchValue, setSearchValue] = useState('');
  const [criterion, setCriterion] = useState('Asunto');
  const [results, setResults] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedResolution, setSelectedResolution] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isShowingAll, setIsShowingAll] = useState(false);
  const navigate = useNavigate();

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md')); // Cargar todas las resoluciones al inicio
  const loadAllResolutions = async () => {
    try {
      setLoading(true);
      setError(null);
      setIsShowingAll(true);
      console.log('📚 Cargando todas las resoluciones...');
      const response = await api.get('/api/books/all');
      console.log('✅ Resoluciones obtenidas:', response.data.length);

      // Debug de fechas
      if (response.data.length > 0) {
        console.log('🐛 Debuggeando primera resolución:');
        console.log('🔍 Ejemplo de resolución:', response.data[0]);
        console.log(
          '🔍 Propiedades disponibles:',
          Object.keys(response.data[0])
        );
        debugFecha(response.data[0].fetcha_creacion, 'primera resolución');
      }

      // Ordenar las resoluciones por fecha de creación (más recientes primero)
      const sortedResults = response.data.sort((a, b) => {
        const dateA = a.fetcha_creacion
          ? new Date(a.fetcha_creacion)
          : new Date(0);
        const dateB = b.fetcha_creacion
          ? new Date(b.fetcha_creacion)
          : new Date(0);
        return dateB - dateA; // Orden descendente (más recientes primero)
      });

      setResults(sortedResults);
    } catch (err) {
      console.error('❌ Error al cargar resoluciones:', err);
      setError('Error al cargar las resoluciones. Verifique la conexión.');
      setResults([]);
    } finally {
      setLoading(false);
    }
  };
  // Función de búsqueda específica
  const handleSearch = async () => {
    if (!searchValue.trim()) {
      // Si no hay criterio de búsqueda, mostrar todas las resoluciones
      await loadAllResolutions();
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setIsShowingAll(false);
      console.log(`🔍 Buscando: "${searchValue}" en ${criterion}`);

      const response = await api.post('/api/search', {
        criterion,
        value: searchValue,
      });

      console.log('📋 Resultados de búsqueda:', response.data.length);
      if (response.data.length > 0) {
        console.log('🔍 Ejemplo de resolución encontrada:', response.data[0]);
        console.log(
          '🔍 Propiedades disponibles:',
          Object.keys(response.data[0])
        );
      }
      setResults(response.data);

      if (response.data.length === 0) {
        setError(
          'No se encontraron resoluciones que coincidan con la búsqueda.'
        );
      }
    } catch (err) {
      console.error('❌ Error en la búsqueda:', err);
      setError('Error al realizar la búsqueda.');
      setResults([]);
    } finally {
      setLoading(false);
    }
  };
  // Cargar todas las resoluciones al montar el componente
  React.useEffect(() => {
    // Inicialmente no cargar nada, esperar a que el usuario haga una acción
    setResults([]);
    setLoading(false);
  }, []);

  const handleRowClick = async id => {
    try {
      console.log('ID de la resolución:', id);

      const response = await api.get(`/api/books/${id}`);

      const resolution =
        response.data && response.data.length > 0 ? response.data[0] : null;
      if (resolution) {
        setSelectedResolution(resolution);
        setOpenDialog(true);
      } else {
        console.error('No se encontró la resolución con id:', id);
        alert('No se pudo obtener la información detallada de la resolución.');
      }
    } catch (error) {
      console.error('Error al obtener la resolución:', error);
      alert('Error al obtener la información de la resolución');
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedResolution(null);
  };

  const handleNavigateToShow = id => {
    navigate(`/mostrar/${id}`);
  };

  const handleNavigateToModify = id => {
    navigate(`/modificar/${id}`);
  };

  return (
    <Container
      maxWidth="xl"
      sx={{
        py: { xs: 1.5, sm: 2, md: 2 },
        px: { xs: 1, sm: 2, md: 3 },
        minHeight: 'calc(100vh - 200px)',
        mt: { xs: 1.5, sm: 2, md: 2.5 },
        mb: { xs: 1, sm: 1.5, md: 1 },
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
        }}
      >
        <CardContent
          sx={{
            p: { xs: 2, sm: 3, md: 4 },
          }}
        >
          {/* ✨ Título con estilo institucional */}
          <Typography
            variant={isMobile ? 'h5' : isTablet ? 'h4' : 'h3'}
            sx={{
              mb: { xs: 3, sm: 4 },
              fontWeight: 700,
              color: 'primary.main',
              textAlign: { xs: 'center', sm: 'left' },
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              position: 'relative',
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
              '&::after': {
                content: '""',
                position: 'absolute',
                bottom: -8,
                left: { xs: '50%', sm: 0 },
                transform: { xs: 'translateX(-50%)', sm: 'none' },
                width: { xs: '100px', sm: '120px' },
                height: '4px',
                background:
                  'linear-gradient(90deg, #1976d2 0%, transparent 100%)',
                borderRadius: '2px',
              },
            }}
          >
            Buscar Resolución
          </Typography>

          {/* ✨ Campo de búsqueda con diseño profesional */}
          <Box sx={{ mb: { xs: 3, sm: 4 } }}>
            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              spacing={{ xs: 2, sm: 2 }}
              alignItems={{ xs: 'stretch', sm: 'flex-end' }}
            >
              <TextField
                fullWidth
                value={searchValue}
                onChange={e => setSearchValue(e.target.value)}
                label="Ingrese el término de búsqueda"
                variant="outlined"
                size={isMobile ? 'small' : 'medium'}
                sx={{
                  flex: 1,
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
              />
              <Button
                variant="contained"
                color="primary"
                onClick={handleSearch}
                size={isMobile ? 'medium' : 'large'}
                disabled={loading}
                sx={{
                  minWidth: { xs: '100%', sm: '120px' },
                  py: { xs: 1.5, sm: 1.8 },
                  borderRadius: { xs: 1, sm: 2 },
                  fontWeight: 700,
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
                {loading ? 'Buscando...' : 'Buscar'}
              </Button>
              <Button
                variant="outlined"
                color="primary"
                onClick={loadAllResolutions}
                size={isMobile ? 'medium' : 'large'}
                disabled={loading}
                sx={{
                  minWidth: { xs: '100%', sm: '140px' },
                  py: { xs: 1.5, sm: 1.8 },
                  borderRadius: { xs: 1, sm: 2 },
                  fontWeight: 700,
                  borderWidth: '2px',
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
                {loading ? 'Cargando...' : 'Mostrar Todas'}
              </Button>
            </Stack>
          </Box>

          {/* ✨ Criterios de búsqueda con estilo mejorado */}
          <Box sx={{ mb: { xs: 3, sm: 4 } }}>
            <FormControl component="fieldset">
              <FormLabel
                component="legend"
                sx={{
                  fontSize: { xs: '0.9rem', sm: '1rem' },
                  mb: { xs: 1, sm: 2 },
                  fontWeight: 700,
                  color: 'primary.main',
                  textTransform: 'uppercase',
                  letterSpacing: '0.3px',
                  '&.Mui-focused': {
                    color: '#1976d2',
                  },
                }}
              >
                Criterio de búsqueda
              </FormLabel>
              <RadioGroup
                row={!isMobile}
                value={criterion}
                onChange={e => setCriterion(e.target.value)}
                sx={{
                  '& .MuiFormControlLabel-root': {
                    mb: { xs: 1, sm: 0 },
                    mr: { xs: 0, sm: 3 },
                  },
                }}
              >
                <FormControlLabel
                  value="Asunto"
                  control={<Radio size={isMobile ? 'small' : 'medium'} />}
                  label="Asunto"
                />
                <FormControlLabel
                  value="Referencia"
                  control={<Radio size={isMobile ? 'small' : 'medium'} />}
                  label="Referencia"
                />
                <FormControlLabel
                  value="NumdeResolucion"
                  control={<Radio size={isMobile ? 'small' : 'medium'} />}
                  label="Nro Resolución"
                />
              </RadioGroup>
            </FormControl>{' '}
          </Box>

          {/* ✨ Estado de carga con diseño mejorado */}
          {loading && (
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                py: 4,
                gap: 2,
                background: theme =>
                  theme.palette.mode === 'dark'
                    ? 'rgba(25, 118, 210, 0.05)'
                    : 'rgba(25, 118, 210, 0.02)',
                borderRadius: 2,
                border: theme =>
                  `2px dashed ${
                    theme.palette.mode === 'dark'
                      ? 'rgba(25, 118, 210, 0.3)'
                      : 'rgba(25, 118, 210, 0.2)'
                  }`,
              }}
            >
              <CircularProgress
                size={40}
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
                Cargando resoluciones...
              </Typography>
            </Box>
          )}

          {error && (
            <Alert
              severity="error"
              sx={{
                mb: 3,
                borderRadius: { xs: 1, sm: 2 },
                border: '2px solid rgba(211, 47, 47, 0.3)',
                boxShadow: '0 4px 12px rgba(211, 47, 47, 0.15)',
                fontWeight: 500,
              }}
            >
              {error}
            </Alert>
          )}

          {/* ✨ Resultados de la búsqueda con diseño profesional */}
          {!loading && !error && results.length > 0 && (
            <Box sx={{ mt: { xs: 2, sm: 3 } }}>
              {/* ✨ Contador de resultados mejorado */}
              <Box sx={{ mb: 2 }}>
                <Divider
                  sx={{
                    borderColor: 'rgba(25, 118, 210, 0.2)',
                    borderWidth: 1,
                  }}
                />
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    py: 2,
                    px: 1,
                    background: theme =>
                      theme.palette.mode === 'dark'
                        ? 'rgba(25, 118, 210, 0.05)'
                        : 'rgba(25, 118, 210, 0.02)',
                    borderRadius: 1,
                  }}
                >
                  <Typography
                    variant={isMobile ? 'h6' : 'h5'}
                    sx={{
                      color: 'primary.main',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                    }}
                  >
                    {isShowingAll
                      ? 'Resoluciones Encontradas'
                      : 'Resultados de Búsqueda'}
                  </Typography>
                  <Chip
                    label={`${results.length} resultado${
                      results.length !== 1 ? 's' : ''
                    }`}
                    color="primary"
                    variant="filled"
                    size={isMobile ? 'small' : 'medium'}
                    sx={{
                      fontWeight: 700,
                      background:
                        'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
                      boxShadow: '0 4px 12px rgba(25, 118, 210, 0.3)',
                      border: '2px solid rgba(100, 181, 246, 0.3)',
                    }}
                  />
                </Box>
                <Divider
                  sx={{
                    borderColor: 'rgba(25, 118, 210, 0.2)',
                    borderWidth: 1,
                  }}
                />
              </Box>

              {isMobile ? (
                // ✨ Vista de cards para móviles con diseño mejorado
                <Stack spacing={2}>
                  {results.map(resolution => (
                    <Card
                      key={resolution.NumdeResolucion}
                      elevation={4}
                      sx={{
                        cursor: 'pointer',
                        border: theme =>
                          `2px solid ${
                            theme.palette.mode === 'dark'
                              ? 'rgba(25, 118, 210, 0.3)'
                              : 'rgba(25, 118, 210, 0.2)'
                          }`,
                        background: theme =>
                          theme.palette.mode === 'dark'
                            ? 'rgba(30,30,30,0.95)'
                            : 'rgba(255,255,255,0.95)',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          elevation: 8,
                          transform: 'translateY(-4px)',
                          boxShadow: '0 12px 24px rgba(25, 118, 210, 0.25)',
                          borderColor: '#64b5f6',
                        },
                      }}
                      onClick={() => handleRowClick(resolution.NumdeResolucion)}
                    >
                      <CardContent sx={{ p: 2 }}>
                        <Typography
                          variant="h6"
                          gutterBottom
                          sx={{
                            color: 'primary.main',
                            fontWeight: 700,
                            textTransform: 'uppercase',
                            letterSpacing: '0.5px',
                          }}
                        >
                          N° {resolution.NumdeResolucion}
                        </Typography>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ mb: 1 }}
                        >
                          <strong>Asunto:</strong>{' '}
                          {resolution.Asunto ||
                            resolution.asunto ||
                            'No disponible'}
                        </Typography>{' '}
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ mb: 2 }}
                        >
                          <strong>Referencia:</strong>{' '}
                          {resolution.Referencia ||
                            resolution.referencia ||
                            'No disponible'}
                        </Typography>{' '}
                        <Box sx={{ mb: 2 }}>
                          <Chip
                            icon={<CalendarTodayIcon />}
                            label={formatearFechaCorta(
                              resolution.fetcha_creacion
                            )}
                            variant="outlined"
                            color="info"
                            size="small"
                          />
                        </Box>
                        <Stack direction="row" spacing={1}>
                          <Button
                            variant="contained"
                            size="small"
                            startIcon={<EditIcon />}
                            onClick={e => {
                              e.stopPropagation();
                              handleNavigateToModify(
                                resolution.NumdeResolucion
                              );
                            }}
                            sx={{ flex: 1 }}
                          >
                            Modificar
                          </Button>
                          <Button
                            variant="outlined"
                            size="small"
                            startIcon={<VisibilityIcon />}
                            onClick={e => {
                              e.stopPropagation();
                              handleNavigateToShow(resolution.NumdeResolucion);
                            }}
                            sx={{ flex: 1 }}
                          >
                            Ver
                          </Button>
                        </Stack>
                      </CardContent>
                    </Card>
                  ))}
                </Stack>
              ) : (
                // ✨ Vista de tabla para tablets y desktop con diseño profesional
                <TableContainer
                  component={Paper}
                  elevation={6}
                  sx={{
                    border: theme =>
                      `2px solid ${
                        theme.palette.mode === 'dark'
                          ? 'rgba(25, 118, 210, 0.3)'
                          : 'rgba(25, 118, 210, 0.2)'
                      }`,
                    borderRadius: 2,
                    overflow: 'hidden',
                    boxShadow: '0 8px 24px rgba(25, 118, 210, 0.15)',
                  }}
                >
                  <Table stickyHeader>
                    <TableHead>
                      <TableRow
                        sx={{
                          background: theme =>
                            theme.palette.mode === 'dark'
                              ? 'linear-gradient(135deg, #1565c0 0%, #0d47a1 100%)'
                              : 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
                          '& .MuiTableCell-head': {
                            color: '#fff',
                            fontWeight: 700,
                            textTransform: 'uppercase',
                            letterSpacing: '0.5px',
                            fontSize: '0.95rem',
                            borderBottom: '2px solid rgba(100, 181, 246, 0.3)',
                          },
                        }}
                      >
                        <TableCell>N° Resolución</TableCell>
                        <TableCell>Asunto</TableCell>
                        <TableCell>Referencia</TableCell>
                        <TableCell>Fecha</TableCell>
                        <TableCell align="center">Acciones</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {results.map(resolution => (
                        <TableRow
                          key={resolution.NumdeResolucion}
                          hover
                          sx={{
                            cursor: 'pointer',
                            transition: 'all 0.3s ease',
                            '&:hover': {
                              backgroundColor: theme =>
                                theme.palette.mode === 'dark'
                                  ? 'rgba(25, 118, 210, 0.08)'
                                  : 'rgba(25, 118, 210, 0.04)',
                              transform: 'scale(1.01)',
                              boxShadow: '0 4px 12px rgba(25, 118, 210, 0.15)',
                            },
                            '& .MuiTableCell-root': {
                              borderBottom: theme =>
                                `1px solid ${
                                  theme.palette.mode === 'dark'
                                    ? 'rgba(25, 118, 210, 0.1)'
                                    : 'rgba(25, 118, 210, 0.08)'
                                }`,
                            },
                          }}
                          onClick={() =>
                            handleRowClick(resolution.NumdeResolucion)
                          }
                        >
                          <TableCell>
                            <Chip
                              label={resolution.NumdeResolucion}
                              color="primary"
                              variant="filled"
                              size="small"
                              sx={{
                                fontWeight: 700,
                                background:
                                  'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
                                boxShadow: '0 2px 8px rgba(25, 118, 210, 0.3)',
                              }}
                            />
                          </TableCell>
                          <TableCell
                            sx={{ maxWidth: { md: '200px', lg: '300px' } }}
                          >
                            <Typography
                              variant="body2"
                              sx={{
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                              }}
                            >
                              {resolution.Asunto ||
                                resolution.asunto ||
                                'No disponible'}
                            </Typography>
                          </TableCell>
                          <TableCell
                            sx={{ maxWidth: { md: '150px', lg: '200px' } }}
                          >
                            <Typography
                              variant="body2"
                              sx={{
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                              }}
                            >
                              {resolution.Referencia ||
                                resolution.referencia ||
                                'No disponible'}
                            </Typography>{' '}
                          </TableCell>{' '}
                          <TableCell>
                            <Chip
                              icon={<CalendarTodayIcon />}
                              label={formatearFechaCorta(
                                resolution.fetcha_creacion
                              )}
                              variant="outlined"
                              color="info"
                              size="small"
                            />
                          </TableCell>
                          <TableCell align="center">
                            <Stack
                              direction="row"
                              spacing={1}
                              justifyContent="center"
                            >
                              <Button
                                variant="contained"
                                size="small"
                                startIcon={<EditIcon />}
                                onClick={e => {
                                  e.stopPropagation();
                                  handleNavigateToModify(
                                    resolution.NumdeResolucion
                                  );
                                }}
                                sx={{
                                  background:
                                    'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
                                  boxShadow:
                                    '0 4px 12px rgba(25, 118, 210, 0.3)',
                                  fontWeight: 600,
                                  transition: 'all 0.3s ease',
                                  '&:hover': {
                                    background:
                                      'linear-gradient(135deg, #1565c0 0%, #0d47a1 100%)',
                                    transform: 'translateY(-2px)',
                                    boxShadow:
                                      '0 6px 20px rgba(25, 118, 210, 0.4)',
                                  },
                                }}
                              >
                                Modificar
                              </Button>
                              <Button
                                variant="outlined"
                                size="small"
                                startIcon={<VisibilityIcon />}
                                onClick={e => {
                                  e.stopPropagation();
                                  handleNavigateToShow(
                                    resolution.NumdeResolucion
                                  );
                                }}
                                sx={{
                                  borderWidth: '2px',
                                  fontWeight: 600,
                                  transition: 'all 0.3s ease',
                                  '&:hover': {
                                    borderWidth: '2px',
                                    background: 'rgba(25, 118, 210, 0.08)',
                                    transform: 'translateY(-2px)',
                                    boxShadow:
                                      '0 4px 12px rgba(25, 118, 210, 0.3)',
                                  },
                                }}
                              >
                                Ver
                              </Button>
                            </Stack>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </Box>
          )}
        </CardContent>
      </Card>{' '}
      {/* Modal de detalles responsive */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
        fullScreen={isMobile}
        sx={{
          '& .MuiDialog-paper': {
            borderRadius: { xs: 0, sm: 2 },
            margin: { xs: 0, sm: 2 },
          },
        }}
      >
        <DialogTitle
          sx={{
            position: 'relative',
            pb: 2,
            borderBottom: `1px solid ${theme.palette.divider}`,
          }}
        >
          <Typography variant={isMobile ? 'h6' : 'h5'} fontWeight="bold">
            Detalles de la Resolución
          </Typography>
          {isMobile && (
            <IconButton
              aria-label="close"
              onClick={handleCloseDialog}
              sx={{
                position: 'absolute',
                right: 8,
                top: 8,
                color: theme.palette.grey[500],
              }}
            >
              <CloseIcon />
            </IconButton>
          )}
        </DialogTitle>

        <DialogContent
          dividers
          sx={{
            p: { xs: 2, sm: 3 },
            maxHeight: { xs: '70vh', sm: '60vh' },
            overflowY: 'auto',
          }}
        >
          {selectedResolution ? (
            <Stack spacing={{ xs: 2, sm: 3 }}>
              <Box>
                <Typography
                  variant="body1"
                  sx={{
                    mb: 1,
                    fontSize: { xs: '0.9rem', sm: '1rem' },
                  }}
                >
                  <strong>N° Resolución:</strong>
                </Typography>
                <Chip
                  label={selectedResolution.NumdeResolucion}
                  color="primary"
                  size={isMobile ? 'small' : 'medium'}
                />
              </Box>

              <Box>
                <Typography
                  variant="body1"
                  sx={{
                    mb: 1,
                    fontSize: { xs: '0.9rem', sm: '1rem' },
                  }}
                >
                  <strong>Asunto:</strong>
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    pl: 1,
                    fontSize: { xs: '0.85rem', sm: '0.95rem' },
                    lineHeight: 1.4,
                  }}
                >
                  {selectedResolution.Asunto ||
                    selectedResolution.asunto ||
                    'No disponible'}
                </Typography>
              </Box>

              <Box>
                <Typography
                  variant="body1"
                  sx={{
                    mb: 1,
                    fontSize: { xs: '0.9rem', sm: '1rem' },
                  }}
                >
                  <strong>Referencia:</strong>
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    pl: 1,
                    fontSize: { xs: '0.85rem', sm: '0.95rem' },
                    lineHeight: 1.4,
                  }}
                >
                  {selectedResolution.Referencia ||
                    selectedResolution.referencia ||
                    'No disponible'}
                </Typography>{' '}
              </Box>

              <Box>
                <Typography
                  variant="body1"
                  sx={{
                    mb: 1,
                    fontSize: { xs: '0.9rem', sm: '1rem' },
                  }}
                >
                  <strong>Fecha de Creación:</strong>
                </Typography>{' '}
                <Chip
                  icon={<CalendarTodayIcon />}
                  label={formatearFechaLarga(
                    selectedResolution.fetcha_creacion
                  )}
                  variant="outlined"
                  color="info"
                  size={isMobile ? 'small' : 'medium'}
                />
              </Box>

              {(selectedResolution.images?.length > 0 ||
                selectedResolution.Images?.length > 0) && (
                <Box>
                  <Typography
                    variant="h6"
                    sx={{
                      mb: 2,
                      fontSize: { xs: '1.1rem', sm: '1.25rem' },
                    }}
                  >
                    Imágenes:
                  </Typography>
                  <Grid container spacing={{ xs: 1, sm: 2 }}>
                    {(
                      selectedResolution.images ||
                      selectedResolution.Images ||
                      []
                    ).map((img, idx) => (
                      <Grid item xs={12} sm={6} md={4} key={idx}>
                        <Card
                          elevation={3}
                          sx={{
                            borderRadius: { xs: 1, sm: 2 },
                            overflow: 'hidden',
                          }}
                        >
                          {' '}
                          <CardMedia
                            component="img"
                            height={isMobile ? '200' : '180'}
                            image={getOptimizedImageUrl(
                              img,
                              isMobile ? 'low' : 'medium'
                            )}
                            alt={`Imagen ${idx + 1}`}
                            onError={handleImageError}
                            loading={isMobile ? 'eager' : 'lazy'}
                            sx={{
                              objectFit: 'contain',
                              backgroundColor: theme.palette.grey[50],
                              // Optimizaciones para móviles
                              imageRendering: isMobile
                                ? '-webkit-optimize-contrast'
                                : 'auto',
                              backfaceVisibility: 'hidden',
                              WebkitBackfaceVisibility: 'hidden',
                            }}
                          />
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                </Box>
              )}

              {!selectedResolution.images && !selectedResolution.Images && (
                <Box
                  sx={{
                    textAlign: 'center',
                    py: 3,
                    color: theme.palette.text.secondary,
                  }}
                >
                  <Typography variant="body2">
                    No hay imágenes asociadas a esta resolución.
                  </Typography>
                </Box>
              )}
            </Stack>
          ) : (
            <Box
              sx={{
                textAlign: 'center',
                py: 4,
              }}
            >
              <Typography>Cargando detalles...</Typography>
            </Box>
          )}
        </DialogContent>

        <DialogActions
          sx={{
            flexDirection: { xs: 'column', sm: 'row' },
            gap: { xs: 1, sm: 2 },
            p: { xs: 2, sm: 3 },
            borderTop: `1px solid ${theme.palette.divider}`,
          }}
        >
          {selectedResolution && (
            <Button
              onClick={() =>
                handleNavigateToShow(selectedResolution.NumdeResolucion)
              }
              color="primary"
              variant="contained"
              fullWidth={isMobile}
              startIcon={<VisibilityIcon />}
              sx={{
                order: { xs: 1, sm: 1 },
                fontWeight: 'bold',
              }}
            >
              Ver Página Completa
            </Button>
          )}
          <Button
            onClick={handleCloseDialog}
            color="inherit"
            variant="outlined"
            fullWidth={isMobile}
            sx={{
              order: { xs: 2, sm: 2 },
            }}
          >
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>
      {/* Botón de navegación */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: { xs: 'center', sm: 'flex-start' },
          mt: { xs: 3, sm: 4, md: 4 }, // Reducido margen superior
          mb: { xs: 2, sm: 3, md: 3 }, // Reducido margen inferior
          pt: 2,
        }}
      >
        <Button
          component={Link}
          to="/home"
          color="primary"
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          size={isMobile ? 'medium' : 'large'}
          sx={{
            fontWeight: 'bold',
            borderRadius: { xs: 1, sm: 2 },
            px: { xs: 3, sm: 4 },
            '&:hover': {
              backgroundColor: 'primary.light',
              color: 'primary.dark',
              borderColor: 'primary.main',
            },
          }}
        >
          Volver al Inicio
        </Button>
      </Box>
    </Container>
  );
};

export default Busquedas;
