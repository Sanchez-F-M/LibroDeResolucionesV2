import React, { useState, useCallback, useMemo } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Box,
  Container,
  useMediaQuery,
  useTheme,
  Menu,
  MenuItem,
  Avatar,
  Chip,
  Tooltip,
  Fade,
  Divider,
} from '@mui/material';
import {
  Brightness4,
  Brightness7,
  Logout,
  Person,
  Link as LinkIcon,
  Home as HomeIcon,
} from '@mui/icons-material';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import Logo from '../../../assets/logo3-removebg-preview (1).png';

const Navbar = ({ darkMode, toggleDarkMode }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  // ✨ MEJORA 1: Callbacks memoizados para mejor rendimiento
  const handleMenuClick = useCallback(event => {
    setAnchorEl(event.currentTarget);
  }, []);

  const handleMenuClose = useCallback(() => {
    setAnchorEl(null);
  }, []);

  const handleLogout = useCallback(() => {
    logout();
    navigate('/login');
    handleMenuClose();
  }, [logout, navigate, handleMenuClose]);

  const handleNavigateHome = useCallback(() => {
    navigate('/home');
    handleMenuClose();
  }, [navigate, handleMenuClose]);

  const handleNavigateEnlaces = useCallback(() => {
    navigate('/admin/enlaces');
    handleMenuClose();
  }, [navigate, handleMenuClose]);

  // ✨ MEJORA 2: Funciones de utilidad memoizadas
  const getRoleColor = useMemo(
    () => role => {
      switch (role) {
        case 'admin':
          return 'error';
        case 'secretaria':
          return 'warning';
        case 'usuario':
          return 'info';
        default:
          return 'default';
      }
    },
    []
  );

  const getRoleText = useMemo(
    () => role => {
      switch (role) {
        case 'admin':
          return 'Administrador';
        case 'secretaria':
          return 'Secretaría';
        case 'usuario':
          return 'Usuario';
        default:
          return role;
      }
    },
    []
  );

  // ✨ MEJORA 3: Determinar si mostrar logo como enlace
  const isLoginPage =
    location.pathname === '/' || location.pathname === '/login';

  return (
    <AppBar
      position="fixed"
      sx={{
        background: darkMode
          ? 'linear-gradient(180deg, #1565c0 0%, #0d47a1 100%)'
          : 'linear-gradient(180deg, #2c3e50 0%, #1a252f 100%)',
        color: '#fff',
        zIndex: 1200,
        boxShadow: theme.shadows[12],
        borderBottom: `4px solid ${darkMode ? '#1976d2' : '#34495e'}`,
        // ✨ Transición alineada con el footer
        transition: 'all 0.3s ease',
        position: 'relative',
      }}
    >
      {/* ✨ Línea decorativa superior */}
      <Box
        sx={{
          height: '4px',
          background:
            'linear-gradient(90deg, #1976d2 0%, #64b5f6 50%, #1976d2 100%)',
          boxShadow: '0 2px 8px rgba(25, 118, 210, 0.4)',
        }}
      />
      <Container maxWidth="xl">
        <Toolbar
          sx={{
            height: '100%',
            padding: { xs: '0 8px', sm: '0 16px' },
            minHeight: '0 !important',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              width: '100%',
              height: { xs: 70, sm: 90, md: 135 },
            }}
          >
            {/* Logo Section - ✨ MEJORA 5: Tooltip y transición */}
            <Tooltip
              title={isLoginPage ? '' : 'Ir al inicio'}
              arrow
              TransitionComponent={Fade}
            >
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  minWidth: { xs: 60, sm: 80, md: 120 },
                  cursor: isLoginPage ? 'default' : 'pointer',
                  // ✨ Efecto hover sutil
                  transition: 'transform 0.2s ease',
                  '&:hover': !isLoginPage && {
                    transform: 'scale(1.05)',
                  },
                }}
              >
                {isLoginPage ? (
                  <img
                    src={Logo}
                    alt="Logo Policía de Tucumán"
                    style={{
                      width: isMobile ? 40 : isTablet ? 70 : 110,
                      height: isMobile ? 42 : isTablet ? 73 : 115,
                      objectFit: 'contain',
                    }}
                  />
                ) : (
                  <Link
                    to="/home"
                    style={{ display: 'flex', alignItems: 'center' }}
                    aria-label="Ir a página principal"
                  >
                    <img
                      src={Logo}
                      alt="Logo Policía de Tucumán"
                      style={{
                        width: isMobile ? 40 : isTablet ? 70 : 100,
                        height: isMobile ? 42 : isTablet ? 73 : 105,
                        objectFit: 'contain',
                      }}
                    />
                  </Link>
                )}
              </Box>
            </Tooltip>

            {/* Title Section - ✨ MEJORA 6: Accesibilidad mejorada */}
            <Box
              sx={{
                flex: 1,
                display: 'flex',
                justifyContent: 'center',
                px: { xs: 1, sm: 2 },
              }}
            >
              <Typography
                variant={isMobile ? 'h6' : isTablet ? 'h4' : 'h2'}
                component="h1"
                sx={{
                  fontWeight: 'bold',
                  textAlign: 'center',
                  fontSize: {
                    xs: '0.9rem',
                    sm: '1.2rem',
                    md: '1.8rem',
                    lg: '3rem',
                  },
                  lineHeight: 1.2,
                  whiteSpace: { xs: 'nowrap', sm: 'normal' },
                  overflow: { xs: 'hidden', sm: 'visible' },
                  textOverflow: { xs: 'ellipsis', sm: 'unset' },
                }}
              >
                {isMobile ? 'Resoluciones' : 'Libro de Resoluciones'}
              </Typography>
            </Box>

            {/* Right Section - User Menu and Controls */}
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'flex-end',
                alignItems: 'center',
                minWidth: { xs: 48, sm: 100, md: 150 },
                gap: 1,
              }}
            >
              {isAuthenticated && user && (
                <>
                  {/* ✨ MEJORA 7: Información de usuario con mejor diseño */}
                  {!isMobile && (
                    <Box
                      sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'flex-end',
                        mr: 1,
                      }}
                    >
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: 'bold',
                          fontSize: '0.8rem',
                          // ✨ Efecto de sombra para mejor legibilidad
                          textShadow: '0 1px 2px rgba(0,0,0,0.2)',
                        }}
                      >
                        {user.name}
                      </Typography>
                      <Chip
                        label={getRoleText(user.role)}
                        color={getRoleColor(user.role)}
                        size="small"
                        sx={{
                          height: 18,
                          fontSize: '0.7rem',
                          // ✨ Transición suave
                          transition: 'transform 0.2s ease',
                          '&:hover': {
                            transform: 'scale(1.05)',
                          },
                        }}
                      />
                    </Box>
                  )}

                  {/* ✨ MEJORA 8: Tooltip en avatar */}
                  <Tooltip title="Mi cuenta" arrow>
                    <IconButton
                      onClick={handleMenuClick}
                      color="inherit"
                      size="small"
                      aria-label="Abrir menú de usuario"
                      aria-controls={open ? 'user-menu' : undefined}
                      aria-haspopup="true"
                      aria-expanded={open ? 'true' : undefined}
                      sx={{
                        // ✨ Indicador visual cuando el menú está abierto
                        backgroundColor: open
                          ? 'rgba(255,255,255,0.1)'
                          : 'transparent',
                        transition: 'background-color 0.2s ease',
                      }}
                    >
                      <Avatar
                        sx={{
                          width: 28,
                          height: 28,
                          bgcolor: 'rgba(255,255,255,0.2)',
                          // ✨ Borde cuando está activo
                          border: open
                            ? '2px solid rgba(255,255,255,0.5)'
                            : 'none',
                          transition: 'all 0.2s ease',
                        }}
                      >
                        <Person fontSize="small" />
                      </Avatar>
                    </IconButton>
                  </Tooltip>

                  {/* ✨ MEJORA 9: Menú mejorado con transiciones y dividers */}
                  <Menu
                    id="user-menu"
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleMenuClose}
                    onClick={handleMenuClose}
                    TransitionComponent={Fade}
                    PaperProps={{
                      elevation: 8,
                      sx: {
                        overflow: 'visible',
                        filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                        mt: 1.5,
                        minWidth: 180,
                        // ✨ Flecha del menú
                        '&:before': {
                          content: '""',
                          display: 'block',
                          position: 'absolute',
                          top: 0,
                          right: 14,
                          width: 10,
                          height: 10,
                          bgcolor: 'background.paper',
                          transform: 'translateY(-50%) rotate(45deg)',
                          zIndex: 0,
                        },
                      },
                    }}
                    transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                    anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                  >
                    {/* Header del menú (solo móvil) */}
                    {isMobile && (
                      <>
                        <MenuItem disabled sx={{ opacity: 1 }}>
                          <Box
                            sx={{
                              display: 'flex',
                              flexDirection: 'column',
                              alignItems: 'center',
                              width: '100%',
                              py: 1,
                            }}
                          >
                            <Typography
                              variant="body2"
                              sx={{ fontWeight: 'bold', mb: 0.5 }}
                            >
                              {user.name}
                            </Typography>
                            <Chip
                              label={getRoleText(user.role)}
                              color={getRoleColor(user.role)}
                              size="small"
                            />
                          </Box>
                        </MenuItem>
                        <Divider />
                      </>
                    )}

                    {/* Opción: Ir al inicio */}
                    <MenuItem
                      onClick={handleNavigateHome}
                      sx={{
                        // ✨ Efecto hover mejorado
                        '&:hover': {
                          backgroundColor: 'action.hover',
                          '& .MuiSvgIcon-root': {
                            transform: 'scale(1.1)',
                          },
                        },
                      }}
                    >
                      <HomeIcon
                        fontSize="small"
                        sx={{
                          mr: 1,
                          transition: 'transform 0.2s ease',
                        }}
                      />
                      Ir al Inicio
                    </MenuItem>

                    <Divider />

                    {/* Opción: Enlaces Móviles */}
                    <MenuItem
                      onClick={handleNavigateEnlaces}
                      sx={{
                        '&:hover': {
                          backgroundColor: 'action.hover',
                          '& .MuiSvgIcon-root': {
                            transform: 'scale(1.1)',
                          },
                        },
                      }}
                    >
                      <LinkIcon
                        fontSize="small"
                        sx={{
                          mr: 1,
                          transition: 'transform 0.2s ease',
                        }}
                      />
                      Enlaces Móviles
                    </MenuItem>

                    <Divider />

                    {/* Opción: Cerrar Sesión */}
                    <MenuItem
                      onClick={handleLogout}
                      sx={{
                        color: 'error.main',
                        '&:hover': {
                          backgroundColor: 'error.light',
                          color: 'error.dark',
                          '& .MuiSvgIcon-root': {
                            transform: 'scale(1.1)',
                          },
                        },
                      }}
                    >
                      <Logout
                        fontSize="small"
                        sx={{
                          mr: 1,
                          transition: 'transform 0.2s ease',
                        }}
                      />
                      Cerrar Sesión
                    </MenuItem>
                  </Menu>
                </>
              )}

              {/* ✨ MEJORA 10: Toggle de tema con tooltip */}
              <Tooltip
                title={darkMode ? 'Modo claro' : 'Modo oscuro'}
                arrow
                TransitionComponent={Fade}
              >
                <IconButton
                  onClick={toggleDarkMode}
                  color="inherit"
                  size={isMobile ? 'small' : 'medium'}
                  aria-label={
                    darkMode ? 'Activar modo claro' : 'Activar modo oscuro'
                  }
                  sx={{
                    padding: { xs: '6px', sm: '8px' },
                    // ✨ Efecto de rotación al cambiar tema
                    transition: 'transform 0.3s ease',
                    '&:hover': {
                      transform: 'rotate(180deg)',
                      backgroundColor: 'rgba(255,255,255,0.1)',
                    },
                  }}
                >
                  {darkMode ? <Brightness7 /> : <Brightness4 />}
                </IconButton>
              </Tooltip>
            </Box>
          </Box>
        </Toolbar>
      </Container>
      {/* ✨ Línea decorativa inferior */}
      <Box
        sx={{
          height: '3px',
          background:
            'linear-gradient(90deg, transparent 0%, #1976d2 50%, transparent 100%)',
        }}
      />
    </AppBar>
  );
};

export default Navbar;
