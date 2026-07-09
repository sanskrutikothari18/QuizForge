import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';

// Initialize Theme to prevent flicker
const savedTheme = localStorage.getItem('theme') || 'light';
if (savedTheme === 'light') {
  document.documentElement.classList.add('light');
} else {
  document.documentElement.classList.remove('light');
}

import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Pages
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import CreateQuiz from './pages/CreateQuiz';
import MyQuizzes from './pages/MyQuizzes';
import HostLobby from './pages/HostLobby';
import JoinGame from './pages/JoinGame';
import WaitingRoom from './pages/WaitingRoom';
import LiveQuiz from './pages/LiveQuiz';
import AnswerResult from './pages/AnswerResult';
import Leaderboard from './pages/Leaderboard';
import FinalResult from './pages/FinalResult';
import ResultsAnalytics from './pages/ResultsAnalytics';

import { ThemeProvider } from './context/ThemeContext';
import { GameProvider } from './context/GameContext';

const queryClient = new QueryClient();

function AnimatedRoutes() {
  const location = useLocation();
  
  // Hide Navbar & Footer during gameplay for full immersion
  const isGameplayView = [
    '/live', 
    '/waiting', 
    '/result/answer', 
    '/leaderboard', 
    '/final-result'
  ].some(path => location.pathname.startsWith(path));

  return (
    <div className="flex flex-col min-h-screen bg-background text-gray-200">
      {!isGameplayView && <Navbar />}
      <main className="flex-1 flex flex-col">
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/quiz/create" element={<CreateQuiz />} />
            <Route path="/quiz/my" element={<MyQuizzes />} />
            <Route path="/host/lobby/:pin" element={<HostLobby />} />
            <Route path="/join" element={<JoinGame />} />
            <Route path="/waiting/:pin" element={<WaitingRoom />} />
            <Route path="/live/:pin" element={<LiveQuiz />} />
            <Route path="/result/answer/:pin" element={<AnswerResult />} />
            <Route path="/leaderboard/:pin" element={<Leaderboard />} />
            <Route path="/final-result/:pin" element={<FinalResult />} />
            <Route path="/results/:sessionId" element={<ResultsAnalytics />} />
          </Routes>
        </AnimatePresence>
      </main>
      {!isGameplayView && <Footer />}
    </div>
  );
}

export default function App() {
  const [theme, setTheme] = React.useState(localStorage.getItem('theme') || 'dark');

  // Sync theme state when it changes (Navbar updates localStorage + html class)
  React.useEffect(() => {
    const observer = new MutationObserver(() => {
      const isLight = document.documentElement.classList.contains('light');
      setTheme(isLight ? 'light' : 'dark');
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  const isLight = theme === 'light';

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <GameProvider>
          <Router>
            <AnimatedRoutes />
            <Toaster
              position="top-right"
              toastOptions={{
                style: {
                  background: isLight ? '#faf8ff' : '#18181b',
                  color: isLight ? '#1e1840' : '#fff',
                  border: isLight
                    ? '1px solid rgba(139, 92, 246, 0.18)'
                    : '1px solid rgba(255, 255, 255, 0.08)',
                  boxShadow: isLight
                    ? '0 4px 16px rgba(109, 40, 217, 0.10)'
                    : '0 4px 16px rgba(0,0,0,0.4)',
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '14px',
                },
              }}
            />
          </Router>
        </GameProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
