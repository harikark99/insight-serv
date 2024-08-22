import { Pool } from 'pg';

const pool = new Pool({
  user: 'userName',
  host: 'localhost',
  database: 'DataBaseName',
  password: 'DatabasePassword',
  port: 5432,
});

export default pool;
