# 🔘 BOTONES DE ENLACE - GUÍA VISUAL

## ✅ FRONTEND REINICIADO

El frontend ahora tiene los últimos cambios con el botón "Probar".

---

## 🎯 CÓMO VERLOS

### **PASO 1: Recarga la Página**

En tu navegador (página de Admin Enlaces):

**Windows:**

```
Ctrl + Shift + R
```

**O también:**

1. Presiona **F12**
2. Clic derecho en el botón recargar
3. Selecciona **"Vaciar caché y recargar de manera forzada"**

### **PASO 2: Genera Enlaces**

1. Haz clic en **"Generar Enlaces"**
2. Espera la notificación de éxito

---

## 👀 CÓMO DEBERÍAN VERSE LOS BOTONES

Después de generar un enlace, verás **3 BOTONES** para cada enlace:

```
┌──────────────────────────────────────────────────────┐
│  IP: 192.168.1.235                                   │
│                                                      │
│  Enlace completo:                                    │
│  http://192.168.1.235:5173?token=abc123...          │
│                                                      │
│              [📋] [🔗] [⬜]                          │
│              Azul Verde Morado                       │
└──────────────────────────────────────────────────────┘
```

### **Botón 1: 📋 COPIAR (Azul)**

- **Icono:** ContentCopy (dos papeles)
- **Color:** Azul primario
- **Función:** Copia el enlace al portapapeles
- **Tooltip:** "Copiar enlace"

### **Botón 2: 🔗 PROBAR (Verde)** ⭐ NUEVO

- **Icono:** OpenInNew (flecha saliendo de cuadro)
- **Color:** Verde (success)
- **Función:** Abre el enlace en nueva pestaña
- **Tooltip:** "Abrir en nueva pestaña"

### **Botón 3: ⬜ QR (Morado)**

- **Icono:** QrCode2 (código QR)
- **Color:** Morado (secondary)
- **Función:** Muestra código QR
- **Tooltip:** "Ver código QR"

---

## 🔍 VERIFICACIÓN

### Si NO ves los 3 botones:

1. **Verifica que estás en la página correcta:**

   - URL debe ser: `http://localhost:5173`
   - Debes estar en "Administración de Enlaces Móviles"

2. **Genera enlaces primero:**

   - Haz clic en "Generar Enlaces"
   - Espera que aparezcan las tarjetas

3. **Los botones están a la derecha de cada enlace:**

   ```
   IP: 192.168.1.235           [📋] [🔗] [⬜]
   ```

4. **Abre consola del navegador (F12):**
   - Ve a la pestaña "Console"
   - Busca errores en rojo
   - Si hay errores, cópialos y compártelos

---

## 🧪 PRUEBA RÁPIDA

### **Modo Inspección:**

1. Genera enlaces
2. Presiona **F12** (abrir DevTools)
3. Haz clic en el selector de elementos (o presiona Ctrl+Shift+C)
4. Pasa el mouse sobre los botones
5. Deberías ver en el código HTML:
   ```html
   <button title="Abrir en nueva pestaña" ...>
     <svg> <!-- Icono OpenInNew -->
   </button>
   ```

---

## 📸 COMPARACIÓN

### ANTES (Sin botón Probar):

```
[📋 Copiar]  [⬜ QR]
```

### AHORA (Con botón Probar):

```
[📋 Copiar]  [🔗 Probar]  [⬜ QR]
```

---

## 🚨 SI SIGUES SIN VERLO

### Opción 1: Cierra el navegador completamente

```
1. Cierra TODAS las pestañas
2. Cierra el navegador
3. Espera 5 segundos
4. Abre de nuevo: http://localhost:5173
5. Inicia sesión
6. Ve a Admin Enlaces
7. Genera enlaces
```

### Opción 2: Usa otro navegador

```
- Si usas Chrome, prueba en Edge
- Si usas Firefox, prueba en Chrome
- Navegador limpio = caché limpio
```

### Opción 3: Modo Incógnito

```
1. Abre ventana incógnita (Ctrl+Shift+N en Chrome)
2. Ve a: http://localhost:5173
3. Inicia sesión
4. Genera enlaces
5. Verifica si aparecen los 3 botones
```

---

## 🔧 VERIFICAR CÓDIGO

Si quieres ver el código de los botones en tu navegador:

1. **F12** (abrir DevTools)
2. **Elementos** (o Elements)
3. **Ctrl+F** para buscar
4. Busca: `OpenInNew`
5. Deberías encontrar el componente del botón

---

## 💡 FUNCIONALIDAD DEL BOTÓN PROBAR

Cuando hagas clic en el botón verde:

```javascript
// Esto ejecuta:
window.open(link.url, '_blank')

// Donde link.url es:
"http://192.168.1.235:5173?token=abc123..."
```

**Resultado esperado:**

- Se abre una **nueva pestaña**
- La URL contiene el **token completo**
- La aplicación **carga normalmente**

---

## ✅ CHECKLIST DE VERIFICACIÓN

Marca cada uno:

- [ ] Frontend reiniciado (acabamos de hacerlo)
- [ ] Navegador recargado con Ctrl+Shift+R
- [ ] Página de Admin Enlaces abierta
- [ ] Enlaces generados (botón "Generar Enlaces")
- [ ] Tarjetas de enlaces visibles
- [ ] 3 botones visibles a la derecha de cada enlace
- [ ] Botón verde del medio es "Probar"
- [ ] Al pasar mouse muestra "Abrir en nueva pestaña"
- [ ] Al hacer clic abre nueva pestaña
- [ ] La aplicación carga en la nueva pestaña

---

## 🎯 PRÓXIMO PASO

1. **Recarga la página:** Ctrl+Shift+R
2. **Genera enlaces**
3. **Busca los 3 botones** a la derecha
4. **Haz clic en el botón verde** (del medio)
5. **¡Debería abrir la app!** 🚀

---

Si después de recargar la página **TODAVÍA** no ves el botón verde, toma una captura de pantalla de cómo se ve tu página y compártela.
