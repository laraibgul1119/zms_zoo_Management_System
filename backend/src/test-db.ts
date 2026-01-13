import { pool } from './db/db';
import { initDb } from './db/init';

async function testConnection() {
    console.log('Testing connection to PostgreSQL...');
    try {
        const res = await pool.query('SELECT NOW()');
        console.log('✓ Connection successful:', res.rows[0].now);

        console.log('Initializing database schema...');
        await initDb();
        console.log('✓ Schema initialized successfully');

        const tables = await pool.query(`
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public'
        `);
        console.log('Existing tables:', tables.rows.map(r => r.table_name).join(', '));

        process.exit(0);
    } catch (err) {
        console.error('✗ Connection failed:', err);
        process.exit(1);
    }
}

testConnection();
