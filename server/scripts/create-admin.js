// Script para crear usuario administrador en PostgreSQL
import pkg from 'pg';
const { Pool } = pkg;
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';

dotenv.config();

async function createAdmin() {
    console.log('🔧 Iniciando creación de usuario administrador...');
    
    try {
        // Configurar conexión a PostgreSQL
        const pool = new Pool({
            connectionString: process.env.DATABASE_URL,
            ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
        });

        // Verificar si ya existe un admin
        const existingAdmin = await pool.query(
            'SELECT * FROM users WHERE "Rol" = $1 LIMIT 1',
            ['admin']
        );

        if (existingAdmin.rows.length > 0) {
            console.log('✅ Usuario administrador ya existe');
            await pool.end();
            return;
        }

        // Crear usuario administrador
        const adminUsername = process.env.ADMIN_USERNAME || 'admin';
        const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
        const hashedPassword = await bcrypt.hash(adminPassword, 10);

        await pool.query(
            'INSERT INTO users ("Nombre", "Contrasena", "Rol") VALUES ($1, $2, $3)',
            [adminUsername, hashedPassword, 'admin']
        );

        console.log('✅ Usuario administrador creado exitosamente');
        console.log(`   Usuario: ${adminUsername}`);
        
        await pool.end();
        
    } catch (error) {
        console.error('❌ Error creando administrador:', error.message);
        
        // Si la tabla no existe, es normal en el primer deploy
        if (error.message.includes('relation "users" does not exist')) {
            console.log('ℹ️  La tabla users será creada automáticamente al iniciar la aplicación');
            process.exit(0);
        }
        
        process.exit(1);
    }
}

// Ejecutar solo si se llama directamente
if (import.meta.url === `file://${process.argv[1]}`) {
    createAdmin();
}

export default createAdmin;
