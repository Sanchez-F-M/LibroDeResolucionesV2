#!/bin/bash

echo "🧹 LIMPIEZA COMPLETA DEL PROYECTO"
echo "=================================="
echo ""

# Contador de archivos eliminados
count=0

# Lista de archivos y directorios a eliminar
files_to_delete=(
    # Scripts de configuración y diagnóstico
    "*.sh"
    "cargar-datos-*.js"
    "crear-*.js"
    "crear-*.sh"
    "diagnosticar-*.js"
    "diagnostico-*.js"
    "diagnostico-*.sh"
    "despertar-backend.js"
    "probar-*.js"
    "prueba-*.js"
    "reparar-*.js"
    "reparar-*.sh"
    "test-*.js"
    "test-*.sh"
    "verificar-*.js"
    "verificar-*.sh"
    "verificacion-*.js"
    "verificacion-*.sh"
    
    # Documentos de configuración y estado
    "*.md"
    "*.pdf"
    "*.txt"
    
    # Archivos de datos temporales
    "*.json" # Excepto package.json
    "*.log"
    "*.bat"
    "*.ps1"
    
    # Directorios temporales
    "resultados_*"
    "uploads_temp"
)

# Preservar archivos importantes
preserve_files=(
    "package.json"
    "package-lock.json"
    ".gitignore"
    "README.md"
)

echo "📋 Archivos y directorios a preservar:"
for file in "${preserve_files[@]}"; do
    if [ -f "$file" ] || [ -d "$file" ]; then
        echo "  ✅ $file"
    fi
done
echo ""

echo "🗑️  Eliminando archivos no esenciales..."
echo ""

# Eliminar archivos de scripts
for pattern in "*.sh" "*.bat" "*.ps1"; do
    for file in $pattern; do
        if [ -f "$file" ]; then
            echo "  🗑️  Eliminando script: $file"
            rm "$file"
            ((count++))
        fi
    done
done

# Eliminar archivos JavaScript de diagnóstico y pruebas
for pattern in "*diagnostico*.js" "*prueba*.js" "*test*.js" "*verificar*.js" "*verificacion*.js" "*probar*.js" "*reparar*.js" "*crear-*.js" "*cargar-*.js" "despertar-backend.js"; do
    for file in $pattern; do
        if [ -f "$file" ] && [ "$file" != "package.json" ] && [ "$file" != "package-lock.json" ]; then
            echo "  🗑️  Eliminando script JS: $file"
            rm "$file"
            ((count++))
        fi
    done
done

# Eliminar documentación temporal
for pattern in "*.md" "*.pdf" "*.txt"; do
    for file in $pattern; do
        if [ -f "$file" ] && [ "$file" != "README.md" ]; then
            echo "  🗑️  Eliminando documento: $file"
            rm "$file"
            ((count++))
        fi
    done
done

# Eliminar archivos de datos temporales
for pattern in "*reporte*.json" "*datos*.json" "*resultados*.json" "*.log"; do
    for file in $pattern; do
        if [ -f "$file" ]; then
            echo "  🗑️  Eliminando archivo temporal: $file"
            rm "$file"
            ((count++))
        fi
    done
done

# Eliminar directorios temporales
for dir in resultados_*; do
    if [ -d "$dir" ]; then
        echo "  🗑️  Eliminando directorio temporal: $dir"
        rm -rf "$dir"
        ((count++))
    fi
done

echo ""
echo "✅ Limpieza completada!"
echo "📊 Total de archivos/directorios eliminados: $count"
echo ""

echo "📁 Estructura final del proyecto:"
echo "================================="
ls -la

echo ""
echo "🎯 Archivos esenciales preservados:"
echo "  ✅ server/ - Código del backend"
echo "  ✅ front/ - Código del frontend"
echo "  ✅ .git/ - Control de versiones"
echo "  ✅ .gitignore - Configuración Git"
echo "  ✅ package.json - Dependencias"
if [ -f "README.md" ]; then
    echo "  ✅ README.md - Documentación"
fi
echo ""
echo "🚀 ¡Proyecto limpio y listo para producción!"
