# VARIABLES DE ENTORNO PARA RENDER - BACKEND CON SQLITE

## Configurar estas variables en el dashboard de Render:

### Seguridad
JWT_SECRET_KEY=SecretKey

### Configuración del servidor
NODE_ENV=production
PORT=10000

### URL del frontend desplegado
FRONTEND_URL=https://front-jibs1li4h-libro-de-resoluciones-projects.vercel.app

## Notas importantes:
1. ✅ **No se necesita configurar base de datos externa** - SQLite se incluye en el proyecto
2. ✅ **La base de datos se crea automáticamente** al iniciar el servidor
3. ✅ **Los datos se mantienen** entre deployments en Render
4. ✅ **Configuración simplificada** - Solo necesitas 3 variables

## Ventajas de SQLite en Render:
- 🎯 **Cero configuración** de base de datos
- 💰 **Costo reducido** - No necesitas servicio de DB externo  
- ⚡ **Mayor rendimiento** - Base de datos local
- 🔒 **Más seguro** - No hay conexiones de red a DB
- 📦 **Portátil** - Todo incluido en el proyecto
- Google Cloud SQL
