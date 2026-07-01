const express = require('express');
const router = express.Router();
const {
    createGame,
    joinGame,
    startQuestion,
    submitAnswer,
    getLeaderboard,
    endGame,
    getGame
} = require('../controllers/gameController');
const { protect } = require('../middleware/authMiddleware');

router.post('/join', joinGame);
router.post('/answer', submitAnswer);
router.get('/:pin/leaderboard', getLeaderboard);
router.get('/:pin', getGame);
router.post('/create', protect, createGame);
router.post('/startquestion', protect, startQuestion);
router.post('/end', protect, endGame);

module.exports = router;