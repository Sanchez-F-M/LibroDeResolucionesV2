import './Navbar.css';
import logo from '../../assets/logo3-removebg-preview (1).jpg';
const Navbar = () => {
  return (
    <div>
      <img src={logo} alt="Escudo Policía de Tucumán" />
      <h2>Policía de Tucumán</h2>
      <nav>
        <ul>
          <h1 className="title">Libro de resoluciones</h1>
          <li>
            <a href="http://"></a>Home
          </li>
          <li>
            <a href="http://"></a>About
          </li>
          <li>
            <a href="http://"></a>Contact
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Navbar;
