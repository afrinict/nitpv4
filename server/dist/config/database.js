import { Pool } from 'pg';
const pool = new Pool({
    connectionString: 'postgresql://nitp-projectdb_owner:npg_1YOFitB7HXQV@ep-calm-cherry-a9xwxhnr-pooler.gwc.azure.neon.tech/nitp-projectdb?sslmode=require',
    ssl: {
        rejectUnauthorized: false
    }
});
// Test the connection
pool.connect((err, client, release) => {
    if (err) {
        console.error('Error connecting to the database:', err);
        return;
    }
    console.log('Successfully connected to the database');
    release();
});
export default pool;
