import pg from "pg";

const pool = new pg.Pool({
  host: "localhost",
  port: 5433,
  user: "postgres",
  password: "postgres",
  database: "postgress-seats",
  ssl: false
});

export default pool;