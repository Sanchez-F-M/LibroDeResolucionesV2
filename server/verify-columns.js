import { pool } from './db/postgres-connection.js';

async function verifyColumns() {
  const client = await pool.connect();
  try {
    const result = await client.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'resolution' 
      ORDER BY ordinal_position;
    `);
    
    console.log('Columnas en la tabla resolution:');
    result.rows.forEach(row => {
      console.log(`- ${row.column_name} (${row.data_type})`);
    });
    
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    client.release();
    process.exit(0);
  }
}

verifyColumns();
