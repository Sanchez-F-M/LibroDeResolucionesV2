import React, { useState, useEffect } from 'react';
import { Container, Typography, Button, Alert, Box, CircularProgress } from '@mui/material';

const DiagnosticoApp = () => {
  const [apiStatus, setApiStatus] = useState('testing');
  const [apiUrl, setApiUrl] = useState('');
  const [error, setError] = useState('');
  const [loginTest, setLoginTest] = useState('');

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

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        🔧 Diagnóstico de Aplicación
      </Typography>
      
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6">Variables de Entorno:</Typography>
        <Typography>API URL: <strong>{apiUrl}</strong></Typography>
        <Typography>Entorno: <strong>{import.meta.env.VITE_APP_ENV || 'development'}</strong></Typography>
      </Box>

      <Box sx={{ mb: 3 }}>
        <Typography variant="h6">Estado del Backend:</Typography>
        {apiStatus === 'testing' && (
          <Alert severity="info" sx={{ mt: 1 }}>
            <CircularProgress size={20} sx={{ mr: 1 }} />
            Probando conexión...
          </Alert>
        )}
        {apiStatus === 'success' && (
          <Alert severity="success" sx={{ mt: 1 }}>
            ✅ Backend funcionando correctamente
          </Alert>
        )}
        {apiStatus === 'error' && (
          <Alert severity="error" sx={{ mt: 1 }}>
            ❌ Error: {error}
          </Alert>
        )}
      </Box>

      <Box sx={{ mb: 3 }}>
        <Button 
          variant="contained" 
          onClick={testConnection}
          sx={{ mr: 2 }}
        >
          🔄 Probar Conexión
        </Button>
        
        <Button 
          variant="contained" 
          color="secondary"
          onClick={testLogin}
          disabled={apiStatus !== 'success'}
        >
          🔐 Probar Login
        </Button>
        
        {loginTest === 'testing' && (
          <CircularProgress size={20} sx={{ ml: 2 }} />
        )}
        {loginTest === 'success' && (
          <Alert severity="success" sx={{ mt: 2 }}>
            ✅ Login funcionando correctamente
          </Alert>
        )}
        {loginTest === 'error' && (
          <Alert severity="error" sx={{ mt: 2 }}>
            ❌ Error en login: {error}
          </Alert>
        )}
      </Box>

      <Box sx={{ mb: 3 }}>
        <Typography variant="h6">Instrucciones:</Typography>
        <Typography variant="body2">
          1. Si el backend está funcionando, la aplicación principal debería cargar<br/>
          2. Si hay errores, revise la consola del navegador (F12)<br/>
          3. Use las credenciales: admin / admin123
        </Typography>
      </Box>
    </Container>
  );
};

export default DiagnosticoApp;
