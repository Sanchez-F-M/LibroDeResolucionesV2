const { exec } = require('child_process');
const fs = require('fs');

console.log('🚀 EJECUTANDO SUITE COMPLETA DE TESTING EN PRODUCCIÓN');
console.log('=====================================================');
console.log(`📅 Fecha: ${new Date().toLocaleDateString()}`);
console.log(`⏰ Hora inicial: ${new Date().toLocaleTimeString()}`);
console.log('');

// Función para ejecutar comando y capturar salida
function runCommand(command, description) {
    return new Promise((resolve, reject) => {
        console.log(`\n🔄 ${description}...`);
        console.log('='.repeat(50));
        
        const startTime = Date.now();
        
        exec(command, (error, stdout, stderr) => {
            const duration = Date.now() - startTime;
            
            if (error) {
                console.log(`❌ Error en ${description}:`, error.message);
                console.log(`⏱️ Duración: ${(duration / 1000).toFixed(1)}s`);
                resolve({ success: false, error: error.message, duration, stdout, stderr });
            } else {
                console.log(stdout);
                if (stderr) console.log('Warnings:', stderr);
                console.log(`✅ ${description} completado en ${(duration / 1000).toFixed(1)}s`);
                resolve({ success: true, duration, stdout, stderr });
            }
        });
    });
}

async function runAllTests() {
    const startTime = Date.now();
    const results = {};
    
    try {
        // 1. PRUEBAS FUNCIONALES DE PRODUCCIÓN
        console.log('\n1️⃣ EJECUTANDO PRUEBAS FUNCIONALES DE PRODUCCIÓN');
        results.functional = await runCommand(
            'node production-tests.cjs',
            'Pruebas funcionales'
        );
        
        // Pausa entre pruebas
        console.log('\n⏸️ Pausa de 30 segundos...');
        await new Promise(resolve => setTimeout(resolve, 30000));
        
        // 2. PRUEBAS DE CARGA
        console.log('\n2️⃣ EJECUTANDO PRUEBAS DE CARGA');
        results.load = await runCommand(
            'node load-tests.cjs',
            'Pruebas de carga'
        );
        
        // Pausa entre pruebas
        console.log('\n⏸️ Pausa de 60 segundos...');
        await new Promise(resolve => setTimeout(resolve, 60000));
        
        // 3. PRUEBAS DE SEGURIDAD
        console.log('\n3️⃣ EJECUTANDO PRUEBAS DE SEGURIDAD');
        results.security = await runCommand(
            'node security-tests.cjs',
            'Pruebas de seguridad'
        );
        
        // 4. GENERAR REPORTE CONSOLIDADO
        console.log('\n4️⃣ GENERANDO REPORTE CONSOLIDADO');
        results.report = await runCommand(
            'node generate-consolidated-report.cjs',
            'Reporte consolidado'
        );
        
        // RESUMEN FINAL
        const totalTime = Date.now() - startTime;
        
        console.log('\n' + '='.repeat(80));
        console.log('🎊 SUITE DE TESTING COMPLETADA EXITOSAMENTE');
        console.log('='.repeat(80));
        console.log(`⏱️ Tiempo total de ejecución: ${(totalTime / 1000 / 60).toFixed(1)} minutos`);
        console.log(`📅 Fecha de finalización: ${new Date().toLocaleDateString()}`);
        console.log(`🕐 Hora de finalización: ${new Date().toLocaleTimeString()}`);
        
        // Estadísticas de ejecución
        console.log('\n📊 ESTADÍSTICAS DE EJECUCIÓN:');
        console.log('============================');
        
        const testSuites = [
            { name: 'Pruebas Funcionales', result: results.functional },
            { name: 'Pruebas de Carga', result: results.load },
            { name: 'Pruebas de Seguridad', result: results.security },
            { name: 'Reporte Consolidado', result: results.report }
        ];
        
        testSuites.forEach(suite => {
            const status = suite.result.success ? '✅ EXITOSO' : '❌ FALLIDO';
            const duration = (suite.result.duration / 1000).toFixed(1);
            console.log(`${suite.name}: ${status} (${duration}s)`);
        });
        
        // Verificar archivos generados
        console.log('\n📁 ARCHIVOS GENERADOS:');
        console.log('======================');
        
        const reportFiles = [
            'production-test-report.json',
            'load-test-report.json', 
            'security-test-report.json',
            'consolidated-test-report.json'
        ];
        
        reportFiles.forEach(file => {
            if (fs.existsSync(file)) {
                const stats = fs.statSync(file);
                const sizeKB = (stats.size / 1024).toFixed(1);
                console.log(`✅ ${file} (${sizeKB} KB)`);
            } else {
                console.log(`❌ ${file} - No encontrado`);
            }
        });
        
        // Leer y mostrar resumen del reporte consolidado
        if (fs.existsSync('consolidated-test-report.json')) {
            try {
                const consolidatedData = JSON.parse(fs.readFileSync('consolidated-test-report.json', 'utf8'));
                
                console.log('\n🎯 RESUMEN FINAL DE CALIDAD:');
                console.log('============================');
                  if (consolidatedData.evaluation) {
                    const evaluation = consolidatedData.evaluation;
                    console.log(`📈 Calificación General: ${evaluation.overallGrade}`);
                    console.log(`🧪 Funcionalidad: ${evaluation.functionalScore}%`);
                    console.log(`🔒 Seguridad: ${evaluation.securityScore}%`);
                    console.log(`⚡ Rendimiento: ${evaluation.performanceRating}`);
                    
                    if (evaluation.recommendations && evaluation.recommendations.length > 0) {
                        console.log('\n💡 Recomendaciones:');
                        eval.recommendations.forEach((rec, index) => {
                            console.log(`${index + 1}. ${rec}`);
                        });
                    }
                }
                
                if (consolidatedData.overallMetrics) {
                    const metrics = consolidatedData.overallMetrics;
                    console.log('\n📊 Métricas Generales:');
                    console.log(`   Total de pruebas: ${metrics.totalTests}`);
                    console.log(`   Tasa de éxito: ${metrics.successRate}%`);
                    console.log(`   Vulnerabilidades: ${metrics.vulnerabilities}`);
                    console.log(`   Tiempo promedio respuesta: ${metrics.performance.avgResponseTime}ms`);
                }
                
            } catch (error) {
                console.log('⚠️ Error leyendo reporte consolidado:', error.message);
            }
        }
        
        console.log('\n🏁 PROCESO DE TESTING FINALIZADO');
        console.log('================================');
        console.log('✅ Todos los reportes han sido generados');
        console.log('✅ Los archivos están listos para revisión');
        console.log('✅ El sistema ha sido evaluado completamente');
        
        // Guardar log de ejecución
        const executionLog = {
            timestamp: new Date().toISOString(),
            totalDuration: totalTime,
            results: results,
            filesGenerated: reportFiles.filter(file => fs.existsSync(file))
        };
        
        fs.writeFileSync('test-execution-log.json', JSON.stringify(executionLog, null, 2));
        console.log('\n📝 Log de ejecución guardado en: test-execution-log.json');
        
    } catch (error) {
        console.error('\n💥 ERROR CRÍTICO EN LA SUITE DE TESTING:', error);
        process.exit(1);
    }
}

// Ejecutar suite completa
runAllTests();
