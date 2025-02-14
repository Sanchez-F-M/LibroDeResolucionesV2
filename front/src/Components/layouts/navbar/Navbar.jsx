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
        zIndex: 1000,
        padding: isMobile ? 1 : 2,
      }}
    >
      <Toolbar>
        <Grid
          container
          alignItems="center"
          justifyContent="space-between"
          columns={{ xs: 4, sm: 8, md: 12 }}
        >
          {/* Logo (oculto en mobile) */}
          {!isMobile && (
            <Grid item sm={3} md={2} display="flex" alignItems="center">
              <Link to="/home">
                <img
                  src={Logo}
                  alt="Logo"
                  style={{ width: 110, height: 125, marginRight: 8 }}
                />
              </Link>
            </Grid>
          )}

          {/* Título principal (ajustable para mobile y desktop) */}
          <Grid item xs={4} sm={4} md={6} textAlign="center">
            <Typography variant={isMobile ? 'h4' : 'h2'}>
              Libro de Resoluciones
            </Typography>
          </Grid>

          {/* Botón ilustrado de cambio de modo */}
          <Grid
            item
            xs={5}
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
