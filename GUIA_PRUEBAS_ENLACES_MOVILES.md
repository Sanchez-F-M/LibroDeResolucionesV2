# 🧪 GUÍA DE PRUEBAS - SISTEMA DE ENLACES MÓVILES

## ✅ IMPLEMENTACIÓN COMPLETADA

Se han realizado las siguientes mejoras al sistema:

### 1️⃣ **Frontend - AdminEnlaces.jsx Mejorado**

- ✅ Agregado `useCallback` para optimización
- ✅ Agregado Snackbar para notificaciones
- ✅ Mejorado manejo de errores con logs detallados
- ✅ Agregado botón "Probar Enlace" (OpenInNew icon)
- ✅ Mejorada UI con Chips, Dividers, AlertTitle
- ✅ Validaciones de entrada mejoradas (1-168 horas)
- ✅ Responsive design mejorado
- ✅ Iconos mejorados (SmartphoneOutlined, Warning, Info)

### 2️⃣ **Backend - Ya Funcionando**

Los endpoints en `server/index.js` ya están implementados:

- `GET /admin/mobile-access/status` - Obtener estado
- `POST /admin/mobile-access/generate` - Generar enlace
- `DELETE /admin/mobile-access/revoke` - Revocar acceso
- `POST /admin/mobile-access/verify` - Verificar token

### 3️⃣ **Script de Pruebas Creado**

- `server/test-mobile-links.js` - Pruebas automáticas completas

---

## 🚀 PASOS PARA PROBAR

### **PASO 1: Iniciar Servidores**

```bash
# Terminal 1 - Backend
cd server
node index.js

# Terminal 2 - Frontend (en otra terminal)
cd front
npm run dev
```

### **PASO 2: Abrir la Aplicación**

1. Abre el navegador en: **http://localhost:5173**
2. Inicia sesión con tu usuario admin
3. Ve a: **Administración de Enlaces Móviles**

### **PASO 3: Generar Enlaces**

1. En la interfaz:
   - Establece las horas de validez (ej: 24)
   - Haz clic en **"Generar Enlaces"**
2. Deberías ver:
   - ✅ Mensaje de éxito con Snackbar
   - 📱 Lista de enlaces con tu IP local
   - 🎯 Cada enlace tiene 3 botones:
     - 📋 Copiar (azul)
     - 🔗 Probar (verde) - **NUEVO**
     - 🔲 QR (morado)

### **PASO 4: Probar el Enlace**

**Opción A - Botón Probar:**

1. Haz clic en el botón verde 🔗 "Probar"
2. Se abrirá una nueva pestaña con el enlace completo
3. La aplicación debe funcionar normalmente

**Opción B - Copiar y Pegar:**

1. Haz clic en el botón azul 📋 "Copiar"
2. Verás notificación: "📋 Enlace copiado al portapapeles"
3. Pega el enlace en una nueva pestaña
4. La aplicación debe funcionar

**Opción C - Desde Móvil (Mismo WiFi):**

1. Conecta tu móvil a la misma red WiFi
2. Copia el enlace que aparece (ejemplo: `http://192.168.1.235:5174?token=...`)
3. Pega en el navegador del móvil
4. La aplicación debe cargar

### **PASO 5: Verificar Funcionalidad**

Una vez en la aplicación (con el enlace generado):

- ✅ Debes poder navegar
- ✅ Debes poder buscar resoluciones
- ✅ Debes poder ver resoluciones
- ✅ Todas las funciones deben trabajar normalmente

### **PASO 6: Revocar Acceso**

1. Vuelve a la página de administración
2. Haz clic en **"Revocar Acceso"** (botón rojo)
3. Confirma la acción
4. Los enlaces dejarán de funcionar

---

## 🧪 PRUEBAS MANUALES CON CURL

Si quieres probar los endpoints directamente:

```bash
# 1. Verificar estado
curl http://localhost:3000/admin/mobile-access/status

# 2. Generar enlace
curl -X POST http://localhost:3000/admin/mobile-access/generate \
  -H "Content-Type: application/json" \
  -d '{"expiryHours": 24}'

# 3. Verificar token (reemplaza con tu token)
curl -X POST http://localhost:3000/admin/mobile-access/verify \
  -H "Content-Type: application/json" \
  -d '{"token": "TU_TOKEN_AQUI"}'

# 4. Revocar acceso
curl -X DELETE http://localhost:3000/admin/mobile-access/revoke
```

---

## 📊 LOGS A OBSERVAR

### En el Backend (Terminal del servidor):

```
✅ Origen permitido: http://localhost:5173
📋 [timestamp] POST /admin/mobile-access/generate
📱 Enlace móvil generado: [token]
🔍 Verificando acceso desde IP: ::ffff:127.0.0.1
✅ Acceso local permitido
```

### En el Frontend (Consola del navegador - F12):

```
🔄 Cargando estado del acceso móvil...
✅ Estado recibido: {enabled: true, hasToken: true, ...}
🔄 Generando nuevo enlace...
✅ Respuesta del servidor: {success: true, links: [...]}
📱 Enlaces regenerados: 1
```

---

## ❓ SOLUCIÓN DE PROBLEMAS

### Problema: "No se detectaron IPs locales"

**Solución:**

- Verifica tu conexión WiFi/Ethernet
- El servidor debe estar en una red local
- Prueba con `ipconfig` (Windows) o `ifconfig` (Mac/Linux)

### Problema: "Error al generar enlaces"

**Solución:**

- Verifica que el backend esté corriendo en puerto 3000
- Revisa los logs del servidor
- Verifica que no haya errores de CORS

### Problema: "Token expirado"

**Solución:**

- Genera un nuevo enlace
- Revoca el acceso anterior si es necesario
- Verifica la fecha/hora del servidor

### Problema: "El enlace no funciona en móvil"

**Solución:**

- Verifica que estés en la misma red WiFi
- Usa la IP correcta (no localhost)
- Verifica que el firewall no bloquee el puerto 5174
- Prueba desactivando temporalmente el firewall

---

## 🎯 CHECKLIST DE FUNCIONALIDAD

Marca cada item después de probarlo:

- [ ] Servidor backend corriendo en puerto 3000
- [ ] Frontend corriendo en puerto 5173/5174
- [ ] Página de Admin Enlaces carga correctamente
- [ ] Se pueden generar enlaces sin errores
- [ ] Aparecen notificaciones (Snackbar)
- [ ] Los enlaces se muestran con formato correcto
- [ ] Botón "Copiar" funciona
- [ ] Botón "Probar" abre nueva pestaña con la app
- [ ] La aplicación funciona con el enlace generado
- [ ] Se puede revocar el acceso
- [ ] Después de revocar, el enlace ya no funciona
- [ ] El estado se actualiza correctamente
- [ ] Los logs del servidor muestran actividad

---

## 📱 PRUEBA EN DISPOSITIVO MÓVIL

### Preparación:

1. Asegúrate de que tu PC y móvil estén en la misma red WiFi
2. Genera un enlace desde la aplicación
3. Identifica tu IP local (ejemplo: 192.168.1.235)

### En el Móvil:

1. Abre el navegador (Chrome, Safari, etc.)
2. Pega el enlace completo: `http://192.168.1.235:5174?token=...`
3. La aplicación debe cargar normalmente
4. Prueba navegar, buscar, etc.

### Solución si no funciona:

```bash
# En Windows, verifica tu firewall:
# 1. Abre Windows Defender Firewall
# 2. Permitir una app a través del firewall
# 3. Busca Node.js o vite
# 4. Marca ambas casillas (Privado y Público)
```

---

## 📝 NOTAS IMPORTANTES

1. **Los enlaces solo funcionan en red local** (misma WiFi)
2. **No exponer a Internet** sin configurar seguridad adicional
3. **Los tokens tienen fecha de expiración** (por defecto 24 horas)
4. **Un token puede usarse múltiples veces** hasta que expire
5. **Revocar elimina todos los enlaces activos** inmediatamente

---

## ✨ MEJORAS IMPLEMENTADAS

### UI/UX:

- ✅ Snackbar para notificaciones temporales
- ✅ Botón "Probar enlace" para testing rápido
- ✅ Mejor feedback visual con iconos
- ✅ Diseño más profesional con Dividers y AlertTitle
- ✅ Chips para mostrar IPs de forma clara
- ✅ Hover effects en tarjetas de enlaces

### Funcionalidad:

- ✅ Validación de entrada (1-168 horas)
- ✅ Manejo de errores mejorado
- ✅ Logs detallados en consola
- ✅ Optimización con useCallback
- ✅ Estados de carga mejorados

### Backend:

- ✅ Ya estaba completo en index.js
- ✅ CORS configurado para red local
- ✅ Detección automática de IPs
- ✅ Manejo de tokens en memoria

---

## 🎉 RESULTADO ESPERADO

Si todo funciona correctamente:

1. ✅ Puedes generar enlaces sin errores
2. ✅ Los enlaces se muestran con tu IP local
3. ✅ Al hacer clic en "Probar", la app abre en nueva pestaña
4. ✅ La aplicación funciona normalmente con el enlace
5. ✅ Recibes notificaciones claras de cada acción
6. ✅ Puedes revocar el acceso cuando quieras
7. ✅ Los logs muestran toda la actividad

---

## 📞 SIGUIENTE PASO

**Prueba ahora mismo:**

1. Abre http://localhost:5173 en tu navegador
2. Inicia sesión
3. Ve a "Administración de Enlaces Móviles"
4. Genera un enlace
5. Haz clic en el botón verde "Probar" (icono de nueva pestaña)
6. ¡Verifica que todo funcione! 🚀

**Si encuentras algún problema, revisa:**

- Logs del backend (terminal del servidor)
- Consola del navegador (F12)
- Esta guía de solución de problemas

---

¡MUCHA SUERTE! 🎉
