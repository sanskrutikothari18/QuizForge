const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const http = require('http');
const { Server } = require('socket.io');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST']
    }
});

// Save io on app to access it from routes/controllers
app.set('io', io);

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

// Socket connection management
io.on('connection', (socket) => {
    console.log(`[SOCKET] Client connected: ${socket.id}`);

    socket.on('join_room', ({ pin, username }) => {
        const roomName = `room_${pin}`;
        socket.join(roomName);
        socket.roomPin = pin;
        socket.username = username;
        console.log(`[SOCKET] User ${username} joined ${roomName}`);
        io.to(roomName).emit('player_connected', { username });
    });

    socket.on('disconnect', () => {
        console.log(`[SOCKET] Client disconnected: ${socket.id}`);
        if (socket.roomPin && socket.username) {
            io.to(`room_${socket.roomPin}`).emit('player_disconnected', { username: socket.username });
        }
    });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, '0.0.0.0', () => {
    console.log(`QuizForge server listening on port ${PORT}`);
});