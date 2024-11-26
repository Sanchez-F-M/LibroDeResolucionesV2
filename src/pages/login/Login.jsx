import LoginCard3 from '../../Components/common/loginCard/LoginUsuario';
import LoginCard2 from '../../Components/common/loginCard/LoginContraseña';
import LoginCard1 from '../../Components/common/loginCard/LoginBoton';
import Button from '@mui/material/Button';
const Login = ({ y }) => {
  return (
    <div className="LoginC">
      <h3>Login</h3>
      <Button variant="contained">INGRESAR</Button>
      <LoginCard3 usuario="SecretariaPrivPdT" />
      <LoginCard2 contraseña={20242011} />
      <LoginCard1 />
    </div>
  );
};

export default Login;
