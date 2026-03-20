require('dotenv').config();
const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// PostgreSQL connection
const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: 5432,
  ssl: { rejectUnauthorized: false }  // Required for Render PostgreSQL
});

// Create table if not exists
pool.query(`
  CREATE TABLE IF NOT EXISTS tasks (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255),
    completed BOOLEAN DEFAULT false
  )
`).then(() => console.log('DB connected & table ready'))
  .catch(err => console.error('DB connection error:', err));

// CRUD routes
app.get('/tasks', async (req, res) => {
  const result = await pool.query('SELECT * FROM tasks');
  res.json(result.rows);
});

app.post('/tasks', async (req, res) => {
  const { title, completed } = req.body;
  const result = await pool.query(
    'INSERT INTO tasks (title, completed) VALUES ($1, $2) RETURNING *',
    [title, completed ?? false]
  );
  res.json(result.rows[0]);
});

app.put('/tasks/:id', async (req, res) => {
  const { title, completed } = req.body;
  const result = await pool.query(
    'UPDATE tasks SET title=$1, completed=$2 WHERE id=$3 RETURNING *',
    [title, completed, req.params.id]
  );
  res.json(result.rows[0]);
});

app.delete('/tasks/:id', async (req, res) => {
  await pool.query('DELETE FROM tasks WHERE id=$1', [req.params.id]);
  res.json({ message: 'Task deleted' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));