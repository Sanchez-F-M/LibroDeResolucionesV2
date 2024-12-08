import Login from './pages/login/Login';
import Navbar from './Components/layouts/navbar/Navbar';
import Counter from './Components/common/Counter/Counter';
import Main from './Components/main/Main';
import { useState } from 'react';
import HomeContainer from './pages/Home/HomeContainer';
import Footer from './Components/layouts/footer/Footer';

function App() {
  const [botonIngresar, setBotonIngresar] = useState(false);
  const handleClick = () => {
    setBotonIngresar(!botonIngresar);
  };
  const [mensajeIngreso, setmensajeIngreso] = useState(
    'Hola ingresaste con exito'
  );
  const CambiarMensaje = () => {
    if (botonIngresar === 'Hola ingresaste con exito') {
      setmensajeIngreso('NO pudiste ingresar');
    } else {
      setmensajeIngreso('Hola ingresaste con exito');
    }
  };
  return (
    <div>
      <Navbar />
      {/* {botonIngresar ? <Login /> : null}
      <button onClick={handleClick}>
        {botonIngresar ? 'Salir' : 'Ingresar'}
      </button> */}

      {/* <Counter /> */}
      <Main />
      <HomeContainer />
      <themeConfig />
      {/* <ItemDetailContainer /> */}
      <Footer />
    </div>
  );
}

export default App;
