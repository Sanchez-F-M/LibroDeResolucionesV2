#!/usr/bin/env node

/**
 * Diagnóstico completo del deployment en Render
 * Verifica múltiples URLs y diagnóstica problemas
 */

import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

const POSSIBLE_URLS = [
    'https://libroderresolucionesv2-backend.onrender.com',
    'https://libro-de-resoluciones-v2-backend.onrender.com', 
    'https://libroderesolucionesv2.onrender.com',
    'https://libroderesolucionesv2-backend.onrender.com',
    'https://sanchez-f-m-libroderesolucionesv2.onrender.com'
];

const ENDPOINTS_TO_TEST = ['/', '/health', '/api/health', '/api/users'];

async function testUrl(url, endpoint = '') {
    const fullUrl = url + endpoint;
    console.log(`🔍 Probando: ${fullUrl}`);
    
    try {
        const { stdout, stderr } = await execAsync(
            `curl -s -o /dev/null -w "Status: %{http_code}, Time: %{time_total}s, Size: %{size_download} bytes" "${fullUrl}"`,
            { timeout: 15000 }
        );
        
        console.log(`   📊 ${stdout.trim()}`);
        
        // Si el status no es 404, intentar obtener contenido
        if (!stdout.includes('Status: 404')) {
            try {
                const { stdout: content } = await execAsync(
                    `curl -s -m 10 "${fullUrl}" | head -c 200`,
                    { timeout: 15000 }
                );
                if (content.trim()) {
                    console.log(`   📝 Contenido: ${content.trim().substring(0, 100)}...`);
                }
            } catch (e) {
                console.log(`   📝 Error obteniendo contenido: ${e.message}`);
            }
        }
        
        return { url: fullUrl, success: !stdout.includes('Status: 404'), output: stdout };
        
    } catch (error) {
        console.log(`   ❌ Error: ${error.message}`);
        return { url: fullUrl, success: false, error: error.message };
    }
}

async function checkRenderStatus() {
    console.log('🚀 ========================================');
    console.log('🚀 DIAGNÓSTICO DEPLOYMENT EN RENDER');
    console.log('🚀 ========================================\n');
    
    const results = [];
    
    for (const baseUrl of POSSIBLE_URLS) {
        console.log(`🌐 Verificando dominio: ${baseUrl}`);
        
        // Probar endpoint raíz primero
        const rootResult = await testUrl(baseUrl, '');
        results.push(rootResult);
        
        // Si el dominio responde, probar otros endpoints
        if (rootResult.success) {
            console.log(`   ✅ Dominio activo, probando endpoints...`);
            
            for (const endpoint of ENDPOINTS_TO_TEST.slice(1)) {
                const result = await testUrl(baseUrl, endpoint);
                results.push(result);
                await new Promise(resolve => setTimeout(resolve, 500));
            }
        } else {
            console.log(`   ❌ Dominio no responde`);
        }
        
        console.log(''); // Separador
        await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    // Resumen
    console.log('📊 ========================================');
    console.log('📊 RESUMEN DE RESULTADOS');
    console.log('📊 ========================================\n');
    
    const workingUrls = results.filter(r => r.success);
    const failedUrls = results.filter(r => !r.success);
    
    if (workingUrls.length > 0) {
        console.log('✅ URLs FUNCIONANDO:');
        workingUrls.forEach(result => {
            console.log(`   • ${result.url}`);
        });
    }
    
    if (failedUrls.length > 0) {
        console.log('\\n❌ URLs CON PROBLEMAS:');
        failedUrls.forEach(result => {
            console.log(`   • ${result.url} - ${result.error || 'No disponible'}`);
        });
    }
    
    // Diagnóstico y recomendaciones
    console.log('\\n🔧 DIAGNÓSTICO:');
    
    if (workingUrls.length === 0) {
        console.log('❌ Ninguna URL de Render responde correctamente.');
        console.log('📋 POSIBLES CAUSAS:');
        console.log('   1. El deployment aún está en proceso');
        console.log('   2. Error en el build del proyecto'); 
        console.log('   3. URL del servicio incorrecta');
        console.log('   4. Problema con las variables de entorno');
        console.log('\\n🔧 ACCIONES RECOMENDADAS:');
        console.log('   1. Verificar logs de deployment en el dashboard de Render');
        console.log('   2. Confirmar la URL exacta del servicio');
        console.log('   3. Verificar que el puerto esté configurado correctamente');
        console.log('   4. Revisar variables de entorno en Render');
    } else {
        console.log(`✅ ${workingUrls.length} endpoints funcionando correctamente.`);
        console.log('🎉 El deployment parece estar funcionando!');
    }
    
    return { workingUrls, failedUrls, totalTested: results.length };
}

async function checkGitHubRepo() {
    console.log('\\n📦 ========================================');
    console.log('📦 VERIFICACIÓN REPOSITORIO GITHUB');
    console.log('📦 ========================================\\n');
    
    try {
        const { stdout } = await execAsync('git remote get-url origin');
        const repoUrl = stdout.trim();
        console.log(`🔗 Repositorio: ${repoUrl}`);
        
        const { stdout: status } = await execAsync('git status --porcelain');
        if (status.trim()) {
            console.log('⚠️ Hay cambios no commiteados:');
            console.log(status);
        } else {
            console.log('✅ Repositorio limpio - todos los cambios están commiteados');
        }
        
        const { stdout: lastCommit } = await execAsync('git log -1 --oneline');
        console.log(`📝 Último commit: ${lastCommit.trim()}`);
        
    } catch (error) {
        console.log(`❌ Error verificando repositorio: ${error.message}`);
    }
}

// Ejecutar diagnóstico completo
async function main() {
    await checkRenderStatus();
    await checkGitHubRepo();
    
    console.log('\\n📖 Para más información, revisar el dashboard de Render:');
    console.log('📖 https://dashboard.render.com/');
}

main().catch(console.error);
