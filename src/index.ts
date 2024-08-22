import express from 'express';
import cors from 'cors';
import routes from './routes';

const app = express();

app.use(cors());
app.use(express.json());
app.use('/api', routes);
// Define a root route
app.get('/', (req, res) => {
    res.send('Welcome to Insight Project Management');
});
  
const port = 4040;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
