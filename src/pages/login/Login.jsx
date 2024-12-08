import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardActions,
  TextField,
  Button,
  Typography,
  Box,
  Container,
} from '@mui/material';
import { styled } from '@mui/material/styles';

// Estilos personalizados
const StyledCard = styled(Card)(({ theme }) => ({
  marginTop: theme.spacing(8),
  padding: theme.spacing(3),
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
}));

const LoginForm = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });

  const handleSubmit = e => {
    e.preventDefault();
    console.log('Datos del formulario:', formData);
  };

  const handleChange = e => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <Container component="main" maxWidth="xs">
      <StyledCard elevation={3}>
        <CardContent sx={{ width: '100%' }}>
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
            <Typography
              variant="subtitle1"
              gutterBottom
              sx={{
                color: 'text.secondary',
                mb: 2,
                fontWeight: 500,
              }}
            >
              INGRESE USUARIO
            </Typography>
            <TextField
              margin="normal"
              required
              fullWidth
              id="username"
              name="username"
              label="Usuario"
              variant="outlined"
              value={formData.username}
              onChange={handleChange}
              autoFocus
            />

            <Typography
              variant="subtitle1"
              gutterBottom
              sx={{
                color: 'text.secondary',
                mt: 2,
                mb: 2,
                fontWeight: 500,
              }}
            >
              INGRESE CONTRASEÑA
            </Typography>
            <TextField
              margin="normal"
              required
              fullWidth
              id="password"
              name="password"
              label="Contraseña"
              type="password"
              variant="outlined"
              value={formData.password}
              onChange={handleChange}
            />
          </Box>
        </CardContent>

        <CardActions sx={{ width: '100%', mt: 2 }}>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            size="large"
            onClick={handleSubmit}
            sx={{
              mt: 2,
              mb: 2,
              textTransform: 'uppercase',
            }}
          >
            Ingresar
          </Button>
        </CardActions>
      </StyledCard>
    </Container>
  );
};

export default LoginForm;
