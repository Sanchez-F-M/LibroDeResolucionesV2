#!/usr/bin/env node

/**
 * Validador pre-deployment para Render
 * Verifica que todos los archivos y configuraciones están listos
 */

import fs from 'fs';
import path from 'path';

const SERVER_DIR = './server';

class RenderDeploymentValidator {
    constructor() {
        this.errors = [];
        this.warnings = [];
        this.passed = [];
    }

    check(condition, message, isWarning = false) {
        if (condition) {
            this.passed.push(`✅ ${message}`);
        } else {
            const array = isWarning ? this.warnings : this.errors;
            const icon = isWarning ? '⚠️' : '❌';
            array.push(`${icon} ${message}`);
        }
    }

    fileExists(filePath, description) {
        const exists = fs.existsSync(filePath);
        this.check(exists, `${description}: ${filePath}`);
        return exists;
    }

    validatePackageJson() {
        console.log('📦 Validando package.json...');
        
        const packagePath = path.join(SERVER_DIR, 'package.json');
        if (!this.fileExists(packagePath, 'Package.json existe')) return;

        try {
            const pkg = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
            
            this.check(pkg.scripts?.start, 'Script "start" definido');
            this.check(pkg.main === 'index.js', 'Main entry point es index.js');
            this.check(pkg.type === 'module', 'Tipo de módulo ES configurado');
            this.check(pkg.engines?.node, 'Versión de Node.js especificada');
            
            // Dependencias críticas
            const criticalDeps = ['express', 'cors', 'dotenv', 'pg'];
            criticalDeps.forEach(dep => {
                this.check(pkg.dependencies?.[dep], `Dependencia crítica: ${dep}`, false);
            });

        } catch (error) {
            this.errors.push(`❌ Error leyendo package.json: ${error.message}`);
        }
    }

    validateMainFiles() {
        console.log('📁 Validando archivos principales...');
        
        this.fileExists(path.join(SERVER_DIR, 'index.js'), 'Archivo principal index.js');
        this.fileExists(path.join(SERVER_DIR, 'scripts/create-admin.js'), 'Script create-admin.js');
        this.fileExists(path.join(SERVER_DIR, 'config'), 'Directorio config');
        this.fileExists(path.join(SERVER_DIR, 'src'), 'Directorio src');
    }

    validateEnvironmentTemplate() {
        console.log('🔧 Validando configuración de entorno...');
        
        const envExample = path.join(SERVER_DIR, '.env.example');
        this.fileExists(envExample, 'Archivo .env.example', true);
        
        // Verificar variables críticas en index.js
        const indexPath = path.join(SERVER_DIR, 'index.js');
        if (fs.existsSync(indexPath)) {
            const indexContent = fs.readFileSync(indexPath, 'utf8');
            
            this.check(indexContent.includes('process.env.PORT'), 'Configuración de PORT variable');
            this.check(indexContent.includes('process.env.DATABASE_URL'), 'Configuración de DATABASE_URL');
            this.check(indexContent.includes('process.env.NODE_ENV'), 'Configuración de NODE_ENV', true);
        }
    }

    validateCodeStructure() {
        console.log('🏗️ Validando estructura del código...');
        
        // Verificar que no hay imports problemáticos
        const problematicImports = ['./verifyToken', '../verifyToken'];
        const jsFiles = this.getJsFiles(SERVER_DIR);
        
        jsFiles.forEach(file => {
            const content = fs.readFileSync(file, 'utf8');
            problematicImports.forEach(imp => {
                this.check(!content.includes(imp), `Sin imports problemáticos (${imp}) en ${file}`);
            });
        });
    }

    getJsFiles(dir) {
        const files = [];
        const items = fs.readdirSync(dir);
        
        items.forEach(item => {
            const fullPath = path.join(dir, item);
            const stat = fs.statSync(fullPath);
            
            if (stat.isDirectory() && item !== 'node_modules') {
                files.push(...this.getJsFiles(fullPath));
            } else if (stat.isFile() && item.endsWith('.js')) {
                files.push(fullPath);
            }
        });
        
        return files;
    }    validateGitStatus() {
        console.log('📝 Validando estado de Git...');
        
        try {
            import('child_process').then(({ execSync }) => {
                // Verificar que estamos en un repo git
                execSync('git status', { stdio: 'pipe' });
                this.passed.push('✅ Repositorio Git válido');
                
                // Verificar último commit
                const lastCommit = execSync('git log -1 --oneline', { encoding: 'utf8' }).trim();
                this.passed.push(`✅ Último commit: ${lastCommit.substring(0, 50)}...`);
            }).catch(() => {
                this.warnings.push('⚠️ No se pudo verificar estado de Git');
            });
            
        } catch (error) {
            this.warnings.push('⚠️ No se pudo verificar estado de Git');
        }
    }
        }
    }

    generateReport() {
        console.log('\\n🎯 ========================================');
        console.log('🎯 REPORTE DE VALIDACIÓN PARA RENDER');
        console.log('🎯 ========================================\\n');
        
        if (this.passed.length > 0) {
            console.log('✅ VALIDACIONES EXITOSAS:');
            this.passed.forEach(msg => console.log(`   ${msg}`));
            console.log('');
        }
        
        if (this.warnings.length > 0) {
            console.log('⚠️ ADVERTENCIAS:');
            this.warnings.forEach(msg => console.log(`   ${msg}`));
            console.log('');
        }
        
        if (this.errors.length > 0) {
            console.log('❌ ERRORES CRÍTICOS:');
            this.errors.forEach(msg => console.log(`   ${msg}`));
            console.log('');
        }
        
        // Resultado final
        const totalChecks = this.passed.length + this.warnings.length + this.errors.length;
        const successRate = (this.passed.length / totalChecks) * 100;
        
        console.log('📊 RESULTADO FINAL:');
        if (this.errors.length === 0) {
            console.log('🎉 ¡LISTO PARA DEPLOYMENT EN RENDER!');
            console.log(`✅ ${successRate.toFixed(1)}% de validaciones exitosas`);
            console.log('\\n📋 PRÓXIMOS PASOS:');
            console.log('   1. Crear Web Service en https://dashboard.render.com/');
            console.log('   2. Conectar repositorio GitHub');
            console.log('   3. Configurar variables de entorno');
            console.log('   4. Desplegar y verificar');
        } else {
            console.log('🚫 NO LISTO PARA DEPLOYMENT');
            console.log(`❌ ${this.errors.length} errores críticos deben ser corregidos`);
            console.log('\\n🔧 CORREGIR ERRORES ANTES DE CONTINUAR');
        }
        
        return this.errors.length === 0;
    }

    async validate() {
        console.log('🔍 Iniciando validación pre-deployment para Render...\\n');
        
        this.validatePackageJson();
        this.validateMainFiles();
        this.validateEnvironmentTemplate();
        this.validateCodeStructure();
        this.validateGitStatus();
        
        return this.generateReport();
    }
}

// Ejecutar validación
async function main() {
    const validator = new RenderDeploymentValidator();
    const isReady = await validator.validate();
    
    process.exit(isReady ? 0 : 1);
}

if (import.meta.url === `file://${process.argv[1]}`) {
    main();
}

export default RenderDeploymentValidator;
