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
} from '@mui/material';
import api from '../../api/api';
import { useNavigate } from 'react-router-dom';

const Busquedas = () => {
  const [searchValue, setSearchValue] = useState('');
  const [criterion, setCriterion] = useState('Asunto');
  const [results, setResults] = useState([]);
  const navigate = useNavigate();

  const handleSearch = async () => {
    try {
      const response = await api.post('/search', {
        criterion,
        value: searchValue,
      });
      setResults(response.data);
    } catch (err) {
      alert('No se encontraron resultados');
    }
  };

  return (
    <Container maxWidth="xl" sx={{ mt: 25, mb: 35.8 }}>
      <Card>
        <CardContent>
          <Typography variant="h3">Buscar Resolución</Typography>
          
          {/* Contenedor para el input y el botón en la misma línea */}
          <Grid container spacing={5} alignItems="center" sx={{ my: 6}}>
            <Grid item xs={9}>
              <TextField
                fullWidth
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                label="Ingrese el criterio de búsqueda"
              />
            </Grid>
            <Grid container spacing={1} item xs={3}>
              <Button
                variant="contained"
                color="primary"
                fullWidth
                onClick={handleSearch}
              >
                Buscar
              </Button>
            </Grid>
          </Grid>
          
          {/* Sección para seleccionar el criterio de búsqueda */}
          <Grid container spacing={2} alignItems="center" sx={{ my: 10, mx: 2, textAlign: 'left', fontSize: '1.2rem' }}>
            <Grid item xs={12}>
              <FormControl component="fieldset">
                <FormLabel component="legend">Criterio de búsqueda</FormLabel>
                <RadioGroup
                  row
                  value={criterion}
                  onChange={(e) => setCriterion(e.target.value)}
                >
                  <FormControlLabel
                    value="Asunto"
                    control={<Radio />}
                    label="Asunto"
                  />
                  <FormControlLabel
                    value="Referencia"
                    control={<Radio />}
                    label="Referencia"
                  />
                  <FormControlLabel
                    value="NumdeResolucion"
                    control={<Radio />}
                    label="Nro Resolución"
                  />
                </RadioGroup>
              </FormControl>
            </Grid>
          </Grid>
          
          {/* Resultados de la búsqueda */}
          <div>
            {results.map((resolution) => (
              <div key={resolution.NumdeResolucion}>
                <p>N° Resolución: {resolution.NumdeResolucion}</p>
                <p>Asunto: {resolution.Asunto}</p>
                <p>Referencia: {resolution.Referencia}</p>
                <Button
                  variant="contained"
                  onClick={() =>
                    navigate(`/modificar/${resolution.NumdeResolucion}`)
                  }
                >
                  Modificar
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </Container>
  );
};

export default Busquedas;
