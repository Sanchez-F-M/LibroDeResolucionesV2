# Guía de Testing – Libro de Resoluciones V2

## Resumen

El proyecto usa **Vitest** para pruebas unitarias en frontend y backend. Los tests de integración/E2E que requieren el servidor corriendo están separados.

---

## Comandos disponibles

### Frontend

```bash
# Unitarias (una sola ejecución)
cd front && npm test

# Unitarias en modo observador (auto-rerun)
cd front && npm run test:watch
```

**Resultado esperado:**

```
✓ src/test-hello-vitest.js (1 test)
✓ Test Files  1 passed (1)
✓ Tests  1 passed (1)
```

### Backend

```bash
# Unitarias (una sola ejecución)
cd server && npm test

# Unitarias en modo observador
cd server && npm run test:watch

# Tests de integración (requiere servidor corriendo)
cd server && npm run test:e2e

# Solo login
cd server && npm run test:login

# Solo enlaces móviles
cd server && npm run test:mobile-links
```

**Resultado esperado (unitarias):**

```
✓ test-hello-vitest.js (6 tests)
✓ Backend Smoke Tests > debería responder con "Hola Mundo"
✓ Backend Smoke Tests > suma funciona correctamente
✓ Backend Smoke Tests > resta funciona correctamente
✓ Backend Smoke Tests > string concatenation
✓ Backend Smoke Tests > array methods
✓ Backend Smoke Tests > object comparison
```

### Ambos proyectos (desde raíz)

```bash
# Ejecutar tests de ambos (unitarias)
(cd front && npm test) && (cd server && npm test)
```

---

## Estructura de tests

### Frontend (`front/`)

- **Configuración:** `front/vitest.config.js`
- **Ambiente:** `happy-dom` (ambiente DOM ligero, compatible con ESM)
- **Archivos de test:**
  - `src/test-*.js` (tus scripts)
  - `src/**/*.test.js`, `src/**/*.spec.js` (convención estándar)

**Ejemplo de test en frontend:**

```javascript
import { describe, it, expect } from 'vitest';

describe('Pruebas de Hello World', () => {
  it('debería retornar true', () => {
    expect(true).toBe(true);
  });
});
```

### Backend (`server/`)

- **Configuración:** `server/vitest.config.js`
- **Ambiente:** `node`
- **Archivos de test:**
  - `test-hello-vitest.js` (smoke tests unitarios)
  - Separados:
    - `test-login-simple.js` (integración, requiere server)
    - `test-login.js` (integración, requiere server)
    - `test-mobile-links.js` (integración, requiere server)

**Ejemplo de test en backend:**

```javascript
import { describe, it, expect } from 'vitest';

describe('Backend Smoke Tests', () => {
  it('suma funciona correctamente', () => {
    expect(1 + 2).toBe(3);
  });
});
```

---

## Flujo recomendado

### Desarrollo local

1. **Mientras desarrollas (modo watch):**

   ```bash
   # Terminal 1: Frontend
   cd front && npm run test:watch

   # Terminal 2: Backend
   cd server && npm run test:watch
   ```

2. **Antes de hacer commit:**

   ```bash
   # Ejecutar todas las unitarias
   (cd front && npm test) && (cd server && npm test)
   ```

3. **Validar integración (con servidor corriendo):**

   ```bash
   # Terminal 1: Inicia el servidor
   cd server && npm start

   # Terminal 2: Corre los tests de integración
   cd server && npm run test:e2e
   ```

---

## Diferencia: Unitarias vs. Integración/E2E

| Tipo            | Archivos                                 | Requiere servidor | Comando            |
| --------------- | ---------------------------------------- | ----------------- | ------------------ |
| **Unitarias**   | `test-hello-vitest.js`                   | NO                | `npm test`         |
| **Integración** | `test-login*.js`, `test-mobile-links.js` | SÍ                | `npm run test:e2e` |

---

## Configuración de Vitest

### Frontend (`front/vitest.config.js`)

```javascript
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'happy-dom',  // DOM ligero
    globals: true,             // usa expect sin import
    include: [
      'src/**/*.test.js',
      'src/**/*.spec.js',
      'src/test-*.js'
    ],
  },
});
```

### Backend (`server/vitest.config.js`)

```javascript
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: [
      '**/*.test.js',
      '**/*.spec.js',
      'test-hello-vitest.js'
    ],
    exclude: [
      'node_modules',
      'dist',
      'test-login*.js',
      'test-mobile-links.js'  // Integración, no unitarias
    ]
  }
});
```

---

## Dependencias instaladas

- **vitest**: Framework de testing (ESM-first, muy rápido)
- **happy-dom**: DOM ligero para tests del frontend (front/)

```bash
npm list | grep vitest
npm list | grep happy-dom
```

---

## Troubleshooting

### "Cannot find module 'vitest'"

```bash
cd front && npm install -D vitest
cd ../server && npm install -D vitest
```

### Tests corren pero dicen "No test suite found"

- Verifica que el archivo tenga `describe` e `it` del vitest
- Confirma que esté en el `include` de `vitest.config.js`

### Test de integración falla sin servidor

```bash
# Inicia el servidor en otra terminal
cd server && npm start

# Luego corre los tests
npm run test:e2e
```

---

## Próximos pasos

1. **Agregar más tests unitarios** en componentes/funciones críticas
2. **Configurar CI/CD** (GitHub Actions) para correr tests en cada push
3. **Medir cobertura** con `npm test -- --coverage`
4. **E2E visual** con Playwright si necesitas validar UI real

---

**Última actualización:** 19 de octubre de 2025
**Versión Vitest:** 3.2.4
