const dns = require('dns');
dns.setServers(['8.8.8.8', '1.1.1.1']);
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();

// middleware
app.use(cors());
app.use(express.json());

// routes
const authRoutes = require('./routes/authRoutes');
const gameRoutes = require('./routes/gameRoutes');
const quizRoutes = require('./routes/quizRoutes');
const resultRoutes = require('./routes/resultRoutes');

// use routes
app.use('/api/auth', authRoutes);
app.use('/api/game', gameRoutes);
app.use('/api/quiz', quizRoutes);
app.use('/api/results', resultRoutes);

// test route
app.get('/', (req, res) => {
  res.send('Server is running successfully 🚀');
});

// connect DB + start server
const PORT = process.env.PORT || 5000;

const mongoUri = process.env.MONGO_URI;

if (!mongoUri) {
  console.warn('MONGO_URI is not set. Starting without MongoDB connection.');
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
} else {
  mongoose.connect(mongoUri)
    .then(() => {
      console.log('MongoDB connected');

      app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
      });
    })
    .catch((err) => {
      console.error('DB connection error:', err.message);
      app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
      });
    });
}