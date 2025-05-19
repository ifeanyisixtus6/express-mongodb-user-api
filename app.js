const express = require('express');
const database = require("./database/database")
const dotenv = require('dotenv').config();
const userRoutes = require('./route/userRoute');

database();

const app = express();
app.use(express.json());
app.use('/api', userRoutes);


const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
