const sampleQuestions = [
    {
        questionText: "What does HTML stand for?",
        options: ["Hyper Text Preprocessor", "Hyper Text Markup Language", "Hyper Text Multiple Language", "Hyper Tool Multi Language"],
        correctIndex: 1,
        timeLimit: 15
    },
    {
        questionText: "Which of the following is a CSS framework?",
        options: ["React", "Express", "Tailwind", "MongoDB"],
        correctIndex: 2,
        timeLimit: 15
    },
    {
        questionText: "What does MERN stand for?",
        options: ["MySQL, Express, React, Node", "MongoDB, Express, React, Node", "MongoDB, Express, Ruby, Node", "MongoDB, Ember, React, Node"],
        correctIndex: 1,
        timeLimit: 15
    }
];

const rooms = {};

const generatePin = () => {
    return Math.floor(1000 + Math.random() * 9000).toString();
};

const setupSocket = (io) => {
    io.on('connection', (socket) => {
        console.log(`[SOCKET] User connected: ${socket.id}`);

        // Helper to get room for current socket
        const getPlayerRoom = () => {
            return Object.values(rooms).find(room => 
                room.hostSocketId === socket.id || room.players.some(p => p.socketId === socket.id)
            );
        };

        const emitPlayerList = (room) => {
            io.to(room.pin).emit('player_list', {
                players: room.players,
                hostSocketId: room.hostSocketId,
                hostUsername: room.hostUsername,
                roomStatus: room.status
            });
        };

        socket.on('create_room', ({ username }, callback) => {
            try {
                let pin = generatePin();
                while (rooms[pin]) {
                    pin = generatePin();
                }

                rooms[pin] = {
                    pin,
                    hostSocketId: socket.id,
                    hostUsername: username,
                    status: 'lobby',
                    players: [],
                    currentQuestionIndex: -1,
                    questions: sampleQuestions,
                    answers: {}, // map of socketId -> answerIndex
                    timer: null,
                    timeLeft: 0
                };

                socket.join(pin);
                if (typeof callback === 'function') {
                    callback({ success: true, pin });
                }
                emitPlayerList(rooms[pin]);
            } catch (err) {
                console.error(err);
                if (typeof callback === 'function') {
                    callback({ success: false, error: 'Failed to create room' });
                }
            }
        });

        socket.on('join_room', ({ pin, username }, callback) => {
            const room = rooms[pin];
            if (!room) {
                return callback && callback({ success: false, error: 'Room not found' });
            }
            if (room.status !== 'lobby') {
                return callback && callback({ success: false, error: 'Game has already started' });
            }
            if (room.players.some(p => p.username === username) || room.hostUsername === username) {
                return callback && callback({ success: false, error: 'Username already taken in this room' });
            }
            
            room.players.push({
                socketId: socket.id,
                username: username,
                score: 0,
                lastAnswerCorrect: false
            });

            socket.join(pin);
            if (typeof callback === 'function') {
                callback({ success: true, pin });
            }
            emitPlayerList(room);
        });

        const endQuestion = (room) => {
            clearInterval(room.timer);
            room.status = 'leaderboard';
            const currentQ = room.questions[room.currentQuestionIndex];
            
            // Calculate stats
            const answerStats = new Array(currentQ.options.length).fill(0);
            
            Object.entries(room.answers).forEach(([sId, answerIndex]) => {
                answerStats[answerIndex]++;
                const player = room.players.find(p => p.socketId === sId);
                if (player) {
                    player.lastAnswerCorrect = (answerIndex === currentQ.correctIndex);
                    if (player.lastAnswerCorrect) {
                        player.score += 10;
                    }
                }
            });

            // Sort leaderboard
            room.players.sort((a, b) => b.score - a.score);
            const leaderboard = room.players.map((p, index) => ({
                username: p.username,
                score: p.score,
                lastAnswerCorrect: p.lastAnswerCorrect,
                rank: index + 1
            }));

            io.to(room.pin).emit('question_ended', {
                correctAnswerIndex: currentQ.correctIndex,
                answerStats,
                leaderboard
            });
        };

        const triggerQuestion = (room) => {
            const currentQ = room.questions[room.currentQuestionIndex];
            room.status = 'question';
            room.answers = {};
            room.timeLeft = currentQ.timeLimit;

            // Reset last answers
            room.players.forEach(p => p.lastAnswerCorrect = false);

            io.to(room.pin).emit('question_started', {
                question: {
                    questionText: currentQ.questionText,
                    options: currentQ.options
                },
                questionNumber: room.currentQuestionIndex + 1,
                totalQuestions: room.questions.length,
                timeLeft: room.timeLeft
            });

            clearInterval(room.timer);
            room.timer = setInterval(() => {
                room.timeLeft--;
                io.to(room.pin).emit('timer_update', { timeLeft: room.timeLeft });
                
                if (room.timeLeft <= 0) {
                    endQuestion(room);
                } else if (Object.keys(room.answers).length === room.players.length && room.players.length > 0) {
                    // Everyone answered early
                    endQuestion(room);
                }
            }, 1000);
        };

        socket.on('start_quiz', (callback) => {
            const room = getPlayerRoom();
            if (!room || room.hostSocketId !== socket.id) {
                return callback && callback({ success: false, error: 'Not authorized' });
            }
            if (room.players.length === 0) {
                return callback && callback({ success: false, error: 'Not enough players' });
            }
            
            room.currentQuestionIndex = 0;
            if (typeof callback === 'function') {
                callback({ success: true });
            }
            triggerQuestion(room);
        });

        socket.on('submit_answer', ({ answerIndex }, callback) => {
            const room = getPlayerRoom();
            if (!room || room.status !== 'question') {
                return callback && callback({ success: false, error: 'Not taking answers right now' });
            }
            if (room.answers[socket.id] !== undefined) {
                return callback && callback({ success: false, error: 'Already answered' });
            }
            
            room.answers[socket.id] = answerIndex;
            const currentQ = room.questions[room.currentQuestionIndex];
            const isCorrect = (answerIndex === currentQ.correctIndex);
            
            if (typeof callback === 'function') {
                callback({ success: true, isCorrect });
            }
        });

        socket.on('next_question', (callback) => {
            const room = getPlayerRoom();
            if (!room || room.hostSocketId !== socket.id) {
                return callback && callback({ success: false, error: 'Not authorized' });
            }

            room.currentQuestionIndex++;
            if (room.currentQuestionIndex >= room.questions.length) {
                room.status = 'final';
                room.players.sort((a, b) => b.score - a.score);
                const finalRanking = room.players.map((p, index) => ({
                    username: p.username,
                    score: p.score,
                    rank: index + 1
                }));
                io.to(room.pin).emit('quiz_ended', { finalRanking });
                
                // Cleanup room
                clearInterval(room.timer);
                delete rooms[room.pin];
            } else {
                triggerQuestion(room);
            }
            
            if (typeof callback === 'function') {
                callback({ success: true });
            }
        });

        socket.on('disconnect', () => {
            console.log(`[SOCKET] User disconnected: ${socket.id}`);
            const room = getPlayerRoom();
            if (!room) return;

            if (room.hostSocketId === socket.id) {
                if (room.players.length > 0) {
                    // Reassign host
                    const newHost = room.players.shift();
                    room.hostSocketId = newHost.socketId;
                    room.hostUsername = newHost.username;
                    io.to(room.pin).emit('host_changed', {
                        newHostSocketId: room.hostSocketId,
                        newHostUsername: room.hostUsername
                    });
                    emitPlayerList(room);
                } else {
                    // Room empty, delete it
                    clearInterval(room.timer);
                    delete rooms[room.pin];
                }
            } else {
                const playerIndex = room.players.findIndex(p => p.socketId === socket.id);
                if (playerIndex !== -1) {
                    const username = room.players[playerIndex].username;
                    room.players.splice(playerIndex, 1);
                    io.to(room.pin).emit('player_disconnected', { username });
                    emitPlayerList(room);
                    
                    // Check if everyone answered due to this disconnect
                    if (room.status === 'question' && Object.keys(room.answers).length >= room.players.length) {
                        endQuestion(room);
                    }
                }
            }
        });
    });
};

module.exports = setupSocket;
