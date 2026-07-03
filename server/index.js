const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const http = require('http');
const { Server } = require('socket.io');
const connectDB = require('./config/db');
const setupSocket = require('./config/socketConfig');

dotenv.config();
connectDB();

const app = express();
const server = http.createServer(app);

// Initialize Socket.io
const io = new Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST'],
        credentials: true
    }
});

// Setup socket game logic
setupSocket(io);

app.use(cors({
    origin: '*',
    credentials: true
}));

app.use(express.json());

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