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

export const forgotPassword = async (email) => {
  const response = await API.post('/auth/forgot-password', { email });
  return response.data;
};

export const verifyOtp = async (email, otp) => {
  const response = await API.post('/auth/verify-otp', { email, otp });
  return response.data;
};

export const resetPassword = async (email, otp, password) => {
  const response = await API.post('/auth/reset-password', { email, otp, password });
  return response.data;
};
