# Migración Completa a PostgreSQL

## Fecha: 10 de octubre de 2025

## Resumen de Cambios

Se ha eliminado completamente SQLite de la aplicación y ahora **solo se usa PostgreSQL** como base de datos.

---

## Archivos Modificados

### 1. ✅ `server/db/connection.js`

**Antes:** Tenía lógica condicional para usar SQLite en desarrollo y PostgreSQL en producción, con fallback a SQLite.

**Después:** Ahora solo importa y usa PostgreSQL. Si falla la conexión, lanza un error claro.

```javascript
// Configuración de base de datos PostgreSQL
import dotenv from 'dotenv';
dotenv.config();

console.log('🐘 Usando PostgreSQL');

// Importar PostgreSQL
const postgresModule = await import('./postgres-connection.js');
const db = postgresModule.default;

// Inicializar PostgreSQL
try {
  await postgresModule.initDatabase();
  console.log('✅ PostgreSQL inicializado correctamente');
} catch (error) {
  console.error('❌ Error al inicializar PostgreSQL:', error);
  console.error('Detalles:', error.message);
  throw new Error('No se pudo conectar a la base de datos PostgreSQL. Verifica la configuración de DATABASE_URL.');
}

export default db;
```

### 2. ✅ `server/package.json`

**Eliminadas las dependencias:**

- `sqlite` (^5.1.1)
- `sqlite3` (^5.1.7)

**Conservadas:**

- `pg` (^8.16.0) - Driver de PostgreSQL
- Todas las demás dependencias

---

## Archivos Eliminados

### 1. ❌ `server/db/sqlite-connection.js`

Archivo completo eliminado. Ya no existe ninguna referencia a SQLite.

### 2. ❌ `server/db/database.sqlite`

No existía, pero si hubiera existido, se habría eliminado.

---

## Configuración Requerida

### Variables de Entorno (`.env`)

Para que la aplicación funcione, **debes tener PostgreSQL corriendo** y configurar estas variables:

```properties
# Configuración de Base de Datos PostgreSQL
DB_HOST=localhost
DB_PORT=5433
DB_NAME=libro_resoluciones
DB_USER=postgres
DB_PASSWORD=admin123
DATABASE_URL=postgresql://postgres:admin123@localhost:5433/libro_resoluciones
```

### Instalación de PostgreSQL

Si no tienes PostgreSQL instalado:

#### Windows:

1. Descarga PostgreSQL desde: https://www.postgresql.org/download/windows/
2. Instala con el asistente (usa el puerto 5433 o ajusta el `.env`)
3. Durante la instalación, establece una contraseña para el usuario `postgres`

#### Crear la base de datos:

```bash
# Conectarse a PostgreSQL
psql -U postgres -p 5433

# Crear la base de datos
CREATE DATABASE libro_resoluciones;

# Salir
\q
```

---

## Verificación de la Migración

### 1. Verificar dependencias instaladas

```bash
cd server
npm list pg
# Debería mostrar: pg@8.16.0

npm list sqlite
# Debería mostrar: (empty) o un error
```

### 2. Iniciar el servidor

```bash
cd server
npm start
```

**Esperado:**

```
🐘 Usando PostgreSQL
✅ PostgreSQL inicializado correctamente
🚀 Server running on port 3000
```

**Si falla:**

```
❌ Error al inicializar PostgreSQL: ...
Error: No se pudo conectar a la base de datos PostgreSQL. Verifica la configuración de DATABASE_URL.
```

### 3. Ejecutar pruebas de login

```bash
cd server
node test-login.js
```

---

## Próximos Pasos

### Para Desarrollo Local:

1. ✅ Asegúrate de tener PostgreSQL instalado y corriendo
2. ✅ Configura las variables de entorno en `server/.env`
3. ✅ Ejecuta `npm start` en el directorio `server`
4. ✅ Verifica que la conexión sea exitosa

### Para Producción (Render):

1. Las variables de entorno ya están configuradas en Render
2. Render proporciona su propia base de datos PostgreSQL
3. La aplicación se conectará automáticamente usando la `DATABASE_URL` de Render

---

## Ventajas de Usar Solo PostgreSQL

✅ **Consistencia:** Misma base de datos en desarrollo y producción  
✅ **Características avanzadas:** Soporte completo de SQL estándar  
✅ **Escalabilidad:** Preparado para producción desde el inicio  
✅ **Sin sorpresas:** No hay diferencias de comportamiento entre entornos  
✅ **Simplicidad:** No hay lógica condicional de bases de datos

---

## Soporte

Si encuentras problemas con la conexión a PostgreSQL:

1. Verifica que PostgreSQL esté corriendo:

   ```bash
   # Windows
   services.msc
   # Busca "PostgreSQL" y verifica que esté "Running"
   ```

2. Verifica el puerto:

   ```bash
   netstat -ano | findstr :5433
   ```

3. Prueba la conexión manualmente:

   ```bash
   psql -U postgres -p 5433 -d libro_resoluciones
   ```

4. Revisa los logs del servidor para detalles del error

---

## Resumen de Comandos Ejecutados

```bash
# 1. Eliminar archivo de conexión SQLite
rm /c/Users/flavi/OneDrive/Escritorio/LibroDeResolucionesV2/server/db/sqlite-connection.js

# 2. Desinstalar dependencias SQLite
cd /c/Users/flavi/OneDrive/Escritorio/LibroDeResolucionesV2/server
npm uninstall sqlite sqlite3

# 3. Modificado manualmente:
# - server/db/connection.js (eliminada lógica de fallback)
# - server/package.json (eliminadas dependencias)
```

---

## Estado Actual: ⚠️ CONFIGURACIÓN PENDIENTE

- ✅ Todas las referencias a SQLite eliminadas
- ✅ Dependencias SQLite desinstaladas
- ✅ Código simplificado para usar solo PostgreSQL
- ✅ Documentación actualizada
- ⚠️ **ACCIÓN REQUERIDA:** Configurar contraseña de PostgreSQL

### ⚠️ Problema Detectado

El servidor no puede conectarse a PostgreSQL:

```
❌ Error: la autentificación password falló para el usuario "postgres"
```

**Causa:** La contraseña configurada en `.env` (`admin123`) no coincide con la contraseña real de PostgreSQL.

**Solución:** Ver el archivo `CONFIGURACION_POSTGRESQL.md` para instrucciones detalladas de cómo:

1. Cambiar la contraseña de PostgreSQL a `admin123`, O
2. Actualizar el `.env` con tu contraseña actual

### Puerto Actualizado

- ✅ Puerto corregido de 5433 → 5432 (PostgreSQL detectado en puerto 5432)
