import express from 'express';
import pool from './db';
import bcrypt from 'bcrypt';
import jwt, { JsonWebTokenError, Secret } from 'jsonwebtoken';
import authenticateToken from './authenticateToken';


const router = express.Router();

// Projects Endpoints
// router.get('/projects', async (req, res) => {
//   const result = await pool.query('SELECT * FROM projects');
//   res.json(result.rows);
// });

router.post('/users/register', async (req, res) => {
    const { email, password } = req.body;
    console.log(email);
    console.log(password);
    try {
        // Validate and hash password
        const hashedPassword = await bcrypt.hash(password, 10);
        // Store user in the database
        const result = await pool.query(
            'INSERT INTO usertable (email, password) VALUES ($1, $2) RETURNING *',
            [email, hashedPassword]
        );
        res.status(201).json({ message: 'User registered successfully' });
    } catch (err) {
        console.error('Error registering user:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.post('/users/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const result = await pool.query('SELECT * FROM usertable WHERE email = $1', [email]);
        const user = result.rows[0];
        
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Generate JWT token
        //dotenv.config();
        const jwtSecret = process.env.JWT_SECRET;
        console.log(jwtSecret);
        const token = jwt.sign({ userId: user.id }, jwtSecret as string, { expiresIn: '1h' });
        res.json({ token });
    } catch (err) {
        console.error('Error logging in:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


router.get('/projects', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM projects');
    res.json(result.rows);
  } catch (error) {
    console.error('Error querying database:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/projects', authenticateToken, async (req, res) => {
  const project_name  = req.body;
  //console.log(project_name.body);
  const result = await pool.query('INSERT INTO projects (project_name) VALUES ($1) RETURNING *', [project_name.body]);
  res.json(result.rows[0]);
});

router.put('/projects/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  const name = req.body.name;
  const task_ids = req.body.tasks;
  console.log(name)
  const result = await pool.query('UPDATE projects SET project_name = $1, task_ids = $2 WHERE id = $3 RETURNING *', [name, task_ids, id]);
  res.json(result.rows[0]);
});

router.delete('/projects/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  await pool.query('DELETE FROM projects WHERE id = $1', [id]);
  res.sendStatus(204);
});

router.get('/projects/:id/tasks', authenticateToken, async(req, res) => {
    const { id } = req.params;
    const { rows } = await pool.query('SELECT task_ids FROM projects WHERE id = $1', [id]);
    const task_ids = rows[0].task_ids;
    if(!task_ids || task_ids.length === 0) {
        return res.json({error: "No Tasks in this project"});
    }
    const result = await pool.query('SELECT * FROM tasks WHERE id = ANY($1::int[])', [task_ids]);
    res.json(result.rows);
});

router.post('/projects/:id/tasks', authenticateToken, async(req, res) => {
    const { id } = req.params;
    const task_name = req.body.taskname;
    const result = await pool.query('INSERT INTO tasks (task_name, project_id) VALUES ($1, $2) RETURNING *', [task_name, id]);
    res.json(result.rows[0]);
})

router.put('/projects/tasks/:id', authenticateToken, async(req, res) => {
    const { id } = req.params;
    const task_name = req.body.taskname;
    const result = await pool.query('UPDATE tasks SET task_name = $1 WHERE id = $2 RETURNING *', [task_name, id]);
    res.json(result.rows[0]);
})

router.delete('/projects/tasks/:id', authenticateToken, async (req, res) => {
    const { id } = req.params;
    await pool.query('DELETE FROM tasks WHERE id = $1', [id]);
    res.sendStatus(204);
  });
export default router;
