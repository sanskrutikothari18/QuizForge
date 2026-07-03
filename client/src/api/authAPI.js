import API from './config';

export const registerAPI = async (name, email, password) => {
    const res = await API.post('/auth/register', { name, email, password });
    return res.data;
};

export const loginAPI = async (email, password) => {
    const res = await API.post('/auth/login', { email, password });
    return res.data;
};

export const getProfileAPI = async () => {
    const res = await API.get('/auth/profile');
    return res.data;
};