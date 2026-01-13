import { execSync } from 'child_process';
import path from 'path';
import { pool } from './db';

async function migrate() {
    console.log('Starting migration from SQLite (zoo.db) to PostgreSQL (Neon) using CLI...');

    const tables = [
        'zoo_info', 'cages', 'animals', 'employees', 'doctors',
        'events', 'tickets', 'ticket_sales', 'visitors',
        'inventory', 'medical_checks', 'vaccinations', 'users'
    ];

    for (const table of tables) {
        console.log(`⏳ Migrating table: ${table}...`);

        try {
            // Check if SQLite file exists
            const sqlitePath = path.resolve(__dirname, '../../zoo.db');
            if (!require('fs').existsSync(sqlitePath)) {
                console.error(`❌ SQLite database not found at ${sqlitePath}`);
                break;
            }

            // Fetch all data from SQLite using CLI
            const jsonOutput = execSync(`sqlite3 -json "../../zoo.db" "SELECT * FROM ${table}"`, {
                cwd: __dirname,
                stdio: ['pipe', 'pipe', 'pipe']
            }).toString();

            if (!jsonOutput || jsonOutput.trim() === '' || jsonOutput.trim() === '[]') {
                console.log(`ℹ️ Table ${table} is empty or not found in SQLite, skipping.`);
                continue;
            }

            const rows = JSON.parse(jsonOutput);

            if (rows.length === 0) {
                console.log(`ℹ️ Table ${table} is empty, skipping.`);
                continue;
            }

            // Prepare PG insert
            const keys = Object.keys(rows[0]);
            const columns = keys.join(', ');
            const placeholders = keys.map((_, i) => `$${i + 1}`).join(', ');
            const insertQuery = `INSERT INTO ${table} (${columns}) VALUES (${placeholders}) ON CONFLICT DO NOTHING`;

            let successCount = 0;
            for (const row of rows) {
                const values = Object.values(row);
                await pool.query(insertQuery, values);
                successCount++;
            }
            console.log(`✅ Migrated ${successCount}/${rows.length} rows for ${table}`);
        } catch (err) {
            console.error(`❌ Error migrating ${table}:`, (err as Error).message);
        }
    }

    console.log('🏁 Migration process finished.');
    process.exit(0);
}

migrate().catch(err => {
    console.error('Migration failed:', err);
    process.exit(1);
});
