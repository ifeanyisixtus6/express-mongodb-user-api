import express from 'express';
import database from "./database/database.js"
import dotenv from 'dotenv';
import userRoutes from './route/userRoute.js';
import blogRoutes from "./route/blogRoute.js"
import loginRoutes from "./route/authRoute.js"


dotenv.config();
database();

const app = express();
app.use(express.json());
app.use('/api', userRoutes);
app.use('/api', blogRoutes);
app.use('/api', loginRoutes);

app.use((err, req, res, next) => {
  const status = err.status || 500;
  res.status(status).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default  app;
