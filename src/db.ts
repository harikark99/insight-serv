import { Pool } from 'pg';

const pool = new Pool({
  user: 'userDB',
  host: 'localhost',
  database: 'DBName',
  password: '******',
  port: 5432,
});

export default pool;
