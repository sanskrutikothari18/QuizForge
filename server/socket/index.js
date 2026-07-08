const GameSession = require('../models/GameSession');

module.exports = (io) => {

    io.on('connection', (socket) => {
        console.log(`User connected: ${socket.id}`);

        // ─── HOST JOINS GAME ROOM ─────────────────
        socket.on('host-join', ({ pin }) => {
            socket.join(pin);
            console.log(`Host joined room: ${pin}`);
        });

        // ─── PLAYER JOINS GAME ROOM ───────────────
        socket.on('player-join', ({ pin, playerName }) => {
            socket.join(pin);
            console.log(`${playerName} joined room: ${pin}`);

            // Tell host new player joined
            io.to(pin).emit('player-joined', {
                playerName,
                message: `${playerName} joined the game!`
            });
        });

        // ─── HOST STARTS QUESTION ─────────────────
        socket.on('question-started', ({ pin, question }) => {
            // Send question to ALL players in room
            io.to(pin).emit('show-question', {
                questionNumber: question.questionNumber,
                totalQuestions: question.totalQuestions,
                questionText: question.questionText,
                options: question.options,
                timeLimit: question.timeLimit,
                timeLimitMs: question.timeLimitMs,
                startTime: question.startTime
            });

            console.log(`Question ${question.questionNumber} started in room: ${pin}`);

            // Start timer on server side
            // After timeLimit seconds → end question automatically
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

                    // Send leaderboard to ALL in room
                    io.to(pin).emit('show-leaderboard', {
                        questionNumber: question.questionNumber,
                        totalQuestions: question.totalQuestions,
                        leaderboard: rankedPlayers,
                        isLastQuestion: question.questionNumber === question.totalQuestions
                    });

                    console.log(`Leaderboard sent for question ${question.questionNumber} in room: ${pin}`);

                } catch (error) {
                    console.log('Timer error:', error.message);
                }

            }, question.timeLimitMs);
        });

        // ─── PLAYER SUBMITTED ANSWER ──────────────
        socket.on('answer-submitted', async ({ pin, playerName, isCorrect, score }) => {
            try {
                const game = await GameSession.findOne({ pin });
                if (!game) return;

                const totalPlayers = game.players.length;
                const currentQIndex = game.currentQuestionIndex;

                // Count how many answered this question
                const answeredCount = game.players.filter(player =>
                    player.answers.some(a => a.questionIndex === currentQIndex)
                ).length;

                // Tell everyone someone answered
                io.to(pin).emit('player-answered', {
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

                    io.to(pin).emit('show-leaderboard', {
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
            // Tell ALL players to get ready for next question
            io.to(pin).emit('prepare-next-question', {
                message: 'Next question coming...'
            });

            console.log(`Next question triggered in room: ${pin}`);
        });

        // ─── GAME ENDED ───────────────────────────
        socket.on('game-ended', ({ pin, winner, finalLeaderboard }) => {
            // Tell ALL players game is over
            io.to(pin).emit('show-final-result', {
                winner,
                finalLeaderboard,
                message: 'Game Over!'
            });

            console.log(`Game ended in room: ${pin}`);
        });

        // ─── DISCONNECT ───────────────────────────
        socket.on('disconnect', () => {
            console.log(`User disconnected: ${socket.id}`);
        });
    });
};