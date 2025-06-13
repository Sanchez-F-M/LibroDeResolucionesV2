import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verificar si hay usuario logueado al cargar la aplicación
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (token && userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Error parsing user data:', error);
        logout();
      }
    }
    setLoading(false);
  }, []);

  const login = (userData, token) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setIsAuthenticated(false);
  };

  const hasRole = (requiredRole) => {
    if (!user || !user.role) return false;
    
    const roleHierarchy = {
      'admin': ['admin', 'secretaria', 'usuario'],
      'secretaria': ['secretaria', 'usuario'],
      'usuario': ['usuario']
    };
    
    return roleHierarchy[user.role]?.includes(requiredRole) || false;
  };

  const canView = () => hasRole('usuario');
  const canEdit = () => hasRole('secretaria');
  const canDelete = () => hasRole('admin');
  const isAdmin = () => hasRole('admin');
  const isSecretaria = () => hasRole('secretaria');

  const value = {
    user,
    isAuthenticated,
    loading,
    login,
    logout,
    hasRole,
    canView,
    canEdit,
    canDelete,
    isAdmin,
    isSecretaria
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
