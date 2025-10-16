@echo off
chcp 65001 >nul
cls
echo ========================================
echo  LIMPIEZA TOTAL DEL SISTEMA
echo ========================================
echo.
echo Este script cerrará TODOS los procesos
echo relacionados con el sistema.
echo.
pause

echo.
echo [1/3] Cerrando procesos Node.js...
tasklist | findstr node.exe >nul
if %errorlevel% equ 0 (
    taskkill /F /IM node.exe 2>nul
    echo ✓ Procesos Node.js cerrados
) else (
    echo ℹ️  No hay procesos Node.js corriendo
)
echo.

echo [2/3] Cerrando procesos NPM...
tasklist | findstr npm.cmd >nul
if %errorlevel% equ 0 (
    taskkill /F /IM npm.cmd 2>nul
    echo ✓ Procesos NPM cerrados
) else (
    echo ℹ️  No hay procesos NPM corriendo
)
echo.

echo [3/3] Esperando a que se liberen los puertos...
timeout /t 3 >nul
echo.

echo ========================================
echo  ✓ LIMPIEZA COMPLETADA
echo ========================================
echo.
echo Ahora puedes ejecutar INICIAR-SISTEMA.bat
echo.
pause
