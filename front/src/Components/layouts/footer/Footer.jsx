import './footer.css';
import Navbar from '../navbar/Navbar';
import React from 'react';
import { Box, Typography, Button, Container } from '@mui/material';

const Footer = () => {
  const handleBackToTop = () => {
    window.scrollTo({ top: 10, behavior: 'smooth' });
  };

  return (
    <Box
      // position="relative"
      component="footer"
      color="white"
      sx={{
        display: 'flex',
        position: 'relative',
        flexDirection: 'column',
        backgroundColor: '#34495e',
        color: 'white',
        py: 2,
        mt: 30,
      }}
    >
      <Container
        maxWidth="xl"
        sx={{ fontFamily: 'sans-serif', textAlign: 'center' }}
      >
        <Typography variant="h6" gutterBottom>
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
