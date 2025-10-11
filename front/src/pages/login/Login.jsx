import React, { useState, useEffect } from 'react';
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
  CircularProgress,
  Link,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api, { checkHealth } from '../../api/api';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [serverStatus, setServerStatus] = useState(null);
  const navigate = useNavigate();
  const { login } = useAuth();

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));

  // Verificar estado del servidor al cargar el componente
  useEffect(() => {
    const verifyServer = async () => {
      const health = await checkHealth();
      setServerStatus(health);

      if (!health.success) {
        setError(
          '⚠️ El servidor no está disponible. Por favor, inicie el backend en http://localhost:3000'
        );
      }
    };

    verifyServer();
  }, []);
  const handleLogin = async e => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Validación de campos
    if (!username || !password) {
      setError('Por favor, complete todos los campos.');
      setLoading(false);
      return;
    }

    try {
      console.log('🔐 Intentando login con usuario:', username);

      const response = await api.post('/api/user/login', {
        Nombre: username,
        Contrasena: password,
      });

      console.log('✅ Login exitoso:', response.data);

      // Validar estructura de respuesta
      if (!response.data?.user || !response.data?.token) {
        throw new Error('Respuesta del servidor inválida');
      }

      // Extraer datos del usuario
      const userData = {
        ID: response.data.user.ID,
        Nombre: response.data.user.Nombre,
        Rol: response.data.user.Rol,
      };

      console.log('👤 Datos de usuario procesados:', userData);

      // Guardar sesión
      login(userData, response.data.token);

      // Navegar al home
      navigate('/home');
    } catch (err) {
      console.error('❌ Error de autenticación:', err);

      // Determinar tipo de error y mostrar mensaje apropiado
      let errorMessage = 'Error en el inicio de sesión';

      if (err.isNetworkError) {
        errorMessage =
          '🔌 No se pudo conectar con el servidor.\n\n' +
          '📍 Verifique que:\n' +
          '1. El backend esté ejecutándose (npm run dev en carpeta server)\n' +
          '2. El servidor esté escuchando en http://localhost:3000\n' +
          '3. No haya problemas de firewall o CORS';
        setServerStatus({ success: false });
      } else if (err.response) {
        switch (err.response.status) {
          case 401:
            errorMessage = '❌ Usuario o contraseña incorrectos';
            break;
          case 403:
            errorMessage = '⛔ Acceso denegado';
            break;
          case 404:
            errorMessage =
              '🔍 Endpoint no encontrado. Verifique la configuración del servidor';
            break;
          case 500:
            errorMessage = '⚠️ Error interno del servidor';
            break;
          default:
            errorMessage =
              err.response.data?.error ||
              err.response.data?.message ||
              `Error del servidor (${err.response.status})`;
        }
      } else if (err.message) {
        errorMessage = err.message;
      }

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleTestConnection = async () => {
    setError('');
    setLoading(true);

    try {
      const health = await checkHealth();
      setServerStatus(health);

      if (health.success) {
        setError('');
        alert(
          '✅ Conexión exitosa con el servidor!\n\n' +
            JSON.stringify(health.data, null, 2)
        );
      } else {
        setError(
          '❌ No se pudo conectar con el servidor en http://localhost:3000\n\n' +
            'Por favor, ejecute el backend con:\n' +
            'cd server\n' +
            'npm run dev'
        );
      }
    } catch (err) {
      setError('Error al probar conexión: ' + err.message);
    } finally {
      setLoading(false);
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

          {/* Indicador de estado del servidor */}
          {serverStatus && (
            <Box sx={{ textAlign: 'center', mb: 2 }}>
              <Typography
                variant="caption"
                sx={{
                  color: serverStatus.success ? 'success.main' : 'error.main',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 1,
                }}
              >
                <span
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    backgroundColor: serverStatus.success
                      ? '#4caf50'
                      : '#f44336',
                    display: 'inline-block',
                  }}
                />
                {serverStatus.success
                  ? 'Servidor conectado'
                  : 'Servidor desconectado'}
              </Typography>
            </Box>
          )}

          {error && (
            <Alert
              severity={
                error.includes('🔌') || error.includes('⚠️')
                  ? 'warning'
                  : 'error'
              }
              sx={{
                mb: { xs: 3, sm: 4 },
                borderRadius: 1,
                whiteSpace: 'pre-line',
              }}
              onClose={() => setError('')}
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
              onChange={e => setUsername(e.target.value)}
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
              onChange={e => setPassword(e.target.value)}
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
              disabled={loading}
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
              {loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                'Iniciar Sesión'
              )}
            </Button>

            <Button
              fullWidth
              variant="outlined"
              size="medium"
              onClick={handleTestConnection}
              disabled={loading}
              sx={{ mt: 2, mb: 2 }}
            >
              🔍 Probar Conexión al Servidor
            </Button>

            <Box sx={{ mt: 3, textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                ¿No tienes una cuenta?{' '}
                <Button
                  onClick={() => navigate('/register')}
                  variant="text"
                  size="small"
                  sx={{
                    fontWeight: 'bold',
                    color: theme.palette.primary.main,
                  }}
                >
                  Regístrate aquí
                </Button>
              </Typography>
            </Box>

            {/* Información de ayuda */}
            <Box sx={{ mt: 3, p: 2, bgcolor: '#f5f5f5', borderRadius: 2 }}>
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ display: 'block', mb: 1 }}
              >
                💡 <strong>¿Problemas para conectar?</strong>
              </Typography>
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ display: 'block' }}
              >
                1. Asegúrese de que el servidor esté ejecutándose
                <br />
                2. Verifique que esté en http://localhost:3000
                <br />
                3. Revise la consola del navegador (F12) para más detalles
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default Login;
