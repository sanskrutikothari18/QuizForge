const test = require('node:test');
const assert = require('node:assert/strict');

const gameController = require('../controllers/gameController');

test('game controller exports the handlers used by the routes', () => {
  assert.equal(typeof gameController.createGame, 'function');
  assert.equal(typeof gameController.joinGame, 'function');
  assert.equal(typeof gameController.startQuestion, 'function');
  assert.equal(typeof gameController.submitAnswer, 'function');
  assert.equal(typeof gameController.getLeaderboard, 'function');
  assert.equal(typeof gameController.endGame, 'function');
  assert.equal(typeof gameController.getGame, 'function');
});
