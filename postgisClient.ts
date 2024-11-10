import { Pool } from "pg";

const pool = new Pool({
    host: 'localhost',
    database: "postgres",
    user: 'postgres',
    password: "duy123",
    port: 5432
});

pool.connect().then(() => {
    console.log("Connected to Postgres")
    pool.query("TRUNCATE TABLE geo.driver;")
    }
)
export default pool;