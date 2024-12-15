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
    document.body.style.backgroundColor = darkMode ? '#ffffff' : '#34495e';
    document.body.style.color = darkMode ? '#000000' : '#34495e';
  };

  return (
    <AppBar position="relative" color={darkMode ? '#34495e' : 'primary'}>
      <Toolbar>
        <Box
          sx={{
            display: 'flex',

            alignItems: 'center',
            flexGrow: 0,
            height: '140px',
          }}
        >
          <img
            src={Logo}
            alt="Logo"
            style={{ width: 110, height: 125, marginRight: 8 }}
          />
          <Typography
            className="subtitulo"
            variant="subtitle1"
            sx={{
              fontFamily: 'Arial, Helvetica, sans-serif',
            }}
          >
            Policía de Tucumán
          </Typography>
        </Box>

        <Box
          sx={{
            flexGrow: 30,
            textAlign: 'center',
            marginRight: '55px',
            fontFamily: 'Arial, Helvetica, sans-serif;',
          }}
        >
          <Typography variant="h2">Libro de resoluciones</Typography>
        </Box>

        <Box>
          <Button variant="contained" color="primary" onClick={toggleDarkMode}>
            Cambio de modo
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
