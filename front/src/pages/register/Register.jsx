import React, { useState } from 'react';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  useMediaQuery,
  useTheme,
  IconButton,
  InputAdornment,
} from '@mui/material';
import { Visibility, VisibilityOff, PersonAdd, ArrowBack } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import api from '../../api/api';

const Register = () => {
  const [formData, setFormData] = useState({
    nombre: '',
    contrasena: '',
    confirmarContrasena: '',
    rol: 'usuario'
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    // Limpiar errores cuando el usuario escriba
    if (error) setError('');
  };

  const validateForm = () => {
    if (!formData.nombre.trim()) {
      setError('El nombre de usuario es obligatorio');
      return false;
    }
    
    if (formData.nombre.length < 3) {
      setError('El nombre de usuario debe tener al menos 3 caracteres');
      return false;
    }
    
    if (!formData.contrasena) {
      setError('La contraseña es obligatoria');
      return false;
    }
    
    if (formData.contrasena.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return false;
    }
    
    if (formData.contrasena !== formData.confirmarContrasena) {
      setError('Las contraseñas no coinciden');
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      console.log('🔐 Registrando usuario:', { 
        nombre: formData.nombre, 
        rol: formData.rol 
      });
      
      const response = await api.post('/api/user/register', {
        Nombre: formData.nombre,
        Contrasena: formData.contrasena,
        Rol: formData.rol
      });
      
      console.log('✅ Usuario registrado:', response.data);
      
      setSuccess(`Usuario "${formData.nombre}" registrado exitosamente con rol "${formData.rol}"`);
      
      // Limpiar formulario
      setFormData({
        nombre: '',
        contrasena: '',
        confirmarContrasena: '',
        rol: 'usuario'
      });
      
      // Redirigir al login después de 2 segundos
      setTimeout(() => {
        navigate('/login');
      }, 2000);
      
    } catch (err) {
      console.error('❌ Error en registro:', err);
      
      if (err.response?.data?.error) {
        setError(err.response.data.error);
      } else if (err.response?.status === 400) {
        setError('Datos inválidos. Verifique la información ingresada.');
      } else if (err.response?.status === 409) {
        setError('El nombre de usuario ya existe. Elija otro nombre.');
      } else {
        setError('Error al registrar usuario. Intente nuevamente.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container 
      maxWidth="sm" 
      sx={{ 
        minHeight: 'calc(100vh - 100px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        py: { xs: 2, sm: 4 },
        px: { xs: 2, sm: 3 },
      }}
    >
      <Box sx={{ width: '100%', maxWidth: { xs: '100%', sm: '450px' } }}>
        <Paper 
          elevation={8} 
          sx={{ 
            p: { xs: 4, sm: 6 },
            borderRadius: { xs: 2, sm: 3 },
            boxShadow: theme.shadows[8],
          }}
        >
          {/* Header */}
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <IconButton 
              onClick={() => navigate('/login')}
              sx={{ mr: 1 }}
              color="primary"
            >
              <ArrowBack />
            </IconButton>
            <PersonAdd sx={{ mr: 1, color: theme.palette.primary.main }} />
            <Typography 
              variant={isMobile ? 'h5' : 'h4'} 
              sx={{
                fontWeight: 'bold',
                color: theme.palette.primary.main,
              }}
            >
              Registrar Usuario
            </Typography>
          </Box>

          {/* Messages */}
          {error && (
            <Alert 
              severity="error" 
              sx={{ mb: 3, borderRadius: 1 }}
            >
              {error}
            </Alert>
          )}

          {success && (
            <Alert 
              severity="success" 
              sx={{ mb: 3, borderRadius: 1 }}
            >
              {success}
            </Alert>
          )}

          {/* Form */}
          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Nombre de usuario"
              name="nombre"
              variant="outlined"
              value={formData.nombre}
              onChange={handleChange}
              disabled={loading}
              sx={{ 
                mb: 3,
                '& .MuiOutlinedInput-root': {
                  borderRadius: { xs: 1, sm: 2 },
                },
              }}
              size={isMobile ? 'small' : 'medium'}
            />

            <TextField
              fullWidth
              label="Contraseña"
              name="contrasena"
              type={showPassword ? 'text' : 'password'}
              variant="outlined"
              value={formData.contrasena}
              onChange={handleChange}
              disabled={loading}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{ 
                mb: 3,
                '& .MuiOutlinedInput-root': {
                  borderRadius: { xs: 1, sm: 2 },
                },
              }}
              size={isMobile ? 'small' : 'medium'}
            />

            <TextField
              fullWidth
              label="Confirmar contraseña"
              name="confirmarContrasena"
              type={showConfirmPassword ? 'text' : 'password'}
              variant="outlined"
              value={formData.confirmarContrasena}
              onChange={handleChange}
              disabled={loading}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      edge="end"
                    >
                      {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{ 
                mb: 3,
                '& .MuiOutlinedInput-root': {
                  borderRadius: { xs: 1, sm: 2 },
                },
              }}
              size={isMobile ? 'small' : 'medium'}
            />

            <FormControl 
              fullWidth 
              sx={{ 
                mb: 4,
                '& .MuiOutlinedInput-root': {
                  borderRadius: { xs: 1, sm: 2 },
                },
              }}
              size={isMobile ? 'small' : 'medium'}
            >
              <InputLabel>Rol del usuario</InputLabel>
              <Select
                name="rol"
                value={formData.rol}
                onChange={handleChange}
                label="Rol del usuario"
                disabled={loading}
              >
                <MenuItem value="usuario">👤 Usuario</MenuItem>
                <MenuItem value="secretaria">📋 Secretaría</MenuItem>
                <MenuItem value="admin">🔧 Administrador</MenuItem>
              </Select>
            </FormControl>

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
                boxShadow: theme.shadows[4],
                '&:hover': {
                  boxShadow: theme.shadows[8],
                  transform: 'translateY(-1px)',
                },
                transition: 'all 0.3s ease',
              }}
            >
              {loading ? 'Registrando...' : 'Registrar Usuario'}
            </Button>

            <Box sx={{ mt: 3, textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                ¿Ya tienes una cuenta?{' '}
                <Button 
                  onClick={() => navigate('/login')}
                  variant="text"
                  size="small"
                  disabled={loading}
                >
                  Inicia sesión aquí
                </Button>
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default Register;
