// Configuración PostgreSQL para producción y desarrollo
import dbProxy, { initDatabase as initPostgresDatabase } from './postgres-connection.js'

let isInitialized = false

// Función para asegurar que la DB esté inicializada
async function ensureInitialized() {
  if (!isInitialized) {
    try {
      await initPostgresDatabase()
      isInitialized = true
      console.log('✅ Base de datos PostgreSQL inicializada correctamente')
    } catch (error) {
      console.error('❌ Error al inicializar PostgreSQL:', error)
      throw error
    }
  }
}

// Wrapper del dbProxy que inicializa automáticamente
const dbWrapper = {
  async query(query, params = []) {
    await ensureInitialized()
    return dbProxy.query(query, params)
  },

  async get(query, params = []) {
    await ensureInitialized()
    return dbProxy.get(query, params)
  },

  async all(query, params = []) {
    await ensureInitialized()
    return dbProxy.all(query, params)
  },

  async run(query, params = []) {
    await ensureInitialized()
    return dbProxy.run(query, params)
  },

  async exec(query) {
    await ensureInitialized()
    return dbProxy.exec(query)
  },

  async connect() {
    await ensureInitialized()
    return dbProxy.connect()
  },

  getPool() {
    return dbProxy.getPool()
  }
}

// Exportar el wrapper que auto-inicializa
export default dbWrapper
