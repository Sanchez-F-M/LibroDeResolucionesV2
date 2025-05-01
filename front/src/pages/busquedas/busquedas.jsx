import React, { useState } from 'react';
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
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import api from '../../api/api'; // Asume que api está configurado con axios u otro cliente HTTP
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

  // Función para manejar la búsqueda
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

  // Maneja el clic en la fila para abrir el modal
  const handleRowClick = async (id) => {
    try {
      console.log('ID de la resolución:', id);
      
      const response = await api.get(`/api/books/${id}`);
      // Asumiendo que la API devuelve un array con un solo objeto
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

  // Función para construir la URL correcta de una imagen
  const getImageUrl = (imagePath) => {
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
      return imagePath;
    }
  
    // Evita duplicar la ruta /uploads/
    return `http://localhost:3000/${imagePath}`;
  };

  // Función para cerrar el modal
  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedResolution(null);
  };

  // Maneja la navegación explícita (ej. clic en celdas específicas)
  const handleNavigateToShow = (id) => {
      navigate(`/mostrar/${id}`);
  };

  // Maneja la navegación a la página de modificación
  const handleNavigateToModify = (id) => {
      navigate(`/modificar/${id}`);
  };


  return (
    <Container maxWidth="xl" sx={{ mt: { xs: 10, md: 15 }, mb: { xs: 5, md: 15 } }}> {/* Ajuste de márgenes */}
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
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>Detalles de la Resolución</DialogTitle>
        <DialogContent dividers>
          {selectedResolution ? (
            <>
              <Typography variant="subtitle1" gutterBottom>
                <strong>N° Resolución:</strong> {selectedResolution.NumdeResolucion}
              </Typography>
              <Typography variant="subtitle1" gutterBottom>
                {/* Unificando el acceso a las propiedades con fallback */}
                <strong>Asunto:</strong> {selectedResolution.Asunto || selectedResolution.asunto || 'No disponible'} 
              </Typography>
              <Typography variant="subtitle1" gutterBottom>
                 {/* Unificando el acceso a las propiedades con fallback */}
                <strong>Referencia:</strong> {selectedResolution.Referencia || selectedResolution.referencia || 'No disponible'}
              </Typography>
              
              {/* Verificación de imágenes con ambas variantes posibles de la propiedad */}
              {(selectedResolution.images?.length > 0 || selectedResolution.Images?.length > 0) && (
                <>
                  <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>
                    Imágenes:
                  </Typography>
                  <Grid container spacing={2}>
                    {/* Accedemos a la propiedad correcta con fallback */}
                    {(selectedResolution.images || selectedResolution.Images || []).map((img, idx) => (
                      <Grid item xs={12} sm={6} md={4} key={idx}> {/* Ajuste de grid para imágenes */}
                        <Card>
                          <CardMedia
                            component="img"
                            height="200" // Altura fija
                            // Usamos la función para construir la URL correcta
                            image={getImageUrl(img)}
                            alt={`Imagen ${idx + 1}`}
                            sx={{ objectFit: 'contain' }} // Ajustar cómo se muestra la imagen
                          />
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                </>
              )}
              {/* Mensaje si no hay imágenes */}
               {(!selectedResolution.images && !selectedResolution.Images) && (
                  <Typography sx={{ mt: 2 }}>No hay imágenes asociadas.</Typography>
               )}
            </>
          ) : (
            <Typography>Cargando detalles...</Typography>
          )}
        </DialogContent>
        <DialogActions>
          {/* Botón para ir a la vista detallada */}
           {selectedResolution && (
             <Button onClick={() => handleNavigateToShow(selectedResolution.NumdeResolucion)} color="primary">
               Ver Página Completa
             </Button>
           )}
          <Button onClick={handleCloseDialog} color="primary">
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Busquedas;