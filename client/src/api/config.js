import axios from 'axios';

const getBaseUrl = () => {
    if (import.meta.env.VITE_API_URL) {
        return import.meta.env.VITE_API_URL.replace(/\/$/, '');
    }
    if (typeof window !== 'undefined' && window.location) {
        const { protocol, hostname } = window.location;
        return `${protocol}//${hostname}:5000`;
    }
    return 'http://localhost:5000';
};

const API = axios.create({
    baseURL: getBaseUrl()
});

API.interceptors.request.use((req) => {
    const token = localStorage.getItem('token');
    if (token) {
        req.headers.Authorization = `Bearer ${token}`;
    }
    return req;
});

export default API;