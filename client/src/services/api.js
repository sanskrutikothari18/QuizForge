// client/src/api/config.js
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

if (!API_URL) {
    console.error('❌ VITE_API_URL is not defined!');
}

const API = axios.create({
    baseURL: API_URL
});

API.interceptors.request.use((req) => {
    const token = localStorage.getItem('token');
    if (token) {
        req.headers.Authorization = `Bearer ${token}`;
    }
    return req;
});

export default API;