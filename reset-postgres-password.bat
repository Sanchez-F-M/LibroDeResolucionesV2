@echo off
:: Script para resetear la contraseña de PostgreSQL
:: EJECUTAR COMO ADMINISTRADOR

echo ==========================================
echo   RESETEO DE CONTRASEÑA POSTGRESQL
echo ==========================================
echo.
echo IMPORTANTE: Este script debe ejecutarse como ADMINISTRADOR
echo.
pause

echo Paso 1: Deteniendo servicio PostgreSQL...
net stop postgresql-x64-17
if %errorlevel% neq 0 (
    echo ERROR: No se pudo detener el servicio. Ejecuta como administrador.
    pause
    exit /b 1
)

echo Paso 2: Creando respaldo de pg_hba.conf...
copy "C:\Program Files\PostgreSQL\17\data\pg_hba.conf" "C:\Program Files\PostgreSQL\17\data\pg_hba.conf.backup" >nul
if %errorlevel% neq 0 (
    echo ERROR: No se pudo crear respaldo de configuración.
    pause
    exit /b 1
)

echo Paso 3: Configurando autenticación temporal...
echo # Configuracion temporal para reset de contraseña > "C:\Program Files\PostgreSQL\17\data\pg_hba.conf"
echo # TYPE  DATABASE        USER            ADDRESS                 METHOD >> "C:\Program Files\PostgreSQL\17\data\pg_hba.conf"
echo local   all             all                                     trust >> "C:\Program Files\PostgreSQL\17\data\pg_hba.conf"
echo host    all             all             127.0.0.1/32            trust >> "C:\Program Files\PostgreSQL\17\data\pg_hba.conf"
echo host    all             all             ::1/128                 trust >> "C:\Program Files\PostgreSQL\17\data\pg_hba.conf"

echo Paso 4: Iniciando servicio PostgreSQL...
net start postgresql-x64-17
if %errorlevel% neq 0 (
    echo ERROR: No se pudo iniciar el servicio.
    goto restore_config
)

echo Paso 5: Esperando que el servicio esté listo...
timeout /t 10 /nobreak >nul

echo Paso 6: Cambiando contraseña a 'admin123'...
"C:\Program Files\PostgreSQL\17\bin\psql" -U postgres -h localhost -p 5433 -d postgres -c "ALTER USER postgres PASSWORD 'admin123';"
if %errorlevel% neq 0 (
    echo ERROR: No se pudo cambiar la contraseña.
    goto restore_config
)

echo Paso 7: Creando base de datos 'libro_resoluciones'...
"C:\Program Files\PostgreSQL\17\bin\psql" -U postgres -h localhost -p 5433 -d postgres -c "CREATE DATABASE libro_resoluciones;"
if %errorlevel% neq 0 (
    echo INFO: La base de datos ya puede existir, continuando...
)

:restore_config
echo Paso 8: Restaurando configuración de seguridad...
copy "C:\Program Files\PostgreSQL\17\data\pg_hba.conf.backup" "C:\Program Files\PostgreSQL\17\data\pg_hba.conf" >nul

echo Paso 9: Reiniciando servicio para aplicar configuración de seguridad...
net stop postgresql-x64-17 >nul
net start postgresql-x64-17 >nul

echo Paso 10: Esperando que el servicio esté listo...
timeout /t 5 /nobreak >nul

echo Paso 11: Verificando la nueva conexión...
"C:\Program Files\PostgreSQL\17\bin\psql" -U postgres -h localhost -p 5433 -d libro_resoluciones -c "SELECT 'Conexion exitosa con nueva contraseña' as resultado;" 2>nul
if %errorlevel% == 0 (
    echo.
    echo ========================================
    echo   ✅ RESETEO COMPLETADO EXITOSAMENTE
    echo ========================================
    echo.
    echo Configuración PostgreSQL:
    echo - Usuario: postgres
    echo - Contraseña: admin123
    echo - Host: localhost
    echo - Puerto: 5433
    echo - Base de datos: libro_resoluciones
    echo.
    echo El archivo .env ya está configurado correctamente.
    echo Ahora puedes ejecutar: npm run setup-postgres
    echo.
) else (
    echo.
    echo ========================================
    echo   ❌ ERROR EN EL RESETEO
    echo ========================================
    echo.
    echo Verifica manualmente usando pgAdmin:
    echo 1. Abre pgAdmin
    echo 2. Conecta con la contraseña establecida durante la instalación
    echo 3. Cambia la contraseña del usuario postgres a 'admin123'
    echo.
)

echo Limpiando archivos temporales...
del "C:\Program Files\PostgreSQL\17\data\pg_hba.conf.backup" 2>nul

echo.
echo Presiona cualquier tecla para salir...
pause >nul
