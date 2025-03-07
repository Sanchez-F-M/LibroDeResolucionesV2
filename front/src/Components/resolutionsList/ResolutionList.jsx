// src/components/ResolutionsList.jsx
import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  TextField,
  InputAdornment,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import useResolutionStore from '../store/resolutionStore';

const ResolutionsList = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [searchQuery, setSearchQuery] = useState('');
  // Obtenemos del store el estado y la función para hacer la consulta
  const { resolutions, loading, error, fetchResolutions } =
    useResolutionStore();

  // Opcional: cargar resoluciones al montar el componente
  useEffect(() => {
    fetchResolutions();
  }, [fetchResolutions]);

  const handleSearch = () => {
    fetchResolutions(searchQuery);
  };

  return (
    <Grid
      container
      spacing={isMobile ? 5 : 4}
      justifyContent="center"
      sx={{
        marginTop: isMobile ? '100px' : '150px',
        marginBottom: isMobile ? '50px' : '375px',
      }}
    >
      <Grid item xs={12} sm={10} md={8}>
        <Card>
          <CardContent>
            <Typography
              variant={isMobile ? 'h6' : 'h4'}
              sx={{ marginBottom: '10px' }}
            >
              Buscar Resolución
            </Typography>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} sm={8}>
                <TextField
                  label="Ingrese su búsqueda"
                  variant="outlined"
                  fullWidth
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
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
            {loading && (
              <Typography sx={{ marginTop: 2 }}>Cargando...</Typography>
            )}
            {error && (
              <Typography color="error" sx={{ marginTop: 2 }}>
                Error: {error}
              </Typography>
            )}
          </CardContent>
        </Card>
      </Grid>

      {/* Mostrar los resultados en forma de cards */}
      {resolutions.length > 0 && (
        <Grid item xs={12} sm={10} md={8}>
          <Grid container spacing={4}>
            {resolutions.map(result => (
              <Grid item xs={12} sm={6} md={4} key={result.id}>
                <Card>
                  <CardContent>
                    <Typography variant="h6">
                      Resolución #{result.resolutionNumber}
                    </Typography>
                    <Typography variant="body2">
                      Asunto: {result.asunto}
                    </Typography>
                    <Typography variant="body2">
                      Referencia: {result.referencia}
                    </Typography>
                    {result.fecha && (
                      <Typography variant="body2">
                        Fecha: {result.fecha}
                      </Typography>
                    )}
                  </CardContent>
                  <CardContent>
                    <Button variant="contained" color="primary" fullWidth>
                      Descargar
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Grid>
      )}
    </Grid>
  );
};

export default ResolutionsList;
