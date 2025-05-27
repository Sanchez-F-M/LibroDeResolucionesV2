import React from 'react';
import { Button, Stack, useMediaQuery, useTheme, Container, Box } from '@mui/material';
import { Link } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';
import UploadFileIcon from '@mui/icons-material/UploadFile';

const HomeContainer = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <Container maxWidth="lg">
      <Box
        sx={{
          minHeight: 'calc(100vh - 200px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          py: { xs: 4, sm: 6, md: 8 },
        }}
      >
        <Stack
          spacing={{ xs: 3, sm: 4, md: 6 }}
          sx={{
            width: '100%',
            maxWidth: { xs: '100%', sm: '500px', md: '600px', lg: '700px' },
            px: { xs: 2, sm: 3, md: 4 },
          }}
        >
          <Link to="/buscador" style={{ width: '100%', textDecoration: 'none' }}>
            <Button
              variant="contained"
              color="primary"
              fullWidth
              startIcon={
                <SearchIcon 
                  sx={{ 
                    fontSize: { 
                      xs: '1.5rem', 
                      sm: '2rem', 
                      md: '3rem', 
                      lg: '4rem' 
                    } 
                  }} 
                />
              }
              sx={{
                fontSize: {
                  xs: '1rem',
                  sm: '1.2rem',
                  md: '1.4rem',
                  lg: '1.5rem',
                },
                py: { xs: 2, sm: 2.5, md: 3, lg: 3.5 },
                px: { xs: 3, sm: 4, md: 5 },
                borderRadius: { xs: 2, sm: 3 },
                boxShadow: theme.shadows[4],
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: theme.shadows[8],
                },
                '& .MuiButton-startIcon': {
                  marginRight: { xs: 1, sm: 1.5, md: 2 },
                },
              }}
            >
              Buscar Resoluciones
            </Button>
          </Link>

          <Link to="/cargas" style={{ width: '100%', textDecoration: 'none' }}>
            <Button
              variant="contained"
              color="primary"
              fullWidth
              startIcon={
                <UploadFileIcon 
                  sx={{ 
                    fontSize: { 
                      xs: '1.5rem', 
                      sm: '2rem', 
                      md: '3rem', 
                      lg: '5rem' 
                    } 
                  }} 
                />
              }
              sx={{
                fontSize: {
                  xs: '1rem',
                  sm: '1.2rem',
                  md: '1.4rem',
                  lg: '1.5rem',
                },
                py: { xs: 2, sm: 2.5, md: 3, lg: 3.5 },
                px: { xs: 3, sm: 4, md: 5 },
                borderRadius: { xs: 2, sm: 3 },
                boxShadow: theme.shadows[4],
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: theme.shadows[8],
                },
                '& .MuiButton-startIcon': {
                  marginRight: { xs: 1, sm: 1.5, md: 2 },
                },
              }}
            >
              Cargar Resoluciones
            </Button>
          </Link>
        </Stack>
      </Box>
    </Container>
  );
};

export default HomeContainer;
