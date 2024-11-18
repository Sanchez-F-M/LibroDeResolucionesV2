import Navbar from './Components/navbar/Navbar';
import Footer from './Components/footer/Footer';
import Main from './Components/main/Main';
import Home from './pages/Home';
import Login from './pages/Login';
import Cargas from './pages/Cargas';
import Busquedas from './pages/busquedas';
function App() {
  return (
    <div>
      <Navbar />
      <Main />
      <Home />
      <Footer />
      <Login />
      <Cargas />
      <Busquedas />
    </div>
  );
}

export default App;
