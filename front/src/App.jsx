import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './Components/layouts/navbar/Navbar';
import Login from './pages/login/Login';
import Footer from './Components/layouts/footer/Footer';
import Main from './pages/Home/HomeContainer';

const App = () => {
  return (
    <div>
      <Navbar />
      <Routes>
        <Route path={'/'} element={<Login />} />
        <Route path={'/home'} element={<HomeContainer />} />
        <Route path={'/buscador'} element={<Busquedas />} />
        <Route path={'/cargas'} element={<Cargas />} />
        {/* <Route path={'*'} element={} /> */}
      </Routes>
      <Footer />
    </div>
  );
};

export default App;
