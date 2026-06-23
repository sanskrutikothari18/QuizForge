const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const PORT = process.env.PORT || 5000;
const MAX_PLAYERS = 5;
const MAX_HUMANS = 5;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'QuizForge server is running!' });
});

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

const QUESTIONS = [
  {
    id: 1,
    questionText: 'Which programming language is known as the language of the web?',
    options: ['Python', 'C++', 'JavaScript', 'Java'],
    correctAnswerIndex: 2,
  },
  {
    id: 2,
    questionText: 'What does HTML stand for?',
    options: [
      'HyperText Markup Language',
      'HighText Machine Language',
      'HyperTransfer Markup Language',
      'HyperText Markdown Language',
    ],
    correctAnswerIndex: 0,
  },
  {
    id: 3,
    questionText: 'Which CSS property is used to change the background color?',
    options: ['color', 'background-color', 'bgcolor', 'background-image'],
    correctAnswerIndex: 1,
  },
  {
    id: 4,
    questionText: 'What is the primary purpose of ReactJS?',
    options: ['Database management', 'Building user interfaces', 'Server-side scripting', 'Network security'],
    correctAnswerIndex: 1,
  },
  {
    id: 5,
    questionText: "Which HTTP status code represents a 'Not Found' error?",
    options: ['200', '404', '500', '301'],
    correctAnswerIndex: 1,
  },
];

const BOT_NAMES = ['Bot 1', 'Bot 2', 'Bot 3', 'Bot 4'];
const rooms = {};

function generatePIN() {
  // generate a unique 6-digit PIN
  let pin;
  do {
    pin = Math.floor(100000 + Math.random() * 900000).toString();
  } while (rooms[pin]);
  return pin;
}

function countHumanPlayers(room) {
  if (!room) return 0;
  return room.players.filter((player) => !player.isBot).length;
}

function removeBotSlots(room, slotsToFree = 1) {
  if (!room || slotsToFree <= 0) return;
  const bots = room.players.filter((player) => player.isBot);
  while (slotsToFree > 0 && bots.length > 0) {
    const botToRemove = bots.pop();
    room.players = room.players.filter((player) => player.socketId !== botToRemove.socketId);
    console.log(`[SERVER] removed bot ${botToRemove.username} to free slot for human player in room=${room.pin}`);
    slotsToFree -= 1;
  }
}

function clearRoomTimers(room) {
  if (!room) return;
  if (room.timerInterval) {
    clearInterval(room.timerInterval);
    room.timerInterval = null;
  }
  if (room.nextPhaseTimeout) {
    clearTimeout(room.nextPhaseTimeout);
    room.nextPhaseTimeout = null;
  }
  if (room.botFillTimeout) {
    clearTimeout(room.botFillTimeout);
    room.botFillTimeout = null;
  }
  if (room.botAnswerTimers) {
    room.botAnswerTimers.forEach((timer) => clearTimeout(timer));
    room.botAnswerTimers = [];
  }
}

function addDemoBots(room) {
  if (!room || room.status !== 'lobby') return;
  if (countHumanPlayers(room) >= MAX_HUMANS) return;

  const addedBots = [];
  let botIndex = 0;

  while (room.players.length < MAX_PLAYERS && botIndex < BOT_NAMES.length) {
    const botName = BOT_NAMES[botIndex];
    botIndex += 1;
    if (room.players.some((player) => player.username === botName)) continue;
    const botPlayer = {
      socketId: `bot_${botName.replace(' ', '_')}`,
      username: botName,
      score: 0,
      answered: false,
      selectedAnswerIndex: null,
      lastAnswerCorrect: false,
      pointsEarned: 0,
      isBot: true,
      correctAnswers: 0,
      responseTimes: [],
      fastestResponse: null,
    };
    room.players.push(botPlayer);
    addedBots.push(botName);
  }

  if (addedBots.length > 0) {
    console.log(`[SERVER] auto-added bots ${addedBots.join(', ')} to room=${room.pin}`);
    io.to(`room_${room.pin}`).emit('bot_joined', { bots: addedBots });
    broadcastPlayerList(room);
  }
}

function scheduleBotFill(room) {
  if (!room) return;
  // After 10 seconds in the lobby, add demo bots to reach MAX_PLAYERS
  room.botFillTimeout = setTimeout(() => {
    console.log(`[SERVER] bot fill timeout triggered for room=${room.pin}`);
    addDemoBots(room);
  }, 10000);
}

function scheduleBotAnswers(room) {
  if (!room || room.status !== 'question') return;
  room.botAnswerTimers = room.botAnswerTimers || [];
  const currentQuestion = room.questions[room.currentQuestionIndex];

  room.players
    .filter((player) => player.isBot && !player.answered)
    .forEach((bot) => {
      const delay = 500 + Math.floor(Math.random() * 4500);
      const timer = setTimeout(() => {
        if (!room || room.status !== 'question' || bot.answered) return;
        const correct = Math.random() < 0.7;
        const selectedIndex = correct
          ? currentQuestion.correctAnswerIndex
          : [...Array(currentQuestion.options.length).keys()].filter((i) => i !== currentQuestion.correctAnswerIndex)[
              Math.floor(Math.random() * (currentQuestion.options.length - 1))
            ];

        bot.selectedAnswerIndex = selectedIndex;
        bot.answered = true;
        bot.lastAnswerCorrect = correct;
        bot.pointsEarned = correct ? 10 : 0;
        if (correct) bot.score += 10;
        // record bot response time and correct count
        const now = Date.now();
        const respSec = room.questionStartTime ? Math.max(0, Math.round((now - room.questionStartTime) / 1000)) : Math.round(delay/1000);
        bot.responseTimes = bot.responseTimes || [];
        bot.responseTimes.push(respSec);
        bot.fastestResponse = bot.fastestResponse == null ? respSec : Math.min(bot.fastestResponse, respSec);
        if (correct) bot.correctAnswers = (bot.correctAnswers || 0) + 1;

        broadcastPlayerList(room);
        if (room.players.every((player) => player.answered)) {
          endQuestion(room);
        }
      }, delay);
      room.botAnswerTimers.push(timer);
    });
}

function getRoomForSocket(socketId) {
  return Object.values(rooms).find((room) =>
    room.players.some((player) => player.socketId === socketId),
  );
}

function cleanupRoom(pin) {
  const room = rooms[pin];
  if (!room) return;
  clearRoomTimers(room);
  if (room.cleanupTimeout) {
    clearTimeout(room.cleanupTimeout);
    room.cleanupTimeout = null;
  }
  delete rooms[pin];
}

function broadcastPlayerList(room) {
  console.log(`[SERVER] broadcastPlayerList room=${room.pin} players=${room.players.length} status=${room.status}`);
  io.to(`room_${room.pin}`).emit('player_list', {
    pin: room.pin,
    players: room.players.map((player) => ({
      username: player.username,
      // Do not expose live score changes while a question is active to
      // prevent incremental leaderboard leaks. Show score only when not in 'question'.
      score: room.status === 'question' ? undefined : player.score,
      isBot: !!player.isBot,
      isHost: player.socketId === room.hostId,
    })),
    hostSocketId: room.hostId,
    hostUsername: room.hostUsername,
    roomStatus: room.status,
    humanCount: countHumanPlayers(room),
  });
}

function endQuiz(room) {
  room.status = 'finished';

  const finalRanking = room.players
    .slice()
    .sort((a, b) => b.score - a.score)
    .map((player, idx) => ({
      username: player.username,
      score: player.score,
      rank: idx + 1,
      correctAnswers: player.correctAnswers || 0,
      accuracy: room.questions && room.questions.length ? Math.round(((player.correctAnswers || 0) / room.questions.length) * 100) : 0,
      fastestResponse: player.fastestResponse == null ? null : player.fastestResponse,
    }));

  io.to(`room_${room.pin}`).emit('quiz_ended', { finalRanking });

  if (room.timerInterval) {
    clearInterval(room.timerInterval);
    room.timerInterval = null;
  }
  if (room.nextPhaseTimeout) {
    clearTimeout(room.nextPhaseTimeout);
    room.nextPhaseTimeout = null;
  }

  room.cleanupTimeout = setTimeout(() => cleanupRoom(room.pin), 120000);
}

function endQuestion(room) {
  if (room.timerInterval) {
    clearInterval(room.timerInterval);
    room.timerInterval = null;
  }
  if (room.botAnswerTimers) {
    room.botAnswerTimers.forEach((timer) => clearTimeout(timer));
    room.botAnswerTimers = [];
  }

  room.status = 'leaderboard';
  const currentQuestion = room.questions[room.currentQuestionIndex];
  const correctAnswerIndex = currentQuestion.correctAnswerIndex;

  const answerStats = currentQuestion.options.map((_, index) =>
    room.players.reduce((count, player) => {
      if (player.answered && player.selectedAnswerIndex === index) {
        return count + 1;
      }
      return count;
    }, 0),
  );

  const leaderboard = room.players
    .slice()
    .sort((a, b) => b.score - a.score)
    .map((player, idx) => ({
      username: player.username,
      score: player.score,
      rank: idx + 1,
      lastAnswerCorrect: player.lastAnswerCorrect,
      pointsEarned: player.pointsEarned,
      correctAnswers: player.correctAnswers || 0,
      accuracy: room.questions && room.questions.length ? Math.round(((player.correctAnswers || 0) / room.questions.length) * 100) : 0,
      fastestResponse: player.fastestResponse == null ? null : player.fastestResponse,
    }));

  // Do NOT auto-advance to next question. Host must explicitly advance.
  // Provide clients with an indicator if this was the final question.
  const isLastQuestion = room.currentQuestionIndex + 1 >= room.questions.length;
  io.to(`room_${room.pin}`).emit('question_ended', {
    correctAnswerIndex,
    answerStats,
    leaderboard,
    players: room.players.map((player) => ({
      username: player.username,
      score: player.score,
      answered: player.answered,
      lastAnswerCorrect: player.lastAnswerCorrect,
      pointsEarned: player.pointsEarned,
    })),
    isLastQuestion,
  });
}

function startQuestion(room) {
  clearRoomTimers(room);
  room.status = 'question';
  room.questionDuration = 15;
  room.timeLeft = room.questionDuration;
  room.questionStartTime = Date.now();
  room.players.forEach((player) => {
    player.answered = false;
    player.selectedAnswerIndex = null;
    player.lastAnswerCorrect = false;
    player.pointsEarned = 0;
  });

  const currentQuestion = room.questions[room.currentQuestionIndex];
  console.log(`[SERVER] startQuestion room=${room.pin} index=${room.currentQuestionIndex}`);

  io.to(`room_${room.pin}`).emit('question_started', {
    question: {
      id: currentQuestion.id,
      questionText: currentQuestion.questionText,
      options: currentQuestion.options,
    },
    questionNumber: room.currentQuestionIndex + 1,
    totalQuestions: room.questions.length,
    timeLeft: room.timeLeft,
  });

  scheduleBotAnswers(room);

  if (room.timerInterval) {
    clearInterval(room.timerInterval);
  }

  room.timerInterval = setInterval(() => {
    if (!rooms[room.pin]) {
      clearInterval(room.timerInterval);
      return;
    }

    room.timeLeft -= 1;
    io.to(`room_${room.pin}`).emit('timer_update', { timeLeft: room.timeLeft });

    if (room.players.every((player) => player.answered)) {
      endQuestion(room);
      return;
    }

    if (room.timeLeft <= 0) {
      endQuestion(room);
    }
  }, 1000);
}

io.on('connection', (socket) => {
  socket.on('create_room', ({ username }, callback) => {
    console.log(`[SERVER] received create_room username=${username}`);
    const cleanName = String(username || '').trim();
    if (!cleanName) {
      callback?.({ success: false, error: 'Username is required.' });
      return;
    }

    const pin = generatePIN();
    const room = {
      pin,
      hostId: socket.id,
      hostUsername: cleanName,
      host: { socketId: socket.id, username: cleanName },
      players: [
        {
          socketId: socket.id,
          username: cleanName,
          score: 0,
          answered: false,
          selectedAnswerIndex: null,
          lastAnswerCorrect: false,
          pointsEarned: 0,
          isBot: false,
          correctAnswers: 0,
          responseTimes: [],
          fastestResponse: null,
        },
      ],
      questions: QUESTIONS,
      currentQuestionIndex: 0,
      status: 'lobby',
      timeLeft: 0,
      timerInterval: null,
      nextPhaseTimeout: null,
      cleanupTimeout: null,
      botFillTimeout: null,
      botAnswerTimers: [],
    };

    rooms[pin] = room;
    socket.join(`room_${pin}`);
    socket.roomPin = pin;
    socket.username = cleanName;
    socket.isHost = true;

    console.log(`[SERVER] room created pin=${pin} host=${cleanName} socket=${socket.id}`);
    callback?.({ success: true, pin, hostUsername: cleanName, role: 'host' });
    broadcastPlayerList(room);
    scheduleBotFill(room);
  });

  socket.on('join_room', ({ pin, username }, callback) => {
    console.log(`[SERVER] received join_room pin=${pin} username=${username}`);
    const cleanPin = String(pin || '').trim();
    const cleanName = String(username || '').trim();
    const room = rooms[cleanPin];

    if (!room) {
      callback?.({ success: false, error: 'Room not found.' });
      return;
    }
    if (room.status !== 'lobby') {
      callback?.({ success: false, error: 'Quiz already started. You cannot join.' });
      return;
    }
    const humanCount = countHumanPlayers(room);
    if (humanCount >= MAX_HUMANS) {
      console.log(`[SERVER] join_room failed pin=${cleanPin} username=${cleanName} reason=room full`);
      callback?.({ success: false, error: 'Room is full.' });
      return;
    }
    if (room.players.length >= MAX_PLAYERS) {
      removeBotSlots(room, 1);
    }
    if (!cleanName) {
      callback?.({ success: false, error: 'Username is required.' });
      return;
    }
    if (room.players.some((player) => player.username.toLowerCase() === cleanName.toLowerCase())) {
      callback?.({ success: false, error: 'Username already in use in this room.' });
      return;
    }

    const newPlayer = {
      socketId: socket.id,
      username: cleanName,
      score: 0,
      answered: false,
      selectedAnswerIndex: null,
      lastAnswerCorrect: false,
      pointsEarned: 0,
      isBot: false,
      correctAnswers: 0,
      responseTimes: [],
      fastestResponse: null,
    };

    room.players.push(newPlayer);
    socket.join(`room_${cleanPin}`);
    socket.roomPin = cleanPin;
    socket.username = cleanName;
    socket.isHost = false;

    console.log(`[SERVER] player joined pin=${cleanPin} username=${cleanName} socket=${socket.id}`);
    callback?.({ success: true, pin: cleanPin, username: cleanName, hostSocketId: room.hostId, role: 'player' });
    broadcastPlayerList(room);
  });

  socket.on('start_quiz', (payloadOrCallback, maybeCallback) => {
    const callback = typeof payloadOrCallback === 'function' ? payloadOrCallback : maybeCallback;
    console.log(`[SERVER] received start_quiz socket=${socket.id}`);
    const room = getRoomForSocket(socket.id);
    if (!room) {
      callback?.({ success: false, error: 'Room not found.' });
      return;
    }
    if (room.hostId !== socket.id) {
      callback?.({ success: false, error: 'Only the host can start the quiz.' });
      return;
    }
    if (room.status !== 'lobby') {
      callback?.({ success: false, error: 'Quiz has already started.' });
      return;
    }

    clearRoomTimers(room);
    room.currentQuestionIndex = 0;
    console.log(`[SERVER] host ${socket.username} starting quiz in room=${room.pin}`);
    startQuestion(room);
    callback?.({ success: true });
  });

  socket.on('submit_answer', ({ answerIndex }, callback) => {
    console.log(`[SERVER] received submit_answer socket=${socket.id} answerIndex=${answerIndex}`);
    const room = getRoomForSocket(socket.id);
    if (!room || room.status !== 'question') {
      callback?.({ success: false, error: 'No active question to answer.' });
      return;
    }

    const player = room.players.find((playerData) => playerData.socketId === socket.id);
    if (!player) {
      callback?.({ success: false, error: 'Player not found in room.' });
      return;
    }
    if (player.answered) {
      callback?.({ success: false, error: 'Answer already submitted.' });
      return;
    }

    const selectedIndex = Number(answerIndex);
    const currentQuestion = room.questions[room.currentQuestionIndex];
    const isCorrect = selectedIndex === currentQuestion.correctAnswerIndex;

    // compute points based on speed: remaining time ratio * 10 (min 1)
    const now = Date.now();
    const elapsedSec = room.questionStartTime ? (now - room.questionStartTime) / 1000 : 0;
    const remainingSec = Math.max(0, (room.questionDuration || 15) - Math.floor(elapsedSec));
    let points = 0;
    if (isCorrect) {
      points = Math.max(1, Math.round((remainingSec / (room.questionDuration || 15)) * 10));
    }

    player.selectedAnswerIndex = selectedIndex;
    player.answered = true;
    player.lastAnswerCorrect = isCorrect;
    player.pointsEarned = points;
    player.answerTimestamp = now;
    // record response time and correct counts
    const respSec = room.questionStartTime ? Math.max(0, Math.round((now - room.questionStartTime) / 1000)) : 0;
    player.responseTimes = player.responseTimes || [];
    player.responseTimes.push(respSec);
    player.fastestResponse = player.fastestResponse == null ? respSec : Math.min(player.fastestResponse, respSec);
    if (isCorrect) player.correctAnswers = (player.correctAnswers || 0) + 1;
    if (isCorrect) {
      player.score += points;
    }

    callback?.({ success: true, isCorrect, points });
    broadcastPlayerList(room);

    // Do not emit intermediate leaderboard snapshots. Server will send a single
    // finalized leaderboard when the question ends to avoid partial rankings.

    if (room.players.every((playerData) => playerData.answered)) {
      endQuestion(room);
    }
  });

  socket.on('end_quiz', (payloadOrCallback, maybeCallback) => {
    const callback = typeof payloadOrCallback === 'function' ? payloadOrCallback : maybeCallback;
    console.log(`[SERVER] received end_quiz socket=${socket.id}`);
    const room = getRoomForSocket(socket.id);
    if (!room) {
      callback?.({ success: false, error: 'Room not found.' });
      return;
    }
    if (room.hostId !== socket.id) {
      callback?.({ success: false, error: 'Only the host can end the quiz.' });
      return;
    }
    endQuiz(room);
    callback?.({ success: true });
  });

  socket.on('next_question', (payloadOrCallback, maybeCallback) => {
    const callback = typeof payloadOrCallback === 'function' ? payloadOrCallback : maybeCallback;
    console.log(`[SERVER] received next_question socket=${socket.id}`);
    const room = getRoomForSocket(socket.id);
    if (!room) {
      callback?.({ success: false, error: 'Room not found.' });
      return;
    }
    if (room.hostId !== socket.id) {
      callback?.({ success: false, error: 'Only the host can advance to the next question.' });
      return;
    }
    if (room.status !== 'leaderboard') {
      callback?.({ success: false, error: 'Not currently viewing leaderboard.' });
      return;
    }

    if (room.currentQuestionIndex + 1 >= room.questions.length) {
      endQuiz(room);
      callback?.({ success: true, finished: true });
      return;
    }

    room.currentQuestionIndex += 1;
    console.log(`[SERVER] host ${socket.username} advancing to question ${room.currentQuestionIndex + 1} in room=${room.pin}`);
    startQuestion(room);
    callback?.({ success: true });
  });

  socket.on('disconnect', () => {
    console.log(`[SERVER] socket disconnect socket=${socket.id} username=${socket.username || 'unknown'}`);
    const room = getRoomForSocket(socket.id);
    if (!room) {
      return;
    }

    const leavingPlayer = room.players.find((player) => player.socketId === socket.id);
    room.players = room.players.filter((player) => player.socketId !== socket.id);

    if (socket.id === room.hostId) {
      console.log(`[SERVER] host disconnected, closing room=${room.pin}`);
      io.to(`room_${room.pin}`).emit('room_closed', { message: 'Host has left. Room is closed.' });
      cleanupRoom(room.pin);
      return;
    }

    if (room.players.length === 0) {
      cleanupRoom(room.pin);
      return;
    }

    broadcastPlayerList(room);
    io.to(`room_${room.pin}`).emit('player_disconnected', {
      username: leavingPlayer?.username || 'A player',
    });
  });
});

server.listen(PORT, () => {
  console.log(`QuizForge server listening on port ${PORT}`);
});
