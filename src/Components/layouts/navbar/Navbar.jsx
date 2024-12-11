import React, { useState } from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Logo from '../../../assets/logo3-removebg-preview (1).png';

const Navbar = () => {
  const [darkMode, setDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.body.style.backgroundColor = darkMode ? '#ffffff' : '#121212';
    document.body.style.color = darkMode ? '#000000' : '#ffffff';
  };

  return (
    <AppBar color={darkMode ? 'default' : 'primary'}>
      <Toolbar className="navbar-container ">
        {/* Logo y subtítulo a la izquierda */}
        <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 0 }}>
          <img
            src={Logo}
            alt="Logo"
            style={{ width: 110, height: 125, marginRight: 8 }}
          />
          <Typography
            className="subtitulo"
            variant="subtitle1"
            sx={{ fontFamily: 'Arial, Helvetica, sans-serif;' }}
          >
            Policía de Tucumán
          </Typography>
        </Box>

        {/* Título centrado */}
        <Box
          sx={{
            flexGrow: 30,
            textAlign: 'center',
            fontFamily: 'Arial, Helvetica, sans-serif;',
          }}
        >
          <Typography variant="h2">Libro de resoluciones</Typography>
        </Box>

        {/* Botón de cambio de modo a la derecha */}
        <Box>
          <Button variant="outlined" color="inherit" onClick={toggleDarkMode}>
            Cambio de modo
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
