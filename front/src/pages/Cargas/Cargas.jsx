import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
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
  
  Container,
} from '@mui/material';
import Box from '@mui/material/Box';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import api from '../../api/api';

const Cargas = () => {
  const [files, setFiles] = useState([]);
  const [fileId, setFileId] = useState('');
  const [asunto, setAsunto] = useState('');
  const [referencia, setReferencia] = useState('');
  const [previews, setPreviews] = useState([]);
  const [nextResolutionNumber, setNextResolutionNumber] = useState(null);
  const [fecha, setFecha] = useState(null);

  useEffect(() => {
    // Obtener el próximo número de resolución del servidor
    const fetchNextResolutionNumber = async () => {
      try {
        const response = await api.get('/api/books/last-number');
        const nextNumber = response.data.lastNumber;
        setNextResolutionNumber(nextNumber);
        setFileId(nextNumber.toString()); // Establecer automáticamente el número en el campo
      } catch (error) {
        console.error('Error al obtener el próximo número de resolución:', error);
      }
    };

    fetchNextResolutionNumber();
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

    files.forEach((file) => formData.append('files', file));

    formData.append('NumdeResolucion', fileId);
    formData.append('Asunto', asunto);
    formData.append('Referencia', referencia);
    formData.append('FechaCreacion', fecha.toISOString());

    try {
      const response = await api.post('/api/books', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (response.status === 200 || response.status === 201) {
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
          height="200"
          image={preview.url}
          alt={`Previsualización ${index + 1}`}
        />
      );
    } else {
      return (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: 150,
            bgcolor: 'grey.200',
          }}
        >
          <Typography variant="body1">{preview.name}</Typography>
        </Box>
      );
    }
  };

  return (
    <Grid container  justifyContent="center" sx={{ mt: { xs: 3, sm: 5, md: 7 } }}>
      <Grid item xs={12} sm={10} md={8}>
        <Card>
          <CardContent sx={{ p: { xs: 2, sm: 4, md: 9 } }}>
          
            <Typography variant="h4" align="left" sx={{ mb: 5, mt: 10 }}>
              Cargar Archivos
            </Typography>
            <Typography
              variant="h5"
              align="center"
              sx={{ mb: 3, mt: { xs: 1, sm: 3 } }}
            >
              Número de Resolución a cargar: {nextResolutionNumber || 'Cargando...'}
            </Typography>
            <Container sx={{ p: { xs: 1, sm: 3 } }}>
              <TextField
                label="Número de Resolución"
                variant="outlined"
                fullWidth
                value={fileId}
                onChange={(e) => setFileId(e.target.value)}
                sx={{ mt: 2, mb: 2 }}
              />
              <TextField
                label="Asunto"
                variant="outlined"
                fullWidth
                value={asunto}
                onChange={(e) => setAsunto(e.target.value)}
                sx={{ mt: 2, mb: 2 }}
              />
              <TextField
                label="Referencia"
                variant="outlined"
                fullWidth
                value={referencia}
                onChange={(e) => setReferencia(e.target.value)}
                sx={{ mt: 2, mb: 2 }}
              />
              <Typography variant="h6" sx={{ mt: 2 }}>
                Fecha
              </Typography>
              <Box sx={{ mt: 2 }}>
                <DatePicker
                  selected={fecha}
                  onChange={(date) => setFecha(date)}
                  dateFormat="dd/MM/yyyy"
                  className="form-control"
                  style={{ width: '100%' }}
                />
              </Box>
            </Container>

            <Typography
              variant="h4"
              align="center"
              sx={{ mt: { xs: 4, sm: 6 }, mb: { xs: 2, sm: 4 } }}
            >
              Seleccionar Archivos
            </Typography>

            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 10 }}>
              <Fab color="primary" aria-label="add" component="label">
                <AddIcon />
                <Input
                  type="file"
                  multiple
                  onChange={handleFileChange}
                  sx={{ display: 'none' }}
                />
              </Fab>
            </Box>

            {/* Grid de previsualizaciones */}
            <Grid container spacing={2} sx={{ mb: 3 }}>
              {previews.map((preview, index) => (
                <Grid item xs={12} sm={6} key={index}>
                  <Card>
                    {renderPreview(preview, index)}
                    <Box
                      sx={{
                        p: 1,
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}
                    >
                      <Typography variant="body2" noWrap sx={{ flex: 1 }}>
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
              sx={{ mt: { xs: 3, sm: 4 }, mb: { xs: 2, sm: 4 } }}
            >
              Guardar Resolución ({files.length})
            </Button>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <Button
                component={Link}
                to="/home"
                color="info"
                variant="outlined"
                startIcon={<ArrowBackIcon />}
                sx={{ 
                  mr: 5,
                  '&:hover': {
                    backgroundColor: 'primary.light',
                    color: 'primary.dark',
                    borderColor: 'primary.main'
                  }
                }}
              >
                Volver al Inicio
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default Cargas;
