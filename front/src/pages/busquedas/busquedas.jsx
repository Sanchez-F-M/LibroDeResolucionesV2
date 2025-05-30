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
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CloseIcon from '@mui/icons-material/Close';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useTheme } from '@mui/material/styles';
import api from '../../api/api';
import { useNavigate } from 'react-router-dom';

const Busquedas = () => {
  const [searchValue, setSearchValue] = useState('');
  const [criterion, setCriterion] = useState('Asunto');
  const [results, setResults] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedResolution, setSelectedResolution] = useState(null);
  const navigate = useNavigate();
  
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));

  const handleSearch = async () => {
    try {
      const response = await api.post('/api/search', {
        criterion,
        value: searchValue,
      });
      setResults(response.data);
      if (response.data.length === 0) {
        alert('No se encontraron resultados');
      }
    } catch (err) {
      console.error('Error en la búsqueda:', err);
      alert('Error al realizar la búsqueda.');
    }
  };

  const handleRowClick = async (id) => {
    try {
      console.log('ID de la resolución:', id);
      
      const response = await api.get(`/api/books/${id}`);

      const resolution = response.data && response.data.length > 0 ? response.data[0] : null; 
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

  
  const getImageUrl = (imagePath) => {
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
      return imagePath;
    }
  
    
    return `http://localhost:3000/${imagePath}`;
  };

  
  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedResolution(null);
  };

  
  const handleNavigateToShow = (id) => {
      navigate(`/mostrar/${id}`);
  };

  
  const handleNavigateToModify = (id) => {
      navigate(`/modificar/${id}`);
  };

  return (
    <Container 
      maxWidth="xl" 
      sx={{ 
        py: { xs: 2, sm: 3, md: 4 },
        px: { xs: 1, sm: 2, md: 3 },
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
          <Typography 
            variant={isMobile ? 'h5' : isTablet ? 'h4' : 'h3'} 
            sx={{ 
              mb: { xs: 3, sm: 4 },
              fontWeight: 'bold',
              color: theme.palette.primary.main,
              textAlign: { xs: 'center', sm: 'left' },
            }}
          > 
            Buscar Resolución
          </Typography>

          {/* Campo de búsqueda y botón */}
          <Box sx={{ mb: { xs: 3, sm: 4 } }}>
            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              spacing={{ xs: 2, sm: 2 }}
              alignItems={{ xs: 'stretch', sm: 'flex-end' }}
            >
              <TextField
                fullWidth
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                label="Ingrese el término de búsqueda"
                variant="outlined"
                size={isMobile ? 'small' : 'medium'}
                sx={{
                  flex: 1,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: { xs: 1, sm: 2 },
                  },
                }}
              />
              <Button 
                variant="contained" 
                color="primary" 
                onClick={handleSearch} 
                size={isMobile ? 'medium' : 'large'}
                sx={{
                  minWidth: { xs: '100%', sm: '120px' },
                  py: { xs: 1.5, sm: 1.8 },
                  borderRadius: { xs: 1, sm: 2 },
                  fontWeight: 'bold',
                }}
              >
                Buscar
              </Button>
            </Stack>
          </Box>

          {/* Criterios de búsqueda */}
          <Box sx={{ mb: { xs: 3, sm: 4 } }}>
            <FormControl component="fieldset">
              <FormLabel 
                component="legend"
                sx={{
                  fontSize: { xs: '0.9rem', sm: '1rem' },
                  mb: { xs: 1, sm: 2 },
                }}
              >
                Criterio de búsqueda
              </FormLabel>
              <RadioGroup 
                row={!isMobile} 
                value={criterion} 
                onChange={(e) => setCriterion(e.target.value)}
                sx={{
                  '& .MuiFormControlLabel-root': {
                    mb: { xs: 1, sm: 0 },
                    mr: { xs: 0, sm: 3 },
                  },
                }}
              >
                <FormControlLabel value="Asunto" control={<Radio size={isMobile ? 'small' : 'medium'} />} label="Asunto" />
                <FormControlLabel value="Referencia" control={<Radio size={isMobile ? 'small' : 'medium'} />} label="Referencia" />
                <FormControlLabel value="NumdeResolucion" control={<Radio size={isMobile ? 'small' : 'medium'} />} label="Nro Resolución" />
              </RadioGroup>
            </FormControl>
          </Box>

          {/* Resultados de la búsqueda */}
          {results.length > 0 && (
            <Box sx={{ mt: { xs: 2, sm: 3 } }}>
              {isMobile ? (
                // Vista de cards para móviles
                <Stack spacing={2}>
                  {results.map((resolution) => (
                    <Card 
                      key={resolution.NumdeResolucion}
                      elevation={2}
                      sx={{
                        cursor: 'pointer',
                        '&:hover': {
                          elevation: 4,
                          transform: 'translateY(-1px)',
                        },
                        transition: 'all 0.2s ease',
                      }}
                      onClick={() => handleRowClick(resolution.NumdeResolucion)}
                    >
                      <CardContent sx={{ p: 2 }}>
                        <Typography variant="h6" gutterBottom color="primary">
                          N° {resolution.NumdeResolucion}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                          <strong>Asunto:</strong> {resolution.Asunto}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                          <strong>Referencia:</strong> {resolution.Referencia}
                        </Typography>
                        <Stack direction="row" spacing={1}>
                          <Button
                            variant="contained"
                            size="small"
                            startIcon={<EditIcon />}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleNavigateToModify(resolution.NumdeResolucion);
                            }}
                            sx={{ flex: 1 }}
                          >
                            Modificar
                          </Button>
                          <Button
                            variant="outlined"
                            size="small"
                            startIcon={<VisibilityIcon />}
                            onClick={(e) => {
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
                // Vista de tabla para tablets y desktop
                <TableContainer component={Paper} elevation={2}>
                  <Table stickyHeader>
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 'bold' }}>N° Resolución</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }}>Asunto</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }}>Referencia</TableCell>
                        <TableCell align="center" sx={{ fontWeight: 'bold' }}>Acciones</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {results.map((resolution) => (
                        <TableRow
                          key={resolution.NumdeResolucion}
                          hover
                          sx={{ 
                            cursor: 'pointer',
                            '&:hover': {
                              backgroundColor: theme.palette.action.hover,
                            },
                          }}
                          onClick={() => handleRowClick(resolution.NumdeResolucion)}
                        >
                          <TableCell>
                            <Chip 
                              label={resolution.NumdeResolucion} 
                              color="primary" 
                              variant="outlined"
                              size="small"
                            />
                          </TableCell>
                          <TableCell sx={{ maxWidth: { md: '200px', lg: '300px' } }}>
                            <Typography 
                              variant="body2" 
                              sx={{ 
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                              }}
                            >
                              {resolution.Asunto}
                            </Typography>
                          </TableCell>
                          <TableCell sx={{ maxWidth: { md: '150px', lg: '200px' } }}>
                            <Typography 
                              variant="body2" 
                              sx={{ 
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                              }}
                            >
                              {resolution.Referencia}
                            </Typography>
                          </TableCell>
                          <TableCell align="center">
                            <Stack direction="row" spacing={1} justifyContent="center">
                              <Button
                                variant="contained"
                                size="small"
                                startIcon={<EditIcon />}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleNavigateToModify(resolution.NumdeResolucion);
                                }}
                              >
                                Modificar
                              </Button>
                              <Button
                                variant="outlined"
                                size="small"
                                startIcon={<VisibilityIcon />}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleNavigateToShow(resolution.NumdeResolucion);
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
      </Card>      {/* Modal de detalles responsive */}
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
                  {selectedResolution.Asunto || selectedResolution.asunto || 'No disponible'}
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
                  {selectedResolution.Referencia || selectedResolution.referencia || 'No disponible'}
                </Typography>
              </Box>
              
              {(selectedResolution.images?.length > 0 || selectedResolution.Images?.length > 0) && (
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
                    {(selectedResolution.images || selectedResolution.Images || []).map((img, idx) => (
                      <Grid item xs={12} sm={6} md={4} key={idx}>
                        <Card 
                          elevation={3}
                          sx={{
                            borderRadius: { xs: 1, sm: 2 },
                            overflow: 'hidden',
                          }}
                        >
                          <CardMedia
                            component="img"
                            height={isMobile ? "200" : "180"}
                            image={getImageUrl(img)}
                            alt={`Imagen ${idx + 1}`}
                            sx={{ 
                              objectFit: 'contain',
                              backgroundColor: theme.palette.grey[50],
                            }}
                          />
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                </Box>
              )}
              
              {(!selectedResolution.images && !selectedResolution.Images) && (
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
              onClick={() => handleNavigateToShow(selectedResolution.NumdeResolucion)} 
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
          mt: { xs: 3, sm: 4 },
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