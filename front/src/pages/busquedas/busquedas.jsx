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
  useMediaQuery,
  useTheme,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import { Link } from 'react-router-dom';

const Busquedas = () => {
  const [imageUrl, setImageUrl] = useState('');
  const [previewUrl, setPreviewUrl] = useState('');
  const [showInputs, setShowInputs] = useState(false);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleSearch = () => {
    setPreviewUrl(imageUrl);
  };

  const handleModify = () => {
    setShowInputs(true);
  };

  return (
    <Grid
      container
      spacing={isMobile ? 5 : 4}
      justifyContent="center"
      sx={{
        marginTop: isMobile ? '100px' : '150px',
        marginBottom: isMobile ? '50px' : '375px',
        padding: isMobile ? '0px' : '0',
      }}
    >
      {' '}
      <Grid item xs={12} sm={10} md={6}>
        {' '}
        <Card>
          {' '}
          <CardContent>
            {' '}
            <Typography
              variant={isMobile ? 'h6' : 'h4'}
              component="div"
              sx={{ marginBottom: '10px' }}
            >
              {' '}
              Buscar Resolución{' '}
            </Typography>{' '}
            <Grid container spacing={5} alignItems="center">
              {' '}
              <Grid item xs={12} sm={8}>
                {' '}
                <TextField
                  label=""
                  variant="outlined"
                  fullWidth
                  value={imageUrl}
                  onChange={e => setImageUrl(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        {' '}
                        <SearchIcon />{' '}
                      </InputAdornment>
                    ),
                  }}
                />{' '}
              </Grid>{' '}
              <Grid item xs={12} sm={4}>
                {' '}
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  onClick={handleSearch}
                  marginBottom="20px"
                >
                  {' '}
                  Buscar{' '}
                </Button>{' '}
              </Grid>{' '}
            </Grid>{' '}
            <FormControl sx={{ padding: '16px', width: '100%' }}>
              {' '}
              <FormLabel></FormLabel>{' '}
              <RadioGroup row sx={{ gap: '55.5px' }}>
                {' '}
                <FormControlLabel
                  value="Resolución"
                  control={<Radio />}
                  label="Nro resolución"
                  style={{ padding: '0px', marginLeft: '-20px' }}
                />{' '}
                <FormControlLabel
                  value="Asunto"
                  control={<Radio />}
                  label="Asunto"
                />{' '}
                <FormControlLabel
                  value="Referencia"
                  control={<Radio />}
                  label="Referencia"
                />{' '}
              </RadioGroup>{' '}
            </FormControl>{' '}
          </CardContent>{' '}
          {previewUrl && (
            <>
              {' '}
              <CardMedia
                component="img"
                height={isMobile ? '200' : '300'}
                image={previewUrl}
                alt="Previsualización"
                sx={{ marginTop: '20px' }}
              />{' '}
              <CardContent>
                {' '}
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  href={previewUrl}
                  download
                >
                  {' '}
                  Descargar{' '}
                </Button>{' '}
              </CardContent>{' '}
              <Link to="/modificar">
                {' '}
                <CardContent>
                  {' '}
                  <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    onClick={handleModify}
                  >
                    {' '}
                    Modificar{' '}
                  </Button>{' '}
                </CardContent>{' '}
              </Link>{' '}
              {showInputs && (
                <CardContent>
                  {' '}
                  <TextField
                    label="Input 1"
                    variant="outlined"
                    fullWidth
                    sx={{ marginBottom: '10px' }}
                  />{' '}
                  <TextField
                    label="Input 2"
                    variant="outlined"
                    fullWidth
                    sx={{ marginBottom: '10px' }}
                  />{' '}
                  <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    onClick={handleModify}
                  >
                    {' '}
                    Guardar{' '}
                  </Button>{' '}
                </CardContent>
              )}{' '}
            </>
          )}{' '}
        </Card>{' '}
      </Grid>{' '}
    </Grid>
  );
};

export default Busquedas;
