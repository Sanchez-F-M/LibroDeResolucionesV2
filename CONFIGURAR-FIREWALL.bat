@echo off
REM ========================================================
REM Script para abrir puertos en el Firewall de Windows
REM DEBE EJECUTARSE COMO ADMINISTRADOR
REM ========================================================

echo ========================================
echo  CONFIGURANDO FIREWALL PARA RED LOCAL
echo ========================================
echo.
echo Este script abrirá los puertos necesarios
echo para acceder a la aplicación desde tu celular.
echo.
echo Puertos a abrir:
echo   - 3000 (Backend)
echo   - 5173 (Frontend)
echo.
pause

echo.
echo [1/4] Eliminando reglas antiguas (si existen)...
netsh advfirewall firewall delete rule name="LibroRes Front 5173" 2>nul
netsh advfirewall firewall delete rule name="LibroRes Back 3000" 2>nul
echo ✓ Reglas antiguas eliminadas

echo.
echo [2/4] Creando regla para Frontend (puerto 5173)...
netsh advfirewall firewall add rule name="LibroRes Front 5173" dir=in action=allow protocol=TCP localport=5173
if %errorlevel% equ 0 (
    echo ✓ Puerto 5173 abierto correctamente
) else (
    echo ✗ Error al abrir puerto 5173
    echo   Asegúrate de ejecutar este script como Administrador
    pause
    exit /b 1
)

echo.
echo [3/4] Creando regla para Backend (puerto 3000)...
netsh advfirewall firewall add rule name="LibroRes Back 3000" dir=in action=allow protocol=TCP localport=3000
if %errorlevel% equ 0 (
    echo ✓ Puerto 3000 abierto correctamente
) else (
    echo ✗ Error al abrir puerto 3000
    echo   Asegúrate de ejecutar este script como Administrador
    pause
    exit /b 1
)

echo.
echo [4/4] Verificando reglas creadas...
netsh advfirewall firewall show rule name="LibroRes Front 5173"
netsh advfirewall firewall show rule name="LibroRes Back 3000"

echo.
echo ========================================
echo  ✓ FIREWALL CONFIGURADO CORRECTAMENTE
echo ========================================
echo.
echo Puertos abiertos:
echo   ✓ 3000 (Backend)
echo   ✓ 5173 (Frontend)
echo.
echo Ahora puedes acceder desde tu celular a:
echo   http://TU_IP:5173
echo.
echo Para obtener tu IP ejecuta: ipconfig
echo Busca la línea "Dirección IPv4"
echo.
pause
