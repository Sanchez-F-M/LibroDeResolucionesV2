import { useState } from 'react';
// import Logo from '../../../assets/logo3-removebg-preview (1).png';
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
        maxWidth="lg"
        sx={{ fontFamily: 'sans-serif', textAlign: 'center' }}
      >
        <Typography variant="h6" gutterBottom>
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
