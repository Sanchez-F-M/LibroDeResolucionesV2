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

const Busquedas = () => {
  const [imageUrl, setImageUrl] = useState('');
  const [previewUrl, setPreviewUrl] = useState('');

  const handleSearch = () => {
    setPreviewUrl(imageUrl); // Actualiza la URL de la imagen a previsualizar
  };

  return (
    <Grid
      container
      spacing={2}
      justifyContent="center"
      style={{ marginTop: '20px' }}
    >
      {/* Search Bar and Preview Section */}
      <Grid item xs={12} sm={8} md={6}>
        <Card>
          <CardContent>
            <Typography
              variant="h5"
              component="div"
              style={{ marginBottom: '20px' }}
            >
              Buscar Archivo
            </Typography>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={8}>
                <TextField
                  label="Nro. de Resolución/Exp."
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
                  color="secondary"
                  fullWidth
                  href={previewUrl}
                  download
                >
                  Descargar
                </Button>
              </CardContent>
            </>
          )}
        </Card>
      </Grid>
    </Grid>
  );
};

export default Busquedas;
