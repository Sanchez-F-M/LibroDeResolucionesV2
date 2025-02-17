import React, { useState } from 'react';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { Link } from 'react-router-dom';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

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

    console.log('Usuario:', username);
    console.log('Contraseña:', password);
    setError('');
    alert('Inicio de sesión exitoso (simulado)');
  };

  return (
    <Container
      maxWidth={isMobile ? 'sm' : 'md'}
      sx={{ mt: isMobile ? 23 : 18, padding: isMobile ? 4 : 2, mb: 15.6 }}
    >
      <Grid container justifyContent="center">
        <Grid item xs={12} sm={10} md={8}>
          <Paper elevation={12} sx={{ padding: isMobile ? 6 : 6 }}>
            <Typography
              variant={isMobile ? 'h4' : 'h3'}
              align="center"
              gutterBottom
            >
              Iniciar Sesión
            </Typography>
            <form onSubmit={handleLogin}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Nombre de usuario"
                    variant="outlined"
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                    error={!!error}
                    helperText={error}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Contraseña"
                    type="password"
                    variant="outlined"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    error={!!error}
                    helperText={error}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    fullWidth
                    size={isMobile ? 'large' : 'large'}
                  >
                    Iniciar Sesión
                  </Button>
                </Grid>
                <Grid item xs={12} textAlign="center">
                  <Link to="/home" style={{ textDecoration: 'none' }}>
                    <Typography variant="body2" color="primary">
                      ¿Olvidaste tu contraseña?
                    </Typography>
                  </Link>
                </Grid>
              </Grid>
            </form>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Login;
