@echo off
title Sistema Libro de Resoluciones
color 0A

echo.
echo ===========================================
echo   🚀 SISTEMA LIBRO DE RESOLUCIONES 
echo ===========================================
echo.

REM Verificar si Git Bash está disponible
where bash.exe >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Error: Git Bash no encontrado
    echo.
    echo Por favor instala Git for Windows desde:
    echo https://git-scm.com/download/win
    echo.
    echo Git Bash es necesario para ejecutar el script de inicio.
    pause
    exit /b 1
)

echo ✅ Git Bash detectado
echo.

REM Verificar Node.js
where node >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Error: Node.js no encontrado
    echo.
    echo Por favor instala Node.js desde:
    echo https://nodejs.org/
    pause
    exit /b 1
)

echo ✅ Node.js detectado
for /f "tokens=*" %%a in ('node -v') do set NODE_VERSION=%%a
echo    Versión: %NODE_VERSION%
echo.

REM Verificar estructura del proyecto
if not exist "server" (
    echo ❌ Error: Directorio 'server' no encontrado
    echo.
    echo Asegúrate de ejecutar este archivo desde la raíz del proyecto
    pause
    exit /b 1
)

if not exist "front" (
    echo ❌ Error: Directorio 'front' no encontrado
    echo.
    echo Asegúrate de ejecutar este archivo desde la raíz del proyecto
    pause
    exit /b 1
)

echo ✅ Estructura del proyecto verificada
echo.

echo 🚀 Iniciando sistema...
echo.
echo Este proceso abrirá:
echo   - Servidor Backend en puerto 10000
echo   - Aplicación Frontend en puerto 5173+
echo.
echo Para detener el sistema, cierra esta ventana o presiona Ctrl+C
echo.
pause

REM Ejecutar el script bash mejorado
bash.exe start-system-improved.sh

echo.
echo 👋 Sistema detenido
pause
