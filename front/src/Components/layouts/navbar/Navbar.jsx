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
import { Link, useLocation } from 'react-router-dom';
import Logo from '../../../assets/logo3-removebg-preview (1).png';

const Navbar = () => {
  const [darkMode, setDarkMode] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const location = useLocation();

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
        height: isMobile ? 90 : 135,
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
          {/* Logo: Si la ruta actual es "/login", se muestra sin enlace */}
          <Grid item xs={3} sm={3} md={2} display="flex" alignItems="center">
            {location.pathname === '/' ? (
              <img
                src={Logo}
                alt="Logo"
                style={{
                  width: isMobile ? 50 : 110,
                  height: isMobile ? 52 : 115,
                  marginRight: 8,
                }}
              />
            ) : (
              <Link to="/home">
                <img
                  src={Logo}
                  alt="Logo"
                  style={{
                    width: isMobile ? 50 : 100,
                    height: isMobile ? 52 : 105,
                    marginRight: 8,
                  }}
                />
              </Link>
            )}
          </Grid>

          {/* Título principal */}
          <Grid item xs={6} sm={4} md={6} textAlign="center">
            <Typography variant={isMobile ? 'h6' : 'h2'}>
              Libro de Resoluciones
            </Typography>
          </Grid>

          {/* Botón de cambio de modo */}
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
