const { io } = require('./client/node_modules/socket.io-client');
const server='http://localhost:5000';
const host=io(server,{transports:['websocket']});
const guest=io(server,{transports:['websocket']});
let pin;
host.on('connect', () => {
  console.log('host connected', host.id);
  host.emit('create_room', { username: 'Host1' }, (resp) => {
    console.log('host create', resp);
    if (!resp?.success) {
      host.disconnect();
      guest.disconnect();
      process.exit(1);
      return;
    }
    pin = resp.pin;
    if (guest.connected) {
      joinGuest();
    }
  });
});

guest.on('connect', () => {
  console.log('guest connected', guest.id);
  if (pin) {
    joinGuest();
  }
});

function joinGuest() {
  guest.emit('join_room', { pin, username: 'Player1' }, (resp2) => {
    console.log('guest join', resp2);
    if (!resp2?.success) {
      host.disconnect();
      guest.disconnect();
      process.exit(1);
      return;
    }
    setTimeout(() => {
      host.emit('start_quiz', (startResp) => {
        console.log('startResp', startResp);
        host.disconnect();
        guest.disconnect();
        process.exit(0);
      });
    }, 500);
  });
}

host.on('player_list', (data) => console.log('HOST player_list', data));
guest.on('player_list', (data) => console.log('GUEST player_list', data));