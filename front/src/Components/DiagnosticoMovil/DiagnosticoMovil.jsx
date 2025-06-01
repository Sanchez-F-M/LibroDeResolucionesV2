import React, { useState } from 'react';
import { 
  Box, 
  Button, 
  Typography, 
  Card, 
  CardContent, 
  Alert,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper
} from '@mui/material';
import { testImageConnectivity } from '../../utils/imageUtils';

const DiagnosticoMovil = () => {
  const [testing, setTesting] = useState(false);
  const [results, setResults] = useState(null);

  const runDiagnostic = async () => {
    setTesting(true);
    try {
      const testResults = await testImageConnectivity();
      setResults(testResults);
    } catch (error) {
      setResults({ error: error.message });
    } finally {
      setTesting(false);
    }
  };

  return (
    <Card sx={{ m: 2 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          🔍 Diagnóstico de Conectividad Móvil
        </Typography>
        
        <Box sx={{ mb: 2 }}>
          <Button 
            variant="contained" 
            onClick={runDiagnostic}
            disabled={testing}
            startIcon={testing ? <CircularProgress size={20} /> : null}
          >
            {testing ? 'Ejecutando Test...' : 'Ejecutar Diagnóstico'}
          </Button>
        </Box>

        {results && (
          <Box>
            {results.error ? (
              <Alert severity="error">
                Error en diagnóstico: {results.error}
              </Alert>
            ) : (
              <Box>
                <Typography variant="subtitle1" sx={{ mb: 2 }}>
                  Información del Sistema:
                </Typography>
                
                <TableContainer component={Paper} sx={{ mb: 2 }}>
                  <Table size="small">
                    <TableBody>
                      <TableRow>
                        <TableCell><strong>Dispositivo Móvil:</strong></TableCell>
                        <TableCell>{results.isMobile ? '✅ Sí' : '❌ No'}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell><strong>Entorno:</strong></TableCell>
                        <TableCell>{results.environment}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell><strong>Base URL:</strong></TableCell>
                        <TableCell>{results.baseUrl || 'No configurada'}</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>

                <Typography variant="subtitle1" sx={{ mb: 2 }}>
                  Resultados de Conectividad:
                </Typography>

                <TableContainer component={Paper}>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Test</TableCell>
                        <TableCell>Estado</TableCell>
                        <TableCell>Detalles</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      <TableRow>
                        <TableCell>Backend Health</TableCell>
                        <TableCell>
                          {results.tests.backendHealth?.ok ? (
                            <span style={{ color: 'green' }}>✅ OK ({results.tests.backendHealth.status})</span>
                          ) : (
                            <span style={{ color: 'red' }}>❌ Error</span>
                          )}
                        </TableCell>
                        <TableCell>
                          {results.tests.backendHealth?.error || results.tests.backendHealth?.url}
                        </TableCell>
                      </TableRow>
                      
                      <TableRow>
                        <TableCell>Acceso a Imágenes</TableCell>
                        <TableCell>
                          {results.tests.imageAccess?.ok ? (
                            <span style={{ color: 'green' }}>✅ OK ({results.tests.imageAccess.status})</span>
                          ) : (
                            <span style={{ color: 'red' }}>❌ Error</span>
                          )}
                        </TableCell>
                        <TableCell>
                          {results.tests.imageAccess?.error || results.tests.imageAccess?.url}
                        </TableCell>
                      </TableRow>
                      
                      <TableRow>
                        <TableCell>CORS</TableCell>
                        <TableCell>
                          {results.tests.cors?.ok ? (
                            <span style={{ color: 'green' }}>✅ OK ({results.tests.cors.status})</span>
                          ) : (
                            <span style={{ color: 'red' }}>❌ Error</span>
                          )}
                        </TableCell>
                        <TableCell>
                          {results.tests.cors?.error || 'CORS configurado correctamente'}
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>

                <Alert severity="info" sx={{ mt: 2 }}>
                  <strong>Timestamp:</strong> {new Date(results.timestamp).toLocaleString()}
                </Alert>
              </Box>
            )}
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default DiagnosticoMovil;
