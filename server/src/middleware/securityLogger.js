import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuración del sistema de logging de seguridad
class SecurityLogger {
    constructor() {
        this.logPath = path.join(__dirname, '..', 'logs', 'security.log');
        this.ensureLogDirectory();
    }

    ensureLogDirectory() {
        const logDir = path.dirname(this.logPath);
        if (!fs.existsSync(logDir)) {
            fs.mkdirSync(logDir, { recursive: true });
        }
    }

    log(level, event, details = {}) {
        const timestamp = new Date().toISOString();
        const logEntry = {
            timestamp,
            level,
            event,
            details,
            ip: details.ip || 'unknown',
            userAgent: details.userAgent || 'unknown'
        };

        const logLine = JSON.stringify(logEntry) + '\n';
        
        // Escribir al archivo de log
        fs.appendFileSync(this.logPath, logLine);
        
        // También loguear en consola con colores
        const colors = {
            INFO: '\x1b[36m',
            WARN: '\x1b[33m', 
            ERROR: '\x1b[31m',
            CRITICAL: '\x1b[35m'
        };
        
        console.log(`${colors[level] || '\x1b[0m'}[${timestamp}] [${level}] ${event}\x1b[0m`);
        if (Object.keys(details).length > 0) {
            console.log(`  Details: ${JSON.stringify(details, null, 2)}`);
        }
    }

    // Eventos específicos de seguridad
    loginAttempt(success, username, ip, userAgent) {
        this.log(success ? 'INFO' : 'WARN', 'LOGIN_ATTEMPT', {
            success,
            username,
            ip,
            userAgent
        });
    }

    registrationAttempt(success, username, reason, ip, userAgent) {
        this.log(success ? 'INFO' : 'WARN', 'REGISTRATION_ATTEMPT', {
            success,
            username,
            reason,
            ip,
            userAgent
        });
    }

    passwordPolicyViolation(username, reason, ip, userAgent) {
        this.log('WARN', 'PASSWORD_POLICY_VIOLATION', {
            username,
            reason,
            ip,
            userAgent
        });
    }

    suspiciousActivity(activity, details, ip, userAgent) {
        this.log('CRITICAL', 'SUSPICIOUS_ACTIVITY', {
            activity,
            details,
            ip,
            userAgent
        });
    }

    sqlInjectionAttempt(query, ip, userAgent) {
        this.log('CRITICAL', 'SQL_INJECTION_ATTEMPT', {
            query,
            ip,
            userAgent
        });
    }

    unauthorizedAccess(endpoint, ip, userAgent) {
        this.log('ERROR', 'UNAUTHORIZED_ACCESS', {
            endpoint,
            ip,
            userAgent
        });
    }

    // Generar reporte de seguridad
    generateSecurityReport(hours = 24) {
        const sinceTime = new Date(Date.now() - hours * 60 * 60 * 1000);
        
        try {
            const logData = fs.readFileSync(this.logPath, 'utf8');
            const lines = logData.trim().split('\n');
            const events = lines.map(line => JSON.parse(line))
                .filter(event => new Date(event.timestamp) >= sinceTime);

            const report = {
                generatedAt: new Date().toISOString(),
                period: `${hours} hours`,
                totalEvents: events.length,
                eventsByLevel: {},
                eventsByType: {},
                topIPs: {},
                suspiciousActivities: []
            };

            // Analizar eventos por nivel
            events.forEach(event => {
                report.eventsByLevel[event.level] = (report.eventsByLevel[event.level] || 0) + 1;
                report.eventsByType[event.event] = (report.eventsByType[event.event] || 0) + 1;
                report.topIPs[event.details.ip] = (report.topIPs[event.details.ip] || 0) + 1;

                if (event.level === 'CRITICAL' || event.level === 'ERROR') {
                    report.suspiciousActivities.push(event);
                }
            });

            return report;
        } catch (error) {
            this.log('ERROR', 'SECURITY_REPORT_ERROR', { error: error.message });
            return null;
        }
    }
}

// Middleware para logging automático
export const securityLoggingMiddleware = (req, res, next) => {
    const securityLogger = new SecurityLogger();
    
    // Agregar logger a la request
    req.securityLogger = securityLogger;
    
    // Logging automático de requests sensibles
    const sensitiveEndpoints = ['/api/user/login', '/api/user/register', '/api/admin'];
    const isSensitive = sensitiveEndpoints.some(endpoint => req.path.includes(endpoint));
    
    if (isSensitive) {
        securityLogger.log('INFO', 'SENSITIVE_ENDPOINT_ACCESS', {
            endpoint: req.path,
            method: req.method,
            ip: req.ip || req.connection.remoteAddress,
            userAgent: req.get('User-Agent')
        });
    }
    
    next();
};

export default SecurityLogger;
