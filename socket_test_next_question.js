const { io } = require('./client/node_modules/socket.io-client');
const server = 'http://localhost:5000';
const host = io(server, { transports: ['websocket'] });
const guest = io(server, { transports: ['websocket'] });
let pin;
let started = false;

host.on('connect', () => {
  console.log('HOST connected', host.id);
  host.emit('create_room', { username: 'Host1' }, (resp) => {
    console.log('HOST create_room', resp);
    pin = resp.pin;
    if (guest.connected) joinGuest();
  });
});

guest.on('connect', () => {
  console.log('GUEST connected', guest.id);
  if (pin) joinGuest();
});

function joinGuest() {
  guest.emit('join_room', { pin, username: 'Player1' }, (resp) => {
    console.log('GUEST join_room', resp);
    setTimeout(() => {
      host.emit('start_quiz', (resp2) => {
        console.log('HOST start_quiz', resp2);
      });
    }, 500);
  });
}

host.on('question_started', (data) => {
  console.log('HOST question_started', data.question.questionText);
  if (!started) {
    started = true;
    setTimeout(() => {
      host.emit('next_question', (resp) => {
        console.log('HOST next_question response', resp);
      });
    }, 2000);
  }
});

host.on('question_ended', (data) => {
  console.log('HOST question_ended');
});

host.on('timer_update', (data) => {
  console.log('HOST timer_update', data.timeLeft);
});

guest.on('question_started', (data) => {
  console.log('GUEST question_started', data.question.questionText);
});

guest.on('question_ended', (data) => {
  console.log('GUEST question_ended');
});

setTimeout(() => {
  host.disconnect();
  guest.disconnect();
  process.exit(0);
}, 10000);
