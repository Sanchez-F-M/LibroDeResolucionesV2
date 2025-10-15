import { useState, useEffect, useCallback } from 'react';
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
  Divider,
  Snackbar,
  AlertTitle,
  useTheme,
  useMediaQuery,
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
  Warning,
  Info,
  OpenInNew,
  SmartphoneOutlined,
} from '@mui/icons-material';
import api from '../../api/api';

const AdminEnlaces = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null);
  const [mobileLinks, setMobileLinks] = useState([]);
  const [expiryHours, setExpiryHours] = useState(24);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [showQRDialog, setShowQRDialog] = useState(false);
  const [selectedLink, setSelectedLink] = useState('');
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'info',
  });

  // ✅ Cargar estado al montar
  useEffect(() => {
    loadStatus();
  }, []);

  // ✅ Cargar estado del acceso móvil (MEJORADO)
  const loadStatus = useCallback(async () => {
    try {
      setLoading(true);
      console.log('🔄 Cargando estado del acceso móvil...');

      const response = await api.get('/admin/mobile-access/status');
      console.log('✅ Estado recibido:', response.data);

      setStatus(response.data);

      // Si hay token activo, regenerar los enlaces para visualización
      if (
        response.data.enabled &&
        response.data.hasToken &&
        response.data.localIPs
      ) {
        const frontendPort = window.location.port || '5173'; // Usar el puerto actual del frontend
        const links = response.data.localIPs.map(ip => ({
          ip,
          url: `http://${ip}:${frontendPort}?token=***`, // Ocultamos el token por seguridad
          fullUrl: `http://${ip}:${frontendPort}`, // URL base para testing
        }));
        setMobileLinks(links);
        console.log('📱 Enlaces regenerados:', links.length);
      } else {
        setMobileLinks([]);
      }

      setMessage({ type: '', text: '' });
    } catch (error) {
      console.error('❌ Error cargando estado:', error);
      const errorMsg =
        error.response?.data?.message || error.message || 'Error desconocido';
      setMessage({
        type: 'error',
        text: `Error al cargar el estado: ${errorMsg}`,
      });
      setSnackbar({
        open: true,
        message: `Error: ${errorMsg}`,
        severity: 'error',
      });
    } finally {
      setLoading(false);
    }
  }, []);

  // ✅ Generar nuevo enlace (MEJORADO CON VALIDACIONES)
  const handleGenerate = async () => {
    // Validar input
    const hours = parseInt(expiryHours);
    if (isNaN(hours) || hours < 1 || hours > 168) {
      setSnackbar({
        open: true,
        message: '⚠️ Las horas deben estar entre 1 y 168',
        severity: 'warning',
      });
      return;
    }

    try {
      setLoading(true);
      console.log('🔄 Generando nuevo enlace...');

      const response = await api.post('/admin/mobile-access/generate', {
        expiryHours: hours,
      });

      console.log('✅ Respuesta del servidor:', response.data);

      if (response.data.success) {
        // Actualizar enlaces con el token real
        const linksWithToken = response.data.links.map(link => ({
          ...link,
          url: link.url, // Ya viene con el token
        }));

        setMobileLinks(linksWithToken);

        setStatus({
          enabled: true,
          hasToken: true,
          expiresAt: response.data.expiresAt,
          isExpired: false,
          localIPs: response.data.links.map(l => l.ip),
          port: window.location.port || '5173', // Usar puerto actual
        });

        setMessage({
          type: 'success',
          text: `✅ ${linksWithToken.length} enlace(s) generado(s) exitosamente. Expira en ${hours} horas.`,
        });

        setSnackbar({
          open: true,
          message: `🎉 Enlaces listos para compartir!`,
          severity: 'success',
        });
      }
    } catch (error) {
      console.error('❌ Error generando enlace:', error);
      const errorMsg =
        error.response?.data?.message || error.message || 'Error desconocido';
      setMessage({
        type: 'error',
        text: `❌ Error: ${errorMsg}`,
      });
      setSnackbar({
        open: true,
        message: `Error generando enlaces: ${errorMsg}`,
        severity: 'error',
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

  // ✅ Copiar enlace al portapapeles (MEJORADO)
  const handleCopy = useCallback(url => {
    navigator.clipboard
      .writeText(url)
      .then(() => {
        setSnackbar({
          open: true,
          message: '📋 Enlace copiado al portapapeles',
          severity: 'success',
        });
      })
      .catch(err => {
        console.error('Error copiando:', err);
        setSnackbar({
          open: true,
          message: '❌ Error al copiar',
          severity: 'error',
        });
      });
  }, []);

  // ✅ Mostrar QR
  const handleShowQR = url => {
    setSelectedLink(url);
    setShowQRDialog(true);
  };

  // ✅ Formatear fecha de expiración
  const formatExpiry = dateString => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      return date.toLocaleString('es-AR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch (error) {
      return 'Formato inválido';
    }
  };

  // ✅ Función para testear un enlace
  const handleTestLink = useCallback(url => {
    window.open(url, '_blank');
  }, []);

  return (
    <Box sx={{ p: 3, maxWidth: 1400, mx: 'auto' }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h4"
          gutterBottom
          sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
        >
          <PhoneAndroid color="primary" />
          Administración de Enlaces Móviles
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Genera enlaces temporales para que dispositivos móviles puedan acceder
          a la aplicación en tu red local.
        </Typography>
      </Box>

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
        <Card sx={{ boxShadow: 3 }}>
          <CardContent>
            <Typography
              variant="h6"
              gutterBottom
              sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
            >
              <CheckCircle color="success" />
              Enlaces Generados ({mobileLinks.length})
            </Typography>

            <Divider sx={{ my: 2 }} />

            <Alert severity="success" sx={{ mb: 3 }}>
              <AlertTitle>¡Enlaces listos!</AlertTitle>
              Comparte estos enlaces con los dispositivos móviles que necesiten
              acceder. Los enlaces son válidos hasta:{' '}
              <strong>{formatExpiry(status?.expiresAt)}</strong>
            </Alert>

            <List>
              {mobileLinks.map((link, index) => (
                <ListItem
                  key={index}
                  sx={{
                    border: '2px solid',
                    borderColor: 'primary.main',
                    borderRadius: 2,
                    mb: 2,
                    bgcolor: 'background.paper',
                    boxShadow: 2,
                    '&:hover': {
                      boxShadow: 4,
                      transform: 'translateY(-2px)',
                      transition: 'all 0.2s',
                    },
                  }}
                  secondaryAction={
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <IconButton
                        edge="end"
                        aria-label="copiar"
                        onClick={() => handleCopy(link.url)}
                        color="primary"
                        title="Copiar enlace"
                      >
                        <ContentCopy />
                      </IconButton>
                      <IconButton
                        edge="end"
                        aria-label="probar"
                        onClick={() => handleTestLink(link.url)}
                        color="success"
                        title="Abrir en nueva pestaña"
                      >
                        <OpenInNew />
                      </IconButton>
                      <IconButton
                        edge="end"
                        aria-label="qr"
                        onClick={() => handleShowQR(link.url)}
                        color="secondary"
                        title="Ver código QR"
                      >
                        <QrCode2 />
                      </IconButton>
                    </Box>
                  }
                >
                  <ListItemText
                    primary={
                      <Chip
                        label={`IP: ${link.ip}`}
                        color="primary"
                        variant="outlined"
                        icon={<SmartphoneOutlined />}
                        sx={{ fontFamily: 'monospace', fontWeight: 'bold' }}
                      />
                    }
                    secondary={
                      <Box component="span" sx={{ display: 'block', mt: 1 }}>
                        <Typography
                          component="span"
                          variant="caption"
                          display="block"
                          color="text.secondary"
                          gutterBottom
                        >
                          Enlace completo:
                        </Typography>
                        <Typography
                          component="span"
                          variant="body2"
                          display="block"
                          sx={{
                            wordBreak: 'break-all',
                            fontFamily: 'monospace',
                            fontSize: '0.85rem',
                            bgcolor: 'grey.100',
                            p: 1,
                            borderRadius: 1,
                            border: '1px solid',
                            borderColor: 'grey.300',
                          }}
                        >
                          {link.url}
                        </Typography>
                      </Box>
                    }
                    secondaryTypographyProps={{
                      component: 'div',
                    }}
                    sx={{ pr: 15 }}
                  />
                </ListItem>
              ))}
            </List>
          </CardContent>
        </Card>
      )}

      {/* Snackbar para notificaciones */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>

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
