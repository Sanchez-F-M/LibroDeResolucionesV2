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
  Stack,
  InputAdornment,
  IconButton,
  Fade,
} from '@mui/material';
import {
  Person,
  Lock,
  Visibility,
  VisibilityOff,
  SecurityRounded,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api, { checkHealth } from '../../api/api';
import Logo from '../../assets/logo3-removebg-preview (1).png';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
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

  // ✨ Detectar si el tema es oscuro
  const isDarkMode = theme.palette.mode === 'dark';

  return (
    <Box
      sx={{
        // ✨ Ajustado para ocupar el espacio disponible sin agregar altura extra
        display: 'flex',
        mt: { xs: -11.5, sm: -17, md: -17 },
        mb: { xs: -6.5, sm: -7.5, md: -7.5 },
        height: 1000,
        position: 'relative',
        overflow: 'hidden',
        // ✨ Gradiente adaptativo según modo oscuro/claro
        background: isDarkMode
          ? 'linear-gradient(135deg, #0a1929 0%, #1a2027 50%, #0d1117 100%)'
          : 'linear-gradient(135deg, #1a252f 0%, #2c3e50 50%, #34495e 100%)',
        transition: 'background 0.3s ease',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: isDarkMode
            ? 'radial-gradient(circle at 20% 80%, rgba(25, 118, 210, 0.2) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(100, 181, 246, 0.15) 0%, transparent 50%)'
            : 'radial-gradient(circle at 20% 80%, rgba(25, 118, 210, 0.15) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(100, 181, 246, 0.1) 0%, transparent 50%)',
          pointerEvents: 'none',
          transition: 'background 0.3s ease',
        },
      }}
    >
      <Container
        maxWidth="lg"
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          // ✨ Reducido padding vertical al mínimo
          py: { xs: 2, sm: 2.5, md: 3 },
          px: { xs: 2, sm: 3 },
          position: 'relative',
          zIndex: 1,
        }}
      >
        <Fade in timeout={800}>
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', md: 'row' },
              width: '100%',
              maxWidth: 1100,
              gap: { xs: 3, md: 0 },
            }}
          >
            {/* ✨ PANEL IZQUIERDO: Identidad institucional */}
            <Box
              sx={{
                flex: { xs: 'none', md: '0 0 45%' },
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                px: { xs: 2, md: 4, lg: 6 },
                py: { xs: 3, md: 0 },
                color: '#fff',
                textAlign: 'center',
                position: 'relative',
              }}
            >
              {/* Logo con efecto */}
              <Box
                sx={{
                  mb: { xs: 2, md: 3 },
                  position: 'relative',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: { xs: 140, sm: 180, md: 220 },
                    height: { xs: 140, sm: 180, md: 220 },
                    borderRadius: '50%',
                    background:
                      'radial-gradient(circle, rgba(25, 118, 210, 0.2) 0%, transparent 70%)',
                    filter: 'blur(20px)',
                  },
                }}
              >
                <img
                  src={Logo}
                  alt="Policía de Tucumán"
                  style={{
                    width: isMobile ? 100 : isTablet ? 140 : 180,
                    height: isMobile ? 105 : isTablet ? 147 : 189,
                    objectFit: 'contain',
                    filter: 'drop-shadow(0 8px 16px rgba(0,0,0,0.3))',
                    position: 'relative',
                    zIndex: 1,
                  }}
                />
              </Box>

              {/* Título institucional */}
              <Stack spacing={1.5} sx={{ mb: { xs: 2, md: 4 } }}>
                <Typography
                  variant={isMobile ? 'h5' : 'h4'}
                  sx={{
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '1px',
                    textShadow: '0 4px 12px rgba(0,0,0,0.5)',
                    fontSize: { xs: '1.3rem', sm: '1.6rem', md: '2rem' },
                  }}
                >
                  Policía de Tucumán
                </Typography>
                <Typography
                  variant={isMobile ? 'body1' : 'h6'}
                  sx={{
                    fontWeight: 500,
                    opacity: 0.95,
                    letterSpacing: '0.5px',
                    fontSize: { xs: '0.95rem', sm: '1.1rem', md: '1.25rem' },
                  }}
                >
                  Sistema de Gestión de Resoluciones
                </Typography>
              </Stack>

              {/* Badge institucional */}
              {!isMobile && (
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    px: 3,
                    py: 1.5,
                    borderRadius: 2,
                    backgroundColor: 'rgba(255,255,255,0.1)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(100, 181, 246, 0.3)',
                  }}
                >
                  <SecurityRounded sx={{ color: '#64b5f6', fontSize: 28 }} />
                  <Box sx={{ textAlign: 'left' }}>
                    <Typography
                      variant="caption"
                      sx={{
                        display: 'block',
                        fontSize: '0.7rem',
                        opacity: 0.8,
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                      }}
                    >
                      Acceso Seguro
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ fontWeight: 600, fontSize: '0.9rem' }}
                    >
                      Personal Autorizado
                    </Typography>
                  </Box>
                </Box>
              )}
            </Box>

            {/* ✨ PANEL DERECHO: Formulario de login */}
            <Box
              sx={{
                flex: { xs: 'none', md: '0 0 55%' },
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Paper
                elevation={24}
                sx={{
                  width: '100%',
                  maxWidth: 480,
                  p: { xs: 3, sm: 4, md: 5 },
                  borderRadius: 3,
                  // ✨ Usa colores del tema
                  backgroundColor: isDarkMode
                    ? 'rgba(30, 30, 30, 0.95)'
                    : 'rgba(255, 255, 255, 0.98)',
                  backdropFilter: 'blur(20px)',
                  border: isDarkMode
                    ? '1px solid rgba(100, 181, 246, 0.3)'
                    : '1px solid rgba(100, 181, 246, 0.2)',
                  boxShadow: isDarkMode
                    ? '0 20px 60px rgba(0,0,0,0.6)'
                    : '0 20px 60px rgba(0,0,0,0.3)',
                  transition: 'all 0.3s ease',
                }}
              >
                {/* Header del formulario */}
                <Stack spacing={1} sx={{ mb: 4, textAlign: 'center' }}>
                  <Typography
                    variant={isMobile ? 'h5' : 'h4'}
                    sx={{
                      fontWeight: 700,
                      color: 'text.primary', // ✨ Usa color del tema
                      fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2rem' },
                    }}
                  >
                    Iniciar Sesión
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ color: 'text.secondary', fontSize: '0.9rem' }}
                  >
                    Ingrese sus credenciales para acceder
                  </Typography>
                </Stack>

                {/* Alerta de error */}
                {error && (
                  <Fade in>
                    <Alert
                      severity="error"
                      onClose={() => setError('')}
                      sx={{
                        mb: 3,
                        borderRadius: 2,
                        '& .MuiAlert-message': {
                          fontSize: '0.85rem',
                        },
                      }}
                    >
                      {error}
                    </Alert>
                  </Fade>
                )}

                {/* Formulario */}
                <Box component="form" onSubmit={handleLogin}>
                  <Stack spacing={3}>
                    {/* Campo Usuario */}
                    <TextField
                      fullWidth
                      label="Usuario"
                      variant="outlined"
                      value={username}
                      onChange={e => setUsername(e.target.value)}
                      autoComplete="username"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Person sx={{ color: 'primary.main' }} />
                          </InputAdornment>
                        ),
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                          // ✨ Usa colores del tema
                          backgroundColor: isDarkMode
                            ? 'rgba(255, 255, 255, 0.05)'
                            : '#f8f9fa',
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            backgroundColor: isDarkMode
                              ? 'rgba(255, 255, 255, 0.08)'
                              : '#fff',
                          },
                          '&.Mui-focused': {
                            backgroundColor: isDarkMode
                              ? 'rgba(255, 255, 255, 0.1)'
                              : '#fff',
                            '& fieldset': {
                              borderColor: 'primary.main',
                              borderWidth: 2,
                            },
                          },
                        },
                      }}
                    />

                    {/* Campo Contraseña */}
                    <TextField
                      fullWidth
                      label="Contraseña"
                      type={showPassword ? 'text' : 'password'}
                      variant="outlined"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      autoComplete="current-password"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Lock sx={{ color: 'primary.main' }} />
                          </InputAdornment>
                        ),
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              onClick={() => setShowPassword(!showPassword)}
                              edge="end"
                              size="small"
                            >
                              {showPassword ? (
                                <VisibilityOff />
                              ) : (
                                <Visibility />
                              )}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                          // ✨ Usa colores del tema
                          backgroundColor: isDarkMode
                            ? 'rgba(255, 255, 255, 0.05)'
                            : '#f8f9fa',
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            backgroundColor: isDarkMode
                              ? 'rgba(255, 255, 255, 0.08)'
                              : '#fff',
                          },
                          '&.Mui-focused': {
                            backgroundColor: isDarkMode
                              ? 'rgba(255, 255, 255, 0.1)'
                              : '#fff',
                            '& fieldset': {
                              borderColor: 'primary.main',
                              borderWidth: 2,
                            },
                          },
                        },
                      }}
                    />

                    {/* Botón de ingreso */}
                    <Button
                      type="submit"
                      variant="contained"
                      fullWidth
                      size="large"
                      disabled={loading}
                      sx={{
                        py: 1.5,
                        mt: 2,
                        fontSize: '1rem',
                        fontWeight: 600,
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                        borderRadius: 2,
                        background:
                          'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
                        boxShadow: '0 4px 12px rgba(25, 118, 210, 0.4)',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          background:
                            'linear-gradient(135deg, #1565c0 0%, #0d47a1 100%)',
                          boxShadow: '0 6px 20px rgba(25, 118, 210, 0.5)',
                          transform: 'translateY(-2px)',
                        },
                        '&:active': {
                          transform: 'translateY(0)',
                        },
                        '&:disabled': {
                          background: '#bdbdbd',
                        },
                      }}
                    >
                      {loading ? (
                        <CircularProgress size={24} sx={{ color: '#fff' }} />
                      ) : (
                        'Ingresar'
                      )}
                    </Button>
                  </Stack>
                </Box>

                {/* Footer del formulario */}
                <Box sx={{ mt: 4, textAlign: 'center' }}>
                  <Typography
                    variant="caption"
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 0.5,
                      color: 'text.secondary',
                      fontSize: '0.75rem',
                    }}
                  >
                    <SecurityRounded sx={{ fontSize: 14 }} />
                    Conexión segura y encriptada
                  </Typography>
                </Box>
              </Paper>
            </Box>
          </Box>
        </Fade>
      </Container>
    </Box>
  );
};

export default Login;
