import { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  Alert,
  CircularProgress,
  Chip,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  Paper,
} from '@mui/material';
import {
  PhoneAndroid,
  Link as LinkIcon,
  Delete,
  ContentCopy,
  Refresh,
  QrCode2,
  CheckCircle,
  Cancel,
} from '@mui/icons-material';
import api from '../../api/api';

const AdminEnlaces = () => {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null);
  const [mobileLinks, setMobileLinks] = useState([]);
  const [expiryHours, setExpiryHours] = useState(24);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [showQRDialog, setShowQRDialog] = useState(false);
  const [selectedLink, setSelectedLink] = useState('');

  // Cargar estado al montar
  useEffect(() => {
    loadStatus();
  }, []);

  // Cargar estado del acceso móvil
  const loadStatus = async () => {
    try {
      setLoading(true);
      const response = await api.get('/admin/mobile-access/status');
      setStatus(response.data);
      setMessage({ type: '', text: '' });
    } catch (error) {
      console.error('Error cargando estado:', error);
      setMessage({
        type: 'error',
        text: 'Error al cargar el estado del acceso móvil',
      });
    } finally {
      setLoading(false);
    }
  };

  // Generar nuevo enlace
  const handleGenerate = async () => {
    try {
      setLoading(true);
      const response = await api.post('/admin/mobile-access/generate', {
        expiryHours: parseInt(expiryHours),
      });

      if (response.data.success) {
        setMobileLinks(response.data.links);
        setStatus({
          enabled: true,
          hasToken: true,
          expiresAt: response.data.expiresAt,
          isExpired: false,
          localIPs: response.data.links.map(l => l.ip),
        });
        setMessage({
          type: 'success',
          text: `✅ Enlace generado exitosamente. Expira en ${expiryHours} horas.`,
        });
      }
    } catch (error) {
      console.error('Error generando enlace:', error);
      setMessage({
        type: 'error',
        text: 'Error al generar el enlace móvil',
      });
    } finally {
      setLoading(false);
    }
  };

  // Revocar enlace
  const handleRevoke = async () => {
    if (
      !window.confirm(
        '¿Estás seguro de revocar el acceso móvil? Los dispositivos con el enlace no podrán acceder más.'
      )
    ) {
      return;
    }

    try {
      setLoading(true);
      const response = await api.delete('/admin/mobile-access/revoke');

      if (response.data.success) {
        setMobileLinks([]);
        setStatus({
          enabled: false,
          hasToken: false,
          expiresAt: null,
          isExpired: false,
          localIPs: status?.localIPs || [],
        });
        setMessage({
          type: 'info',
          text: '🚫 Acceso móvil revocado exitosamente',
        });
      }
    } catch (error) {
      console.error('Error revocando enlace:', error);
      setMessage({
        type: 'error',
        text: 'Error al revocar el enlace móvil',
      });
    } finally {
      setLoading(false);
    }
  };

  // Copiar enlace al portapapeles
  const handleCopy = url => {
    navigator.clipboard.writeText(url);
    setMessage({
      type: 'success',
      text: '📋 Enlace copiado al portapapeles',
    });
  };

  // Mostrar QR (placeholder - requiere librería adicional)
  const handleShowQR = url => {
    setSelectedLink(url);
    setShowQRDialog(true);
  };

  // Formatear fecha de expiración
  const formatExpiry = dateString => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleString('es-AR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        📱 Administración de Enlaces Móviles
      </Typography>

      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        Genera enlaces temporales para que dispositivos móviles puedan acceder a
        la aplicación en tu red local.
      </Typography>

      {/* Mensajes */}
      {message.text && (
        <Alert
          severity={message.type}
          sx={{ mb: 3 }}
          onClose={() => setMessage({ type: '', text: '' })}
        >
          {message.text}
        </Alert>
      )}

      {/* Estado actual */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              mb: 2,
            }}
          >
            <Typography variant="h6">Estado del Acceso Móvil</Typography>
            <IconButton onClick={loadStatus} disabled={loading}>
              <Refresh />
            </IconButton>
          </Box>

          {loading && !status ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
              <CircularProgress />
            </Box>
          ) : (
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Paper
                  sx={{
                    p: 2,
                    bgcolor: status?.enabled ? 'success.light' : 'grey.200',
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {status?.enabled ? (
                      <CheckCircle color="success" />
                    ) : (
                      <Cancel color="disabled" />
                    )}
                    <Typography variant="body1" fontWeight="bold">
                      Estado: {status?.enabled ? 'ACTIVO' : 'INACTIVO'}
                    </Typography>
                  </Box>
                </Paper>
              </Grid>

              <Grid item xs={12} md={6}>
                <Paper sx={{ p: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    <strong>Expira:</strong> {formatExpiry(status?.expiresAt)}
                  </Typography>
                  {status?.isExpired && (
                    <Chip
                      label="⚠️ Expirado"
                      color="warning"
                      size="small"
                      sx={{ mt: 1 }}
                    />
                  )}
                </Paper>
              </Grid>

              <Grid item xs={12}>
                <Paper sx={{ p: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    <strong>IPs de red local:</strong>
                  </Typography>
                  {status?.localIPs && status.localIPs.length > 0 ? (
                    <Box sx={{ mt: 1 }}>
                      {status.localIPs.map((ip, index) => (
                        <Chip
                          key={index}
                          label={ip}
                          size="small"
                          sx={{ mr: 1, mb: 1 }}
                        />
                      ))}
                    </Box>
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      No se detectaron IPs locales
                    </Typography>
                  )}
                </Paper>
              </Grid>
            </Grid>
          )}
        </CardContent>
      </Card>

      {/* Generar nuevo enlace */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Generar Nuevo Enlace
          </Typography>

          <Box
            sx={{
              display: 'flex',
              gap: 2,
              alignItems: 'center',
              flexWrap: 'wrap',
            }}
          >
            <TextField
              label="Horas de validez"
              type="number"
              value={expiryHours}
              onChange={e => setExpiryHours(e.target.value)}
              inputProps={{ min: 1, max: 168 }}
              sx={{ width: 150 }}
            />

            <Button
              variant="contained"
              color="primary"
              startIcon={<LinkIcon />}
              onClick={handleGenerate}
              disabled={loading}
            >
              Generar Enlace
            </Button>

            {status?.enabled && (
              <Button
                variant="contained"
                color="error"
                startIcon={<Delete />}
                onClick={handleRevoke}
                disabled={loading}
              >
                Revocar Acceso
              </Button>
            )}
          </Box>

          <Alert severity="info" sx={{ mt: 2 }}>
            💡 El enlace generado permitirá el acceso desde dispositivos móviles
            durante el tiempo especificado.
          </Alert>
        </CardContent>
      </Card>

      {/* Enlaces generados */}
      {mobileLinks.length > 0 && (
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              📱 Enlaces Generados
            </Typography>

            <Alert severity="success" sx={{ mb: 2 }}>
              Comparte estos enlaces con los dispositivos móviles que necesiten
              acceder
            </Alert>

            <List>
              {mobileLinks.map((link, index) => (
                <ListItem
                  key={index}
                  sx={{
                    border: '1px solid',
                    borderColor: 'divider',
                    borderRadius: 1,
                    mb: 1,
                    bgcolor: 'background.paper',
                  }}
                  secondaryAction={
                    <Box>
                      <IconButton
                        edge="end"
                        aria-label="copiar"
                        onClick={() => handleCopy(link.url)}
                        sx={{ mr: 1 }}
                      >
                        <ContentCopy />
                      </IconButton>
                      <IconButton
                        edge="end"
                        aria-label="qr"
                        onClick={() => handleShowQR(link.url)}
                      >
                        <QrCode2 />
                      </IconButton>
                    </Box>
                  }
                >
                  <ListItemText
                    primary={`IP: ${link.ip}`}
                    secondary={
                      <Typography
                        variant="body2"
                        sx={{
                          wordBreak: 'break-all',
                          fontFamily: 'monospace',
                          fontSize: '0.85rem',
                        }}
                      >
                        {link.url}
                      </Typography>
                    }
                  />
                </ListItem>
              ))}
            </List>
          </CardContent>
        </Card>
      )}

      {/* Dialog de QR Code */}
      <Dialog open={showQRDialog} onClose={() => setShowQRDialog(false)}>
        <DialogTitle>Código QR</DialogTitle>
        <DialogContent>
          <Box sx={{ textAlign: 'center', p: 2 }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Escanea este código con tu móvil
            </Typography>
            {/* Aquí iría el QR code - requiere librería como 'qrcode.react' */}
            <Box
              sx={{
                width: 200,
                height: 200,
                bgcolor: 'grey.200',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mx: 'auto',
                mb: 2,
              }}
            >
              <Typography variant="caption" color="text.secondary">
                QR Code
                <br />
                (Instalar librería)
              </Typography>
            </Box>
            <TextField
              fullWidth
              value={selectedLink}
              size="small"
              inputProps={{ readOnly: true }}
              sx={{ fontFamily: 'monospace', fontSize: '0.8rem' }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handleCopy(selectedLink)}>Copiar</Button>
          <Button onClick={() => setShowQRDialog(false)}>Cerrar</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminEnlaces;
