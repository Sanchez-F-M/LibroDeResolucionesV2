import React from 'react';
import { Button, Stack, useMediaQuery, useTheme } from '@mui/material';
import { Link } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';
import UploadFileIcon from '@mui/icons-material/UploadFile';

const HomeContainer = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Stack
      spacing={3}
      sx={{
        marginTop: '300px',
        marginBottom: '100px',
        padding: isMobile ? '10px' : '10px 400px',
        width: '100%',
        alignItems: 'center',
      }}
    >
      {' '}
      <Link to="/buscador" style={{ width: '100%' }}>
        {' '}
        <Button
          variant="contained"
          color="primary"
          fullWidth
          startIcon={
            <SearchIcon sx={{ fontSize: isMobile ? '2rem' : '3rem' }} />
          }
          sx={{
            fontSize: isMobile ? '1rem' : '1.2rem',
            padding: isMobile ? '8px 0' : '12px 0',
          }}
        >
          {' '}
          Buscar Resoluciones{' '}
        </Button>{' '}
      </Link>
      <Link
        to="/cargas"
        style={{ width: '100%', marginTop: '100px', marginBottom: '132px' }}
      >
        <Button
          variant="contained"
          color="primary"
          fullWidth
          startIcon={
            <UploadFileIcon sx={{ fontSize: isMobile ? '2rem' : '3rem' }} />
          }
          sx={{
            fontSize: isMobile ? '1rem' : '1.2rem',
            padding: isMobile ? '8px 0' : '12px 0',
          }}
        >
          Cargar Resoluciones
        </Button>
      </Link>
    </Stack>
  );
};

export default HomeContainer;
