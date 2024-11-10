import { Pool } from "pg";

const pool = new Pool({
    host: 'localhost',
    database: "postgres",
    user: 'postgres',
    password: "duy123",
    port: 5432
});

pool.connect()

export default pool;