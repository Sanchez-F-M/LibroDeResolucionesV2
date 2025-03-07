import React from 'react';
import { Box, Typography, Button } from '@mui/material';

const Footer = ({ darkMode }) => {
  // Función que se ejecuta al hacer clic en el botón
  const handleClick = () => {
    alert('Llamar a este número de contacto: 3813960936.');
  };

  return (
    <Box
      sx={{
        backgroundColor: darkMode ? '#fff' : '#34495e',
        color: darkMode ? '#34495e' : '#fff',
        padding: { xs: '20px 10px', sm: '10px' },
        textAlign: 'center',
        width: '100%',
        minHeight: { xs: 'auto', sm: '140px' },
        position: 'relative',
        bottom: 0,
        transition: 'background-color 0.3s ease',
        boxShadow: '0px -10px 12px -4px rgba(0,0,0,0.3)',
      }}
    >
      <Typography
        variant="h4"
        align="center"
        sx={{
          marginBottom: { xs: '10px', sm: '20px' },
          fontSize: { xs: '1.5rem', sm: '2rem' },
        }}
      >
        Secretaria Privada - Jefatura de Policía
      </Typography>
      <Typography
        variant="h5"
        align="center"
        sx={{
          fontSize: { xs: '1rem', sm: '1.25rem' },
        }}
      >
        Dirección: Calle Italia 2601, San Miguel de Tucumán, Tucumán
      </Typography>

      {/*
      <Button
        variant="contained"
        sx={{
          mt: { xs: 2, sm: 0 },
          color: '#fff',
          height: '30px',
          fontFamily: 'Arial, Helvetica, sans-serif',
          backgroundColor: darkMode ? '#1976d2' : '#34495e',
          '&:hover': {
            backgroundColor: darkMode ? '#1565c0' : '#2c3e50',
          },
        }}
        onClick={handleClick}
      >
        Contactar con soporte
      </Button>
      */}
    </Box>
  );
};

export default Footer;
