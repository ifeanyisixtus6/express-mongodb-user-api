const express = require('express');
const database = require("./database/database")
const dotenv = require('dotenv').config();
const userRoutes = require('./route/userRoute');

database();

const app = express();
app.use(express.json());
app.use('/api', userRoutes);

// Error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
      error: 'Something went wrong!',
      message: err.message
    });
  });

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
