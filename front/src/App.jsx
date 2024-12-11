import React from 'react';
import{BrowserRouter, Routers} from '
import Navbar from './Components/layouts/navbar/Navbar';
import Login from './pages/login/Login';
import Footer from './Components/layouts/footer/Footer';
import Main from './pages/Home/HomeContainer';

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
