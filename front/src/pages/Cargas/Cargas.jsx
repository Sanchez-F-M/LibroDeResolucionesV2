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
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import api from '../../api/api';

const Cargas = () => {
  const [files, setFiles] = useState([]);
  const [fileId, setFileId] = useState('');
  const [asunto, setAsunto] = useState('');
  const [referencia, setReferencia] = useState('');
  const [previews, setPreviews] = useState([]);
  const [resolutionNumber, setResolutionNumber] = useState(1);
  const [fecha, setFecha] = useState(null);

  useEffect(() => {
    // Simular la obtención del último número de resolución desde el servidor
    const fetchLastResolutionNumber = async () => {
      const lastNumber = -1; // Ejemplo: último número de resolución obtenido del servidor
      setResolutionNumber(lastNumber + 1);
    };

    fetchLastResolutionNumber();
  }, []);

  const handleFileChange = (event) => {
    const selectedFiles = Array.from(event.target.files);
    setFiles((prevFiles) => [...prevFiles, ...selectedFiles]);

    // Crear previsualizaciones para los nuevos archivos
    selectedFiles.forEach((file) => {
      const fileUrl = URL.createObjectURL(file);
      setPreviews((prevPreviews) => [
        ...prevPreviews,
        {
          url: fileUrl,
          name: file.name,
          type: file.type,
        },
      ]);
    });
  };

  const handleDeleteFile = (index) => {
    setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
    setPreviews((prevPreviews) => {
      // Liberar URL de objeto para evitar pérdidas de memoria
      URL.revokeObjectURL(prevPreviews[index].url);
      return prevPreviews.filter((_, i) => i !== index);
    });
  };

  const handleUpload = async () => {
    if (files.length === 0 || !fileId || !asunto || !referencia || !fecha) {
      alert('Por favor complete todos los campos y seleccione al menos un archivo.');
      return;
    }

    const formData = new FormData();
    // Agregar cada archivo individualmente
    files.forEach((file) => formData.append('files', file));
    formData.append('fileId', fileId);
    formData.append('asunto', asunto);
    formData.append('referencia', referencia);
    formData.append('resolutionNumber', resolutionNumber);
    formData.append('fecha', fecha.toISOString());

    try {
      // Realizamos la petición POST usando Axios
      const response = await api.post('/cargar-resolucion', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (response.status === 200) {
        // Limpiar el formulario
        setFiles([]);
        setFileId('');
        setAsunto('');
        setReferencia('');
        setFecha(null);
        setPreviews([]);
        alert('Resolución cargada exitosamente.');
      }
    } catch (error) {
      console.error('Error al cargar la resolución:', error);
    }
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
        <Box className="flex items-center justify-center h-48 bg-gray-100">
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
                onChange={(e) => setFileId(e.target.value)}
                style={{ marginTop: '20px' }}
                className="mb-5"
              />
              <TextField
                label="Asunto"
                variant="outlined"
                fullWidth
                value={asunto}
                onChange={(e) => setAsunto(e.target.value)}
                style={{ marginTop: '20px' }}
                className="mb-5"
              />
              <TextField
                label="Referencia"
                variant="outlined"
                fullWidth
                value={referencia}
                onChange={(e) => setReferencia(e.target.value)}
                style={{ marginTop: '20px' }}
                className="mb-5"
              />
              <Typography variant="h6" style={{ marginTop: '20px' }}>
                Fecha
              </Typography>
              <DatePicker
                selected={fecha}
                onChange={(date) => setFecha(date)}
                dateFormat="dd/MM/yyyy"
                className="form-control"
                style={{ marginTop: '20px', width: '100%', height: '400px' }}
              />
            </Container>

            <Typography
              variant="h5"
              style={{ marginTop: '300px', marginBottom: '40px' }}
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
              style={{ marginTop: '80px', marginBottom: '40px' }}
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
