import React from 'react';
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  CardMedia,
  Grid,
} from '@mui/material';

const HomeContainer = () => {
  return (
    <Grid
      container
      spacing={2}
      justifyContent="center"
      style={{ marginTop: '20px' }}
    >
      {/* Card 1: Buscar Archivos */}
      <Grid item xs={12} sm={6} md={4}>
        <Card>
          <CardMedia
            component="img"
            height="140"
            image="https://via.placeholder.com/300x140" // Reemplaza con la URL de tu imagen
            alt="Buscar Archivos"
          />
          <CardContent>
            <Typography variant="h5" component="div">
              Buscar Archivos
            </Typography>
          </CardContent>
          <CardActions>
            <Button variant="contained" color="primary" fullWidth>
              Buscar Archivos
            </Button>
          </CardActions>
        </Card>
      </Grid>

      {/* Card 2: Cargar Archivos */}
      <Grid item xs={12} sm={6} md={4}>
        <Card>
          <CardMedia
            component="img"
            height="140"
            image="https://via.placeholder.com/300x140" // Reemplaza con la URL de tu imagen
            alt="Cargar Archivos"
          />
          <CardContent>
            <Typography variant="h5" component="div">
              Cargar Archivos
            </Typography>
          </CardContent>
          <CardActions>
            <Button variant="contained" color="secondary" fullWidth>
              Cargar Archivos
            </Button>
          </CardActions>
        </Card>
      </Grid>
    </Grid>
  );
};

export default HomeContainer;
