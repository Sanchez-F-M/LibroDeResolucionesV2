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
  useMediaQuery,
  useTheme,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import zIndex from '@mui/material/styles/zIndex';

const Cargas = () => {
  const [files, setFiles] = useState([]);
  const [fileId, setFileId] = useState('');
  const [asunto, setAsunto] = useState('');
  const [referencia, setReferencia] = useState('');
  const [previews, setPreviews] = useState([]);
  const [resolutionNumber, setResolutionNumber] = useState(1);
  const [fecha, setFecha] = useState(null);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    const fetchLastResolutionNumber = async () => {
      const lastNumber = -1;
      setResolutionNumber(lastNumber + 1);
    };

    fetchLastResolutionNumber();
  }, []);

  const handleFileChange = event => {
    const selectedFiles = Array.from(event.target.files);
    setFiles(prevFiles => [...prevFiles, ...selectedFiles]);

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
      URL.revokeObjectURL(prevPreviews[index].url);
      return prevPreviews.filter((_, i) => i !== index);
    });
  };

  return (
    <Grid
      container
      justifyContent="center"
      sx={{
        marginTop: isMobile ? '80px' : '120px',
        padding: isMobile ? '10px' : '100',
      }}
    >
      <Grid item xs={12} sm={10} md={8}>
        <Card>
          <CardContent sx={{ padding: isMobile ? 4 : 2 }}>
            <Typography variant={isMobile ? 'h5' : 'h3'} align="center">
              Cargar Archivos
            </Typography>
            <Typography
              variant={isMobile ? 'h6' : 'h5'}
              align="center"
              sx={{ marginTop: isMobile ? 2 : 7 }}
            >
              Número de Resolución a cargar: {resolutionNumber}
            </Typography>
            <Container sx={{ padding: isMobile ? 2 : 7 }}>
              <TextField
                label="Número de Resolución"
                variant="outlined"
                fullWidth
                value={fileId}
                onChange={e => setFileId(e.target.value)}
                sx={{ marginTop: 2, marginBottom: 2 }}
              />
              <TextField
                label="Asunto"
                variant="outlined"
                fullWidth
                value={asunto}
                onChange={e => setAsunto(e.target.value)}
                sx={{ marginTop: 2, marginBottom: 2 }}
              />
              <TextField
                label="Referencia"
                variant="outlined"
                fullWidth
                value={referencia}
                onChange={e => setReferencia(e.target.value)}
                sx={{ marginTop: 2, marginBottom: 2 }}
              />
              <Typography variant="h6" sx={{ marginTop: 2, marginBottom: 2 }}>
                Fecha
              </Typography>
              <DatePicker
                selected={fecha}
                onChange={date => setFecha(date)}
                dateFormat="dd/MM/yyyy"
                className="form-control"
                style={{ width: '100%', zIndex: 1000 }}
              />
            </Container>
            <Typography
              variant="h5"
              sx={{
                marginTop: isMobile ? 27 : 2,

                marginBottom: 5,
                textAlign: 'center',
              }}
            >
              Seleccionar Archivos
            </Typography>
            <Fab color="primary" aria-label="add" component="label">
              <AddIcon />
              <Input
                type="file"
                multiple
                onChange={handleFileChange}
                style={{ display: 'none', zIndex: 0 }}
              />
            </Fab>
            <Grid container spacing={2} sx={{ marginTop: 2 }}>
              {previews.map((preview, index) => (
                <Grid item xs={12} sm={6} key={index}>
                  <Card>
                    <CardMedia
                      component="img"
                      height={isMobile ? '200' : '400'}
                      image={preview.url}
                      alt={`Previsualización ${index + 1}`}
                    />
                    <Box
                      sx={{
                        padding: 2,
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}
                    >
                      <Typography variant="body2" noWrap>
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
              sx={{ marginTop: 5 }}
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
