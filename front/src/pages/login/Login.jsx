import React, { useState } from 'react';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Alert,
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
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  const handleLogin = async (e) => {
    e.preventDefault();

    if (!username || !password) {
      setError('Por favor, complete todos los campos.');
      return;
    }

    try {
      console.log('Intentando login con:', { Nombre: username, Contrasena: '***' });
      const response = await api.post('/api/user/login', {
        Nombre: username,
        Contrasena: password,
      });
      console.log('Login exitoso:', response.data);
      localStorage.setItem('token', response.data.token);
      setError('');
      navigate('/home');
    } catch (err) {
      console.error('Error completo de autenticación:', err);
      console.error('Respuesta del servidor:', err.response?.data);
      console.error('Status:', err.response?.status);
      console.error('Headers:', err.response?.headers);
      setError(err.response?.data?.error || 'Error en el inicio de sesión');
    }
  };

  return (
    <Container 
      maxWidth="sm" 
      sx={{ 
        minHeight: 'calc(110vh - 900px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        mt: { xs: 2, sm: 3, md: 6 },
        py: { xs: 1, sm: 2, md: 3 },
        px: { xs: 2, sm: 3 },
      }}
    >
      <Box sx={{ width: '100%', maxWidth: { xs: '100%', sm: '400px' } }}>
        <Paper 
          elevation={8} 
          sx={{ 
            p: { xs: 4, sm: 6, md: 8 },
            borderRadius: { xs: 2, sm: 3 },
            boxShadow: theme.shadows[8],
          }}
        >
          <Typography 
            variant={isMobile ? 'h5' : 'h4'} 
            align="center" 
            gutterBottom
            sx={{
              mb: { xs: 4, sm: 5 },
              fontWeight: 'bold',
              color: theme.palette.primary.main,
            }}
          >
            Iniciar Sesión
          </Typography>

          {error && (
            <Alert 
              severity="error" 
              sx={{ 
                mb: { xs: 3, sm: 4 },
                borderRadius: 1,
              }}
            >
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleLogin}>
            <TextField
              fullWidth
              label="Nombre de usuario"
              variant="outlined"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              sx={{ 
                mb: { xs: 3, sm: 4 },
                '& .MuiOutlinedInput-root': {
                  borderRadius: { xs: 1, sm: 2 },
                },
              }}
              size={isMobile ? 'small' : 'medium'}
            />

            <TextField
              fullWidth
              label="Contraseña"
              type="password"
              variant="outlined"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              sx={{ 
                mb: { xs: 4, sm: 5 },
                '& .MuiOutlinedInput-root': {
                  borderRadius: { xs: 1, sm: 2 },
                },
              }}
              size={isMobile ? 'small' : 'medium'}
            />

            <Button 
              type="submit" 
              variant="contained" 
              fullWidth 
              size={isMobile ? 'medium' : 'large'}
              sx={{
                py: { xs: 2, sm: 2.5 },
                fontSize: { xs: '1rem', sm: '1.1rem' },
                borderRadius: { xs: 1, sm: 2 },
                fontWeight: 'bold',
                backgroundColor: 'white',
                color: theme.palette.primary.main,
                border: `2px solid ${theme.palette.primary.main}`,
                boxShadow: theme.shadows[4],
                '&:hover': {
                  backgroundColor: theme.palette.primary.main,
                  color: 'white',
                  border: `2px solid ${theme.palette.primary.main}`,
                  boxShadow: theme.shadows[8],
                  transform: 'translateY(-1px)',
                },
                transition: 'all 0.3s ease',
              }}
            >
              Iniciar Sesión
            </Button>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default Login;
