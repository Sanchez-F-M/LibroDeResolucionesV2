# 📅 Sistema de Reset Anual de Numeración de Resoluciones

## 📖 Índice

1. [Descripción General](#descripción-general)
2. [Características Principales](#características-principales)
3. [Arquitectura del Sistema](#arquitectura-del-sistema)
4. [Formato de Numeración](#formato-de-numeración)
5. [Instalación y Configuración](#instalación-y-configuración)
6. [Uso del Sistema](#uso-del-sistema)
7. [Migración de Datos Existentes](#migración-de-datos-existentes)
8. [Troubleshooting](#troubleshooting)
9. [Preguntas Frecuentes (FAQ)](#preguntas-frecuentes-faq)

---

## Descripción General

El **Sistema de Reset Anual** implementa una numeración automática de resoluciones con el formato `{número}-{año}`, donde el contador se reinicia automáticamente cada 1 de enero a las 00:01 AM, manteniendo todos los datos históricos intactos.

### ✨ Ejemplo de Funcionamiento

```
Año 2024:
- 001-2024
- 002-2024
- ...
- 150-2024

🔄 1 de Enero 2025 a las 00:01 AM → Reset automático

Año 2025:
- 001-2025  ← Comienza desde 1 nuevamente
- 002-2025
- ...
```

**Importante:** Las resoluciones de 2024 **permanecen** en la base de datos y son totalmente consultables.

---

## Características Principales

### ✅ Reset Automático Anual

- **Fecha:** Cada 1 de enero a las 00:01 AM
- **Zona horaria:** `America/Argentina/Buenos_Aires` (configurable)
- **Verificación:** Job scheduler con `node-cron`
- **Sin intervención manual:** El sistema se gestiona automáticamente

### ✅ Preservación de Datos Históricos

- Ninguna resolución se elimina
- Todas las resoluciones mantienen sus imágenes asociadas
- Búsquedas funcionan en todos los años
- Integridad referencial garantizada

### ✅ Migración Inteligente

- Script idempotente (se puede ejecutar múltiples veces)
- Backup conceptual antes de migrar
- Detección automática de formatos antiguos
- Rollback automático en caso de error

### ✅ Compatibilidad con Formatos Antiguos

El sistema reconoce y maneja múltiples formatos:

- `001-2025` - Formato nuevo estándar
- `123` - Formato legacy (solo número)
- `RES-001-2025` - Formato alternativo
- `2025001` - Formato de 7 dígitos

---

## Arquitectura del Sistema

### 📁 Estructura de Archivos

```
server/
├── services/
│   └── YearResetService.js      # Servicio principal de reset anual
├── scripts/
│   └── migrate-to-year-format.js # Script de migración de datos
├── db/
│   └── postgres-connection.js    # Funciones SQL y base de datos
├── src/
│   └── controllers/
│       └── book.controller.js    # Controlador actualizado
└── index.js                       # Integración del job scheduler
```

### 🔧 Componentes Clave

#### 1. YearResetService (`services/YearResetService.js`)

Servicio singleton que gestiona:

- Obtención del año actual
- Generación del siguiente número
- Verificación de cambio de año
- Ejecución del reset
- Estadísticas por año

**Métodos principales:**

```javascript
// Obtener siguiente número de resolución
await yearResetService.getNextResolutionNumber()
// Retorna: "001-2025"

// Verificar si necesita reset
await yearResetService.checkIfResetNeeded()
// Retorna: true/false

// Ejecutar reset manual
await yearResetService.executeYearReset()

// Obtener estadísticas
await yearResetService.getYearlyStatistics()
```

#### 2. Funciones SQL en PostgreSQL

```sql
-- Función para extraer año del número de resolución
CREATE FUNCTION get_resolution_year(resolution_number VARCHAR)
RETURNS INTEGER

-- Índice funcional para optimizar búsquedas por año
CREATE INDEX idx_resolution_year
ON resolution(get_resolution_year("NumdeResolucion"));
```

#### 3. Job Scheduler (node-cron)

```javascript
// Verificación diaria a las 00:01 AM
cron.schedule('1 0 * * *', async () => {
  await yearResetService.periodicCheck();
}, {
  timezone: 'America/Argentina/Buenos_Aires'
});
```

---

## Formato de Numeración

### 📋 Formato Estándar

```
NNN-YYYY
```

Donde:

- **NNN:** Número secuencial con padding de 3 dígitos (001, 002, ..., 999)
- **YYYY:** Año de 4 dígitos (2024, 2025, etc.)

### 📊 Ejemplos

| Resolución | Formato  | Año  | Número Secuencial     |
| ---------- | -------- | ---- | --------------------- |
| `001-2025` | Estándar | 2025 | 1                     |
| `050-2024` | Estándar | 2024 | 50                    |
| `123-2025` | Estándar | 2025 | 123                   |
| `001-2026` | Estándar | 2026 | 1 (después del reset) |

### 🔄 Formatos Compatibles (Legacy)

El sistema **acepta y busca** estos formatos antiguos:

- `123` → Se migra a `123-{año_fecha_creacion}`
- `RES-045-2024` → Ya tiene formato con año
- `2025001` → Formato de 7 dígitos (año + número)

---

## Instalación y Configuración

### 1️⃣ Instalar Dependencias

```bash
cd server
npm install node-cron date-fns-tz
```

### 2️⃣ Configurar Variables de Entorno

Editar `server/.env`:

```env
# Zona horaria para el reset anual
TIMEZONE=America/Argentina/Buenos_Aires

# Hora del día para ejecutar el reset (formato 24h)
RESET_HOUR=0

# (Opcional) Notificaciones por email
ENABLE_RESET_NOTIFICATIONS=false
ADMIN_EMAIL=admin@example.com
```

### 3️⃣ Inicializar Base de Datos

Las funciones SQL se crean automáticamente al iniciar el servidor por primera vez.

```bash
npm run dev
```

Verás en los logs:

```
✅ Funciones SQL y índices para año creados
```

### 4️⃣ Ejecutar Migración de Datos

**⚠️ IMPORTANTE: Hacer backup antes de migrar en producción**

```bash
cd server
node scripts/migrate-to-year-format.js
```

Salida esperada:

```
🔄 INICIANDO MIGRACIÓN DE DATOS AL FORMATO CON AÑO
=====================================================
📊 Obteniendo resoluciones existentes...
📦 Total de resoluciones encontradas: 25

✅ Migrado: 1 -> 001-2024 (año: 2024)
✅ Migrado: 2 -> 002-2024 (año: 2024)
...

📊 RESUMEN DE MIGRACIÓN
======================================================
✅ Resoluciones migradas: 25
⏭️  Resoluciones saltadas: 0
❌ Errores: 0
📦 Total procesadas: 25
======================================================
```

---

## Uso del Sistema

### 🆕 Crear Nueva Resolución

El frontend automáticamente obtiene el siguiente número:

```javascript
// Solicitud al backend
GET /api/books/last-number

// Respuesta
{
  "lastNumber": "001-2025",
  "format": "NNN-YYYY"
}
```

El usuario ve el número sugerido y puede proceder a crear la resolución.

### 🔍 Buscar Resoluciones

Las búsquedas son compatibles con todos los formatos:

```javascript
// Búsqueda por número
- "001-2025" → Encuentra la resolución exacta
- "1" → Encuentra "001-2025" y formatos legacy
- "2025" → Encuentra todas las resoluciones de 2025
```

### 📊 Ver Estadísticas por Año

```javascript
// En el backend
const stats = await yearResetService.getYearlyStatistics();

// Retorna:
[
  { year: "2025", count: 15 },
  { year: "2024", count: 150 },
  { year: "2023", count: 200 },
  { year: "legacy", count: 5 }
]
```

---

## Migración de Datos Existentes

### 🔧 Script de Migración

El script `migrate-to-year-format.js` es **idempotente** (puede ejecutarse múltiples veces).

#### Características:

- ✅ Detecta resoluciones sin formato de año
- ✅ Usa `FechaCreacion` para determinar el año
- ✅ Actualiza tabla `resolution` e `images`
- ✅ Verifica conflictos antes de migrar
- ✅ Rollback automático en caso de error
- ✅ Backup conceptual antes de iniciar

#### Ejecución Manual:

```bash
# Desde la raíz del proyecto
cd server
node scripts/migrate-to-year-format.js
```

#### Ejecución desde Código:

```javascript
import { migrateResolutionsToYearFormat } from './scripts/migrate-to-year-format.js';

const result = await migrateResolutionsToYearFormat();
console.log(result);
// { success: true, migrated: 25, skipped: 0, errors: 0, total: 25 }
```

### 📋 Verificación Post-Migración

```sql
-- Ver todas las resoluciones con nuevo formato
SELECT "NumdeResolucion", "FechaCreacion"
FROM resolution
WHERE "NumdeResolucion" LIKE '%-%'
ORDER BY "NumdeResolucion";

-- Verificar resoluciones sin migrar
SELECT COUNT(*)
FROM resolution
WHERE "NumdeResolucion" NOT LIKE '%-%'
  AND "NumdeResolucion" !~ '^[0-9]{7}$';
```

---

## Troubleshooting

### ❓ Problema: El reset no se ejecutó el 1 de enero

**Posibles causas:**

1. El servidor no estaba corriendo a las 00:01 AM
2. La zona horaria está mal configurada
3. El job scheduler no se inicializó

**Solución:**

```bash
# 1. Verificar que el servidor está corriendo
ps aux | grep node

# 2. Verificar zona horaria en los logs
# Buscar: "📅 YearResetService inicializado - Zona horaria: ..."

# 3. Ejecutar reset manual si es necesario
# Crear endpoint temporal o usar el servicio directamente
```

### ❓ Problema: Números duplicados después del reset

**Causa:** La migración no se ejecutó correctamente o hay resoluciones con formato incorrecto.

**Solución:**

```bash
# 1. Ejecutar diagnóstico
cd server
node -e "import('./services/YearResetService.js').then(m => m.default.getYearlyStatistics().then(console.log))"

# 2. Re-ejecutar migración
node scripts/migrate-to-year-format.js

# 3. Verificar integridad
psql -d libro_resoluciones -c "SELECT * FROM resolution WHERE \"NumdeResolucion\" NOT LIKE '%-%'"
```

### ❓ Problema: Error "Cannot find module 'node-cron'"

**Solución:**

```bash
cd server
npm install node-cron date-fns-tz
```

### ❓ Problema: El frontend muestra números sin formato

**Causa:** El backend devuelve el formato antiguo o el frontend no está actualizado.

**Solución:**

```bash
# 1. Verificar respuesta del backend
curl http://localhost:3000/api/books/last-number

# 2. Debe devolver algo como:
# {"lastNumber":"001-2025","format":"NNN-YYYY"}

# 3. Si no, reiniciar el servidor backend
cd server
npm run dev
```

### ❓ Problema: Error en migración "Transaction rollback"

**Causa:** Conflicto de nombres o error en la base de datos.

**Solución:**

```bash
# 1. Ver logs detallados de la migración
node scripts/migrate-to-year-format.js 2>&1 | tee migration.log

# 2. Identificar la resolución problemática en los logs

# 3. Corregir manualmente si es necesario
psql -d libro_resoluciones
```

---

## Preguntas Frecuentes (FAQ)

### ❓ ¿Qué pasa si el servidor se reinicia el 1 de enero?

El sistema detecta el cambio de año al iniciar y ejecuta el reset si es necesario.

### ❓ ¿Puedo cambiar la zona horaria después de implementar?

Sí, solo edita la variable `TIMEZONE` en `.env` y reinicia el servidor.

### ❓ ¿Qué pasa con las resoluciones creadas manualmente con formato antiguo?

Se pueden migrar ejecutando el script de migración en cualquier momento.

### ❓ ¿El reset afecta el rendimiento?

No, el reset es instantáneo ya que solo verifica el año, no modifica datos.

### ❓ ¿Puedo usar un formato diferente como "YYYY-NNN"?

Sí, puedes modificar el método `getNextResolutionNumber` en `YearResetService.js`:

```javascript
// Cambiar de NNN-YYYY a YYYY-NNN
return `${currentYear}-${formattedNumber}`;
```

### ❓ ¿Cómo hago backup antes de la migración en producción?

```bash
# PostgreSQL
pg_dump -h HOST -U USER -d DATABASE > backup_$(date +%Y%m%d).sql

# Restaurar si es necesario
psql -h HOST -U USER -d DATABASE < backup_YYYYMMDD.sql
```

### ❓ ¿Puedo desactivar el reset automático?

Sí, comenta la sección del cron job en `server/index.js`:

```javascript
// Comentar estas líneas:
// cron.schedule('1 0 * * *', async () => {
//   await yearResetService.periodicCheck();
// }, { timezone: '...' });
```

### ❓ ¿Cómo pruebo el reset sin esperar al 1 de enero?

Puedes ejecutar un reset manual desde Node.js:

```javascript
import yearResetService from './services/YearResetService.js';

// Forzar cambio de año
yearResetService.lastCheckedYear = 2024;
await yearResetService.executeYearReset();
```

---

## 📞 Soporte

Si encuentras algún problema no cubierto en esta documentación:

1. Revisa los logs del servidor (`server/logs/`)
2. Verifica la configuración en `.env`
3. Consulta el código fuente con comentarios detallados
4. Crea un issue en el repositorio

---

## 📝 Changelog

### v2.0.0 (Octubre 2025)

- ✨ Implementación inicial del sistema de reset anual
- ✨ Servicio `YearResetService` creado
- ✨ Script de migración de datos
- ✨ Job scheduler con node-cron
- ✨ Funciones SQL para optimización
- ✨ Compatibilidad con formatos legacy
- ✨ Documentación completa

---

**🎉 ¡Sistema de Reset Anual implementado exitosamente!**
