#!/usr/bin/env node

/**
 * Validador simplificado pre-deployment para Render
 */

import fs from 'fs';
import path from 'path';

const SERVER_DIR = './server';

console.log('🔍 ========================================');
console.log('🔍 VALIDACIÓN PRE-DEPLOYMENT RENDER');
console.log('🔍 ========================================\n');

let errors = 0;
let warnings = 0;
let passed = 0;

function check(condition, message, isWarning = false) {
    if (condition) {
        console.log(`✅ ${message}`);
        passed++;
    } else {
        const icon = isWarning ? '⚠️' : '❌';
        console.log(`${icon} ${message}`);
        if (isWarning) warnings++; else errors++;
    }
}

function fileExists(filePath, description) {
    const exists = fs.existsSync(filePath);
    check(exists, `${description}: ${filePath.replace('./', '')}`);
    return exists;
}

// 1. Validar archivos principales
console.log('📁 Validando archivos principales...');
fileExists(path.join(SERVER_DIR, 'package.json'), 'Package.json existe');
fileExists(path.join(SERVER_DIR, 'index.js'), 'Archivo principal index.js');
fileExists(path.join(SERVER_DIR, 'scripts/create-admin.js'), 'Script create-admin.js');
console.log('');

// 2. Validar package.json
console.log('📦 Validando package.json...');
try {
    const pkg = JSON.parse(fs.readFileSync(path.join(SERVER_DIR, 'package.json'), 'utf8'));
    
    check(pkg.scripts?.start, 'Script "start" definido');
    check(pkg.main === 'index.js', 'Main entry point es index.js');
    check(pkg.type === 'module', 'Tipo de módulo ES configurado');
    check(pkg.engines?.node, 'Versión de Node.js especificada');
    
    // Dependencias críticas
    const criticalDeps = ['express', 'cors', 'dotenv', 'pg'];
    criticalDeps.forEach(dep => {
        check(pkg.dependencies?.[dep], `Dependencia crítica: ${dep}`);
    });
} catch (error) {
    console.log(`❌ Error leyendo package.json: ${error.message}`);
    errors++;
}
console.log('');

// 3. Validar configuración de entorno
console.log('🔧 Validando configuración de entorno...');
const indexPath = path.join(SERVER_DIR, 'index.js');
if (fs.existsSync(indexPath)) {
    const indexContent = fs.readFileSync(indexPath, 'utf8');
    
    check(indexContent.includes('process.env.PORT'), 'Configuración de PORT variable');
    check(indexContent.includes('process.env.NODE_ENV'), 'Configuración de NODE_ENV', true);
    
    // Verificar que usa la conexión PostgreSQL
    check(indexContent.includes('import db from \'./db/connection.js\''), 'Usa conexión PostgreSQL');
}

// Verificar configuración de PostgreSQL en archivo separado
const postgresPath = path.join(SERVER_DIR, 'db/postgres-connection.js');
if (fs.existsSync(postgresPath)) {
    const postgresContent = fs.readFileSync(postgresPath, 'utf8');
    check(postgresContent.includes('DATABASE_URL'), 'Configuración de DATABASE_URL en PostgreSQL');
}
console.log('');

// 4. Verificar que no hay imports problemáticos
console.log('🏗️ Validando estructura del código...');
function checkProblematicImports(dir) {
    const problematicImports = ['./verifyToken', '../verifyToken'];
    
    function scanDirectory(currentDir) {
        const items = fs.readdirSync(currentDir);
        
        items.forEach(item => {
            const fullPath = path.join(currentDir, item);
            const stat = fs.statSync(fullPath);
            
            if (stat.isDirectory() && item !== 'node_modules') {
                scanDirectory(fullPath);
            } else if (stat.isFile() && item.endsWith('.js')) {
                const content = fs.readFileSync(fullPath, 'utf8');
                problematicImports.forEach(imp => {
                    if (content.includes(imp)) {
                        console.log(`❌ Import problemático (${imp}) encontrado en ${fullPath}`);
                        errors++;
                    }
                });
            }
        });
    }
    
    scanDirectory(dir);
}

checkProblematicImports(SERVER_DIR);
check(true, 'Estructura de código validada');
console.log('');

// 5. Resultado final
console.log('📊 ========================================');
console.log('📊 RESULTADO FINAL');
console.log('📊 ========================================\n');

const total = passed + warnings + errors;
const successRate = (passed / total) * 100;

console.log(`✅ Validaciones exitosas: ${passed}`);
console.log(`⚠️ Advertencias: ${warnings}`);
console.log(`❌ Errores críticos: ${errors}`);
console.log(`📈 Tasa de éxito: ${successRate.toFixed(1)}%\n`);

if (errors === 0) {
    console.log('🎉 ¡LISTO PARA DEPLOYMENT EN RENDER!');
    console.log('\n📋 PRÓXIMOS PASOS:');
    console.log('   1. Ir a https://dashboard.render.com/');
    console.log('   2. Crear nuevo "Web Service"');
    console.log('   3. Conectar repositorio GitHub');
    console.log('   4. Configurar:');
    console.log('      - Root Directory: server');
    console.log('      - Build Command: npm install');
    console.log('      - Start Command: npm start');
    console.log('   5. Configurar variables de entorno');
    console.log('   6. Desplegar');
    console.log('\n🔗 Ver guía completa en: RENDER_DEPLOYMENT_GUIDE.md');
} else {
    console.log('🚫 NO LISTO PARA DEPLOYMENT');
    console.log('🔧 Corregir errores críticos antes de continuar');
}

process.exit(errors === 0 ? 0 : 1);
