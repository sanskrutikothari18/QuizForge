import React, { createContext, useContext, useState } from 'react';

const GameContext = createContext();

export const GameProvider = ({ children }) => {
    const [pin, setPin] = useState('');
    const [playerName, setPlayerName] = useState('');
    const [currentQuestion, setCurrentQuestion] = useState(null);
    const [score, setScore] = useState(0);
    const [leaderboard, setLeaderboard] = useState([]);
    const [gameStatus, setGameStatus] = useState('waiting');
    const [qrCode, setQrCode] = useState('');
    const [questionNumber, setQuestionNumber] = useState(0);
    const [totalQuestions, setTotalQuestions] = useState(0);
    const [lastResult, setLastResult] = useState(null);

    const resetGame = () => {
        setPin('');
        setPlayerName('');
        setCurrentQuestion(null);
        setScore(0);
        setLeaderboard([]);
        setGameStatus('waiting');
        setQrCode('');
        setQuestionNumber(0);
        setTotalQuestions(0);
        setLastResult(null);
    };

    return (
        <GameContext.Provider value={{
            pin, setPin,
            playerName, setPlayerName,
            currentQuestion, setCurrentQuestion,
            score, setScore,
            leaderboard, setLeaderboard,
            gameStatus, setGameStatus,
            qrCode, setQrCode,
            questionNumber, setQuestionNumber,
            totalQuestions, setTotalQuestions,
            lastResult, setLastResult,
            resetGame
        }}>
            {children}
        </GameContext.Provider>
    );
};

export const useGame = () => useContext(GameContext);