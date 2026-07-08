const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const http = require('http');
const { Server } = require('socket.io');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const app = express();

// Create HTTP server
const server = http.createServer(app);

// Create Socket.IO server
const io = new Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST']
    }
});

app.use(cors({
    origin: '*',
    credentials: true
}));

app.use(express.json());

// Make io accessible in controllers
app.set('io', io);

// Socket.IO events
require('./socket/index')(io);

// Routes
const authRoutes = require('./routes/authRoutes');
const quizRoutes = require('./routes/quizRoutes');
const gameRoutes = require('./routes/gameRoutes');
const resultRoutes = require('./routes/resultRoutes');

app.use('/auth', authRoutes);
app.use('/quiz', quizRoutes);
app.use('/game', gameRoutes);
app.use('/result', resultRoutes);

app.get('/', (req, res) => {
    res.send('QuizForge API is running...');
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, '0.0.0.0', () => {
    console.log(`QuizForge server listening on port ${PORT}`);
});