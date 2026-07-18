const GameSession = require('../models/GameSession');

module.exports = (io) => {

    io.on('connection', (socket) => {
        console.log(`User connected: ${socket.id}`);

        // ─── HOST JOINS GAME ROOM ─────────────────
        // FIXED: rooms now use `room_${pin}` prefix to match gameController.js
        // which emits to io.to(`room_${pin}`)
        socket.on('host-join', ({ pin, rawPin }) => {
            // Support both old-style (bare pin) and new-style (room_pin) payloads
            const roomPin = rawPin || pin;
            const roomName = `room_${roomPin}`;
            socket.join(roomName);
            // Also store rawPin on socket for disconnect tracking
            socket.data.pin = roomPin;
            socket.data.role = 'host';
            console.log(`Host joined room: ${roomName}`);
        });

        // ─── PLAYER JOINS GAME ROOM ───────────────
        socket.on('player-join', ({ pin, rawPin, playerName }) => {
            const roomPin = rawPin || pin;
            const roomName = `room_${roomPin}`;
            socket.join(roomName);
            socket.data.pin = roomPin;
            socket.data.role = 'player';
            socket.data.name = playerName;
            console.log(`${playerName} joined room: ${roomName}`);

            // Notify everyone in room (host + other players) a new player joined
            io.to(roomName).emit('player_connected', {
                username: playerName,
                message: `${playerName} joined the game!`
            });
        });

        // ─── HOST STARTS QUESTION ─────────────────
        socket.on('question-started', ({ pin, question }) => {
            const roomName = `room_${pin}`;
            // Send question to ALL players in room
            io.to(roomName).emit('show-question', {
                questionNumber: question.questionNumber,
                totalQuestions: question.totalQuestions,
                questionText: question.questionText,
                options: question.options,
                timeLimit: question.timeLimit,
                timeLimitMs: question.timeLimitMs,
                startTime: question.startTime
            });

            console.log(`Question ${question.questionNumber} started in room: ${roomName}`);

            // Auto-end question after time limit (server-side safety net)
            setTimeout(async () => {
                try {
                    const game = await GameSession.findOne({ pin })
                        .populate('quizId');

                    if (!game || game.status !== 'active') return;

                    // Get leaderboard
                    const rankedPlayers = [...game.players]
                        .sort((a, b) => b.totalScore - a.totalScore)
                        .map((player, index) => ({
                            rank: index + 1,
                            name: player.name,
                            totalScore: player.totalScore,
                            correctAnswers: player.answers
                                .filter(a => a.isCorrect).length,
                            totalAnswers: player.answers.length
                        }));

                    io.to(roomName).emit('show-leaderboard', {
                        questionNumber: question.questionNumber,
                        totalQuestions: question.totalQuestions,
                        leaderboard: rankedPlayers,
                        isLastQuestion: question.questionNumber === question.totalQuestions
                    });

                    console.log(`Leaderboard sent for question ${question.questionNumber} in room: ${roomName}`);

                } catch (error) {
                    console.log('Timer error:', error.message);
                }

            }, question.timeLimitMs);
        });

        // ─── PLAYER SUBMITTED ANSWER ──────────────
        socket.on('answer-submitted', async ({ pin, playerName, isCorrect, score }) => {
            try {
                const roomName = `room_${pin}`;
                const game = await GameSession.findOne({ pin });
                if (!game) return;

                const totalPlayers = game.players.length;
                const currentQIndex = game.currentQuestionIndex;

                // Count how many answered this question
                const answeredCount = game.players.filter(player =>
                    player.answers.some(a => a.questionIndex === currentQIndex)
                ).length;

                // Tell everyone someone answered
                io.to(roomName).emit('player-answered', {
                    playerName,
                    answeredCount,
                    totalPlayers,
                    message: `${playerName} answered!`
                });

                // If ALL players answered → show leaderboard immediately
                if (answeredCount === totalPlayers) {
                    const rankedPlayers = [...game.players]
                        .sort((a, b) => b.totalScore - a.totalScore)
                        .map((player, index) => ({
                            rank: index + 1,
                            name: player.name,
                            totalScore: player.totalScore,
                            correctAnswers: player.answers
                                .filter(a => a.isCorrect).length,
                            totalAnswers: player.answers.length
                        }));

                    io.to(roomName).emit('show-leaderboard', {
                        leaderboard: rankedPlayers,
                        allAnswered: true
                    });
                }

            } catch (error) {
                console.log('Answer submitted error:', error.message);
            }
        });

        // ─── HOST MOVES TO NEXT QUESTION ─────────
        socket.on('next-question', ({ pin }) => {
            const roomName = `room_${pin}`;
            io.to(roomName).emit('prepare-next-question', {
                message: 'Next question coming...'
            });

            console.log(`Next question triggered in room: ${roomName}`);
        });

        // ─── GAME ENDED ───────────────────────────
        socket.on('game-ended', ({ pin, winner, finalLeaderboard }) => {
            const roomName = `room_${pin}`;
            io.to(roomName).emit('show-final-result', {
                winner,
                finalLeaderboard,
                message: 'Game Over!'
            });

            console.log(`Game ended in room: ${roomName}`);
        });

        // ─── DISCONNECT ───────────────────────────
        socket.on('disconnect', () => {
            console.log(`User disconnected: ${socket.id}`);
            const { name, pin, role } = socket.data;
            if (pin && role === 'player' && name) {
                const roomName = `room_${pin}`;
                io.to(roomName).emit('player_disconnected', { username: name });
            }
        });
    });
};