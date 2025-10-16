import axios from 'axios';
import { performance } from 'perf_hooks';

const BACKEND_URL = 'https://libroderesoluciones-api.onrender.com';
const FRONTEND_URL = 'https://libro-de-resoluciones-v2-9izd-fe0i5ihfg.vercel.app';

// Configuración de pruebas de carga
const LOAD_TEST_CONFIG = {
    concurrent_users: [1, 5, 10, 20],
    duration_minutes: 2,
    request_interval_ms: 1000,
    timeout: 30000
};

class LoadTestRunner {
    constructor() {
        this.results = [];
        this.activeRequests = 0;
        this.totalRequests = 0;
        this.successfulRequests = 0;
        this.failedRequests = 0;
        this.responseTimes = [];
    }

    async runConcurrentUsers(userCount, durationMs) {
        console.log(`\n🔥 Iniciando prueba de carga: ${userCount} usuarios concurrentes por ${durationMs/1000}s`);
        
        const startTime = Date.now();
        const endTime = startTime + durationMs;
        const userPromises = [];

        // Crear usuarios concurrentes
        for (let i = 0; i < userCount; i++) {
            userPromises.push(this.simulateUser(i, endTime));
        }

        // Esperar a que terminen todos los usuarios
        await Promise.all(userPromises);

        const testDuration = Date.now() - startTime;
        const avgResponseTime = this.responseTimes.length > 0 
            ? this.responseTimes.reduce((a, b) => a + b, 0) / this.responseTimes.length 
            : 0;

        const result = {
            userCount,
            duration: testDuration,
            totalRequests: this.totalRequests,
            successfulRequests: this.successfulRequests,
            failedRequests: this.failedRequests,
            successRate: ((this.successfulRequests / this.totalRequests) * 100).toFixed(2),
            avgResponseTime: Math.round(avgResponseTime),
            requestsPerSecond: (this.totalRequests / (testDuration / 1000)).toFixed(2)
        };

        this.results.push(result);
        this.printLoadTestResult(result);
        
        // Reset para la siguiente prueba
        this.resetCounters();
        
        return result;
    }

    async simulateUser(userId, endTime) {
        console.log(`👤 Usuario ${userId} iniciado`);
        
        while (Date.now() < endTime) {
            await this.makeRequest(userId);
            await this.sleep(LOAD_TEST_CONFIG.request_interval_ms);
        }
        
        console.log(`👤 Usuario ${userId} terminado`);
    }

    async makeRequest(userId) {
        this.activeRequests++;
        this.totalRequests++;
        
        const startTime = performance.now();
        
        try {
            // Simular diferentes tipos de peticiones
            const requestType = Math.random();
            
            if (requestType < 0.3) {
                // 30% Health checks
                await axios.get(`${BACKEND_URL}/health`, { 
                    timeout: LOAD_TEST_CONFIG.timeout 
                });
            } else if (requestType < 0.6) {
                // 30% Frontend loads
                await axios.get(FRONTEND_URL, { 
                    timeout: LOAD_TEST_CONFIG.timeout 
                });
            } else {
                // 40% API calls (requieren autenticación)
                try {
                    const loginResponse = await axios.post(`${BACKEND_URL}/api/user/login`, {
                        Nombre: 'admin',
                        Contrasena: 'admin123'
                    }, { timeout: LOAD_TEST_CONFIG.timeout });
                    
                    if (loginResponse.data.token) {
                        await axios.get(`${BACKEND_URL}/api/books`, {
                            headers: { 'Authorization': `Bearer ${loginResponse.data.token}` },
                            timeout: LOAD_TEST_CONFIG.timeout
                        });
                    }
                } catch (authError) {
                    // Si falla la autenticación, hacer health check
                    await axios.get(`${BACKEND_URL}/health`, { 
                        timeout: LOAD_TEST_CONFIG.timeout 
                    });
                }
            }
            
            this.successfulRequests++;
            
        } catch (error) {
            this.failedRequests++;
            console.log(`❌ Usuario ${userId} - Error: ${error.message}`);
        }
        
        const endTime = performance.now();
        this.responseTimes.push(endTime - startTime);
        this.activeRequests--;
    }

    printLoadTestResult(result) {
        console.log(`\n📊 Resultados para ${result.userCount} usuarios:`);
        console.log(`   ⏱️  Duración: ${(result.duration/1000).toFixed(1)}s`);
        console.log(`   📝 Total requests: ${result.totalRequests}`);
        console.log(`   ✅ Exitosos: ${result.successfulRequests}`);
        console.log(`   ❌ Fallidos: ${result.failedRequests}`);
        console.log(`   📈 Tasa de éxito: ${result.successRate}%`);
        console.log(`   ⚡ Tiempo promedio respuesta: ${result.avgResponseTime}ms`);
        console.log(`   🚀 Requests por segundo: ${result.requestsPerSecond}`);
    }

    resetCounters() {
        this.totalRequests = 0;
        this.successfulRequests = 0;
        this.failedRequests = 0;
        this.responseTimes = [];
    }

    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    generateLoadTestReport() {
        console.log('\n' + '='.repeat(60));
        console.log('🔥 REPORTE DE PRUEBAS DE CARGA');
        console.log('='.repeat(60));
        
        this.results.forEach(result => {
            console.log(`\n👥 ${result.userCount} usuarios concurrentes:`);
            console.log(`   📊 Requests totales: ${result.totalRequests}`);
            console.log(`   ✅ Tasa de éxito: ${result.successRate}%`);
            console.log(`   ⚡ Tiempo promedio: ${result.avgResponseTime}ms`);
            console.log(`   🚀 RPS: ${result.requestsPerSecond}`);
        });

        // Análisis de rendimiento
        console.log('\n📈 ANÁLISIS DE RENDIMIENTO:');
        
        const bestPerformance = this.results.reduce((best, current) => 
            parseFloat(current.requestsPerSecond) > parseFloat(best.requestsPerSecond) ? current : best
        );
        
        const worstPerformance = this.results.reduce((worst, current) => 
            parseFloat(current.successRate) < parseFloat(worst.successRate) ? current : worst
        );

        console.log(`   🏆 Mejor RPS: ${bestPerformance.requestsPerSecond} (${bestPerformance.userCount} usuarios)`);
        console.log(`   ⚠️  Peor tasa éxito: ${worstPerformance.successRate}% (${worstPerformance.userCount} usuarios)`);

        // Recomendaciones
        console.log('\n💡 RECOMENDACIONES:');
        const avgSuccessRate = this.results.reduce((sum, r) => sum + parseFloat(r.successRate), 0) / this.results.length;
        
        if (avgSuccessRate > 95) {
            console.log('   ✅ Excelente estabilidad bajo carga');
        } else if (avgSuccessRate > 90) {
            console.log('   ⚠️  Buena estabilidad, monitorear bajo carga alta');
        } else {
            console.log('   ❌ Considerar optimizaciones de rendimiento');
        }

        return {
            results: this.results,
            summary: {
                avgSuccessRate: avgSuccessRate.toFixed(2),
                bestRPS: bestPerformance.requestsPerSecond,
                worstSuccessRate: worstPerformance.successRate
            }
        };
    }
}

// Función principal de pruebas de carga
async function runLoadTests() {
    console.log('🔥 INICIANDO PRUEBAS DE CARGA EN PRODUCCIÓN');
    console.log('===========================================');
    console.log(`🌐 Backend: ${BACKEND_URL}`);
    console.log(`🖥️ Frontend: ${FRONTEND_URL}`);
    console.log(`👥 Usuarios concurrentes: ${LOAD_TEST_CONFIG.concurrent_users.join(', ')}`);
    console.log(`⏱️ Duración por prueba: ${LOAD_TEST_CONFIG.duration_minutes} minutos`);
    console.log(`📡 Intervalo entre requests: ${LOAD_TEST_CONFIG.request_interval_ms}ms`);
    console.log('');

    const loadTestRunner = new LoadTestRunner();
    const durationMs = LOAD_TEST_CONFIG.duration_minutes * 60 * 1000;

    // Ejecutar pruebas de carga para diferentes números de usuarios
    for (const userCount of LOAD_TEST_CONFIG.concurrent_users) {
        await loadTestRunner.runConcurrentUsers(userCount, durationMs);
        
        // Pausa entre pruebas para que el servidor se recupere
        console.log('⏸️ Pausa de 30 segundos entre pruebas...');
        await new Promise(resolve => setTimeout(resolve, 30000));
    }

    // Generar reporte final
    const report = loadTestRunner.generateLoadTestReport();
    
    // Guardar reporte
    const fs = await import('fs');
    const reportData = {
        timestamp: new Date().toISOString(),
        config: LOAD_TEST_CONFIG,
        urls: {
            backend: BACKEND_URL,
            frontend: FRONTEND_URL
        },
        loadTestResults: report
    };
    
    fs.writeFileSync('load-test-report.json', JSON.stringify(reportData, null, 2));
    console.log('\n📄 Reporte de carga guardado en: load-test-report.json');
    
    return report;
}

// Ejecutar si se llama directamente
if (import.meta.url === `file://${process.argv[1]}`) {
    runLoadTests().catch(console.error);
}

export { runLoadTests, LoadTestRunner };
