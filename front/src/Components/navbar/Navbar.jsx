import React, { useState } from 'react';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  AppBar,
  Toolbar,
} from '@mui/material';
import { Link } from 'react-router-dom';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = e => {
    e.preventDefault();

    if (!username || !password) {
      setError('Por favor, complete todos los campos.');
      return;
    }

    const usernameRegex = /^[a-zA-Z0-9._-]{3,}$/;
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;

    if (!usernameRegex.test(username)) {
      setError(
        'El nombre de usuario debe tener al menos 3 caracteres y solo puede contener letras, números, puntos, guiones y guiones bajos.'
      );
      return;
    }

    if (!passwordRegex.test(password)) {
      setError(
        'La contraseña debe tener al menos 8 caracteres, incluyendo al menos una letra y un número.'
      );
      return;
    }

    // Aquí puedes manejar la lógica de autenticación.
    console.log('Usuario:', username);
    console.log('Contraseña:', password);
    setError(''); // Limpia errores
    alert('Inicio de sesión exitoso (simulado)');
  };

  return (
    <Container maxWidth="xs" sx={{ mt: 27 }}>
      <AppBar
        position="fixed"
        sx={{
          backgroundColor: '#1976d2',
          width: '100%',
          zIndex: 1000,
        }}
      >
        <Toolbar>
          <Typography variant="h6">Navbar</Typography>
        </Toolbar>
      </AppBar>
      <Paper elevation={21} sx={{ padding: 6, mt: 8 }}>
        <Typography variant="h4" align="center" gutterBottom>
          Iniciar Sesión
        </Typography>
        <form onSubmit={handleLogin}>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              height: '350px',
              justifyContent: 'space-between',
            }}
          >
            <TextField
              label="Nombre de usuario"
              variant="outlined"
              value={username}
              onChange={e => setUsername(e.target.value)}
              error={!!error}
              helperText={error}
            />
            <TextField
              label="Contraseña"
              type="password"
              variant="outlined"
              value={password}
              onChange={e => setPassword(e.target.value)}
              error={!!error}
              helperText={error}
            />
            <Button type="submit" variant="contained" color="primary">
              Iniciar Sesión
            </Button>
          </Box>
        </form>
      </Paper>
    </Container>
  );
};

export default Login;
