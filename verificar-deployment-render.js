#!/usr/bin/env node

/**
 * Script para verificar el estado del deployment en Render
 * Monitorea la salud del backend y reporta si los fixes han funcionado
 */

import https from 'https';
import http from 'http';

const CONFIG = {
    // URLs que deberían estar funcionando en Render
    RENDER_BACKEND: 'https://libroderresolucionesv2-backend.onrender.com',
    LOCAL_BACKEND: 'http://localhost:10000',
    
    // Endpoints críticos a verificar
    ENDPOINTS: [
        '/health',
        '/api/health',
        '/',
        '/api/auth/validate'
    ],
    
    TIMEOUT: 10000 // 10 segundos
};

class RenderDeploymentVerifier {
    constructor() {
        this.results = {
            timestamp: new Date().toISOString(),
            deployment_status: 'unknown',
            endpoints_tested: 0,
            endpoints_working: 0,
            errors: [],
            fixes_verified: []
        };
    }

    async makeRequest(url, timeout = CONFIG.TIMEOUT) {
        return new Promise((resolve) => {
            const isHttps = url.startsWith('https://');
            const client = isHttps ? https : http;
            
            const request = client.get(url, { timeout }, (res) => {
                let data = '';
                res.on('data', chunk => data += chunk);
                res.on('end', () => {
                    resolve({
                        success: true,
                        status: res.statusCode,
                        headers: res.headers,
                        data: data,
                        responseTime: Date.now() - startTime
                    });
                });
            });

            const startTime = Date.now();
            
            request.on('error', (error) => {
                resolve({
                    success: false,
                    error: error.message,
                    code: error.code,
                    responseTime: Date.now() - startTime
                });
            });

            request.setTimeout(timeout, () => {
                request.destroy();
                resolve({
                    success: false,
                    error: 'Timeout',
                    responseTime: timeout
                });
            });
        });
    }

    async verifyEndpoint(baseUrl, endpoint) {
        const url = `${baseUrl}${endpoint}`;
        console.log(`🔍 Verificando: ${url}`);
        
        this.results.endpoints_tested++;
        const result = await this.makeRequest(url);
        
        if (result.success) {
            this.results.endpoints_working++;
            console.log(`✅ ${endpoint}: Status ${result.status} (${result.responseTime}ms)`);
            
            // Verificar headers de seguridad (fixes aplicados)
            if (result.headers) {
                this.checkSecurityHeaders(result.headers, endpoint);
            }
            
            return result;
        } else {
            console.log(`❌ ${endpoint}: ${result.error} (${result.responseTime}ms)`);
            this.results.errors.push({
                endpoint: endpoint,
                url: url,
                error: result.error,
                code: result.code
            });
            return result;
        }
    }

    checkSecurityHeaders(headers, endpoint) {
        const securityHeaders = [
            'x-content-type-options',
            'x-frame-options', 
            'x-xss-protection',
            'strict-transport-security'
        ];

        const foundHeaders = [];
        securityHeaders.forEach(header => {
            if (headers[header]) {
                foundHeaders.push(header);
            }
        });

        if (foundHeaders.length > 0) {
            this.results.fixes_verified.push({
                endpoint: endpoint,
                security_headers: foundHeaders,
                description: 'Headers de seguridad implementados correctamente'
            });
        }
    }

    async verifyRenderDeployment() {
        console.log('🚀 ========================================');
        console.log('🚀 VERIFICACIÓN DEPLOYMENT EN RENDER');
        console.log('🚀 ========================================\n');
        
        console.log(`📅 Timestamp: ${this.results.timestamp}`);
        console.log(`🔗 Backend URL: ${CONFIG.RENDER_BACKEND}\n`);

        // Verificar cada endpoint
        for (const endpoint of CONFIG.ENDPOINTS) {
            await this.verifyEndpoint(CONFIG.RENDER_BACKEND, endpoint);
            await new Promise(resolve => setTimeout(resolve, 1000)); // Pausa entre requests
        }

        // Determinar estado general
        const successRate = (this.results.endpoints_working / this.results.endpoints_tested) * 100;
        
        if (successRate >= 75) {
            this.results.deployment_status = 'success';
            console.log(`\n🎉 DEPLOYMENT EXITOSO: ${successRate.toFixed(1)}% endpoints funcionando`);
        } else if (successRate >= 25) {
            this.results.deployment_status = 'partial';
            console.log(`\n⚠️ DEPLOYMENT PARCIAL: ${successRate.toFixed(1)}% endpoints funcionando`);
        } else {
            this.results.deployment_status = 'failed';
            console.log(`\n❌ DEPLOYMENT FALLIDO: ${successRate.toFixed(1)}% endpoints funcionando`);
        }

        // Mostrar fixes verificados
        if (this.results.fixes_verified.length > 0) {
            console.log('\n✅ FIXES VERIFICADOS:');
            this.results.fixes_verified.forEach(fix => {
                console.log(`   • ${fix.endpoint}: ${fix.description}`);
                if (fix.security_headers) {
                    console.log(`     Headers: ${fix.security_headers.join(', ')}`);
                }
            });
        }

        // Mostrar errores
        if (this.results.errors.length > 0) {
            console.log('\n❌ ERRORES ENCONTRADOS:');
            this.results.errors.forEach(error => {
                console.log(`   • ${error.endpoint}: ${error.error}`);
            });
        }

        return this.results;
    }

    async verifyLocalEnvironment() {
        console.log('\n🏠 ========================================');
        console.log('🏠 VERIFICACIÓN ENTORNO LOCAL');
        console.log('🏠 ========================================\n');

        for (const endpoint of ['/health', '/']) {
            await this.verifyEndpoint(CONFIG.LOCAL_BACKEND, endpoint);
        }
    }    async generateReport() {
        const reportPath = 'render-deployment-verification.json';
        const fs = await import('fs');
        
        fs.writeFileSync(reportPath, JSON.stringify(this.results, null, 2));
        console.log(`\n📋 Reporte guardado en: ${reportPath}`);
        
        return reportPath;
    }
}

// Ejecutar verificación
async function main() {
    const verifier = new RenderDeploymentVerifier();
    
    try {
        // Verificar Render deployment
        await verifier.verifyRenderDeployment();
        
        // Verificar entorno local (opcional)
        const args = process.argv.slice(2);
        if (args.includes('--local')) {
            await verifier.verifyLocalEnvironment();
        }
        
        // Generar reporte
        await verifier.generateReport();
        
        console.log('\n📖 Ejecutar con --local para verificar también el entorno local');
        console.log('📖 Ejemplo: node verificar-deployment-render.js --local');
        
    } catch (error) {
        console.error('\n❌ Error durante la verificación:', error.message);
        process.exit(1);
    }
}

if (import.meta.url === `file://${process.argv[1]}`) {
    main();
}

export default RenderDeploymentVerifier;
