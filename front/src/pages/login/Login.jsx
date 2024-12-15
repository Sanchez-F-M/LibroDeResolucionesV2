import React, { useState } from 'react';
import {
  TextField,
  Button,
  Box,
  Typography,
  Container,
  Paper,
} from '@mui/material';

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

    console.log('Usuario:', username);
    console.log('Contraseña:', password);
    setError('');
    alert('Inicio de sesión exitoso (simulado)');
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 10 }}>
      <Paper elevation={20} sx={{ padding: 10 }}>
        <Typography variant="h3" align="center" gutterBottom>
          Iniciar Sesión
        </Typography>
        <form onSubmit={handleLogin}>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',

              height: '350px',
              width: '400px',
              gap: 8,
            }}
          >
            {/* Campo de Usuario */}
            <TextField
              label="Usuario"
              variant="outlined"
              value={username}
              onChange={e => setUsername(e.target.value)}
              fullWidth
            />

            {/* Campo de Contraseña */}
            <TextField
              label="Contraseña"
              type="password"
              variant="outlined"
              value={password}
              onChange={e => setPassword(e.target.value)}
              fullWidth
            />

            {/* Mensaje de error */}
            {error && (
              <Typography color="error" align="center">
                {error}
              </Typography>
            )}

            {/* Botón de Iniciar Sesión */}
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              sx={{ mt: 2 }}
            >
              Iniciar Sesión
            </Button>
          </Box>
        </form>
      </Paper>
    </Container>
  );
};

export default Login;
