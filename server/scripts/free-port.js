// Script para liberar un puerto antes de iniciar el servidor
// Uso: node scripts/free-port.js 3000
import { execSync } from 'child_process';

const argPort = process.argv[2];
const envPort = process.env.PORT;
const port = parseInt(argPort || envPort || 3000, 10);

function unique(arr) {
  return [...new Set(arr)];
}

try {
  if (process.platform === 'win32') {
    // Buscar cualquier proceso que esté usando el puerto (no solo LISTENING)
    let output = '';
    try {
      output = execSync(`netstat -ano | findstr :${port}`, {
        stdio: 'pipe',
      }).toString();
    } catch (e) {
      output = '';
    }

    const pids = unique(
      output
        .split(/\r?\n/)
        .map(line => line.trim())
        .filter(Boolean)
        .map(line => {
          const parts = line.split(/\s+/);
          return parts[parts.length - 1];
        })
        .filter(pid => /^(\d+)$/.test(pid))
    );

    for (const pid of pids) {
      try {
        execSync(`taskkill /F /PID ${pid}`, { stdio: 'pipe' });
        console.log(`🔪 Proceso ${pid} terminado en puerto ${port}`);
      } catch (e) {
        // Ignorar errores de taskkill
      }
    }
  } else {
    // Unix-like
    let pids = [];
    try {
      const out = execSync(`lsof -ti :${port}`, { stdio: 'pipe' }).toString();
      pids = out.split(/\r?\n/).filter(Boolean);
    } catch (e) {
      pids = [];
    }

    for (const pid of pids) {
      try {
        execSync(`kill -9 ${pid}`, { stdio: 'pipe' });
        console.log(`🔪 Proceso ${pid} terminado en puerto ${port}`);
      } catch (e) {}
    }
  }

  console.log(`✅ Puerto ${port} listo`);
} catch (e) {
  console.log(
    `ℹ️ No se pudo verificar/liberar el puerto ${port}: ${e.message}`
  );
}
