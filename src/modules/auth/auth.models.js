import pool from "../../common/db/db.js";

function createUsersTable() {
    const query = `CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`;
pool.query(query).then((res) => {
            console.log("Users table created or already exists.");
        }).catch((err) => {
            console.error("Error creating users table:", err);
        });
}

export async function createUsers(name, email, hashedPassword) {
    const query = `
        INSERT INTO users (name, email, password_hash) 
        VALUES ($1, $2, $3) 
        RETURNING id, name, email
    `;
    try {
        const res = await pool.query(query, [name, email, hashedPassword]);
        return res.rows[0]; 
    } catch (err) {
        console.error("Error creating user:", err);
        throw err;
    }
}

export async function getUserByEmail(email) {
    const query = `SELECT * FROM users WHERE email = $1`;
    try {
        const res = await pool.query(query, [email]);
        return res.rows[0]; 
    } catch (err) {
        console.error("Error fetching user by email:", err);
        throw err; 
    }
}

createUsersTable();

export default pool;