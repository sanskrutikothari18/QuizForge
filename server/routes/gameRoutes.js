const express = require('express');
const router = express.Router();
const {
    createGame,
    joinGame,
    startQuestion,
    submitAnswer,
    getLeaderboard,
    endGame,
    getGame,
    endQuestion,
    showLeaderboard
} = require('../config/controllers/gameController');
const { protect } = require('../middleware/authMiddleware');

router.post('/join', joinGame);
router.post('/answer', submitAnswer);
router.get('/:pin/leaderboard', getLeaderboard);
router.get('/:pin', getGame);
router.post('/create', protect, createGame);
router.post('/startquestion', protect, startQuestion);
router.post('/end', protect, endGame);
router.post('/endquestion', protect, endQuestion);
router.post('/showleaderboard', protect, showLeaderboard);

module.exports = router;