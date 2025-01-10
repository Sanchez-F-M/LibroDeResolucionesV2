import TextField from '@mui/material/TextField';

import './LoginCard.css';

const LoginCard = c => {
  console.log(c);
  return (
    <div className="login">
      <h3>Contraseña</h3>
      <TextField
        id="outlined-basic"
        label="Ingrese Contraseña"
        variant="outlined"
      />
    </div>
  );
};

export default LoginCard;
