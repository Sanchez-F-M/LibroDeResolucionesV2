import './footer.css';

import React from 'react';
import { Box, Typography, Button, Container } from '@mui/material';

const Footer = () => {
  const handleBackToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <Box
      component="footer"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: 'primary.main',
        color: 'white',
        py: 5,
        mt: 20,
      }}
    >
      <Container
        maxWidth="lg"
        sx={{ fontFamily: 'sans-serif', textAlign: 'center' }}
      >
        {/* Título principal */}
        <Typography variant="h4" gutterBottom>
          Secretaría Privada de Jefatura de Policía de Tucumán
        </Typography>

        {/* Botón "Volver al inicio" */}
        <Button
          variant="contained"
          color="info"
          onClick={handleBackToTop}
          sx={{ mt: 2 }}
        >
          Volver al inicio
        </Button>
      </Container>
    </Box>
  );
};

export default Footer;
