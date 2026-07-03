import API from './config';

export const createQuizAPI = async (quizData) => {
    const res = await API.post('/quiz/create', quizData);
    return res.data;
};

export const getMyQuizzesAPI = async () => {
    const res = await API.get('/quiz/user/myquizzes');
    return res.data;
};

export const getQuizAPI = async (id) => {
    const res = await API.get(`/quiz/${id}`);
    return res.data;
};

export const deleteQuizAPI = async (id) => {
    const res = await API.delete(`/quiz/${id}`);
    return res.data;
};