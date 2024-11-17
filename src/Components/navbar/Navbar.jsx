import './Navbar.css';

const Navbar = () => {
  let Usuario = 'SecretariaPrivadaDeJefaturaDePoliciaDeTucuman';
  let contraseña = 19953010;
  const Ingresar = () => {
    console.log('Ingresar' + Usuario + ':' + contraseña);
  };
  return (
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
      <button onClick={Ingresar}> Ingresar</button>
    </nav>
  );
};

export default Navbar;
