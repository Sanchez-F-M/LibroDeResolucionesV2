import TextField from '@mui/material/TextField';

import './LoginCard.css';

const LoginCard = u => {
  console.log(u);
  return (
    <div className="login">
      <h3>Usuario</h3>
      <TextField
        id="outlined-basic"
        label="Ingrese Usuario"
        variant="outlined"
      />
    </div>
  );
};

export default LoginCard;
