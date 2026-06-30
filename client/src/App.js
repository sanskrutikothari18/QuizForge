import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useAuth } from './context/AuthContext';

// Host Pages
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import CreateQuizPage from './pages/CreateQuizPage';
import HostGamePage from './pages/HostGamePage';
import HostControlPage from './pages/HostControlPage';

// Player Pages
import ScanPage from './pages/ScanPage';
import PlayerJoinPage from './pages/PlayerJoinPage';
import WaitingRoomPage from './pages/WaitingRoomPage';
import QuestionPage from './pages/QuestionPage';
import LeaderboardPage from './pages/LeaderboardPage';
import FinalResultPage from './pages/FinalResultPage';

const ProtectedRoute = ({ children }) => {
    const { user, loading } = useAuth();
    if (loading) return <div className="loading">Loading...</div>;
    if (!user) return <Navigate to="/login" />;
    return children;
};

function App() {
    return (
        <BrowserRouter>
            <Toaster
                position="top-center"
                toastOptions={{
                    style: {
                        background: 'rgba(26,26,46,0.95)',
                        color: '#fff',
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: '12px',
                        fontFamily: 'Poppins, sans-serif'
                    }
                }}
            />
            <Routes>
                {/* Public */}
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />

                {/* Player Routes */}
                <Route path="/scan" element={<ScanPage />} />
                <Route path="/join/:pin" element={<PlayerJoinPage />} />
                <Route path="/waiting/:pin" element={<WaitingRoomPage />} />
                <Route path="/question" element={<QuestionPage />} />
                <Route path="/leaderboard" element={<LeaderboardPage />} />
                <Route path="/finalresult" element={<FinalResultPage />} />

                {/* Host Routes */}
                <Route path="/dashboard" element={
                    <ProtectedRoute><DashboardPage /></ProtectedRoute>
                } />
                <Route path="/create-quiz" element={
                    <ProtectedRoute><CreateQuizPage /></ProtectedRoute>
                } />
                <Route path="/host/:pin" element={
                    <ProtectedRoute><HostGamePage /></ProtectedRoute>
                } />
                <Route path="/host-control/:pin" element={
                    <ProtectedRoute><HostControlPage /></ProtectedRoute>
                } />
            </Routes>
        </BrowserRouter>
    );
}

export default App;