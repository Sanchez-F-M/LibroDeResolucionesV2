import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './Components/layouts/navbar/Navbar';
import Login from './pages/login/Login';
import Footer from './Components/layouts/footer/Footer';
import HomeContainer from './pages/Home/HomeContainer';
import Cargas from './pages/Cargas/Cargas';
import Busquedas from './pages/busquedas/busquedas';

const App = () => {
  const [darkMode, setDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <BrowserRouter>
      <div>
        <Navbar darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
        <Routes>
          <Route path={'/'} element={<Login />} />
          <Route path={'/home'} element={<HomeContainer />} />
          <Route path={'/buscador'} element={<Busquedas />} />
          <Route path={'/cargas'} element={<Cargas />} />
          {/* <Route path={'*'} element={} /> */}
        </Routes>
        <Footer darkMode={darkMode} />
      </div>
    </BrowserRouter>
  );
};

export default App;
