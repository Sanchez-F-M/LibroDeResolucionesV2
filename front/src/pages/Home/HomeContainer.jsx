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
import { Link } from 'react-router-dom';
import lupa from '../../assets/lupa2.png';
import flecha from '../../assets/cargas.png';
import SearchIcon from '@mui/icons-material/Search';
import UploadFileIcon from '@mui/icons-material/UploadFile';

const HomeContainer = () => {
  return (
    <Grid
      container
      spacing={6}
      justifyContent="center"
      style={{ marginTop: '200px', gap: '50px' }}
    >
      {/* Card 1: Buscar Archivos */}
      <Grid item xs={12} sm={6} md={4} style={{ textAlign: 'center' }}>
        <Card>
          <CardMedia
            component="img"
            height="440"
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
              <Button
                variant="contained"
                color="primary"
                fullWidth
                startIcon={<SearchIcon sx={{ fontSize: '3rem' }} />}
                sx={{ fontSize: '1.2rem', padding: '12px 0' }}
              >
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
            height="440"
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
              <Button
                variant="contained"
                color="primary"
                fullWidth
                startIcon={<UploadFileIcon sx={{ fontSize: '3rem' }} />}
                sx={{ fontSize: '1.2rem', padding: '12px 0' }}
              >
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
