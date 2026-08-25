# QuizForge Handoff Documentation

This document is the operational and technical handoff guide for the QuizForge team. It describes the repository as it currently exists and is intended to help a new team install, run, test, deploy, and maintain the application.

## 1. Product Overview

QuizForge is a Kahoot-style real-time quiz platform. A registered user can create quizzes, host a live game, share a six-digit game PIN, and review results. Players join without an account, answer timed questions, and see per-question leaderboards and final rankings.

Primary capabilities:

- User registration, login, profile retrieval, and password recovery
- Quiz creation, editing, listing, retrieval, and deletion
- Host-created game sessions with a unique PIN and QR code
- Live player joining and room updates through Socket.IO
- Timed questions, answer submission, scoring, and leaderboards
- Persisted game results and host analytics
- Light/dark themed responsive React UI
- Export-oriented frontend dependencies for reports (`xlsx`, `jspdf`, `docx`)

## 2. Repository Layout

```text
QuizForge/
├── client/                  React + Vite frontend
│   ├── src/
│   │   ├── api/             Axios API configuration and API modules
│   │   ├── components/      Shared UI and landing-page components
│   │   ├── context/         Theme and live-game context providers
│   │   ├── pages/           Route-level screens
│   │   ├── services/        API, auth, game, quiz, result, and socket services
│   │   └── themes/          Theme definitions
│   ├── public/               Static assets, including avatars
│   └── package.json
├── server/                  Express + Socket.IO backend
│   ├── config/               MongoDB configuration
│   ├── controllers/          REST request handlers
│   ├── middleware/           JWT authentication middleware
│   ├── models/               Mongoose schemas
│   ├── routes/               REST route definitions
│   ├── socket/               Socket.IO event handlers
│   ├── tests/                Node test runner tests
│   ├── index.js              Active server entry point
│   └── .env.example          Backend environment template
├── postman/                 Postman workspace globals
├── package.json              Root convenience scripts
└── README.md
```

### Important entry-point note

Run the backend through `server/index.js` using `npm start` or `npm run dev`. `server/server.js` is deprecated, has different route prefixes, and must not be used as the application entry point.

## 3. Prerequisites

- Node.js compatible with the installed dependency versions
- npm
- MongoDB Atlas or a reachable MongoDB instance
- A browser for the client
- Redis is listed in the root dependencies and environment template, but the current active server setup does not initialize a Redis adapter. Treat Redis as a future scaling requirement, not a local prerequisite.

## 4. Local Setup

From the repository root:

```powershell
npm install
npm --prefix server install
npm --prefix client install
```

Create the environment files:

```powershell
Copy-Item server/.env.example server/.env
Copy-Item client/.env.example client/.env.local
```

Update `server/.env` with real values. For local development, set the client API URL to:

```text
VITE_API_URL=http://localhost:5000/api
```

Start both applications in one terminal:

```powershell
npm run dev:full
```

Or start them independently:

```powershell
npm --prefix server run dev
npm --prefix client run dev
```

Open `http://localhost:5173` in a browser. The backend health response is available at `http://localhost:5000/`.

The Vite client uses `--host`, so it can be opened from another device on the local network. When `VITE_API_URL` is omitted, the client derives the backend URL from the browser host for local/IP access.

## 5. Environment Variables

### Backend: `server/.env`

| Variable | Required | Purpose |
|---|---:|---|
| `PORT` | No | HTTP port; defaults to `5000`. |
| `HOST` | No | Bind host; defaults to `0.0.0.0`. |
| `MONGO_URI` | Yes | MongoDB connection string. |
| `JWT_SECRET` | Yes | Secret used to sign and verify login tokens. Use a strong private value. |
| `JWT_EXPIRE` | Yes | JWT lifetime, for example `7d`. |
| `FRONTEND_URL` | No | Intended frontend origin setting; current CORS code allows all origins. |
| `REDIS_URL` | No | Reserved for Redis/socket scaling; not currently consumed by the active server. |
| `EMAIL_HOST` | No | SMTP host for password-reset email. |
| `EMAIL_PORT` | No | SMTP port. |
| `EMAIL_USER` | No | SMTP username. |
| `EMAIL_PASS` | No | SMTP password or provider app password. |
| `EMAIL_FROM` | No | Sender displayed in reset emails. |

The active server validates `MONGO_URI`, `JWT_SECRET`, and `JWT_EXPIRE` at startup and exits if any is missing. The database connector first tries the configured MongoDB URI; if it cannot connect, it falls back to `mongodb-memory-server`. That fallback is for development only and does not persist data between restarts.

### Frontend: `client/.env.local`

| Variable | Required | Purpose |
|---|---:|---|
| `VITE_API_URL` | Recommended | Backend base URL. Use the `/api` suffix, for example `https://example.com/api`. |

Vite exposes only variables prefixed with `VITE_` to browser code. Do not put secrets in the client environment file.

## 6. Frontend Architecture

`client/src/App.jsx` owns the router and global providers:

- `QueryClientProvider` for React Query
- `ThemeProvider` for theme state
- `GameProvider` for live-game state
- React Router routes
- Animated route transitions and toast notifications

Main route groups:

| Route | Screen |
|---|---|
| `/` | Landing page |
| `/login`, `/register` | Authentication |
| `/forgot-password`, `/reset-password/:token` | Password recovery |
| `/dashboard` | User dashboard |
| `/quiz/create`, `/quiz/edit/:id`, `/quiz/my` | Quiz management |
| `/host/lobby/:pin` | Host lobby |
| `/join` | Player PIN entry |
| `/waiting/:pin` | Player waiting room |
| `/live/:pin` | Live question screen |
| `/result/answer/:pin` | Player answer result |
| `/leaderboard/:pin` | In-game leaderboard |
| `/final-result/:pin` | Final game result |
| `/results/:sessionId` | Persisted result analytics |

REST requests are configured in `client/src/api/config.js`. The client reads the JWT from `localStorage.token` and adds it as `Authorization: Bearer <token>` to Axios requests. Socket.IO is configured in `client/src/services/socketService.js` and connects to the backend host derived from `VITE_API_URL`.

## 7. Backend Architecture

The active server is `server/index.js`:

1. Loads environment variables and validates required values.
2. Connects to MongoDB.
3. Creates an HTTP server and attaches Socket.IO.
4. Mounts REST routes with both short and `/api` prefixes.
5. Starts on `PORT`, incrementing the port if it is already occupied.

Controllers contain business logic; routes only map HTTP methods and paths. Protected routes use `server/middleware/authMiddleware.js`, which verifies the Bearer JWT and loads the user into `req.user`.

## 8. REST API Reference

The client should normally use the `/api` prefix. The server also supports the equivalent short prefixes shown in parentheses.

### Authentication: `/api/auth` (`/auth`)

| Method | Path | Auth | Purpose |
|---|---|---:|---|
| `POST` | `/register` | No | Create a user account. |
| `POST` | `/login` | No | Authenticate and receive a JWT. |
| `GET` | `/profile` | Yes | Return the authenticated user profile. |
| `POST` | `/forgot-password` | No | Begin password recovery. |
| `POST` | `/verify-security-answer` | No | Verify the account security answer. |
| `POST` | `/reset-password` | No | Set a new password. |

### Quizzes: `/api/quiz` (`/quiz`)

| Method | Path | Auth | Purpose |
|---|---|---:|---|
| `GET` | `/list` | No | List active quizzes. |
| `GET` | `/user/myquizzes` | Yes | List quizzes owned by the user. |
| `GET` | `/:id` | No | Retrieve a quiz by ID. |
| `POST` | `/create` | Yes | Create a quiz. |
| `PUT` | `/:id` | Yes | Update an owned quiz. |
| `DELETE` | `/:id` | Yes | Delete an owned quiz. |

A quiz requires a title, at least one question, and four options per question. `correctAnswer` is a zero-based option index from `0` to `3`. Question time limits default to 60 seconds.

### Games: `/api/game` (`/game`)

| Method | Path | Auth | Purpose |
|---|---|---:|---|
| `POST` | `/create` | Yes | Create a waiting game session. |
| `POST` | `/join` | No | Join a game by PIN. |
| `GET` | `/:pin` | No | Retrieve a game session. |
| `GET` | `/:pin/leaderboard` | No | Retrieve the current leaderboard. |
| `POST` | `/startquestion` | Yes | Start the current question. |
| `POST` | `/answer` | No | Submit a player answer. |
| `POST` | `/endquestion` | Yes | End the current question. |
| `POST` | `/showleaderboard` | Yes | Publish/show the leaderboard. |
| `POST` | `/end` | Yes | End a game session. |

### Results: `/api/result` (`/result`)

`/api/results` is also mounted for compatibility.

| Method | Path | Auth | Purpose |
|---|---|---:|---|
| `POST` | `/save` | Yes | Persist a completed game result. |
| `GET` | `/my` | Yes | List results associated with the authenticated host. |
| `GET` | `/:sessionId` | No | Retrieve a saved result. |
| `GET` | `/:sessionId/leaderboard` | No | Retrieve the saved result leaderboard. |

### Images: `/api/images` (`/images`)

Image routes are mounted by the server and are used by quiz/background flows. Consult `server/routes/imageRoutes.js` and its handler before changing upload or image URL behavior.

## 9. Realtime Game Protocol

Socket.IO rooms use both the raw PIN and `room_<PIN>`. The client normally sends the `room_<PIN>` form while the server normalizes the room to the raw PIN and joins both rooms.

### Client-to-server events

- `host-join`: host joins a game room.
- `player-join`: player joins or reconnects; `playerName` identifies the player.
- `question-started`: broadcasts the current question and starts the server-side timer safety net.
- `answer-submitted`: notifies the room that a player answered and can trigger an immediate leaderboard when all players answered.
- `next-question`: asks clients to prepare the next question.
- `game-ended`: broadcasts final winner and leaderboard.
- `host-end-quiz`: marks the session finished and closes the room.

### Server-to-client events

- `show-question`
- `player-answered`
- `show-leaderboard`
- `prepare-next-question`
- `show-final-result`
- `quiz_ended`
- `show_final_result`
- `room_closed`
- `host_left`
- `player_connected`
- `player_disconnected`
- `player_list`
- `player-joined`

When changing a socket event, update both `server/socket/index.js` and `client/src/services/socketService.js` or the relevant page listeners. Use `removeListener` during component cleanup to avoid duplicate handlers after navigation.

## 10. Data Model Summary

- `User`: name, unique lowercase email, hashed password, password-reset fields, hashed security answer, and lockout tracking.
- `Quiz`: title, category, description, owner, active flag, optional background image, and embedded questions.
- `Question`: text, exactly four options, zero-based correct option index, time limit, and optional background image.
- `GameSession`: unique PIN, quiz/host references, QR code, players, waiting/active/finished status, current question index, winner, and background image.
- `Player`: name, avatar, total score, rank, join time, and embedded answers.
- `Result`: completed session and quiz references, host, title, player summaries, winner, question count, and play timestamp.

## 11. Testing and Quality Checks

Client lint and production build:

```powershell
npm --prefix client run lint
npm --prefix client run build
```

The server tests use Node's built-in test runner and are located in `server/tests`. The current `server/package.json` test script is only a placeholder and exits with an error. Run the existing test files directly:

```powershell
node --test server/tests/*.test.js
```

At the time of handoff, this command has one known failure: `server/tests/serverStartup.test.js` mocks `express` without a `Router` implementation, while the active startup path loads `imageRoutes.js`. The test therefore fails during module loading with `TypeError: express.Router is not a function`; update the mock before treating the backend test run as passing.

Before handoff or release, manually test this minimum flow:

1. Register and log in.
2. Create and edit a quiz with at least one four-option question.
3. Create a game and confirm a PIN is generated.
4. Join the game from a second browser/device.
5. Start a question, submit answers, verify the timer and leaderboard.
6. End the game and verify the saved result analytics page.
7. Test password recovery with and without SMTP configuration.

## 12. Deployment Notes

### Backend

Deploy the `server` directory as a Node service with `npm start`. Set all required backend environment variables in the hosting provider. Use a persistent MongoDB instance for any non-demo environment. Confirm the provider supports WebSocket upgrades for Socket.IO.

### Frontend

Deploy the `client` directory as a Vite static site. Build with `npm run build` and configure `VITE_API_URL` to the public backend URL ending in `/api`. The repository includes `client/vercel.json` for Vercel configuration; review it against the selected hosting setup before deployment.

### Security and production checklist

- Replace all example secrets and database credentials.
- Restrict CORS to approved frontend origins; the current active server allows all origins.
- Use HTTPS so browser clients can establish secure WebSocket connections.
- Confirm MongoDB network access rules and least-privilege database credentials.
- Configure SMTP credentials through the hosting provider's secret store.
- Add rate limiting and stronger validation before exposing authentication endpoints publicly.
- Do not commit `.env`, `.env.local`, database URIs, JWT secrets, or SMTP passwords.

## 13. Known Gaps and Recommended Next Work

- The server test script should be changed to run the Node test files automatically.
- The active Socket.IO server allows all origins and should use an allowlist in production.
- The Redis adapter dependencies and `REDIS_URL` are present but not wired into `server/index.js`; multi-instance realtime deployments will need this completed.
- REST request and response schemas are not formally documented or validated with an API contract. Add OpenAPI or equivalent schema documentation.
- The deprecated `server/server.js` creates entry-point confusion and should eventually be removed after confirming no external tooling depends on it.
- Add integration tests for authentication, quiz ownership, game scoring, result persistence, and socket event ordering.
- Add a health/readiness endpoint that reports database connectivity separately from process availability.

## 14. Ownership Guide

For a change, start in the layer that owns the behavior:

| Change area | Primary locations |
|---|---|
| Login or password recovery | `client/src/pages/Login.jsx`, auth services, `server/controllers/authController.js`, `server/routes/authRoutes.js` |
| Quiz form or CRUD | quiz pages/services, `server/controllers/quizController.js`, `server/models/Quiz.js` |
| Live room or scoring | game pages/context, `client/src/services/socketService.js`, `server/controllers/gameController.js`, `server/socket/index.js`, `server/models/GameSession.js` |
| Results and analytics | result pages/services, `server/controllers/resultController.js`, `server/models/Result.js` |
| Shared styling and theme | `client/src/App.css`, `client/src/index.css`, `client/src/context/ThemeContext.jsx`, `client/src/themes/index.js` |
| Deployment configuration | `client/vite.config.js`, `client/vercel.json`, environment files, hosting provider settings |

Keep frontend route behavior, REST prefixes, and Socket.IO event names synchronized when modifying cross-stack workflows.
