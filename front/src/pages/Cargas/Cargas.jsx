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
  Fab,
  IconButton,
  Box,
  Container,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';

const Cargas = () => {
  const [files, setFiles] = useState([]);
  const [fileId, setFileId] = useState('');
  const [asunto, setAsunto] = useState('');
  const [referencia, setReferencia] = useState('');
  const [previews, setPreviews] = useState([]);

  const handleFileChange = event => {
    const selectedFiles = Array.from(event.target.files);
    setFiles(prevFiles => [...prevFiles, ...selectedFiles]);

    // Crear previsualizaciones para los nuevos archivos
    selectedFiles.forEach(file => {
      const fileUrl = URL.createObjectURL(file);
      setPreviews(prevPreviews => [
        ...prevPreviews,
        {
          url: fileUrl,
          name: file.name,
          type: file.type,
        },
      ]);
    });
  };

  const handleDeleteFile = index => {
    setFiles(prevFiles => prevFiles.filter((_, i) => i !== index));
    setPreviews(prevPreviews => {
      // Liberar URL de objeto para evitar pérdidas de memoria
      URL.revokeObjectURL(prevPreviews[index].url);
      return prevPreviews.filter((_, i) => i !== index);
    });
  };

  const handleUpload = () => {
    if (files.length === 0 || !fileId || !asunto || !referencia) {
      alert(
        'Por favor complete todos los campos y seleccione al menos un archivo.'
      );
      return;
    }
    // Lógica para cargar los archivos al servidor
    alert(
      `${files.length} archivo(s) con ID: ${fileId}, Asunto: ${asunto}, Referencia: ${referencia} cargados exitosamente.`
    );
  };

  const renderPreview = (preview, index) => {
    if (preview.type.startsWith('image/')) {
      return (
        <CardMedia
          component="img"
          height="400"
          image={preview.url}
          alt={`Previsualización ${index + 1}`}
        />
      );
    } else {
      return (
        <Box className="flex items-center justify-center h-48 bg-gray-100 ">
          <Typography variant="body1">{preview.name}</Typography>
        </Box>
      );
    }
  };

  return (
    <Grid
      container
      justifyContent="center"
      style={{ marginTop: '50px' }}
      className="mt-5"
    >
      <Grid item xs={12} sm={8} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h4" component="div" className="mb-5">
              Cargar Archivos
            </Typography>
            <Container sx={{ padding: 5 }}>
              <TextField
                label="Número de Resolución"
                variant="outlined"
                fullWidth
                value={fileId}
                onChange={e => setFileId(e.target.value)}
                style={{ marginTop: '20px' }}
                className="mb-5"
              />
              <TextField
                label="Asunto"
                variant="outlined"
                fullWidth
                value={asunto}
                onChange={e => setAsunto(e.target.value)}
                style={{ marginTop: '20px' }}
                className="mb-5"
              />
              <TextField
                label="Referencia"
                variant="outlined"
                fullWidth
                value={referencia}
                onChange={e => setReferencia(e.target.value)}
                style={{ marginTop: '20px' }}
                className="mb-5"
              />
            </Container>

            <Typography
              variant="h5"
              style={{ marginTop: '20px' }}
              className="p-3"
            >
              Seleccionar Archivos
            </Typography>

            <Fab
              color="primary"
              aria-label="add"
              component="label"
              className="mb-5"
            >
              <AddIcon />
              <Input
                type="file"
                multiple
                onChange={handleFileChange}
                style={{ marginTop: '20px', display: 'none' }}
                className="hidden"
              />
            </Fab>

            {/* Grid de previsualizaciones */}
            <Grid container spacing={2} className="mb-5">
              {previews.map((preview, index) => (
                <Grid item xs={12} sm={6} key={index}>
                  <Card>
                    {renderPreview(preview, index)}
                    <Box className="p-2 flex justify-between items-center">
                      <Typography variant="body2" noWrap className="flex-1">
                        {preview.name}
                      </Typography>
                      <IconButton
                        onClick={() => handleDeleteFile(index)}
                        color="error"
                        size="small"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  </Card>
                </Grid>
              ))}
            </Grid>

            <Button
              variant="contained"
              color="primary"
              fullWidth
              onClick={handleUpload}
              style={{ marginTop: '50px' }}
            >
              Cargar Archivos ({files.length})
            </Button>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default Cargas;
