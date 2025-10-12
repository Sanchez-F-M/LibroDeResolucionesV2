import { createTheme } from '@mui/material';

// ✨ Función para crear tema dinámico basado en modo oscuro/claro
export const createAppTheme = (darkMode = false) =>
  createTheme({
    palette: {
      mode: darkMode ? 'dark' : 'light',
      primary: {
        main: darkMode ? '#1976d2' : '#2c3e50',
        light: darkMode ? '#42a5f5' : '#34495e',
        dark: darkMode ? '#1565c0' : '#1a252f',
      },
      secondary: {
        main: '#FF8A65',
        light: '#ffab91',
        dark: '#f4511e',
      },
      background: {
        default: darkMode ? '#121212' : '#f5f5f5',
        paper: darkMode ? '#1e1e1e' : '#ffffff',
      },
      text: {
        primary: darkMode ? '#ffffff' : '#2c3e50',
        secondary: darkMode ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.6)',
      },
    },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 900,
      lg: 1200,
      xl: 1536,
    },
  },
  typography: {
    h1: {
      fontSize: '2.5rem',
      '@media (max-width: 600px)': {
        fontSize: '1.8rem',
      },
    },
    h2: {
      fontSize: '2rem',
      '@media (max-width: 600px)': {
        fontSize: '1.5rem',
      },
    },
    h3: {
      fontSize: '1.75rem',
      '@media (max-width: 600px)': {
        fontSize: '1.3rem',
      },
    },
    h4: {
      fontSize: '1.5rem',
      '@media (max-width: 600px)': {
        fontSize: '1.2rem',
      },
    },
    h5: {
      fontSize: '1.25rem',
      '@media (max-width: 600px)': {
        fontSize: '1.1rem',
      },
    },
    h6: {
      fontSize: '1rem',
      '@media (max-width: 600px)': {
        fontSize: '0.9rem',
      },
    },
  },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            transition: 'background-color 0.3s ease, color 0.3s ease',
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            transition: 'background-color 0.3s ease, box-shadow 0.3s ease',
          },
        },
      },
      MuiContainer: {
        styleOverrides: {
          root: {
            paddingLeft: '16px',
            paddingRight: '16px',
            '@media (max-width: 600px)': {
              paddingLeft: '8px',
              paddingRight: '8px',
            },
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            '@media (max-width: 600px)': {
              fontSize: '0.875rem',
              padding: '8px 16px',
            },
          },
        },
      },
      MuiTextField: {
        styleOverrides: {
          root: {
            '@media (max-width: 600px)': {
              '& .MuiInputLabel-root': {
                fontSize: '0.875rem',
              },
              '& .MuiInputBase-input': {
                fontSize: '0.875rem',
              },
            },
          },
        },
      },
    },
  });

// ✨ Exportar tema por defecto para compatibilidad con imports existentes
export const customTheme = createAppTheme(false);
