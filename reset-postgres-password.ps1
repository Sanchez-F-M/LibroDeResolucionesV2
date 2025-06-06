# Script PowerShell para resetear contraseña de PostgreSQL
# Ejecutar como Administrador

Write-Host "===========================================" -ForegroundColor Cyan
Write-Host "   RESETEO DE CONTRASEÑA POSTGRESQL" -ForegroundColor Cyan
Write-Host "===========================================" -ForegroundColor Cyan
Write-Host ""

# Verificar si se ejecuta como administrador
$currentUser = [Security.Principal.WindowsIdentity]::GetCurrent()
$principal = New-Object Security.Principal.WindowsPrincipal($currentUser)
$isAdmin = $principal.IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)

if (-not $isAdmin) {
    Write-Host "ERROR: Este script debe ejecutarse como Administrador" -ForegroundColor Red
    Write-Host "Haz clic derecho en PowerShell y selecciona 'Ejecutar como administrador'" -ForegroundColor Yellow
    Read-Host "Presiona Enter para salir"
    exit 1
}

try {
    Write-Host "Paso 1: Deteniendo servicio PostgreSQL..." -ForegroundColor Yellow
    Stop-Service -Name "postgresql-x64-17" -Force
    Write-Host "✅ Servicio detenido" -ForegroundColor Green

    Write-Host "Paso 2: Creando respaldo de configuración..." -ForegroundColor Yellow
    $pgDataPath = "C:\Program Files\PostgreSQL\17\data"
    Copy-Item "$pgDataPath\pg_hba.conf" "$pgDataPath\pg_hba.conf.backup" -Force
    Write-Host "✅ Respaldo creado" -ForegroundColor Green

    Write-Host "Paso 3: Configurando autenticación temporal..." -ForegroundColor Yellow
    $tempConfig = @"
# Configuración temporal para reset de contraseña
# TYPE  DATABASE        USER            ADDRESS                 METHOD
local   all             all                                     trust
host    all             all             127.0.0.1/32            trust
host    all             all             ::1/128                 trust
"@
    $tempConfig | Out-File -FilePath "$pgDataPath\pg_hba.conf" -Encoding UTF8
    Write-Host "✅ Configuración temporal aplicada" -ForegroundColor Green

    Write-Host "Paso 4: Iniciando servicio PostgreSQL..." -ForegroundColor Yellow
    Start-Service -Name "postgresql-x64-17"
    Start-Sleep -Seconds 10
    Write-Host "✅ Servicio iniciado" -ForegroundColor Green

    Write-Host "Paso 5: Cambiando contraseña..." -ForegroundColor Yellow
    $psqlPath = "C:\Program Files\PostgreSQL\17\bin\psql.exe"
    & $psqlPath -U postgres -h localhost -p 5433 -d postgres -c "ALTER USER postgres PASSWORD 'admin123';"
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Contraseña cambiada exitosamente" -ForegroundColor Green
    } else {
        throw "Error al cambiar contraseña"
    }

    Write-Host "Paso 6: Creando base de datos..." -ForegroundColor Yellow
    & $psqlPath -U postgres -h localhost -p 5433 -d postgres -c "CREATE DATABASE libro_resoluciones;"
    Write-Host "✅ Base de datos creada (o ya existía)" -ForegroundColor Green

    Write-Host "Paso 7: Restaurando configuración de seguridad..." -ForegroundColor Yellow
    Copy-Item "$pgDataPath\pg_hba.conf.backup" "$pgDataPath\pg_hba.conf" -Force
    Write-Host "✅ Configuración restaurada" -ForegroundColor Green

    Write-Host "Paso 8: Reiniciando servicio..." -ForegroundColor Yellow
    Restart-Service -Name "postgresql-x64-17"
    Start-Sleep -Seconds 10
    Write-Host "✅ Servicio reiniciado" -ForegroundColor Green

    Write-Host "Paso 9: Verificando conexión..." -ForegroundColor Yellow
    & $psqlPath -U postgres -h localhost -p 5433 -d libro_resoluciones -c "SELECT 'Conexión exitosa' as resultado;"
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host ""
        Write-Host "========================================" -ForegroundColor Green
        Write-Host "   ✅ RESETEO COMPLETADO EXITOSAMENTE" -ForegroundColor Green
        Write-Host "========================================" -ForegroundColor Green
        Write-Host ""
        Write-Host "Configuración PostgreSQL:" -ForegroundColor Cyan
        Write-Host "- Usuario: postgres" -ForegroundColor White
        Write-Host "- Contraseña: admin123" -ForegroundColor White
        Write-Host "- Host: localhost" -ForegroundColor White
        Write-Host "- Puerto: 5433" -ForegroundColor White
        Write-Host "- Base de datos: libro_resoluciones" -ForegroundColor White
        Write-Host ""
        Write-Host "Próximos pasos:" -ForegroundColor Yellow
        Write-Host "1. cd server" -ForegroundColor White
        Write-Host "2. npm run setup-postgres" -ForegroundColor White
        Write-Host "3. npm run dev" -ForegroundColor White
    } else {
        throw "Error en la verificación final"
    }

} catch {
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Red
    Write-Host "   ❌ ERROR EN EL PROCESO" -ForegroundColor Red
    Write-Host "========================================" -ForegroundColor Red
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host ""
    Write-Host "Alternativa manual:" -ForegroundColor Yellow
    Write-Host "1. Abre pgAdmin" -ForegroundColor White
    Write-Host "2. Usa la contraseña establecida en la instalación" -ForegroundColor White
    Write-Host "3. Cambia la contraseña a 'admin123'" -ForegroundColor White
} finally {
    # Limpiar archivos temporales
    Remove-Item "$pgDataPath\pg_hba.conf.backup" -ErrorAction SilentlyContinue
}

Write-Host ""
Read-Host "Presiona Enter para salir"
