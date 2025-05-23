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
import { useNavigate } from 'react-router-dom';
import api from '../../api/api';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!username || !password) {
      setError('Por favor, complete todos los campos.');
      return;
    }

    try {
      const response = await api.post('api/user/login', {
        Nombre: username,
        Contrasena: password,
      });
      localStorage.setItem('token', response.data.token);
      setError('');
      navigate('/home');
    } catch (err) {
      console.error('Error de autenticación:', err);
      setError(err.response?.data.error || 'Error en el inicio de sesión');
    }
  };

  return (
    <Container maxWidth={isMobile ? 'sm' : 'md'} sx={{ mt: isMobile ? 14 : 20, p: isMobile ? 6 : 8.2, mb: isMobile ? 9 : 1 }}>
      <Grid container justifyContent="center">
        <Grid item xs={12} sm={10} md={8}>
          <Paper elevation={12} sx={{ p: isMobile ? 6 : 8 }}>
            <Typography variant={isMobile ? 'h4' : 'h3'} align="center" gutterBottom>
              Iniciar Sesión
            </Typography>
            <form onSubmit={handleLogin}>
              <Grid container spacing={5}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Nombre de usuario"
                    variant="outlined"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
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
                    onChange={(e) => setPassword(e.target.value)}
                    error={!!error}
                    helperText={error}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button type="submit" variant="contained" color="primary" fullWidth size="large">
                    Iniciar Sesión
                  </Button>
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
