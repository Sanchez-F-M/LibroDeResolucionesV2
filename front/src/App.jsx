import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { ThemeProvider, CssBaseline, useMediaQuery, useTheme, Box } from '@mui/material';
import { customTheme } from './themeConfig';
import Navbar from './Components/layouts/navbar/Navbar';
import Login from './pages/login/Login';
import Footer from './Components/layouts/footer/Footer';
import HomeContainer from './pages/Home/HomeContainer';
import Cargas from './pages/Cargas/Cargas';
import Busquedas from './pages/busquedas/busquedas';
import ModificarResolucion from './pages/Modificar/ModificarResolucion';
import MostrarResolucion from './pages/MostrarLibro/MostrarLibro';
import DiagnosticoApp from './pages/Diagnostico/DiagnosticoApp';

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
          <Navbar darkMode={darkMode} toggleDarkMode={toggleDarkMode} />          <Box
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
            <Routes>
              <Route path={'/'} element={<Login />} />
              <Route path={'/diagnostico'} element={<DiagnosticoApp />} />
              <Route path={'/home'} element={<HomeContainer />} />
              <Route path={'/buscador'} element={<Busquedas />} />
              <Route path={'/cargas'} element={<Cargas />} />
              <Route path="/modificar/:id" element={<ModificarResolucion />} />
              <Route path={'/mostrar/:id'} element={<MostrarResolucion />} />
              {/* <Route path={'*'} element={} /> */}            </Routes>
          </Box>
          <Footer darkMode={darkMode} />
        </div>
      </BrowserRouter>
    </ThemeProvider>
  );
};

export default App;
