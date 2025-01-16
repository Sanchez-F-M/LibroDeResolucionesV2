import React, { useState, useEffect } from 'react';
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
  const [resolutionNumber, setResolutionNumber] = useState(1);
  const [dia, setDia] = useState('');
  const [mes, setMes] = useState('');
  const [año, setAño] = useState('');

  useEffect(() => {
    // Simular la obtención del último número de resolución desde el servidor
    const fetchLastResolutionNumber = async () => {
      const lastNumber = -1; // Ejemplo: último número de resolución obtenido del servidor
      setResolutionNumber(lastNumber + 1);
    };

    fetchLastResolutionNumber();
  }, []);

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
          <CardContent sx={{ padding: 12 }}>
            <Typography
              variant="h4"
              component="div"
              className="mb-5"
              align="left"
            >
              Cargar Archivos
            </Typography>
            <Typography
              variant="h5"
              component="div"
              className="mb-5"
              align="center"
              marginTop={{ xs: 2, sm: 7 }}
            >
              Número de Resolución a cargar: {resolutionNumber}
            </Typography>
            <Container sx={{ padding: 7 }}>
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
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Día"
                  type="number"
                  value={dia}
                  onChange={e => setDia(e.target.value)}
                  inputProps={{ min: 1, max: 31 }}
                  style={{ marginTop: '20px' }}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Mes"
                  type="number"
                  value={mes}
                  onChange={e => setMes(e.target.value)}
                  inputProps={{ min: 1, max: 12 }}
                  style={{ marginTop: '20px' }}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Año"
                  type="number"
                  value={año}
                  onChange={e => setAño(e.target.value)}
                  inputProps={{ min: 2000, max: 2100 }}
                  style={{ marginTop: '20px' }}
                />
              </Grid>
            </Container>

            <Typography
              variant="h5"
              style={{ marginTop: '30px', marginBottom: '40px' }}
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
              Guardar Resolución ({files.length})
            </Button>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default Cargas;
