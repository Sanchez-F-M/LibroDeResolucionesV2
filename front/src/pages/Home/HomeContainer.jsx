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
import { Link, Links } from 'react-router-dom';
import lupa from '../../assets/lupa2.png';
import flecha from '../../assets/cargas.png';

const HomeContainer = () => {
  return (
    <Grid
      container
      spacing={6}
      justifyContent="center"
      style={{ marginTop: '200px', gap: '50px' }}
    >
      {/* Card 1: Buscar Archivos */}
      <Grid item xs={12} sm={6} md={4}>
        <Card>
          <CardMedia
            component="img"
            height="140"
            image={lupa} // Reemplaza con la URL de tu imagen
            alt="Buscar Resoluciones"
          />
          <CardContent>
            <Typography variant="h5" component="div">
              {/* Buscar Archivos */}
            </Typography>
          </CardContent>
          <Link to="/buscador">
            <CardActions>
              <Button variant="contained" color="primary" fullWidth>
                Buscar Resoluciones
              </Button>
            </CardActions>
          </Link>
        </Card>
      </Grid>

      <Grid item xs={12} sm={6} md={4}>
        <Card>
          <CardMedia
            component="img"
            height="140"
            image={flecha} // Reemplaza con la URL de tu imagen
            alt="Cargar Archivos"
          />
          <CardContent>
            <Typography variant="h5" component="div">
              {/* Cargar Resoluciones */}
            </Typography>
          </CardContent>
          <Link to="/cargas">
            <CardActions>
              <Button variant="contained" color="primary" fullWidth>
                Cargar Resoluciones
              </Button>
            </CardActions>
          </Link>
        </Card>
      </Grid>
    </Grid>
  );
};

export default HomeContainer;
