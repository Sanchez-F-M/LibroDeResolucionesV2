import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './Components/layouts/navbar/Navbar';
import Login from './pages/login/Login';
import Footer from './Components/layouts/footer/Footer';
import Main from './pages/Home/HomeContainer';
import HomeContainer from './pages/Home/HomeContainer';
import Busquedas from './pages/busquedas/busquedas';
import Cargas from './pages/Cargas/Cargas';

const App = () => {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path={'/'} element={<Login />} />
        <Route path={'/home'} element={<HomeContainer />} />
        <Route path={'/buscador'} element={<Busquedas />} />
        <Route path={'/cargas'} element={<Cargas />} />
        {/* <Route path={'*'} element={} /> */}
      </Routes>
      <Footer />
    </BrowserRouter>
  );
};

export default App;
