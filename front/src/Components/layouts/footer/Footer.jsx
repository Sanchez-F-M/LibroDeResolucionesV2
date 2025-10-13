import React from 'react';
import {
  Box,
  Typography,
  Container,
  useMediaQuery,
  useTheme,
  Stack,
  Divider,
  Grid,
  Link as MuiLink,
} from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import BusinessIcon from '@mui/icons-material/Business';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import SecurityIcon from '@mui/icons-material/Security';
import GavelIcon from '@mui/icons-material/Gavel';

const Footer = ({ darkMode }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: darkMode ? '#1565c0' : '#2c3e50',
        color: '#fff',
        marginTop: 'auto',
        width: '100%',
        transition: 'all 0.3s ease',
        boxShadow: theme.shadows[12],
        borderTop: `4px solid ${darkMode ? '#1976d2' : '#34495e'}`,
        position: 'relative',
        // ✨ Efecto de gradiente sutil
        background: darkMode
          ? 'linear-gradient(180deg, #1565c0 0%, #0d47a1 100%)'
          : 'linear-gradient(180deg, #2c3e50 0%, #1a252f 100%)',
      }}
    >
      {/* ✨ Línea decorativa superior con colores institucionales */}
      <Box
        sx={{
          height: '4px',
          background:
            'linear-gradient(90deg, #1976d2 0%, #64b5f6 50%, #1976d2 100%)',
          boxShadow: '0 2px 8px rgba(25, 118, 210, 0.5)',
        }}
      />

      <Container maxWidth="xl">
        <Box
          sx={{
            py: { xs: 3, sm: 4, md: 4.5 },
            px: { xs: 2, sm: 3 },
          }}
        >
          <Grid container spacing={{ xs: 2, sm: 3, md: 4 }}>
            {/* ✨ COLUMNA 1: Identificación Institucional */}
            <Grid item xs={12} md={6}>
              <Stack
                spacing={{ xs: 2, sm: 2.5 }}
                alignItems={{ xs: 'center', md: 'flex-start' }}
              >
                {/* Escudo e Identificación */}
                <Stack
                  direction="row"
                  alignItems="center"
                  spacing={2}
                  sx={{
                    // ✨ Efecto de resplandor sutil
                    '& svg': {
                      filter: 'drop-shadow(0 0 8px rgba(100, 181, 246, 0.4))',
                    },
                  }}
                >
                  <SecurityIcon
                    sx={{
                      fontSize: { xs: 36, sm: 42, md: 48 },
                      color: '#64b5f6',
                    }}
                  />
                  <Box>
                    <Typography
                      variant={isMobile ? 'h6' : 'h5'}
                      sx={{
                        fontSize: {
                          xs: '1rem',
                          sm: '1.2rem',
                          md: '1.4rem',
                        },
                        fontWeight: 700,
                        letterSpacing: '0.5px',
                        textTransform: 'uppercase',
                        textShadow: '0 2px 4px rgba(0,0,0,0.3)',
                        lineHeight: 1.2,
                      }}
                    >
                      Policía de Tucumán
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        fontSize: { xs: '0.75rem', sm: '0.85rem' },
                        opacity: 0.9,
                        fontWeight: 500,
                        letterSpacing: '0.3px',
                      }}
                    >
                      República Argentina
                    </Typography>
                  </Box>
                </Stack>

                <Divider
                  sx={{
                    width: '100%',
                    maxWidth: { xs: '80%', md: '100%' },
                    borderColor: 'rgba(100, 181, 246, 0.3)',
                    borderWidth: 1,
                  }}
                />

                {/* ✨ Dependencia */}
                <Stack
                  direction="row"
                  alignItems="flex-start"
                  spacing={1.5}
                  sx={{
                    textAlign: { xs: 'center', md: 'left' },
                    width: '100%',
                  }}
                >
                  <BusinessIcon
                    sx={{
                      fontSize: { xs: 22, sm: 24 },
                      color: '#64b5f6',
                      mt: 0.5,
                      flexShrink: 0,
                    }}
                  />
                  <Box>
                    <Typography
                      variant="subtitle1"
                      sx={{
                        fontSize: {
                          xs: '0.95rem',
                          sm: '1.05rem',
                          md: '1.1rem',
                        },
                        fontWeight: 600,
                        mb: 0.5,
                        lineHeight: 1.3,
                      }}
                    >
                      Secretaría Privada - Jefatura de Policía
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        fontSize: { xs: '0.8rem', sm: '0.85rem' },
                        opacity: 0.85,
                        fontStyle: 'italic',
                      }}
                    >
                      Sistema de Gestión de Resoluciones
                    </Typography>
                  </Box>
                </Stack>
              </Stack>
            </Grid>

            {/* ✨ COLUMNA 2: Información de Contacto */}
            <Grid item xs={12} md={6}>
              <Stack
                spacing={{ xs: 2, sm: 2.5 }}
                alignItems={{ xs: 'center', md: 'flex-start' }}
                sx={{ height: '100%', justifyContent: 'center' }}
              >
                {/* Título de sección */}
                <Typography
                  variant="subtitle2"
                  sx={{
                    fontSize: { xs: '0.85rem', sm: '0.9rem' },
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    letterSpacing: '1px',
                    color: '#64b5f6',
                    mb: 1,
                  }}
                >
                  Información de Contacto
                </Typography>

                {/* ✨ Dirección */}
                <Stack
                  direction="row"
                  alignItems="flex-start"
                  spacing={1.5}
                  sx={{
                    width: '100%',
                    maxWidth: { md: 500 },
                  }}
                >
                  <LocationOnIcon
                    sx={{
                      fontSize: { xs: 20, sm: 22 },
                      color: '#64b5f6',
                      mt: 0.3,
                      flexShrink: 0,
                    }}
                  />
                  <Box>
                    <Typography
                      variant="body2"
                      sx={{
                        fontSize: {
                          xs: '0.85rem',
                          sm: '0.9rem',
                          md: '0.95rem',
                        },
                        lineHeight: 1.5,
                        opacity: 0.95,
                      }}
                    >
                      <strong>Sede Central:</strong>
                      <br />
                      Calle Italia 2601
                      <br />
                      San Miguel de Tucumán, Tucumán (CP 4000)
                    </Typography>
                  </Box>
                </Stack>

                {/* ✨ Teléfono (opcional - descomentar si es necesario) */}
                {/* <Stack direction="row" alignItems="center" spacing={1.5}>
                  <PhoneIcon 
                    sx={{ 
                      fontSize: { xs: 20, sm: 22 },
                      color: '#64b5f6',
                      flexShrink: 0,
                    }} 
                  />
                  <Typography
                    variant="body2"
                    sx={{
                      fontSize: { xs: '0.85rem', sm: '0.9rem' },
                      opacity: 0.95,
                    }}
                  >
                    <strong>Mesa de Entradas:</strong> (0381) 430-XXXX
                  </Typography>
                </Stack> */}

                {/* ✨ Email Institucional (opcional) */}
                {/* <Stack direction="row" alignItems="center" spacing={1.5}>
                  <EmailIcon 
                    sx={{ 
                      fontSize: { xs: 20, sm: 22 },
                      color: '#64b5f6',
                      flexShrink: 0,
                    }} 
                  />
                  <MuiLink
                    href="mailto:secretaria@policiatucuman.gob.ar"
                    sx={{
                      color: '#64b5f6',
                      textDecoration: 'none',
                      fontSize: { xs: '0.85rem', sm: '0.9rem' },
                      '&:hover': {
                        textDecoration: 'underline',
                      },
                    }}
                  >
                    secretaria@policiatucuman.gob.ar
                  </MuiLink>
                </Stack> */}

                {/* ✨ Horario de Atención */}
                <Typography
                  variant="body2"
                  sx={{
                    fontSize: { xs: '0.8rem', sm: '0.85rem' },
                    opacity: 0.8,
                    fontStyle: 'italic',
                    mt: 1,
                  }}
                >
                  <strong>Horario de Atención:</strong> Lunes a Viernes, 08:00 -
                  16:00 hs
                </Typography>
              </Stack>
            </Grid>
          </Grid>

          {/* ✨ Separador con diseño institucional */}
          <Divider
            sx={{
              my: { xs: 2.5, sm: 3 },
              borderColor: 'rgba(100, 181, 246, 0.2)',
              borderWidth: 1,
            }}
          />

          {/* ✨ Barra Inferior: Copyright y Nota Legal */}
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            justifyContent="space-between"
            alignItems="center"
            spacing={{ xs: 1.5, sm: 2 }}
            sx={{ pt: 1 }}
          >
            {/* Copyright */}
            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              alignItems="center"
              spacing={{ xs: 0.5, sm: 1 }}
            >
              <GavelIcon
                sx={{
                  fontSize: 18,
                  color: '#64b5f6',
                  display: { xs: 'none', sm: 'block' },
                }}
              />
              <Typography
                variant="caption"
                sx={{
                  fontSize: { xs: '0.7rem', sm: '0.75rem' },
                  opacity: 0.85,
                  textAlign: { xs: 'center', sm: 'left' },
                  letterSpacing: '0.3px',
                }}
              >
                © {new Date().getFullYear()} Policía de Tucumán - Sistema de
                Resoluciones
              </Typography>
            </Stack>

            {/* ✨ Nota Legal */}
            <Typography
              variant="caption"
              sx={{
                fontSize: { xs: '0.7rem', sm: '0.75rem' },
                opacity: 0.7,
                textAlign: { xs: 'center', sm: 'right' },
                fontStyle: 'italic',
              }}
            >
              Uso exclusivo institucional - SANZTECH - Todos los derechos
              reservados
            </Typography>
          </Stack>

          {/* ✨ Badge de Seguridad (opcional) */}
          <Box
            sx={{
              textAlign: 'center',
              mt: 2,
              pt: 2,
              borderTop: '1px solid rgba(100, 181, 246, 0.1)',
            }}
          >
            <Typography
              variant="caption"
              sx={{
                fontSize: { xs: '0.65rem', sm: '0.7rem' },
                opacity: 0.6,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 0.5,
              }}
            >
              <SecurityIcon sx={{ fontSize: 14 }} />
              Sistema Protegido - Acceso Autorizado Únicamente
            </Typography>
          </Box>
        </Box>
      </Container>

      {/* ✨ Línea decorativa inferior */}
      <Box
        sx={{
          height: '3px',
          background:
            'linear-gradient(90deg, transparent 0%, #1976d2 50%, transparent 100%)',
        }}
      />
    </Box>
  );
};

export default Footer;
