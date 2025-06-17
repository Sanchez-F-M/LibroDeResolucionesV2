import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Box, CircularProgress, Typography } from '@mui/material';

const ProtectedRoute = ({ children, requiredRole, requireAuth = true }) => {
  const { isAuthenticated, user, loading, hasRole } = useAuth();

  if (loading) {
    return (
      <Box 
        display="flex" 
        flexDirection="column"
        justifyContent="center" 
        alignItems="center" 
        minHeight="50vh"
      >
        <CircularProgress size={40} />
        <Typography variant="body1" sx={{ mt: 2 }}>
          Verificando autenticación...
        </Typography>
      </Box>
    );
  }

  // Si requiere autenticación y no está autenticado
  if (requireAuth && !isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Si requiere un rol específico y no lo tiene
  if (requiredRole && !hasRole(requiredRole)) {
    return (
      <Box 
        display="flex" 
        flexDirection="column"
        justifyContent="center" 
        alignItems="center" 
        minHeight="50vh"
        textAlign="center"
        sx={{ p: 3 }}
      >
        <Typography variant="h6" color="error" gutterBottom>
          Acceso Denegado
        </Typography>
        <Typography variant="body1" color="text.secondary">
          No tienes permisos para acceder a esta página.
        </Typography>        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          Rol requerido: {requiredRole} | Tu rol: {user?.Rol || user?.role || 'Sin rol'}
        </Typography>
      </Box>
    );
  }

  return children;
};

export default ProtectedRoute;
