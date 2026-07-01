import API from './config';

export const createGameAPI = async (quizId) => {
    const res = await API.post('/game/create', { quizId });
    return res.data;
};

export const joinGameAPI = async (pin, playerName) => {
    const res = await API.post('/game/join', { pin, playerName });
    return res.data;
};

export const startQuestionAPI = async (pin) => {
    const res = await API.post('/game/startquestion', { pin });
    return res.data;
};

export const submitAnswerAPI = async (pin, playerName, answerIndex) => {
    const res = await API.post('/game/answer', { pin, playerName, answerIndex });
    return res.data;
};

export const getLeaderboardAPI = async (pin) => {
    const res = await API.get(`/game/${pin}/leaderboard`);
    return res.data;
};

export const endGameAPI = async (pin) => {
    const res = await API.post('/game/end', { pin });
    return res.data;
};

export const getGameAPI = async (pin) => {
    const res = await API.get(`/game/${pin}`);
    return res.data;
};