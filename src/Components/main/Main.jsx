import './Main.css';

function Main() {
  return (
    <div>
      <main>
        <h1>Main</h1>
        <p>Este es el componente Main de la app.</p>
        <button onClick={() => alert('Usuario o contraseña Incorrectos')}>
          Prueba de Alert
        </button>
      </main>
    </div>
  );
}

export default Main;
