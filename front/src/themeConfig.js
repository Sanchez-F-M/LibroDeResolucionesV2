import { createTheme } from '@mui/material';

export const customTheme = createTheme({
  palette: {
    primary: {
      main: '#111111',
    },
    secondary: {
      main: '#FF8A65',
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
