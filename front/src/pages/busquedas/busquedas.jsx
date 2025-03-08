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
  Box,
  CardMedia,
} from '@mui/material';
import api from '../../api/api';
import { useNavigate } from 'react-router-dom';

const Busquedas = () => {
  const [searchValue, setSearchValue] = useState('');
  const [criterion, setCriterion] = useState('Asunto');
  const [results, setResults] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedResolution, setSelectedResolution] = useState(null);
  const navigate = useNavigate();

  const handleSearch = async () => {
    try {
      // Realiza la petición POST al endpoint /search del back end
      const response = await api.post('/search', {
        criterion,
        value: searchValue,
      });
      setResults(response.data);
    } catch (err) {
      console.error('Error en la búsqueda:', err);
      alert('No se encontraron resultados');
    }
  };

  // Cuando se hace click en una fila, se consulta la información completa de la resolución
  const handleRowClick = async (id) => {
    try {
      const response = await api.get(`/book/${id}`);
      // Se asume que la respuesta es un arreglo con la resolución en la primera posición
      const resolution = response.data[0];
      setSelectedResolution(resolution);
      setOpenDialog(true);
    } catch (error) {
      console.error('Error al obtener la resolución:', error);
      alert('Error al obtener la información de la resolución');
    }
  };

  // Cierra el modal
  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedResolution(null);
  };

  return (
    <Container maxWidth="xl" sx={{ mt: 25, mb: 35.8 }}>
      <Card>
        <CardContent>
          <Typography variant="h3">Buscar Resolución</Typography>

          {/* Input y botón de búsqueda */}
          <Grid container spacing={5} alignItems="center" sx={{ my: 6 }}>
            <Grid item xs={9}>
              <TextField
                fullWidth
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                label="Ingrese el criterio de búsqueda"
              />
            </Grid>
            <Grid container spacing={1} item xs={3}>
              <Button variant="contained" color="primary" fullWidth onClick={handleSearch}>
                Buscar
              </Button>
            </Grid>
          </Grid>

          {/* Selección del criterio de búsqueda */}
          <Grid
            container
            spacing={2}
            alignItems="center"
            sx={{ my: 10, mx: 2, textAlign: 'left', fontSize: '1.2rem' }}
          >
            <Grid item xs={12}>
              <FormControl component="fieldset">
                <FormLabel component="legend">Criterio de búsqueda</FormLabel>
                <RadioGroup row value={criterion} onChange={(e) => setCriterion(e.target.value)}>
                  <FormControlLabel value="Asunto" control={<Radio />} label="Asunto" />
                  <FormControlLabel value="Referencia" control={<Radio />} label="Referencia" />
                  <FormControlLabel value="NumdeResolucion" control={<Radio />} label="Nro Resolución" />
                </RadioGroup>
              </FormControl>
            </Grid>
          </Grid>

          {/* Resultados de la búsqueda en formato de tabla */}
          {results.length > 0 && (
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
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
                      onClick={() => handleRowClick(resolution.NumdeResolucion)}
                    >
                      <TableCell>{resolution.NumdeResolucion}</TableCell>
                      <TableCell>{resolution.Asunto}</TableCell>
                      <TableCell>{resolution.Referencia}</TableCell>
                      <TableCell align="center" onClick={(e) => e.stopPropagation()}>
                        <Button
                          variant="contained"
                          onClick={() => navigate(`/modificar/${resolution.NumdeResolucion}`)}
                        >
                          Modificar
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

      {/* Modal para mostrar detalles y las imágenes vinculadas */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>Detalles de la Resolución</DialogTitle>
        <DialogContent dividers>
          {selectedResolution ? (
            <>
              <Typography variant="subtitle1">
                <strong>N° Resolución:</strong> {selectedResolution.NumdeResolucion}
              </Typography>
              <Typography variant="subtitle1">
                <strong>Asunto:</strong> {selectedResolution.Asunto}
              </Typography>
              <Typography variant="subtitle1">
                <strong>Referencia:</strong> {selectedResolution.Referencia}
              </Typography>
              {/* Se asume que la propiedad "images" es un arreglo de URLs o keys */}
              {selectedResolution.images && selectedResolution.images.length > 0 && (
                <>
                  <Typography variant="h6" sx={{ mt: 2 }}>
                    Imágenes:
                  </Typography>
                  <Grid container spacing={2}>
                    {selectedResolution.images.map((img, idx) => (
                      <Grid item xs={12} sm={6} key={idx}>
                        <Card>
                          <CardMedia
                            component="img"
                            height="200"
                            image={img}
                            alt={`Imagen ${idx + 1}`}
                          />
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                </>
              )}
            </>
          ) : (
            <Typography>Cargando detalles...</Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Busquedas;
