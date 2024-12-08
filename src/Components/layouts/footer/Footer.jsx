import { useState } from 'react';
import Logo from '../../../assets/logo3-removebg-preview (1).png';
import './footer.css';

const Footer = () => {
  const [darkMode, setDarkMode] = useState(true);
  return (
    <div className={darkMode ? 'container-footer-dark' : 'container-footer'}>
      <div className="titulos">
        {/* <img src={Logo} alt="Escudo Policia de Tucumán" /> */}
      </div>
      <h3>Policía de Tucumán</h3>
      <h2>Secretaria Privada Policía de Tucumán</h2>
      <button
        variant="contained"
        className="toggle-btn"
        onClick={() => setDarkMode(!darkMode)}
      >
        Volver al Inicio
      </button>

      {/* al lado izq el logo y el titulo  */}
      {/* al centro el cuando de ingreso a la app   */}
      {/* a la derecha el icono de registro*/}
    </div>
  );
};

export default Footer;
