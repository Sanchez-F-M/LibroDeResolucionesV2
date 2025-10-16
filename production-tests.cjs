const axios = require('axios');
const { performance } = require('perf_hooks');

// Configuración de URLs de producción
const BACKEND_URL = 'https://libroderesoluciones-api.onrender.com';
const FRONTEND_URL = 'https://libro-de-resoluciones-v2-9izd-fe0i5ihfg.vercel.app';

// Configuración de pruebas
const TEST_CONFIG = {
    timeout: 30000,
    retries: 3,
    performanceThreshold: {
        fast: 1000,
        acceptable: 3000,
        slow: 5000
    }
};

// Utilidades para pruebas
class TestRunner {
    constructor() {
        this.results = {
            passed: 0,
            failed: 0,
            warnings: 0,
            total: 0,
            tests: []
        };
    }

    async runTest(testName, testFunction, category = 'General') {
        const startTime = performance.now();
        console.log(`\n🧪 Ejecutando: ${testName}`);
        
        try {
            const result = await testFunction();
            const endTime = performance.now();
            const duration = Math.round(endTime - startTime);
            
            this.results.passed++;
            this.results.total++;
            
            const performanceStatus = this.getPerformanceStatus(duration);
            
            console.log(`✅ ${testName} - PASSED (${duration}ms) ${performanceStatus}`);
            
            this.results.tests.push({
                name: testName,
                category,
                status: 'PASSED',
                duration,
                result,
                timestamp: new Date().toISOString()
            });
            
            return { success: true, duration, result };
        } catch (error) {
            const endTime = performance.now();
            const duration = Math.round(endTime - startTime);
            
            this.results.failed++;
            this.results.total++;
            
            console.log(`❌ ${testName} - FAILED (${duration}ms)`);
            console.log(`   Error: ${error.message}`);
            
            this.results.tests.push({
                name: testName,
                category,
                status: 'FAILED',
                duration,
                error: error.message,
                timestamp: new Date().toISOString()
            });
            
            return { success: false, duration, error: error.message };
        }
    }

    getPerformanceStatus(duration) {
        if (duration < TEST_CONFIG.performanceThreshold.fast) {
            return '⚡ Rápido';
        } else if (duration < TEST_CONFIG.performanceThreshold.acceptable) {
            return '✅ Aceptable';
        } else if (duration < TEST_CONFIG.performanceThreshold.slow) {
            return '⚠️ Lento';
        } else {
            return '🐌 Muy Lento';
        }
    }

    generateReport() {
        const successRate = ((this.results.passed / this.results.total) * 100).toFixed(1);
        
        console.log('\n' + '='.repeat(60));
        console.log('📊 REPORTE FINAL DE PRUEBAS DE PRODUCCIÓN');
        console.log('='.repeat(60));
        console.log(`📈 Pruebas ejecutadas: ${this.results.total}`);
        console.log(`✅ Exitosas: ${this.results.passed}`);
        console.log(`❌ Fallidas: ${this.results.failed}`);
        console.log(`⚠️ Advertencias: ${this.results.warnings}`);
        console.log(`🎯 Tasa de éxito: ${successRate}%`);
        
        // Agrupar pruebas por categoría
        const categories = {};
        this.results.tests.forEach(test => {
            if (!categories[test.category]) {
                categories[test.category] = { passed: 0, failed: 0, total: 0 };
            }
            categories[test.category].total++;
            if (test.status === 'PASSED') {
                categories[test.category].passed++;
            } else {
                categories[test.category].failed++;
            }
        });

        console.log('\n📋 Resultados por categoría:');
        Object.entries(categories).forEach(([category, stats]) => {
            const rate = ((stats.passed / stats.total) * 100).toFixed(1);
            console.log(`   ${category}: ${stats.passed}/${stats.total} (${rate}%)`);
        });

        return {
            summary: this.results,
            successRate: parseFloat(successRate),
            categories
        };
    }
}

// Crear instancia del runner de pruebas
const testRunner = new TestRunner();

// PRUEBAS DE INFRAESTRUCTURA
async function testBackendHealth() {
    const response = await axios.get(`${BACKEND_URL}/health`, {
        timeout: TEST_CONFIG.timeout
    });
    
    if (response.status !== 200) {
        throw new Error(`Health check failed: ${response.status}`);
    }
    
    if (!response.data.status || response.data.status !== 'healthy') {
        throw new Error(`Backend not healthy: ${JSON.stringify(response.data)}`);
    }
    
    return {
        status: response.data.status,
        uptime: response.data.uptime,
        version: response.data.version
    };
}

async function testBackendDiagnose() {
    const response = await axios.get(`${BACKEND_URL}/diagnose`, {
        timeout: TEST_CONFIG.timeout
    });
    
    if (response.status !== 200) {
        throw new Error(`Diagnose failed: ${response.status}`);
    }
    
    const data = response.data;
    if (!data.database || data.database.status !== 'connected') {
        throw new Error(`Database not connected: ${JSON.stringify(data.database)}`);
    }
    
    return {
        database: data.database,
        environment: data.environment,
        tables: data.database.tables
    };
}

async function testFrontendAvailability() {
    const response = await axios.get(FRONTEND_URL, {
        timeout: TEST_CONFIG.timeout
    });
    
    if (response.status !== 200) {
        throw new Error(`Frontend not available: ${response.status}`);
    }
    
    const html = response.data;
    const isReactApp = html.includes('React') || 
                     html.includes('Vite') || 
                     html.includes('react') || 
                     html.includes('vite') || 
                     html.includes('id="root"') ||
                     html.includes('type="module"');
    
    if (!isReactApp) {
        throw new Error('Frontend does not appear to be React/Vite app');
    }
    
    return {
        status: response.status,
        isReactApp: isReactApp,
        contentLength: html.length,
        hasRoot: html.includes('id="root"'),
        hasModule: html.includes('type="module"')
    };
}

// PRUEBAS DE AUTENTICACIÓN
async function testUserLogin() {
    const response = await axios.post(`${BACKEND_URL}/api/user/login`, {
        Nombre: 'admin',
        Contrasena: 'admin123'
    }, {
        timeout: TEST_CONFIG.timeout
    });
    
    if (response.status !== 200) {
        throw new Error(`Login failed: ${response.status}`);
    }
    
    if (!response.data.token) {
        throw new Error('No token received after login');
    }
    
    return {
        userId: response.data.user.ID,
        username: response.data.user.Nombre,
        role: response.data.user.Rol,
        hasToken: !!response.data.token,
        token: response.data.token
    };
}

async function testUserRegistration() {
    const testUser = {
        Nombre: `TestUser_${Date.now()}`,
        Contrasena: 'test123456',
        Rol: 'usuario'
    };
    
    const response = await axios.post(`${BACKEND_URL}/api/user/register`, testUser, {
        timeout: TEST_CONFIG.timeout
    });
    
    if (response.status !== 201) {
        throw new Error(`Registration failed: ${response.status}`);
    }
    
    return {
        userId: response.data.user.ID,
        username: response.data.user.Nombre,
        role: response.data.user.Rol,
        message: response.data.message
    };
}

async function testInvalidLogin() {
    try {
        await axios.post(`${BACKEND_URL}/api/user/login`, {
            Nombre: 'invaliduser',
            Contrasena: 'wrongpassword'
        }, {
            timeout: TEST_CONFIG.timeout
        });
        throw new Error('Invalid login should have failed');
    } catch (error) {
        if (error.response && error.response.status === 401) {
            return { properly_rejected: true, status: 401 };
        }
        throw error;
    }
}

// PRUEBA DE SEARCH
async function testSearchFunctionality() {
    const loginResult = await testUserLogin();
    const token = loginResult.token;
    
    const searchTests = [
        { criterion: 'NumdeResolucion', value: '1' },
        { criterion: 'Asunto', value: 'violencia' },
        { criterion: 'Referencia', value: 'genero' }
    ];
    
    const results = [];
    
    for (const searchTest of searchTests) {
        try {
            const response = await axios.post(`${BACKEND_URL}/api/search`, searchTest, {
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                timeout: TEST_CONFIG.timeout
            });
            
            results.push({
                criterion: searchTest.criterion,
                value: searchTest.value,
                status: response.status,
                results: response.data.length,
                hasDate: response.data.length > 0 && !!response.data[0].fetcha_creacion
            });
        } catch (error) {
            results.push({
                criterion: searchTest.criterion,
                value: searchTest.value,
                status: error.response?.status || 'ERROR',
                error: error.message
            });
        }
    }
    
    return { searchResults: results };
}

// PRUEBA DE API
async function testGetBooks() {
    const loginResult = await testUserLogin();
    const token = loginResult.token;
    
    const response = await axios.get(`${BACKEND_URL}/api/books`, {
        headers: {
            'Authorization': `Bearer ${token}`
        },
        timeout: TEST_CONFIG.timeout
    });
    
    if (response.status !== 200) {
        throw new Error(`Get books failed: ${response.status}`);
    }
    
    if (!Array.isArray(response.data)) {
        throw new Error('Books response is not an array');
    }
    
    return {
        count: response.data.length,
        hasBooks: response.data.length > 0,
        sampleBook: response.data[0] || null
    };
}

// PRUEBA DE CLOUDINARY
async function testCloudinaryStatus() {
    const response = await axios.get(`${BACKEND_URL}/api/cloudinary/status`, {
        timeout: TEST_CONFIG.timeout
    });
    
    if (response.status !== 200) {
        throw new Error(`Cloudinary status failed: ${response.status}`);
    }
    
    const data = response.data;
    if (!data.connected) {
        throw new Error('Cloudinary not connected');
    }
    
    return {
        connected: data.connected,
        cloudName: data.details.cloud_name,
        mode: data.mode
    };
}

// FUNCIÓN PRINCIPAL DE EJECUCIÓN
async function runProductionTests() {
    console.log('🚀 INICIANDO PRUEBAS DE PRODUCCIÓN');
    console.log('==================================');
    console.log(`🌐 Backend: ${BACKEND_URL}`);
    console.log(`🖥️ Frontend: ${FRONTEND_URL}`);
    console.log(`⏰ Timeout: ${TEST_CONFIG.timeout}ms`);
    console.log('');

    // PRUEBAS DE INFRAESTRUCTURA
    await testRunner.runTest('Backend Health Check', testBackendHealth, 'Infraestructura');
    await testRunner.runTest('Backend Diagnose', testBackendDiagnose, 'Infraestructura');
    await testRunner.runTest('Frontend Availability', testFrontendAvailability, 'Infraestructura');

    // PRUEBAS DE AUTENTICACIÓN
    await testRunner.runTest('User Login', testUserLogin, 'Autenticación');
    await testRunner.runTest('User Registration', testUserRegistration, 'Autenticación');
    await testRunner.runTest('Invalid Login Rejection', testInvalidLogin, 'Autenticación');

    // PRUEBAS DE API
    await testRunner.runTest('Get Books API', testGetBooks, 'API');
    await testRunner.runTest('Search Functionality', testSearchFunctionality, 'API');

    // PRUEBAS DE CLOUDINARY
    await testRunner.runTest('Cloudinary Status', testCloudinaryStatus, 'Cloudinary');

    // Generar reporte final
    const report = testRunner.generateReport();
    
    // Guardar reporte en archivo
    const fs = require('fs');
    const reportData = {
        timestamp: new Date().toISOString(),
        urls: {
            backend: BACKEND_URL,
            frontend: FRONTEND_URL
        },
        config: TEST_CONFIG,
        results: report
    };
    
    fs.writeFileSync('production-test-report.json', JSON.stringify(reportData, null, 2));
    
    console.log('\n📄 Reporte guardado en: production-test-report.json');
    
    return report;
}

// Ejecutar pruebas
runProductionTests().catch(console.error);
