import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
const Home = () => {
  return (
    <div>
      <h1>Home</h1>
      <TextField
        id="outlined-basic"
        label="Ingrese el Usuario"
        variant="outlined"
      />
      <TextField
        id="outlined-basic"
        label="Ingrese la contraseña"
        variant="outlined"
      />
      <Button variant="contained">Contained</Button>
      <input type="text" placeholder="Ingresa el Usuario" />
    </div>
  );
};

export default Home;
