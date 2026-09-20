import api from './api';

export const getHistory = async () => {
  const response = await api.get('/users/me/history');
  return response.data;
};
