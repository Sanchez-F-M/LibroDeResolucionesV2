import React, { useState } from 'react';
import {
  TextField,
  Button,
  Box,
  Typography,
  Container,
  Paper,
} from '@mui/material';
import { Link, Links } from 'react-router-dom';

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

    // Aquí puedes manejar la lógica de autenticación.
    console.log('Usuario:', username);
    console.log('Contraseña:', password);
    setError(''); // Limpia errores
    alert('Inicio de sesión exitoso (simulado)');
  };

  return (
    <Container maxWidth="xs" sx={{ mt: 30 }}>
      <Paper elevation={20} sx={{ padding: 6 }}>
        <Typography variant="h4" align="center" gutterBottom>
          Iniciar Sesión
        </Typography>
        <form onSubmit={handleLogin}>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              height: '350px',
              width: '300px',
              gap: 6,
            }}
          >
            <TextField
              label="Usuario"
              variant="outlined"
              value={username}
              onChange={e => setUsername(e.target.value)}
              fullWidth
            />
            <TextField
              label="Contraseña"
              type="password"
              variant="outlined"
              value={password}
              onChange={e => setPassword(e.target.value)}
              fullWidth
            />

            {error && (
              <Typography color="error" align="center">
                {error}
              </Typography>
            )}

            <Link to="/home">
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                sx={{ mt: 2 }}
              >
                Iniciar Sesión
              </Button>
            </Link>
          </Box>
        </form>
      </Paper>
    </Container>
  );
};

export default Login;
