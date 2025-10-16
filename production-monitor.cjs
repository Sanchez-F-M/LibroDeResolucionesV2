const axios = require('axios');
const fs = require('fs');
const path = require('path');

class ProductionMonitor {
    constructor() {
        this.backendUrl = 'https://libroderesoluciones-api.onrender.com';
        this.frontendUrl = 'https://libro-de-resoluciones-v2-9izd-fe0i5ihfg.vercel.app';
        this.monitoringInterval = 5 * 60 * 1000; // 5 minutos
        this.logPath = path.join(__dirname, 'monitoring.log');
        this.alertThresholds = {
            responseTime: 5000, // 5 segundos
            errorRate: 10, // 10%
            consecutiveFailures: 3
        };
        this.metrics = {
            totalChecks: 0,
            successfulChecks: 0,
            averageResponseTime: 0,
            consecutiveFailures: 0,
            lastSuccessfulCheck: null,
            alerts: []
        };
    }

    log(message, level = 'INFO') {
        const timestamp = new Date().toISOString();
        const logEntry = `[${timestamp}] [${level}] ${message}\n`;
        
        console.log(`${level === 'ERROR' ? '❌' : level === 'WARN' ? '⚠️' : '✅'} ${message}`);
        fs.appendFileSync(this.logPath, logEntry);
    }

    async checkBackendHealth() {
        try {
            const startTime = Date.now();
            const response = await axios.get(`${this.backendUrl}/health`, {
                timeout: 10000
            });
            const responseTime = Date.now() - startTime;

            if (response.status === 200) {
                this.metrics.successfulChecks++;
                this.metrics.consecutiveFailures = 0;
                this.metrics.lastSuccessfulCheck = new Date().toISOString();
                
                // Actualizar tiempo promedio de respuesta
                this.metrics.averageResponseTime = 
                    (this.metrics.averageResponseTime * (this.metrics.totalChecks - 1) + responseTime) / this.metrics.totalChecks;

                if (responseTime > this.alertThresholds.responseTime) {
                    this.createAlert('SLOW_RESPONSE', `Backend response time: ${responseTime}ms`);
                }

                return {
                    status: 'healthy',
                    responseTime,
                    uptime: response.data.uptime,
                    version: response.data.version
                };
            }
        } catch (error) {
            this.metrics.consecutiveFailures++;
            
            if (this.metrics.consecutiveFailures >= this.alertThresholds.consecutiveFailures) {
                this.createAlert('BACKEND_DOWN', `Backend unreachable for ${this.metrics.consecutiveFailures} consecutive checks`);
            }

            throw new Error(`Backend health check failed: ${error.message}`);
        }
    }

    async checkFrontendAvailability() {
        try {
            const startTime = Date.now();
            const response = await axios.get(this.frontendUrl, {
                timeout: 10000
            });
            const responseTime = Date.now() - startTime;

            if (response.status === 200) {
                return {
                    status: 'available',
                    responseTime,
                    contentLength: response.data.length
                };
            }
        } catch (error) {
            throw new Error(`Frontend availability check failed: ${error.message}`);
        }
    }

    async checkSecurityHeaders() {
        try {
            const response = await axios.get(`${this.backendUrl}/health`);
            const headers = response.headers;

            const requiredHeaders = [
                'x-content-type-options',
                'x-frame-options', 
                'x-xss-protection'
            ];

            const missingHeaders = requiredHeaders.filter(header => !headers[header]);
            
            if (missingHeaders.length > 0) {
                this.createAlert('MISSING_SECURITY_HEADERS', `Missing headers: ${missingHeaders.join(', ')}`);
                return {
                    status: 'partial',
                    missingHeaders
                };
            }

            return {
                status: 'secure',
                headers: requiredHeaders.map(h => ({ [h]: headers[h] }))
            };
        } catch (error) {
            throw new Error(`Security headers check failed: ${error.message}`);
        }
    }

    async testCriticalEndpoints() {
        const endpoints = [
            { url: `${this.backendUrl}/api/books/all`, method: 'GET', name: 'Books API' },
            { url: `${this.backendUrl}/api/user/login`, method: 'POST', name: 'Login API', 
              data: { Nombre: 'test', Contrasena: 'test' } }
        ];

        const results = [];

        for (const endpoint of endpoints) {
            try {
                const startTime = Date.now();
                const config = {
                    method: endpoint.method,
                    url: endpoint.url,
                    timeout: 10000
                };

                if (endpoint.data) {
                    config.data = endpoint.data;
                }

                const response = await axios(config);
                const responseTime = Date.now() - startTime;

                results.push({
                    name: endpoint.name,
                    status: 'operational',
                    responseTime,
                    httpStatus: response.status
                });
            } catch (error) {
                results.push({
                    name: endpoint.name,
                    status: 'error',
                    error: error.message,
                    httpStatus: error.response?.status || 'timeout'
                });

                if (!endpoint.name.includes('Login')) { // Login errors are expected
                    this.createAlert('ENDPOINT_ERROR', `${endpoint.name} failed: ${error.message}`);
                }
            }
        }

        return results;
    }

    createAlert(type, message) {
        const alert = {
            type,
            message,
            timestamp: new Date().toISOString(),
            severity: this.getAlertSeverity(type)
        };

        this.metrics.alerts.push(alert);
        this.log(`ALERT [${alert.severity}] ${type}: ${message}`, 'WARN');

        // Mantener solo las últimas 50 alertas
        if (this.metrics.alerts.length > 50) {
            this.metrics.alerts = this.metrics.alerts.slice(-50);
        }
    }

    getAlertSeverity(type) {
        const severityMap = {
            'BACKEND_DOWN': 'CRITICAL',
            'ENDPOINT_ERROR': 'HIGH',
            'SLOW_RESPONSE': 'MEDIUM',
            'MISSING_SECURITY_HEADERS': 'MEDIUM',
            'HIGH_ERROR_RATE': 'HIGH'
        };
        return severityMap[type] || 'LOW';
    }

    async runFullHealthCheck() {
        this.metrics.totalChecks++;
        const checkResults = {
            timestamp: new Date().toISOString(),
            overall: 'healthy'
        };

        try {
            // 1. Backend Health
            this.log('Checking backend health...');
            checkResults.backend = await this.checkBackendHealth();
        } catch (error) {
            checkResults.backend = { status: 'error', error: error.message };
            checkResults.overall = 'degraded';
            this.log(`Backend health check failed: ${error.message}`, 'ERROR');
        }

        try {
            // 2. Frontend Availability
            this.log('Checking frontend availability...');
            checkResults.frontend = await this.checkFrontendAvailability();
        } catch (error) {
            checkResults.frontend = { status: 'error', error: error.message };
            checkResults.overall = 'degraded';
            this.log(`Frontend availability check failed: ${error.message}`, 'ERROR');
        }

        try {
            // 3. Security Headers
            this.log('Checking security headers...');
            checkResults.security = await this.checkSecurityHeaders();
        } catch (error) {
            checkResults.security = { status: 'error', error: error.message };
            this.log(`Security headers check failed: ${error.message}`, 'ERROR');
        }

        try {
            // 4. Critical Endpoints
            this.log('Testing critical endpoints...');
            checkResults.endpoints = await this.testCriticalEndpoints();
        } catch (error) {
            checkResults.endpoints = { status: 'error', error: error.message };
            checkResults.overall = 'degraded';
            this.log(`Endpoints check failed: ${error.message}`, 'ERROR');
        }

        // Calcular métricas
        const errorRate = ((this.metrics.totalChecks - this.metrics.successfulChecks) / this.metrics.totalChecks) * 100;
        if (errorRate > this.alertThresholds.errorRate) {
            this.createAlert('HIGH_ERROR_RATE', `Error rate: ${errorRate.toFixed(1)}%`);
        }

        // Guardar resultados
        this.saveHealthCheckResults(checkResults);

        this.log(`Health check completed. Overall status: ${checkResults.overall}`);
        return checkResults;
    }

    saveHealthCheckResults(results) {
        const resultsPath = path.join(__dirname, 'health-checks.json');
        let existingResults = [];

        try {
            if (fs.existsSync(resultsPath)) {
                existingResults = JSON.parse(fs.readFileSync(resultsPath, 'utf8'));
            }
        } catch (error) {
            this.log(`Error reading existing results: ${error.message}`, 'ERROR');
        }

        existingResults.push(results);

        // Mantener solo los últimos 100 health checks
        if (existingResults.length > 100) {
            existingResults = existingResults.slice(-100);
        }

        try {
            fs.writeFileSync(resultsPath, JSON.stringify(existingResults, null, 2));
        } catch (error) {
            this.log(`Error saving health check results: ${error.message}`, 'ERROR');
        }
    }

    generateStatusReport() {
        const report = {
            generatedAt: new Date().toISOString(),
            systemMetrics: this.metrics,
            recentAlerts: this.metrics.alerts.slice(-10),
            healthStatus: {
                errorRate: ((this.metrics.totalChecks - this.metrics.successfulChecks) / this.metrics.totalChecks) * 100,
                averageResponseTime: this.metrics.averageResponseTime,
                uptime: this.metrics.successfulChecks / this.metrics.totalChecks * 100,
                lastCheck: this.metrics.lastSuccessfulCheck
            }
        };

        const reportPath = path.join(__dirname, 'status-report.json');
        fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
        
        this.log('Status report generated');
        return report;
    }

    start() {
        this.log('🚀 Starting production monitoring...');
        
        // Ejecutar check inicial
        this.runFullHealthCheck();

        // Configurar monitoreo continuo
        setInterval(() => {
            this.runFullHealthCheck();
        }, this.monitoringInterval);

        // Generar reporte cada hora
        setInterval(() => {
            this.generateStatusReport();
        }, 60 * 60 * 1000);

        this.log(`Monitoring started. Checks every ${this.monitoringInterval / 1000} seconds.`);
    }

    stop() {
        this.log('Stopping production monitoring...');
        clearInterval(this.monitoringInterval);
    }
}

// Ejecutar si se llama directamente
if (require.main === module) {
    const monitor = new ProductionMonitor();
    
    // Manejar señales para parada limpia
    process.on('SIGINT', () => {
        console.log('\n🛑 Stopping monitor...');
        monitor.stop();
        process.exit(0);
    });

    monitor.start();
}

module.exports = ProductionMonitor;
