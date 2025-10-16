const fs = require('fs');

// Función para generar reporte consolidado
function generateConsolidatedReport() {
    console.log('📊 GENERANDO REPORTE CONSOLIDADO DE TESTING');
    console.log('===========================================');
    
    let reports = {};
    
    // Leer reportes existentes
    try {
        if (fs.existsSync('production-test-report.json')) {
            reports.production = JSON.parse(fs.readFileSync('production-test-report.json', 'utf8'));
            console.log('✅ Reporte de pruebas de producción cargado');
        }
        
        if (fs.existsSync('load-test-report.json')) {
            reports.load = JSON.parse(fs.readFileSync('load-test-report.json', 'utf8'));
            console.log('✅ Reporte de pruebas de carga cargado');
        }
        
        if (fs.existsSync('security-test-report.json')) {
            reports.security = JSON.parse(fs.readFileSync('security-test-report.json', 'utf8'));
            console.log('✅ Reporte de pruebas de seguridad cargado');
        }
    } catch (error) {
        console.log('⚠️ Error leyendo reportes:', error.message);
    }
    
    // Generar resumen consolidado
    const consolidatedReport = {
        timestamp: new Date().toISOString(),
        testingSummary: {
            executionDate: new Date().toLocaleDateString(),
            executionTime: new Date().toLocaleTimeString(),
            urls: {
                backend: 'https://libroderesoluciones-api.onrender.com',
                frontend: 'https://libro-de-resoluciones-v2-9izd-fe0i5ihfg.vercel.app'
            }
        },
        results: reports
    };
    
    // Calcular métricas generales
    let overallMetrics = {
        totalTests: 0,
        passedTests: 0,
        failedTests: 0,
        successRate: 0,
        vulnerabilities: 0,
        performance: {
            avgResponseTime: 0,
            throughput: 0,
            stability: 'N/A'
        }
    };
    
    // Analizar resultados de producción
    if (reports.production) {
        const prodResults = reports.production.results.summary;
        overallMetrics.totalTests += prodResults.total;
        overallMetrics.passedTests += prodResults.passed;
        overallMetrics.failedTests += prodResults.failed;
        
        console.log('\n📈 ANÁLISIS DE PRUEBAS FUNCIONALES:');
        console.log('===================================');
        console.log(`✅ Pruebas exitosas: ${prodResults.passed}/${prodResults.total}`);
        console.log(`🎯 Tasa de éxito: ${reports.production.results.successRate}%`);
        
        // Mostrar pruebas por categoría
        if (reports.production.results.categories) {
            console.log('\n📋 Resultados por categoría:');
            Object.entries(reports.production.results.categories).forEach(([category, stats]) => {
                const rate = ((stats.passed / stats.total) * 100).toFixed(1);
                console.log(`   ${category}: ${stats.passed}/${stats.total} (${rate}%)`);
            });
        }
    }
    
    // Analizar resultados de carga
    if (reports.load) {
        const loadResults = reports.load.loadTestResults;
        console.log('\n🔥 ANÁLISIS DE PRUEBAS DE CARGA:');
        console.log('===============================');
        console.log(`📊 Usuarios probados: ${reports.load.config.concurrent_users.join(', ')}`);
        console.log(`⏱️ Duración por prueba: ${reports.load.config.duration_seconds}s`);
        
        if (loadResults.results && loadResults.results.length > 0) {
            const avgSuccessRate = loadResults.results.reduce((sum, r) => sum + parseFloat(r.successRate), 0) / loadResults.results.length;
            const avgResponseTime = loadResults.results.reduce((sum, r) => sum + r.avgResponseTime, 0) / loadResults.results.length;
            const maxThroughput = Math.max(...loadResults.results.map(r => parseFloat(r.requestsPerSecond)));
            
            overallMetrics.performance.avgResponseTime = Math.round(avgResponseTime);
            overallMetrics.performance.throughput = maxThroughput.toFixed(2);
            overallMetrics.performance.stability = avgSuccessRate >= 95 ? 'Excelente' : avgSuccessRate >= 90 ? 'Buena' : 'Regular';
            
            console.log(`📈 Tasa promedio de éxito: ${avgSuccessRate.toFixed(1)}%`);
            console.log(`⚡ Tiempo promedio de respuesta: ${Math.round(avgResponseTime)}ms`);
            console.log(`🚀 Máximo throughput: ${maxThroughput.toFixed(2)} RPS`);
            console.log(`🛡️ Estabilidad: ${overallMetrics.performance.stability}`);
        }
    }
    
    // Analizar resultados de seguridad
    if (reports.security) {
        const secResults = reports.security.securityResults;
        overallMetrics.vulnerabilities = secResults.vulnerabilities.length;
        
        console.log('\n🔒 ANÁLISIS DE SEGURIDAD:');
        console.log('========================');
        console.log(`🛡️ Pruebas pasadas: ${secResults.summary.passed}`);
        console.log(`⚠️ Advertencias: ${secResults.summary.warnings}`);
        console.log(`❌ Vulnerabilidades críticas: ${secResults.summary.failed}`);
        console.log(`📊 Puntuación de seguridad: ${secResults.summary.score}%`);
        
        if (secResults.vulnerabilities.length > 0) {
            console.log('\n🚨 Vulnerabilidades encontradas:');
            secResults.vulnerabilities.forEach((vuln, index) => {
                console.log(`   ${index + 1}. ${vuln.name} [${vuln.severity}]`);
                console.log(`      ${vuln.description}`);
            });
        } else {
            console.log('✅ ¡No se encontraron vulnerabilidades críticas!');
        }
    }
    
    // Calcular tasa de éxito general
    if (overallMetrics.totalTests > 0) {
        overallMetrics.successRate = ((overallMetrics.passedTests / overallMetrics.totalTests) * 100).toFixed(1);
    }
    
    // Agregar métricas al reporte
    consolidatedReport.overallMetrics = overallMetrics;
    
    // Generar evaluación general
    console.log('\n🎯 EVALUACIÓN GENERAL DEL SISTEMA:');
    console.log('==================================');
    
    let overallGrade = 'A';
    let recommendations = [];
    
    // Evaluar funcionalidad
    const functionalScore = reports.production ? reports.production.results.successRate : 0;
    console.log(`🧪 Funcionalidad: ${functionalScore}%`);
    
    // Evaluar rendimiento
    const performanceGood = overallMetrics.performance.stability === 'Excelente' || overallMetrics.performance.stability === 'Buena';
    console.log(`⚡ Rendimiento: ${overallMetrics.performance.stability}`);
    
    // Evaluar seguridad
    const securityScore = reports.security ? reports.security.securityResults.summary.score : 0;
    console.log(`🔒 Seguridad: ${securityScore}%`);
    
    // Determinar calificación general
    if (functionalScore >= 90 && performanceGood && securityScore >= 80) {
        overallGrade = 'A+';
        console.log('\n🏆 CALIFICACIÓN: A+ - SISTEMA EXCELENTE');
        console.log('✅ El sistema está listo para producción de alto rendimiento');
    } else if (functionalScore >= 80 && securityScore >= 70) {
        overallGrade = 'A';
        console.log('\n✅ CALIFICACIÓN: A - SISTEMA MUY BUENO');
        console.log('✅ El sistema está listo para producción');
    } else if (functionalScore >= 70 && securityScore >= 60) {
        overallGrade = 'B';
        console.log('\n⚠️ CALIFICACIÓN: B - SISTEMA BUENO');
        console.log('⚠️ El sistema funciona pero requiere mejoras');
    } else {
        overallGrade = 'C';
        console.log('\n🚨 CALIFICACIÓN: C - SISTEMA NECESITA MEJORAS');
        console.log('🚨 Se requieren correcciones antes de producción');
    }
    
    // Generar recomendaciones
    console.log('\n💡 RECOMENDACIONES PRINCIPALES:');
    console.log('==============================');
    
    if (functionalScore < 90) {
        recommendations.push('Investigar y corregir pruebas funcionales fallidas');
        console.log('1. Investigar y corregir pruebas funcionales fallidas');
    }
    
    if (securityScore < 80) {
        recommendations.push('Abordar vulnerabilidades de seguridad identificadas');
        console.log('2. Abordar vulnerabilidades de seguridad identificadas');
    }
    
    if (overallMetrics.performance.avgResponseTime > 1000) {
        recommendations.push('Optimizar tiempos de respuesta del sistema');
        console.log('3. Optimizar tiempos de respuesta del sistema');
    }
    
    if (overallMetrics.vulnerabilities > 0) {
        recommendations.push('Implementar correcciones de seguridad sugeridas');
        console.log('4. Implementar correcciones de seguridad sugeridas');
    }
    
    if (recommendations.length === 0) {
        console.log('✅ ¡No se requieren mejoras críticas! Sistema en excelente estado.');
    }
    
    // Agregar evaluación al reporte
    consolidatedReport.evaluation = {
        overallGrade,
        functionalScore,
        securityScore,
        performanceRating: overallMetrics.performance.stability,
        recommendations
    };
    
    // Guardar reporte consolidado
    fs.writeFileSync('consolidated-test-report.json', JSON.stringify(consolidatedReport, null, 2));
    
    console.log('\n📄 REPORTES GENERADOS:');
    console.log('======================');
    console.log('📊 production-test-report.json - Pruebas funcionales');
    console.log('🔥 load-test-report.json - Pruebas de carga');
    console.log('🔒 security-test-report.json - Pruebas de seguridad');
    console.log('📋 consolidated-test-report.json - Reporte consolidado');
    
    console.log('\n🎉 TESTING COMPLETADO EXITOSAMENTE');
    console.log('==================================');
    
    return consolidatedReport;
}

// Ejecutar generación de reporte
generateConsolidatedReport();
