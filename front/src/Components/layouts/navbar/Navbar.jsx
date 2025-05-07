import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Grid,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { Brightness4, Brightness7 } from '@mui/icons-material';
import { Link, useLocation } from 'react-router-dom';
import Logo from '../../../assets/logo3-removebg-preview (1).png';

const Navbar = ({ darkMode, toggleDarkMode }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const location = useLocation();

  return (
    <AppBar
      position="fixed"
      sx={{
        backgroundColor: darkMode ? '#1976d2' : '#34495e',
        width: '100%',
        height: isMobile ? 90 : 135,
        zIndex: 1000,
        padding: isMobile ? 1 : 2,
      }}
    >
      <Toolbar>
        <Grid
          container
          alignItems="center"
          justifyContent="space-between"
          columns={{ xs: 12, sm: 12, md: 12 }}
        >
          <Grid item xs={3} sm={3} md={2} display="flex" alignItems="center">
            {location.pathname === '/' ? (
              <img
                src={Logo}
                alt="Logo"
                style={{
                  width: isMobile ? 50 : 110,
                  height: isMobile ? 52 : 115,
                  marginRight: 8,
                }}
              />
            ) : (
              <Link to="/home">
                <img
                  src={Logo}
                  alt="Logo"
                  style={{
                    width: isMobile ? 50 : 100,
                    height: isMobile ? 52 : 105,
                    marginRight: 8,
                  }}
                />
              </Link>
            )}
          </Grid>

          <Grid item xs={6} sm={4} md={6} textAlign="center">
            <Typography variant={isMobile ? 'h6' : 'h2'}>
              Libro de Resoluciones
            </Typography>
          </Grid>

          <Grid
            item
            xs={3}
            sm={3}
            md={2}
            sx={{
              display: 'flex',
              justifyContent: 'flex-end',
              alignItems: 'center',
            }}
            display="flex"
            justifyContent="flex-end"
          >
            <IconButton onClick={toggleDarkMode} color="inherit">
              {darkMode ? <Brightness7 /> : <Brightness4 />}
            </IconButton>
          </Grid>
        </Grid>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
