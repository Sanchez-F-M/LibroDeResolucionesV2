# 📱 Sistema de Enlaces Móviles Temporales

## 🎯 Descripción

Este sistema permite que tu aplicación funcione **SOLO en red local** (tu computadora y red WiFi), pero puedes generar enlaces temporales para que dispositivos móviles accedan desde tu misma red.

## 🔐 Características de Seguridad

- ✅ **Solo red local**: La aplicación no es accesible desde Internet
- ✅ **Enlaces temporales**: Los enlaces expiran automáticamente
- ✅ **Control total**: Puedes revocar el acceso en cualquier momento
- ✅ **Tokens únicos**: Cada enlace tiene un token único e irrepetible

## 🚀 Cómo Usar

### 1️⃣ Iniciar el Backend (Servidor)

```bash
cd server
npm install
npm start
```

El servidor se iniciará en el puerto **3000** por defecto.

### 2️⃣ Iniciar el Frontend (Interfaz)

```bash
cd front
npm install
npm run dev
```

El frontend se iniciará típicamente en el puerto **5174** (o 5173).

### 3️⃣ Acceder desde tu Computadora

Abre tu navegador en:

- **http://localhost:5174**

Inicia sesión con tus credenciales.

### 4️⃣ Generar Enlace para Móviles

1. **Ve a la página de administración de enlaces:**

   - URL: `http://localhost:5174/admin/enlaces`
   - O desde el menú de navegación

2. **Configura el tiempo de expiración:**

   - Por defecto: 24 horas
   - Puedes elegir desde 1 hora hasta 168 horas (7 días)

3. **Haz clic en "Generar Enlace"**

4. **Verás una lista de enlaces** como:
   ```
   IP: 192.168.1.100
   http://192.168.1.100:5174?token=abc123-def456-ghi789
   ```

### 5️⃣ Compartir Enlace con Móvil

**Opción A: Copiar y enviar**

1. Haz clic en el ícono de copiar 📋
2. Envía el enlace por WhatsApp, email, etc.
3. Abre el enlace en el móvil

**Opción B: Código QR** (próximamente)

1. Haz clic en el ícono QR 📱
2. Escanea con la cámara del móvil

### 6️⃣ Revocar Acceso

Cuando quieras desactivar el enlace:

1. **Ve a la página de administración**
2. **Haz clic en "Revocar Acceso"**
3. **Confirma la acción**

Inmediatamente, todos los dispositivos móviles perderán acceso.

## 🌐 Requisitos de Red

### Para que funcione, necesitas:

1. **Misma red WiFi**

   - Tu computadora y el móvil deben estar en la misma red WiFi

2. **Encontrar tu IP local:**

   **En Windows:**

   ```cmd
   ipconfig
   ```

   Busca "IPv4 Address" en la sección de tu adaptador WiFi.
   Ejemplo: `192.168.1.100`

   **En Mac/Linux:**

   ```bash
   ifconfig
   ```

   Busca "inet" en la sección de tu red WiFi.
   Ejemplo: `192.168.1.100`

3. **Puerto del frontend:**
   - Por defecto: 5174
   - Puedes verificarlo en la terminal donde ejecutaste `npm run dev`

## 📋 Ejemplo Completo de Uso

### Escenario: Mostrar la app en tu móvil

1. **Inicia el backend:**

   ```bash
   cd server
   npm start
   ```

   ✅ Servidor corriendo en http://localhost:3000

2. **Inicia el frontend:**

   ```bash
   cd front
   npm run dev
   ```

   ✅ Frontend corriendo en http://localhost:5174

3. **Abre en tu computadora:**

   - URL: http://localhost:5174
   - Login con tu usuario

4. **Ve a Admin Enlaces:**

   - URL: http://localhost:5174/admin/enlaces

5. **Genera enlace:**

   - Tiempo: 24 horas
   - Haz clic en "Generar Enlace"

6. **Copia el enlace que aparece:**

   ```
   http://192.168.1.100:5174?token=abc123-def456-ghi789
   ```

7. **Envía el enlace a tu móvil** (WhatsApp, email, etc.)

8. **Abre el enlace en el móvil:**

   - Asegúrate de estar en la misma WiFi
   - El enlace abrirá la aplicación

9. **Para desactivar:**
   - Vuelve a la página de Admin en tu computadora
   - Haz clic en "Revocar Acceso"
   - El móvil ya no podrá acceder

## 🔧 Configuración Avanzada

### Cambiar tiempo de expiración por defecto

En `server/index.js`:

```javascript
const { expiryHours = 24 } = req.body
```

Cambia `24` por el número de horas que prefieras.

### Cambiar puerto del frontend

En `front/vite.config.js`:

```javascript
export default defineConfig({
  server: {
    port: 5174, // Cambia este número
  },
})
```

### Habilitar acceso sin token (desarrollo)

En `server/index.js`, comenta la sección del middleware:

```javascript
// app.use((req, res, next) => {
//   ... middleware de control de acceso
// })
```

⚠️ **NO HACER ESTO EN PRODUCCIÓN**

## 🐛 Solución de Problemas

### Problema: "No puedo acceder desde el móvil"

**Solución:**

1. Verifica que estés en la misma red WiFi
2. Verifica que el enlace tenga el token correcto
3. Verifica que el enlace no haya expirado
4. Verifica que el firewall no bloquee el puerto

### Problema: "El enlace expiró"

**Solución:**

1. Genera un nuevo enlace
2. Aumenta el tiempo de expiración

### Problema: "No veo mi IP local"

**Solución:**

1. Ejecuta `ipconfig` (Windows) o `ifconfig` (Mac/Linux)
2. Busca la IP que empieza con `192.168.` o `10.0.`
3. Usa esa IP en el enlace manualmente

### Problema: "Firewall bloquea la conexión"

**Solución:**

1. Windows: Permite el puerto 5174 y 3000 en el Firewall
2. Mac: Ve a Preferencias del Sistema > Seguridad > Firewall

## 📱 API Endpoints

### Generar enlace

```
POST /admin/mobile-access/generate
Body: { "expiryHours": 24 }
```

### Ver estado

```
GET /admin/mobile-access/status
```

### Revocar enlace

```
DELETE /admin/mobile-access/revoke
```

### Verificar token

```
POST /admin/mobile-access/verify
Body: { "token": "abc123..." }
```

## 🔒 Notas de Seguridad

1. **No compartas enlaces públicamente**

   - Los enlaces solo funcionan en tu red local
   - Pero no los publiques en redes sociales

2. **Revoca enlaces cuando no los uses**

   - Mejor práctica: Genera enlaces solo cuando los necesites

3. **Usa tiempos de expiración cortos**

   - Para demostraciones: 1-2 horas
   - Para uso prolongado: 24 horas máximo

4. **La aplicación NO es accesible desde Internet**
   - Solo funciona en tu red local
   - No necesitas cerrar puertos o configurar router

## 📞 Soporte

Si tienes problemas:

1. Revisa los logs de la consola del navegador (F12)
2. Revisa los logs del servidor en la terminal
3. Verifica la configuración de red

## 🎉 ¡Listo!

Tu aplicación ahora funciona SOLO localmente pero puedes compartir acceso temporal a dispositivos móviles de manera segura y controlada.
