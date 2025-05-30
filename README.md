# Libro de Resoluciones - Aplicación Web

## Descripción
Sistema de gestión de resoluciones para la Policía de Tucumán desarrollado con React (frontend) y Node.js/Express (backend).

## Estructura del Proyecto
```
LibroDeResolucionesV2/
├── front/          # Frontend React + Vite
└── server/         # Backend Node.js + Express
```

## Configuración para Desarrollo

### Backend (server)
1. Navegar a la carpeta del servidor:
   ```bash
   cd server
   ```

2. Instalar dependencias:
   ```bash
   npm install
   ```

3. Configurar variables de entorno:
   - Copiar `.env.example` a `.env`
   - Configurar las variables según tu entorno local

4. Iniciar el servidor:
   ```bash
   npm run dev
   ```

### Frontend (front)
1. Navegar a la carpeta del frontend:
   ```bash
   cd front
   ```

2. Instalar dependencias:
   ```bash
   npm install
   ```

3. Configurar variables de entorno:
   - El archivo `.env` ya está configurado para desarrollo

4. Iniciar la aplicación:
   ```bash
   npm run dev
   ```

## Despliegue en Producción

### Backend en Render
1. Conectar el repositorio a Render
2. Configurar el servicio:
   - **Root Directory**: `server`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Environment**: Node.js

3. Configurar variables de entorno en Render:
   - `JWT_SECRET_KEY`: Clave secreta para tokens JWT
   - `DB_HOST`: Host de la base de datos MySQL
   - `DB_USER`: Usuario de la base de datos
   - `DB_PASSWORD`: Contraseña de la base de datos
   - `DB_NAME`: Nombre de la base de datos
   - `DB_PORT`: Puerto de la base de datos (3306)
   - `NODE_ENV`: production
   - `FRONTEND_URL`: URL del frontend desplegado

### Frontend en Vercel
1. Conectar el repositorio a Vercel
2. Configurar el proyecto:
   - **Root Directory**: `front`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

3. Configurar variables de entorno en Vercel:
   - `VITE_API_BASE_URL`: URL del backend desplegado en Render

## Tecnologías Utilizadas

### Frontend
- React 18
- Vite
- Material-UI
- Axios
- React Router DOM
- Zustand (manejo de estado)

### Backend
- Node.js
- Express
- MySQL2
- JWT (autenticación)
- Multer (subida de archivos)
- Bcrypt (hash de contraseñas)
- CORS

## Variables de Entorno

### Backend (.env)
```
JWT_SECRET_KEY=tu_clave_secreta
PORT=3000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=tu_password
DB_NAME=libroderesolucionDB
DB_PORT=3306
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

### Frontend (.env)
```
VITE_API_BASE_URL=http://localhost:3000
```

## Scripts Disponibles

### Backend
- `npm run dev`: Iniciar servidor en modo desarrollo con nodemon
- `npm start`: Iniciar servidor en modo producción

### Frontend
- `npm run dev`: Iniciar aplicación en modo desarrollo
- `npm run build`: Construir aplicación para producción
- `npm run preview`: Previsualizar aplicación construida

## Licencia
Este proyecto es de uso interno para la Policía de Tucumán.
