import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Button,
  CardMedia,
  Grid,
  TextField,
  InputAdornment,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';

const busquedas = () => {
  const [imageUrl, setImageUrl] = useState('');
  const [previewUrl, setPreviewUrl] = useState('');
  const [showInputs, setShowInputs] = useState(false);

  const handleSearch = () => {
    setPreviewUrl(imageUrl);
  };

  const handleModify = () => {
    setShowInputs(true);
  };

  return (
    <Grid
      container
      position="sticky"
      spacing={4}
      height="550px"
      justifyContent="center"
      style={{ marginTop: '150px' }}
    >
      <Grid item xs={12} sm={8} md={6}>
        <Card>
          <CardContent>
            <Typography
              variant="h4"
              component="div"
              style={{ marginBottom: '80px' }}
            >
              Buscar Archivo
            </Typography>
            <Grid container spacing={1} alignItems="center">
              <Grid item xs={8}>
                <TextField
                  label="Resolución//Asunto//Referencia"
                  variant="outlined"
                  fullWidth
                  value={imageUrl}
                  onChange={e => setImageUrl(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={4}>
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  onClick={handleSearch}
                >
                  Buscar
                </Button>
              </Grid>
              <div>
                <FormControl sx={{ padding: '16px', gap: '10px' }}>
                  <FormLabel id="demo-row-radio-buttons-group-label">
                    Buscado por:
                  </FormLabel>
                  <RadioGroup
                    row
                    aria-labelledby="demo-row-radio-buttons-group-label"
                    name="row-radio-buttons-group"
                    sx={{ gap: '30px' }}
                  >
                    <FormControlLabel
                      value="Resolución"
                      control={<Radio />}
                      label="Nro resolución"
                    />
                    <FormControlLabel
                      value="Asunto"
                      control={<Radio />}
                      label="Asunto"
                    />
                    <FormControlLabel
                      value="Apellido o Nombre"
                      control={<Radio />}
                      label="Referencia"
                    />
                    <FormControlLabel
                      value="disabled"
                      disabled
                      control={<Radio />}
                      label="other"
                    />
                  </RadioGroup>
                </FormControl>
              </div>
            </Grid>
          </CardContent>
          {previewUrl && (
            <>
              <CardMedia
                component="img"
                height="300"
                image={previewUrl}
                alt="Previsualización"
                style={{ marginTop: '20px' }}
              />
              <CardContent>
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  href={previewUrl}
                  download
                >
                  Descargar
                </Button>
              </CardContent>
              <CardContent>
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  onClick={handleModify}
                >
                  Modificar
                </Button>
              </CardContent>
              {showInputs && (
                <CardContent>
                  <TextField
                    label="Input 1"
                    variant="outlined"
                    fullWidth
                    style={{ marginBottom: '10px' }}
                  />
                  <TextField
                    label="Input 2"
                    variant="outlined"
                    fullWidth
                    style={{ marginBottom: '10px' }}
                  />
                  <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    onClick={handleModify}
                  >
                    Guardar
                  </Button>
                </CardContent>
              )}
            </>
          )}
        </Card>
      </Grid>
    </Grid>
  );
};

export default busquedas;
