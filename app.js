import express from 'express';
import database from "./database/database.js"
import dotenv from'dotenv';
import userRoutes from './route/userRoute.js';
import blogRoutes from "./route/blogRoute.js"
import loginRoutes from "./route/authRoute.js"

dotenv.config();
database();

const app = express();
app.use(express.json());
app.use('/api/users', userRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api', loginRoutes);

// Error handling middleware (this MUST be the last thing)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    error: {
      message: err.message || "Internal Server Error"
    }
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default  app;
