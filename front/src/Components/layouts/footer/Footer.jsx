import React from 'react';
import { 
  Box, 
  Typography, 
  Container, 
  useMediaQuery, 
  useTheme,
  Stack,
  Divider
} from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import BusinessIcon from '@mui/icons-material/Business';

const Footer = ({ darkMode }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: darkMode ? '#1976d2' : '#34495e',
        color: '#fff',
        marginTop: 'auto',
        width: '100%',
        transition: 'all 0.3s ease',
        boxShadow: theme.shadows[8],
        borderTop: `3px solid ${theme.palette.primary.main}`,
      }}
    >
      <Container maxWidth="xl">
        <Box
          sx={{
            py: { xs: 1.5, sm: 2, md: 2.5 },
            px: { xs: 2, sm: 3 },
          }}
        >
          <Stack 
            spacing={{ xs: 1, sm: 1.5 }} 
            alignItems="center"
            textAlign="center"
          >
            {/* Título principal */}
            <Stack direction="row" alignItems="center" spacing={1}>
              <BusinessIcon 
                sx={{ 
                  fontSize: { xs: 24, sm: 28, md: 32 },
                  color: theme.palette.primary.light
                }} 
              />
              <Typography
                variant={isMobile ? 'h6' : isTablet ? 'h5' : 'h4'}
                sx={{
                  fontSize: {
                    xs: '1.1rem',
                    sm: '1.4rem',
                    md: '1.7rem',
                    lg: '2.1rem',
                  },
                  // fontWeight: 'bold',
                  // lineHeight: 1.2,
                  // background: `linear-gradient(45deg, ${theme.palette.primary.light}, #fff)`,
                  // backgroundClip: 'text',
                  // WebkitBackgroundClip: 'text',
                  // WebkitTextFillColor: 'transparent',
                }}
              >
                Secretaría Privada - Jefatura de Policía
              </Typography>
            </Stack>

            <Divider 
              sx={{ 
                width: { xs: '80%', sm: '60%', md: '40%' },
                borderColor: theme.palette.primary.light,
                opacity: 0.7
              }} 
            />

            {/* Dirección */}
            <Stack 
              direction={{ xs: 'column', sm: 'row' }} 
              alignItems="center" 
              spacing={1}
              sx={{ maxWidth: '600px' }}
            >
              <LocationOnIcon 
                sx={{ 
                  fontSize: { xs: 20, sm: 22 },
                  color: theme.palette.primary.light,
                  flexShrink: 0
                }} 
              />
              <Typography
                variant={isMobile ? 'body2' : 'body1'}
                sx={{
                  fontSize: {
                    xs: '0.9rem',
                    sm: '1rem',
                    md: '1.1rem',
                    lg: '1.2rem',
                  },
                  opacity: 0.95,
                  lineHeight: 1.4,
                  textAlign: { xs: 'center', sm: 'left' }
                }}
              >
                Calle Italia 2601, San Miguel de Tucumán, Tucumán
              </Typography>
            </Stack>

            {/* Copyright */}
            <Typography
              variant="caption"
              sx={{
                fontSize: { xs: '0.75rem', sm: '0.8rem' },
                opacity: 0.7,
                mt: 0.5,
                textAlign: 'center'
              }}
            >
              © {new Date().getFullYear()} Sistema de Resoluciones - Todos los derechos reservados
            </Typography>
          </Stack>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
