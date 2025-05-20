import express from 'express';
import database from "./database/database.js"
import dotenv from'dotenv';
import userRoutes from './route/userRoute.js';

dotenv.config();
database();

const app = express();
app.use(express.json());
app.use('/api', userRoutes);


const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default  app;
