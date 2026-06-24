import { useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';
import './App.css';

// Connect to server using the current host by default so other devices can join using host IP
const SERVER_URL = import.meta.env.VITE_SERVER_URL || `${window.location.protocol}//${window.location.hostname}:5000`;

function App() {
  const socketRef = useRef(null);
  const [screen, setScreen] = useState('home');
  const [username, setUsername] = useState('');
  const [pin, setPin] = useState('');
  const [quizTitle, setQuizTitle] = useState('');
  const [roomTitle, setRoomTitle] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [players, setPlayers] = useState([]);
  const [hostUsername, setHostUsername] = useState('');
  const [hostSocketId, setHostSocketId] = useState('');
  const [isHost, setIsHost] = useState(false);
  const [roomStatus, setRoomStatus] = useState('lobby');
  const [question, setQuestion] = useState(null);
  const [questionNumber, setQuestionNumber] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [selectedAnswerIndex, setSelectedAnswerIndex] = useState(null);
  const [correctAnswerIndex, setCorrectAnswerIndex] = useState(null);
  const [answerStats, setAnswerStats] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [finalRanking, setFinalRanking] = useState([]);

  useEffect(() => {
    const socket = io(SERVER_URL, { transports: ['websocket'] });
    socketRef.current = socket;

    socket.on('connect', () => {
      setMessage('Connected to QuizForge server');
      setError('');
    });

    socket.on('disconnect', () => {
      console.log('[CLIENT] disconnected from server');
      setMessage('Disconnected from server. Reload to reconnect.');
    });

    socket.on('connect_error', (error) => {
      console.error('[CLIENT] connect_error', error);
      setError('Unable to connect to QuizForge server.');
    });

    socket.on('connect_timeout', () => {
      console.error('[CLIENT] connect_timeout');
      setError('Connection to server timed out.');
    });

    socket.on('bot_joined', (data) => {
      console.log('[CLIENT] bot_joined', data);
      setMessage(`Bots joined: ${data.bots.join(', ')}`);
    });

    socket.on('player_list', (data) => {
      console.log('[CLIENT] player_list', data);
      setPlayers(data.players);
      setRoomTitle(data.title || 'QuizForge');
      setHostSocketId(data.hostSocketId);
      setHostUsername(data.hostUsername || 'Host');
      setRoomStatus(data.roomStatus);
      setIsHost(socket.id === data.hostSocketId);
    });

    socket.on('question_started', (data) => {
      setQuestion(data.question);
      setQuestionNumber(data.questionNumber);
      setTotalQuestions(data.totalQuestions);
      setTimeLeft(data.timeLeft);
      setSelectedAnswerIndex(null);
      setCorrectAnswerIndex(null);
      setAnswerStats([]);
      setLeaderboard([]);
      setScreen('question');
      setMessage('Answer now!');
    });

    socket.on('timer_update', (data) => {
      setTimeLeft(data.timeLeft);
    });

    socket.on('question_ended', (data) => {
      setCorrectAnswerIndex(data.correctAnswerIndex);
      setAnswerStats(data.answerStats);
      setLeaderboard(data.leaderboard);
      setScreen('leaderboard');
      setMessage('Question complete. Reviewing leaderboard...');
    });

    socket.on('quiz_ended', (data) => {
      setFinalRanking(data.finalRanking);
      setScreen('final');
      setMessage('Quiz complete! View final rankings.');
    });

    socket.on('host_changed', (data) => {
      setHostSocketId(data.newHostSocketId);
      setHostUsername(data.newHostUsername);
      setIsHost(socket.id === data.newHostSocketId);
      setMessage(`Host changed to ${data.newHostUsername}.`);
    });

    socket.on('player_disconnected', (data) => {
      setMessage(`${data.username} left the room.`);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const resetState = () => {
    setScreen('home');
    setUsername('');
    setPin('');
    setError('');
    setMessage('');
    setPlayers([]);
    setHostUsername('');
    setHostSocketId('');
    setIsHost(false);
    setRoomStatus('lobby');
    setQuestion(null);
    setQuestionNumber(0);
    setTotalQuestions(0);
    setTimeLeft(0);
    setSelectedAnswerIndex(null);
    setCorrectAnswerIndex(null);
    setAnswerStats([]);
    setLeaderboard([]);
    setFinalRanking([]);
  };

  const handleCreateRoom = () => {
    setError('');
    if (!username.trim()) {
      setError('Enter a username to create a room.');
      return;
    }
    if (!quizTitle.trim()) {
      setError('Enter a quiz title to create a room.');
      return;
    }
    if (!socketRef.current?.connected) {
      setError('Not connected to the server yet.');
      return;
    }
    console.log('[CLIENT] emit create_room', username.trim(), quizTitle.trim());
    socketRef.current.emit('create_room', { username: username.trim(), title: quizTitle.trim() }, (response) => {
      console.log('[CLIENT] create_room response', response);
      if (!response?.success) {
        setError(response?.error || 'Unable to create room.');
        return;
      }
      setPin(response.pin);
      setHostUsername(username.trim());
      setRoomTitle(response.title || quizTitle.trim());
      setMessage(`Quiz: ${response.title || quizTitle.trim()}`);
      setIsHost(true);
      setScreen('lobby');
      setMessage(`Room ${response.pin} created. Waiting for players...`);
    });
  };

  const handleJoinRoom = () => {
    setError('');
    if (!pin.trim() || !username.trim()) {
      setError('Enter both room PIN and username to join.');
      return;
    }
    if (!socketRef.current?.connected) {
      setError('Not connected to the server yet.');
      return;
    }
    console.log('[CLIENT] emit join_room', pin.trim(), username.trim());
    socketRef.current.emit(
      'join_room',
      { pin: pin.trim(), username: username.trim() },
      (response) => {
        console.log('[CLIENT] join_room response', response);
        if (!response?.success) {
          setError(response?.error || 'Unable to join room.');
          return;
        }
        setScreen('lobby');
        setMessage(`Joined room ${response.pin}. Waiting for host to start.`);
      },
    );
  };

  const handleStartQuiz = () => {
    setError('');
    if (!socketRef.current?.connected) {
      setError('Not connected to the server yet.');
      return;
    }
    console.log('[CLIENT] emit start_quiz');
    socketRef.current.emit('start_quiz', (response) => {
      console.log('[CLIENT] start_quiz response', response);
      if (!response?.success) {
        setError(response?.error || 'Unable to start quiz.');
      }
    });
  };

  const handleAnswer = (index) => {
    if (selectedAnswerIndex !== null || screen !== 'question') {
      return;
    }
    setSelectedAnswerIndex(index);
    console.log('[CLIENT] emit submit_answer', index);
    socketRef.current.emit('submit_answer', { answerIndex: index }, (response) => {
      console.log('[CLIENT] submit_answer response', response);
      if (!response?.success) {
        setError(response?.error || 'Unable to submit answer.');
        return;
      }
      setMessage(response.isCorrect ? 'Correct answer!' : 'Wrong answer.');
    });
  };

  const handleNextQuestion = () => {
    setError('');
    if (!socketRef.current?.connected) {
      setError('Not connected to the server.');
      return;
    }
    console.log('[CLIENT] emit next_question');
    socketRef.current.emit('next_question', (response) => {
      console.log('[CLIENT] next_question response', response);
      if (!response?.success) {
        setError(response?.error || 'Unable to advance to next question.');
        return;
      }
      setMessage('Advancing to next question...');
    });
  };

  const renderHome = () => (
    <div className="panel">
      <h1>QuizForge Multiplayer Demo</h1>
      <p>Create a room or join with a 6-digit PIN.</p>
      <div className="form-group">
        <label>Quiz Title</label>
        <input value={quizTitle} onChange={(event) => setQuizTitle(event.target.value)} placeholder="e.g. JavaScript Basics" />
      </div>
      <div className="form-group">
        <label>Username</label>
        <input value={username} onChange={(event) => setUsername(event.target.value)} placeholder="Your name" />
      </div>
      <div className="button-row">
        <button className="button primary" onClick={handleCreateRoom}>
          Create Room
        </button>
      </div>
      <div className="divider">OR</div>
      <div className="form-group">
        <label>Room PIN</label>
        <input value={pin} onChange={(event) => setPin(event.target.value)} placeholder="Enter 6-digit PIN" maxLength={6} />
      </div>
      <div className="button-row">
        <button className="button secondary" onClick={handleJoinRoom}>
          Join Room
        </button>
      </div>
    </div>
  );

  const renderLobby = () => (
    <div className="panel">
      <div className="room-header">
        <div>
          <h2>{roomTitle || 'QuizForge'}</h2>
          <p className="room-pin">{pin}</p>
        </div>
        <div className="status-chip">{roomStatus === 'lobby' ? 'Waiting' : roomStatus}</div>
      </div>
      <div className="info-row">
        <span>Host: {hostUsername}</span>
        <span>{players.length} / 5 players</span>
      </div>
      <h3>Participants</h3>
      <ul className="player-list">
        {players.map((player) => (
          <li key={player.username} className={player.username === hostUsername ? 'host-player' : ''}>
            <span>{player.username}</span>
            <span>{player.score} pts</span>
          </li>
        ))}
      </ul>
      <div className="button-row">
        {isHost ? (
          <button className="button primary" onClick={handleStartQuiz} disabled={players.length < 1 || roomStatus !== 'lobby'}>
            Start Quiz
          </button>
        ) : (
          <div className="hint">Waiting for the host to begin the quiz.</div>
        )}
      </div>
    </div>
  );

  const renderQuestion = () => (
    <div className="panel">
      <div className="room-header">
        <div>
          <h2>
            Question {questionNumber} / {totalQuestions}
          </h2>
          <p className="timer">Time left: {timeLeft}s</p>
        </div>
        <div className="status-chip">Live</div>
      </div>
      <div className="question-card">
        <p className="question-text">{question?.questionText}</p>
        <div className="answer-grid">
          {question?.options.map((option, index) => {
            const selected = selectedAnswerIndex === index;
            return (
              <button
                key={option}
                className={`answer-button ${selected ? 'selected' : ''}`}
                onClick={() => handleAnswer(index)}
                disabled={selectedAnswerIndex !== null}
              >
                <span>{String.fromCharCode(65 + index)}.</span> {option}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );

  const renderLeaderboard = () => (
    <div className="panel">
      <div className="room-header">
        <h2>Leaderboard</h2>
        <div className="status-chip">Review</div>
      </div>
      <div className="leaderboard-card">
        <div className="leaderboard-row header">
          <span>Rank</span>
          <span>Player</span>
          <span>Score</span>
          <span>Result</span>
        </div>
        {leaderboard.map((entry) => (
          <div key={entry.username} className="leaderboard-row">
            <span>{entry.rank}</span>
            <span>{entry.username}</span>
            <span>{entry.score}</span>
            <span>{entry.lastAnswerCorrect ? '+10' : '0'}</span>
          </div>
        ))}
      </div>
      <div className="answer-summary">
        <p>Correct answer: <strong>{correctAnswerIndex !== null ? String.fromCharCode(65 + correctAnswerIndex) : '-'}</strong></p>
        <div className="stats-grid">
          {answerStats.map((count, index) => (
            <div key={index} className="stat-card">
              <span>{String.fromCharCode(65 + index)}</span>
              <strong>{count}</strong>
              <small>selected</small>
            </div>
          ))}
        </div>
      </div>
      <div style={{ marginTop: 16 }}>
        {isHost ? (
          <button className="button primary" onClick={handleNextQuestion} disabled={roomStatus !== 'leaderboard'}>
            Next Question
          </button>
        ) : (
          <div className="hint">Waiting for the host to click "Next Question".</div>
        )}
      </div>
    </div>
  );

  const renderFinal = () => (
    <div className="panel">
      <div className="room-header">
        <h2>Final Rankings</h2>
        <div className="status-chip finished">Finished</div>
      </div>
      <div className="leaderboard-card">
        <div className="leaderboard-row header">
          <span>Rank</span>
          <span>Player</span>
          <span>Score</span>
        </div>
        {finalRanking.map((entry) => (
          <div key={entry.username} className="leaderboard-row">
            <span>{entry.rank}</span>
            <span>{entry.username}</span>
            <span>{entry.score}</span>
          </div>
        ))}
      </div>
      <div className="button-row">
        <button className="button secondary" onClick={resetState}>
          Return Home
        </button>
      </div>
    </div>
  );

  return (
    <div className="app-shell">
      {error && <div className="banner banner-error">{error}</div>}
      {message && <div className="banner banner-info">{message}</div>}
      {screen === 'home' && renderHome()}
      {screen === 'lobby' && renderLobby()}
      {screen === 'question' && renderQuestion()}
      {screen === 'leaderboard' && renderLeaderboard()}
      {screen === 'final' && renderFinal()}
    </div>
  );
}

export default App;
