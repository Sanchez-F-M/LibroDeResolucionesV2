# Libro de Resoluciones V2

Sistema de gestión de resoluciones con funcionalidades completas de autenticación, búsqueda e integración con Cloudinary.

## 🚀 Tecnologías

### Backend
- **Node.js** + **Express.js**
- **PostgreSQL** (Base de datos)
- **JWT** (Autenticación)
- **Cloudinary** (Gestión de imágenes)

### Frontend
- **React** + **Vite**
- **React Router** (Navegación)
- **Axios** (Cliente HTTP)
- **Bootstrap** (Estilos)

## 📁 Estructura del Proyecto

```
LibroDeResolucionesV2/
├── server/          # Backend API
│   ├── src/         # Código fuente
│   ├── config/      # Configuraciones
│   ├── db/          # Conexión a base de datos
│   └── ...
├── front/           # Frontend React
│   ├── src/         # Código fuente
│   ├── public/      # Archivos públicos
│   └── ...
└── package.json     # Dependencias del proyecto
```

## 🛠️ Instalación y Configuración

### Prerrequisitos
- Node.js (v18+)
- PostgreSQL
- Cuenta de Cloudinary

### 1. Clonar el repositorio
```bash
git clone <repository-url>
cd LibroDeResolucionesV2
```

### 2. Instalar dependencias
```bash
# Instalar dependencias del proyecto principal
npm install

# Instalar dependencias del backend
cd server
npm install

# Instalar dependencias del frontend
cd ../front
npm install
```

### 3. Configurar variables de entorno

#### Backend (`server/.env`)
```env
NODE_ENV=production
PORT=10000
DATABASE_URL=postgresql://username:password@host:port/database
JWT_SECRET_KEY=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
FRONTEND_URL=https://your-frontend-url.com
```

#### Frontend (`front/.env.production`)
```env
VITE_API_URL=https://your-backend-url.com
```

## 🚀 Despliegue

### Backend (Render)
1. Conectar repositorio en Render
2. Configurar variables de entorno
3. Desplegar automáticamente

### Frontend (Vercel)
1. Conectar repositorio en Vercel
2. Configurar variables de entorno
3. Desplegar automáticamente

## 👥 Roles de Usuario

- **Admin**: Acceso completo al sistema
- **Secretaria**: Acceso a funciones principales
- **Usuario**: Acceso limitado de consulta

## 🔍 Funcionalidades

- ✅ Autenticación y autorización
- ✅ Gestión de resoluciones
- ✅ Búsqueda avanzada (por número, asunto, referencia)
- ✅ Subida y gestión de imágenes
- ✅ Control de acceso por roles
- ✅ API RESTful completa

## 🌐 URLs de Producción

- **Backend**: https://libroderesoluciones-api.onrender.com
- **Frontend**: https://libro-de-resoluciones-v2-9izd-fe0i5ihfg.vercel.app

## 📊 Estado del Sistema

✅ **Sistema completamente funcional**
- Backend: Operativo en Render
- Frontend: Desplegado en Vercel
- Base de datos: PostgreSQL conectada
- Cloudinary: Integrado y funcional
- Autenticación: JWT implementado
- Búsquedas: Funcionando correctamente

## 🔧 Comandos Útiles

```bash
# Desarrollo local del backend
cd server && npm run dev

# Desarrollo local del frontend
cd front && npm run dev

# Build del frontend
cd front && npm run build

# Verificar salud del backend
curl https://libroderesoluciones-api.onrender.com/health
```

## 📝 Licencia

Este proyecto es privado y de uso exclusivo del cliente.

---

**Desarrollado con ❤️ para la gestión eficiente de resoluciones**
