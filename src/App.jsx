import Login from './pages/login/Login';
import Navbar from './Components/layouts/navbar/Navbar';
import Counter from './Components/common/Counter/Counter';
import Main from './Components/main/Main';

// import LoginCard from './Components/common/loginCard/LoginBoton';
// import LoginCard1 from './Components/common/loginCard/LoginUsuario';
// import LoginCard2 from './Components/common/loginCard/LoginContraseña';

function App() {
  return (
    <div>
      <Navbar />
      <Login />
      <Counter />
      <Main />
    </div>
  );
}

export default App;
