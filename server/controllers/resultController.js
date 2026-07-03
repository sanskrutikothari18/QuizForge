const Result = require('../models/Result');
const GameSession = require('../models/GameSession');

const saveResult = async (req, res) => {
    try {
        const { sessionId } = req.body;

        const game = await GameSession.findById(sessionId)
            .populate('quizId');

        if (!game) {
            return res.status(404).json({
                success: false,
                message: 'Game session not found'
            });
        }

        const existingResult = await Result.findOne({ sessionId });
        if (existingResult) {
            return res.status(400).json({
                success: false,
                message: 'Result already saved'
            });
        }

        const sortedPlayers = [...game.players]
            .sort((a, b) => b.totalScore - a.totalScore);

        const playerResults = sortedPlayers.map((player, index) => ({
            name: player.name,
            totalScore: player.totalScore,
            correctAnswers: player.answers.filter(a => a.isCorrect).length,
            wrongAnswers: player.answers.filter(a => !a.isCorrect).length,
            rank: index + 1,
            answers: player.answers
        }));

        const result = await Result.create({
            sessionId: game._id,
            quizId: game.quizId._id,
            hostId: game.hostId,
            quizTitle: game.quizId.title,
            players: playerResults,
            winner: sortedPlayers[0]?.name || '',
            totalQuestions: game.quizId.questions.length
        });

        res.status(201).json({
            success: true,
            message: 'Result saved successfully',
            result: result
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const getResultBySession = async (req, res) => {
    try {
        const { sessionId } = req.params;

        const result = await Result.findOne({ sessionId })
            .populate('quizId', 'title category')
            .populate('hostId', 'name email');

        if (!result) {
            return res.status(404).json({
                success: false,
                message: 'Result not found'
            });
        }

        res.status(200).json({
            success: true,
            result: result
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const getMyResults = async (req, res) => {
    try {
        const results = await Result.find({ hostId: req.user.id })
            .populate('quizId', 'title category')
            .sort({ playedAt: -1 });

        res.status(200).json({
            success: true,
            count: results.length,
            results: results
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const getResultLeaderboard = async (req, res) => {
    try {
        const { sessionId } = req.params;

        const result = await Result.findOne({ sessionId });

        if (!result) {
            return res.status(404).json({
                success: false,
                message: 'Result not found'
            });
        }

        const leaderboard = result.players.map(player => ({
            rank: player.rank,
            name: player.name,
            totalScore: player.totalScore,
            correctAnswers: player.correctAnswers,
            wrongAnswers: player.wrongAnswers,
            totalAnswers: player.correctAnswers + player.wrongAnswers
        }));

        res.status(200).json({
            success: true,
            winner: result.winner,
            quizTitle: result.quizTitle,
            totalQuestions: result.totalQuestions,
            playedAt: result.playedAt,
            leaderboard: leaderboard
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    saveResult,
    getResultBySession,
    getMyResults,
    getResultLeaderboard
};