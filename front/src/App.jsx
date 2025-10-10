import React, { useState, useEffect } from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
  useNavigate,
  useLocation,
} from 'react-router-dom';
import {
  ThemeProvider,
  CssBaseline,
  useMediaQuery,
  useTheme,
  Box,
} from '@mui/material';
import { customTheme } from './themeConfig';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './Components/ProtectedRoute';
import Navbar from './Components/layouts/navbar/Navbar';
import Login from './pages/login/Login';
import Register from './pages/register/Register';
import Footer from './Components/layouts/footer/Footer';
import HomeContainer from './pages/Home/HomeContainer';
import Cargas from './pages/Cargas/Cargas';
import Busquedas from './pages/busquedas/busquedas';
import ModificarResolucion from './pages/Modificar/ModificarResolucion';
import MostrarResolucion from './pages/MostrarLibro/MostrarLibro';
import DiagnosticoApp from './pages/Diagnostico/DiagnosticoApp';
import AdminEnlaces from './pages/AdminEnlaces/AdminEnlaces';

const App = () => {
  const [darkMode, setDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  // Component to handle redirects from 404 fallback
  const RedirectHandler = () => {
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
      const redirectPath = sessionStorage.getItem('redirectPath');
      if (redirectPath && location.pathname === '/') {
        sessionStorage.removeItem('redirectPath');
        navigate(redirectPath, { replace: true });
      }
    }, [navigate, location]);

    return null;
  };
  return (
    <ThemeProvider theme={customTheme}>
      <CssBaseline />
      <AuthProvider>
        <BrowserRouter>
          <RedirectHandler />
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              minHeight: '100vh',
              position: 'relative',
            }}
          >
            <Navbar darkMode={darkMode} toggleDarkMode={toggleDarkMode} />{' '}
            <Box
              component="main"
              sx={{
                flex: 1,
                paddingTop: '135px', // Height of navbar
                paddingBottom: '60px', // Height of footer
                '@media (max-width: 600px)': {
                  paddingTop: '90px',
                  paddingBottom: '50px',
                },
              }}
            >
              {' '}
              <Routes>
                {' '}
                <Route path={'/'} element={<Login />} />
                <Route path={'/login'} element={<Login />} />
                <Route path={'/register'} element={<Register />} />
                <Route path={'/diagnostico'} element={<DiagnosticoApp />} />
                <Route
                  path={'/home'}
                  element={
                    <ProtectedRoute>
                      <HomeContainer />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path={'/buscador'}
                  element={
                    <ProtectedRoute>
                      <Busquedas />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path={'/cargas'}
                  element={
                    <ProtectedRoute requiredRole="secretaria">
                      <Cargas />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/modificar/:id"
                  element={
                    <ProtectedRoute requiredRole="secretaria">
                      <ModificarResolucion />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path={'/mostrar/:id'}
                  element={
                    <ProtectedRoute>
                      <MostrarResolucion />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path={'/admin/enlaces'}
                  element={
                    <ProtectedRoute>
                      <AdminEnlaces />
                    </ProtectedRoute>
                  }
                />
                {/* <Route path={'*'} element={} /> */}{' '}
              </Routes>
            </Box>{' '}
            <Footer darkMode={darkMode} />
          </div>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
