# 🔧 CONFIGURACIÓN VARIABLES DE ENTORNO - RENDER

## 📋 VARIABLES REQUERIDAS PARA RENDER

Ve a tu **Web Service** en Render Dashboard → **Environment** y agrega estas variables:

### 🔑 **VARIABLES DE AUTENTICACIÓN**
```env
JWT_SECRET_KEY=a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b8c9d0e1f2g3h4i5j6k7l8m9n0o1p2q3r4s5t6u7v8w9x0y1z2a3b4c5d6e7f8g9h0
```

### 🗄️ **VARIABLES DE BASE DE DATOS**
```env
# Estos valores los obtienes de tu PostgreSQL service en Render
POSTGRESQL_URL=postgresql://user:password@hostname:5432/database
DB_HOST=hostname_de_tu_postgresql_render
DB_PORT=5432
DB_NAME=nombre_de_tu_database
DB_USER=usuario_de_postgresql
DB_PASSWORD=password_de_postgresql
```

### ⚙️ **VARIABLES DE APLICACIÓN**
```env
NODE_ENV=production
PORT=10000
BASE_URL=https://tu-backend-render.onrender.com
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin123
```

### 🌐 **VARIABLES DE CORS**
```env
# Actualiza con las URLs reales de tu frontend en Render
FRONTEND_URL=https://tu-frontend-render.onrender.com
CORS_ORIGIN_1=https://tu-frontend-render.onrender.com
CORS_ORIGIN_2=https://libro-resoluciones.onrender.com
```

---

## 🎯 **PASOS EXACTOS EN RENDER:**

### 1. **Ir a tu Web Service**
```
Render Dashboard → Web Services → [tu-servicio-backend]
```

### 2. **Configurar Environment Variables**
```
Settings → Environment → Add Environment Variable
```

### 3. **Agregar cada variable**
```
Name: JWT_SECRET_KEY
Value: a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b8c9d0e1f2g3h4i5j6k7l8m9n0o1p2q3r4s5t6u7v8w9x0y1z2a3b4c5d6e7f8g9h0

Name: NODE_ENV  
Value: production

Name: PORT
Value: 10000

[... continúa con todas las variables]
```

### 4. **Redeploy**
```
Manual Deploy → Deploy Latest Commit
```

---

## 🔒 **SEGURIDAD: GENERAR NUEVO JWT_SECRET**

Para producción, es recomendable generar un nuevo JWT_SECRET más seguro:

```javascript
// Genera un nuevo secret de 64 caracteres
const crypto = require('crypto');
const newSecret = crypto.randomBytes(64).toString('hex');
console.log(newSecret);
```

O usa este comando en terminal:
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

---

## ⚠️ **IMPORTANTE**

1. **NO subas el archivo .env** al repositorio
2. **Usa variables de entorno** específicas para cada ambiente
3. **El JWT_SECRET debe ser diferente** en desarrollo y producción
4. **Asegúrate de que todas las variables estén configuradas** antes del deploy

---

## 🔄 **DESPUÉS DE CONFIGURAR**

Una vez agregadas todas las variables:

1. ✅ Guarda las variables en Render
2. ✅ Redeploy el servicio  
3. ✅ Verifica los logs que ya no aparezca el error
4. ✅ Prueba la autenticación desde el frontend

El error de `JWT_SECRET` debería desaparecer y tu aplicación debería iniciarse correctamente.
