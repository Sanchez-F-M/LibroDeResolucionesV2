import React from 'react';
import {
  Button,
  Stack,
  useMediaQuery,
  useTheme,
  Container,
  Box,
  Typography,
  Paper,
  Grid,
} from '@mui/material';
import { Link } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import DescriptionIcon from '@mui/icons-material/Description';

const HomeContainer = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));

  const buttonStyles = {
    fontSize: {
      xs: '1.1rem',
      sm: '1.3rem',
      md: '1.5rem',
      lg: '1.7rem',
    },
    py: { xs: 3, sm: 4, md: 5, lg: 6 },
    px: { xs: 3, sm: 4, md: 5, lg: 6 },
    borderRadius: { xs: 3, sm: 4, md: 5 },
    boxShadow: theme.shadows[6],
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    fontWeight: 600,
    letterSpacing: '0.5px',
    textTransform: 'none',
    position: 'relative',
    overflow: 'hidden',
    '&::before': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: '-100%',
      width: '100%',
      height: '100%',
      background:
        'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
      transition: 'left 0.5s',
    },
    '&:hover': {
      transform: 'translateY(-4px) scale(1.02)',
      boxShadow: theme.shadows[12],
      '&::before': {
        left: '100%',
      },
    },
    '&:active': {
      transform: 'translateY(-2px) scale(1.01)',
    },
    '& .MuiButton-startIcon': {
      marginRight: { xs: 1.5, sm: 2, md: 2.5 },
    },
  };

  const iconStyles = {
    fontSize: {
      xs: '2rem',
      sm: '2.5rem',
      md: '3rem',
      lg: '3.5rem',
    },
    filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))',
  };

  return (
    <Container maxWidth="lg">
      <Box
        sx={{
          minHeight: {
            xs: 'calc(100vh - 200px)',
            sm: 'calc(100vh - 250px)',
            md: 'calc(100vh - 300px)',
          },
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          py: { xs: 3, sm: 4, md: 6 },
          px: { xs: 2, sm: 3 },
        }}
      >
        {/* Título Principal */}
        <Box
          sx={{
            textAlign: 'center',
            mb: { xs: 4, sm: 5, md: 6 },
            width: '100%',
          }}
        >
          <Typography
            variant={isMobile ? 'h4' : isTablet ? 'h3' : 'h2'}
            sx={{
              fontWeight: 700,
              color: theme.palette.primary.main,
              mb: 2,
              textShadow: '0 2px 4px rgba(0,0,0,0.1)',
              fontSize: {
                xs: '1.75rem',
                sm: '2.5rem',
                md: '3rem',
                lg: '3.5rem',
              },
            }}
          >
            <DescriptionIcon
              sx={{
                fontSize: { xs: '2rem', sm: '3rem', md: '3.5rem', lg: '4rem' },
                verticalAlign: 'middle',
                mr: 1,
                mb: 0.5,
              }}
            />
            Libro de Resoluciones
          </Typography>
          <Typography
            variant="subtitle1"
            sx={{
              color: theme.palette.text.secondary,
              fontSize: {
                xs: '0.9rem',
                sm: '1.1rem',
                md: '1.2rem',
              },
              maxWidth: '600px',
              mx: 'auto',
              px: 2,
            }}
          >
            Sistema de gestión y búsqueda de resoluciones policiales
          </Typography>
        </Box>

        {/* Botones Principales */}
        <Stack
          spacing={{ xs: 3, sm: 4, md: 5 }}
          sx={{
            width: '100%',
            maxWidth: { xs: '100%', sm: '550px', md: '650px', lg: '750px' },
          }}
        >
          {/* Botón Buscar */}
          <Link
            to="/buscador"
            style={{ width: '100%', textDecoration: 'none' }}
          >
            <Paper
              elevation={0}
              sx={{
                borderRadius: { xs: 3, sm: 4, md: 5 },
                overflow: 'hidden',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'scale(1.01)',
                },
              }}
            >
              <Button
                variant="contained"
                color="primary"
                fullWidth
                startIcon={<SearchIcon sx={iconStyles} />}
                sx={buttonStyles}
              >
                Buscar Resoluciones
              </Button>
            </Paper>
          </Link>

          {/* Botón Cargar */}
          <Link to="/cargas" style={{ width: '100%', textDecoration: 'none' }}>
            <Paper
              elevation={0}
              sx={{
                borderRadius: { xs: 3, sm: 4, md: 5 },
                overflow: 'hidden',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'scale(1.01)',
                },
              }}
            >
              <Button
                variant="contained"
                color="secondary"
                fullWidth
                startIcon={<UploadFileIcon sx={iconStyles} />}
                sx={{
                  ...buttonStyles,
                  background:
                    'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  '&:hover': {
                    ...buttonStyles['&:hover'],
                    background:
                      'linear-gradient(135deg, #5568d3 0%, #63408b 100%)',
                  },
                }}
              >
                Cargar Resoluciones
              </Button>
            </Paper>
          </Link>
        </Stack>

        {/* Información Adicional */}
        <Box
          sx={{
            mt: { xs: 4, sm: 5, md: 6 },
            textAlign: 'center',
            width: '100%',
          }}
        >
          <Grid
            container
            spacing={{ xs: 2, sm: 3 }}
            justifyContent="center"
            sx={{
              maxWidth: { xs: '100%', sm: '550px', md: '650px', lg: '750px' },
              mx: 'auto',
            }}
          >
            {/* Centered cards: use inner Box to constrain width and center */}
            <Grid item xs={12}>
              <Box
                sx={{
                  display: 'flex',
                  gap: { xs: 2, sm: 2.5, md: 3 },
                  pl: { xs: 0, sm: 45 },
                  justifyContent: 'center',
                  alignItems: 'stretch',
                  flexDirection: { xs: 'column', sm: 'row' },
                  width: '100%',
                }}
              >
                {/* Card 1 */}
                <Box sx={{ flex: 1, maxWidth: { xs: '100%', sm: 320 } }}>
                  <Paper
                    elevation={2}
                    sx={{
                      p: { xs: 2, sm: 2.5, md: 3 },
                      borderRadius: 3,
                      transition: 'all 0.3s ease',
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      textAlign: 'center',
                      justifyContent: 'center',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: theme.shadows[8],
                      },
                    }}
                  >
                    <SearchIcon
                      color="primary"
                      sx={{ fontSize: { xs: '2rem', sm: '2.5rem' }, mb: 1 }}
                    />
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 600,
                        mb: 1,
                        fontSize: { xs: '1rem', sm: '1.1rem', md: '1.25rem' },
                      }}
                    >
                      Búsqueda Rápida
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ fontSize: { xs: '0.85rem', sm: '0.9rem' } }}
                    >
                      Encuentra resoluciones por número, asunto o fecha de forma
                      instantánea
                    </Typography>
                  </Paper>
                </Box>

                {/* Card 2 */}
                <Box sx={{ flex: 1, maxWidth: { xs: '100%', sm: 320 } }}>
                  <Paper
                    elevation={2}
                    sx={{
                      p: { xs: 2, sm: 2.5, md: 3 },
                      borderRadius: 3,
                      transition: 'all 0.3s ease',
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      textAlign: 'center',
                      justifyContent: 'center',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: theme.shadows[8],
                      },
                    }}
                  >
                    <UploadFileIcon
                      color="secondary"
                      sx={{ fontSize: { xs: '2rem', sm: '2.5rem' }, mb: 1 }}
                    />
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 600,
                        mb: 1,
                        fontSize: { xs: '1rem', sm: '1.1rem', md: '1.25rem' },
                      }}
                    >
                      Gestión Eficiente
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ fontSize: { xs: '0.85rem', sm: '0.9rem' } }}
                    >
                      Carga y administra resoluciones con archivos adjuntos de
                      manera segura
                    </Typography>
                  </Paper>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
};

export default HomeContainer;
