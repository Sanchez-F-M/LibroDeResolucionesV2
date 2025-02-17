import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  Grid,
  Container,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

const ModificarResolucion = ({ numeroResolucion }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    input1: '',
    input2: '',
  });

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = () => {
    // Aquí iría la lógica para guardar los cambios
    console.log('Datos modificados:', formData);
    navigate('/buscador');
  };

  return (
    <Container
      maxWidth="md"
      sx={{
        marginTop: '200px',
        marginBottom: '95px',
        padding: '0',
        gap: '50px',
        textAlign: 'center',
      }}
    >
      <Card>
        <CardContent>
          <Typography variant="h4" gutterBottom align="center">
            Resolución N°: {numeroResolucion}
          </Typography>
          <Grid
            container
            spacing={3}
            direction="column"
            sx={{ padding: 2, gap: 2 }}
          >
            <Grid item>
              <TextField
                fullWidth
                label="Modificación de Asunto"
                name="input1"
                value={formData.input1}
                onChange={handleChange}
                variant="outlined"
              />
            </Grid>
            <Grid item>
              <TextField
                fullWidth
                label="Modificación de Referencia"
                name="input2"
                value={formData.input2}
                onChange={handleChange}
                variant="outlined"
              />
            </Grid>

            <Grid item>
              <Button
                variant="contained"
                color="primary"
                fullWidth
                onClick={handleSubmit}
              >
                Guardar Cambios
              </Button>
            </Grid>
            <Grid item>
              <Link to="/buscador">
                <Button variant="contained" color="primary" fullWidth>
                  Volver al Buscador
                </Button>
              </Link>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Container>
  );
};

export default ModificarResolucion;
