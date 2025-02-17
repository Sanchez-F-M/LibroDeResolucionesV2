import React from 'react';
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  CardMedia,
  Grid,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { Link } from 'react-router-dom';
import lupa from '../../assets/lupa2.png';
import flecha from '../../assets/cargas.png';
import SearchIcon from '@mui/icons-material/Search';
import UploadFileIcon from '@mui/icons-material/UploadFile';

const HomeContainer = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Grid
      container
      spacing={isMobile ? 3 : 6}
      justifyContent="center"
      sx={{
        marginTop: isMobile ? '100px' : '200px',
        gap: isMobile ? '30px' : '50px',
        padding: isMobile ? '10px' : '0',
      }}
    >
      {/* Card 1: Buscar Archivos */}
      <Grid item xs={12} sm={6} md={4} sx={{ textAlign: 'center' }}>
        <Card>
          <CardMedia
            component="img"
            height={isMobile ? '300' : '440'}
            image={lupa}
            alt="Buscar Resoluciones"
          />
          <CardContent>
            <Typography variant={isMobile ? 'h6' : 'h5'}></Typography>
          </CardContent>
          <Link to="/buscador">
            <CardActions>
              <Button
                variant="contained"
                color="primary"
                fullWidth
                startIcon={
                  <SearchIcon sx={{ fontSize: isMobile ? '2rem' : '3rem' }} />
                }
                sx={{
                  fontSize: isMobile ? '1rem' : '1.2rem',
                  padding: isMobile ? '8px 0' : '12px 0',
                }}
              >
                Buscar Resoluciones
              </Button>
            </CardActions>
          </Link>
        </Card>
      </Grid>

      {/* Card 2: Cargar Archivos */}
      <Grid item xs={12} sm={6} md={4}>
        <Card>
          <CardMedia
            component="img"
            height={isMobile ? '300' : '440'}
            image={flecha}
            alt="Cargar Archivos"
          />
          <CardContent>
            <Typography variant={isMobile ? 'h6' : 'h5'}></Typography>
          </CardContent>
          <Link to="/cargas">
            <CardActions>
              <Button
                variant="contained"
                color="primary"
                fullWidth
                startIcon={
                  <UploadFileIcon
                    sx={{ fontSize: isMobile ? '2rem' : '3rem' }}
                  />
                }
                sx={{
                  fontSize: isMobile ? '1rem' : '1.2rem',
                  padding: isMobile ? '8px 0' : '12px 0',
                }}
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
