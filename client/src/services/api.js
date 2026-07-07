import axios from 'axios';
import toast from 'react-hot-toast';

const getBaseURL = () => {
  const hostname = window.location.hostname;
  const isLocal = hostname === 'localhost' || hostname.match(/^\d+\.\d+\.\d+\.\d+$/) || hostname.endsWith('.local');
  
  if (!isLocal) {
    if (hostname === 'fourisequiz.com' || hostname.endsWith('.fourisequiz.com')) {
      return 'https://api.fourisequiz.com';
    }
    return '/api';
  }
  return `http://${hostname}:5000`;
};

const API = axios.create({
  baseURL: getBaseURL(),
  headers: {
    'Content-Type': 'application/json',
    'ngrok-skip-browser-warning': 'true',
    'Bypass-Tunnel-Reminder': 'true'
  },
});

// Request interceptor to attach JWT token
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors globally
API.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message || 'Something went wrong';
    
    // Auto-logout if token is expired/invalid (401 Unauthorized)
    if (error.response?.status === 401 && localStorage.getItem('token')) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      toast.error('Session expired. Please login again.');
      window.location.href = '/login';
    }
    
    return Promise.reject(error);
  }
);

export default API;
