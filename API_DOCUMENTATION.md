# 📚 Documentación de API - Libro de Resoluciones V2

## 🔐 **SEGURIDAD Y AUTENTICACIÓN**

### **Headers de Seguridad Implementados**
Todos los endpoints incluyen los siguientes headers de seguridad:
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `X-XSS-Protection: 1; mode=block`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy: geolocation=(), microphone=(), camera=()`

### **Sistema de Logging de Seguridad**
- Todos los intentos de login y registro son logueados
- Violaciones de política de contraseñas son registradas
- Actividades sospechosas son monitoreadas
- Logs almacenados en `/server/logs/security.log`

---

## 📋 **ENDPOINTS DE AUTENTICACIÓN**

### **POST** `/api/user/register`
**Descripción**: Registra un nuevo usuario con validaciones de seguridad

**Request Body**:
```json
{
  "Nombre": "string (requerido)",
  "Contrasena": "string (requerido, min 6 caracteres)",
  "Rol": "string (opcional: usuario|secretaria|admin)"
}
```

**Validaciones de Contraseña**:
- Mínimo 6 caracteres
- No puede ser una contraseña común débil (123, password, test, etc.)
- Se loguean violaciones de política

**Responses**:
```json
// 201 - Registro exitoso
{
  "message": "Usuario creado exitosamente",
  "user": {
    "Nombre": "string",
    "Rol": "string"
  }
}

// 400 - Error de validación
{
  "error": "La contraseña debe tener al menos 6 caracteres"
}
// o
{
  "error": "La contraseña es demasiado débil. Use una contraseña más segura"
}
// o
{
  "error": "El usuario ya existe"
}
```

### **POST** `/api/user/login`
**Descripción**: Autentica un usuario y devuelve JWT token

**Request Body**:
```json
{
  "Nombre": "string (requerido)",
  "Contrasena": "string (requerido)"
}
```

**Responses**:
```json
// 200 - Login exitoso
{
  "message": "Usuario logueado correctamente",
  "user": {
    "Nombre": "string",
    "Rol": "string",
    "ID": number
  },
  "token": "string (JWT)"
}

// 401 - Credenciales inválidas
{
  "error": "Credenciales inválidas"
}

// 400 - Datos faltantes
{
  "error": "Nombre y Contrasena son requeridos"
}
```

**Nota de Seguridad**: Los mensajes de error para usuario no encontrado y contraseña incorrecta son idénticos para prevenir enumeración de usuarios.

---

## 📊 **ENDPOINTS DE SISTEMA**

### **GET** `/health`
**Descripción**: Health check del sistema con información detallada

**Response**:
```json
{
  "status": "healthy",
  "timestamp": "2025-06-20T01:03:10.257Z",
  "uptime": 2420.482535494,
  "memory": {
    "rss": 57970688,
    "heapTotal": 24301568,
    "heapUsed": 20320824,
    "external": 3606196,
    "arrayBuffers": 127619
  },
  "env": "production",
  "corsOrigins": 6,
  "port": "10000",
  "version": "2.1.0",
  "diagnosticEndpoint": "/diagnose",
  "adminCreationEndpoint": "/create-admin"
}
```

### **GET** `/diagnose`
**Descripción**: Diagnóstico completo del sistema para deployment

**Response**:
```json
{
  "timestamp": "2025-06-20T00:40:00.386Z",
  "database": {
    "status": "connected",
    "tables": ["users", "books"],
    "users": 1,
    "books": 0
  },
  "environment": {
    "NODE_ENV": "production",
    "PORT": "10000",
    "JWT_SECRET_KEY": "SET",
    "FRONTEND_URL": "https://libro-de-resoluciones-v2-9izd.vercel.app/",
    "ADMIN_USERNAME": "NOT SET",
    "ADMIN_PASSWORD": "NOT SET"
  },
  "recommendations": []
}
```

---

## 📚 **ENDPOINTS DE RESOLUCIONES**

### **GET** `/api/books/all`
**Descripción**: Obtiene todas las resoluciones
**Headers**: `Authorization: Bearer <token>` (opcional para consulta pública)

### **POST** `/api/search`
**Descripción**: Búsqueda de resoluciones por criterio
**Headers**: `Authorization: Bearer <token>` (requerido)

**Request Body**:
```json
{
  "criterion": "NumdeResolucion|Asunto|Referencia",
  "value": "string"
}
```

---

## 🔒 **SISTEMA DE SEGURIDAD**

### **Políticas Implementadas**
1. **Contraseñas Fuertes**: Mínimo 6 caracteres, rechazo de contraseñas comunes
2. **Respuestas Unificadas**: Mismos mensajes para prevenir enumeración
3. **Headers de Seguridad**: Protección contra XSS, clickjacking, etc.
4. **Logging Exhaustivo**: Todos los eventos de seguridad son registrados
5. **JWT Tokens**: Autenticación segura con tokens firmados

### **Monitoreo de Seguridad**
- Login attempts (exitosos y fallidos)
- Registration attempts (exitosos y fallidos)
- Password policy violations
- Suspicious activities
- SQL injection attempts
- Unauthorized access attempts

### **Códigos de Status HTTP**
- `200`: Operación exitosa
- `201`: Recurso creado exitosamente  
- `400`: Error de validación o datos malformados
- `401`: No autorizado (credenciales inválidas)
- `403`: Prohibido (sin permisos)
- `404`: Recurso no encontrado
- `500`: Error interno del servidor

---

## 🚀 **TESTING Y CALIDAD**

### **Suite de Pruebas Implementada**
1. **Pruebas Funcionales**: Validación de todos los endpoints
2. **Pruebas de Carga**: Usuarios concurrentes (1, 3, 5)
3. **Pruebas de Seguridad**: SQL injection, enumeración, headers
4. **Reportes Automáticos**: Calificación y métricas de calidad

### **Métricas de Rendimiento**
- **RPS Máximo**: ~2.22 requests por segundo
- **Tiempo de Respuesta**: ~230-250ms promedio
- **Estabilidad**: 100% bajo carga concurrente
- **Disponibilidad**: 99.9% uptime

### **Estado de Calidad Actual**
- **Funcionalidad**: 88.9% (mejorando)
- **Seguridad**: 50% (en mejora continua)
- **Rendimiento**: Excelente
- **Calificación General**: C (objetivo: A-)

---

## 🔧 **CONFIGURACIÓN Y DEPLOYMENT**

### **Variables de Entorno Requeridas**
```env
NODE_ENV=production
PORT=10000
JWT_SECRET_KEY=your_secret_key
FRONTEND_URL=https://your-frontend-url.vercel.app
DATABASE_URL=postgresql://user:pass@host:port/db
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### **Comandos de Deployment**
```bash
# Instalar dependencias
npm install

# Ejecutar en desarrollo
npm run dev

# Ejecutar en producción
npm start

# Ejecutar tests completos
node run-all-tests.cjs
```

---

## 📞 **SOPORTE Y CONTACTO**

Para reportar vulnerabilidades de seguridad o problemas técnicos, consultar los logs de seguridad en `/server/logs/security.log` o revisar los reportes de testing generados automáticamente.

**Última actualización**: 19/06/2025
**Versión de API**: 2.1.0
**Estado**: Producción (mejoras continuas)
