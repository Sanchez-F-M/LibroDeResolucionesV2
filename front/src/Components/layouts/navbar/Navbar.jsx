import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Grid,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { Brightness4, Brightness7 } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import Logo from '../../../assets/logo3-removebg-preview (1).png';

const Navbar = () => {
  const [darkMode, setDarkMode] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.body.style.backgroundColor = darkMode ? '#34495e' : '#ffffff';
    document.body.style.color = darkMode ? '#ffffff' : '#000000';
  };

  return (
    <AppBar
      position="fixed"
      sx={{
        backgroundColor: darkMode ? '#1976d2' : '#34495e',
        width: '100%',
        height: isMobile ? 90 : 95,
        zIndex: 1000,
        padding: isMobile ? 1 : 2,
      }}
    >
      <Toolbar>
        <Grid
          container
          alignItems="center"
          justifyContent="space-between"
          columns={{ xs: 12, sm: 12, md: 12 }}
        >
          {/* Logo (se muestra en desktop y se reduce en móvil) */}
          <Grid item xs={3} sm={3} md={2} display="flex" alignItems="center">
            <Link to="/home">
              <img
                src={Logo}
                alt="Logo"
                style={{
                  width: isMobile ? 50 : 80,
                  height: isMobile ? 52 : 85,
                  marginRight: 8,
                }}
              />
            </Link>
          </Grid>

          {/* Título principal (centrado y con tamaño ajustado) */}
          <Grid item xs={6} sm={4} md={6} textAlign="center">
            <Typography variant={isMobile ? 'h5' : 'h3'}>
              Libro de Resoluciones
            </Typography>
          </Grid>

          {/* Botón de cambio de modo (alineado a la derecha) */}
          <Grid
            item
            xs={3}
            sm={3}
            md={2}
            display="flex"
            justifyContent="flex-end"
          >
            <IconButton onClick={toggleDarkMode} color="inherit">
              {darkMode ? <Brightness7 /> : <Brightness4 />}
            </IconButton>
          </Grid>
        </Grid>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
