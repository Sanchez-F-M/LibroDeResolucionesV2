// Login.jsx
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
      const response = await api.post('/user/login', {
        Nombre: username,
        Contrasena: password
      });
      // Guardamos el token en localStorage
      localStorage.setItem('token', response.data.token);
      setError('');
      // Redirigir a la página principal o a la ruta protegida
      navigate('/home');
    } catch (err) {
      setError(err.response?.data.error || 'Error en el inicio de sesión');
    }
  };

  return (
    <Container maxWidth={isMobile ? 'sm' : 'lg'} sx={{ mt: isMobile ? 23 : 10, padding: isMobile ? 4 : 15.5, mb: 0 }}>
      <Grid container justifyContent="center">
        <Grid item xs={12} sm={10} md={8}>
          <Paper elevation={12} sx={{ padding: isMobile ? 6 : 15.9 }}>
            <Typography variant={isMobile ? 'h4' : 'h2'} align="center" gutterBottom>
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

// Con esta modificación, el componente envía las credenciales al back end, obtiene el token y lo guarda en localStorage. Las siguientes peticiones usarán el token gracias al interceptor definido en api.js. Ahora, el usuario podrá iniciar sesión y acceder a las rutas protegidas de la aplicación.