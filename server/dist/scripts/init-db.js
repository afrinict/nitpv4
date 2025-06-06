import { Pool } from 'pg';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcrypt';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const pool = new Pool({
    connectionString: 'postgresql://nitp-projectdb_owner:npg_1YOFitB7HXQV@ep-calm-cherry-a9xwxhnr-pooler.gwc.azure.neon.tech/nitp-projectdb?sslmode=require',
    ssl: {
        rejectUnauthorized: false
    }
});
async function initializeDatabase() {
    try {
        // Read the schema file
        const schemaPath = path.join(__dirname, '../db/schema.sql');
        const schema = fs.readFileSync(schemaPath, 'utf8');
        // Execute the schema
        await pool.query(schema);
        console.log('Database schema initialized successfully');
        // Create an admin user
        const adminPassword = 'admin123'; // You should change this in production
        const hashedPassword = await bcrypt.hash(adminPassword, 10);
        await pool.query(`INSERT INTO users (username, email, password, role, is_verified)
       VALUES ($1, $2, $3, $4, $5)
       ON CONFLICT (email) DO NOTHING`, ['admin', 'admin@nitp.org', hashedPassword, 'ADMINISTRATOR', true]);
        console.log('Admin user created successfully');
    }
    catch (error) {
        console.error('Error initializing database:', error);
        throw error;
    }
    finally {
        await pool.end();
    }
}
initializeDatabase().catch(console.error);
