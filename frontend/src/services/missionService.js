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

export const getUserProgress = async () => {
  return await apiFetch(`/missions/progress`);
};

export const getMissionResult = async (id) => {
  return await apiFetch(`/missions/${id}/result`);
};

export const getSimulation = async (id) => {
  return await apiFetch(`/missions/${id}/simulation`);
};

export const submitSimulation = async (id, decisions) => {
  return await apiFetch(`/missions/${id}/simulation/submit`, {
    method: 'POST',
    body: JSON.stringify({ decisions }),
  });
};
