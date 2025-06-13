import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Box,
  Container,
  useMediaQuery,
  useTheme,
  Button,
  Menu,
  MenuItem,
  Avatar,
  Chip,
} from '@mui/material';
import { 
  Brightness4, 
  Brightness7, 
  AccountCircle, 
  Logout,
  Person
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

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
    handleMenuClose();
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'admin': return 'error';
      case 'secretaria': return 'warning';
      case 'usuario': return 'info';
      default: return 'default';
    }
  };

  const getRoleText = (role) => {
    switch (role) {
      case 'admin': return 'Administrador';
      case 'secretaria': return 'Secretaría';
      case 'usuario': return 'Usuario';
      default: return role;
    }
  };

  return (
    <AppBar
      position="fixed"
      sx={{
        backgroundColor: darkMode ? '#1976d2' : '#34495e',
        zIndex: 1000,
        height: { xs: 70, sm: 90, md: 135 },
        display: 'flex',
        justifyContent: 'center',
      }}
    >
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
              height: '100%',
            }}
          >
            {/* Logo Section */}
            <Box 
              sx={{ 
                display: 'flex', 
                alignItems: 'center',
                minWidth: { xs: 60, sm: 80, md: 120 },
              }}
            >
              {location.pathname === '/' ? (
                <img
                  src={Logo}
                  alt="Logo"
                  style={{
                    width: isMobile ? 40 : isTablet ? 70 : 110,
                    height: isMobile ? 42 : isTablet ? 73 : 115,
                    objectFit: 'contain',
                  }}
                />
              ) : (
                <Link to="/home" style={{ display: 'flex', alignItems: 'center' }}>
                  <img
                    src={Logo}
                    alt="Logo"
                    style={{
                      width: isMobile ? 40 : isTablet ? 70 : 100,
                      height: isMobile ? 42 : isTablet ? 73 : 105,
                      objectFit: 'contain',
                    }}
                  />
                </Link>
              )}
            </Box>

            {/* Title Section */}
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
            </Box>            {/* Right Section - User Menu and Dark Mode Toggle */}
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
                  {!isMobile && (
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', mr: 1 }}>
                      <Typography variant="body2" sx={{ fontWeight: 'bold', fontSize: '0.8rem' }}>
                        {user.name}
                      </Typography>
                      <Chip 
                        label={getRoleText(user.role)} 
                        color={getRoleColor(user.role)}
                        size="small"
                        sx={{ height: 18, fontSize: '0.7rem' }}
                      />
                    </Box>
                  )}
                  
                  <IconButton 
                    onClick={handleMenuClick}
                    color="inherit"
                    size="small"
                  >
                    <Avatar sx={{ width: 28, height: 28, bgcolor: 'rgba(255,255,255,0.2)' }}>
                      <Person fontSize="small" />
                    </Avatar>
                  </IconButton>

                  <Menu
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleMenuClose}
                    transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                    anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                  >
                    {isMobile && (
                      <MenuItem disabled>
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                          <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                            {user.name}
                          </Typography>
                          <Chip 
                            label={getRoleText(user.role)} 
                            color={getRoleColor(user.role)}
                            size="small"
                            sx={{ mt: 0.5 }}
                          />
                        </Box>
                      </MenuItem>
                    )}
                    <MenuItem onClick={handleLogout}>
                      <Logout fontSize="small" sx={{ mr: 1 }} />
                      Cerrar Sesión
                    </MenuItem>
                  </Menu>
                </>
              )}
              
              <IconButton 
                onClick={toggleDarkMode} 
                color="inherit"
                size={isMobile ? 'small' : 'medium'}
                sx={{
                  padding: { xs: '6px', sm: '8px' },
                }}
              >
                {darkMode ? <Brightness7 /> : <Brightness4 />}
              </IconButton>
            </Box>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar;
