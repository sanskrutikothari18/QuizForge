const GameSession = require('../models/GameSession');
const Quiz = require('../models/Quiz');
const QRCode = require('qrcode');

const generatePIN = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

const calculateScore = (isCorrect, timeTaken, timeLimit) => {
    if (!isCorrect) return 0;
    const timeLimitMs = timeLimit * 1000;
    const timeRemaining = timeLimitMs - timeTaken;
    const baseScore = 1000;
    const timeBonus = Math.round((timeRemaining / timeLimitMs) * 1000);
    return baseScore + timeBonus;
};

const createGame = async (req, res) => {
    try {
        const { quizId } = req.body;

        if (!quizId) {
            return res.status(400).json({
                success: false,
                message: 'Please provide quiz ID'
            });
        }

        const quiz = await Quiz.findById(quizId);
        if (!quiz) {
            return res.status(404).json({
                success: false,
                message: 'Quiz not found'
            });
        }

        let pin;
        let pinExists = true;
        while (pinExists) {
            pin = generatePIN();
            const existing = await GameSession.findOne({ pin });
            if (!existing) pinExists = false;
        }

        const joinUrl = `http://localhost:3000/join/${pin}`;
        const qrCode = await QRCode.toDataURL(joinUrl);

        const gameSession = await GameSession.create({
            pin,
            qrCode,
            quizId,
            hostId: req.user.id,
            status: 'waiting',
            players: [],
            currentQuestionIndex: -1
        });

        res.status(201).json({
            success: true,
            message: 'Game created successfully',
            game: {
                id: gameSession._id,
                pin: gameSession.pin,
                qrCode: gameSession.qrCode,
                status: gameSession.status,
                quizTitle: quiz.title,
                totalQuestions: quiz.questions.length
            }
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const joinGame = async (req, res) => {
    try {
        const { pin, playerName } = req.body;

        if (!pin || !playerName) {
            return res.status(400).json({
                success: false,
                message: 'Please provide PIN and player name'
            });
        }

        const game = await GameSession.findOne({ pin });
        if (!game) {
            return res.status(404).json({
                success: false,
                message: 'Game not found. Check your PIN!'
            });
        }

        if (game.status !== 'waiting') {
            return res.status(400).json({
                success: false,
                message: 'Game has already started!'
            });
        }

        const nameExists = game.players.find(
            p => p.name.toLowerCase() === playerName.toLowerCase()
        );
        if (nameExists) {
            return res.status(400).json({
                success: false,
                message: 'This name is already taken!'
            });
        }

        game.players.push({
            name: playerName,
            totalScore: 0,
            answers: []
        });

        await game.save();

        res.status(200).json({
            success: true,
            message: `${playerName} joined successfully!`,
            game: {
                pin: game.pin,
                playerName: playerName,
                totalPlayers: game.players.length
            }
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const startQuestion = async (req, res) => {
    try {
        const { pin } = req.body;

        const game = await GameSession.findOne({ pin })
            .populate('quizId');

        if (!game) {
            return res.status(404).json({
                success: false,
                message: 'Game not found'
            });
        }

        if (game.hostId.toString() !== req.user.id) {
            return res.status(401).json({
                success: false,
                message: 'Only host can start questions'
            });
        }

        const nextIndex = game.currentQuestionIndex + 1;
        const quiz = game.quizId;

        if (nextIndex >= quiz.questions.length) {
            return res.status(400).json({
                success: false,
                message: 'No more questions!'
            });
        }

        const nextQuestion = quiz.questions[nextIndex];
        const questionStartTime = Date.now();

        game.currentQuestionIndex = nextIndex;
        game.questionStartTime = questionStartTime;
        game.status = 'active';
        await game.save();

        res.status(200).json({
            success: true,
            message: 'Question started',
            question: {
                questionIndex: nextIndex,
                questionNumber: nextIndex + 1,
                totalQuestions: quiz.questions.length,
                questionText: nextQuestion.questionText,
                options: nextQuestion.options,
                timeLimit: nextQuestion.timeLimit,
                timeLimitMs: nextQuestion.timeLimit * 1000,
                startTime: questionStartTime
            }
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const submitAnswer = async (req, res) => {
    try {
        const { pin, playerName, answerIndex } = req.body;

        const game = await GameSession.findOne({ pin })
            .populate('quizId');

        if (!game) {
            return res.status(404).json({
                success: false,
                message: 'Game not found'
            });
        }

        if (game.status !== 'active') {
            return res.status(400).json({
                success: false,
                message: 'Game is not active'
            });
        }

        const now = Date.now();
        const timeTaken = now - game.questionStartTime;

        const currentQuestion = game.quizId.questions[game.currentQuestionIndex];

        const timeLimitMs = currentQuestion.timeLimit * 1000;
        if (timeTaken > timeLimitMs) {
            return res.status(400).json({
                success: false,
                message: 'Time is up!'
            });
        }

        const isCorrect = answerIndex === currentQuestion.correctAnswer;
        const score = calculateScore(isCorrect, timeTaken, currentQuestion.timeLimit);

        const playerIndex = game.players.findIndex(
            p => p.name.toLowerCase() === playerName.toLowerCase()
        );

        if (playerIndex === -1) {
            return res.status(404).json({
                success: false,
                message: 'Player not found in this game'
            });
        }

        const alreadyAnswered = game.players[playerIndex].answers.find(
            a => a.questionIndex === game.currentQuestionIndex
        );

        if (alreadyAnswered) {
            return res.status(400).json({
                success: false,
                message: 'You already answered this question!'
            });
        }

        game.players[playerIndex].answers.push({
            questionIndex: game.currentQuestionIndex,
            answerIndex: answerIndex,
            isCorrect: isCorrect,
            timeTaken: timeTaken,
            score: score
        });

        game.players[playerIndex].totalScore += score;
        await game.save();

        res.status(200).json({
            success: true,
            isCorrect: isCorrect,
            correctAnswer: currentQuestion.correctAnswer,
            timeTaken: timeTaken,
            timeTakenSeconds: (timeTaken / 1000).toFixed(2),
            score: score,
            totalScore: game.players[playerIndex].totalScore,
            message: isCorrect ? 'Correct Answer! 🎉' : 'Wrong Answer! ❌'
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const getLeaderboard = async (req, res) => {
    try {
        const { pin } = req.params;

        const game = await GameSession.findOne({ pin });

        if (!game) {
            return res.status(404).json({
                success: false,
                message: 'Game not found'
            });
        }

        const rankedPlayers = [...game.players]
            .sort((a, b) => b.totalScore - a.totalScore)
            .map((player, index) => ({
                rank: index + 1,
                name: player.name,
                totalScore: player.totalScore,
                correctAnswers: player.answers.filter(a => a.isCorrect).length,
                totalAnswers: player.answers.length
            }));

        res.status(200).json({
            success: true,
            currentQuestion: game.currentQuestionIndex + 1,
            totalPlayers: game.players.length,
            leaderboard: rankedPlayers
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const endGame = async (req, res) => {
    try {
        const { pin } = req.body;

        const game = await GameSession.findOne({ pin });

        if (!game) {
            return res.status(404).json({
                success: false,
                message: 'Game not found'
            });
        }

        if (game.hostId.toString() !== req.user.id) {
            return res.status(401).json({
                success: false,
                message: 'Only host can end the game'
            });
        }

        const rankedPlayers = [...game.players]
            .sort((a, b) => b.totalScore - a.totalScore);

        const winner = rankedPlayers[0]?.name || '';

        rankedPlayers.forEach((player, index) => {
            const playerIndex = game.players.findIndex(
                p => p.name === player.name
            );
            game.players[playerIndex].rank = index + 1;
        });

        game.status = 'finished';
        game.winner = winner;
        await game.save();

        const finalLeaderboard = rankedPlayers.map((player, index) => ({
            rank: index + 1,
            name: player.name,
            totalScore: player.totalScore,
            correctAnswers: player.answers.filter(a => a.isCorrect).length,
            totalQuestions: player.answers.length
        }));

        res.status(200).json({
            success: true,
            message: 'Game ended successfully',
            winner: winner,
            finalLeaderboard: finalLeaderboard
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const getGame = async (req, res) => {
    try {
        const { pin } = req.params;

        const game = await GameSession.findOne({ pin })
            .populate('quizId', 'title questions')
            .populate('hostId', 'name email');

        if (!game) {
            return res.status(404).json({
                success: false,
                message: 'Game not found'
            });
        }

        res.status(200).json({
            success: true,
            game: {
                pin: game.pin,
                qrCode: game.qrCode,
                status: game.status,
                players: game.players,
                currentQuestion: game.currentQuestionIndex + 1,
                quiz: game.quizId,
                host: game.hostId,
                winner: game.winner
            }
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    createGame,
    joinGame,
    startQuestion,
    submitAnswer,
    getLeaderboard,
    endGame,
    getGame
};