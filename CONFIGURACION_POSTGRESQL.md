# Configuración de PostgreSQL para la Aplicación

## ⚠️ PROBLEMA ACTUAL

El servidor no puede conectarse a PostgreSQL porque **la contraseña del usuario `postgres` no es correcta**.

```
❌ Error: la autentificación password falló para el usuario "postgres"
```

---

## 🔧 SOLUCIONES

### Opción 1: Cambiar la Contraseña en PostgreSQL (Recomendado)

Si conoces la contraseña actual de PostgreSQL:

```bash
# 1. Conectar a PostgreSQL (te pedirá la contraseña actual)
psql -U postgres -p 5432

# 2. Cambiar la contraseña a 'admin123'
ALTER USER postgres PASSWORD 'admin123';

# 3. Crear la base de datos
CREATE DATABASE libro_resoluciones;

# 4. Salir
\q
```

### Opción 2: Actualizar el .env con la Contraseña Correcta

Si no quieres cambiar la contraseña de PostgreSQL:

1. Abre `server/.env`
2. Modifica estas líneas con tu contraseña actual:

```properties
DB_PASSWORD=TU_CONTRASEÑA_ACTUAL
DATABASE_URL=postgresql://postgres:TU_CONTRASEÑA_ACTUAL@localhost:5432/libro_resoluciones
```

### Opción 3: Resetear la Contraseña de PostgreSQL (Windows)

Si no recuerdas la contraseña:

#### Método A: Usando pgAdmin

1. Abre **pgAdmin** (viene con PostgreSQL)
2. Clic derecho en "PostgreSQL" → "Properties"
3. Ve a la pestaña "Definition"
4. Cambia la contraseña a `admin123`
5. Guarda los cambios

#### Método B: Editando pg_hba.conf

1. Busca el archivo `pg_hba.conf`:
   - Ubicación típica: `C:\Program Files\PostgreSQL\15\data\pg_hba.conf`
2. Edita como administrador y cambia esta línea:

   ```
   host    all             all             127.0.0.1/32            scram-sha-256
   ```

   Por:

   ```
   host    all             all             127.0.0.1/32            trust
   ```

3. Reinicia el servicio de PostgreSQL:

   ```bash
   # Abre PowerShell como administrador
   Restart-Service postgresql-x64-15  # o el nombre de tu servicio
   ```

4. Ahora puedes conectar sin contraseña:

   ```bash
   psql -U postgres -p 5432
   ALTER USER postgres PASSWORD 'admin123';
   \q
   ```

5. **IMPORTANTE:** Revierte el cambio en `pg_hba.conf` (vuelve a `scram-sha-256`)

6. Reinicia el servicio nuevamente

---

## 🚀 PASOS DESPUÉS DE CONFIGURAR LA CONTRASEÑA

Una vez que hayas configurado la contraseña correctamente:

### 1. Crear la Base de Datos

```bash
# Conectar a PostgreSQL
psql -U postgres -p 5432

# Crear la base de datos
CREATE DATABASE libro_resoluciones;

# Verificar que se creó
\l

# Salir
\q
```

### 2. Verificar la Configuración del .env

Asegúrate de que `server/.env` tenga:

```properties
DB_HOST=localhost
DB_PORT=5432
DB_NAME=libro_resoluciones
DB_USER=postgres
DB_PASSWORD=admin123
DATABASE_URL=postgresql://postgres:admin123@localhost:5432/libro_resoluciones
```

### 3. Iniciar el Servidor

```bash
cd server
npm start
```

**Deberías ver:**

```
🐘 Usando PostgreSQL
✅ PostgreSQL inicializado correctamente
🚀 Server running on port 3000
```

### 4. Ejecutar el Script de Inicialización (si es necesario)

El servidor debería crear automáticamente las tablas al iniciar, pero si no:

```bash
cd server
node scripts/setup-database.js
```

---

## 📋 VERIFICACIÓN

### Verificar que PostgreSQL está corriendo:

```bash
netstat -ano | findstr :5432
```

Deberías ver:

```
TCP    0.0.0.0:5432           0.0.0.0:0              LISTENING       6984
```

### Verificar la conexión:

```bash
psql -U postgres -p 5432 -d libro_resoluciones
```

Si te conecta sin errores, ¡todo está bien!

### Ver las tablas:

```sql
-- Dentro de psql
\dt
```

Deberías ver:

```
        List of relations
 Schema |  Name   | Type  |  Owner
--------+---------+-------+----------
 public | books   | table | postgres
 public | images  | table | postgres
 public | users   | table | postgres
```

---

## ❓ ¿CUÁL ES MI CONTRASEÑA DE POSTGRESQL?

Si instalaste PostgreSQL recientemente:

- La contraseña que configuraste durante la instalación
- Por defecto suele ser: `postgres`, `admin`, `root`, o lo que hayas puesto

Intenta estos comandos para probar contraseñas comunes:

```bash
# Probar con "postgres"
PGPASSWORD=postgres psql -U postgres -p 5432 -c "SELECT version();"

# Probar con "admin"
PGPASSWORD=admin psql -U postgres -p 5432 -c "SELECT version();"

# Probar con "root"
PGPASSWORD=root psql -U postgres -p 5432 -c "SELECT version();"
```

Si alguno funciona, usa esa contraseña en tu `.env`.

---

## 🆘 AYUDA ADICIONAL

Si sigues teniendo problemas:

1. **Verifica el servicio de PostgreSQL:**

   - Presiona `Win + R`
   - Escribe `services.msc`
   - Busca "postgresql" y verifica que esté "Running"

2. **Revisa los logs de PostgreSQL:**

   - Ubicación típica: `C:\Program Files\PostgreSQL\15\data\log\`
   - Abre el archivo `.log` más reciente

3. **Reinstala PostgreSQL:**
   - Desinstala PostgreSQL completamente
   - Descarga la última versión desde https://www.postgresql.org/download/windows/
   - Durante la instalación, usa `admin123` como contraseña

---

## ✅ CHECKLIST

- [ ] PostgreSQL está instalado y corriendo en el puerto 5432
- [ ] Conoces la contraseña del usuario `postgres`
- [ ] La contraseña está correctamente configurada en `server/.env`
- [ ] La base de datos `libro_resoluciones` existe
- [ ] El servidor inicia sin errores de autenticación
- [ ] Las tablas se crean automáticamente

---

## 📞 PRÓXIMO PASO

**Dime cuál de estas opciones prefieres:**

1. ✅ **Cambiar la contraseña de PostgreSQL a `admin123`** (más simple)
2. 🔄 **Decirme tu contraseña actual** (actualizo el .env)
3. 🆘 **Necesitas ayuda para resetear la contraseña** (te guío paso a paso)

Una vez resuelto esto, tu aplicación funcionará perfectamente con PostgreSQL.
