import React from 'react';
import Navbar from './Components/layouts/navbar/Navbar';
import Login from '../src/pages/login/Login';
import Footer from './Components/layouts/footer/Footer';
import Main from '../src/pages/Home/HomeContainer';

const App = () => {
  return (
    <div>
      <Navbar />
      <Login />
      {/* <Main /> */}
      <Footer />
    </div>
  );
};

export default App;
