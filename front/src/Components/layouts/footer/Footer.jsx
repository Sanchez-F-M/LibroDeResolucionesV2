import React from 'react';
import { Box, Typography, Button } from '@mui/material';

const Footer = ({ darkMode }) => {
  // Función que se ejecuta al hacer clic en el botón
  const handleClick = () => {
    alert('Llamar a este numero de contacto 3813960936.');
  };

  return (
    <Box
      sx={{
        backgroundColor: darkMode ? '#fff' : '#34495e',
        color: '#fff',
        padding: '10px',
        textAlign: 'center',
        position: 'relative',
        width: '100%',
        height: '86x',
        bottom: 0,
        marginTop: '20px',
        transition: 'background-color 0.3s ease',
        boxShadow: '0px -10px 12px -4px rgba(0,0,0,0.3)',
      }}
    >
      <Typography variant="h6" align="center">
        © Secretaria Privada - Jefatura de Policía
      </Typography>
      <Button
        variant="contained"
        sx={{
          mt: 0,
          color: '#fff',
          height: '30px',
          fontFamily: 'Arial, Helvetica, sans-serif',
          backgroundColor: darkMode ? '#1976d2' : '#34495e',
          '&:hover': {
            backgroundColor: darkMode ? '#1565c0' : '#2c3e50',
          },
        }}
        onClick={handleClick} // Asignamos la función al evento onClick
      >
        Contactar con soporte
      </Button>
    </Box>
  );
};

export default Footer;
