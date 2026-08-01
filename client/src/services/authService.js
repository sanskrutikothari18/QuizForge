import API from './api';

export const register = async (userData) => {
  const response = await API.post('/auth/register', userData);
  return response.data;
};

export const login = async (credentials) => {
  const response = await API.post('/auth/login', credentials);
  return response.data;
};

export const getProfile = async () => {
  const response = await API.get('/auth/profile');
  return response.data;
};

export const forgotPassword = async (emailData) => {
  const response = await API.post('/auth/forgot-password', emailData);
  return response.data;
};

export const verifyOtp = async (otpData) => {
  const response = await API.post('/auth/verify-otp', otpData);
  return response.data;
};

export const resetPassword = async (payload) => {
  const response = await API.post('/auth/reset-password', payload);
  return response.data;
};

