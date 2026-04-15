import express from 'express';
import * as AuthController from './auth.controller.js';
import { loginDto } from './dto/login.dto.js';
import { registerDto } from './dto/register.dto.js';
import { authenticateToken } from './auth.middleware.js';
import pool from '../../common/db/db.js';

const router = express.Router();

router.post('/login', loginDto, AuthController.login);
router.post('/register', registerDto, AuthController.register);

// Protected booking routes (auth protected)
router.get('/seats', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query("select * from seats");
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch seats' });
  }
});

router.put('/:id/:name', authenticateToken, async (req, res) => {
  try {
    const id = req.params.id;
    const name = req.params.name;
    const conn = await pool.connect();
    await conn.query("BEGIN");
    const result = await conn.query("SELECT * FROM seats where id = $1 and isbooked = 0 FOR UPDATE", [id]);
    
    if (result.rowCount === 0) {
      await conn.query("ROLLBACK");
      conn.release();
      return res.status(400).json({ error: "Seat already booked" });
    }
    
    const updateResult = await conn.query("update seats set isbooked = 1, name = $2 where id = $1", [id, name]);
    await conn.query("COMMIT");
    conn.release();
    res.json(updateResult);
  } catch (ex) {
    console.error(ex);
    res.status(500).json({ error: 'Booking failed' });
  }
});

export default router;
