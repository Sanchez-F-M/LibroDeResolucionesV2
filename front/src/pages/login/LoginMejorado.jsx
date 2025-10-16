import React, { useState } from 'react';
import { 
  Container, 
  Paper, 
  Typography, 
  TextField, 
  Button, 
  Grid, 
  Alert,
  Box
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import api from '../../api/api';

const LoginMejorado = () => {
  const [username, setUsername] = useState('admin'); // Pre-llenar con admin
  const [password, setPassword] = useState('admin123'); // Pre-llenar con password
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [debugInfo, setDebugInfo] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!username || !password) {
      setError('Por favor, complete todos los campos.');
      return;
    }

    setLoading(true);
    setError('');
    setDebugInfo('Iniciando login...');

    try {
      console.log('🔐 Intentando login con:', { username, password: '***' });
      console.log('🌐 API Base URL:', import.meta.env.VITE_API_BASE_URL);
      
      setDebugInfo('Enviando petición al servidor...');
      
      const response = await api.post('/api/user/login', {
        Nombre: username,
        Contrasena: password,
      });
      
      console.log('✅ Respuesta del login:', response.data);
      setDebugInfo('Login exitoso, guardando token...');
      
      localStorage.setItem('token', response.data.token);
      setError('');
      setDebugInfo('Redirigiendo a Home...');
      
      // Dar un momento para que se vea el mensaje de éxito
      setTimeout(() => {
        navigate('/home');
      }, 1000);
      
    } catch (err) {
      console.error('❌ Error de autenticación:', err);
      setLoading(false);
      
      let errorMsg = 'Error en el inicio de sesión';
      
      if (err.response) {
        errorMsg = err.response.data?.error || `Error del servidor (${err.response.status})`;
        setDebugInfo(`Error del servidor: ${err.response.status} - ${err.response.statusText}`);
      } else if (err.request) {
        errorMsg = 'No se pudo conectar con el servidor';
        setDebugInfo('Error de red: No se pudo conectar con el servidor');
      } else {
        errorMsg = err.message;
        setDebugInfo(`Error: ${err.message}`);
      }
      
      setError(errorMsg);
    }
    
    setLoading(false);
  };

  const testConnection = async () => {
    try {
      setDebugInfo('Probando conexión...');
      const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';
      const response = await fetch(`${baseUrl}/health`);
      const data = await response.json();
      setDebugInfo(`✅ Conexión exitosa: ${data.status}`);
    } catch (error) {
      setDebugInfo(`❌ Error de conexión: ${error.message}`);
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 8, mb: 4 }}>
      <Grid container justifyContent="center">
        <Grid item xs={12} sm={10} md={8}>
          <Paper elevation={12} sx={{ p: 4 }}>
            <Typography variant="h4" align="center" gutterBottom>
              🔐 Iniciar Sesión
            </Typography>
            
            {/* Información de debugging */}
            <Box sx={{ mb: 3, p: 2, bgcolor: 'grey.100', borderRadius: 1 }}>
              <Typography variant="subtitle2" gutterBottom>
                Debug Info:
              </Typography>
              <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                API URL: {import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'}
              </Typography>
              <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                Entorno: {import.meta.env.VITE_APP_ENV || 'development'}
              </Typography>
              {debugInfo && (
                <Typography variant="body2" sx={{ fontFamily: 'monospace', mt: 1 }}>
                  Estado: {debugInfo}
                </Typography>
              )}
            </Box>

            <Button 
              variant="outlined" 
              onClick={testConnection}
              fullWidth
              sx={{ mb: 2 }}
            >
              🩺 Probar Conexión al Backend
            </Button>

            <form onSubmit={handleLogin}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Nombre de usuario"
                    variant="outlined"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    disabled={loading}
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
                    disabled={loading}
                  />
                </Grid>
                
                {error && (
                  <Grid item xs={12}>
                    <Alert severity="error">{error}</Alert>
                  </Grid>
                )}
                
                <Grid item xs={12}>
                  <Button 
                    type="submit" 
                    variant="contained" 
                    color="primary" 
                    fullWidth 
                    size="large"
                    disabled={loading}
                  >
                    {loading ? '🔄 Iniciando sesión...' : 'Iniciar Sesión'}
                  </Button>
                </Grid>
              </Grid>
            </form>
            
            <Box sx={{ mt: 2, p: 2, bgcolor: 'info.light', borderRadius: 1 }}>
              <Typography variant="body2" align="center">
                💡 Credenciales de prueba pre-cargadas:<br/>
                Usuario: admin | Contraseña: admin123
              </Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default LoginMejorado;
