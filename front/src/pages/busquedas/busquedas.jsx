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

  const handleRowClick = async (id) => {
    try {
      const response = await api.get(`/book/${id}`);
      const resolution = response.data[0];
      setSelectedResolution(resolution);
      setOpenDialog(true);
    } catch (error) {
      console.error('Error al obtener la resolución:', error);
      alert('Error al obtener la información de la resolución');
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedResolution(null);
  };

  return (
    <Container maxWidth="xl" sx={{ mt: { xs: 10, md: 25 }, mb: { xs: 5, md: 35.8 } }}>
      <Card>
        <CardContent>
          <Typography variant="h3" sx={{ fontSize: { xs: '1.8rem', md: '2.125rem' } }}>
            Buscar Resolución
          </Typography>

          {/* Campo de búsqueda y botón */}
          <Grid container spacing={5} alignItems="center" sx={{ my: 6 }}>
            <Grid item xs={12} sm={9}>
              <TextField
                fullWidth
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                label="Ingrese el criterio de búsqueda"
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <Button variant="contained" color="primary" fullWidth onClick={handleSearch}>
                Buscar
              </Button>
            </Grid>
          </Grid>

          {/* Criterios de búsqueda */}
          <Grid container spacing={2} alignItems="center" sx={{ my: 10, mx: 2, textAlign: 'left', fontSize: '1.2rem' }}>
            <Grid item xs={12}>
              <FormControl component="fieldset">
                <FormLabel component="legend">Criterio de búsqueda</FormLabel>
                <RadioGroup row={!isMobile} value={criterion} onChange={(e) => setCriterion(e.target.value)}>
                  <FormControlLabel value="Asunto" control={<Radio />} label="Asunto" />
                  <FormControlLabel value="Referencia" control={<Radio />} label="Referencia" />
                  <FormControlLabel value="NumdeResolucion" control={<Radio />} label="Nro Resolución" />
                </RadioGroup>
              </FormControl>
            </Grid>
          </Grid>

          {/* Resultados de la búsqueda */}
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

      {/* Modal de detalles */}
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
