import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Box,
  Container,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { Brightness4, Brightness7 } from '@mui/icons-material';
import { Link, useLocation } from 'react-router-dom';
import Logo from '../../../assets/logo3-removebg-preview (1).png';

const Navbar = ({ darkMode, toggleDarkMode }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  const location = useLocation();

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
            </Box>

            {/* Dark Mode Toggle Section */}
            <Box 
              sx={{ 
                display: 'flex',
                justifyContent: 'flex-end',
                alignItems: 'center',
                minWidth: { xs: 48, sm: 60, md: 80 },
              }}
            >
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
