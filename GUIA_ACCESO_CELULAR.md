# 📱 GUÍA: ACCEDER DESDE TU CELULAR

## ✅ CONFIGURACIÓN COMPLETADA

Se han aplicado todos los cambios necesarios para que puedas acceder a la aplicación desde tu celular en la misma red WiFi.

---

## 🚀 PASOS PARA USAR EN TU CELULAR

### Paso 1: Configurar el Firewall (UNA SOLA VEZ)

1. **Haz clic derecho** en `CONFIGURAR-FIREWALL.bat`
2. Selecciona **"Ejecutar como Administrador"**
3. Acepta los permisos
4. Espera a ver: ✓ FIREWALL CONFIGURADO CORRECTAMENTE

**Esto solo se hace UNA VEZ.**

---

### Paso 2: Obtener tu IP del PC

Abre una terminal (CMD) y ejecuta:

```cmd
ipconfig
```

Busca la línea **"Dirección IPv4"** (algo como `192.168.1.235`)

**Tu IP actual es**: `192.168.1.235` (puede cambiar si reinicias el router)

---

### Paso 3: Actualizar .env si tu IP cambió

Si tu IP es diferente a `192.168.1.235`:

1. Abre el archivo: `front/.env`
2. Cambia la línea:
   ```
   VITE_API_URL=http://TU_IP_AQUI:3000
   ```
3. Guarda el archivo

---

### Paso 4: Iniciar el Sistema

1. **Haz doble clic** en `INICIAR-SISTEMA.bat`
2. Espera a que se abran 2 ventanas:
   - Backend (puerto 3000)
   - Frontend (puerto 5173)
3. Verifica que ambas muestren "ready" o "listening"

---

### Paso 5: Conectar desde tu Celular

1. **Asegúrate de que tu celular esté en la MISMA red WiFi que tu PC**

2. Abre el navegador de tu celular (Chrome, Safari, etc.)

3. Escribe en la barra de dirección:

   ```
   http://192.168.1.235:5173
   ```

   (Usa la IP de TU PC, no necesariamente esta)

4. ¡Deberías ver la aplicación! 🎉

---

## 📊 VERIFICACIÓN RÁPIDA

### En tu PC:

```bash
# Verifica que el backend escuche en todas las interfaces
netstat -ano | findstr :3000
# Deberías ver: 0.0.0.0:3000

# Verifica que el frontend escuche en todas las interfaces
netstat -ano | findstr :5173
# Deberías ver: 0.0.0.0:5173
```

### En tu celular:

1. Abre el navegador
2. Ve a: `http://TU_IP:5173`
3. Si carga → ✅ Todo funciona
4. Si no carga → Revisa la sección "Solución de Problemas"

---

## 🔧 CAMBIOS APLICADOS

### 1. Frontend (`front/vite.config.js`)

```javascript
server: {
  host: '0.0.0.0',   // Escucha en todas las interfaces
  port: 5173,
  strictPort: true
}
```

### 2. API Client (`front/src/api/api.js`)

```javascript
// Detecta automáticamente la URL correcta
const BASE_URL =
  import.meta.env.VITE_API_URL ||           // Desde .env (red local)
  import.meta.env.VITE_API_BASE_URL ||      // Fallback
  `${window.location.protocol}//${window.location.hostname}:3000`; // Auto
```

### 3. Variables de Entorno (`front/.env`)

```
VITE_API_URL=http://192.168.1.235:3000  # Tu IP local
```

### 4. Backend (`server/index.js`)

- ✅ Ya escucha en `0.0.0.0:3000`
- ✅ CORS configurado para red local
- ✅ Permite requests sin origin (apps móviles)

### 5. Firewall

- ✅ Puerto 3000 abierto (Backend)
- ✅ Puerto 5173 abierto (Frontend)

---

## 🚨 SOLUCIÓN DE PROBLEMAS

### Problema 1: "No se puede conectar al sitio"

**Causa**: Firewall bloqueando los puertos

**Solución**:

1. Ejecuta `CONFIGURAR-FIREWALL.bat` como Administrador
2. Verifica que las reglas se crearon:
   ```cmd
   netsh advfirewall firewall show rule name=all | findstr "LibroRes"
   ```

---

### Problema 2: "ERR_CONNECTION_REFUSED"

**Causa**: Los servidores no están corriendo

**Solución**:

1. Ejecuta `INICIAR-SISTEMA.bat`
2. Verifica que ambas ventanas muestren "ready"
3. En una terminal ejecuta:
   ```cmd
   netstat -ano | findstr "3000 5173"
   ```
4. Deberías ver ambos puertos LISTENING

---

### Problema 3: "Error de CORS" en el celular

**Causa**: El frontend está llamando a `localhost` en lugar de tu IP

**Solución**:

1. Verifica el archivo `front/.env`:
   ```
   VITE_API_URL=http://192.168.1.235:3000
   ```
2. La IP debe coincidir con la IP de tu PC
3. Reinicia el frontend:
   - Cierra la ventana del frontend
   - Vuelve a ejecutar `INICIAR-SISTEMA.bat`

---

### Problema 4: "No carga en el celular pero en PC sí"

**Causa**: No están en la misma red WiFi

**Solución**:

1. Verifica que el celular esté conectado a la misma WiFi que tu PC
2. No uses datos móviles en el celular
3. No uses VPN en el celular
4. Algunos routers tienen "aislamiento de cliente" activado:
   - Accede a la configuración del router
   - Desactiva "AP Isolation" o "Client Isolation"

---

### Problema 5: La IP de mi PC cambió

**Causa**: El router asignó una IP diferente (normal después de reiniciar)

**Solución**:

1. Obtén tu nueva IP:
   ```cmd
   ipconfig
   ```
2. Actualiza `front/.env`:
   ```
   VITE_API_URL=http://TU_NUEVA_IP:3000
   ```
3. Reinicia el frontend

**Para evitar esto**: Asigna una IP estática en tu router para tu PC.

---

## 📱 USANDO LOS ENLACES MÓVILES

Una vez que la app carga en tu celular, puedes usar la función de "Enlaces Móviles":

1. **En tu PC**, abre la aplicación
2. Ve a **"Enlaces Móviles"**
3. Genera un nuevo enlace
4. Verás una URL como:
   ```
   http://192.168.1.235:5173?token=abc123...
   ```
5. **Opciones para usarlo en tu celular**:
   - 📋 **Copiar**: Copia y pega en el navegador del celular
   - 📱 **QR**: Escanea el código QR con la cámara del celular
   - 🔗 **Probar**: Abre en nueva pestaña (desde el PC)

---

## 🔒 SEGURIDAD

### ✅ Seguro en tu red local:

- Los puertos solo aceptan conexiones de red local
- El CORS solo permite orígenes locales (192.168.x.x)
- No hay riesgo de acceso desde Internet

### ⚠️ Importante:

- **NO compartas tu IP pública** (la que ves en whatismyip.com)
- **NO expongas estos puertos directamente a Internet**
- Esta configuración es SOLO para tu red WiFi local

---

## 🎯 RESUMEN DE URLs

| Dispositivo    | URL                         | Cuándo usar            |
| -------------- | --------------------------- | ---------------------- |
| PC (localhost) | `http://localhost:5173`     | Desarrollo en tu PC    |
| PC (IP local)  | `http://192.168.1.235:5173` | Probar desde el PC     |
| Celular        | `http://192.168.1.235:5173` | Acceso desde celular   |
| Backend        | `http://192.168.1.235:3000` | API (no abras directo) |

---

## ✅ CHECKLIST FINAL

Antes de intentar acceder desde tu celular:

- [ ] Firewall configurado (ejecutaste `CONFIGURAR-FIREWALL.bat`)
- [ ] IP del PC obtenida con `ipconfig`
- [ ] Archivo `front/.env` actualizado con tu IP
- [ ] Backend corriendo (ventana abierta)
- [ ] Frontend corriendo (ventana abierta)
- [ ] Celular en la misma WiFi que el PC
- [ ] Probaste `http://TU_IP:5173` en el navegador del celular

---

## 🎊 ¡TODO LISTO!

Si seguiste todos los pasos, deberías poder acceder a la aplicación desde tu celular.

**URL para celular**: `http://192.168.1.235:5173`

**¿Funciona?** ¡Perfecto! Ahora puedes usar la app desde cualquier dispositivo en tu red local.

**¿No funciona?** Revisa la sección "Solución de Problemas" o ejecuta:

```bash
node test-enlaces-completo.cjs
```

---

_Última actualización: 14 de octubre de 2025, 23:45_  
_Configuración: Red Local WiFi_  
_Estado: ✅ LISTO PARA USAR_
