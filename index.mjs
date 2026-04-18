import express from "express";
import pg from "pg";
import dotenv from "dotenv";
import cors from "cors";
import { dirname } from "path";
import { fileURLToPath } from "url";
import authRoutes from "./src/modules/auth/auth.routes.js";

dotenv.config();

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
const port = process.env.PORT || 8080;

// ✅ Use DATABASE_URL (Neon / Render)
const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

app.use("/auth", authRoutes);

app.get("/code.html", (req, res) => {
  res.sendFile(__dirname + "/code.html");
});

// ✅ Book seat with transaction safety
app.put("/:id/:name", async (req, res) => {
  const { id, name } = req.params;
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const checkQuery =
      "SELECT * FROM seats WHERE id = $1 AND isbooked = 0 FOR UPDATE";
    const result = await client.query(checkQuery, [id]);

    if (result.rowCount === 0) {
      await client.query("ROLLBACK");
      return res.status(400).json({ error: "Seat already booked" });
    }

    const updateQuery =
      "UPDATE seats SET isbooked = 1, name = $2 WHERE id = $1";
    await client.query(updateQuery, [id, name]);

    await client.query("COMMIT");

    res.json({ success: true, message: "Seat booked successfully" });
  } catch (err) {
    await client.query("ROLLBACK");
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    client.release();
  }
});

app.listen(port, () => console.log(`Server running on port: ${port}`));
