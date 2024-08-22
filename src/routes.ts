import express from 'express';
import pool from './db';

const router = express.Router();

// Projects Endpoints
// router.get('/projects', async (req, res) => {
//   const result = await pool.query('SELECT * FROM projects');
//   res.json(result.rows);
// });

router.get('/projects', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM projects');
    res.json(result.rows);
  } catch (error) {
    console.error('Error querying database:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/projects', async (req, res) => {
  const project_name  = req.body;
  //console.log(project_name.body);
  const result = await pool.query('INSERT INTO projects (project_name) VALUES ($1) RETURNING *', [project_name.body]);
  res.json(result.rows[0]);
});

router.put('/projects/:id', async (req, res) => {
  const { id } = req.params;
  const name = req.body;
  console.log(name)
  const result = await pool.query('UPDATE projects SET project_name = $1 WHERE id = $2 RETURNING *', [name.body, id]);
  res.json(result.rows[0]);
});

router.delete('/projects/:id', async (req, res) => {
  const { id } = req.params;
  await pool.query('DELETE FROM projects WHERE id = $1', [id]);
  res.sendStatus(204);
});


export default router;
