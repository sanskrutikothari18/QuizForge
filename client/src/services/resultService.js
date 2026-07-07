import API from './api';

export const saveResult = async (sessionId) => {
  const response = await API.post('/result/save', { sessionId });
  return response.data;
};

export const getMyResults = async () => {
  const response = await API.get('/result/my');
  return response.data;
};

export const getResultLeaderboard = async (sessionId) => {
  const response = await API.get(`/result/${sessionId}/leaderboard`);
  return response.data;
};

export const getResultBySession = async (sessionId) => {
  const response = await API.get(`/result/${sessionId}`);
  return response.data;
};
