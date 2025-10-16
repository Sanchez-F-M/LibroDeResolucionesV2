@echo off
chcp 65001 >nul
setlocal enabledelayedexpansion

cls
echo ========================================
echo  LIBRO DE RESOLUCIONES - INICIADOR
echo ========================================
echo.

REM ------------------------------------------
REM  PASO 1: VERIFICAR Y LIMPIAR PUERTOS
REM ------------------------------------------
echo [PASO 1/5] Verificando puertos...
echo.

REM Verificar puerto 5173 (Frontend)
set "FRONTEND_BUSY=0"
for /f "tokens=5" %%a in ('netstat -aon ^| find ":5173" ^| find "LISTENING"') do (
    set "FRONTEND_BUSY=1"
    set "FRONTEND_PID=%%a"
)

if !FRONTEND_BUSY! equ 1 (
    echo ⚠️  Puerto 5173 ocupado por proceso !FRONTEND_PID!
    echo    Liberando puerto automáticamente...
    taskkill /F /PID !FRONTEND_PID! >nul 2>&1
    echo ✓ Puerto 5173 liberado
    timeout /t 2 >nul
) else (
    echo ✓ Puerto 5173 disponible
)

REM Verificar puerto 3000 (Backend)
set "BACKEND_BUSY=0"
for /f "tokens=5" %%a in ('netstat -aon ^| find ":3000" ^| find "LISTENING"') do (
    set "BACKEND_BUSY=1"
    set "BACKEND_PID=%%a"
)

if !BACKEND_BUSY! equ 1 (
    echo ⚠️  Puerto 3000 ocupado por proceso !BACKEND_PID!
    echo    Liberando puerto automáticamente...
    taskkill /F /PID !BACKEND_PID! >nul 2>&1
    echo ✓ Puerto 3000 liberado
    timeout /t 2 >nul
) else (
    echo ✓ Puerto 3000 disponible
)

echo.

REM ------------------------------------------
REM  PASO 2: VERIFICAR POSTGRESQL
REM ------------------------------------------
echo [PASO 2/5] Verificando PostgreSQL...
sc query postgresql-x64-16 | find "RUNNING" >nul
if %errorlevel% equ 0 (
    echo ✓ PostgreSQL corriendo
) else (
    echo ! PostgreSQL detenido, intentando iniciar...
    net start postgresql-x64-16 2>nul
    if %errorlevel% equ 0 (
        echo ✓ PostgreSQL iniciado correctamente
        timeout /t 3 >nul
    ) else (
        echo ⚠️  No se pudo iniciar PostgreSQL automáticamente
        echo    Ejecuta como Administrador o inicia manualmente
        pause
        exit /b 1
    )
)
echo.

REM ------------------------------------------
REM  PASO 3: VERIFICAR DIRECTORIOS
REM ------------------------------------------
echo [PASO 3/5] Verificando estructura de archivos...
if not exist "%~dp0server\index.js" (
    echo ✗ Error: No se encuentra server\index.js
    pause
    exit /b 1
)
if not exist "%~dp0front\package.json" (
    echo ✗ Error: No se encuentra front\package.json
    pause
    exit /b 1
)
echo ✓ Estructura de archivos correcta
echo.

REM ------------------------------------------
REM  PASO 4: INICIAR BACKEND
REM ------------------------------------------
echo [PASO 4/5] Iniciando Backend (puerto 3000)...
cd /d "%~dp0server"
start "📘 Backend - Libro de Resoluciones" cmd /k "title Backend ^| color 0A && echo. && echo ═══════════════════════════════════ && echo   BACKEND - LIBRO DE RESOLUCIONES && echo   Puerto: 3000 && echo ═══════════════════════════════════ && echo. && node index.js"
echo ✓ Backend lanzado
timeout /t 3 >nul
echo.

REM ------------------------------------------
REM  PASO 5: INICIAR FRONTEND
REM ------------------------------------------
echo [PASO 5/5] Iniciando Frontend (puerto 5173)...
cd /d "%~dp0front"
start "🌐 Frontend - Libro de Resoluciones" cmd /k "title Frontend ^| color 0B && echo. && echo ═══════════════════════════════════ && echo   FRONTEND - LIBRO DE RESOLUCIONES && echo   Puerto: 5173 && echo ═══════════════════════════════════ && echo. && npm run dev"
echo ✓ Frontend lanzado
timeout /t 3 >nul
echo.

REM ------------------------------------------
REM  RESUMEN FINAL
REM ------------------------------------------
echo ========================================
echo  ✅ SISTEMA INICIADO CORRECTAMENTE
echo ========================================
echo.
echo 📍 URLs de acceso:
echo    PC:        http://localhost:5173
echo    Celular:   http://192.168.1.235:5173
echo    Backend:   http://localhost:3000
echo.
echo 🪟 Ventanas abiertas:
echo    [1] Backend  (ventana verde)
echo    [2] Frontend (ventana azul)
echo.
echo ⚠️  IMPORTANTE:
echo    NO cierres estas ventanas mientras uses la app
echo.
echo 🔄 Para reiniciar si hay errores:
echo    Ejecuta: REINICIAR-SISTEMA.bat
echo.
echo 🔍 Para diagnóstico:
echo    Ejecuta: DIAGNOSTICO-PUERTOS.bat
echo.
echo 🌐 Abriendo navegador en 3 segundos...
timeout /t 3 >nul

start http://localhost:5173

echo.
echo Sistema en ejecución. Puedes cerrar esta ventana.
echo.
pause
endlocal
