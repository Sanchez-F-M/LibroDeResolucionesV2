@echo off
chcp 65001 >nul
cls
echo ========================================
echo  VERIFICACIÓN DE CONFIGURACIÓN MÓVIL
echo ========================================
echo.

REM Obtener IP del PC
echo [1/5] Obteniendo IP del PC...
for /f "tokens=2 delims=:" %%a in ('ipconfig ^| findstr /c:"IPv4"') do (
    set IP=%%a
    goto :ip_found
)
:ip_found
set IP=%IP:~1%
if "%IP%"=="" (
    echo ✗ No se pudo obtener la IP
    set IP=NO_DETECTADA
) else (
    echo ✓ IP detectada: %IP%
)
echo.

REM Verificar archivo .env
echo [2/5] Verificando configuración del frontend...
if exist "front\.env" (
    echo ✓ Archivo .env encontrado
    findstr "VITE_API_URL" front\.env >nul
    if %errorlevel% equ 0 (
        echo ✓ Variable VITE_API_URL configurada
        type front\.env | findstr "VITE_API_URL"
    ) else (
        echo ✗ Variable VITE_API_URL no encontrada en .env
    )
) else (
    echo ✗ Archivo .env no encontrado
)
echo.

REM Verificar reglas de firewall
echo [3/5] Verificando reglas del firewall...
netsh advfirewall firewall show rule name="LibroRes Front 5173" >nul 2>&1
if %errorlevel% equ 0 (
    echo ✓ Regla para puerto 5173 encontrada
) else (
    echo ✗ Regla para puerto 5173 NO encontrada
    echo   Ejecuta CONFIGURAR-FIREWALL.bat como Administrador
)

netsh advfirewall firewall show rule name="LibroRes Back 3000" >nul 2>&1
if %errorlevel% equ 0 (
    echo ✓ Regla para puerto 3000 encontrada
) else (
    echo ✗ Regla para puerto 3000 NO encontrada
    echo   Ejecuta CONFIGURAR-FIREWALL.bat como Administrador
)
echo.

REM Verificar si los puertos están escuchando
echo [4/5] Verificando si los servidores están corriendo...
netstat -ano | findstr :3000 | findstr LISTENING >nul
if %errorlevel% equ 0 (
    echo ✓ Backend corriendo en puerto 3000
) else (
    echo ✗ Backend NO está corriendo en puerto 3000
    echo   Ejecuta INICIAR-SISTEMA.bat
)

netstat -ano | findstr :5173 | findstr LISTENING >nul
if %errorlevel% equ 0 (
    echo ✓ Frontend corriendo en puerto 5173
) else (
    echo ✗ Frontend NO está corriendo en puerto 5173
    echo   Ejecuta INICIAR-SISTEMA.bat
)
echo.

REM Mostrar resumen
echo [5/5] Resumen de configuración:
echo ========================================
echo.
echo IP del PC: %IP%
echo.
echo URLs para acceder:
echo   Desde PC:      http://localhost:5173
echo   Desde celular: http://%IP%:5173
echo.
echo Backend (API):
echo   http://%IP%:3000
echo.
echo ========================================
echo.
echo Próximos pasos:
echo.
echo 1. Si el firewall NO está configurado:
echo    → Ejecuta CONFIGURAR-FIREWALL.bat como Administrador
echo.
echo 2. Si los servidores NO están corriendo:
echo    → Ejecuta INICIAR-SISTEMA.bat
echo.
echo 3. En tu celular (misma WiFi):
echo    → Abre: http://%IP%:5173
echo.
echo ========================================
echo.
pause
