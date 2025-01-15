import React from 'react';
import { Box, Typography, Button } from '@mui/material';

const Footer = ({ darkMode }) => {
  return (
    <Box
      sx={{
        backgroundColor: darkMode ? '#fff' : '#34495e',
        color: '#fff',
        padding: '10px 0',
        textAlign: 'center',
        position: 'relative',
        width: '100%',
        marginTop: '330px',
        transition: 'background-color 0.3s ease',
        boxShadow: '0px -2px 4px -1px rgba(0,0,0,0.06)',
      }}
    >
      <Typography variant="h5">
        © Secretaria privada de Jefatura de Policía de Tucumán{' '}
      </Typography>
      <Button
        variant="contained"
        sx={{
          mt: 1,
          fontFamily: 'Arial, Helvetica, sans-serif',
          backgroundColor: darkMode ? '#1976d2' : '#34495e',
          '&:hover': {
            backgroundColor: darkMode ? '#1565c0' : '#2c3e50',
          },
        }}
      >
        Botón de Acción
      </Button>
    </Box>
  );
};

export default Footer;
