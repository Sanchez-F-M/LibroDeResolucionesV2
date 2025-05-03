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
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CloseIcon from '@mui/icons-material/Close';
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
    <Container maxWidth="xl" sx={{ mt: { xs: 13, md: 35 }, mb: { xs: 7, md: 32 } }}> {/* Ajuste de márgenes */}
      <Card>
        <CardContent>
          
          <Typography variant="h4" sx={{ fontSize: { xs: '1.8rem', md: '2.125rem' }, mb: 3 }}> {/* Ajuste de tamaño y margen */}
            Buscar Resolución
          </Typography>

          {/* Campo de búsqueda y botón */}
          <Grid container spacing={2} alignItems="center" sx={{ mb: 3 }}> {/* Ajuste de espaciado y margen */}
            <Grid item xs={12} sm={8} md={9}> {/* Ajuste de grid */}
              <TextField
                fullWidth
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                label="Ingrese el término de búsqueda"
                variant="outlined" // Añadir variante
              />
            </Grid>
            <Grid item xs={12} sm={4} md={3}> {/* Ajuste de grid */}
              <Button variant="contained" color="primary" fullWidth onClick={handleSearch} size="large"> {/* Ajuste de tamaño */}
                Buscar
              </Button>
            </Grid>
          </Grid>

          {/* Criterios de búsqueda */}
          <Grid container spacing={2} alignItems="center" sx={{ mb: 4 }}> {/* Ajuste de margen */}
            <Grid item xs={12}>
              <FormControl component="fieldset">
                <FormLabel component="legend">Criterio de búsqueda</FormLabel>
                <RadioGroup row={!isMobile} value={criterion} onChange={(e) => setCriterion(e.target.value)}>
                  <FormControlLabel value="Asunto" control={<Radio />} label="Asunto" />
                  <FormControlLabel value="Referencia" control={<Radio />} label="Referencia" />
                  {/* Asegúrate que el valor coincida con el backend */}
                  <FormControlLabel value="NumdeResolucion" control={<Radio />} label="Nro Resolución" /> 
                </RadioGroup>
              </FormControl>
            </Grid>
          </Grid>

          {/* Resultados de la búsqueda */}
          {results.length > 0 && (
            <TableContainer component={Paper}>
              <Table stickyHeader aria-label="sticky table"> {/* Mejoras tabla */}
                <TableHead>
                  <TableRow >
                    <TableCell>N° Resolución</TableCell>
                    <TableCell>Asunto</TableCell>
                    <TableCell>Referencia</TableCell>
                    <TableCell align="center">Acciones</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {results.map((resolution) => (
                    <TableRow
                      key={resolution.NumdeResolucion}
                      hover
                      sx={{ cursor: 'pointer' }}
                      // Acción principal al hacer clic en cualquier parte de la fila (excepto botones)
                      onClick={() => handleRowClick(resolution.NumdeResolucion)} 
                    >
                      {/* Estas celdas ahora también disparan el modal via el onClick de TableRow */}
                      <TableCell>{resolution.NumdeResolucion}</TableCell>
                      <TableCell>{resolution.Asunto}</TableCell>
                      <TableCell>{resolution.Referencia}</TableCell>
                      <TableCell align="center">
                        {/* Botón Modificar con su propia lógica, detiene la propagación */}
                        <Button
                          variant="contained"
                          size="small" // Botón más pequeño
                          onClick={(e) => {
                              e.stopPropagation(); // Previene que se active el handleRowClick
                              handleNavigateToModify(resolution.NumdeResolucion);
                          }}
                          sx={{ mr: 1 }} // Margen derecho
                        >
                          Modificar
                        </Button>
                         {/* Botón Ver Detalles (navega a MostrarLibro) */}
                      <Button
                           variant="outlined" // Estilo diferente
                          size="small"
                          onClick={(e) => {
                               e.stopPropagation(); // Previene que se active el handleRowClick
                              handleNavigateToShow(resolution.NumdeResolucion);
                          }}
                        >
                          Ver Detalles
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </CardContent>
      </Card>

      {/* Modal de detalles */}
      <Dialog 
        open={openDialog} 
        onClose={handleCloseDialog} 
        maxWidth="md" 
        fullWidth
        fullScreen={isMobile} // Pantalla completa en móviles
      >
        <DialogTitle>
          Detalles de la Resolución
          {isMobile && (
            <IconButton
              aria-label="close"
              onClick={handleCloseDialog}
              sx={{
                position: 'absolute',
                right: 8,
                top: 8,
              }}
            >
              <CloseIcon />
            </IconButton>
          )}
        </DialogTitle>
        <DialogContent dividers>
          {selectedResolution ? (
            <>
              <Typography variant="subtitle1" gutterBottom>
                <strong>N° Resolución:</strong> {selectedResolution.NumdeResolucion}
              </Typography>
              <Typography variant="subtitle1" gutterBottom>
                <strong>Asunto:</strong> {selectedResolution.Asunto || selectedResolution.asunto || 'No disponible'} 
              </Typography>
              <Typography variant="subtitle1" gutterBottom>
                <strong>Referencia:</strong> {selectedResolution.Referencia || selectedResolution.referencia || 'No disponible'}
              </Typography>
              
              {(selectedResolution.images?.length > 0 || selectedResolution.Images?.length > 0) && (
                <>
                  <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>
                    Imágenes:
                  </Typography>
                  <Grid container spacing={2}>
                    {(selectedResolution.images || selectedResolution.Images || []).map((img, idx) => (
                      <Grid item xs={12} sm={isMobile ? 12 : 6} md={isMobile ? 12 : 4} key={idx}>
                        <Card>
                          <CardMedia
                            component="img"
                            height={isMobile ? "250" : "200"}
                            image={getImageUrl(img)}
                            alt={`Imagen ${idx + 1}`}
                            sx={{ 
                              objectFit: 'contain',
                              width: '100%'
                            }}
                          />
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                </>
              )}
              {(!selectedResolution.images && !selectedResolution.Images) && (
                  <Typography sx={{ mt: 2 }}>No hay imágenes asociadas.</Typography>
              )}
            </>
          ) : (
            <Typography>Cargando detalles...</Typography>
          )}
        </DialogContent>
        <DialogActions sx={{ flexDirection: isMobile ? 'column' : 'row', p: 2 }}>
          {selectedResolution && (
            <Button 
              onClick={() => handleNavigateToShow(selectedResolution.NumdeResolucion)} 
              color="primary"
              fullWidth={isMobile}
              variant="contained"
              sx={{ mb: isMobile ? 1 : 0 }}
            >
              Ver Página Completa
            </Button>
          )}
          <Button 
            onClick={handleCloseDialog} 
            color="primary"
            fullWidth={isMobile}
            variant="outlined"
          >
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 5, mt: 5 }}>
              <Button
                component={Link}
                to="/home"
                color="info"
                variant="outlined"
                startIcon={<ArrowBackIcon />}
                sx={{ 
                  mr: 5,
                  '&:hover': {
                    backgroundColor: 'primary.light',
                    color: 'primary.dark',
                    borderColor: 'primary.main'
                  }
                }}
              >
                Volver al Inicio
              </Button>
            </Box>
    </Container>
    
  );
};

export default Busquedas;