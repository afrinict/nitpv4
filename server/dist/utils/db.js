import pool from '../config/database';
export const query = async (text, params) => {
    try {
        const start = Date.now();
        const res = await pool.query(text, params);
        const duration = Date.now() - start;
        console.log('Executed query', { text, duration, rows: res.rowCount });
        return res;
    }
    catch (error) {
        console.error('Error executing query:', error);
        throw error;
    }
};
export const getClient = async () => {
    const client = await pool.connect();
    return client;
};
