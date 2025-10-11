# 🔧 Solución de Problemas - ERR_CONNECTION_REFUSED

## ❌ Error: `ERR_CONNECTION_REFUSED` al intentar login

Este error significa que el **frontend no puede conectarse al backend**.

### 🔍 Diagnóstico

El error ocurre cuando:

- El servidor backend no está ejecutándose
- El servidor está en un puerto diferente
- Hay problemas de firewall o CORS

### ✅ Solución Paso a Paso

#### 1. Verificar que el backend esté ejecutándose

```bash
# Abrir una terminal en la carpeta del proyecto
cd c:\Users\flavi\OneDrive\Escritorio\LibroDeResolucionesV2

# Navegar a la carpeta del servidor
cd server

# Instalar dependencias (si es primera vez)
npm install

# Iniciar el servidor
npm run dev
```

**Deberías ver algo como:**

```
🚀 Servidor iniciado en http://localhost:3000
✅ Base de datos conectada
```

#### 2. Verificar la conexión desde el navegador

Abre en tu navegador:

```
http://localhost:3000/health
```

**Deberías ver:**

```json
{
  "status": "ok",
  "timestamp": "2025-10-10T...",
  "uptime": 123.45
}
```

#### 3. Iniciar el frontend

```bash
# En OTRA terminal, navegar a la carpeta front
cd c:\Users\flavi\OneDrive\Escritorio\LibroDeResolucionesV2\front

# Instalar dependencias (si es primera vez)
npm install

# Iniciar el frontend
npm run dev
```

**Deberías ver:**

```
VITE v5.x.x  ready in XXX ms

➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
```

#### 4. Probar el login

1. Abre http://localhost:5173 en tu navegador
2. Haz clic en "🔍 Probar Conexión al Servidor"
3. Si aparece "✅ Conexión exitosa", intenta hacer login

### 🐛 Si el problema persiste

#### Verificar puertos en uso

```bash
# Windows PowerShell
netstat -ano | findstr :3000
netstat -ano | findstr :5173
```

Si el puerto 3000 está ocupado:

- Cierra la aplicación que lo usa
- O cambia el puerto en `server/index.js` y `front/.env.development`

#### Verificar variables de entorno

Asegúrate de que existe el archivo `front/.env.development`:

```env
VITE_API_BASE_URL=http://localhost:3000
VITE_APP_ENV=development
```

#### Limpiar caché y reinstalar

```bash
# En la carpeta server
rm -rf node_modules package-lock.json
npm install

# En la carpeta front
rm -rf node_modules package-lock.json dist
npm install
```

### 📞 Credenciales por defecto

Según `LoginMejorado.jsx`, las credenciales de prueba son:

- **Usuario:** `admin`
- **Contraseña:** `admin123`

### 🔧 Script de verificación

Ejecuta este comando para verificar automáticamente:

```bash
node scripts/check-backend.js
```

### 📊 Logs útiles

**Ver logs del backend:**

```bash
cd server
npm run dev
# Los logs aparecerán en la terminal
```

**Ver logs del frontend:**

- Abre el navegador
- Presiona F12
- Ve a la pestaña "Console"
- Busca mensajes que empiecen con 🔧, 📤, ✅ o ❌

### 🆘 Contacto

Si ninguna de estas soluciones funciona, revisa:

1. Firewall de Windows
2. Antivirus que pueda estar bloqueando puertos
3. Configuración de red (VPN, proxy)
