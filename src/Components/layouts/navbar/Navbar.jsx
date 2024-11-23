import { useState } from 'react';
import Logo from '../../../assets/logo3-removebg-preview (1).png';
import './Navbar.css';

const Navbar = () => {
  const [darkMode, setDarkMode] = useState(true);
  return (
    <div className={darkMode ? 'container-navbar-dark' : 'container-navbar'}>
      <div className="titulos">
        <img src={Logo} alt="Escudo Policia de Tucumán" />
      </div>
      <h1>Policía de Tucumán</h1>
      <h2>Libro de Resoluciones</h2>
      <button className="toggle-btn" onClick={() => setDarkMode(!darkMode)}>
        Cambiar Modo
      </button>

      {/* al lado izq el logo y el titulo  */}
      {/* al centro el cuando de ingreso a la app   */}
      {/* a la derecha el icono de registro*/}
    </div>
  );
};

export default Navbar;
