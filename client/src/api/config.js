import axios from 'axios';

const getBaseUrl = () => {
    if (import.meta.env.VITE_API_URL) {
        const url = import.meta.env.VITE_API_URL.replace(/\/$/, '');
        return url.endsWith('/api') ? url : `${url}/api`;
    }
    if (typeof window !== 'undefined' && window.location) {
        const { protocol, hostname } = window.location;
        if (hostname === 'localhost' || hostname === '127.0.0.1' || /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(hostname)) {
            return `${protocol}//${hostname}:5000/api`;
        }
    }
    return 'http://localhost:5000/api';
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