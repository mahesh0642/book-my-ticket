import pg from "pg";

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL || "postgres://parth:postgres@127.0.0.1:5435/postgress-seats",
  ssl: process.env.DATABASE_URL ? { rejectUnauthorized: false } : false
});

export default pool;