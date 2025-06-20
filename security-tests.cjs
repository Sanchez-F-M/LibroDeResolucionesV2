const axios = require('axios');
const { performance } = require('perf_hooks');

const BACKEND_URL = 'https://libroderesoluciones-api.onrender.com';
const FRONTEND_URL = 'https://libro-de-resoluciones-v2-9izd-fe0i5ihfg.vercel.app';

class SecurityTestRunner {
    constructor() {
        this.vulnerabilities = [];
        this.passed = 0;
        this.failed = 0;
        this.warnings = 0;
    }

    async runSecurityTest(testName, testFunction, severity = 'MEDIUM') {
        console.log(`\n🔒 Prueba de seguridad: ${testName}`);
        
        try {
            const result = await testFunction();
            
            if (result.vulnerable) {
                this.vulnerabilities.push({
                    name: testName,
                    severity,
                    description: result.description,
                    evidence: result.evidence,
                    recommendation: result.recommendation
                });
                
                console.log(`⚠️  VULNERABILIDAD DETECTADA: ${testName}`);
                console.log(`   Severidad: ${severity}`);
                console.log(`   Descripción: ${result.description}`);
                
                if (severity === 'HIGH' || severity === 'CRITICAL') {
                    this.failed++;
                } else {
                    this.warnings++;
                }
            } else {
                console.log(`✅ ${testName} - SEGURO`);
                this.passed++;
            }
            
            return result;
        } catch (error) {
            console.log(`❌ Error en prueba de seguridad ${testName}: ${error.message}`);
            this.failed++;
            return { error: error.message };
        }
    }

    // PRUEBA: SQL Injection
    async testSQLInjection() {
        const maliciousPayloads = [
            "'; DROP TABLE users; --",
            "' OR '1'='1",
            "admin'--"
        ];

        for (const payload of maliciousPayloads) {
            try {
                const response = await axios.post(`${BACKEND_URL}/api/user/login`, {
                    Nombre: payload,
                    Contrasena: 'test'
                }, { timeout: 10000 });

                // Si el login es exitoso con payload malicioso, es una vulnerabilidad
                if (response.status === 200) {
                    return {
                        vulnerable: true,
                        description: 'SQL Injection detectado en endpoint de login',
                        evidence: `Payload exitoso: ${payload}`,
                        recommendation: 'Usar consultas preparadas y validación de entrada'
                    };
                }
            } catch (error) {
                // Es esperado que falle, esto es bueno
                continue;
            }
        }

        return {
            vulnerable: false,
            description: 'No se detectó SQL Injection'
        };
    }

    // PRUEBA: Autenticación débil
    async testWeakAuthentication() {
        const weakPasswords = [
            '123',
            'password',
            'test'
        ];

        for (const weakPwd of weakPasswords) {
            try {                const testUser = {
                    Nombre: `weaktest_${Date.now()}`,
                    Contrasena: weakPwd,
                    Rol: 'usuario'
                };

                const response = await axios.post(`${BACKEND_URL}/api/user/register`, testUser, {
                    timeout: 10000
                });

                if (response.status === 201) {
                    return {
                        vulnerable: true,
                        description: 'Sistema acepta contraseñas débiles',
                        evidence: `Contraseña aceptada: ${weakPwd}`,
                        recommendation: 'Implementar política de contraseñas fuertes'
                    };
                }
            } catch (error) {
                continue;
            }
        }

        return {
            vulnerable: false,
            description: 'Validación de contraseñas adecuada'
        };
    }

    // PRUEBA: Enumeración de usuarios
    async testUserEnumeration() {
        const testUsers = ['admin', 'administrator', 'root'];
        const responses = [];

        for (const username of testUsers) {
            try {
                const response = await axios.post(`${BACKEND_URL}/api/user/login`, {
                    Nombre: username,
                    Contrasena: 'wrongpassword'
                }, { timeout: 10000 });
                
                responses.push({ username, status: response.status, message: response.data });
            } catch (error) {
                responses.push({ 
                    username, 
                    status: error.response?.status || 'ERROR',
                    message: error.response?.data || error.message 
                });
            }
        }

        // Verificar si las respuestas son diferentes para usuarios existentes vs no existentes
        const uniqueResponses = [...new Set(responses.map(r => JSON.stringify(r.message)))];
        
        if (uniqueResponses.length > 1) {
            return {
                vulnerable: true,
                description: 'Posible enumeración de usuarios',
                evidence: `Respuestas diferentes: ${uniqueResponses.length}`,
                recommendation: 'Usar respuestas consistentes para usuarios válidos e inválidos'
            };
        }

        return {
            vulnerable: false,
            description: 'No se detectó enumeración de usuarios'
        };
    }

    // PRUEBA: Exposición de información sensible
    async testInformationDisclosure() {
        const sensitiveEndpoints = [
            '/api/users',
            '/api/admin',
            '/.env',
            '/server-status'
        ];

        for (const endpoint of sensitiveEndpoints) {
            try {
                const response = await axios.get(`${BACKEND_URL}${endpoint}`, {
                    timeout: 10000
                });

                if (response.status === 200 && response.data) {
                    return {
                        vulnerable: true,
                        description: 'Endpoint sensible expuesto',
                        evidence: `Endpoint accesible: ${endpoint}`,
                        recommendation: 'Restringir acceso a endpoints administrativos'
                    };
                }
            } catch (error) {
                continue;
            }
        }

        return {
            vulnerable: false,
            description: 'No se encontraron endpoints sensibles expuestos'
        };
    }

    // PRUEBA: Bypass de autenticación
    async testAuthenticationBypass() {
        const bypassPayloads = [
            '', // Token vacío
            'Bearer invalid',
            'Bearer null'
        ];

        for (const token of bypassPayloads) {
            try {
                const response = await axios.get(`${BACKEND_URL}/api/books`, {
                    headers: {
                        'Authorization': token
                    },
                    timeout: 10000
                });

                if (response.status === 200) {
                    return {
                        vulnerable: true,
                        description: 'Bypass de autenticación detectado',
                        evidence: `Token bypass: ${token}`,
                        recommendation: 'Validar correctamente todos los tokens JWT'
                    };
                }
            } catch (error) {
                continue;
            }
        }

        return {
            vulnerable: false,
            description: 'Autenticación segura, no se detectó bypass'
        };
    }

    // PRUEBA: Headers de seguridad
    async testSecurityHeaders() {
        const response = await axios.get(`${BACKEND_URL}/health`, { timeout: 10000 });
        const headers = response.headers;

        const missingHeaders = [];
        const securityHeaders = {
            'x-content-type-options': 'nosniff',
            'x-frame-options': 'DENY',
            'x-xss-protection': '1; mode=block'
        };

        for (const [header, expectedValue] of Object.entries(securityHeaders)) {
            if (!headers[header]) {
                missingHeaders.push(header);
            }
        }

        if (missingHeaders.length > 0) {
            return {
                vulnerable: true,
                description: 'Headers de seguridad faltantes',
                evidence: `Headers faltantes: ${missingHeaders.join(', ')}`,
                recommendation: 'Agregar headers de seguridad recomendados'
            };
        }

        return {
            vulnerable: false,
            description: 'Headers de seguridad correctos'
        };
    }

    generateSecurityReport() {
        console.log('\n' + '='.repeat(60));
        console.log('🔒 REPORTE DE SEGURIDAD');
        console.log('='.repeat(60));
        
        console.log(`🛡️ Pruebas pasadas: ${this.passed}`);
        console.log(`⚠️ Advertencias: ${this.warnings}`);
        console.log(`❌ Vulnerabilidades críticas: ${this.failed}`);
        console.log(`🔍 Total vulnerabilidades: ${this.vulnerabilities.length}`);

        if (this.vulnerabilities.length > 0) {
            console.log('\n🚨 VULNERABILIDADES DETECTADAS:');
            console.log('='.repeat(40));
            
            this.vulnerabilities.forEach((vuln, index) => {
                console.log(`\n${index + 1}. ${vuln.name} [${vuln.severity}]`);
                console.log(`   📝 ${vuln.description}`);
                if (vuln.evidence) {
                    console.log(`   🔍 Evidencia: ${vuln.evidence}`);
                }
                console.log(`   💡 Recomendación: ${vuln.recommendation}`);
            });
        } else {
            console.log('\n✅ ¡No se detectaron vulnerabilidades críticas!');
        }

        // Calificación de seguridad
        const totalTests = this.passed + this.warnings + this.failed;
        const securityScore = ((this.passed / totalTests) * 100).toFixed(1);
        
        console.log(`\n📊 PUNTUACIÓN DE SEGURIDAD: ${securityScore}%`);
        
        if (securityScore >= 90) {
            console.log('🛡️ EXCELENTE - Muy seguro');
        } else if (securityScore >= 75) {
            console.log('⚠️ BUENO - Algunas mejoras necesarias');
        } else if (securityScore >= 60) {
            console.log('🚨 REGULAR - Vulnerabilidades importantes');
        } else {
            console.log('💀 CRÍTICO - Múltiples vulnerabilidades críticas');
        }

        return {
            summary: {
                passed: this.passed,
                warnings: this.warnings,
                failed: this.failed,
                score: parseFloat(securityScore)
            },
            vulnerabilities: this.vulnerabilities
        };
    }
}

// Función principal de pruebas de seguridad
async function runSecurityTests() {
    console.log('🔒 INICIANDO PRUEBAS DE SEGURIDAD');
    console.log('================================');
    console.log(`🌐 Backend: ${BACKEND_URL}`);
    console.log(`🖥️ Frontend: ${FRONTEND_URL}`);
    console.log('');

    const securityRunner = new SecurityTestRunner();

    // Ejecutar todas las pruebas de seguridad
    await securityRunner.runSecurityTest('SQL Injection', () => securityRunner.testSQLInjection(), 'CRITICAL');
    await securityRunner.runSecurityTest('Autenticación Débil', () => securityRunner.testWeakAuthentication(), 'HIGH');
    await securityRunner.runSecurityTest('Enumeración de Usuarios', () => securityRunner.testUserEnumeration(), 'MEDIUM');
    await securityRunner.runSecurityTest('Exposición de Información', () => securityRunner.testInformationDisclosure(), 'HIGH');
    await securityRunner.runSecurityTest('Bypass de Autenticación', () => securityRunner.testAuthenticationBypass(), 'CRITICAL');
    await securityRunner.runSecurityTest('Headers de Seguridad', () => securityRunner.testSecurityHeaders(), 'LOW');

    // Generar reporte
    const report = securityRunner.generateSecurityReport();
    
    // Guardar reporte
    const fs = require('fs');
    const reportData = {
        timestamp: new Date().toISOString(),
        urls: {
            backend: BACKEND_URL,
            frontend: FRONTEND_URL
        },
        securityResults: report
    };
    
    fs.writeFileSync('security-test-report.json', JSON.stringify(reportData, null, 2));
    console.log('\n📄 Reporte de seguridad guardado en: security-test-report.json');
    
    return report;
}

// Ejecutar si se llama directamente
runSecurityTests().catch(console.error);
