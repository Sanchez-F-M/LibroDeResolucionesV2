import React from 'react';
import { Box, Typography, Button } from '@mui/material';

const Footer = ({ darkMode }) => {
  return (
    <Box
      sx={{
        backgroundColor: darkMode ? '#333' : '#ffffffffff',
        color: darkMode ? '#fff' : '#000',
        padding: '20px',
        textAlign: 'center',
        position: 'fixed',
        bottom: 0,
        width: '100%',
      }}
    >
      <Typography variant="body1">© 2023 Mi Aplicación</Typography>
      <Button variant="contained" color="primary" sx={{ mt: 2 }}>
        Botón de Acción
      </Button>
    </Box>
  );
};

export default Footer;
