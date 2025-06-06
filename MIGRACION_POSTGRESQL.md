# Migración de SQLite a PostgreSQL - Pasos Restantes

## Estado Actual ✅
- PostgreSQL 17 instalado en Windows
- Dependencia `pg` agregada al proyecto
- Archivos de conexión y migración creados
- Variables de entorno configuradas

## Pasos para completar la migración:

### 1. Configurar contraseña de PostgreSQL
La instalación de PostgreSQL requiere que configures una contraseña para el usuario `postgres`.

**Opción A: Usar pgAdmin**
1. Busca "pgAdmin" en el menú de inicio y ábrelo
2. Conéctate al servidor local
3. Establece una contraseña cuando te lo pida

**Opción B: Usar línea de comandos**
```bash
# Abre Command Prompt como administrador y ejecuta:
"C:\Program Files\PostgreSQL\17\bin\psql" -U postgres
# Te pedirá establecer una contraseña
```

### 2. Actualizar el archivo .env
Una vez que tengas la contraseña, actualiza el archivo `.env`:
```env
DB_PASSWORD=tu_contraseña_real_aqui
```

### 3. Ejecutar la configuración inicial
```bash
cd server
npm run setup-postgres
```

### 4. Migrar datos existentes (opcional)
Si tienes datos en SQLite que quieres conservar:
```bash
npm run migrate-data
```

### 5. Probar la aplicación localmente
```bash
npm run dev
```

### 6. Configurar PostgreSQL en Render (Producción)

#### Crear base de datos PostgreSQL en Render:
1. Ve a [render.com](https://render.com)
2. Crea un nuevo PostgreSQL database
3. Copia las credenciales de conexión

#### Actualizar variables de entorno en Render:
```env
DB_HOST=tu_host_postgres_render
DB_PORT=5432
DB_NAME=tu_nombre_db
DB_USER=tu_usuario
DB_PASSWORD=tu_password
NODE_ENV=production
```

### 7. Verificar el despliegue
Una vez desplegado, verifica que:
- La aplicación se conecta correctamente a PostgreSQL
- Los datos persisten entre reinicios
- Las operaciones CRUD funcionan correctamente

## Archivos modificados:
- ✅ `server/db/connection.js` - Actualizado para usar PostgreSQL
- ✅ `server/db/postgres-connection.js` - Nueva conexión PostgreSQL
- ✅ `server/.env` - Variables de entorno PostgreSQL
- ✅ `server/package.json` - Nuevos scripts agregados
- ✅ `server/scripts/setup-postgres.js` - Script de configuración
- ✅ `server/scripts/migrate-to-postgres.js` - Script de migración

## Próximos pasos inmediatos:
1. **Configurar contraseña PostgreSQL** ⏳
2. **Actualizar .env con la contraseña real** ⏳
3. **Ejecutar `npm run setup-postgres`** ⏳
4. **Probar aplicación localmente** ⏳
5. **Configurar PostgreSQL en Render** ⏳

## Ventajas de PostgreSQL vs SQLite:
- ✅ Persistencia de datos en la nube
- ✅ Mejor rendimiento para aplicaciones concurrentes
- ✅ Soporte completo para transacciones
- ✅ Escalabilidad mejorada
- ✅ Compatibilidad con servicios cloud como Render
