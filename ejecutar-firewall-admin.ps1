# Script para ejecutar CONFIGURAR-FIREWALL.bat como Administrador
# Guarda este archivo como: ejecutar-firewall-admin.ps1

$scriptPath = "C:\Users\flavi\OneDrive\Escritorio\LibroDeResolucionesV2\CONFIGURAR-FIREWALL.bat"

# Verificar si ya se está ejecutando como administrador
$currentPrincipal = New-Object Security.Principal.WindowsPrincipal([Security.Principal.WindowsIdentity]::GetCurrent())
$isAdmin = $currentPrincipal.IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)

if ($isAdmin) {
    Write-Host "✓ Ejecutando como Administrador" -ForegroundColor Green
    Start-Process cmd.exe -ArgumentList "/c `"$scriptPath`"" -Wait
} else {
    Write-Host "⚠ Necesitas permisos de Administrador" -ForegroundColor Yellow
    Write-Host "Relanzando con permisos elevados..." -ForegroundColor Cyan
    
    # Relanzar como administrador
    Start-Process powershell.exe -ArgumentList "-ExecutionPolicy Bypass -File `"$PSCommandPath`"" -Verb RunAs
}
