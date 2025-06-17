# 🔍 GUÍA VISUAL: DÓNDE ENCONTRAR CONFIGURACIONES DE CLOUDINARY

## 📍 **1. VITE_CLOUDINARY_CLOUD_NAME**

### **Paso a paso:**
1. **Ve a**: https://console.cloudinary.com
2. **Inicia sesión** en tu cuenta
3. **En la página principal** verás un recuadro como este:

```
┌─────────────────────────────────────────┐
│ 📊 Account Details                      │
│ ────────────────────────────────────── │  
│ Cloud name: dxy123abc                   │ ← COPIAR ESTE VALOR
│ API Key: 123456789012345                │
│ API Secret: ●●●●●●●●●●●●●●●●             │
│ Environment variable:                   │
│ CLOUDINARY_URL=cloudinary://...         │
└─────────────────────────────────────────┘
```

4. **Copia exactamente** el valor que aparece después de "Cloud name:"
5. **Ejemplo**: Si aparece `dxy123abc`, usa exactamente `dxy123abc`

---

## 📍 **2. VITE_CLOUDINARY_UPLOAD_PRESET**

### **¿Qué es un Upload Preset?**
Un Upload Preset es una configuración predefinida que permite al frontend subir imágenes directamente a Cloudinary sin exponer tu API Secret.

### **Opción A: Crear nuevo Upload Preset (Recomendado)**

1. **En Cloudinary Dashboard** → clic en **⚙️ Settings**
2. **Clic en tab "Upload"**
3. **Scroll hacia abajo** hasta encontrar "Upload presets"
4. **Clic en "Add upload preset"**
5. **Configurar así**:
   ```
   Preset name: libro-resoluciones-preset
   Signing Mode: Unsigned ← MUY IMPORTANTE
   Folder: libro-resoluciones
   Resource type: Auto
   Access mode: Public
   ```
6. **Save**
7. **Copiar el nombre**: `libro-resoluciones-preset`

### **Opción B: Usar Upload Preset existente**

1. **Settings** → **Upload tab**
2. **En "Upload presets"** verás una lista como:
   ```
   📋 Upload presets:
   ├── ml_default (Signed)
   ├── unsigned_preset (Unsigned) ← USAR ESTE TIPO
   └── my_preset (Signed)
   ```
3. **Busca uno que sea "Unsigned"**
4. **Copia el nombre exacto**

⚠️ **CRÍTICO**: Debe ser **"Unsigned"** para funcionar desde el frontend

---

## 📍 **3. VERIFICAR TU CONFIGURACIÓN ACTUAL**

### **Buscar en tu código actual:**

Tu backend ya tiene configuración de Cloudinary. Veamos qué tienes:

```javascript
// En server/config/cloudinary.js
cloud_name: process.env.CLOUDINARY_CLOUD_NAME
```

Esto significa que tu backend YA usa la variable `CLOUDINARY_CLOUD_NAME`.

### **Para el frontend necesitas:**
- `VITE_CLOUDINARY_CLOUD_NAME` (mismo valor que `CLOUDINARY_CLOUD_NAME`)
- `VITE_CLOUDINARY_UPLOAD_PRESET` (el que crees/encuentres)

---

## 📍 **4. CONFIGURAR EN VERCEL**

1. **Ve a**: https://vercel.com/dashboard
2. **Selecciona tu proyecto frontend**
3. **Settings** → **Environment Variables**
4. **Add New Variable** (para cada una):

### **Variable 1:**
```
Name: VITE_CLOUDINARY_CLOUD_NAME
Value: [el cloud_name que copiaste]
Environment: ✅ Production ✅ Preview ✅ Development
```

### **Variable 2:**
```
Name: VITE_CLOUDINARY_UPLOAD_PRESET  
Value: [el upload_preset que creaste]
Environment: ✅ Production ✅ Preview ✅ Development
```

---

## 📍 **5. SOBRE VITE_BUILD_OUTPUT**

### **¿Necesitas configurarlo?**
**❌ NO** en la mayoría de casos porque:
- Vite usa `dist` por defecto
- Vercel detecta automáticamente el build folder
- Solo necesario si cambias la configuración de build en `vite.config.js`

### **¿Cuándo SÍ configurarlo?**
Solo si tu `vite.config.js` tiene algo como:
```javascript
export default {
  build: {
    outDir: 'build' // ← Si cambias esto, usa VITE_BUILD_OUTPUT=build
  }
}
```

---

## 🧪 **VERIFICACIÓN FINAL**

### **Después de configurar:**
1. **Redesplegar** en Vercel
2. **Abrir consola del navegador** (F12)
3. **Buscar logs** como:
   ```
   Cloudinary configurado con cloud_name: tu_cloud_name
   Upload preset: tu_upload_preset
   ```
4. **Probar subir una imagen**

### **Valores de ejemplo:**
```bash
# En Vercel:
VITE_API_URL=https://libroderesoluciones-api.onrender.com
VITE_CLOUDINARY_CLOUD_NAME=dxy123abc
VITE_CLOUDINARY_UPLOAD_PRESET=libro-resoluciones-preset
NODE_ENV=production
```

---

## 🆘 **SOLUCIÓN DE PROBLEMAS COMUNES**

### **❌ "Upload preset not found"**
- Verificar que el preset sea **"Unsigned"**
- Usar el nombre **exacto** del preset
- No incluir espacios al inicio/final

### **❌ "Invalid cloud_name"**
- Copiar **exactamente** como aparece en Cloudinary
- No incluir espacios
- Verificar que no esté vacío

### **❌ "Variables not loaded"**
- Verificar que empiecen con **"VITE_"**
- **Redesplegar** después de agregar variables
- Verificar que estén en **Production** environment

---

**🎯 RESUMEN: Solo necesitas buscar 2 valores en Cloudinary:**
1. **Cloud name** (en Dashboard principal)
2. **Upload preset** (crear uno "Unsigned" o usar existente)
