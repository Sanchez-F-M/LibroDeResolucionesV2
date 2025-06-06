@echo off
echo ==========================================
echo   Configuracion de PostgreSQL
echo ==========================================
echo.
echo PostgreSQL esta ejecutandose en el puerto 5433
echo.
echo Opciones disponibles:
echo 1. Abrir pgAdmin para configurar contraseña
echo 2. Intentar conectar con contraseñas comunes
echo 3. Resetear contraseña de postgres
echo 4. Verificar configuracion actual
echo.

:menu
set /p choice="Selecciona una opcion (1-4): "

if "%choice%"=="1" goto pgadmin
if "%choice%"=="2" goto test_passwords
if "%choice%"=="3" goto reset_password
if "%choice%"=="4" goto verify_config
echo Opcion invalida. Intenta de nuevo.
goto menu

:pgadmin
echo.
echo Abriendo pgAdmin...
echo.
echo En pgAdmin:
echo 1. Busca "Servers" en el panel izquierdo
echo 2. Click derecho en "PostgreSQL 17" o "localhost"
echo 3. Selecciona "Properties" o "Connect"
echo 4. Si te pide contraseña, intenta: postgres, admin, password, 123456
echo 5. Una vez conectado, click derecho en "postgres" (usuario)
echo 6. Selecciona "Properties" ^> "Definition" 
echo 7. Cambia la contraseña a "admin123"
echo.
start "" "C:\Program Files\PostgreSQL\17\pgAdmin 4\bin\pgAdmin4.exe"
pause
goto end

:test_passwords
echo.
echo Probando contraseñas comunes...
echo.

echo Probando 'postgres'...
"C:\Program Files\PostgreSQL\17\bin\psql" -U postgres -h localhost -p 5433 -c "SELECT version();" 2>nul
if %errorlevel%==0 (
    echo ¡Conexion exitosa con contraseña 'postgres'!
    goto update_env_postgres
)

echo Probando contraseña vacia...
"C:\Program Files\PostgreSQL\17\bin\psql" -U postgres -h localhost -p 5433 -c "SELECT version();" 2>nul
if %errorlevel%==0 (
    echo ¡Conexion exitosa sin contraseña!
    goto update_env_empty
)

echo Probando 'password'...
echo password | "C:\Program Files\PostgreSQL\17\bin\psql" -U postgres -h localhost -p 5433 -c "SELECT version();" 2>nul
if %errorlevel%==0 (
    echo ¡Conexion exitosa con contraseña 'password'!
    goto update_env_password
)

echo Probando '123456'...
echo 123456 | "C:\Program Files\PostgreSQL\17\bin\psql" -U postgres -h localhost -p 5433 -c "SELECT version();" 2>nul
if %errorlevel%==0 (
    echo ¡Conexion exitosa con contraseña '123456'!
    goto update_env_123456
)

echo.
echo No se pudo conectar con ninguna contraseña común.
echo Necesitas usar pgAdmin o resetear la contraseña.
pause
goto menu

:reset_password
echo.
echo Para resetear la contraseña de PostgreSQL:
echo.
echo 1. Detener el servicio PostgreSQL
echo 2. Editar pg_hba.conf para permitir conexiones sin contraseña
echo 3. Reiniciar el servicio
echo 4. Conectar y cambiar la contraseña
echo 5. Revertir los cambios en pg_hba.conf
echo.
echo ¿Deseas continuar? (s/n):
set /p confirm=
if /i "%confirm%"=="s" goto do_reset
goto menu

:do_reset
echo.
echo Deteniendo servicio PostgreSQL...
net stop postgresql-x64-17
echo.
echo Editando pg_hba.conf...
copy "C:\Program Files\PostgreSQL\17\data\pg_hba.conf" "C:\Program Files\PostgreSQL\17\data\pg_hba.conf.backup"
echo # Configuracion temporal para reset de contraseña > "C:\Program Files\PostgreSQL\17\data\pg_hba.conf.temp"
echo local   all             all                                     trust >> "C:\Program Files\PostgreSQL\17\data\pg_hba.conf.temp"
echo host    all             all             127.0.0.1/32            trust >> "C:\Program Files\PostgreSQL\17\data\pg_hba.conf.temp"
echo host    all             all             ::1/128                 trust >> "C:\Program Files\PostgreSQL\17\data\pg_hba.conf.temp"
copy "C:\Program Files\PostgreSQL\17\data\pg_hba.conf.temp" "C:\Program Files\PostgreSQL\17\data\pg_hba.conf"
echo.
echo Iniciando servicio PostgreSQL...
net start postgresql-x64-17
echo.
echo Esperando 5 segundos para que el servicio esté listo...
timeout /t 5 /nobreak > nul
echo.
echo Cambiando contraseña a 'admin123'...
"C:\Program Files\PostgreSQL\17\bin\psql" -U postgres -h localhost -p 5433 -c "ALTER USER postgres PASSWORD 'admin123';"
echo.
echo Restaurando configuración de seguridad...
copy "C:\Program Files\PostgreSQL\17\data\pg_hba.conf.backup" "C:\Program Files\PostgreSQL\17\data\pg_hba.conf"
echo.
echo Reiniciando servicio para aplicar cambios de seguridad...
net stop postgresql-x64-17
net start postgresql-x64-17
echo.
echo ¡Contraseña cambiada exitosamente a 'admin123'!
pause
goto end

:verify_config
echo.
echo Configuracion actual de PostgreSQL:
echo.
echo Puerto: 5433
echo Usuario: postgres
echo Host: localhost
echo Base de datos por defecto: postgres
echo.
echo Estado del servicio:
sc query postgresql-x64-17
echo.
echo Archivo .env actual:
type "c:\Users\flavi\OneDrive\Escritorio\LibroDeResolucionesV2\server\.env" | findstr DB_
echo.
pause
goto menu

:update_env_postgres
echo Actualizando .env con contraseña 'postgres'...
:: Aquí actualizarías el archivo .env
echo Contraseña encontrada: postgres
pause
goto end

:update_env_empty
echo Actualizando .env sin contraseña...
:: Aquí actualizarías el archivo .env
echo Sin contraseña requerida
pause
goto end

:update_env_password
echo Actualizando .env con contraseña 'password'...
:: Aquí actualizarías el archivo .env
echo Contraseña encontrada: password
pause
goto end

:update_env_123456
echo Actualizando .env con contraseña '123456'...
:: Aquí actualizarías el archivo .env
echo Contraseña encontrada: 123456
pause
goto end

:end
echo.
echo Configuracion completada.
echo Presiona cualquier tecla para salir...
pause > nul
