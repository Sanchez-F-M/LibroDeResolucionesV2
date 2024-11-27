import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { ThemeProvider } from '@mui/material';
import { customTheme } from './themeConfig.js';

createRoot(document.getElementById('root')).render(<App />);
<ThemeProvider theme={customTheme}>
  <App />
</ThemeProvider>;
