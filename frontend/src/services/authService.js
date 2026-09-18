import apiFetch from './api';
import { setAuthToken, removeAuthToken } from '../utils/auth';

// Register user
export const register = async (userData) => {
  const response = await apiFetch('/auth/register', {
    method: 'POST',
    body: JSON.stringify(userData),
  });
  
  if (response.token) {
    setAuthToken(response.token);
  }
  return response;
};

// Login user
export const login = async (userData) => {
  const response = await apiFetch('/auth/login', {
    method: 'POST',
    body: JSON.stringify(userData),
  });

  if (response.token) {
    setAuthToken(response.token);
  }
  return response;
};

// Get current user profile
export const getMe = async () => {
  const response = await apiFetch('/auth/me', {
    method: 'GET',
  });
  return response;
};

// Logout user
export const logout = () => {
  removeAuthToken();
};
