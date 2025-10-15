@echo off
chcp 65001 >nul
cls
echo =====================================
echo  DIAGNÓSTICO DE PUERTOS Y PROCESOS
echo =====================================
echo.

echo [1/5] Procesos Node.js activos:
echo ─────────────────────────────────────
tasklist | findstr node.exe
if %errorlevel% neq 0 (
    echo   No hay procesos Node.js corriendo
)
echo.

echo [2/5] Puerto 5173 (Frontend):
echo ─────────────────────────────────────
netstat -ano | findstr :5173
if %errorlevel% neq 0 (
    echo   ✓ Puerto 5173 LIBRE
) else (
    echo   ⚠️  Puerto 5173 OCUPADO
)
echo.

echo [3/5] Puerto 3000 (Backend):
echo ─────────────────────────────────────
netstat -ano | findstr :3000
if %errorlevel% neq 0 (
    echo   ✓ Puerto 3000 LIBRE
) else (
    echo   ⚠️  Puerto 3000 OCUPADO
)
echo.

echo [4/5] Estado de PostgreSQL:
echo ─────────────────────────────────────
sc query postgresql-x64-16 | find "STATE"
echo.

echo [5/5] Procesos relacionados:
echo ─────────────────────────────────────
echo Vite:
tasklist | findstr vite
if %errorlevel% neq 0 (
    echo   No hay procesos Vite corriendo
)
echo.
echo NPM:
tasklist | findstr npm
if %errorlevel% neq 0 (
    echo   No hay procesos NPM corriendo
)
echo.

echo =====================================
echo  RESUMEN
echo =====================================
echo.
echo Si ves puertos ocupados:
echo   1. Anota el número PID (última columna)
echo   2. Ejecuta: taskkill /F /PID [número]
echo.
echo O simplemente ejecuta: REINICIAR-SISTEMA.bat
echo.
pause
