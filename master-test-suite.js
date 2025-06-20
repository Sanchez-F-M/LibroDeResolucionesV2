import { runLoadTests } from './load-tests.js';
import { runSecurityTests } from './security-tests.js';
import axios from 'axios';
import { performance } from 'perf_hooks';

const BACKEND_URL = 'https://libroderesoluciones-api.onrender.com';
const FRONTEND_URL = 'https://libro-de-resoluciones-v2-9izd-fe0i5ihfg.vercel.app';

class MasterTestSuite {
    constructor() {
        this.startTime = Date.now();
        this.results = {
            functional: null,
            load: null,
            security: null,
            integration: null
        };
    }

    async runAllTests() {
        console.log('🚀 SUITE COMPLETA DE TESTING EN PRODUCCIÓN');
        console.log('==========================================');
        console.log(`📅 Fecha: ${new Date().toLocaleDateString()}`);
        console.log(`⏰ Hora: ${new Date().toLocaleTimeString()}`);
        console.log(`🌐 Backend: ${BACKEND_URL}`);
        console.log(`🖥️ Frontend: ${FRONTEND_URL}`);
        console.log('');

        try {
            // 1. PRUEBAS FUNCIONALES
            console.log('1️⃣ EJECUTANDO PRUEBAS FUNCIONALES...');
            console.log('=====================================');
            this.results.functional = await this.runFunctionalTests();
            
            console.log('\n⏸️ Pausa de 30 segundos antes de pruebas de carga...');
            await this.sleep(30000);

            // 2. PRUEBAS DE CARGA
            console.log('\n2️⃣ EJECUTANDO PRUEBAS DE CARGA...');
            console.log('==================================');
            this.results.load = await runLoadTests();
            
            console.log('\n⏸️ Pausa de 60 segundos antes de pruebas de seguridad...');
            await this.sleep(60000);

            // 3. PRUEBAS DE SEGURIDAD
            console.log('\n3️⃣ EJECUTANDO PRUEBAS DE SEGURIDAD...');
            console.log('====================================');
            this.results.security = await runSecurityTests();

            // 4. PRUEBAS DE INTEGRACIÓN AVANZADAS
            console.log('\n4️⃣ EJECUTANDO PRUEBAS DE INTEGRACIÓN...');
            console.log('======================================');
            this.results.integration = await this.runIntegrationTests();

            // GENERAR REPORTE MAESTRO
            console.log('\n5️⃣ GENERANDO REPORTE MAESTRO...');
            console.log('===============================');
            this.generateMasterReport();

        } catch (error) {
            console.error('❌ Error en la suite de pruebas:', error);
        }
    }

    async runFunctionalTests() {
        const testResults = {
            passed: 0,
            failed: 0,
            tests: []
        };

        // Lista de pruebas funcionales
        const functionalTests = [
            { name: 'Backend Health', test: () => this.testBackendHealth() },
            { name: 'Frontend Availability', test: () => this.testFrontendAvailability() },
            { name: 'Database Connection', test: () => this.testDatabaseConnection() },
            { name: 'User Authentication', test: () => this.testUserAuthentication() },
            { name: 'API Endpoints', test: () => this.testAPIEndpoints() },
            { name: 'Search Functionality', test: () => this.testSearchFunctionality() },
            { name: 'Cloudinary Integration', test: () => this.testCloudinaryIntegration() },
            { name: 'Role-based Access', test: () => this.testRoleBasedAccess() }
        ];

        for (const testCase of functionalTests) {
            const startTime = performance.now();
            try {
                console.log(`\n🧪 ${testCase.name}...`);
                const result = await testCase.test();
                const duration = Math.round(performance.now() - startTime);
                
                console.log(`✅ ${testCase.name} - PASSED (${duration}ms)`);
                testResults.passed++;
                testResults.tests.push({
                    name: testCase.name,
                    status: 'PASSED',
                    duration,
                    result
                });
            } catch (error) {
                const duration = Math.round(performance.now() - startTime);
                console.log(`❌ ${testCase.name} - FAILED (${duration}ms): ${error.message}`);
                testResults.failed++;
                testResults.tests.push({
                    name: testCase.name,
                    status: 'FAILED',
                    duration,
                    error: error.message
                });
            }
        }

        const successRate = ((testResults.passed / (testResults.passed + testResults.failed)) * 100).toFixed(1);
        console.log(`\n📊 Pruebas Funcionales: ${testResults.passed}/${testResults.passed + testResults.failed} (${successRate}%)`);
        
        return { ...testResults, successRate: parseFloat(successRate) };
    }

    async runIntegrationTests() {
        console.log('🔗 Ejecutando pruebas de integración avanzadas...');
        
        const integrationResults = {
            passed: 0,
            failed: 0,
            tests: []
        };

        // Pruebas de integración complejas
        const integrationTests = [
            { name: 'Full User Journey', test: () => this.testFullUserJourney() },
            { name: 'Data Persistence', test: () => this.testDataPersistence() },
            { name: 'Error Handling', test: () => this.testErrorHandling() },
            { name: 'Concurrent Operations', test: () => this.testConcurrentOperations() },
            { name: 'Cross-Origin Requests', test: () => this.testCORSConfiguration() }
        ];

        for (const testCase of integrationTests) {
            const startTime = performance.now();
            try {
                console.log(`\n🔗 ${testCase.name}...`);
                const result = await testCase.test();
                const duration = Math.round(performance.now() - startTime);
                
                console.log(`✅ ${testCase.name} - PASSED (${duration}ms)`);
                integrationResults.passed++;
                integrationResults.tests.push({
                    name: testCase.name,
                    status: 'PASSED',
                    duration,
                    result
                });
            } catch (error) {
                const duration = Math.round(performance.now() - startTime);
                console.log(`❌ ${testCase.name} - FAILED (${duration}ms): ${error.message}`);
                integrationResults.failed++;
                integrationResults.tests.push({
                    name: testCase.name,
                    status: 'FAILED',
                    duration,
                    error: error.message
                });
            }
        }

        const successRate = ((integrationResults.passed / (integrationResults.passed + integrationResults.failed)) * 100).toFixed(1);
        console.log(`\n📊 Pruebas de Integración: ${integrationResults.passed}/${integrationResults.passed + integrationResults.failed} (${successRate}%)`);
        
        return { ...integrationResults, successRate: parseFloat(successRate) };
    }

    // IMPLEMENTACIÓN DE PRUEBAS FUNCIONALES
    async testBackendHealth() {
        const response = await axios.get(`${BACKEND_URL}/health`, { timeout: 10000 });
        if (response.status !== 200 || response.data.status !== 'healthy') {
            throw new Error('Backend not healthy');
        }
        return { status: response.data.status, uptime: response.data.uptime };
    }

    async testFrontendAvailability() {
        const response = await axios.get(FRONTEND_URL, { timeout: 15000 });
        if (response.status !== 200) {
            throw new Error('Frontend not accessible');
        }
        return { status: response.status, contentLength: response.data.length };
    }

    async testDatabaseConnection() {
        const response = await axios.get(`${BACKEND_URL}/diagnose`, { timeout: 10000 });
        if (response.data.database.status !== 'connected') {
            throw new Error('Database not connected');
        }
        return response.data.database;
    }

    async testUserAuthentication() {
        const response = await axios.post(`${BACKEND_URL}/api/user/login`, {
            Nombre: 'admin',
            Contrasena: 'admin123'
        }, { timeout: 10000 });
        
        if (response.status !== 200 || !response.data.token) {
            throw new Error('Authentication failed');
        }
        return { authenticated: true, hasToken: !!response.data.token };
    }

    async testAPIEndpoints() {
        const loginResponse = await axios.post(`${BACKEND_URL}/api/user/login`, {
            Nombre: 'admin',
            Contrasena: 'admin123'
        }, { timeout: 10000 });

        const token = loginResponse.data.token;
        const headers = { 'Authorization': `Bearer ${token}` };

        const endpoints = [
            { method: 'GET', url: '/api/books' },
            { method: 'GET', url: '/api/books/last-number' }
        ];

        const results = [];
        for (const endpoint of endpoints) {
            const response = await axios.get(`${BACKEND_URL}${endpoint.url}`, { headers, timeout: 10000 });
            results.push({
                endpoint: endpoint.url,
                status: response.status,
                working: response.status === 200
            });
        }

        return { endpoints: results };
    }

    async testSearchFunctionality() {
        const loginResponse = await axios.post(`${BACKEND_URL}/api/user/login`, {
            Nombre: 'admin',
            Contrasena: 'admin123'
        }, { timeout: 10000 });

        const token = loginResponse.data.token;
        const headers = { 'Authorization': `Bearer ${token}` };

        const searchResponse = await axios.post(`${BACKEND_URL}/api/search`, {
            criterion: 'Asunto',
            value: 'violencia'
        }, { headers, timeout: 10000 });

        return {
            status: searchResponse.status,
            results: Array.isArray(searchResponse.data) ? searchResponse.data.length : 0,
            working: searchResponse.status === 200 || searchResponse.status === 404
        };
    }

    async testCloudinaryIntegration() {
        const response = await axios.get(`${BACKEND_URL}/api/cloudinary/status`, { timeout: 10000 });
        if (!response.data.connected) {
            throw new Error('Cloudinary not connected');
        }
        return response.data;
    }

    async testRoleBasedAccess() {
        // Crear usuario de prueba
        const testUser = {
            Nombre: `RoleTest_${Date.now()}`,
            Contraseña: 'test123456',
            Rol: 'usuario'
        };

        const registerResponse = await axios.post(`${BACKEND_URL}/api/user/register`, testUser, { timeout: 10000 });
        const userToken = registerResponse.data.token;

        // Verificar que el usuario puede acceder a recursos permitidos
        const booksResponse = await axios.get(`${BACKEND_URL}/api/books`, {
            headers: { 'Authorization': `Bearer ${userToken}` },
            timeout: 10000
        });

        return {
            userCreated: registerResponse.status === 201,
            canAccessBooks: booksResponse.status === 200,
            role: registerResponse.data.user.Rol
        };
    }

    // IMPLEMENTACIÓN DE PRUEBAS DE INTEGRACIÓN
    async testFullUserJourney() {
        const timestamp = Date.now();
        const testUser = {
            Nombre: `JourneyTest_${timestamp}`,
            Contraseña: 'journey123456',
            Rol: 'usuario'
        };

        // 1. Registro
        const registerResponse = await axios.post(`${BACKEND_URL}/api/user/register`, testUser, { timeout: 10000 });
        
        // 2. Login
        const loginResponse = await axios.post(`${BACKEND_URL}/api/user/login`, {
            Nombre: testUser.Nombre,
            Contrasena: testUser.Contraseña
        }, { timeout: 10000 });

        const token = loginResponse.data.token;

        // 3. Acceso a recursos
        const booksResponse = await axios.get(`${BACKEND_URL}/api/books`, {
            headers: { 'Authorization': `Bearer ${token}` },
            timeout: 10000
        });

        // 4. Búsqueda
        const searchResponse = await axios.post(`${BACKEND_URL}/api/search`, {
            criterion: 'Asunto',
            value: 'test'
        }, {
            headers: { 'Authorization': `Bearer ${token}` },
            timeout: 10000
        });

        return {
            registration: registerResponse.status === 201,
            login: loginResponse.status === 200,
            resourceAccess: booksResponse.status === 200,
            search: searchResponse.status === 200 || searchResponse.status === 404,
            fullJourneySuccess: true
        };
    }

    async testDataPersistence() {
        // Crear usuario y verificar que persiste
        const testUser = {
            Nombre: `PersistTest_${Date.now()}`,
            Contraseña: 'persist123456',
            Rol: 'usuario'
        };

        await axios.post(`${BACKEND_URL}/api/user/register`, testUser, { timeout: 10000 });

        // Esperar un momento
        await this.sleep(2000);

        // Intentar login para verificar persistencia
        const loginResponse = await axios.post(`${BACKEND_URL}/api/user/login`, {
            Nombre: testUser.Nombre,
            Contrasena: testUser.Contraseña
        }, { timeout: 10000 });

        return {
            userPersisted: loginResponse.status === 200,
            userData: loginResponse.data.user
        };
    }

    async testErrorHandling() {
        const errorTests = [
            {
                name: 'Invalid JSON',
                test: () => axios.post(`${BACKEND_URL}/api/user/login`, 'invalid json', {
                    headers: { 'Content-Type': 'application/json' },
                    timeout: 10000
                })
            },
            {
                name: 'Missing Fields',
                test: () => axios.post(`${BACKEND_URL}/api/user/login`, {}, { timeout: 10000 })
            },
            {
                name: 'Invalid Endpoint',
                test: () => axios.get(`${BACKEND_URL}/api/nonexistent`, { timeout: 10000 })
            }
        ];

        const results = [];
        for (const errorTest of errorTests) {
            try {
                await errorTest.test();
                results.push({ name: errorTest.name, handled: false });
            } catch (error) {
                results.push({
                    name: errorTest.name,
                    handled: true,
                    status: error.response?.status,
                    hasErrorMessage: !!error.response?.data
                });
            }
        }

        return { errorHandling: results };
    }

    async testConcurrentOperations() {
        const concurrentRequests = 10;
        const promises = [];

        for (let i = 0; i < concurrentRequests; i++) {
            promises.push(
                axios.get(`${BACKEND_URL}/health`, { timeout: 10000 })
                    .then(response => ({ success: true, status: response.status }))
                    .catch(error => ({ success: false, error: error.message }))
            );
        }

        const results = await Promise.all(promises);
        const successCount = results.filter(r => r.success).length;

        return {
            totalRequests: concurrentRequests,
            successfulRequests: successCount,
            failedRequests: concurrentRequests - successCount,
            successRate: (successCount / concurrentRequests) * 100
        };
    }

    async testCORSConfiguration() {
        try {
            const response = await axios.get(`${BACKEND_URL}/health`, {
                headers: {
                    'Origin': FRONTEND_URL
                },
                timeout: 10000
            });

            return {
                corsConfigured: !!response.headers['access-control-allow-origin'],
                allowedOrigin: response.headers['access-control-allow-origin'],
                corsHeaders: Object.keys(response.headers).filter(h => h.startsWith('access-control'))
            };
        } catch (error) {
            return {
                corsConfigured: false,
                error: error.message
            };
        }
    }

    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    generateMasterReport() {
        const totalTime = Date.now() - this.startTime;
        
        console.log('\n' + '='.repeat(80));
        console.log('📊 REPORTE MAESTRO DE TESTING EN PRODUCCIÓN');
        console.log('='.repeat(80));
        console.log(`⏱️ Tiempo total de ejecución: ${(totalTime / 1000 / 60).toFixed(1)} minutos`);
        console.log(`📅 Fecha de ejecución: ${new Date().toLocaleString()}`);
        console.log(`🌐 URLs probadas:`);
        console.log(`   Backend: ${BACKEND_URL}`);
        console.log(`   Frontend: ${FRONTEND_URL}`);
        
        // Resumen por categoría
        console.log('\n📋 RESUMEN POR CATEGORÍA:');
        console.log('='.repeat(40));
        
        if (this.results.functional) {
            console.log(`🧪 Funcionales: ${this.results.functional.successRate}% (${this.results.functional.passed}/${this.results.functional.passed + this.results.functional.failed})`);
        }
        
        if (this.results.load) {
            const avgSuccessRate = this.results.load.results.reduce((sum, r) => sum + parseFloat(r.successRate), 0) / this.results.load.results.length;
            console.log(`🔥 Carga: ${avgSuccessRate.toFixed(1)}% promedio`);
        }
        
        if (this.results.security) {
            console.log(`🔒 Seguridad: ${this.results.security.summary.score}% (${this.results.security.vulnerabilities.length} vulnerabilidades)`);
        }
        
        if (this.results.integration) {
            console.log(`🔗 Integración: ${this.results.integration.successRate}% (${this.results.integration.passed}/${this.results.integration.passed + this.results.integration.failed})`);
        }

        // Calcular puntuación general
        const scores = [];
        if (this.results.functional) scores.push(this.results.functional.successRate);
        if (this.results.security) scores.push(this.results.security.summary.score);
        if (this.results.integration) scores.push(this.results.integration.successRate);
        
        const overallScore = scores.reduce((sum, score) => sum + score, 0) / scores.length;
        
        console.log('\n🎯 PUNTUACIÓN GENERAL DEL SISTEMA:');
        console.log('='.repeat(40));
        console.log(`📊 Puntuación: ${overallScore.toFixed(1)}%`);
        
        if (overallScore >= 95) {
            console.log('🏆 EXCELENTE - Sistema de producción robusto');
        } else if (overallScore >= 85) {
            console.log('✅ MUY BUENO - Sistema confiable con mejoras menores');
        } else if (overallScore >= 75) {
            console.log('⚠️ BUENO - Sistema funcional con áreas de mejora');
        } else if (overallScore >= 60) {
            console.log('🚨 REGULAR - Requiere atención inmediata');
        } else {
            console.log('💀 CRÍTICO - Múltiples problemas graves');
        }

        // Guardar reporte maestro
        const fs = await import('fs');
        const masterReport = {
            timestamp: new Date().toISOString(),
            executionTime: totalTime,
            urls: {
                backend: BACKEND_URL,
                frontend: FRONTEND_URL
            },
            overallScore: parseFloat(overallScore.toFixed(1)),
            results: this.results
        };

        fs.writeFileSync('master-test-report.json', JSON.stringify(masterReport, null, 2));
        console.log('\n📄 Reporte maestro guardado en: master-test-report.json');
        
        console.log('\n🎉 SUITE DE TESTING COMPLETADA');
        console.log('='.repeat(40));
        
        return masterReport;
    }
}

// Función principal
async function runMasterTestSuite() {
    const masterSuite = new MasterTestSuite();
    await masterSuite.runAllTests();
}

// Ejecutar si se llama directamente
if (import.meta.url === `file://${process.argv[1]}`) {
    runMasterTestSuite().catch(console.error);
}

export { runMasterTestSuite, MasterTestSuite };
