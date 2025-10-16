import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Typography, 
  Button, 
  Alert, 
  Box, 
  CircularProgress,
  Paper,
  Stack,
  Card,
  CardContent,
  Chip,
  useMediaQuery,
  useTheme,
  Divider,
  Grid
} from '@mui/material';
import BuildIcon from '@mui/icons-material/Build';
import CloudIcon from '@mui/icons-material/Cloud';
import LoginIcon from '@mui/icons-material/Login';
import BookIcon from '@mui/icons-material/Book';
import RefreshIcon from '@mui/icons-material/Refresh';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import InfoIcon from '@mui/icons-material/Info';

const DiagnosticoApp = () => {
  const [apiStatus, setApiStatus] = useState('testing');
  const [apiUrl, setApiUrl] = useState('');
  const [error, setError] = useState('');
  const [loginTest, setLoginTest] = useState('');
  const [booksTest, setBooksTest] = useState('');

  // Responsive breakpoints
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));

  useEffect(() => {
    // Mostrar la URL de la API
    const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';
    setApiUrl(baseUrl);
    
    // Probar conexión automáticamente
    testConnection();
  }, []);

  const testConnection = async () => {
    try {
      setApiStatus('testing');
      const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';
      
      console.log('🔍 Probando conexión a:', baseUrl);
      
      const response = await fetch(`${baseUrl}/health`);
      const data = await response.json();
      
      console.log('✅ Respuesta del backend:', data);
      setApiStatus('success');
      
    } catch (error) {
      console.error('❌ Error de conexión:', error);
      setApiStatus('error');
      setError(error.message);
    }
  };

  const testLogin = async () => {
    try {
      setLoginTest('testing');
      const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';
      
      console.log('🔐 Probando login...');
      
      const response = await fetch(`${baseUrl}/api/user/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          Nombre: 'admin',
          Contrasena: 'admin123'
        })
      });
      
      const data = await response.json();
      console.log('🔐 Respuesta del login:', data);
      
      if (response.ok) {
        setLoginTest('success');
      } else {
        setLoginTest('error');
        setError(data.error || 'Error en login');
      }
      
    } catch (error) {
      console.error('❌ Error en login:', error);
      setLoginTest('error');
      setError(error.message);
    }
  };

  const testBooksAPI = async () => {
    try {
      setBooksTest('testing');
      const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';
      
      console.log('📚 Probando API de resoluciones...');
      
      const response = await fetch(`${baseUrl}/api/books/all`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      const data = await response.json();
      console.log('📚 Respuesta de API resoluciones:', data);
      
      if (response.ok) {
        setBooksTest('success');
        if (Array.isArray(data) && data.length > 0) {
          console.log(`✅ ${data.length} resoluciones encontradas`);
        } else {
          console.log('⚠️ No hay resoluciones en la base de datos');
        }
      } else {
        setBooksTest('error');
        setError(data.error || 'Error en API de resoluciones');
      }
      
    } catch (error) {
      console.error('❌ Error en API de resoluciones:', error);
      setBooksTest('error');
      setError(error.message);
    }
  };
  const getStatusIcon = (status) => {
    switch (status) {
      case 'success':
        return <CheckCircleIcon color="success" />;
      case 'error':
        return <ErrorIcon color="error" />;
      case 'testing':
        return <CircularProgress size={20} />;
      default:
        return <InfoIcon color="info" />;
    }
  };

  const getStatusSeverity = (status) => {
    switch (status) {
      case 'success':
        return 'success';
      case 'error':
        return 'error';
      case 'testing':
        return 'info';
      default:
        return 'info';
    }
  };

  return (
    <Container maxWidth="lg" sx={{ 
      mt: { xs: 10, md: 12 }, 
      mb: { xs: 4, md: 6 },
      px: { xs: 2, sm: 3, md: 4 }
    }}>
      {/* Header */}
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Stack direction="row" alignItems="center" justifyContent="center" spacing={2} sx={{ mb: 2 }}>
          <BuildIcon 
            color="primary" 
            sx={{ fontSize: { xs: 32, sm: 40, md: 48 } }} 
          />
          <Typography 
            variant={isMobile ? "h4" : "h3"} 
            color="primary" 
            fontWeight="bold"
          >
            Diagnóstico del Sistema
          </Typography>
        </Stack>
        <Typography 
          variant={isMobile ? "body1" : "h6"} 
          color="text.secondary"
          sx={{ maxWidth: 600, mx: 'auto' }}
        >
          Panel de diagnóstico para verificar el estado y funcionamiento de la aplicación
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* Variables de Entorno */}
        <Grid item xs={12} md={6}>
          <Card elevation={2} sx={{ height: '100%', borderRadius: 2 }}>
            <CardContent>
              <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
                <InfoIcon color="primary" />
                <Typography variant="h6" fontWeight="bold">
                  Configuración
                </Typography>
              </Stack>
              <Divider sx={{ mb: 2 }} />
              <Stack spacing={2}>
                <Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    URL de la API:
                  </Typography>
                  <Chip 
                    label={apiUrl || 'No configurada'} 
                    color="primary" 
                    variant="outlined"
                    sx={{ 
                      fontSize: { xs: '0.75rem', sm: '0.8rem' },
                      maxWidth: '100%',
                      height: 'auto',
                      '& .MuiChip-label': {
                        display: 'block',
                        whiteSpace: 'normal',
                        wordBreak: 'break-all'
                      }
                    }}
                  />
                </Box>
                <Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    Entorno:
                  </Typography>
                  <Chip 
                    label={import.meta.env.VITE_APP_ENV || 'development'} 
                    color="info" 
                    variant="outlined"
                    size={isMobile ? "small" : "medium"}
                  />
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* Estado del Backend */}
        <Grid item xs={12} md={6}>
          <Card elevation={2} sx={{ height: '100%', borderRadius: 2 }}>
            <CardContent>
              <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
                <CloudIcon color="primary" />
                <Typography variant="h6" fontWeight="bold">
                  Estado del Backend
                </Typography>
              </Stack>
              <Divider sx={{ mb: 2 }} />
              <Alert 
                severity={getStatusSeverity(apiStatus)} 
                icon={getStatusIcon(apiStatus)}
                sx={{ borderRadius: 2 }}
              >
                {apiStatus === 'testing' && 'Verificando conexión con el servidor...'}
                {apiStatus === 'success' && 'Conexión establecida correctamente'}
                {apiStatus === 'error' && `Error de conexión: ${error}`}
              </Alert>
            </CardContent>
          </Card>
        </Grid>

        {/* Botones de Control */}
        <Grid item xs={12}>
          <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
            <Typography variant="h6" fontWeight="bold" sx={{ mb: 3 }}>
              Pruebas del Sistema
            </Typography>
            <Stack 
              direction={{ xs: 'column', sm: 'row' }} 
              spacing={2}
              sx={{ mb: 3 }}
            >
              <Button 
                variant="contained" 
                startIcon={<RefreshIcon />}
                onClick={testConnection}
                fullWidth={isMobile}
                size={isMobile ? "large" : "medium"}
                sx={{ 
                  borderRadius: 2,
                  textTransform: 'none',
                  fontWeight: 600
                }}
              >
                Probar Conexión
              </Button>
              <Button 
                variant="contained"
                startIcon={<LoginIcon />}
                onClick={testLogin}
                fullWidth={isMobile}
                size={isMobile ? "large" : "medium"}
                sx={{ 
                  borderRadius: 2,
                  textTransform: 'none',
                  fontWeight: 600
                }}
              >
                Probar Login
              </Button>
              <Button 
                variant="contained"
                startIcon={<BookIcon />}
                onClick={testBooksAPI}
                fullWidth={isMobile}
                size={isMobile ? "large" : "medium"}
                sx={{ 
                  borderRadius: 2,
                  textTransform: 'none',
                  fontWeight: 600
                }}
              >
                Probar API Resoluciones
              </Button>
            </Stack>
          </Paper>
        </Grid>

        {/* Resultados de las Pruebas */}
        <Grid item xs={12} md={6}>
          <Card elevation={2} sx={{ height: '100%', borderRadius: 2 }}>
            <CardContent>
              <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
                <LoginIcon color="primary" />
                <Typography variant="h6" fontWeight="bold">
                  Test de Autenticación
                </Typography>
              </Stack>
              <Divider sx={{ mb: 2 }} />
              {loginTest ? (
                <Alert 
                  severity={getStatusSeverity(loginTest)} 
                  icon={getStatusIcon(loginTest)}
                  sx={{ borderRadius: 2 }}
                >
                  {loginTest === 'testing' && 'Probando autenticación...'}
                  {loginTest === 'success' && 'Sistema de login funcionando correctamente'}
                  {loginTest === 'error' && `Error en autenticación: ${error}`}
                </Alert>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  Haga clic en "Probar Login" para verificar la autenticación
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card elevation={2} sx={{ height: '100%', borderRadius: 2 }}>
            <CardContent>
              <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
                <BookIcon color="primary" />
                <Typography variant="h6" fontWeight="bold">
                  Test de API Resoluciones
                </Typography>
              </Stack>
              <Divider sx={{ mb: 2 }} />
              {booksTest ? (
                <Alert 
                  severity={getStatusSeverity(booksTest)} 
                  icon={getStatusIcon(booksTest)}
                  sx={{ borderRadius: 2 }}
                >
                  {booksTest === 'testing' && 'Verificando API de resoluciones...'}
                  {booksTest === 'success' && 'API de resoluciones funcionando correctamente'}
                  {booksTest === 'error' && `Error en API: ${error}`}
                </Alert>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  Haga clic en "Probar API Resoluciones" para verificar el servicio
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Instrucciones */}
        <Grid item xs={12}>
          <Paper elevation={1} sx={{ p: 3, borderRadius: 2, bgcolor: 'grey.50' }}>
            <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
              Instrucciones de Uso
            </Typography>
            <Stack spacing={1}>
              <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Box component="span" sx={{ fontWeight: 'bold', color: 'primary.main' }}>1.</Box>
                Si el backend está funcionando, la aplicación principal debería cargar correctamente
              </Typography>
              <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Box component="span" sx={{ fontWeight: 'bold', color: 'primary.main' }}>2.</Box>
                Si hay errores, revise la consola del navegador (F12) para más detalles
              </Typography>
              <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Box component="span" sx={{ fontWeight: 'bold', color: 'primary.main' }}>3.</Box>
                Use las credenciales de administrador: <strong>admin</strong> / <strong>admin123</strong>
              </Typography>
            </Stack>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default DiagnosticoApp;
