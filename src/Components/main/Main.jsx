import './Main.css';
import Button from '@mui/material/Button';

function Main() {
  let Usuario = 'SecretariaPrivadaDeJefaturaDePoliciaDeTucuman';
  let contraseña = 19953010;
  const Ingresar = () => {
    console.log('Ingresar' + Usuario + ':' + contraseña);
  };

  return (
    <div>
      <main>
        <h1>Main</h1>
        <p>Este es el componente Main de la app.</p>
        <Button
          variant="contained"
          onClick={() => alert('Usuario o contraseña Incorrectos')}
        >
          Prueba de Alert
        </Button>
        <Button variant="contained" onClick={Ingresar}>
          {' '}
          Ingresar
        </Button>
      </main>
    </div>
  );
}

export default Main;
