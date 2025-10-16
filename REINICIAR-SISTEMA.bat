@echo off
chcp 65001 >nul
cls
echo ========================================
echo  LIBERANDO PUERTOS Y REINICIANDO SISTEMA
echo ========================================
echo.

echo [1/4] Matando procesos en puerto 5173 (Frontend)...
for /f "tokens=5" %%a in ('netstat -aon ^| find ":5173" ^| find "LISTENING"') do (
    echo   Matando proceso %%a...
    taskkill /F /PID %%a 2>nul
)
echo ✓ Puerto 5173 liberado
echo.

echo [2/4] Matando procesos en puerto 3000 (Backend)...
for /f "tokens=5" %%a in ('netstat -aon ^| find ":3000" ^| find "LISTENING"') do (
    echo   Matando proceso %%a...
    taskkill /F /PID %%a 2>nul
)
echo ✓ Puerto 3000 liberado
echo.

timeout /t 2 >nul

echo [3/4] Verificando PostgreSQL...
sc query postgresql-x64-16 | find "RUNNING" >nul
if %errorlevel% equ 0 (
    echo ✓ PostgreSQL corriendo
) else (
    echo ! Iniciando PostgreSQL...
    net start postgresql-x64-16 2>nul
    timeout /t 3 >nul
)
echo.

echo [4/4] Iniciando sistema...
cd /d "%~dp0server"
start "LibroResoluciones - Backend" cmd /k "echo Backend iniciando... && node index.js"
timeout /t 3 >nul

cd /d "%~dp0front"
start "LibroResoluciones - Frontend" cmd /k "echo Frontend iniciando... && npm run dev"
timeout /t 3 >nul

echo.
echo ================================
echo  ✓ SISTEMA INICIADO
echo ================================
echo.
echo URLs:
echo   Frontend: http://localhost:5173
echo   Backend:  http://localhost:3000
echo.
echo Abriendo navegador en 3 segundos...
timeout /t 3 >nul
start http://localhost:5173

echo.
echo Sistema en ejecución.
echo NO cierres las ventanas de Backend y Frontend.
echo.
pause
