import apiFetch from './api';

export const getMissions = async (filters = {}) => {
  const queryParams = new URLSearchParams();
  if (filters.category) queryParams.append('category', filters.category);
  if (filters.difficulty) queryParams.append('difficulty', filters.difficulty);
  
  const queryString = queryParams.toString() ? `?${queryParams.toString()}` : '';
  return await apiFetch(`/missions${queryString}`);
};

export const getMissionById = async (id) => {
  return await apiFetch(`/missions/${id}`);
};

export const submitMission = async (id, answers) => {
  return await apiFetch(`/missions/${id}/submit`, {
    method: 'POST',
    body: JSON.stringify({ answers }),
  });
};
