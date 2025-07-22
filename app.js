import express from 'express';
import database from "./database/database.js"
import dotenv from 'dotenv';
import userRoutes from './route/userRoute.js';
import blogRoutes from "./route/blogRoute.js"
import loginRoutes from "./route/authRoute.js"
import validateObjectId from './middleware/userMiddleware.js';

dotenv.config();
database();

const app = express();
app.use(express.json());
app.use('/api', userRoutes);
app.use('/api', blogRoutes);
app.use('/api', loginRoutes);
app.use(validateObjectId)

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default  app;
