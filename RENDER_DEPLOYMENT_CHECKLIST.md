# 🚀 CONFIGURACIÓN RÁPIDA RENDER - LISTA COMPLETA

## 📋 CHECKLIST DE DESPLIEGUE

### ✅ 1. CREAR SERVICIO POSTGRESQL
```
Dashboard → New → PostgreSQL
Name: libro-resoluciones-db
Database Name: libro_resoluciones
Plan: Free
```
**📋 Copiar**: Internal Database URL

### ✅ 2. CONFIGURAR VARIABLES EN WEB SERVICE
```
Web Service → Settings → Environment → Add Environment Variable
```

**Variables requeridas:**
```env
JWT_SECRET_KEY=c4aa0b8b9962ef727f684398eaca42cef69b542035b0bf3059381617e85d45ac4754dc5cdde02ed9bed87ce47cc4ba1cd33d1c1e485df0fca433ba5bd2499f4a
FRONTEND_URL=https://tu-frontend.onrender.com
NODE_ENV=production
PORT=10000
DATABASE_URL=postgresql://username:password@host:5432/libro_resoluciones
```

> ⚠️ **REEMPLAZAR**:
> - `tu-frontend.onrender.com` → URL real de tu frontend
> - `DATABASE_URL` → URL copiada del PostgreSQL service

### ✅ 3. MANUAL DEPLOY
```
Web Service → Manual Deploy → Deploy Latest Commit
```

### ✅ 4. VERIFICAR LOGS
Buscar en los logs:
```
✅ Variables de entorno validadas correctamente
✅ Base de datos inicializada correctamente
🚀 Servidor ejecutándose en puerto 10000
```

## 🔍 TROUBLESHOOTING

### ❌ Si falla "FRONTEND_URL faltante":
- Verificar que la variable esté escrita exactamente: `FRONTEND_URL`
- No debe tener espacios antes/después
- Debe incluir `https://`

### ❌ Si falla "DATABASE_URL faltante":
- Copiar la **Internal Database URL** del PostgreSQL service
- Verificar que empiece con `postgresql://`

### ❌ Si falla conexión a BD:
- Verificar que el PostgreSQL service esté en estado "Available"
- Usar Internal Database URL, no External

## 📞 ORDEN DE ACCIONES

1. 🗃️ Crear PostgreSQL service
2. 📋 Copiar Internal Database URL  
3. ⚙️ Configurar todas las variables
4. 🚀 Manual Deploy
5. 📊 Verificar logs

---
**Última actualización**: Error FRONTEND_URL resuelto
