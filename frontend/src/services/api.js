import { getAuthToken } from '../utils/auth';

const API_URL = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? 'https://cybershield-uqns.onrender.com/api' : 'http://localhost:5000/api');

const apiFetch = async (endpoint, options = {}) => {
  const token = getAuthToken();
  
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Something went wrong');
  }

  return data;
};

export default apiFetch;
