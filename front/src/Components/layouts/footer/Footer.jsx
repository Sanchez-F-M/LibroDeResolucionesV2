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
        py: 2,
        mt: 10,
      }}
    >
      <Container
        maxWidth="xl"
        sx={{ fontFamily: 'sans-serif', textAlign: 'center' }}
      >
        <Typography variant="h4" gutterBottom>
          Secretaría Privada de Jefatura de Policía de Tucumán
        </Typography>

        <Button
          variant="contained"
          color="inherit"
          onClick={handleBackToTop}
          sx={{ mt: 1, color: 'Highlight' }}
        >
          Volver al Inicio
        </Button>
      </Container>
    </Box>
  );
};

export default Footer;
