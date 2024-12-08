import './Main.css';
import Button from '@mui/material/Button';

function Main() {
  let Usuario = 'SecretariaPrivadaDeJefaturaDePoliciaDeTucuman';
  let contraseña = 19953010;
  const Ingresar = () => {
    console.log('Ingresar' + Usuario + ':' + contraseña);
  };

  return (
    <div className="alert">
      <main>
        <h1>Main</h1>
        {/* <p>Este es el componente Main de la app.</p> */}
        <Button variant="contained" onClick={() => alert('565461544')}>
          contactar con sistemas{' '}
        </Button>
        <Button variant="" onClick={Ingresar}>
          {' '}
          {/* Ingresar */}
        </Button>
      </main>
    </div>
  );
}

export default Main;
