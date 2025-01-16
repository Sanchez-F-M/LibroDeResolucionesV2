import React from 'react';
import { Box, Typography, Button } from '@mui/material';

const Footer = ({ darkMode }) => {
  return (
    <Box
      sx={{
        backgroundColor: darkMode ? '#fff' : '#34495e',
        color: '#fff',
        padding: '10px 10px 10px 10px',

        textAlign: 'center',
        position: 'relative',
        width: '100%',
        bottom: 0,
        marginTop: 40,
        transition: 'background-color 0.3s ease',
        boxShadow: '0px -10px 12px -4px rgba(0,0,0,0.3)',
      }}
    >
      <Typography variant="h5">
        © Secretaria Privada - Jefatura de Policía{' '}
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
