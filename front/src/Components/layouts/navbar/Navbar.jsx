import React, { useState } from 'react';

import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Logo from '../../../assets/logo3-removebg-preview (1).png';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const [darkMode, setDarkMode] = useState(false);

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
      }}
    >
      <Toolbar className="navbar-container ">
        <Box
          sx={{
            display: 'flex',

            alignItems: 'center',
            flexGrow: 0,
            height: '130px',
          }}
        >
          <Link to="/home">
            {' '}
            <img
              src={Logo}
              alt="Logo"
              style={{ width: 110, height: 125, marginRight: 8 }}
            />
          </Link>
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
          <Typography variant="h2">Libro de Resoluciones</Typography>
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
