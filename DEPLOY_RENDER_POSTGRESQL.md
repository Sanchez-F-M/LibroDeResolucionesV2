# 🚀 GUÍA DE DESPLIEGUE EN RENDER - PostgreSQL

## 📋 PREPARACIÓN PREVIA
- ✅ Migración PostgreSQL completada localmente
- ✅ Código actualizado para PostgreSQL
- ✅ Todas las pruebas pasando
- ✅ 14 resoluciones + 17 imágenes + 2 usuarios migrados

---

## 🗄️ PASO 1: CREAR BASE DE DATOS POSTGRESQL EN RENDER

### 1.1 Crear PostgreSQL Service
```bash
1. Ir a Render Dashboard (https://dashboard.render.com)
2. Click "New" → "PostgreSQL"
3. Configurar:
   - Name: libro-resoluciones-db
   - Plan: Free (o Starter para producción)
   - PostgreSQL Version: 15 (recomendado)
   - Database Name: libro_resoluciones
   - User: postgres (automático)
```

### 1.2 Obtener Datos de Conexión
```bash
# Render proporcionará automáticamente:
POSTGRESQL_URL: postgresql://user:pass@host:5432/database
Internal Database URL: para conexiones dentro de Render
External Database URL: para conexiones externas
```

### 1.3 Configurar Tablas Iniciales
```sql
-- Las tablas se crearán automáticamente al iniciar el backend
-- gracias al sistema de auto-inicialización implementado
```

---

## 🖥️ PASO 2: DESPLEGAR BACKEND (API)

### 2.1 Crear Web Service
```bash
1. En Render Dashboard: "New" → "Web Service"
2. Conectar repositorio GitHub
3. Configurar:
   - Name: libro-resoluciones-api
   - Environment: Node
   - Region: Ohio (recomendado para latencia)
   - Build Command: npm install
   - Start Command: npm start
   - Root Directory: server
```

### 2.2 Variables de Entorno
```env
# CONFIGURACIÓN POSTGRESQL
POSTGRESQL_URL={copiar_de_postgresql_service}
DB_HOST={host_de_postgresql_service}
DB_PORT=5432
DB_NAME=libro_resoluciones
DB_USER={user_de_postgresql_service}
DB_PASSWORD={password_de_postgresql_service}

# CONFIGURACIÓN APLICACIÓN
NODE_ENV=production
JWT_SECRET=tu_jwt_secret_super_seguro_aqui
PORT=3000

# CORS - URLs del Frontend
CORS_ORIGIN_1=https://tu-frontend.onrender.com
CORS_ORIGIN_2=https://libro-resoluciones.onrender.com
```

### 2.3 Verificar Deploy
```bash
# URLs de prueba una vez desplegado:
GET https://libro-resoluciones-api.onrender.com/health
GET https://libro-resoluciones-api.onrender.com/api/books/all
POST https://libro-resoluciones-api.onrender.com/api/user/login
```

---

## 🌐 PASO 3: DESPLEGAR FRONTEND

### 3.1 Actualizar Variables de Entorno del Frontend
```javascript
// front/.env.production
VITE_API_BASE_URL=https://libro-resoluciones-api.onrender.com
VITE_APP_ENV=production
```

### 3.2 Crear Static Site
```bash
1. En Render Dashboard: "New" → "Static Site"
2. Conectar mismo repositorio
3. Configurar:
   - Name: libro-resoluciones-front
   - Build Command: npm install && npm run build
   - Publish Directory: dist
   - Root Directory: front
```

### 3.3 Configurar Redirects
```toml
# front/public/_redirects (ya existente)
/*    /index.html   200
```

---

## 📤 PASO 4: MIGRAR DATOS A PRODUCCIÓN

### 4.1 Preparar Script de Migración
```javascript
// Crear script para cargar datos iniciales en producción
// Los datos ya están disponibles en PostgreSQL local
```

### 4.2 Ejecutar Migración
```bash
# Opción 1: Usar pg_dump y pg_restore
pg_dump -h localhost -p 5433 -U postgres libro_resoluciones > dump.sql
psql {POSTGRESQL_URL_RENDER} < dump.sql

# Opción 2: Script automatizado (recomendado)
node scripts/migrate-to-production.js
```

---

## 🔧 PASO 5: CONFIGURACIÓN AVANZADA

### 5.1 Health Checks
```javascript
// Ya implementado en el código:
GET /health - Status de la aplicación
GET / - Status básico
```

### 5.2 Logs y Monitoreo
```bash
# Render proporciona logs automáticos
# Verificar en Dashboard → Service → Logs
```

### 5.3 Escalabilidad
```bash
# Para mayor tráfico:
1. Upgrade PostgreSQL plan (Starter/Standard)
2. Upgrade Web Service plan
3. Configurar múltiples instancias
```

---

## 🧪 PASO 6: VERIFICACIÓN DE DESPLIEGUE

### 6.1 Pruebas de Backend
```bash
# Test de conexión
curl https://libro-resoluciones-api.onrender.com/health

# Test de datos
curl https://libro-resoluciones-api.onrender.com/api/books/all

# Test de autenticación
curl -X POST https://libro-resoluciones-api.onrender.com/api/user/login \
  -H "Content-Type: application/json" \
  -d '{"Nombre":"admin","Contrasena":"admin123"}'
```

### 6.2 Pruebas de Frontend
```bash
# Verificar en navegador:
https://libro-resoluciones-front.onrender.com
- Login funcional
- Navegación fluida  
- Carga de resoluciones
- Búsqueda operativa
```

---

## ⚠️ CONSIDERACIONES IMPORTANTES

### Límites del Plan Free
- **Base de datos**: 90 días de retención, 1GB de almacenamiento
- **Web Service**: Duerme después de 15 min de inactividad
- **Ancho de banda**: 100GB/mes

### Recomendaciones para Producción
1. **Upgrade a plan Starter** para mayor estabilidad
2. **Configurar dominios personalizados**
3. **Implementar sistema de backups**
4. **Monitoreo de performance**

---

## 📞 SOPORTE Y TROUBLESHOOTING

### Problemas Comunes
1. **Timeout de conexión**: Verificar POSTGRESQL_URL
2. **CORS errors**: Actualizar CORS_ORIGIN en backend
3. **Build failures**: Verificar dependencias en package.json

### Logs Útiles
```bash
# Backend logs
Render Dashboard → Web Service → Logs

# Database logs  
Render Dashboard → PostgreSQL → Logs

# Build logs
Render Dashboard → Static Site → Deploys
```

---

## 🎯 RESULTADO ESPERADO

Al completar esta guía tendrás:
- ✅ PostgreSQL funcionando en la nube
- ✅ Backend API desplegado y estable
- ✅ Frontend accesible públicamente
- ✅ Datos migrados y persistentes
- ✅ Sistema completo en producción

**¡Sistema Libro de Resoluciones listo para uso en producción!** 🎉
