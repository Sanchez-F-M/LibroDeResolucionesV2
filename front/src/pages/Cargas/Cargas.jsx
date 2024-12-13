import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  TextField,
  CardMedia,
  Input,
} from '@mui/material';
import UploadFileIcon from '@mui/icons-material/UploadFile';

const Cargas = () => {
  const [file, setFile] = useState(null);
  const [fileId, setFileId] = useState('');
  const [previewUrl, setPreviewUrl] = useState('');

  const handleFileChange = event => {
    const selectedFile = event.target.files[0];
    setFile(selectedFile);
    if (selectedFile) {
      const fileUrl = URL.createObjectURL(selectedFile);
      setPreviewUrl(fileUrl); // Previsualización del archivo
    }
  };

  const handleUpload = () => {
    if (!file || !fileId) {
      alert('Por favor ingrese un ID y seleccione un archivo.');
      return;
    }
    // Lógica para cargar el archivo al servidor o procesarlo
    alert(`Archivo con ID: ${fileId} cargado exitosamente.`);
  };

  return (
    <Grid container justifyContent="center" style={{ marginTop: '20px' }}>
      <Grid item xs={12} sm={8} md={6}>
        <Card>
          <CardContent>
            <Typography
              variant="h5"
              component="div"
              style={{ marginBottom: '20px' }}
            >
              Cargar Archivo
            </Typography>
            {/* Campo para ID del archivo */}
            <TextField
              label="ID del Archivo"
              variant="outlined"
              fullWidth
              value={fileId}
              onChange={e => setFileId(e.target.value)}
              style={{ marginBottom: '20px' }}
            />

            {/* Campo para cargar archivo */}
            <Button
              variant="outlined"
              component="label"
              color="primary"
              fullWidth
              startIcon={<UploadFileIcon />}
              style={{ marginBottom: '20px' }}
            >
              Seleccionar Archivo
              <Input
                type="file"
                onChange={handleFileChange}
                style={{ display: 'none' }}
              />
            </Button>

            {/* Previsualización del archivo */}
            {previewUrl && (
              <CardMedia
                component="img"
                height="300"
                image={previewUrl}
                alt="Previsualización"
                style={{ marginBottom: '20px' }}
              />
            )}

            {/* Botón para cargar archivo */}
            <Button
              variant="contained"
              color="success"
              fullWidth
              onClick={handleUpload}
            >
              Cargar Archivo
            </Button>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default Cargas;
